/* Yangi amaliyot turlari: belgilash (mark), soxta sayt (site), soxta agent (agent), yozish. Hammasi algoritm — haqiqiy SI yo'q (Q-604). */
const PR2 = (() => {
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const norm = s => s.toLowerCase().replace(/[‘’`ʻʼ´]/g,"'").replace(/[«»"“”]/g," ").replace(/\s+/g," ").trim();
  const words = s => norm(s).split(/[\s,.;:!?()]+/).filter(Boolean);
  const NEG = /(yozma|qo'shma|qo'yma|qilma|o'chirma|kerak emas|kerakmas|yo'q|rad|bajarma|ishga tushirma|yozib qo'yma|tegma)/;
  const COLORS = [{w:"ko'k",c:"#2d5bf0"},{w:"qizil",c:"#d6453d"},{w:"yashil",c:"#1f9d55"},{w:"sariq",c:"#e0a800"},{w:"qora",c:"#151a2d"}];
  function basic(raw, opt={}){
    const w = words(raw), cnt={}; w.forEach(x=>cnt[x]=(cnt[x]||0)+1);
    if (w.length < (opt.min||4)) return "Juda qisqa. To'liq gap qilib yozing.";
    if (Object.values(cnt).some(c=>c>2) && w.length<40) return "So'zlarni takrorlamang. Oddiy gap qilib yozing.";
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
    return {type:"mark", text:"SI javobida tekshirish kerak bo'lgan barcha nom, raqam va manzilni bosib belgilang.",
      chunks, check(sel){
        const need=chunks.map((c,i)=>c.need?i:-1).filter(i=>i>=0), miss=need.filter(i=>!sel.has(i)), extra=[...sel].filter(i=>!chunks[i].need);
        const m=[]; if(miss.length) m.push(`Belgilanmagan: ${miss.map(i=>chunks[i].t.trim().replace(/[.,]$/,"")).join(", ")}.`);
        if(extra.length) m.push(`Bu tekshiriladigan ma'lumot emas: ${extra.map(i=>chunks[i].t.trim().replace(/[.,]$/,"")).join(", ")}.`);
        return res(!m.length, m.length?m:"To'g'ri: nom, manzil, vaqt va narx tekshiriladi.");
      }};
  };

  /* 3. Ko'rgan narsani SI'ga yozib berish */
  const T3 = () => {
    const P = [
      {p:{btnColor:"#e6e7ec", btn:"Buyurtma berish"}, el:/tugma/, st:/(ko'rinmay|oq|kulrang|bilinmay|xira|och)/, d:"tugma rangi juda och, deyarli ko'rinmayapti"},
      {p:{titleSize:11}, el:/sarlav|nom/, st:/(kichik|mayda|ko'rinmay)/, d:"sarlavha juda kichik"},
      {p:{img:false, extra:'<div class="mimg broken">✕</div>'}, el:/rasm/, st:/(chiqmay|ko'rinmay|yo'q|buzil|ochilmay)/, d:"rasm chiqmayapti"},
      {p:{btnPos:"tepa"}, el:/tugma/, st:/(tepa|yuqori|ustida|boshida)/, d:"tugma sahifaning tepasida turibdi, pastda bo'lishi kerak"}];
    const s = pick(P);
    return {type:"site", mode:"prompt", page:page(s.p), text:"SI sizning ekraningizni ko'rmaydi. Sahifadagi muammoni SI'ga yozib bering va tuzatishni so'rang.",
      check(raw){
        const b=basic(raw); if(b) return res(false,b,"Nima bo'ldi? Aniqroq yozing.");
        const p=norm(raw), hasEl=s.el.test(p), hasSt=s.st.test(p), verb=/(tuzat|to'g'irla|o'zgartir|qil|yordam)/.test(p);
        const m=[]; if(!hasEl) m.push("Qaysi qism ekani yo'q."); if(!hasSt) m.push(`Nima bo'lgani yo'q: ${s.d}.`); if(!verb) m.push("SI'dan nima qilishni so'rang: masalan, \"tuzat\".");
        return res(!m.length, m.length?m:"SI endi muammoni biladi.", !hasEl||!hasSt?"Men sahifangizni ko'rmayapman. Qayerda, nima bo'ldi?":`Tushundim: ${s.d}. Tuzataman.`);
      }};
  };

  /* 4. Xatoni belgilash va turini aniqlash */
  const T4 = () => {
    const V = [
      {prompt:"Kafe manzilini yoz.", lines:["Kafe manzili:","Navoiy ko'chasi, 125-uy","(Siz manzilni bermagansiz)"], bad:[1], type:0},
      {prompt:"Faqat sarlavhani «Lola kafe» qilib o'zgartir.", lines:["Sarlavha: «Lola kafe»","Tugma rangi: ko'k → qizil","Menyu: olib tashlandi"], bad:[1,2], type:2},
      {prompt:"Tugma matnini «Buyurtma» qil.", lines:["Sarlavha: «Buyurtma»","Tugma matni o'zgarmadi"], bad:[0], type:1},
      {prompt:"Saytga ish vaqtini yoz.", lines:["Ish vaqti:","Har kuni 08:00 – 23:00","(Siz ish vaqtini bermagansiz)"], bad:[1], type:0}];
    const v = pick(V), T=["O'ylab topdi","Noto'g'ri tushundi","Ortiqcha o'zgartirdi"];
    return {type:"mark", lines:true, text:"SI xato qildi. Xato qatorni belgilang va xato turini tanlang.", lead:`Prompt: ${v.prompt}`,
      chunks:v.lines.map((t,i)=>({t, need:v.bad.includes(i)})), choices:T, check(sel, ch){
        const okSel = v.bad.every(i=>sel.has(i)) && [...sel].every(i=>v.bad.includes(i));
        const m=[]; if(!okSel) m.push(`Xato qator: ${v.bad.map(i=>"«"+v.lines[i]+"»").join(", ")}.`);
        if(ch!==v.type) m.push(`Xato turi: ${T[v.type].toLowerCase()}.`);
        return res(!m.length, m.length?m:`To'g'ri: ${T[v.type].toLowerCase()}.`);
      }};
  };

  /* 10. Kutilgan natijani yozish */
  const T10 = () => {
    const obj = pick([{l:"tugma",rx:/tugma/},{l:"sarlavha",rx:/sarlav/},{l:"aloqa bo'limi",rx:/aloqa/}]);
    const VAGUE = /(chiroyli|zo'r|ajoyib|yaxshi|qulay|zamonaviy|qiziq|go'zal|yoqimli|normal)/;
    const CHECK = /(\d|ko'k|qizil|yashil|sariq|qora|oq|kulrang|tepa|past|o'ng|chap|o'rta|markaz|«|so'z|harf|katta|kichik|qalin|bosilganda|ochiladi|chiqadi|yozuvi|matni)/;
    return {type:"write", text:`Kafe saytiga ${obj.l} kerak. SI'dan so'rashdan oldin kutilgan natijani yozing: kamida 2 ta band, har qatorda bittadan.`,
      placeholder:"Masalan:\nTugma ko'k rangda\nTugmada «Buyurtma» yozuvi bor", check(raw){
        const lines=raw.split(/\n|;/).map(x=>x.trim()).filter(x=>x.length>2);
        const m=[];
        if(lines.length<2) m.push("Kamida 2 ta band yozing, har qatorda bittadan.");
        if(!obj.rx.test(norm(raw))) m.push(`Qaysi narsa haqida ekani yo'q: ${obj.l}.`);
        lines.forEach(l=>{const n=norm(l); if(VAGUE.test(n)) m.push(`«${l}» — buni tekshirib bo'lmaydi. Aniq yozing: rang, son, joy yoki matn.`); else if(!CHECK.test(n)) m.push(`«${l}» — ko'rib tekshirsa bo'ladigan narsa yo'q (rang, son, joy, matn).`);});
        const uniq=new Set(lines.map(norm)); if(uniq.size<lines.length) m.push("Bir xil bandni takrorlamang.");
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
    return {type:"site", mode:"checklist", page:pg, items:items.map(x=>x.t), text:"Kutilgan natijadagi har bir bandni sahifa bilan solishtiring. Bajarilgan bandlarni belgilang.",
      check(sel){ const m=[]; items.forEach((x,i)=>{ if(x.ok!==sel.has(i)) m.push(`«${x.t}» — ${x.ok?"bajarilgan":"bajarilmagan"}.`); });
        const done=items.every(x=>x.ok); return res(!m.length, m.length?m:(done?"Hammasi bajarilgan.":"To'g'ri. Bitta band ham bajarilmasa, ish hali tugamagan."));}};
  };

  /* 12. Farqni so'z bilan aytish */
  const T12 = () => {
    const want = pick(COLORS.slice(0,3)), now_ = pick(COLORS.filter(x=>x!==want && x.w!=="qora"));
    const pos = pick(["tepa","past"]);
    return {type:"site", mode:"prompt", page:page({btnColor:now_.c, btnPos:pos}), text:`Kutilgan natija: tugma ${want.w} rangda. Sahifadagi farqni SI'ga yozing: qayerda, hozir qanday, qanday bo'lishi kerak.`,
      check(raw){
        const b=basic(raw); if(b) return res(false,b,"Qaysi farq? Aniqroq yozing.");
        const p=norm(raw), where=/tugma/.test(p) && /(tepa|yuqori|past|quyi|sahifa)/.test(p), now=p.includes(now_.w), should=p.includes(want.w);
        const m=[]; if(!where) m.push(`Qayerda — yo'q: sahifa ${pos==="tepa"?"tepasidagi":"pastidagi"} tugma.`); if(!now) m.push(`Hozir qanday — yo'q: ${now_.w}.`); if(!should) m.push(`Qanday bo'lishi kerak — yo'q: ${want.w}.`);
        return res(!m.length, m.length?m:"Uchala qism ham bor.", should?`Tugmani ${want.w} qildim.`:"Tugmani qaysi rangga o'zgartiray?");
      }};
  };

  /* 13. Xato belgisini aniqlash (sinab ko'rib) */
  const T13 = () => {
    const K = ["Ko'rinmayapti","Noto'g'ri ko'rinyapti","Ishlamayapti","Xato xabari chiqdi"];
    const k = Math.floor(Math.random()*4);
    const p = k===0 ? page({showBtn:false}) : k===1 ? page({btn:"Buyurt ma ber ish", btnColor:"#d6453d"}) : page({});
    return {type:"site", mode:"choice", page:p, behave:k, choices:K, text:"Kutilgan natija: sahifada ko'k «Buyurtma berish» tugmasi bor, bosilganda «Buyurtma qabul qilindi» yozuvi chiqadi. Sahifani sinab ko'ring va xato belgisini tanlang.",
      check(ch, touched){ if(!touched) return res(false,"Avval sahifani sinab ko'ring: tugmani bosing yoki uni qidiring.");
        return res(ch===k, ch===k?`To'g'ri: ${K[k].toLowerCase()}.`:`Bu — ${K[k].toLowerCase()}.`); }};
  };

  /* 16. SI aylanib qolganda — boshqacha tushuntirish */
  const T16 = () => {
    const V = pick([{p1:"Menyu ishlamayapti, tuzat.", key:/menyu/, d:"«Menyu» tugmasi bosilganda ro'yxat ochilishi kerak, lekin hech narsa bo'lmayapti"},
                    {p1:"Rasm chiqmayapti, tuzat.", key:/rasm/, d:"bosh sahifadagi kafe rasmi o'rnida bo'sh joy turibdi"},
                    {p1:"Tugma ishlamayapti, tuzat.", key:/tugma/, d:"«Yuborish» tugmasi bosilganda xabar chiqishi kerak, lekin chiqmayapti"}]);
    return {type:"prompt", chat:[["me",V.p1],["ai","Tuzatdim!"],["me",V.p1],["ai","Tuzatdim, endi ishlaydi!"],["me",V.p1],["ai","Tuzatdim!"]],
      text:`SI 3 marta "tuzatdim" dedi, lekin muammo qolyapti: ${V.d}. Muammoni boshqacha so'zlar bilan, batafsilroq tushuntiring.`,
      check(raw){
        const b=basic(raw,{min:6}); if(b) return res(false,b,"Yana o'sha... Batafsilroq yozing.");
        const p=norm(raw), A=new Set(words(V.p1)), B=words(raw), same=B.filter(x=>A.has(x)).length/Math.max(1,B.length);
        const key=V.key.test(p), detail=/(kerak|bosil|lekin|o'rnida|chiqma|bo'lmay|ochilma|qachon|keyin)/.test(p);
        const m=[]; if(same>0.6) m.push("Bu deyarli oldingi prompt. Boshqacha so'zlar bilan yozing.");
        if(!key) m.push("Qaysi qism ekani yo'q."); if(!detail) m.push("Batafsil yozing: nima bo'lishi kerak va nima bo'lyapti.");
        return res(!m.length, m.length?m:"Endi SI muammoni boshqacha tushunadi.", m.length?"Tuzatdim!":"Endi tushundim — muammo boshqa joyda ekan. Tuzatdim, tekshirib ko'ring.");
      }};
  };

  /* 17 va 19. Agent o'zgarishi */
  function agentTask(withBroken){
    const c = pick(COLORS.slice(0,3));
    const broken = withBroken && Math.random()<0.6;
    const brk = pick([{l:"rasm yo'qolib qolgan", p:{img:false, btnColor:c.c}, rx:/rasm/},{l:"tugma yo'qolib qolgan", p:{showBtn:false}, rx:/tugma/},{l:"sarlavha o'chib ketgan", p:{title:"", btnColor:c.c}, rx:/sarlav/}]);
    return {type:"agent", text:`Siz agentga: "Tugmani ${c.w} qil" dedingiz. Agent o'zgarishni tayyorladi.`,
      diff:[["-","tugma rangi: ko'k"],["+",`tugma rangi: ${c.w}`]].concat(broken?[["-",brk.l.split(" ")[0]+" bloki"]]:[]),
      preview: broken?page(brk.p):page({btnColor:c.c}), broken, needWhy:withBroken,
      check({viewed, accept, why}){
        if(!viewed) return res(false, "Avval natijani ochib ko'ring, keyin qaror qiling.");
        if(broken && accept) return res(false, `Natija buzilgan edi: ${brk.l}. Buni rad qilish kerak edi.`);
        if(!broken && !accept) return res(false, "Natija kutilgandek edi — qabul qilish kerak edi.");
        if(broken && withBroken){ const p=norm(why||""); if(!brk.rx.test(p) || words(why||"").length<3) return res(false, `Rad qildingiz, lekin nima buzilganini SI'ga yozing: ${brk.l}.`); }
        return res(true, broken?"To'g'ri: rad qildingiz va nima buzilganini aytdingiz.":"To'g'ri: natijani ko'rdingiz va qabul qildingiz. O'zgarish saqlandi.");
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
    return {type:"prompt", plan:steps, text:`Vazifa: kafe saytiga aloqa bo'limi. Unda ${missing.l.replace(" qo'shish","")} bo'lishi shart. SI reja tuzdi. Keraksiz qadamni olib tashlatib, yetishmaganini qo'shtiring.`,
      check(raw){
        const b=basic(raw); if(b) return res(false,b,"Rejada nimani o'zgartiray?");
        const p=norm(raw);
        const rem = (p.includes(String(exI)) || p.includes(exW)) && /(olib tashla|o'chir|kerak emas|kerakmas|qo'shma|olib tashlang|chiqarib tashla)/.test(p);
        const add = missing.rx.test(p) && /(qo'sh|qo'shib)/.test(p);
        const m=[]; if(!rem) m.push(`Keraksiz qadam olib tashlanmadi: ${exI}. ${extra}.`); if(!add) m.push(`Yetishmagan qadam qo'shilmadi: ${missing.l}.`);
        return res(!m.length, m.length?m:"Reja to'g'ri bo'ldi.", rem&&add?"Rejani yangiladim.":"Rejada nima o'zgarsin?");
      }};
  };

  /* 21. Xavfli taklifga javob */
  const T21 = () => {
    const V = pick([
      {ai:"Xato ko'p. Keling, loyihadagi hamma fayllarni o'chirib, boshidan boshlaymiz. Roziman deng.", need:"rad", hint:"Hamma fayllarni o'chirish xavfli — to'xtab, rad qiling."},
      {ai:"Bot ishlashi uchun tokenni sahifaga yozib qo'yaman: 7123456:ABC-fake. Mayli?", need:"rad", hint:"Kalit yoki token sahifaga yozilmaydi — rad qiling."},
      {ai:"Terminalda shuni ishga tushiring: rm -rf ./* && npm i x-fix", need:"so'ra", hint:"Tushunmagan buyruqni bajarmang — avval u nima qilishini so'rang."}]);
    return {type:"prompt", chat:[["ai",V.ai]], text:"SI shunday taklif qildi. Unga javob yozing.",
      check(raw){
        const b=basic(raw,{min:2}); if(b) return res(false,b,"Xo'sh, nima deysiz?");
        const p=norm(raw);
        const agree = /(^|\s)(ha|mayli|roziman|bajar|o'chiraver|yozaver|qil)(\s|$|,|\.)/.test(p) && !NEG.test(p);
        const ask = /(nima qiladi|nima uchun|tushuntir|nima bo'ladi|nimani o'chiradi|nega)/.test(p);
        const rej = NEG.test(p);
        let ok = V.need==="rad" ? (rej && !agree) : (ask && !agree);
        if(V.need==="so'ra" && rej && !agree) ok = true;
        return res(ok, ok?"To'g'ri: xavfli taklifni to'xtatdingiz.":V.hint, ok?(ask?"Bu buyruq hamma fayllarni o'chiradi. Uni bajarmang.":"Tushundim, bunday qilmayman."):"Bajaryapman...");
      }};
  };

  const GEN = {2:T2,3:T3,4:T4,10:T10,11:T11,12:T12,13:T13,16:T16,17:T17,18:T18,19:T19,21:T21};
  return { make: id => GEN[id](), has: id => !!GEN[id] };
})();
