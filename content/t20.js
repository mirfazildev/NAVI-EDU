CONTENT[20] = {
 "bns": [
  {
   "pool": [
    {
     "id": "20.1-1",
     "q": "SI \"Parolingni yoz\" dedi. Ali nima qiladi?",
     "o": [
      "Parolni yozmaydi",
      "Parolni darhol yozadi",
      "Parolning yarmini yozadi",
      "Do'stining parolini yozadi"
     ],
     "e": "Parol SI'ga berilmaydi, SI so'rasa ham."
    },
    {
     "id": "20.1-2",
     "q": "Qaysi promptda parol bor?",
     "o": [
      "\"Parolim gul-fake-1, saytga kirolmayapman\"",
      "\"Saytga kirolmayapman, yordam ber\"",
      "\"Kirish tugmasi ishlamayapti\"",
      "\"Kirish sahifasini chiroyli qil\""
     ],
     "e": "Bu promptda parol yozilgan, uni SI'ga berish mumkin emas."
    },
    {
     "id": "20.1-3",
     "q": "Madina saytga kira olmayapti. SI'ga qanday yozadi?",
     "o": [
      "Xatoni yozadi, parolsiz",
      "Parol va loginini yozadi",
      "Parolning yarmini yozadi",
      "Parolni katta harfda yozadi"
     ],
     "e": "Yordam so'rash uchun parol kerak emas, xatoni yozish yetadi."
    },
    {
     "id": "20.1-4",
     "q": "Jasur promptdagi parolni yuborishdan oldin sezib qoldi. Nima qiladi?",
     "o": [
      "Parolni o'chirib, keyin yuboradi",
      "Baribir yuboradi",
      "Parolni ikki marta yozadi",
      "Faqat parolni yuboradi"
     ],
     "e": "Parol promptda qolmasligi kerak."
    },
    {
     "id": "20.1-5",
     "q": "Nilufar SI'ga yozmoqchi. Qaysi birini yozsa bo'ladi?",
     "o": [
      "Saytining nomini",
      "Pochta parolini",
      "Telegram parolini",
      "Sayt parolini"
     ],
     "e": "Sayt nomi maxfiy emas, parollar esa SI'ga berilmaydi."
    },
    {
     "id": "20.1-6",
     "q": "Nega parol SI'ga berilmaydi?",
     "o": [
      "Parol faqat senda qolishi kerak",
      "Parol juda uzun",
      "SI raqamlarni o'qimaydi",
      "Parol chiroyli emas"
     ],
     "e": "Parol maxfiy, uni hech kimga bermaysan."
    }
   ]
  },
  {
   "pool": [
    {
     "id": "20.2-1",
     "q": "Qaysi biri bot tokeniga o'xshaydi?",
     "o": [
      "7123456:ABC-fake",
      "@kafe_bot",
      "Salom!",
      "/start"
     ],
     "e": "Token raqam va harflardan iborat uzun maxfiy yozuv."
    },
    {
     "id": "20.2-2",
     "q": "Gul do'koni boti ishlamayapti. Qaysi prompt xavfsiz?",
     "o": [
      "\"@gul_bot javob bermayapti. Yordam ber\"",
      "\"Tokenim 7123456:ABC-fake, tekshir\"",
      "\"Mana tokenim, botni ishlat\"",
      "\"Token va parolim shu\""
     ],
     "e": "Bu promptda token yo'q, faqat bot nomi bor."
    },
    {
     "id": "20.2-3",
     "q": "SI \"Kalitni yubor, tekshirib beraman\" dedi. Ali nima qiladi?",
     "o": [
      "Kalitni yubormaydi",
      "Kalitni darhol yuboradi",
      "Kalitning yarmini yuboradi",
      "Kalitni rasmga olib yuboradi"
     ],
     "e": "Kalit SI'ga berilmaydi, SI so'rasa ham."
    },
    {
     "id": "20.2-4",
     "q": "Kalit va token nimaga o'xshaydi?",
     "o": [
      "Parolga, ular ham maxfiy",
      "Ismga, hamma biladi",
      "Rasmga, chiroyli turadi",
      "Sarlavhaga, saytda ko'rinadi"
     ],
     "e": "Kalit va token parolga o'xshab maxfiy saqlanadi."
    },
    {
     "id": "20.2-5",
     "q": "Jasur ko'chirgan xato xabarida token ham bor. Nima qiladi?",
     "o": [
      "Tokenni olib tashlab yuboradi",
      "Xabarni shundayicha yuboradi",
      "Faqat tokenni yuboradi",
      "Tokenni ikki marta yozadi"
     ],
     "e": "Xato xabarini yuborishdan oldin tokenni olib tashla."
    },
    {
     "id": "20.2-6",
     "q": "Kafe boti uchun SI'ga nimani aytsa bo'ladi?",
     "o": [
      "Bot nima qilishi kerakligini",
      "Bot tokenini",
      "Bot kalitini",
      "Token va parolni"
     ],
     "e": "Bot vazifasini aytish xavfsiz, token va kalit esa yo'q."
    }
   ]
  },
  {
   "pool": [
    {
     "id": "20.3-1",
     "q": "Qaysi biri shaxsiy ma'lumot?",
     "o": [
      "Uy manziling",
      "Sevimli ertaging",
      "Sayting nomi",
      "Kafe menyusi"
     ],
     "e": "Uy manzili shaxsiy ma'lumot, u SI'ga berilmaydi."
    },
    {
     "id": "20.3-2",
     "q": "Saytga telefon raqami uchun joy kerak. Promptga nima yozasan?",
     "o": [
      "\"Telefon raqami uchun joy qoldir\"",
      "O'z raqamimni yozaman",
      "Uy manzilimni yozaman",
      "Onamning raqamini yozaman"
     ],
     "e": "Joy so'rash yetarli, haqiqiy raqam kerak emas."
    },
    {
     "id": "20.3-3",
     "q": "Qaysi promptda shaxsiy ma'lumot bor?",
     "o": [
      "\"Raqamim +998 90 000 00 00\"",
      "\"Kafe sayti uchun menyu yoz\"",
      "\"Tugmani ko'k qil\"",
      "\"Sarlavhani kattalashtir\""
     ],
     "e": "Telefon raqami shaxsiy ma'lumot."
    },
    {
     "id": "20.3-4",
     "q": "Madina yetkazib berish formasi so'ramoqchi. U uy manzilini yozsinmi?",
     "o": [
      "Yo'q, \"manzil joyi\" deydi",
      "Ha, aniq manzilini yozadi",
      "Ha, qo'shnisining manzilini",
      "Ha, ko'cha va uy raqamini"
     ],
     "e": "Formaga manzil joyi kerak, haqiqiy manzil emas."
    },
    {
     "id": "20.3-5",
     "q": "Jasur SI'ga hujjat raqamini yozmoqchi. Nima deysan?",
     "o": [
      "Hujjat raqami berilmaydi",
      "Yozsa bo'ladi",
      "Yarmini yozsin",
      "Katta harfda yozsin"
     ],
     "e": "Hujjat raqami shaxsiy ma'lumot, u SI'ga berilmaydi."
    },
    {
     "id": "20.3-6",
     "q": "Kamola sinf boti qilyapti. Do'stlarining raqamlarini SI'ga beradimi?",
     "o": [
      "Yo'q, ular ham shaxsiy",
      "Ha, do'stlariniki mumkin",
      "Ha, faqat beshtasini",
      "Ha, bot uchun kerak"
     ],
     "e": "Boshqalarning telefon raqami ham shaxsiy ma'lumot."
    }
   ]
  },
  {
   "practice": true
  }
 ]
};
