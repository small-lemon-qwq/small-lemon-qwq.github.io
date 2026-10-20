const Fastify=require('fastify');
const cookie=require('@fastify/cookie');
const session=require('@fastify/session');
const{randomBytes,scrypt:cryptoScrypt,timingSafeEqual}=require('node:crypto');
const{promisify}=require('node:util');
const scrypt=promisify(cryptoScrypt);
const isProd=process.env.NODE_ENV==='production';
const db=require('./db');
let main_app=null;
function init(app){
  main_app=app;
  db.pragma('journal_mode=WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions(
      sid TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_expires
    ON sessions(expires_at);
  `);
  const findUser=db.prepare(`
    SELECT id,username,password_hash,password_salt
    FROM users WHERE username=?
  `);
  const createUser=db.prepare(`
    INSERT INTO users(username,password_hash,password_salt)
    VALUES(?,?,?) ON CONFLICT(username) DO NOTHING
  `);
  function validCredentials(username,password){
    return typeof username==='string'&&typeof password==='string'
      &&username.trim().length>0&&username.trim().length<=128
      &&password.length>0&&password.length<=1024;
  }
  const insert=db.prepare(`
    INSERT INTO sessions(sid,data,expires_at)
    VALUES(?,?,?)
    ON CONFLICT(sid)DO UPDATE SET
      data=excluded.data,
      expires_at=excluded.expires_at
  `);
  const select=db.prepare(`
    SELECT data FROM sessions
    WHERE sid=?AND expires_at>?
  `);
  const remove=db.prepare(`
    DELETE FROM sessions WHERE sid=?
  `);
  const cleanExpired=db.prepare(`
    DELETE FROM sessions WHERE expires_at<=?
  `);
  const sqliteStore={
    set(sid,data,callback){
      try{
        const expiresAt=data.cookie.expires.getTime();
        insert.run(sid,JSON.stringify(data),expiresAt);
        callback(null);
      }catch(err){
        callback(err);
      }
    },
    get(sid,callback){
      try{
        const row=select.get(sid,Date.now());
        callback(null,row?JSON.parse(row.data):null);
      }catch(err){
        callback(err);
      }
    },
    destroy(sid,callback){
      try{
        remove.run(sid);
        callback(null);
      }catch(err){
        callback(err);
      }
    }
  };
  cleanExpired.run(Date.now());
  const timer=setInterval(()=>{
    cleanExpired.run(Date.now());
  },60*60*1000);
  timer.unref();
  main_app.register(cookie);
  const secret=randomBytes(32).toString('hex');
  main_app.register(session,{
    secret,
    cookieName:'sid',
    store:sqliteStore,
    saveUninitialized:false,
    rolling:true,
    cookie:{
      path:'/',
      httpOnly:true,
      secure:isProd,
      sameSite:'lax',
      maxAge:7*24*60*60*1000
    }
  });
  main_app.post('/register',async(req,rep)=>{
    const{username,password}=req.body||{};
    if(!validCredentials(username,password)){
      return rep.code(400).send({error:'data error'});
    }
    const salt=randomBytes(16).toString('hex');
    const hash=await scrypt(password,salt,64);
    const result=createUser.run(username.trim(),hash.toString('hex'),salt);
    if(result.changes===0){
      return rep.code(409).send({error:'username already exists'});
    }
    return rep.code(201).send({message:'ok'});
  });
  main_app.post('/login',async(req,rep)=>{
    const{username,password}=req.body||{};
    if(!validCredentials(username,password)){
      return rep.code(400).send({
        error:'data error'
      });
    }
    const user=findUser.get(username.trim());
    if(!user?.password_hash||!user?.password_salt){
      return rep.code(401).send({
        error:'invalid username or password'
      });
    }
    const suppliedHash=await scrypt(password,user.password_salt,64);
    const storedHash=Buffer.from(user.password_hash,'hex');
    if(storedHash.length!==suppliedHash.length||
       !timingSafeEqual(suppliedHash,storedHash)){
      return rep.code(401).send({
        error:'invalid username or password'
      });
    }
    if(!user||storedHash.length!==suppliedHash.length||!timingSafeEqual(suppliedHash,storedHash)){
      return rep.code(401).send({
        error:'invalid username or password'
      });
    }
    await req.session.regenerate();
    req.session.set('user',{
      id:user.id,
      username:user.username
    });
    return{message:'ok'};
  });
  main_app.post('/logout',async(req,rep)=>{
    await req.session.destroy();
    rep.clearCookie('sid',{path:'/'});
    return{message:'ok'};
  });
  main_app.addHook('onClose',async()=>{
    clearInterval(timer);
    db.close();
  });
}
function query_uid(req){
  const user=req.session?.get('user');
  const uid=user?.id;
  return Number.isSafeInteger(uid)&&uid>0?uid:null;
}
module.exports={
	init,query_uid
};