const Database=require('better-sqlite3');
const db=new Database('./data/app.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 1000');
module.exports=db;