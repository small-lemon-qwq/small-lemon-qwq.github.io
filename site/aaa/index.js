const Fastify=require('fastify');
const db=require('./db');
let app=Fastify({logger:true,trustProxy: true});
const user=require('./user')
user.init(app);
let listen=function(url,handler){
	app.get(url,async(req,res)=>{
		const uid=user.query_uid(req);
		const re=handler(req.body||{},uid);
		res.type(`${re.type}; charset=utf-8`);
		let re_str=`<!DOCTYPE html>
<html>
<head>
	<script>
		window.page_data=JSON.parse(atob(${btoa(JSON.stringify(re.body))}));
		console.log(window.page_data);
	</script>
</head>
<body>`;
		if(re.code==null){

		}else{
			re_str+=re.code;
		}
	});
};

app.listen({
  port:3000,
  host:'0.0.0.0'
}).catch(err=>{
  app.log.error(err);
  process.exit(1);
});
module.exports={
	app,listen
};