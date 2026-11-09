/* NAVI — 1-modul ilovasi. Dvigatel qoidalari: 12-fayl (V, O, T, QZ, X), Q-605, Q-607. Ma'lumot saqlanmaydi. */
const P = { NEED:2, HALT:3, MAXQ:5, REST_MIN:30, GOAL:40, STREAK_MIN:10, QUIZ_EVERY:100, QUIZ_N:5, QUIZ_MIN:10,
  XP_BN:3, XP_PRACTICE:5, XP_REVIEW:4, XP_QUIZ:10, FIRST_IVL:2, FIRE:0.5 };
const DAY = 864e5;
const ICON = {
  play:'<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="#fff"/></svg>',
  bolt:'<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  check:'<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  x:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  flame:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.4 1.3-4 2.5-5.2.3 1.6 1 2.7 2.2 3.2C11 8 11 5 12 2z" fill="var(--flame)"/></svg>',
  clock:'<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  repeat:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 13.7-5.6L20 9M20 4v5h-5M20 12a8 8 0 0 1-13.7 5.6L4 15M4 20v-5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  quiz:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  book:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 7h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};

/* ---------- holat (faqat xotirada) ---------- */
const S = { offset:0, day:1, xp:0, xpDay:{1:0}, streak:0, freeze:1, xpSinceQuiz:0, quizRetake:false,
  tp:{}, remedial:[], notes:[], tab:"path", sel:null, revSinceLesson:3 };
TOPICS.forEach(t => S.tp[t.id] = { learned:false, kpFails:{}, rest:0, due:0, ivl:0, reps:0, tries:0 });
const now = () => Date.now() + S.offset;
const learned = id => S.tp[id].learned;
const DEPS = Object.fromEntries(TOPICS.map(t=>[t.id, TOPICS.filter(u=>u.pre.includes(t.id)).map(u=>u.id)]));
const frontier = id => !learned(id) && BYID[id].pre.every(learned);
const resting = id => S.tp[id].rest > now();
const isPractice = (id,k) => !!BYID[id].bns[k].practice;
const pool = (id,k) => (CONTENT[id] && CONTENT[id].bns[k] && CONTENT[id].bns[k].pool) || [];
const lessonXP = id => BYID[id].bns.reduce((a,b)=>a+(b.practice?P.XP_PRACTICE:P.XP_BN),0);
function note(t){ S.notes.unshift(t); S.notes = S.notes.slice(0,5); }
function addXP(n){ n=Math.round(n); S.xp+=n; S.xpDay[S.day]=(S.xpDay[S.day]||0)+n; S.xpSinceQuiz+=Math.max(0,n); return n; }

/* ---------- vazifa paneli (V-1…V-10) ---------- */
function panel(){
  const tasks=[];
  const cand = TOPICS.filter(t=>frontier(t.id) && !resting(t.id))
    .sort((a,b)=>DEPS[b.id].length-DEPS[a.id].length || a.id-b.id);
  if(cand[0]){ tasks.push({kind:"lesson", id:cand[0].id});
    const other = cand.find(t=>t.b!==cand[0].b) || cand[1];
    if(other) tasks.push({kind:"lesson", id:other.id}); }
  S.remedial.slice(0,2).forEach(id=>tasks.push({kind:"remedial", id}));
  const due = TOPICS.filter(t=>learned(t.id) && S.tp[t.id].due<=now() && !S.remedial.includes(t.id));
  const compressed = due.filter(t=>!DEPS[t.id].some(d=>due.some(x=>x.id===d)));   // V-6: yuqori mavzu pastkisini yopadi
  compressed.sort((a,b)=>S.tp[a.id].due-S.tp[b.id].due).slice(0,2).forEach(t=>tasks.push({kind:"review", id:t.id}));
  const nLearned = TOPICS.filter(t=>learned(t.id)).length;
  if((S.xpSinceQuiz>=P.QUIZ_EVERY && nLearned>=3) || (S.quizRetake && !S.remedial.length)) tasks.push({kind:"quiz"});
  return tasks.slice(0,5);
}

/* ---------- ko'rinishlar ---------- */
const app = document.getElementById("app");
function el(html){const t=document.createElement("template");t.innerHTML=html.trim();return t.content}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a}
const pick=a=>a[Math.floor(Math.random()*a.length)];
function fmt(ms){const t=Math.max(0,Math.ceil(ms/1000)),m=Math.floor(t/60),x=t%60;return String(m).padStart(2,"0")+":"+String(x).padStart(2,"0")}
let tick=null;
function startTick(){clearInterval(tick);tick=setInterval(()=>{let any=false;document.querySelectorAll("[data-until]").forEach(e=>{const l=+e.dataset.until-now();e.textContent=fmt(l);if(l>0)any=true;});if(!any){clearInterval(tick);if(S.screen==="home")home();}},1000)}

function header(){
  const today=S.xpDay[S.day]||0, pct=Math.min(1,today/P.GOAL), C=2*Math.PI*15;
  return `<header class="hdr">
    <div class="brand">NAVI</div>
    <div class="stats">
      <span class="stat" title="Streak: ketma-ket kunlar">${ICON.flame}<b>${S.streak}</b>${S.freeze?'<i class="frz" title="Streak muzlatish: 1 ta (haftasiga 1)">+1</i>':''}</span>
      <span class="stat ring" title="Bugungi XP / kunlik maqsad">
        <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true"><circle cx="19" cy="19" r="15" fill="none" stroke="var(--line)" stroke-width="5"/>
        <circle cx="19" cy="19" r="15" fill="none" stroke="var(--ok)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}" transform="rotate(-90 19 19)"/></svg>
        <b>${today}<small>/${P.GOAL}</small></b></span>
      <span class="stat xp"><b>${S.xp}</b> XP</span>
    </div></header>`;
}
function tabs(){
  const T=[["path","Yo'l"],["graph","Graf"]];
  return `<nav class="tabs">${T.map(([k,l])=>`<button class="tab ${S.tab===k?'on':''}" data-tab="${k}">${l}</button>`).join("")}</nav>`;
}
function bindTabs(){app.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{S.tab=b.dataset.tab;S.sel=null;home();});}

function home(){
  S.screen="home";
  const body = S.tab==="path"?viewPath():viewGraph();
  app.replaceChildren(el(header()+tabs()+body));
  bindTabs();
  app.querySelectorAll("[data-task]").forEach(b=>b.onclick=()=>{const t=JSON.parse(b.dataset.task);
    if(t.kind==="quiz") startQuiz(); else startReview(t.id, t.kind==="remedial");});
  app.querySelectorAll("[data-node]").forEach(b=>b.onclick=()=>{
    const id=+b.dataset.node;
    if(S.tab==="path"){ if(status(id)==="open" && lessonAllowed()) startLesson(id); return; }
    S.sel = S.sel===id?null:id; home();
    const c=document.getElementById("info"); if(c) c.scrollIntoView({behavior:"smooth",block:"nearest"});});
  const nd=document.getElementById("nextday"); if(nd) nd.onclick=nextDay;
  if(document.querySelector("[data-until]")) startTick();
}
/* V-9: takrorlash qarzi katta bo'lsa (3+), har ~3 takrorlashga 1 dars */
function reviewTasks(){
  const out=S.remedial.slice(0,3).map(id=>({kind:"remedial", id}));
  const due=TOPICS.filter(t=>learned(t.id) && S.tp[t.id].due<=now() && !S.remedial.includes(t.id));
  due.filter(t=>!DEPS[t.id].some(d=>due.some(x=>x.id===d)))          // V-6: yuqori mavzu pastkisini yopadi
     .sort((a,b)=>S.tp[a.id].due-S.tp[b.id].due).slice(0,3).forEach(t=>out.push({kind:"review", id:t.id}));
  const nL=TOPICS.filter(t=>learned(t.id)).length;
  if((S.xpSinceQuiz>=P.QUIZ_EVERY && nL>=3) || (S.quizRetake && !S.remedial.length)) out.push({kind:"quiz"});
  return out;
}
function dueCount(){ return reviewTasks().filter(t=>t.kind!=="quiz").length; }
function lessonAllowed(){ return dueCount()<3 || S.revSinceLesson>=3; }

function viewToday(){
  const tasks=panel(), nL=TOPICS.filter(t=>learned(t.id)).length;
  const days=Object.keys(S.xpDay).map(Number).filter(d=>d<S.day).slice(-10);
  const pace=days.length?Math.max(P.STREAK_MIN, days.reduce((a,d)=>a+(S.xpDay[d]||0),0)/days.length):P.GOAL;
  const left=TOPICS.filter(t=>!learned(t.id)).reduce((a,t)=>a+lessonXP(t.id),0);
  const finish=Math.ceil(left/pace);
  const label={lesson:"Dars",review:"Takrorlash",remedial:"Yordamchi takrorlash",quiz:"Quiz"};
  const icon={lesson:ICON.book,review:ICON.repeat,remedial:ICON.repeat,quiz:ICON.quiz};
  const xpOf=t=>t.kind==="lesson"?lessonXP(t.id):t.kind==="quiz"?P.XP_QUIZ:P.XP_REVIEW;
  const rest=TOPICS.filter(t=>frontier(t.id)&&resting(t.id));
  return `<main class="today">
    <section class="card prog">
      <div><span class="kicker">1-modul · Sun'iy intellekt asoslari</span>
        <div class="bigline"><b>${nL}</b> / ${TOPICS.length} mavzu</div>
        <div class="bar1"><i style="width:${nL/TOPICS.length*100}%"></i></div></div>
      <p class="muted">${left?`Taxminiy tugash: ${finish} kun (kuniga ~${Math.round(pace)} XP)`:"Modul tugadi!"}</p>
    </section>
    <h2 class="sec">Bugungi vazifalar</h2>
    ${tasks.length?`<div class="tasks">${tasks.map(t=>`<button class="task ${t.kind}" data-task='${JSON.stringify(t)}'>
       <span class="ti">${icon[t.kind]}</span>
       <span class="tt"><small>${label[t.kind]}</small><b>${t.kind==="quiz"?(S.quizRetake?"Qayta quiz":"Quiz: o'tilgan mavzular"):esc(BYID[t.id].name)}</b></span>
       <span class="txp">~${xpOf(t)} XP</span></button>`).join("")}</div>`
      :`<div class="card empty"><p>${nL===TOPICS.length?"Hamma mavzu o'tildi. Barakalla!":"Hozircha vazifa yo'q. Biroz dam oling."}</p></div>`}
    ${rest.length?`<div class="restlist">${rest.map(t=>`<div class="rest"><p>${esc(t.name)}<br><small>Bu darsga keyinroq qaytamiz. Biroz dam oling.</small></p><span class="timer" data-until="${S.tp[t.id].rest}">${fmt(S.tp[t.id].rest-now())}</span></div>`).join("")}</div>`:""}
    ${S.notes.length?`<div class="notes">${S.notes.map(n=>`<p>${n}</p>`).join("")}</div>`:""}
    <div class="sim"><button class="ghost" id="nextday">Sinov uchun: keyingi kunga o'tish</button>
      <small>${S.day}-kun. Ma'lumot saqlanmaydi: sahifa yangilansa, hammasi boshidan.</small></div>
  </main>`;
}

function status(id){
  if(learned(id)) return S.tp[id].due<=now()?"due":"done";
  if(frontier(id)) return resting(id)?"wait":"open";
  return "locked";
}
const STLABEL={done:"O'zlashtirilgan",due:"Takrorlash vaqti keldi",open:"Ochiq",wait:"Dam olish",locked:"Yopiq"};
function infoCard(id){
  const t=BYID[id], st=status(id);
  return `<section class="card info" id="info"><span class="kicker">${id}-mavzu · ${BLOCKS[t.b]}</span>
    <h3>${esc(t.name)}</h3><span class="chip ${st}">${STLABEL[st]}</span>
    <ol class="bnl">${t.bns.map(b=>`<li>${b.t}${b.practice?' <span class="tag">amaliyot</span>':''}</li>`).join("")}</ol>
    <p class="muted">${t.pre.length?"Oldingi mavzu: "+t.pre.map(p=>`${p}. ${esc(BYID[p].name)}`).join(", "):"Oldingi mavzu yo'q — birinchi mavzu."}</p>
    ${learned(id)?`<p class="muted">Keyingi takrorlash: ${Math.max(0,Math.ceil((S.tp[id].due-now())/DAY))} kundan keyin</p>`:""}
    </section>`;
}
function viewPath(){
  const nL=TOPICS.filter(t=>learned(t.id)).length;
  const days=Object.keys(S.xpDay).map(Number).filter(d=>d<S.day).slice(-10);
  const pace=days.length?Math.max(P.STREAK_MIN, days.reduce((a,d)=>a+(S.xpDay[d]||0),0)/days.length):P.GOAL;
  const left=TOPICS.filter(t=>!learned(t.id)).reduce((a,t)=>a+lessonXP(t.id),0);
  const rv=reviewTasks(), allowed=lessonAllowed();
  const firstOpen=TOPICS.findIndex(t=>!learned(t.id));
  const reviewNodes = rv.map(t=>{
    const isQ=t.kind==="quiz";
    return `<div class="node rnode" style="--off:22px"><button class="btn3d ${isQ?'quizn':'review'}" data-task='${JSON.stringify(t)}' aria-label="${isQ?'Quiz':'Takrorlash'}"><span class="face">${isQ?ICON.quiz:ICON.repeat}</span></button>
      <span class="label"><small class="rk">${isQ?(S.quizRetake?"Qayta quiz":"Quiz"):t.kind==="remedial"?"Yordamchi takrorlash":"Takrorlash"}</small>${isQ?"O'tilgan mavzular":esc(BYID[t.id].name)}</span></div>`;}).join("");
  let off=0;
  const items=TOPICS.map((t,i)=>{
    const st=status(t.id), cls=st==="done"||st==="due"?"done":st==="open"?(allowed?"active":"active held"):st==="wait"?"active resting":"locked";
    const ico=cls==="done"?ICON.check:cls.startsWith("active")?ICON.play:ICON.bolt;
    const head = i===0||TOPICS[i-1].b!==t.b ? `<div class="blk">${BLOCKS[t.b]}</div>`:"";
    const rv_ = i===firstOpen ? reviewNodes : "";
    return `${rv_}${head}<div class="node ${cls==='locked'?'is-locked':''}" style="--off:${[0,44,80,44][(off++)%4]}px">
      <button class="btn3d ${cls}" data-node="${t.id}" aria-label="${esc(t.name)}"><span class="face">${ico}</span></button>
      <span class="label">${esc(t.name)}${t.bns.some(b=>b.practice)?' <span class="tag">amaliyot</span>':''}
      ${st==="wait"?`<span class="mini rst">Dam oling: <b data-until="${S.tp[t.id].rest}">${fmt(S.tp[t.id].rest-now())}</b></span>`:''}
      ${st==="open"&&!allowed?'<span class="mini rst">Avval takrorlashlarni bajaring</span>':''}</span></div>
`;
  }).join("") + (firstOpen<0 ? reviewNodes : "");
  return `<main class="path">
    <section class="card prog"><div><span class="kicker">1-modul · Sun'iy intellekt asoslari</span>
      <div class="bigline"><b>${nL}</b> / ${TOPICS.length} mavzu</div><div class="bar1"><i style="width:${nL/TOPICS.length*100}%"></i></div></div>
      <p class="muted">${left?`Taxminiy tugash: ${Math.ceil(left/pace)} kun (kuniga ~${Math.round(pace)} XP)`:"Modul tugadi!"}</p>
      <div class="simrow"><button class="ghost" id="nextday">Keyingi kunga o'tish</button><small>${S.day}-kun · sinov uchun</small></div></section>
    ${S.notes.length?`<div class="notes">${S.notes.slice(0,2).map(n=>`<p>${n}</p>`).join("")}</div>`:""}
    ${items}
    <p class="muted center">Ma'lumot saqlanmaydi: sahifa yangilansa, hammasi boshidan boshlanadi.</p></main>`;
}
function depth(id,m={}){ if(m[id]!=null) return m[id]; const t=BYID[id]; return m[id]=t.pre.length?1+Math.max(...t.pre.map(p=>depth(p,m))):0; }
function viewGraph(){
  const memo={}, rows={}; TOPICS.forEach(t=>{const d=depth(t.id,memo);(rows[d]=rows[d]||[]).push(t.id);});
  const W=420, RH=74, pos={}, nR=Object.keys(rows).length;
  Object.entries(rows).forEach(([d,ids])=>ids.forEach((id,i)=>{pos[id]={x:W*(i+1)/(ids.length+1), y:36+d*RH};}));
  const H=36+(nR-1)*RH+40;
  const edges=TOPICS.flatMap(t=>t.pre.map(p=>`<line x1="${pos[p].x}" y1="${pos[p].y}" x2="${pos[t.id].x}" y2="${pos[t.id].y}" class="edge ${learned(p)?'on':''}"/>`)).join("");
  const nodes=TOPICS.map(t=>{const st=status(t.id);return `<g class="gn ${st} ${S.sel===t.id?'sel':''}" data-node="${t.id}" tabindex="0" role="button" aria-label="${esc(t.name)}">
    <circle cx="${pos[t.id].x}" cy="${pos[t.id].y}" r="19"/><text x="${pos[t.id].x}" y="${pos[t.id].y+5}" text-anchor="middle">${t.id}</text></g>`}).join("");
  const legend=[["done","O'zlashtirilgan"],["due","Takrorlash kerak"],["open","Ochiq"],["wait","Dam olish"],["locked","Yopiq"]];
  return `<main class="graph">
    <section class="card"><span class="kicker">Bilim grafi</span><p class="muted">Har doira — bitta mavzu. Chiziq: pastdagi mavzu yuqoridagisiga tayanadi. Doirani bosing.</p>
      <div class="gwrap"><svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Bilim grafi">${edges}${nodes}</svg></div>
      <div class="legend">${legend.map(([k,l])=>`<span><i class="lg ${k}"></i>${l}</span>`).join("")}</div></section>
    ${S.sel?infoCard(S.sel):""}</main>`;
}

/* ---------- keyingi kun (streak X-12) ---------- */
function nextDay(){
  const today=S.xpDay[S.day]||0;
  if(today>=P.STREAK_MIN){ S.streak++; note(`${S.day}-kun hisoblandi (${today} XP). Streak: ${S.streak}.`); }
  else if(S.freeze>0 && S.streak>0){ S.freeze--; note(`${S.day}-kunda 10 XP to'planmadi — streak muzlatish bilan saqlandi.`); }
  else if(S.streak>0){ note(`${S.day}-kunda 10 XP to'planmadi — streak 0 dan boshlanadi.`); S.streak=0; }
  S.day++; S.offset+=DAY; S.xpDay[S.day]=0;
  if((S.day-1)%7===0){ S.freeze=1; }
  home();
}

/* ---------- sessiya ekrani ---------- */
const L4=["A","B","C","D"];
function topBar(segs){return `<div class="top"><button class="x" id="close" aria-label="Yopish">${ICON.x}</button><div class="bar">${segs}</div></div>`}
function bindClose(onClose){document.getElementById("close").onclick=onClose||(()=>home());}
function dots(n){return `<div class="streak">${Array.from({length:P.NEED},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join("")}</div>`}
function mcq(q, kicker, after, opts={}){
  const o=shuffle(q.o.map((t,i)=>({t,ok:i===0}))); let sel=-1;
  const slot=document.getElementById("qslot");
  slot.replaceChildren(el(`<section class="card"><span class="kicker">${kicker}</span><div class="q">${esc(q.q)}</div>
    <div class="opts">${o.map((x,i)=>`<button class="opt" data-i="${i}"><span class="k">${L4[i]}</span><span>${esc(x.t)}</span></button>`).join("")}</div>${opts.dots||""}</section>
    <div id="fbslot"></div><button class="main" id="check" disabled>${opts.btn||"Tekshirish"}</button>`));
  const btns=[...slot.querySelectorAll(".opt")], chk=document.getElementById("check");
  btns.forEach(b=>b.onclick=()=>{btns.forEach(x=>x.classList.remove("sel"));b.classList.add("sel");sel=+b.dataset.i;chk.disabled=false;});
  chk.onclick=()=>{
    const ok=o[sel].ok;
    if(opts.silent){ return after(ok); }               // quiz: javob darhol ko'rsatilmaydi (QZ-3)
    btns.forEach((b,i)=>{b.disabled=true;b.classList.remove("sel");if(o[i].ok)b.classList.add("right");else if(i===sel)b.classList.add("wrong");});
    document.getElementById("fbslot").replaceChildren(el(`<div class="fb ${ok?'ok':'bad'}"><h3>${ok?"To'g'ri":"Noto'g'ri"}</h3>${ok?'':`<p><b>To'g'ri javob:</b> ${esc(o.find(x=>x.ok).t)}</p>`}<p>${esc(q.e)}</p></div>`));
    chk.textContent="Davom etish"; chk.className="main "+(ok?"okb":"badb");
    after(ok, ()=>{}); chk.onclick=()=>opts.next();
  };
}

/* ---------- dars (O-1…O-5) ---------- */
let L=null;
function startLesson(id){
  S.screen="lesson"; S.tp[id].tries++; S.revSinceLesson=0;
  L={id, kp:0, used:BYID[id].bns.map(()=>new Set()), errors:0, streak:0, fails:0, asked:0};
  explain();
}
function lessonBar(){return BYID[L.id].bns.map((_,i)=>i<L.kp?'<span class="full"><i></i></span>':i===L.kp?`<span class="cur" style="--w:${L.streak/P.NEED*100}%"><i></i></span>`:'<span><i></i></span>').join("")}
function explain(){
  const b=BYID[L.id].bns[L.kp]; L.streak=0; L.fails=0; L.asked=0;
  app.replaceChildren(el(`${topBar(lessonBar())}<section class="card"><span class="kicker">Bilim nuqtasi ${L.kp+1} / ${BYID[L.id].bns.length}</span>
    <p class="lead">${b.t}</p>${b.ex?`<div class="ex"><b>Namuna</b><div class="pr">${b.ex}</div></div>`:''}</section>
    <button class="main" id="go">${b.practice?"Boshlash":"Savollarga o'tish"}</button>`));
  bindClose(); document.getElementById("go").onclick=lessonItem;
}
function lessonShell(){ app.replaceChildren(el(`${topBar(lessonBar())}<div id="qslot" class="qslot"></div>`)); bindClose(); }
function lessonAfter(ok){
  L.asked++; if(ok){L.streak++;L.fails=0;} else {L.streak=0;L.fails++;L.errors++;}
  app.querySelector(".bar").innerHTML=lessonBar();
}
function lessonNext(){
  if(L.streak>=P.NEED){ L.kp++; return L.kp<BYID[L.id].bns.length?explain():lessonPass(); }
  if(L.fails>=P.HALT || L.asked>=P.MAXQ) return lessonFail();
  lessonItem();
}
function lessonItem(){
  lessonShell();
  const kick=`Bilim nuqtasi ${L.kp+1} / ${BYID[L.id].bns.length}`;
  if(isPractice(L.id,L.kp)) return practiceItem(kick);
  const pl=pool(L.id,L.kp), free=pl.map((_,i)=>i).filter(i=>!L.used[L.kp].has(i));
  if(!free.length) return lessonFail();
  const qi=pick(free); L.used[L.kp].add(qi);
  mcq(pl[qi], kick, ok=>lessonAfter(ok), {dots:dots(L.streak), next:lessonNext});
}
function practiceItem(kick){
  const task = PR.has(L.id) ? PR.make(L.id) : PR2.make(L.id);
  const type = task.type || "prompt";
  const slot=document.getElementById("qslot");
  const finish=(r)=>{
    lessonAfter(r.ok);
    document.getElementById("fbslot").replaceChildren(el(`<div class="fb ${r.ok?'ok':'bad'}"><h3>${r.ok?"To'g'ri":"Noto'g'ri"}</h3>${r.msg.map(x=>`<p>${esc(x)}</p>`).join("")}</div>`));
    const chk=document.getElementById("check"); chk.disabled=false; chk.textContent="Davom etish"; chk.className="main "+(r.ok?"okb":"badb"); chk.onclick=lessonNext;
  };
  const chatHtml = task.chat ? task.chat.map(([w,t])=>`<div class="msg ${w==="me"?"me":"ai"}">${w==="ai"?'<span class="who">SI</span>':''}${esc(t)}</div>`).join("") : "";
  const planHtml = task.plan ? `<div class="msg ai"><span class="who">SI · reja</span>${task.plan.map((x,i)=>`${i+1}. ${esc(x)}`).join("<br>")}</div>` : "";
  const head = `<span class="kicker">${kick} · amaliyot</span><div class="ptask">${esc(task.text)}</div>${task.err?`<pre class="err">${esc(task.err)}</pre>`:""}`;
  const writeBox = (ph, rows=3) => `<label class="sr" for="pin">Javob</label><textarea id="pin" rows="${rows}" placeholder="${ph}" autocomplete="off" spellcheck="false"></textarea>`;

  if(type==="prompt" || type==="write" || (type==="site" && task.mode==="prompt")){
    const isW = type==="write";
    slot.replaceChildren(el(`<section class="card">${head}${task.page||""}${task.lead?`<p class="muted">${esc(task.lead)}</p>`:""}
      <div class="chat" id="chat">${chatHtml}${planHtml}</div><div class="q">${isW?"Kutilgan natijani yozing":"SI'ga prompt yozing"}</div>
      ${writeBox(isW?(task.placeholder||""):"Promptni shu yerga yozing...", isW?4:3)}${dots(L.streak)}</section>
      <div id="fbslot"></div><button class="main" id="check" disabled>${isW?"Tekshirish":"Yuborish"}</button>`));
    const ta=document.getElementById("pin"), chk=document.getElementById("check");
    if(!task.paste){ ta.addEventListener("paste",e=>e.preventDefault()); ta.addEventListener("drop",e=>e.preventDefault()); }
    ta.oninput=()=>{chk.disabled=!ta.value.trim()};
    chk.onclick=()=>{ const raw=ta.value, r=task.check(raw); ta.disabled=true; chk.disabled=true;
      if(!isW) document.getElementById("chat").insertAdjacentHTML("beforeend", `<div class="msg me">${esc(raw)}</div>${r.ans?`<div class="msg ai"><span class="who">SI</span>${esc(r.ans)}</div>`:""}`);
      finish(r); };
    return;
  }
  if(type==="mark"){
    const sel=new Set(); let ch=-1;
    slot.replaceChildren(el(`<section class="card">${head}${task.lead?`<div class="msg me">${esc(task.lead)}</div>`:""}
      <div class="marks ${task.lines?'lines':''}">${task.chunks.map((c,i)=>`<button class="mk" data-i="${i}">${esc(c.t)}</button>`).join(task.lines?"":"")}</div>
      ${task.choices?`<div class="q">Xato turi</div><div class="opts">${task.choices.map((c,i)=>`<button class="opt ch" data-c="${i}"><span class="k">${L4[i]}</span><span>${c}</span></button>`).join("")}</div>`:""}${dots(L.streak)}</section>
      <div id="fbslot"></div><button class="main" id="check" disabled>Tekshirish</button>`));
    const chk=document.getElementById("check"), ready=()=>{chk.disabled=!(sel.size && (!task.choices||ch>=0));};
    slot.querySelectorAll(".mk").forEach(b=>b.onclick=()=>{const i=+b.dataset.i; sel.has(i)?sel.delete(i):sel.add(i); b.classList.toggle("on"); ready();});
    slot.querySelectorAll(".ch").forEach(b=>b.onclick=()=>{slot.querySelectorAll(".ch").forEach(x=>x.classList.remove("sel")); b.classList.add("sel"); ch=+b.dataset.c; ready();});
    chk.onclick=()=>{ slot.querySelectorAll(".mk,.ch").forEach(b=>b.disabled=true);
      task.chunks.forEach((c,i)=>{const b=slot.querySelector(`.mk[data-i="${i}"]`); if(c.need) b.classList.add("need"); else if(sel.has(i)) b.classList.add("wrongmk");});
      chk.disabled=true; finish(task.check(sel, ch)); };
    return;
  }
  if(type==="site"){
    let touched=false;
    const mid = task.mode==="checklist"
      ? `<div class="q">Bajarilgan bandlarni belgilang</div><div class="opts">${task.items.map((t,i)=>`<button class="opt cl" data-i="${i}"><span class="k">✓</span><span>${esc(t)}</span></button>`).join("")}</div>`
      : `<div class="q">Xato belgisi qaysi?</div><div class="opts">${task.choices.map((c,i)=>`<button class="opt ch" data-c="${i}"><span class="k">${L4[i]}</span><span>${c}</span></button>`).join("")}</div>`;
    slot.replaceChildren(el(`<section class="card">${head}${task.page}${mid}${dots(L.streak)}</section><div id="fbslot"></div><button class="main" id="check" ${task.mode==="checklist"?"":"disabled"}>Tekshirish</button>`));
    const chk=document.getElementById("check"), mock=slot.querySelector(".mock"), out=slot.querySelector("#mout");
    mock.addEventListener("click",()=>{touched=true;});
    const mb=slot.querySelector("#mbtn");
    if(mb) mb.onclick=()=>{ touched=true;
      if(task.behave===2) return;                                   // ishlamayapti: hech narsa bo'lmaydi
      if(task.behave===3){ out.innerHTML='<div class="merr">Uncaught TypeError: order is undefined</div>'; return; }
      out.innerHTML='<div class="mok">Buyurtma qabul qilindi</div>'; };
    const sel=new Set(); let ch=-1;
    slot.querySelectorAll(".cl").forEach(b=>b.onclick=()=>{const i=+b.dataset.i; sel.has(i)?sel.delete(i):sel.add(i); b.classList.toggle("sel");});
    slot.querySelectorAll(".ch").forEach(b=>b.onclick=()=>{slot.querySelectorAll(".ch").forEach(x=>x.classList.remove("sel")); b.classList.add("sel"); ch=+b.dataset.c; chk.disabled=false;});
    chk.onclick=()=>{ slot.querySelectorAll(".opt").forEach(b=>b.disabled=true); chk.disabled=true;
      finish(task.mode==="checklist"? task.check(sel) : task.check(ch, touched)); };
    return;
  }
  if(type==="agent"){
    let viewed=false;
    slot.replaceChildren(el(`<section class="card">${head}
      <div class="diff">${task.diff.map(([s,t])=>`<div class="dl ${s==="+"?"add":"del"}"><b>${s}</b> ${esc(t)}</div>`).join("")}</div>
      <button class="ghost" id="pv">Natijani ko'rish</button><div id="pvslot"></div>
      <div class="agbtns"><button class="opt" id="acc"><span>Qabul qilish</span></button><button class="opt" id="rej"><span>Rad qilish</span></button></div>
      <div id="whyslot"></div>${dots(L.streak)}</section><div id="fbslot"></div><button class="main" id="check" disabled>Tekshirish</button>`));
    const chk=document.getElementById("check"); let accept=null;
    document.getElementById("pv").onclick=()=>{viewed=true; document.getElementById("pvslot").innerHTML=task.preview;};
    const choose=(a)=>{accept=a; document.getElementById("acc").classList.toggle("sel",a); document.getElementById("rej").classList.toggle("sel",!a);
      const ws=document.getElementById("whyslot");
      if(!a && task.needWhy){ ws.innerHTML=`<div class="q">Nima buzilganini SI'ga yozing</div>${writeBox("Masalan: rasm yo'qolib qoldi, qaytar",2)}`;
        const ta=document.getElementById("pin"); ta.addEventListener("paste",e=>e.preventDefault()); ta.oninput=()=>{chk.disabled=!ta.value.trim()}; chk.disabled=true; }
      else { ws.innerHTML=""; chk.disabled=false; } };
    document.getElementById("acc").onclick=()=>choose(true); document.getElementById("rej").onclick=()=>choose(false);
    chk.onclick=()=>{ const ta=document.getElementById("pin"); slot.querySelectorAll("button,textarea").forEach(b=>b.disabled=true); chk.disabled=true;
      finish(task.check({viewed, accept, why: ta?ta.value:""})); };
    return;
  }
}
function grade(base, errors){ return base*(errors===0?1.2:errors===1?1:0.75); }   // X-2
function lessonPass(){
  const id=L.id, t=S.tp[id], xp=addXP(grade(lessonXP(id), L.errors));
  t.learned=true; t.reps=1; t.ivl=P.FIRST_IVL; t.due=now()+t.ivl*DAY;   // T-3: darsdan o'tish = "Good", ~2 kun
  fire(id, true);
  const unlocked=DEPS[id].filter(d=>frontier(d)).map(d=>BYID[d].name);
  result(true, `+${xp} XP`, L.errors===0?"Xatosiz! +20% bonus.":"Mavzu o'tildi.", unlocked.length?`Yangi ochildi: ${unlocked.join(", ")}`:"");
}
function lessonFail(){
  const id=L.id, t=S.tp[id], k=L.kp;
  const xp=addXP(lessonXP(id)*(k>0?0.15:0));
  t.rest=now()+P.REST_MIN*60*1000; t.kpFails[k]=(t.kpFails[k]||0)+1;
  let extra="";
  if(t.kpFails[k]>=2){ // O-4: ikkinchi marta o'sha joyda — asosiy oldingi mavzu takrori
    const pre=BYID[id].pre.filter(learned); pre.forEach(p=>{if(!S.remedial.includes(p)) S.remedial.push(p);});
    if(pre.length){ extra=`Avval "${pre.map(p=>BYID[p].name).join('", "')}" mavzusini takrorlaymiz.`; note(extra); }
  }
  S.screen="halt";
  app.replaceChildren(el(`${topBar(lessonBar())}<section class="card end"><h2>Bu darsga keyinroq qaytamiz</h2><p>Biroz dam oling.</p>
    <span class="timer big-t" data-until="${t.rest}">${fmt(t.rest-now())}</span>${extra?`<p class="muted">${extra}</p>`:""}${xp?`<p class="muted">+${xp} XP</p>`:""}</section>
    <button class="main" id="back">Davom etish</button>`));
  bindClose(); document.getElementById("back").onclick=()=>home(); startTick();
}
function result(ok, big, line, extra){
  S.screen="result";
  app.replaceChildren(el(`<section class="card end"><div class="big" style="background:var(--${ok?'ok':'bad'})">${ok?ICON.check:ICON.x}</div>
    <h2>${ok?"Barakalla!":"Keyingi safar albatta"}</h2><p class="xpbig">${big}</p><p>${line}</p>${extra?`<p class="muted">${extra}</p>`:""}</section>
    <button class="main" id="back">Davom etish</button>`));
  document.getElementById("back").onclick=()=>home();
}

/* ---------- FIRe (T-4, T-5) ---------- */
function fire(id, success){
  if(success){ BYID[id].pre.filter(learned).forEach(p=>{ const t=S.tp[p]; t.due=Math.max(t.due,now())+t.ivl*P.FIRE*DAY; }); }
  else { DEPS[id].filter(learned).forEach(d=>{ const t=S.tp[d]; t.due=Math.min(t.due, now()+DAY); }); }
}

/* ---------- takrorlash (T-1…T-3) ---------- */
let R=null;
function reviewQuestions(id){
  const qs=[]; BYID[id].bns.forEach((b,k)=>pool(id,k).forEach(q=>qs.push(q))); return shuffle(qs);
}
function startReview(id, remedial){
  S.screen="review"; R={id, remedial, qs:reviewQuestions(id), res:[]};
  reviewItem();
}
function reviewBar(){return Array.from({length:Math.max(3,R.res.length+ (R.res.length<P.MAXQ?1:0))},(_,i)=>i<R.res.length?`<span class="${R.res[i]?'full':'miss'}"><i></i></span>`:'<span><i></i></span>').join("")}
function reviewItem(){
  app.replaceChildren(el(`${topBar(reviewBar())}<div id="qslot" class="qslot"></div>`)); bindClose();
  const q=R.qs[R.res.length % R.qs.length];
  mcq(q, `${R.remedial?"Yordamchi takrorlash":"Takrorlash"} · ${esc(BYID[R.id].name)}`, ok=>{R.res.push(ok); app.querySelector(".bar").innerHTML=reviewBar();},
    {next:()=>{ const n=R.res.length, last2=n>=2&&R.res[n-1]&&R.res[n-2];
      if((n>=3&&last2)||n>=P.MAXQ) reviewEnd(); else reviewItem(); }});
}
function reviewEnd(){
  const n=R.res.length, pass=R.res[n-1]&&R.res[n-2], errors=R.res.filter(x=>!x).length, t=S.tp[R.id];  // T-2: tartib muhim
  const xp=addXP(pass?grade(P.XP_REVIEW,errors):P.XP_REVIEW*0.15);
  if(R.remedial) S.remedial=S.remedial.filter(x=>x!==R.id);
  S.revSinceLesson++;
  if(pass){ t.reps++; t.ivl=Math.round(t.ivl*(errors?1.5:2.5)*10)/10; t.due=now()+t.ivl*DAY; fire(R.id,true); }
  else { t.ivl=1; t.due=now()+DAY; fire(R.id,false); }
  result(pass, `+${xp} XP`, pass?`Takrorlash o'tdi. Keyingisi ${Math.round(t.ivl)} kundan keyin.`:"Takrorlash o'tmadi. Ertaga yana takrorlaymiz.", `Javoblar: ${R.res.map(x=>x?"✔":"✖").join(" ")}`);
}

/* ---------- quiz (QZ-1…QZ-8) ---------- */
let Q=null;
function startQuiz(){
  const ids=shuffle(TOPICS.filter(t=>learned(t.id)).map(t=>t.id));
  const items=[]; for(let i=0;i<P.QUIZ_N;i++){ const id=ids[i%ids.length]; const qs=reviewQuestions(id); items.push({id,q:qs[0]}); }
  S.screen="quiz"; Q={items, res:[], end:now()+P.QUIZ_MIN*60*1000, retake:S.quizRetake};
  app.replaceChildren(el(`<section class="card end"><div class="big" style="background:var(--blue)">${ICON.quiz}</div><h2>Quiz</h2>
    <p>${P.QUIZ_N} ta savol, ${P.QUIZ_MIN} daqiqa. Namuna va yordam yo'q.</p><p class="muted">Javoblar oxirida ko'rsatiladi. Vaqtingiz bo'lsagina boshlang.</p></section>
    <button class="main" id="go">Boshlash</button><button class="ghost" id="back">Keyinroq</button>`));
  document.getElementById("go").onclick=quizItem; document.getElementById("back").onclick=()=>home();
}
function quizItem(){
  const i=Q.res.length;
  if(i>=Q.items.length || now()>Q.end) return quizEnd();
  app.replaceChildren(el(`<div class="top"><span class="qcount">${i+1} / ${Q.items.length}</span><div class="bar">${Q.items.map((_,j)=>`<span class="${j<i?'full':''}"><i></i></span>`).join("")}</div>
    <span class="timer" data-until="${Q.end}">${fmt(Q.end-now())}</span></div><div id="qslot" class="qslot"></div>`));
  startTick();
  mcq(Q.items[i].q, "Quiz", ok=>{Q.res.push(ok); quizItem();}, {silent:true, btn:"Javob berish"});
}
function quizEnd(){
  while(Q.res.length<Q.items.length) Q.res.push(false);       // QZ-4: javobsizlar xato
  const right=Q.res.filter(Boolean).length, pct=right/Q.items.length;
  const xp=addXP(P.XP_QUIZ*(pct>=1?1.2:pct>=0.8?1:pct>=0.6?0.75:0.15));
  Q.items.forEach((it,j)=>{ if(Q.res[j]) { const t=S.tp[it.id]; t.due=Math.max(t.due,now())+t.ivl*P.FIRE*DAY; }
    else if(!S.remedial.includes(it.id)) S.remedial.push(it.id); });          // QZ-6, QZ-7
  S.xpSinceQuiz=0;
  S.quizRetake = !Q.retake && pct<0.9;                                         // QZ-8: bir marta qayta
  result(pct>=0.6, `${right} / ${Q.items.length}`, `+${xp} XP`,
    `${Q.items.map((it,j)=>`${Q.res[j]?"✔":"✖"} ${esc(BYID[it.id].name)}`).join("<br>")}${pct<1?"<br><br>Xato mavzular yordamchi takrorlashga qo'shildi.":""}${S.quizRetake?"<br>Takrorlashdan keyin qayta quiz bo'ladi.":""}`);
}

home();
