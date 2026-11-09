/* Algoritmli amaliyot — "soxta SI" (Q-604). Haqiqiy SI ham, SI tekshiruvchi ham yo'q. */
const PR = (() => {
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
  const RX = (x,fl) => new RegExp(String(x).replace(/'/g,""),fl);
  const NEG = "(yozma|qo'shma|qo'yma|ishlatma|bo'lmasin|kerak emas|kerakmas|tegma|o'zgartirma|qilma|chiqarma|olma)";

  /* Hamma amaliyot uchun umumiy tekshiruvlar */
  function common(raw, taskText, opt={}){
    const p = norm(raw), w = words(raw), r = {p};
    const cnt = {}; w.forEach(x=>cnt[x]=(cnt[x]||0)+1);
    r.spam = Object.entries(cnt).some(([x,c])=>c>=5 || (c>=3 && !STOP.test(x))) && w.length < 40;
    r.short = w.length < (opt.minWords||5);
    if (!opt.noCopy) {
      const tw = words(taskText), grams = new Set();
      for (let i=0;i+5<=tw.length;i++) grams.add(tw.slice(i,i+5).join(" "));
      let hit=0; for (let i=0;i+5<=w.length;i++) if (grams.has(w.slice(i,i+5).join(" "))) hit++;
      r.copy = (grams.size && hit/grams.size >= 0.7) || (opt.marker ? opt.marker.test(p) : false);
    } else r.copy = false;
    r.verb = (opt.verb || /(yoz|tuz|yarat|oylab|taklif|qil|ozgartir|yangila|almashtir|tuzat|togirla|tushuntir|yordam|nega|sabab|hal qil|ol\b|ber\b)/).test(p);
    return r;
  }
  function gate(r){
    if (r.copy) return {msg:["Topshiriq matnini ko'chirmang. Promptni o'zingiz yozing."], ans:"Bu topshiriq matni-ku. Menga nima qilishimni o'zingiz yozing."};
    if (r.spam) return {msg:["So'zlarni takrorlamang. Oddiy gap qilib yozing."], ans:"Bir xil so'zlar ko'p. Gapni oddiy yozing."};
    if (r.short || !r.verb) return {msg:["SI'ga nima qilishni yozing: masalan, \"... yoz\" yoki \"... tuzat\"."], ans:"Salom! Nima qilishim kerak? Aniqroq yozing."};
    return null;
  }
  /* bitta bo'lak ichida so'z va inkor birga kelganmi ("narx yozma", "narxsiz") */
  function negated(p, rx){
    return p.split(/[.,;!?]| va | lekin /).some(part => rx.test(part) && RX(NEG).test(part));
  }

  /* ---------- 5. Aniq vazifa berish ---------- */
  const T5 = () => {
    const TYPES = {
      kafe:{l:"kafe", t:{uz:"eng mazali taomlar shu yerda",ru:"самые вкусные блюда здесь",en:"the tastiest food in town"}},
      gul:{l:"gul do'koni", t:{uz:"eng chiroyli gullar shu yerda",ru:"самые красивые цветы здесь",en:"the most beautiful flowers in town"}},
      sport:{l:"sport zali", t:{uz:"kuchli bo'lish shu yerdan boshlanadi",ru:"сила начинается здесь",en:"your strength starts here"}},
      kitob:{l:"kitob do'koni", t:{uz:"har bir kitob yangi dunyo",ru:"каждая книга — новый мир",en:"every book is a new world"}}};
    const LANG = {uz:"o'zbekcha",ru:"ruscha",en:"inglizcha"}, RXL = {uz:/o?zbek|uzbek/, ru:/rus/, en:/ingliz|angliz|english/};
    const LONG = {uz:": har kuni sizni kutamiz, do'stlaringiz bilan keling!",ru:": ждём вас каждый день, приходите с друзьями!",en:": we wait for you every day, come with friends!"};
    const NUMW = {7:["7","yetti"],8:["8","sakkiz"]};
    const k = {type:pick(Object.keys(TYPES)), name:pick(["Lola","Bahor","Sevara","Zafar","Anvar","Nilufar"]), lang:pick(Object.keys(LANG)), limit:pick([7,8])};
    const text = `«${k.name}» ${TYPES[k.type].l} ochildi. Saytiga sarlavha kerak: ${LANG[k.lang]}, ${k.limit} so'zdan oshmasin.`;
    return { text, ai:{rubric:[{q:"Promptda sarlavha (bosh yozuv) so'ralganmi?",miss:"Nima kerakligi yo'q: sarlavha."},{q:`«${k.name}» nomi bormi?`,miss:`Nomi yo'q: «${k.name}».`},{q:`Til ${LANG[k.lang]} ekani aytilganmi (boshqa til emas)?`,miss:`Til yo'q yoki noto'g'ri: ${LANG[k.lang]}.`},{q:`Uzunlik ${k.limit} so'zdan oshmasligi aytilganmi?`,miss:`Uzunlik yo'q: ${k.limit} so'zdan oshmasin.`}]}, check(raw){
      const r = common(raw, text, {marker:/ochildi|kerak:/}), g = gate(r); if (g) return {ok:false, ...g};
      const p = r.p, langs = Object.keys(RXL).filter(l=>RXL[l].test(p));
      const has = { obj:/sarlav/.test(p), name:p.includes(k.name.toLowerCase()),
        lang: langs.length===1 && langs[0]===k.lang,
        limit: NUMW[k.limit].some(n=>RX("(^|[^0-9a-z'])"+n+"( ta)? so'z(dan|li|gacha| bo'l)").test(p)) };
      const m=[];
      if(!has.obj) m.push("Nima kerakligi yo'q: sarlavha.");
      if(!has.name) m.push(`Nomi yo'q: «${k.name}».`);
      if(langs.length>1) m.push("Ikki xil til yozilgan. Bittasini yozing.");
      else if(langs.length===1 && !has.lang) m.push(`Til noto'g'ri: ${LANG[k.lang]} kerak edi.`);
      else if(!has.lang) m.push(`Til yo'q: ${LANG[k.lang]}.`);
      if(!has.limit) m.push(`Uzunlik yo'q: ${k.limit} so'zdan oshmasin.`);
      if(!has.obj) return {ok:false,msg:m,ans:"Nima yozay? Sarlavhami, matnmi?"};
      const lang = has.lang ? k.lang : (langs[0] || (k.lang==="ru"?"en":"ru"));
      const ph = TYPES[k.type].t[lang];
      let ans = has.name ? `${k.name} — ${ph}` : ph[0].toUpperCase()+ph.slice(1);
      if(!has.limit) ans += LONG[lang];
      return {ok:!m.length, msg:m.length?m:["Promptda hammasi bor: nima kerak, nomi, tili va uzunligi."], ans};
    }};
  };

  /* ---------- 6. Kontekst berish ---------- */
  const T6 = () => {
    const TY = [{l:"kafe",rx:/kafe|oshxona|restoran/,w:"mazali taomlar"},{l:"gul do'koni",rx:/gul/,w:"chiroyli gullar"},{l:"sport zali",rx:/sport|zal\b|fitnes/,w:"kuchli mashg'ulotlar"},{l:"kitob do'koni",rx:/kitob/,w:"qiziqarli kitoblar"}];
    const AU = [{l:"talabalar",rx:/talaba|student/,s:"Darsdan keyin dam olishga keling!"},{l:"12–15 yoshli bolalar",rx:/bola|osmir|yoshli|maktab/,s:"Qiziqarli narsalar seni kutmoqda!"},{l:"keksa odamlar",rx:/keksa|qariya|katta yosh|nafaqa/,s:"Sizni hurmat bilan kutamiz."},{l:"ota-onalar",rx:/ota-ona|ota ona|onalar|otalar/,s:"Farzandingiz bilan keling!"}];
    const ty = pick(TY), au = pick(AU), name = pick(["Orzu","Bahor","Lola","Yulduz"]);
    const text = `«${name}» — bu ${ty.l}. Uning saytiga qisqa xush kelibsiz matni kerak. Saytga asosan ${au.l} kiradi.`;
    return { text, ai:{rubric:[{q:"Xush kelibsiz (salomlashish) matni so'ralganmi?",miss:"Nima kerakligi yo'q: xush kelibsiz matni."},{q:`Loyiha ${ty.l} ekani aytilganmi?`,miss:`Loyiha nima haqida ekani yo'q: ${ty.l}.`},{q:`Saytga ${au.l} kirishi aytilganmi?`,miss:`Kim uchun ekani yo'q: ${au.l}.`}]}, check(raw){
      const r = common(raw, text), g = gate(r); if (g) return {ok:false, ...g};
      const p=r.p, obj=/xush kelib|salomla|kutib ol|matn/.test(p), hT=ty.rx.test(p), hA=au.rx.test(p);
      const m=[];
      if(!obj) m.push("Nima kerakligi yo'q: xush kelibsiz matni.");
      if(!hT) m.push(`Loyiha nima haqida ekani yo'q: ${ty.l}.`);
      if(!hA) m.push(`Kim uchun ekani yo'q: ${au.l}.`);
      if(!obj) return {ok:false,msg:m,ans:"Qanday matn kerak? Aniqroq yozing."};
      const ans = `Saytimizga xush kelibsiz! ${hT?`Bu yerda ${ty.w}.`:"Bu yerda siz uchun hamma narsa bor."} ${hA?au.s:"Hurmatli mijozlar, xizmatlarimizdan foydalaning."}`;
      return {ok:!m.length, msg:m.length?m:["Kontekst to'liq: loyiha nima haqida va kim uchun."], ans};
    }};
  };

  /* ---------- 7. Cheklov berish ---------- */
  const T7 = () => {
    const PART = [{l:"sarlavha",acc:"sarlavhani",rx:/sarlav/,v:"Yangi sarlavha"},{l:"tugma matni",acc:"tugma matnini",rx:/tugma/,v:"Yangi tugma matni"},{l:"pastki yozuv",acc:"pastki yozuvni",rx:/pastki/,v:"Yangi pastki yozuv"}];
    const NO = [{l:"narx",rx:/narx/,add:"narxi 25 000 so'm"},{l:"rasm",rx:/rasm/,add:"yoniga rasm qo'shdim"},{l:"telefon raqami",rx:/telefon|raqam/,add:"tel: +998 90 000 00 00"}];
    const pt = pick(PART), no = pick(NO);
    const text = `Saytdagi ${pt.l} yangilanishi kerak. Saytning qolgan qismi o'zgarmasin. Yangi yozuvda ${no.l} bo'lmasin.`;
    return { text, ai:{rubric:[{q:`${pt.l} o'zgartirilishi so'ralganmi?`,miss:`Nimani o'zgartirish kerakligi yo'q: ${pt.l}.`},{q:"Saytning qolgan qismiga tegmaslik (faqat shuni o'zgartirish) aytilganmi?",miss:"Qolgan qismga tegmaslik aytilmagan."},{q:`Yangi yozuvda ${no.l} bo'lmasligi aytilganmi?`,miss:`Cheklov yo'q: ${no.l} bo'lmasin.`}]}, check(raw){
      const r = common(raw, text), g = gate(r); if (g) return {ok:false, ...g};
      const p=r.p;
      const hasPart = pt.rx.test(p);
      const rest = /faqat/.test(p) || (/(qolgan|boshqa|hech nima|hech narsa)/.test(p) && RX(NEG+"|o'zgarmasin|tegmasin|qoldir").test(p));
      const noOk = negated(p, no.rx) || RX(no.rx.source+"[a-z']*siz").test(p);
      const m=[];
      if(!hasPart) m.push(`Nimani o'zgartirish kerakligi yo'q: ${pt.l}.`);
      if(!rest) m.push("Qolgan qismga tegmaslik aytilmagan.");
      if(!noOk) m.push(`Cheklov yo'q: ${no.l} bo'lmasin.`);
      if(!hasPart) return {ok:false,msg:m,ans:"Nimani o'zgartiray? Aniqroq yozing."};
      let ans = `${pt.v}: «Bugun hammasi yangi»`;
      if(!noOk) ans += `, ${no.add}`;
      ans += ".";
      if(!rest) ans += " Menyu rangini va rasmlarni ham yangiladim.";
      return {ok:!m.length, msg:m.length?m:["Ikkala cheklov ham bor."], ans};
    }};
  };

  /* ---------- 8. Misol bilan tushuntirish ---------- */
  const T8 = () => {
    const OBJ = [{l:"tugma",rx:/tugma/},{l:"sarlavha",rx:/sarlav/},{l:"menyu",rx:/menyu/}];
    const AT = [{l:"rangini",rx:/rang/,d:"ko'k rangli"},{l:"shaklini",rx:/shakl|dumaloq|burchak/,d:"dumaloq burchakli"},{l:"o'lchamini",rx:/olcham|kattalig|hajm/,d:"katta o'lchamli"}];
    const o = pick(OBJ), a = pick(AT), site = pick(["Bahor","Orzu","Yulduz","Nur"]);
    const text = `Sizga yangi ${o.l} kerak. «${site}» saytidagi ${o.l} sizga yoqdi. Undan faqat ${a.l} olish kerak.`;
    return { text, ai:{rubric:[{q:`${o.l} so'ralganmi?`,miss:`Nima kerakligi yo'q: ${o.l}.`},{q:`Misol sifatida «${site}» saytidagi ${o.l} ko'rsatilganmi (yoki "shunga o'xshash" deyilganmi)?`,miss:`Misol ko'rsatilmagan: «${site}» saytidagi ${o.l}.`},{q:`Misoldan faqat ${a.l} olinishi aytilganmi?`,miss:`Misoldan nima olinishi aytilmagan: ${a.l}.`}]}, check(raw){
      const r = common(raw, text), g = gate(r); if (g) return {ok:false, ...g};
      const p=r.p;
      const hasObj=o.rx.test(p), hasEx=p.includes(site.toLowerCase()) || /(misol|namuna|oxshash|kabi|singari|xuddi)/.test(p), hasAt=a.rx.test(p);
      const m=[];
      if(!hasObj) m.push(`Nima kerakligi yo'q: ${o.l}.`);
      if(!hasEx) m.push(`Misol ko'rsatilmagan: «${site}» saytidagi ${o.l}.`);
      if(!hasAt) m.push(`Misoldan nima olinishi aytilmagan: ${a.l}.`);
      if(!hasObj) return {ok:false,msg:m,ans:"Nima qilay? Aniqroq yozing."};
      let ans;
      if(!hasEx) ans = `Oddiy kulrang ${o.l} qildim.`;
      else if(!hasAt) ans = `«${site}» saytidagi ${o.l}ni butunlay ko'chirdim: rangi, shakli, matni — hammasi bir xil.`;
      else ans = `Yangi ${o.l} tayyor: «${site}» saytidagidek ${a.d}, qolgani sizning saytingiz uslubida.`;
      return {ok:!m.length, msg:m.length?m:["Misol ham, undan nima olinishi ham bor."], ans};
    }};
  };

  /* ---------- 9. Katta vazifani qadamlarga bo'lish ---------- */
  const T9 = () => {
    const P = [{l:"sarlavha",rx:/sarlav/},{l:"menyu",rx:/menyu/},{l:"aloqa bo'limi",rx:/aloqa|kontakt/},{l:"rasmlar galereyasi",rx:/galereya|rasmlar/},{l:"narxlar jadvali",rx:/narx|jadval/}];
    const sh = P.slice().sort(()=>Math.random()-.5).slice(0,3);
    const text = `Kafe saytiga ${sh[0].l}, ${sh[1].l} va ${sh[2].l} kerak. Hammasi birdaniga emas: birinchi qadam — ${sh[0].l}.`;
    return { text, ai:{rubric:[{q:`Hozir faqat ${sh[0].l} qilish so'ralganmi?`,miss:`Birinchi qadam yo'q: ${sh[0].l}.`},{q:`${sh[1].l} va ${sh[2].l} hozir qilinishi so'ralmaganmi (aytilmagan yoki keyinga qoldirilgan)?`,miss:"Bitta promptda faqat bitta qadam so'rang."}]}, check(raw){
      const r = common(raw, text), g = gate(r); if (g) return {ok:false, ...g};
      const p=r.p, cut=p.search(/keyin|song|keyinroq|boshqasini/), head=cut>=0?p.slice(0,cut):p;
      const first=sh[0].rx.test(head), others=sh.slice(1).filter(x=>x.rx.test(head));
      const m=[];
      if(!first) m.push(`Birinchi qadam yo'q: ${sh[0].l}.`);
      if(others.length) m.push(`Bitta promptda faqat bitta qadam: ${others.map(x=>x.l).join(", ")} keyinroq.`);
      let ans;
      if(!first && !others.length) ans="Qaysi qismdan boshlay?";
      else if(others.length) ans=`Hammasini birdan qildim: ${sh[0].l} bor, lekin ${others[0].l} ishlamayapti, sahifa tartibi buzildi.`;
      else ans=`${sh[0].l[0].toUpperCase()+sh[0].l.slice(1)} tayyor. Keyingi qadamga o'tamizmi?`;
      return {ok:!m.length, msg:m.length?m:["To'g'ri: bitta promptda bitta qadam."], ans};
    }};
  };

  /* ---------- 14. Xato xabarini to'liq berish ---------- */
  const T14 = () => {
    const E = [
      ["TypeError: Cannot read properties of undefined (reading 'title')","at main.js:12:5"],
      ["ReferenceError: menu is not defined","at app.js:7:3"],
      ["SyntaxError: Unexpected token '}'","at index.js:21:1"],
      ["TypeError: button is null","at script.js:4:9"]];
    const e = pick(E);
    const text = `Saytni ochganingizda shu xato chiqdi. SI'dan uni tuzatishni so'rang.`;
    return { text, err:e.join("\n    "), paste:true, check(raw){
      const r = common(raw, text, {noCopy:true, minWords:4, verb:/(tuzat|togirla|nega|sabab|yordam|hal qil|korib chiq)/}), g = gate(r); if (g) return {ok:false, ...g};
      const flat = s => s.replace(/\s+/g," ").trim();
      const p = flat(raw), l1 = p.includes(e[0]), l2 = p.includes(e[1]);
      const m=[];
      if(!l1 && !l2) m.push("Xato xabari yo'q. Uni nusxalab qo'ying.");
      else if(!l1) m.push("Xatoning asosiy qatori yo'q yoki o'zgargan.");
      else if(!l2) m.push(`Xatoning qayerda ekani yo'q: ${e[1]}.`);
      let ans;
      if(!l1 && !l2) ans="Qanday xato? Xato matnini yuboring.";
      else if(!l1 || !l2) ans="Bu xatoning bir qismi. Xabarni to'liq yuboring, shunda topaman.";
      else ans=`Topdim: ${e[1].replace("at ","")} qatorida xato. Tuzatdim, sahifani yangilab ko'ring.`;
      return {ok:!m.length, msg:m.length?m:["Xato xabari to'liq berildi."], ans};
    }};
  };

  /* ---------- 15. Qadam-baqadam aytish ---------- */
  const T15 = () => {
    const S = [{b:"Menyu",e:"menyu ochilishi",erx:/ochil/},{b:"Buyurtma berish",e:"buyurtma oynasi chiqishi",erx:/chiq|ochil/},{b:"Aloqa",e:"aloqa bo'limiga o'tishi",erx:/ot|ochil|chiq/},{b:"Kirish",e:"kirish oynasi chiqishi",erx:/chiq|ochil/}];
    const A = [{a:"sahifa oq bo'lib qoldi",rx:/oq|bosh|oqarib/},{a:"hech narsa bo'lmadi",rx:/hech narsa|hech nima|ishlamadi|ozgarmadi/},{a:"xato xabari chiqdi",rx:/xato/}];
    const s = pick(S), a = pick(A);
    const text = `Siz saytdagi «${s.b}» tugmasini bosdingiz. ${s.e[0].toUpperCase()+s.e.slice(1)} kerak edi, lekin ${a.a}.`;
    return { text, ai:{rubric:[{q:`O'quvchi «${s.b}» tugmasini bosganini aytganmi?`,miss:`Nima qilganingiz yo'q: «${s.b}» tugmasini bosdim.`},{q:`${s.e} kerak bo'lgani aytilganmi?`,miss:`Nima bo'lishi kerak edi — yo'q: ${s.e}.`},{q:`Aslida nima bo'lgani (${a.a}) aytilganmi?`,miss:`Nima bo'ldi — yo'q: ${a.a}.`}]}, check(raw){
      const r = common(raw, text, {marker:/bosdingiz|saytdagi/, verb:/(tuzat|togirla|nega|sabab|yordam|hal qil)/}), g = gate(r); if (g) return {ok:false, ...g};
      const p=r.p, bn=s.b.toLowerCase().split(" ")[0];
      const iAct = p.includes(bn) && /bos/.test(p) ? p.indexOf(bn) : -1;
      const hasExp = s.erx.test(p) && /(kerak edi|kerak|kutgandim|kutdim|bolishi)/.test(p);
      const iRes = p.search(a.rx);
      const m=[];
      if(iAct<0) m.push(`Nima qilganingiz yo'q: «${s.b}» tugmasini bosdim.`);
      if(!hasExp) m.push(`Nima bo'lishi kerak edi — yo'q: ${s.e}.`);
      if(iRes<0) m.push(`Nima bo'ldi — yo'q: ${a.a}.`);
      if(iAct>=0 && iRes>=0 && iRes<iAct) m.push("Tartib bilan yozing: avval nima qildingiz, keyin nima bo'ldi.");
      let ans;
      if(iAct<0) ans="Qaysi tugmani bosdingiz? Nima qildingiz?";
      else if(!hasExp) ans="Tugma bosilganda nima bo'lishi kerak edi?";
      else if(iRes<0) ans="Hozir nima bo'lyapti? Ekranda nimani ko'ryapsiz?";
      else ans=`Tushundim: «${s.b}» bosilganda ${s.e} kerak, lekin ${a.a}. Tuzatdim, qayta bosib ko'ring.`;
      return {ok:!m.length, msg:m.length?m:["Hammasi bor: nima qildingiz, nima kutdingiz, nima bo'ldi."], ans};
    }};
  };

  /* ---------- 20. Maxfiy ma'lumotsiz ---------- */
  const T20 = () => {
    const bot = pick(["kafe_bot","lola_gul_bot","orzu_kitob_bot","sport_zal_bot"]);
    const pr = pick([{l:"/start buyrug'iga javob bermayapti",rx:/javob|start|jim/},{l:"xabarlarga javob bermayapti",rx:/javob|xabar|jim/},{l:"ishga tushmayapti",rx:/ishga tush|ishlamay|ochilmay/}]);
    const token = `${Math.floor(1e6+Math.random()*9e6)}:ABC-fake-${Math.random().toString(36).slice(2,8)}`;
    const phone = "+998 90 000 00 00";
    const text = `Botingiz @${bot} ${pr.l}. Sizda shu ma'lumotlar bor: bot tokeni — ${token}, egasining telefoni — ${phone}. SI'dan yordam so'rang.`;
    return { text, ai:{rubric:[{q:`@${bot} boti tilga olinganmi?`,miss:`Qaysi bot ekani yo'q: @${bot}.`},{q:`Muammo (${pr.l}) aytilganmi?`,miss:`Muammo yo'q: ${pr.l}.`}], guard:raw=>{const p=norm(raw); if(/\d{5,}:[a-z0-9_-]+/.test(p)||p.includes(token.toLowerCase().split(":")[0])) return "Bot tokeni yuborildi! Token SI'ga berilmaydi."; if(/998|000 00 00/.test(p)) return "Telefon raqami yuborildi! Bu shaxsiy ma'lumot."; return null;}}, check(raw){
      const r = common(raw, text, {marker:/sizda shu|egasining/, verb:/(tuzat|togirla|nega|sabab|yordam|hal qil|tekshir)/}), g = gate(r); if (g) return {ok:false, ...g};
      const p=r.p;
      const leakT = p.includes(token.toLowerCase().split(":")[0]) || /\d{5,}:[a-z0-9_-]+/.test(p);
      const leakP = /998|000 00 00|\+?\d[\d ]{8,}/.test(p);
      const hasBot = p.includes(bot), hasPr = pr.rx.test(p);
      const m=[];
      if(leakT) m.push("Bot tokeni yuborildi! Token SI'ga berilmaydi.");
      if(leakP) m.push("Telefon raqami yuborildi! Bu shaxsiy ma'lumot.");
      if(!hasBot) m.push(`Qaysi bot ekani yo'q: @${bot}.`);
      if(!hasPr) m.push(`Muammo yo'q: ${pr.l}.`);
      let ans;
      if(leakT) ans="Diqqat: siz bot tokenini yubordingiz. Uni darhol almashtirish kerak.";
      else if(leakP) ans="Telefon raqamingiz shaxsiy ma'lumot. Uni yubormang.";
      else if(!hasPr) ans="Bot bilan nima bo'lyapti? Muammoni yozing.";
      else ans=`@${bot} ${pr.l} — tushundim. Keling, bosqichma-bosqich tekshiramiz.`;
      return {ok:!m.length, msg:m.length?m:["Maxfiy ma'lumot yuborilmadi, muammo aniq yozildi."], ans};
    }};
  };

  const GEN = {5:T5, 6:T6, 7:T7, 8:T8, 9:T9, 14:T14, 15:T15, 20:T20};
  return { make: id => GEN[id](), has: id => !!GEN[id], norm };
})();
