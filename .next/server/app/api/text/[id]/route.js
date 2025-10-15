"use strict";(()=>{var e={};e.id=267,e.ids=[267],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},6744:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{originalPathname:()=>y,patchFetch:()=>u,requestAsyncStorage:()=>l,routeModule:()=>d,serverHooks:()=>E,staticGenerationAsyncStorage:()=>p});var n=r(9303),i=r(8716),o=r(670),s=r(2561),c=e([s]);s=(c.then?(await c)():c)[0];let d=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/text/[id]/route",pathname:"/api/text/[id]",filename:"route",bundlePath:"app/api/text/[id]/route"},resolvedPagePath:"C:\\Users\\Parents\\Desktop\\Torba\\app\\api\\text\\[id]\\route.js",nextConfigOutput:"",userland:s}),{requestAsyncStorage:l,staticGenerationAsyncStorage:p,serverHooks:E}=d,y="/api/text/[id]/route";function u(){return(0,o.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:p})}a()}catch(e){a(e)}})},2561:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{DELETE:()=>o});var n=r(3114),i=e([n]);async function o(e,{params:t}){try{let{id:e}=t;return await (0,n.E7)(e),new Response(JSON.stringify({message:"Text entry deleted successfully"}),{status:200,headers:{"Content-Type":"application/json"}})}catch(e){return console.error("Error deleting text entry:",e),new Response(JSON.stringify({error:"Failed to delete text entry"}),{status:500,headers:{"Content-Type":"application/json"}})}}n=(i.then?(await i)():i)[0],a()}catch(e){a(e)}})},4191:(e,t,r)=>{r.a(e,async(e,a)=>{try{let s;r.d(t,{Z:()=>o});var n=r(8678),i=e([n]);async function o(){if(!s){if(!process.env.DATABASE_URL)throw Error("DATABASE_URL environment variable is not set");s=new n.Client({connectionString:process.env.DATABASE_URL}),await s.connect()}return s}n=(i.then?(await i)():i)[0],a()}catch(e){a(e)}})},3114:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.d(t,{E4:()=>s,E7:()=>u,T0:()=>c,hk:()=>o});var n=r(4191),i=e([n]);async function o(){try{let e=await (0,n.Z)(),t=`
      CREATE TABLE IF NOT EXISTS text_entries (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;await e.query(t),console.log("Database table initialized")}catch(e){throw console.error("Error initializing database table:",e.message),e}}async function s(e){try{let t=await (0,n.Z)(),r=`
      INSERT INTO text_entries (content) 
      VALUES ($1) 
      RETURNING id, content, created_at;
    `;return(await t.query(r,[e])).rows[0]}catch(e){throw console.error("Error saving text:",e.message),e}}async function c(){try{let e=await (0,n.Z)(),t=`
      SELECT id, content, created_at 
      FROM text_entries 
      ORDER BY created_at DESC;
    `;return(await e.query(t)).rows}catch(e){throw console.error("Error getting text entries:",e.message),e}}async function u(e){try{let t=await (0,n.Z)(),r=`
      DELETE FROM text_entries 
      WHERE id = $1;
    `;await t.query(r,[e]),console.log(`Text entry with id ${e} deleted successfully`)}catch(e){throw console.error("Error deleting text entry:",e.message),e}}n=(i.then?(await i)():i)[0],a()}catch(e){a(e)}})},9303:(e,t,r)=>{e.exports=r(517)}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[948],()=>r(6744));module.exports=a})();