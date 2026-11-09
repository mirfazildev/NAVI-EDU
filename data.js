/* 1-modul: Sun'iy intellekt asoslari — mavzular, oldingi mavzular va BN matnlari (22-fayl) */
const M = t => `<mark class="hl">${t}</mark>`;
// Namuna qatori: kichik yorliq + katta matn (har qatorda bitta fikr)
const RW = (l, v) => `<div class="er"><span class="el">${l}</span><span class="ev">${v}</span></div>`;
const BLOCKS = {A:"SI'ni tushunish",B:"Vazifa qo'yish",C:"Natijani tekshirish",D:"Xato bilan ishlash",E:"Agent bilan ishlash",F:"Xavfsizlik"};
const TOPICS = [
 {id:1, b:"A", name:"Sun'iy intellekt nima", pre:[], bns:[
  {t:`Sun'iy intellekt qisqacha ${M("SI")} deb yoziladi.`},
  {t:"SI — so'rovingizga javob beradigan dastur."},
  {t:"SI internetdagi juda ko'p ma'lumotlardan o'rgangan va shu ma'lumotlar asosida javob beradi."},
  {t:"SI inson kabi his qila olmaydi va ishni o'zi boshlamaydi. Siz buyursangiz ishlaydi."}]},
 {id:2, b:"A", name:"SI qanday javob beradi", pre:[1], bns:[
  {t:"SI javobni har safar yangidan yozadi. Bitta savolga har xil javob berishi mumkin."},
  {t:"SI doim ishonch bilan gapiradi, xato qilganda ham."},
  {t:"Ishonch bilan aytilgan gap har doim ham to'g'ri bo'lavermaydi."},
  {t:`SI javobidagi ${M("nom, raqam va manzil")}ni tekshirish kerak.`, ex:`${RW("SI yozdi",`«Lola» kafesi ${M("Navoiy ko'chasi, 12-uy")}da.`)}${RW("Siz tekshirasiz",`Manzil to'g'rimi?`)}`, practice:true}]},
 {id:3, b:"A", name:"SI nimani bilmaydi", pre:[2], bns:[
  {t:"SI sizning ekraningizni ko'rmaydi. Nimani ko'rayotganingizni unga yozib bering."},
  {t:"Siz aytmasangiz, SI loyihangizni bilmaydi."},
  {t:"Yangi suhbat ochsangiz, SI oldingi suhbatni bilmaydi."},
  {t:"Sahifada xato ko'rsangiz, SI'ga yozing va tuzatishni so'rang.", ex:`${RW("Siz ko'rdingiz",`Sarlavha juda kichik.`)}${RW("SI'ga yozasiz",`«Sarlavhani ${M("kattaroq qil")}»`)}`, practice:true}]},
 {id:4, b:"A", name:"SI xatolarining turlari", pre:[2], bns:[
  {t:`SI yo'q narsani ${M("o'ylab topishi")} mumkin.`},
  {t:`SI vazifani ${M("noto'g'ri tushunishi")} mumkin.`},
  {t:`SI so'ralmagan joyni ham ${M("o'zgartirib yuborishi")} mumkin.`},
  {t:"Endi xato turini o'zingiz toping.", ex:`${RW("Siz so'radingiz",`«Faqat sarlavhani o'zgartir»`)}${RW("SI qildi",`Sarlavhani va ${M("tugma rangini")} o'zgartirdi.`)}${RW("Xato turi",`${M("Ortiqcha o'zgartirdi")}`)}`, practice:true}]},
 {id:5, b:"B", name:"Aniq vazifa berish", pre:[3], bns:[
  {t:"Prompt — Sun'iy intellektga yozgan so'rovingiz."},
  {t:`Aniq promptda ${M("nima kerakligi")} yoziladi.`, ex:`${RW("Prompt",`Kafe saytiga ${M("sarlavha")} yoz.`)}`},
  {t:`Aniq promptda qanday bo'lishi ham yoziladi: ${M("tili")} va ${M("uzunligi")}.`, ex:`${RW("Prompt",`Kafe saytiga sarlavha yoz. ${M("O'zbekcha")}, ${M("6 so'zgacha")}.`)}`},
  {t:"Endi promptni o'zingiz yozing.", ex:`${RW("Prompt",`«Orzu» do'koni saytiga sarlavha yoz. ${M("O'zbekcha")}, ${M("7 so'zgacha")}.`)}`, practice:true}]},
 {id:6, b:"B", name:"Kontekst berish", pre:[3,5], bns:[
  {t:`${M("Kontekst")} — SI bilmaydigan, lekin ish uchun kerak bo'lgan ma'lumot.`},
  {t:`Loyiha ${M("nima haqida")} ekanini ayting.`, ex:`${RW("Prompt",`Bu ${M("talabalar kafesi")}ning sayti.`)}`},
  {t:`${M("Kim uchun")} ekanini ayting.`, ex:`${RW("Prompt",`Saytga ${M("12–15 yoshli bolalar")} kiradi.`)}`},
  {t:"Endi kontekstli prompt yozing.", ex:`${RW("Nima haqida",`Bu ${M("sport zali")} sayti.`)}${RW("Kim uchun",`Saytga ${M("talabalar")} kiradi.`)}${RW("Nima kerak",`Qisqa xush kelibsiz matni yoz.`)}`, practice:true}]},
 {id:7, b:"B", name:"Cheklov berish", pre:[5], bns:[
  {t:`${M("Cheklov")} — SI nima qilmasligi kerakligi.`},
  {t:`${M("Nimaga tegmaslik")} kerakligini ayting.`, ex:`${RW("Prompt",`Faqat sarlavhani o'zgartir. ${M("Qolganiga tegma.")}`)}`},
  {t:"Keraksiz narsani aniq yozing.", ex:`${RW("Prompt",`${M("Narx yozma.")} ${M("Rasm qo'shma.")}`)}`},
  {t:"Endi cheklovli prompt yozing.", ex:`${RW("Nima qilsin",`Tugma yozuvini o'zgartir.`)}${RW("Nima qilmasin",`${M("Qolganiga tegma. Narx yozma.")}`)}`, practice:true}]},
 {id:8, b:"B", name:"Misol bilan tushuntirish", pre:[5], bns:[
  {t:`${M("Misol")} — SI'ga "shunga o'xshash qil" deb ko'rsatilgan namuna.`},
  {t:"Misol matn, rasm yoki boshqa sayt bo'lishi mumkin."},
  {t:`Misoldan ${M("nimani olish")} kerakligini ayting: rangini, uslubini yoki tuzilishini.`, ex:`${RW("Prompt",`Shu saytdagi kabi tugma qil. Faqat ${M("rangini")} ol.`)}`},
  {t:"Endi misolli prompt yozing.", ex:`${RW("Misol",`«Bahor» saytidagi tugma`)}${RW("Prompt",`Shunday tugma qil. Faqat ${M("rangini")} ol.`)}`, practice:true}]},
 {id:9, b:"B", name:"Katta vazifani qadamlarga bo'lish", pre:[5,7], bns:[
  {t:"Katta vazifani bitta promptda bersangiz, SI ko'proq xato qilishi mumkin."},
  {t:`Katta vazifani ${M("kichik qadamlar")}ga bo'ling.`},
  {t:`Bitta promptda ${M("faqat bitta qadam")}ni so'rang.`, ex:`${RW("1-prompt",`${M("Faqat sarlavhani")} qil.`)}${RW("2-prompt",`Endi menyuni qil.`)}`},
  {t:"Endi birinchi qadam uchun prompt yozing.", ex:`${RW("Prompt",`Kafe saytining ${M("faqat sarlavhasini")} qil.`)}`, practice:true}]},
 {id:10, b:"C", name:"Kutilgan natijani oldindan yozish", pre:[5], bns:[
  {t:"Prompt yozishdan oldin natija qanday bo'lishi kerakligini yozib qo'ying."},
  {t:`Yaxshi kutilgan natijani ${M("ko'rib tekshirsa")} bo'ladi.`, ex:`${RW("Tekshirsa bo'ladi ✓",`${M("Tugma ko'k.")}`)}${RW("Tekshirib bo'lmaydi ✗",`Sayt chiroyli.`)}`},
  {t:`"Chiroyli bo'lsin" degan gapni ${M("tekshirib bo'lmaydi")}.`},
  {t:"Endi kutilgan natijani o'zingiz yozing.", ex:`${RW("1-qator",`${M("Tugma ko'k.")}`)}${RW("2-qator",`${M("Tugmada «Buyurtma» yozuvi bor.")}`)}`, practice:true}]},
 {id:11, b:"C", name:"Natijani kutilgan bilan solishtirish", pre:[10], bns:[
  {t:"SI ishni tugatgach, natijani o'zingiz ochib ko'ring."},
  {t:`Kutilgan natijadagi ${M("har bir bandni")} bittalab tekshiring.`},
  {t:`${M("Bitta band")} bajarilmagan bo'lsa ham, ish hali tugamagan.`},
  {t:"Endi natijani kutilgan bilan solishtiring.", ex:`${RW("Kutilgan",`Tugma ko'k.`)}${RW("Sahifada",`Tugma qizil.`)}${RW("Demak",`${M("Bajarilmagan")}`)}`, practice:true}]},
 {id:12, b:"C", name:"Farqni so'z bilan aytish", pre:[11], bns:[
  {t:`Farq ${M("qayerda")} ekanini ayting.`, ex:`${RW("Qayerda",`${M("Sahifa tepasidagi tugma")}`)}`},
  {t:`Hozir ${M("qanday")} ekanini ayting.`, ex:`${RW("Hozir qanday",`${M("Qizil")}`)}`},
  {t:`Qanday ${M("bo'lishi kerak")}ligini ayting.`, ex:`${RW("Qanday bo'lsin",`${M("Ko'k")}`)}`},
  {t:"Endi farqni SI'ga yozing.", ex:`${RW("Prompt",`${M("Pastdagi tugma")} hozir ${M("qizil")}. ${M("Ko'k")} bo'lsin.`)}`, practice:true}]},
 {id:13, b:"D", name:"Xato belgilarini ajratish", pre:[11], bns:[
  {t:`${M("Ko'rinmayapti")} — kutilgan narsa ekranda yo'q.`},
  {t:`${M("Noto'g'ri ko'rinyapti")} — narsa bor, lekin boshqacha.`},
  {t:`${M("Ishlamayapti")} — bosganda hech narsa bo'lmaydi.`},
  {t:`${M("Xato xabari chiqdi")} — ekranda xato haqida yozuv paydo bo'ldi.`, ex:`${RW("Siz ko'rdingiz",`Ekranda ${M("Error: ...")} yozuvi chiqdi.`)}${RW("Xato turi",`${M("Xato xabari chiqdi")}`)}`, practice:true}]},
 {id:14, b:"D", name:"Xato xabarini SI'ga to'liq berish", pre:[13,3], bns:[
  {t:`Xato xabarini o'zingiz qayta yozmang, ${M("nusxalab oling")}.`},
  {t:`Xabarni bir qismini emas, ${M("to'liq")} bering.`},
  {t:`Nusxalab bo'lmasa, ${M("skrinshot")} bering.`},
  {t:"Endi xato xabari bilan prompt yozing. Bu yerda nusxalab qo'yish mumkin.", ex:`${RW("Prompt",`Saytda shu xato chiqdi, tuzat:`)}${RW("Xato xabari",`<code class="ecode">ReferenceError: menu is not defined</code>`)}`, practice:true}]},
 {id:15, b:"D", name:"Nima qilganingizni qadam-baqadam aytish", pre:[14], bns:[
  {t:"Xato qayerdan chiqqanini SI bilishi uchun nima qilganingizni ayting."},
  {t:`Qadamlarni ${M("tartib bilan")} yozing: avval…, keyin….`},
  {t:`Ikkalasini ham ayting: ${M("nima bo'lishi kerak edi")} va ${M("nima bo'ldi")}.`},
  {t:"Endi nima bo'lganini SI'ga tushuntiring.", ex:`${RW("Nima qildim",`«Aloqa» tugmasini bosdim.`)}${RW("Nima bo'lishi kerak edi",`Aloqa bo'limi ochilishi.`)}${RW("Nima bo'ldi",`${M("Hech narsa.")}`)}`, practice:true}]},
 {id:16, b:"D", name:"SI aylanib qolganda nima qilish", pre:[4,15], bns:[
  {t:`SI bitta xatoni ${M("3 marta")} tuzata olmasa, u aylanib qolgan bo'ladi.`},
  {t:`Muammoni ${M("boshqacha so'zlar")} bilan tushuntiring.`},
  {t:`${M("Yangi suhbat")} oching va kerakli ma'lumotni qaytadan bering.`},
  {t:"Endi muammoni boshqacha so'zlar bilan yozing.", ex:`${RW("Oldin",`«Menyu ishlamayapti»`)}${RW("Endi",`«Menyu bosilsa ro'yxat ochilishi kerak. ${M("Hech narsa bo'lmayapti.")}»`)}`, practice:true}]},
 {id:17, b:"E", name:"Agent rejimi nima", pre:[5], bns:[
  {t:`Chatda SI javob yozadi. ${M("Agent rejimi")}da esa SI fayllarni o'zi o'zgartiradi.`},
  {t:"Agent har bir o'zgarishni sizga ko'rsatadi."},
  {t:`Siz ${M("qabul qilmaguningizcha")} o'zgarish saqlanmaydi.`},
  {t:"Endi agent o'zgarishini ko'rib chiqing.", ex:`${RW("1-qadam",`${M("Natijani ko'rish")} tugmasini bosing.`)}${RW("2-qadam",`Hammasi joyida bo'lsa — ${M("Qabul qilish")}.`)}`, practice:true}]},
 {id:18, b:"E", name:"SI'dan reja so'rash", pre:[17,9], bns:[
  {t:`Katta ishdan oldin SI'dan ${M("reja")} so'rang.`},
  {t:`Rejada ${M("keraksiz qadam")} bo'lsa, uni olib tashlashni ayting.`},
  {t:`Rejada ${M("kerakli qadam")} yetishmasa, uni qo'shishni ayting.`},
  {t:"Endi SI rejasini tuzating.", ex:`${RW("SI'ga yozasiz",`${M("3-qadamni olib tashla.")} ${M("Telefon raqamini qo'sh.")}`)}`, practice:true}]},
 {id:19, b:"E", name:"O'zgarishni qabul yoki rad qilish", pre:[17,11], bns:[
  {t:"O'zgarishdan keyin natijani ochib tekshiring."},
  {t:`Natija kutilgandek bo'lsa, ${M("qabul qiling")}.`},
  {t:`Natija buzilgan bo'lsa, ${M("rad qiling")} va nima buzilganini SI'ga ayting.`},
  {t:"Endi o'zgarishni qabul yoki rad qiling.", ex:`${RW("SI'ga yozasiz",`Rad qilaman: ${M("rasm yo'qolib qoldi")}. Qaytar.`)}`, practice:true}]},
 {id:20, b:"F", name:"SI'ga nima berilmaydi", pre:[3], bns:[
  {t:`${M("Parol")} SI'ga berilmaydi.`},
  {t:`${M("Kalit va tokenlar")} (masalan, bot tokeni) SI'ga berilmaydi.`},
  {t:`${M("Shaxsiy ma'lumotlar")} SI'ga berilmaydi: telefon raqami, uy manzili, hujjat raqami.`},
  {t:"Endi maxfiy ma'lumotsiz prompt yozing.", ex:`${RW("Prompt",`${M("@kafe_bot")} botim javob bermayapti. Yordam ber.`)}${RW("Yozmaysiz ✗",`Token, parol, telefon raqam`)}`, practice:true}]},
 {id:21, b:"F", name:"Xavfli taklifni tanish", pre:[4,20], bns:[
  {t:`SI "hammasini o'chiraylik" desa, ${M("to'xtang")} va tekshiring.`},
  {t:`SI kalitni sahifaga yozishni taklif qilsa, ${M("rad qiling")}.`},
  {t:`Tushunmagan buyruqni bajarmang. Avval SI'dan ${M("u nima qilishini")} so'rang.`},
  {t:"Endi SI taklifiga javob bering.", ex:`${RW("SI",`«Hamma fayllarni o'chiraymi?»`)}${RW("Siz",`${M("Yo'q, o'chirma.")} Avval xatoni topaylik.`)}`, practice:true}]}
];
const BYID = Object.fromEntries(TOPICS.map(t=>[t.id,t]));
