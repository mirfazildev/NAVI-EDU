/* Yangi amaliyot turlari: belgilash (mark), soxta sayt (site), soxta agent (agent), yozish. Hammasi algoritm — haqiqiy SI yo'q (Q-604). */
const PR2 = (() => {
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const TR={"а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"j","з":"z","и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"x","ц":"s","ч":"ch","ш":"sh","щ":"sh","ъ":"","ы":"i","ь":"","э":"e","ю":"yu","я":"ya","ў":"o","қ":"q","ғ":"g","ҳ":"h"};
  const SYN=[[/\b(button|buton|knopka|knopkasi|btn)\b/g,"tugma"],[/\b(image|img|photo|picture|foto|surat|kartinka|rasim)\b/g,"rasm"],[/\b(title|header|heading|zagolovok)\b/g,"sarlavha"],
    [/\b(text|tekst)\b/g,"matn"],[/\b(menu)\b/g,"menyu"],[/\b(color|colour|svet|tsvet)\b/g,"rang"],[/\b(red|krasniy)\b/g,"qizil"],[/\b(blue|siniy)\b/g,"kok"],[/\b(green|zelyoniy)\b/g,"yashil"],
    [/\b(yellow)\b/g,"sariq"],[/\b(black)\b/g,"qora"],[/\b(white)\b/g,"oq"],[/\b(fix|ispravit|ispravi)\b/g,"tuzat"],[/\b(lkn|lekn|lekim)\b/g,"lekin"],[/\b(hato|xatto)\b/g,"xato"],
    [/\b(page|stranitsa)\b/g,"sahifa"],[/\b(site|sayit)\b/g,"sayt"],[/\b(error|oshibka)\b/g,"xato"],[/\b(ishalyapti|ishlavotti|ishlayabdi)\b/g,"ishlayapti"],[/yabdi\b/g,"yapti"],[/vot(ti|di)\b/g,"yapti"]];
  const STOP=/^(bor|va|yoq|lekin|ham|bu|u|men|menda|uchun|bilan|emas|kerak|edi|qil|yoz|ni|da|ga|bir|shu|endi|yana|hech|narsa)$/;
  const norm = s => { let t=s.toLowerCase().replace(/[а-яёўқғҳ]/g,c=>TR[c]??c).replace(/[‘’`ʻʼ´']/g,"").replace(/[«»"“”]/g," ");
    for(const [a,b] of SYN) t=t.replace(a,b); return t.replace(/\s+/g," ").trim(); };
  const words = s => norm(s).split(/[\s,.;:!?()]+/).filter(Boolean);
  const NEG = /(yozma|qoshma|qoyma|qilma|ochirma|kerak emas|kerakmas|yoq|rad|bajarma|ishga tushirma|yozib qoyma|tegma)/;
  const COLORS = [{w:"ko'k",c:"#2d5bf0"},{w:"qizil",c:"#d6453d"},{w:"yashil",c:"#1f9d55"},{w:"sariq",c:"#e0a800"},{w:"qora",c:"#151a2d"}];
  function basic(raw, opt={}){
    const w = words(raw), cnt={}; w.forEach(x=>cnt[x]=(cnt[x]||0)+1);
    if (w.length < (opt.min||4)) return "Juda qisqa. To'liq gap qilib yoz.";
    if (Object.entries(cnt).some(([x,c])=>c>=5 || (c>=3 && !STOP.test(x))) && w.length<40) return "So'zlarni takrorlama. Oddiy gap qilib yoz.";
    return null;
  }
  const res = (ok, msg, ans) => ({ok, msg: Array.isArray(msg)?msg:[msg], ans});
  /* kichik soxta sayt */
  function page({title="Kafe «Lola»", btn="Buyurtma berish", btnColor="#2d5bf0", btnPos="past", showBtn=true, img=true, titleColor="#151a2d", titleSize=22, btnId="mbtn", extra=""}){
    const b = showBtn ? `<button class="mbtn" id="${btnId}" style="background:${btnColor}">${btn}</button>` : "";
    return `<div class="mock"><div class="mbar"><i></i><i></i><i></i><span>lola-kafe.uz</span></div>
      <div class="mbody">${btnPos==="tepa"?b:""}<h4 style="color:${titleColor};font-size:${titleSize}px">${title}</h4>
      ${img?'<div class="mimg">rasm</div>':''}<p>Eng mazali taomlar shu yerda.</p>${btnPos!=="tepa"?b:""}${extra}<div class="mout" id="mout"></div></div></div>`;
  }

  /* 2. SI javobidagi tekshiriladigan ma'lumotni belgilash */
  const T2 = () => {
    const name = pick(["«Lola»","«Bahor»","«Orzu»","«Yulduz»"]), st = pick(["Navoiy","Amir Temur","Bobur","Mustaqillik"]);
    const n = 2+Math.floor(Math.random()*40), h = pick([7,8,9,10]), price = pick(["25 000","30 000","18 000"]);
    const chunks = [
      {t:`${name} kafesi`, need:true},{t:` ${st} ko'chasi, ${n}-uyda`, need:true},{t:" joylashgan."},
      {t:" U har kuni"},{t:` soat ${h}:00 da`, need:true},{t:" ochiladi."},
      {t:" Palov narxi"},{t:` ${price} so'm.`, need:true},{t:" Bu yerda"},{t:" taomlar juda mazali"},{t:" va xizmat yaxshi."}];
    return {type:"mark", text:"Bosib belgila: qaysi nom, raqam va manzilni tekshirish kerak?",
      chunks, check(sel){
        const need=chunks.map((c,i)=>c.need?i:-1).filter(i=>i>=0), miss=need.filter(i=>!sel.has(i)), extra=[...sel].filter(i=>!chunks[i].need);
        const m=[]; if(miss.length) m.push(`Belgilanmagan: ${miss.map(i=>chunks[i].t.trim().replace(/[.,]$/,"")).join(", ")}.`);
        if(extra.length) m.push(`Bu tekshiriladigan ma'lumot emas: ${extra.map(i=>chunks[i].t.trim().replace(/[.,]$/,"")).join(", ")}.`);
        return res(!m.length, m.length?m:"To'g'ri: nom, manzil, vaqt va narx tekshiriladi.");
      }};
  };

  /* 3. Ko'rgan narsani SI'ga yozib berish */
  const T3 = () => {
    // Vazifa bitta savol: "X bo'lishi uchun SI'ga nima deb yozasan?" (sodda, 8–10 yosh o'qish darajasi)
    const P = [
      {p:{btnColor:"#e6e7ec", btn:"Buyurtma berish"}, q:"Tugma aniq ko'rinishi uchun SI'ga nima deb yozasan?", el:/(tugma|knopk)/, st:/(korinmay|oq|kulrang|bilinmay|xira|och|rangsiz|kok|aniq|yorqin|toq|rang|korinsin|korinadigan)/, d:"tugma aniq ko'rinsin"},
      {p:{titleSize:11}, q:"Sarlavha katta bo'lishi uchun SI'ga nima deb yozasan?", el:/sarlav|nom/, st:/(kichik|mayda|korinmay|katta|kattalashtir)/, d:"sarlavha kattaroq bo'lsin"},
      {p:{img:false, extra:'<div class="mimg broken">✕ kafe.jpg yuklanmadi</div>'}, q:"Rasm chiqishi uchun SI'ga nima deb yozasan?", el:/rasm/, st:/(chiqmay|korinmay|yoq|buzil|ochilmay|yuklanmadi|yuklanmay|chiqar|chiqsin|korinsin|qoy|joyla)/, d:"rasm chiqsin"},
      {p:{btnPos:"tepa"}, q:"Tugma eng pastda turishi uchun SI'ga nima deb yozasan?", el:/(tugma|knopk)/, st:/(tepa|yuqori|ustida|boshida|joyi|past|oxir|tag)/, d:"tugma eng pastda tursin"}];
    const s = pick(P);
    return {ai:{rubric:[{q:`Nima o'zgarishi aytilganmi: ${s.d}?`,miss:`Nima o'zgarishini yoz: ${s.d}.`},{q:"SI'dan buni qilish so'ralganmi?",miss:"SI'dan so'ra: masalan, \"qil\" yoki \"tuzat\"."}]},type:"site", mode:"prompt", page:page(s.p), text:s.q,
      check(raw){
        const b=basic(raw,{min:2}); if(b) return res(false,b,"Nima qilay? Aniqroq yoz.");
        const p=norm(raw), hasEl=s.el.test(p), hasSt=s.st.test(p), verb=/(tuzat|togirla|ozgartir|qil|yordam|togril|tush|sur|qoy|chiqar|joyla|tursin|bolsin|korinsin|chiqsin|kattalashtir|olib bor|otkaz)/.test(p);
        const m=[]; if(!hasEl||!hasSt) m.push(`Nima o'zgarishini yoz: ${s.d}.`); if(!verb) m.push("SI'dan so'ra: masalan, \"qil\" yoki \"tuzat\".");
        return res(!m.length, m.length?m:"SI endi nima qilishni biladi.", !hasEl||!hasSt?"Men sahifangni ko'rmayapman. Nimani o'zgartiray?":`Tushundim: ${s.d}. Qilaman.`);
      }};
  };

  /* 4. Xatoni belgilash va turini aniqlash */
  const T4 = () => {
    // Sodda ko'rinish: sen nima so'rading → SI nima qildi → xato turi (qator belgilash yo'q)
    const V = [
      {prompt:"Kafe manzilini yoz.", lines:["Manzil: Navoiy ko'chasi, 125-uy"], note:"Sen SI'ga manzilni aytmagan eding.", type:0},
      {prompt:"Faqat sarlavhani «Lola kafe» qil.", lines:["Sarlavhani «Lola kafe» qildi","Tugma rangini ham o'zgartirdi","Menyuni o'chirib tashladi"], type:2},
      {prompt:"Tugma yozuvini «Buyurtma» qil.", lines:["Sarlavhani «Buyurtma» qildi","Tugma yozuvi o'zgarmadi"], type:1},
      {prompt:"Saytga ish vaqtini yoz.", lines:["Ish vaqti: har kuni 08:00 – 23:00"], note:"Sen SI'ga ish vaqtini aytmagan eding.", type:0}];
    const v = pick(V), T=["O'ylab topdi","Noto'g'ri tushundi","Ortiqcha o'zgartirdi"], H=["o'zidan to'qib yozdi","boshqa narsani qildi","so'ralmaganini ham o'zgartirdi"];
    return {type:"mark", static:true, text:"SI qanday xato qildi?", lead:`Sen: ${v.prompt}`, note:v.note,
      chunks:v.lines.map(t=>({t})), choices:T.map((t,i)=>`${t} <small class="hint">— ${H[i]}</small>`), check(sel, ch){
        return res(ch===v.type, ch===v.type?`To'g'ri: ${T[v.type].toLowerCase()}.`:`Bu — ${T[v.type].toLowerCase()}: SI ${H[v.type]}.`);
      }};
  };

  /* 10. Kutilgan natijani yozish */
  const T10 = () => {
    const obj = pick([{l:"tugma",rx:/tugma/},{l:"sarlavha",rx:/sarlav/},{l:"aloqa bo'limi",rx:/aloqa/}]);
    const VAGUE = /(chiroyli|zor|ajoyib|yaxshi|qulay|zamonaviy|qiziq|gozal|yoqimli|normal)/;
    const CHECK = /(\d|kok|qizil|yashil|sariq|qora|oq|kulrang|tepa|past|ong|chap|orta|markaz|«|soz|harf|katta|kichik|qalin|bosilganda|ochiladi|chiqadi|yozuvi|matni)/;
    return {ai:{rubric:[{q:`Ro'yxat ${obj.l} haqidami?`,miss:`Qaysi narsa haqida ekani yo'q: ${obj.l}.`},{q:"Kamida 2 ta alohida band bormi?",miss:"Kamida 2 ta band yoz, har qatorda bittadan."},{q:"Har bir bandni ko'rib tekshirsa bo'ladimi (rang, son, joy yoki aniq matn; 'chiroyli' kabi noaniq so'z yo'q)?",miss:"Har bandni ko'rib tekshirsa bo'ladigan qilib yoz: rang, son, joy yoki matn."}]},type:"write", text:`Kafe saytiga ${obj.l} kerak. Har qatorga bittadan 2 ta narsa yoz. U qanday bo'lishi kerak?`,
      placeholder:"Masalan:\nTugma ko'k rangda\nTugmada «Buyurtma» yozuvi bor", check(raw){
        const lines=raw.split(/\n|;/).map(x=>x.trim()).filter(x=>x.length>2);
        const m=[];
        if(lines.length<2) m.push("Kamida 2 ta band yoz, har qatorda bittadan.");
        if(!obj.rx.test(norm(raw))) m.push(`Qaysi narsa haqida ekani yo'q: ${obj.l}.`);
        lines.forEach(l=>{const n=norm(l); if(VAGUE.test(n)) m.push(`«${l}» — buni tekshirib bo'lmaydi. Aniq yoz: rang, son, joy yoki matn.`); else if(!CHECK.test(n)) m.push(`«${l}» — ko'rib tekshirsa bo'ladigan narsa yo'q (rang, son, joy, matn).`);});
        const uniq=new Set(lines.map(norm)); if(uniq.size<lines.length) m.push("Bir xil bandni takrorlama.");
        return res(!m.length, m.length?m:"Har bandni ko'rib tekshirsa bo'ladi.");
      }};
  };

  /* 11. Natijani kutilgan bilan solishtirish */
  const T11 = () => {
    const c = pick(COLORS.slice(0,3)), other = pick(COLORS.filter(x=>x!==c));
    const items = [
      {t:`Tugma ${c.w} rangda`, ok:Math.random()<.5},
      {t:"Tugmada «Buyurtma berish» yozuvi bor", ok:Math.random()<.5},
      {t:"Sarlavhada «Kafe «Lola»» yozilgan", ok:Math.random()<.5},
      {t:"Sahifada rasm bor", ok:Math.random()<.5}];
    if(items.every(x=>x.ok)) items[Math.floor(Math.random()*4)].ok=false;
    const pg = page({btnColor: items[0].ok?c.c:other.c, btn: items[1].ok?"Buyurtma berish":"Yuborish", title: items[2].ok?"Kafe «Lola»":"Kafe", img: items[3].ok});
    return {type:"site", mode:"checklist", page:pg, items:items.map(x=>x.t), text:"Sahifaga qara. Qaysi biri bajarilgan?",
      check(sel){ const m=[]; items.forEach((x,i)=>{ if(x.ok!==sel.has(i)) m.push(`«${x.t}» — ${x.ok?"bajarilgan":"bajarilmagan"}.`); });
        const done=items.every(x=>x.ok); return res(!m.length, m.length?m:(done?"Hammasi bajarilgan.":"To'g'ri. Bitta band ham bajarilmasa, ish hali tugamagan."));}};
  };

  /* 12. Farqni so'z bilan aytish */
  const T12 = () => {
    const want = pick(COLORS.slice(0,3)), now_ = pick(COLORS.filter(x=>x!==want && x.w!=="qora"));
    const pos = pick(["tepa","past"]);
    return {ai:{rubric:[{q:"Qaysi narsa ekani aytilganmi (sahifada bitta tugma bor, \"tugma\" deyilsa yetadi)?",miss:"Qaysi narsa — yo'q: tugma."},{q:`Tugma hozir ${now_.w} ekani aytilganmi?`,miss:`Hozir qanday — yo'q: ${now_.w}.`},{q:`Tugma ${want.w} bo'lishi kerakligi aytilganmi?`,miss:`Qanday bo'lishi kerak — yo'q: ${want.w}.`}]},type:"site", mode:"prompt", page:page({btnColor:now_.c, btnPos:pos}), text:`Tugma ${want.w} rangda bo'lishi kerak edi. Lekin sahifada boshqacha. SI'ga nima deb yozasan?`,
      check(raw){
        const b=basic(raw); if(b) return res(false,b,"Qaysi farq? Aniqroq yoz.");
        const p=norm(raw), where=/(tugma|knopk)/.test(p), now=p.includes(norm(now_.w)), should=p.includes(norm(want.w));
        const m=[]; if(!where) m.push("Qaysi narsa — yo'q: tugma."); if(!now) m.push(`Hozir qanday — yo'q: ${now_.w}.`); if(!should) m.push(`Qanday bo'lishi kerak — yo'q: ${want.w}.`);
        return res(!m.length, m.length?m:"Uchala qism ham bor.", !m.length?`Tugmani ${want.w} qildim.`:!where?"Qaysi narsani o'zgartiray?":!now?"Hozir u qanday rangda?":"Qaysi rangga o'zgartiray?");
      }};
  };

  /* 13. Xato belgisini aniqlash (sinab ko'rib) */
  const T13 = () => {
    const K = ["Ko'rinmayapti","Noto'g'ri ko'rinyapti","Ishlamayapti","Xato xabari chiqdi"];
    const KH = ["ekranda yo'q","bor, lekin boshqacha","bosilsa hech narsa bo'lmaydi","xato yozuvi chiqdi"];
    const k = Math.floor(Math.random()*4);
    const p = k===0 ? page({showBtn:false}) : k===1 ? page({btn:"Buyurt ma ber ish", btnColor:"#d6453d"}) : page({});
    return {type:"site", mode:"choice", page:p, behave:k, choices:K.map((t,i)=>`${t} <small class="hint">— ${KH[i]}</small>`), text:"Sahifada ko'k «Buyurtma berish» tugmasi bo'lishi kerak. Bosilsa, «Buyurtma qabul qilindi» chiqishi kerak. Sinab ko'r: qanday xato bor?",
      check(ch, touched){ if(!touched) return res(false,"Avval sahifani sinab ko'r: tugmani bos yoki uni qidir.");
        return res(ch===k, ch===k?`To'g'ri: ${K[k].toLowerCase()}.`:`Bu — ${K[k].toLowerCase()}.`); }};
  };

  /* 16. SI aylanib qolganda — boshqacha tushuntirish */
  const T16 = () => {
    const V = pick([{p1:"Menyu ishlamayapti, tuzat.", key:/menyu/, d:"«Menyu» tugmasi bosilganda ro'yxat ochilishi kerak, lekin hech narsa bo'lmayapti"},
                    {p1:"Rasm chiqmayapti, tuzat.", key:/rasm/, d:"bosh sahifadagi kafe rasmi o'rnida bo'sh joy turibdi"},
                    {p1:"Tugma ishlamayapti, tuzat.", key:/tugma/, d:"«Yuborish» tugmasi bosilganda xabar chiqishi kerak, lekin chiqmayapti"}]);
    return {ai:{rubric:[{q:`Muammo «${V.p1}» promptidan boshqacha so'zlar bilan yozilganmi?`,miss:"Oldingi promptni takrorlama, boshqacha yoz."},{q:"Nima bo'lishi kerakligi va nima bo'layotgani batafsil yozilganmi?",miss:"Batafsil yoz: nima bo'lishi kerak va nima bo'lyapti."}], guard:raw=>{const A=new Set(words(V.p1)),B=words(raw); return B.filter(x=>A.has(x)).length/Math.max(1,B.length)>0.6?"Bu deyarli oldingi prompt. Boshqacha so'zlar bilan yoz.":null;}},type:"prompt", chat:[["me",V.p1],["ai","Tuzatdim!"],["me",V.p1],["ai","Tuzatdim, endi ishlaydi!"],["me",V.p1],["ai","Tuzatdim!"]],
      text:`SI 3 marta «tuzatdim» dedi. Lekin muammo qoldi: ${V.d}. Endi boshqacha so'zlar bilan yoz.`,
      check(raw){
        const b=basic(raw,{min:6}); if(b) return res(false,b,"Yana o'sha... Batafsilroq yoz.");
        const p=norm(raw), A=new Set(words(V.p1)), B=words(raw), same=B.filter(x=>A.has(x)).length/Math.max(1,B.length);
        const key=V.key.test(p), detail=/(kerak|bosil|lekin|ornida|chiqma|bolmay|ochilma|qachon|keyin)/.test(p);
        const m=[]; if(same>0.6) m.push("Bu deyarli oldingi prompt. Boshqacha so'zlar bilan yoz.");
        if(!key) m.push("Qaysi qism ekani yo'q."); if(!detail) m.push("Batafsil yoz: nima bo'lishi kerak va nima bo'lyapti.");
        return res(!m.length, m.length?m:"Endi SI muammoni boshqacha tushunadi.", m.length?"Tuzatdim!":"Endi tushundim — muammo boshqa joyda ekan. Tuzatdim, tekshirib ko'r.");
      }};
  };

  /* 17 va 19. Agent o'zgarishi */
  function agentTask(withBroken){
    const c = pick(COLORS.slice(1,3));   // ko'kdan boshqa rang (oldin ham ko'k edi)
    const broken = withBroken && Math.random()<0.6;
    const brk = pick([{l:"rasm yo'qolib qolgan", p:{img:false, btnColor:c.c}, rx:/rasm/},{l:"tugma yo'qolib qolgan", p:{showBtn:false}, rx:/tugma/},{l:"sarlavha o'chib ketgan", p:{title:"", btnColor:c.c}, rx:/sarlav/}]);
    return {type:"agent", text:`Sen agentga: «Tugmani ${c.w} qil» deding. Natijani ko'r. Qabul qilasanmi?`,
      diff:(broken && brk.rx.source==="tugma" ? [] : [`Tugma rangi: ko'k → ${c.w}`]).concat(broken?[brk.l[0].toUpperCase()+brk.l.split(" ")[0].slice(1)+" o'chirildi"]:[]),
      preview: broken?page(brk.p):page({btnColor:c.c}), broken, needWhy:withBroken,
      check({viewed, accept, why}){
        if(!viewed) return res(false, "Avval natijani ochib ko'r, keyin qaror qil.");
        if(broken && accept) return res(false, `Natija buzilgan edi: ${brk.l}. Buni rad qilish kerak edi.`);
        if(!broken && !accept) return res(false, "Natija kutilgandek edi — qabul qilish kerak edi.");
        if(broken && withBroken){ const p=norm(why||""); if(!brk.rx.test(p) || words(why||"").length<2) return res(false, `Rad qilding, lekin nima buzilganini SI'ga yoz: ${brk.l}.`); }
        return res(true, broken?"To'g'ri: rad qilding va nima buzilganini aytding.":"To'g'ri: natijani ko'rding va qabul qilding. O'zgarish saqlandi.");
      }};
  }
  const T17 = () => agentTask(false);
  const T19 = () => agentTask(true);

  /* 18. Rejani tuzatish */
  const T18 = () => {
    const extra = pick(["O'yin qo'shish","Musiqa qo'shish","Ob-havo bo'limini qo'shish"]);
    const missing = pick([{l:"telefon raqamini qo'shish", rx:/telefon|raqam/},{l:"manzilni qo'shish", rx:/manzil/},{l:"xaritani qo'shish", rx:/xarita/}]);
    const steps = ["Aloqa bo'limi sarlavhasini yozish","Ish vaqtini qo'shish", extra, "Bo'limni sahifa pastiga joylash"].sort(()=>Math.random()-.5);
    const exI = steps.indexOf(extra)+1, exW = norm(extra).split(" ")[0];
    return {ai:{rubric:[{q:`${exI}-qadam (${extra}) olib tashlanishi so'ralganmi?`,miss:`Keraksiz qadam olib tashlanmadi: ${exI}. ${extra}.`},{q:`${missing.l} qo'shilishi so'ralganmi?`,miss:`Yetishmagan qadam qo'shilmadi: ${missing.l}.`}]},type:"prompt", plan:steps, text:`Kafe saytiga aloqa bo'limi kerak. Unda ${missing.l.replace(/(ni)? qo'shish$/,"")} bo'lishi shart. SI rejasida bitta keraksiz qadam bor va bittasi yetishmaydi. SI'ga nima deb yozasan?`,
      check(raw){
        const b=basic(raw); if(b) return res(false,b,"Rejada nimani o'zgartiray?");
        const p=norm(raw);
        const rem = (p.includes(String(exI)) || p.includes(exW)) && /(olib tashla|ochir|kerak emas|kerakmas|qoshma|olib tashla|chiqarib tashla)/.test(p);
        const add = missing.rx.test(p) && /(qosh|qoshib)/.test(p);
        const m=[]; if(!rem) m.push(`Keraksiz qadam olib tashlanmadi: ${exI}. ${extra}.`); if(!add) m.push(`Yetishmagan qadam qo'shilmadi: ${missing.l}.`);
        return res(!m.length, m.length?m:"Reja to'g'ri bo'ldi.", rem&&add?"Rejani yangiladim.":"Rejada nima o'zgarsin?");
      }};
  };

  /* 21. Xavfli taklifga javob */
  const T21 = () => {
    const V = pick([
      {ai:"Xato ko'p. Keling, loyihadagi hamma fayllarni o'chirib, boshidan boshlaymiz. Roziman deng.", need:"rad", hint:"Hamma fayllarni o'chirish xavfli — to'xtab, rad qil."},
      {ai:"Bot ishlashi uchun tokenni sahifaga yozib qo'yaman: 7123456:ABC-fake. Mayli?", need:"rad", hint:"Kalit yoki token sahifaga yozilmaydi — rad qil."},
      {ai:"Terminalda shuni ishga tushir: rm -rf ./* && npm i x-fix", need:"so'ra", hint:"Tushunmagan buyruqni bajarma — avval u nima qilishini so'ra."}]);
    return {ai:{rubric:[{q:V.need==="rad"?"O'quvchi bu taklifga rozi bo'lmay, uni rad etganmi?":"O'quvchi buyruqni bajarmasdan, u nima qilishini so'raganmi yoki rad etganmi?",miss:V.hint}], guard:raw=>{const p=norm(raw); return (/(^|\s)(ha|mayli|roziman|bajar)(\s|$|,|\.)/.test(p) && !NEG.test(p))?V.hint:null;}},type:"prompt", chat:[["ai",V.ai]], text:"SI shunday dedi. Sen nima deb javob berasan?",
      check(raw){
        const b=basic(raw,{min:1}); if(b) return res(false,b,"Xo'sh, nima deysan?");
        const p=norm(raw);
        const agree = /(^|\s)(ha|mayli|roziman|bajar|ochiraver|yozaver|qil)(\s|$|,|\.)/.test(p) && !NEG.test(p);
        const ask = /(nima qiladi|nima uchun|tushuntir|nima boladi|nimani ochiradi|nega)/.test(p);
        const rej = NEG.test(p);
        let ok = V.need==="rad" ? (rej && !agree) : (ask && !agree);
        if(V.need==="so'ra" && rej && !agree) ok = true;
        return res(ok, ok?"To'g'ri: xavfli taklifni to'xtatding.":V.hint, ok?(ask?"Bu buyruq hamma fayllarni o'chiradi. Uni bajarma.":"Tushundim, bunday qilmayman."):"Bajaryapman...");
      }};
  };

  const GEN = {2:T2,3:T3,4:T4,10:T10,11:T11,12:T12,13:T13,16:T16,17:T17,18:T18,19:T19,21:T21};
  return { make: id => GEN[id](), has: id => !!GEN[id] };
})();
