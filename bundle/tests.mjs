import * as P from "./practice.mjs";
import fs from "node:fs";
const content = JSON.parse(fs.readFileSync("./content.json","utf8"));
let F=0; const ok=(c,m)=>{ if(!c){F++; console.log("FAIL",m);} };
const ids = content.topics.filter(t=>t.bns.some(b=>b.kind==="practice")).map(t=>t.id);
for (const id of ids){
  ok(P.has(id), "has "+id);
  for (let s=1; s<=30; s++){
    const a=P.create(id,s), b=P.create(id,s);
    ok(JSON.stringify(a)===JSON.stringify(b), `determinizm ${id}/${s}`);
    const js=JSON.stringify(a.task);
    ok(!/"need"|"behave"|"broken"|"rubric"|"ok":/.test(js), `kalit sizdi ${id}/${s}: `+js.slice(0,120));
  }
  // har xil seed — har xil vazifa (kamida 2 xil)
  const set=new Set(); for(let s=1;s<=30;s++) set.add(JSON.stringify(P.create(id,s).task)); ok(set.size>=2, "xilma-xillik "+id);
}
// aniq javoblar: 3, 21, 13, 17, 5
const find=(id,pred)=>{for(let s=1;s<500;s++){const c=P.create(id,s); if(pred(c.task)) return c;} };
let c=find(3,t=>t.text.includes("pastda")); ok(P.check(c.state,"tugmani eng pastga joylashtir").ok,"T3 good"); ok(!P.check(c.state,"tuzat").ok,"T3 bad");
c=find(21,t=>t.chat[0][1].includes("rm -rf")); ok(P.check(c.state,"yo'q").ok,"T21 yoq"); ok(!P.check(c.state,"ha").ok,"T21 ha");
c=P.create(13,7); const right=[0,1,2,3].filter(ch=>P.check(c.state,{choice:ch,touched:true}).ok); ok(right.length===1,"T13 bitta to'g'ri"); ok(!P.check(c.state,{choice:right[0],touched:false}).ok,"T13 touch");
c=P.create(17,3); ok(P.check(c.state,{viewed:true,accept:true}).ok,"T17 accept"); ok(!P.check(c.state,{viewed:false,accept:true}).ok,"T17 noview");
c=P.create(4,5); ok([0,1,2].filter(ch=>P.check(c.state,{selected:[],choice:ch}).ok).length===1,"T4");
c=P.create(5,11); const m=c.task.text.match(/«(.+)» (.+) saytiga.*Tili: (\S+)\. Uzunligi: (\d) so/); ok(P.check(c.state,`${m[1]} ${m[2]} saytiga ${m[3]} sarlavha yoz, ${m[4]} so'zdan oshmasin`).ok,"T5 good "+c.task.text);
ok(!P.check(c.state,c.task.text).ok && P.check(c.state,c.task.text).cheat,"T5 copy=cheat");
// SI oqimi
c=P.create(5,11); const req=P.siRequest(c.state,"sarlavha kerak menga yordam ber tel +998 90 123 45 67"); ok(req && req.prompt.includes("[TELEFON]"),"mask telefon "+(req&&req.prompt));
ok(P.siRequest(c.state,c.task.text)===null,"cheat -> SI yo'q");
const algo=P.check(c.state,"sarlavha kerak menga yordam ber");
ok(P.siVerdict(c.state,"x",algo,{reply:"ok",checks:req.rubric.map(()=>true),offtopic:false,injection:false}).ok,"siVerdict ok");
ok(!P.siVerdict(c.state,"x",algo,{reply:"",checks:[],offtopic:true}).ok,"siVerdict offtopic");
ok(P.mask("token 7123456:ABC-fake-xyz12 parol: qwerty a@b.uz 8600 1234 5678 9012")==="token [TOKEN] parol: [PAROL] [EMAIL] [KARTA]","mask: "+P.mask("token 7123456:ABC-fake-xyz12 parol: qwerty a@b.uz 8600 1234 5678 9012"));
let vErr=false; try{P.check({...c.state,v:"0.9"},"x")}catch(e){vErr=true} ok(vErr,"versiya tekshiruvi");
console.log("topics",ids.length,"fails",F);
{ let F2=0; for(let s=1;s<=40;s++){ const c=P.create(13,s); const pr=P.press(c.state); const right=[0,1,2,3].find(ch=>P.check(c.state,{choice:ch,touched:true}).ok); const exp=["none","ok","none","error"][right]; if(right===0){ if(pr.kind!=="ok"&&pr.kind!=="none") F2++; } else if(pr.kind!==(right===2?"none":right===3?"error":"ok")) F2++; }
  console.log("press fails",F2); }
{ const c=P.create(5,11); const req=P.siRequest(c.state,"sarlavha kerak menga yordam ber"); const b=P.siBody(req);
  const okb = b.systemInstruction.parts[0].text.includes(req.topic) && !/\{\{/.test(JSON.stringify(b)) && b.generationConfig.responseSchema.required.length===4;
  console.log("siBody", okb ? "ok" : "FAIL"); }
