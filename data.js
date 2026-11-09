/* 1-modul: Sun'iy intellekt asoslari — mavzular, oldingi mavzular va BN matnlari (22-fayl) */
const M = t => `<mark class="hl">${t}</mark>`;
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
  {t:`SI javobidagi ${M("nom, raqam va manzil")}ni tekshirish kerak.`, ex:`«Lola» kafesi ${M("Navoiy ko'chasi, 12-uyda")}, ${M("soat 9:00 da")} ochiladi. Narxi ${M("25 000 so'm")}.`, practice:true}]},
 {id:3, b:"A", name:"SI nimani bilmaydi", pre:[2], bns:[
  {t:"SI sizning ekraningizni ko'rmaydi. Nimani ko'rayotganingizni unga yozib bering."},
  {t:"Siz aytmasangiz, SI loyihangizni bilmaydi."},
  {t:"Yangi suhbat ochsangiz, SI oldingi suhbatni bilmaydi."},
  {t:"Sahifada xato ko'rsangiz, SI'ga yozing va tuzatishni so'rang.", ex:`Siz ko'rdingiz: sarlavha juda kichik.<br>SI'ga yozasiz: «${M("Sarlavha juda kichik")}, ${M("kattaroq qil")}».`, practice:true}]},
 {id:4, b:"A", name:"SI xatolarining turlari", pre:[2], bns:[
  {t:`SI yo'q narsani ${M("o'ylab topishi")} mumkin.`},
  {t:`SI vazifani ${M("noto'g'ri tushunishi")} mumkin.`},
  {t:`SI so'ralmagan joyni ham ${M("o'zgartirib yuborishi")} mumkin.`},
  {t:"Xatoni ko'rsangiz, uning turini aniqlang: o'ylab topdimi, noto'g'ri tushundimi yoki ortiqcha o'zgartirdimi.", ex:`Prompt: «Faqat sarlavhani o'zgartir». Natija: ${M("tugma rangi ham o'zgardi")} → ${M("ortiqcha o'zgartirdi")}.`, practice:true}]},
 {id:5, b:"B", name:"Aniq vazifa berish", pre:[3], bns:[
  {t:"Prompt — Sun'iy intellektga yozgan so'rovingiz."},
  {t:`Aniq promptda ${M("nima kerakligi")} yoziladi.`, ex:`Kafe saytiga ${M("sarlavha")} yoz.`},
  {t:`Aniq promptda qanday bo'lishi ham yoziladi: ${M("tili")} va ${M("uzunligi")}.`, ex:`Kafe saytiga ${M("o'zbekcha")} sarlavha yoz, ${M("6 so'zdan")} oshmasin.`},
  {t:"Endi promptni o'zingiz yozing.", ex:`Kitob do'koni ${M("«Orzu»")} saytiga ${M("o'zbekcha")} ${M("sarlavha")} yoz, ${M("7 so'zdan")} oshmasin.`, practice:true}]},
 {id:6, b:"B", name:"Kontekst berish", pre:[3,5], bns:[
  {t:`${M("Kontekst")} — SI bilmaydigan, lekin ish uchun kerak bo'lgan ma'lumot.`},
  {t:`Loyiha ${M("nima haqida")} ekanini ayting.`, ex:`Bu ${M("talabalar kafesining sayti")}.`},
  {t:`${M("Kim uchun")} ekanini ayting.`, ex:`Saytga ${M("12–15 yoshli bolalar")} kiradi.`},
  {t:"Endi kontekstli prompt yozing.", ex:`Bu ${M("sport zali")} sayti. Saytga ${M("talabalar")} kiradi. Ular uchun qisqa ${M("xush kelibsiz matni")} yoz.`, practice:true}]},
 {id:7, b:"B", name:"Cheklov berish", pre:[5], bns:[
  {t:`${M("Cheklov")} — SI nima qilmasligi kerakligi.`},
  {t:`${M("Nimaga tegmaslik")} kerakligini ayting.`, ex:`Faqat sarlavhani o'zgartir, ${M("qolganiga tegma")}.`},
  {t:"Keraksiz narsani aniq yozing.", ex:`${M("Narx yozma")}, ${M("rasm qo'shma")}.`},
  {t:"Endi cheklovli prompt yozing.", ex:`Faqat tugma matnini o'zgartir, ${M("qolganiga tegma")}. ${M("Narx yozma")}.`, practice:true}]},
 {id:8, b:"B", name:"Misol bilan tushuntirish", pre:[5], bns:[
  {t:`${M("Misol")} — SI'ga "shunga o'xshash qil" deb ko'rsatilgan namuna.`},
  {t:"Misol matn, rasm yoki boshqa sayt bo'lishi mumkin."},
  {t:`Misoldan ${M("nimani olish")} kerakligini ayting: rangini, uslubini yoki tuzilishini.`, ex:`${M("Shu saytdagi kabi")} ${M("ko'k rangli")} tugma qil.`},
  {t:"Endi misolli prompt yozing.", ex:`Menga tugma qil. ${M("«Bahor» saytidagi tugma kabi")}, lekin undan faqat ${M("rangini")} ol.`, practice:true}]},
 {id:9, b:"B", name:"Katta vazifani qadamlarga bo'lish", pre:[5,7], bns:[
  {t:"Katta vazifani bitta promptda bersangiz, SI ko'proq xato qilishi mumkin."},
  {t:`Katta vazifani ${M("kichik qadamlar")}ga bo'ling.`},
  {t:`Bitta promptda ${M("faqat bitta qadam")}ni so'rang.`, ex:`${M("Avval faqat sarlavhani")} qil. Keyin menyuni qilamiz.`},
  {t:"Endi birinchi qadam uchun prompt yozing.", ex:`Kafe saytining ${M("faqat sarlavhasini")} qil. Menyuni keyin qilamiz.`, practice:true}]},
 {id:10, b:"C", name:"Kutilgan natijani oldindan yozish", pre:[5], bns:[
  {t:"Prompt yozishdan oldin natija qanday bo'lishi kerakligini yozib qo'ying."},
  {t:`Yaxshi kutilgan natijani ${M("ko'rib tekshirsa")} bo'ladi.`, ex:`${M("Tugma ko'k.")} ${M("Sarlavha 6 so'zdan oshmaydi.")}`},
  {t:`"Chiroyli bo'lsin" degan gapni ${M("tekshirib bo'lmaydi")}.`},
  {t:"Endi kutilgan natijani o'zingiz yozing.", ex:`${M("Tugma ko'k rangda")}<br>${M("Tugmada «Buyurtma» yozuvi bor")}`, practice:true}]},
 {id:11, b:"C", name:"Natijani kutilgan bilan solishtirish", pre:[10], bns:[
  {t:"SI ishni tugatgach, natijani o'zingiz ochib ko'ring."},
  {t:`Kutilgan natijadagi ${M("har bir bandni")} bittalab tekshiring.`},
  {t:`${M("Bitta band")} bajarilmagan bo'lsa ham, ish hali tugamagan.`},
  {t:"Endi natijani kutilgan bilan solishtiring.", ex:`Kutilgan: tugma ko'k. Sahifada: tugma qizil → ${M("bajarilmagan")}.`, practice:true}]},
 {id:12, b:"C", name:"Farqni so'z bilan aytish", pre:[11], bns:[
  {t:`Farq ${M("qayerda")} ekanini ayting.`, ex:"Sahifa tepasidagi tugma."},
  {t:`Hozir ${M("qanday")} ekanini ayting.`, ex:"Qizil rangda."},
  {t:`Qanday ${M("bo'lishi kerak")}ligini ayting.`, ex:"Ko'k bo'lsin."},
  {t:"Endi farqni SI'ga yozing.", ex:`${M("Sahifa pastidagi tugma")} hozir ${M("qizil")}, ${M("ko'k")} bo'lsin.`, practice:true}]},
 {id:13, b:"D", name:"Xato belgilarini ajratish", pre:[11], bns:[
  {t:`${M("Ko'rinmayapti")} — kutilgan narsa ekranda yo'q.`},
  {t:`${M("Noto'g'ri ko'rinyapti")} — narsa bor, lekin boshqacha.`},
  {t:`${M("Ishlamayapti")} — bosganda hech narsa bo'lmaydi.`},
  {t:`${M("Xato xabari chiqdi")} — ekranda xato haqida yozuv paydo bo'ldi.`, ex:`Tugmani bosdim — ${M("hech narsa bo'lmadi")} → ${M("ishlamayapti")}.`, practice:true}]},
 {id:14, b:"D", name:"Xato xabarini SI'ga to'liq berish", pre:[13,3], bns:[
  {t:`Xato xabarini o'zingiz qayta yozmang, ${M("nusxalab oling")}.`},
  {t:`Xabarni bir qismini emas, ${M("to'liq")} bering.`},
  {t:`Nusxalab bo'lmasa, ${M("skrinshot")} bering.`},
  {t:"Endi xato xabari bilan prompt yozing. Bu yerda nusxalab qo'yish mumkin.", ex:`Saytda shu xato chiqdi, tuzat: ${M("ReferenceError: menu is not defined at app.js:7:3")}`, practice:true}]},
 {id:15, b:"D", name:"Nima qilganingizni qadam-baqadam aytish", pre:[14], bns:[
  {t:"Xato qayerdan chiqqanini SI bilishi uchun nima qilganingizni ayting."},
  {t:`Qadamlarni ${M("tartib bilan")} yozing: avval…, keyin….`},
  {t:`Ikkalasini ham ayting: ${M("nima bo'lishi kerak edi")} va ${M("nima bo'ldi")}.`},
  {t:"Endi nima bo'lganini SI'ga tushuntiring.", ex:`${M("«Aloqa» tugmasini bosdim.")} ${M("Aloqa bo'limi ochilishi kerak edi")}, lekin ${M("hech narsa bo'lmadi")}. Tuzat.`, practice:true}]},
 {id:16, b:"D", name:"SI aylanib qolganda nima qilish", pre:[4,15], bns:[
  {t:`SI bitta xatoni ${M("3 marta")} tuzata olmasa, u aylanib qolgan bo'ladi.`},
  {t:`Muammoni ${M("boshqacha so'zlar")} bilan tushuntiring.`},
  {t:`${M("Yangi suhbat")} oching va kerakli ma'lumotni qaytadan bering.`},
  {t:`Hammasi ishlagan ${M("oxirgi holatga")} qayting.`, ex:`Oldin: «Menyu ishlamayapti». Endi: «${M("Menyu bosilganda ro'yxat ochilishi kerak")}, lekin ${M("hech narsa bo'lmayapti")}».`, practice:true}]},
 {id:17, b:"E", name:"Agent rejimi nima", pre:[5], bns:[
  {t:`Chatda SI javob yozadi. ${M("Agent rejimi")}da esa SI fayllarni o'zi o'zgartiradi.`},
  {t:"Agent har bir o'zgarishni sizga ko'rsatadi."},
  {t:`Siz ${M("qabul qilmaguningizcha")} o'zgarish saqlanmaydi.`},
  {t:"Endi agent o'zgarishini ko'rib chiqing.", ex:`Avval ${M("«Natijani ko'rish»")}, keyin ${M("qabul qilish")}.`, practice:true}]},
 {id:18, b:"E", name:"SI'dan reja so'rash", pre:[17,9], bns:[
  {t:`Katta ishdan oldin SI'dan ${M("reja")} so'rang.`},
  {t:`Rejada ${M("keraksiz qadam")} bo'lsa, uni olib tashlashni ayting.`},
  {t:`Rejada ${M("kerakli qadam")} yetishmasa, uni qo'shishni ayting.`},
  {t:"Endi SI rejasini tuzating.", ex:`${M("3-qadamni olib tashla")}, ${M("telefon raqamini qo'sh")}.`, practice:true}]},
 {id:19, b:"E", name:"O'zgarishni qabul yoki rad qilish", pre:[17,11], bns:[
  {t:"O'zgarishdan keyin natijani ochib tekshiring."},
  {t:`Natija kutilgandek bo'lsa, ${M("qabul qiling")}.`},
  {t:`Natija buzilgan bo'lsa, ${M("rad qiling")} va nima buzilganini SI'ga ayting.`},
  {t:"Endi o'zgarishni qabul yoki rad qiling.", ex:`Rad qilaman: ${M("rasm yo'qolib qoldi")}, qaytar.`, practice:true}]},
 {id:20, b:"F", name:"SI'ga nima berilmaydi", pre:[3], bns:[
  {t:`${M("Parol")} SI'ga berilmaydi.`},
  {t:`${M("Kalit va tokenlar")} (masalan, bot tokeni) SI'ga berilmaydi.`},
  {t:`${M("Shaxsiy ma'lumotlar")} SI'ga berilmaydi: telefon raqami, uy manzili, hujjat raqami.`},
  {t:"Endi maxfiy ma'lumotsiz prompt yozing.", ex:`${M("@kafe_bot")} botim /start'ga ${M("javob bermayapti")}. Nega? Tuzatishga yordam ber.`, practice:true}]},
 {id:21, b:"F", name:"Xavfli taklifni tanish", pre:[4,20], bns:[
  {t:`SI "hammasini o'chiraylik" desa, ${M("to'xtang")} va tekshiring.`},
  {t:`SI kalitni sahifaga yozishni taklif qilsa, ${M("rad qiling")}.`},
  {t:`Tushunmagan buyruqni bajarmang. Avval SI'dan ${M("u nima qilishini")} so'rang.`},
  {t:"Endi SI taklifiga javob bering.", ex:`${M("Yo'q, hamma fayllarni o'chirma.")} Avval xatoni topaylik.`, practice:true}]}
];
const BYID = Object.fromEntries(TOPICS.map(t=>[t.id,t]));
