# NAVI matnli darslar paketi — v1.3.0

"Sun'iy intellekt asoslari" moduli matnli ko'rinishda: 21 mavzu, 84 BN, 414 savol va 20 ta amaliyot generatori.

| Fayl | Nima |
|---|---|
| `content.json` | Mavzular, BN'lar va savollar |
| `practice.mjs` | Amaliyot: vazifa yaratish va tekshirish (ES modul, sof JS; Node va QuickJS'da sinalgan) |
| `si.template.json` | Gemini tizim prompti, so'rov shabloni va `responseSchema` (o'qish uchun; `practice.mjs` ichida ham bor) |
| `manifest.json` | Versiya, har fayl uchun `sha256` va sonlar |
| `tests.mjs` | Sinovlar: `node tests.mjs` → `fails 0` |

Fayl butunligini tekshirish: `sha256sum content.json practice.mjs` natijasi `manifest.json` dagi qiymatlarga teng bo'lishi kerak.

## content.json

```
{ module, title, version,
  topics: [ { id, block, blockName, name, pre:[id...],
              bns: [ { id, n, name, text, example:[{label, text}], kind:"test"|"practice", pool:[...], practice?:"T05" } ] } ] }
```

- `pre` — oldingi mavzular (graf). Mavzu barcha `pre` mavzulari o'tilganda ochiladi.
- `text` va `example[].text` ichida `==so'z==` — sariq belgi. `` `...` `` — kod (xato xabari).
  Namunaning har qatori: kichik `label` va katta `text`.
- BN: `id` — doimiy (`"05.1"` = 5-mavzu, 1-BN), `name` — qisqa nom (≤ 40 belgi) ro'yxat, Portfolio va panel uchun.
- Savol formati: `{ id, q, options:[4], correct:0, explain }`. `id` doimiy (`"05.1-3"`): bir marta berilgan id o'zgarmaydi va qayta ishlatilmaydi. Yangi savol yangi id oladi (oxirgi raqamdan keyingisi), o'chirilgan savolning id'si bo'sh qoladi. Savol matni tahrirlansa, id o'sha qoladi. To'g'ri javob doim 0-indeksda — ko'rsatishda variantlarni aralashtiring.
- `kind:"test"` — 64 ta BN, har birida 6 ta savol (jami 384).
- `kind:"practice"` — 20 ta BN (1-mavzudan boshqa hammasida 4-BN). Darsda bu BN'da test emas, amaliyot beriladi (`practice` — generator nomi).
  Ulardan 5 tasining (2, 3, 4, 13, 16-mavzular) `pool`ida 6 tadan savol bor (jami 30). Bu savollar faqat takrorlash va quiz'da ishlatiladi.

## practice.mjs — API

```js
import { create, check, press, siRequest, siBody, SI_MODEL, siVerdict, mask, has, VERSION } from "./practice.mjs";

const { task, state } = create(topicId, seed);   // seed — butun son. Bir xil seed → bir xil vazifa
// task  → brauzerga (javob kaliti yo'q)
// state → serverda saqlanadi: { v, topicId, seed }

const r = check(state, answer);                  // { ok, messages[], reply, cheat }
```

- Vazifa `state`dan qayta yaratib tekshiriladi. Javob kaliti hech qachon brauzerga ketmaydi.
- `state.v` paket versiyasiga teng bo'lmasa, `check` xato beradi. Eski urinishlarni eski versiya bilan tekshiring yoki bekor qiling.

### `task.type` bo'yicha javob shakli

| type / mode | Ekranda | answer |
|---|---|---|
| `prompt`, `write`, `site` + `mode:"prompt"` | matn maydoni (+ `page` soxta sayt HTML'i, `chat`, `plan`) | `string` |
| `mark` | `chunks` bo'laklarini bosib belgilash; `static:true` bo'lsa faqat `choices` dan tanlash (`lead`, `note`) | `{ selected:[i...], choice }` |
| `site` + `mode:"checklist"` | `page` + `items` ro'yxatidan belgilash | `{ selected:[i...] }` |
| `site` + `mode:"choice"` | `page` (tugma `#mbtn`) + `choices` | `{ choice, touched }` — `touched`: bola sahifani bosib ko'rdimi |
| `agent` | `diff` qatorlari, "Natijani ko'rish" (`preview` HTML'i), Qabul/Rad; `needWhy` bo'lsa rad sababi | `{ viewed, accept, why }` |

`choices` matnida `<small class="hint">` izohi bor. `page` va `preview` — tayyor HTML. `paste:true` bo'lsa, maydonga nusxalab qo'yishga ruxsat bor (14-mavzu).

`site` + `mode:"choice"` (13-mavzu): bola sahifadagi `#mbtn` tugmasini bosganda serverdan `press(state)` so'raladi. U `{kind:"ok"|"none"|"error", text}` qaytaradi va brauzer `text`ni tugma ostida ko'rsatadi. Tugma xatti-harakati — bu javob kaliti, shuning uchun u `task`da yo'q. Bola tugmani bossa yoki sahifani bossa, `touched:true` bo'ladi.

### SI (gibrid) oqimi — Q-609, Q-612

```js
let r = check(state, answer);
if (!r.ok && !r.cheat) {
  const req = siRequest(state, answer);      // { topic, task, rubric:[...], prompt } yoki null
  if (req) {
    // POST https://generativelanguage.googleapis.com/v1beta/models/${SI_MODEL}:generateContent  (header: x-goog-api-key)
    const si = await callGemini(siBody(req));  // javob matnidagi JSON: { reply, checks:[bool], offtopic, injection } yoki null
    r = siVerdict(state, answer, r, si);       // yakuniy baho — kodda
  }
}
```

- `req.prompt` allaqachon `mask()`dan o'tgan: token, kalit, parol, e-pochta, karta va telefon yashirilgan.
- Gemini'ga faqat `siBody(req)` ketadi: tizim prompti, mezonlar va maskalangan javob. Model nomini `SI_MODEL` dan oling yoki serverda o'zgartiring.
- SI ishlamasa, `si = null` → algoritm natijasi qoladi.

## Yangilash

Paket NAVI-EDU prototipidan `node build.mjs <navi-app> <chiqish> <versiya>` bilan yig'iladi. Har o'zgarishda versiya oshiriladi va `sha256` yangilanadi.

## O'zgarishlar

- **1.3.0** — variant uzunliklari muvozanatlandi (Ilyos IS-6): to'g'ri javob yagona eng uzun variant bo'lgan savollar 57% → 16%, yagona eng qisqa 10%. Asosan noto'g'ri variantlar uzaytirildi; savol, id va izohlar o'zgarmagan.
- **1.2.0** — har savolga doimiy `id`, har BN'ga `id` va qisqa `name` (Ilyos IS-1, IS-2). Matnlar o'zgarmagan.
- **1.1.0** — o'quvchiga murojaat «siz» → «sen» (Mirfazil qarori, S7): BN matnlari, namunalar, 414 savol, amaliyot vazifalari, izohlar va SI javoblari. «…» ichidagi iqtiboslar (bola prompti, sayt matni) o'zgarmagan. SI promptiga «sen» deb murojaat qilish qo'shildi. Savollar va tekshiruv mantig'i o'zgarmagan.
- **1.0.2** — `siBody`: bola matnidagi `$` belgilari (`` $` ``, `$'`, `$&`) so'rov tanasini buzmaydi — almashtirish bir o'tishda, funksiya bilan (Ilyos topgan). Tizim promptiga til darajasi qo'shildi: o'quvchi 12–17 yosh, matnlar 8–10 yoshli bola tushunadigan sodda tilda.
- **1.0.1** — `siBody(req)`, `SI_MODEL` va `si.template.json` qo'shildi (Gemini tizim prompti va sxemasi paket ichida). Kontent o'zgarmagan.
- **1.0.0** — birinchi versiya.
