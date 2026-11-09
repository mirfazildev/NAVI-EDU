// NAVI matnli darslar paketini yig'adi: content.json + practice.mjs + manifest.json (versiya + sha256).
// Ishga tushirish: node build.mjs <navi-app papkasi> <chiqish papkasi> <versiya>
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const [,, SRC, OUT, VERSION = "1.0.0"] = process.argv;
const rd = f => fs.readFileSync(path.join(SRC, f), "utf8");
const sha = s => crypto.createHash("sha256").update(s).digest("hex");
fs.mkdirSync(OUT, { recursive: true });

/* ---------- 1. Kontent ---------- */
// Sariq belgi ==so'z== ko'rinishida; namuna qatorlari {label, text} massivi bo'lib chiqadi.
const ROW = "\u0001";
let dataSrc = rd("data.js")
  .replace(/const M = .*\n/, "const M = t => `==${t}==`;\n")
  .replace(/const RW = .*\n/, "const RW = (l, v) => `" + ROW + "${l}" + "\u0002" + "${v}`;\n");
const data = new Function(dataSrc + "; return {TOPICS, BLOCKS};")();
const CONTENT = {};
const ctx = new Function("CONTENT", ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21"]
  .map(n => rd(`content/t${n}.js`)).join("\n"));
ctx(CONTENT);

const PRACTICE_IDS = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
const cleanText = s => s.replace(/<code class="ecode">(.*?)<\/code>/g, "`$1`").replace(/<br\s*\/?>/g, "\n");
const parseExample = ex => ex ? ex.split(ROW).filter(Boolean).map(r => { const [label, text] = r.split("\u0002"); return { label, text: cleanText(text) }; }) : [];

const topics = data.TOPICS.map(t => ({
  id: t.id,
  block: t.b,
  blockName: data.BLOCKS[t.b],
  name: t.name,
  pre: t.pre,
  bns: t.bns.map((b, k) => {
    const pool = (CONTENT[t.id]?.bns?.[k]?.pool || []).map(q => ({ q: q.q, options: q.o, correct: 0, explain: q.e }));
    const bn = { n: k + 1, text: b.t, example: parseExample(b.ex), kind: b.practice ? "practice" : "test", pool };
    if (b.practice) bn.practice = `T${String(t.id).padStart(2, "0")}`;
    return bn;
  })
}));
for (const t of topics) for (const b of t.bns) {
  const all = JSON.stringify(b);
  if (/<[a-z]/i.test(all.replace(/«|»/g, ""))) throw new Error(`HTML qoldi: mavzu ${t.id} BN${b.n}`);
  if (b.kind === "practice" && !PRACTICE_IDS.includes(t.id)) throw new Error(`amaliyot generatori yo'q: ${t.id}`);
}
const content = { module: "si-asoslari", title: "Sun'iy intellekt asoslari", version: VERSION, topics };
const contentStr = JSON.stringify(content, null, 2) + "\n";
fs.writeFileSync(path.join(OUT, "content.json"), contentStr);

/* ---------- 2. Amaliyot moduli (ES modul, QuickJS va Node'da ishlaydi) ---------- */
const practiceSrc = `// NAVI amaliyot moduli v${VERSION}. Generatorlar va tekshiruv — sof JS (DOM yo'q, tarmoq yo'q).
// API: create(topicId, seed) -> {task, state};  check(state, answer) -> {ok, messages, reply, cheat}
//      siRequest(state, answer) -> {topic, task, rubric, prompt} | null;  siVerdict(state, answer, algo, si) -> {ok, messages, reply}
//      mask(text) -> text (Gemini'ga yuborishdan oldin);  has(topicId) -> boolean
${rd("practice.js")}
${rd("practice2.js")}

function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function seeded(seed, fn){ const orig=Math.random; Math.random=mulberry32(seed>>>0); try{ return fn(); } finally { Math.random=orig; } }
const TOPIC_NAMES = ${JSON.stringify(Object.fromEntries(topics.map(t => [t.id, t.name])))};

export const VERSION = ${JSON.stringify(VERSION)};
export function has(topicId){ return PR.has(topicId) || PR2.has(topicId); }
function build(topicId, seed){ return seeded(seed, () => PR.has(topicId) ? PR.make(topicId) : PR2.make(topicId)); }

// Brauzerga ketadigan maydonlar. Javob kaliti (need, ok, behave, broken, rubric, check) bu yerda YO'Q.
const PUBLIC = ["type","mode","text","lead","note","page","chat","plan","items","choices","err","paste","placeholder","static","diff","preview","needWhy"];
export function create(topicId, seed){
  if(!has(topicId)) throw new Error("amaliyot yo'q: "+topicId);
  const t = build(topicId, seed), task = { topicId, type: t.type || "prompt" };
  for (const k of PUBLIC) if (t[k] !== undefined) task[k] = t[k];
  if (t.chunks) task.chunks = t.chunks.map(c => ({ t: c.t }));
  return { task, state: { v: VERSION, topicId, seed } };
}

// Javob shakli turiga qarab:
//  prompt / write / site(mode:"prompt") -> string
//  mark                                 -> {selected:[indekslar], choice}   (static:true bo'lsa selected bo'sh bo'lishi mumkin)
//  site(mode:"checklist")               -> {selected:[indekslar]}
//  site(mode:"choice")                  -> {choice, touched}
//  agent                                -> {viewed, accept, why}
function runCheck(t, answer){
  const type = t.type || "prompt";
  if (type === "mark") return t.check(new Set(answer.selected || []), answer.choice ?? -1);
  if (type === "site" && t.mode === "checklist") return t.check(new Set(answer.selected || []));
  if (type === "site" && t.mode === "choice") return t.check(answer.choice ?? -1, !!answer.touched);
  if (type === "agent") return t.check(answer || {});
  return t.check(String(answer ?? ""));
}
const CHEAT = /ko'chirmang|takrorlamang/;
export function check(state, answer){
  if (state.v !== VERSION) throw new Error("versiya mos emas: " + state.v + " != " + VERSION);
  const t = build(state.topicId, state.seed), r = runCheck(t, answer);
  return { ok: !!r.ok, messages: r.msg, reply: r.ans || "", cheat: r.msg.some(m => CHEAT.test(m)) };
}

// Maxfiy ma'lumotni yashirish (Q-612): token, kalit, parol, telefon, e-pochta, karta.
export function mask(s){
  return String(s)
    .replace(/\\b\\d{5,}:[A-Za-z0-9_-]{5,}\\b/g, "[TOKEN]")
    .replace(/\\b(AIza[0-9A-Za-z_-]{20,}|sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,})\\b/g, "[KALIT]")
    .replace(/(parol|password|pass|пароль)(\\s*[:=-]?\\s*)\\S+/gi, "$1$2[PAROL]")
    .replace(/[\\w.+-]+@[\\w-]+\\.[\\w.]+/g, "[EMAIL]")
    .replace(/\\b(?:\\d[ -]?){16}\\b/g, "[KARTA]")
    .replace(/\\+?998[\\s-]?\\(?\\d{2}\\)?[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}/g, "[TELEFON]")
    .replace(/\\b\\d{2}[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}\\b/g, "[TELEFON]");
}

// 13-mavzu ("site" + mode:"choice"): bola sahifadagi #mbtn tugmasini bosganda nima chiqishi. Javob kaliti brauzerga bermaslik uchun serverda.
export function press(state){
  const t = build(state.topicId, state.seed);
  if (t.behave === undefined) return null;
  if (t.behave === 2) return { kind: "none", text: "" };
  if (t.behave === 3) return { kind: "error", text: "Uncaught TypeError: order is undefined" };
  return { kind: "ok", text: "Buyurtma qabul qilindi" };
}

// SI'ga so'rov faqat matnli javoblarda, algoritm "noto'g'ri" desa va bu ko'chirish/takror bo'lmasa.
export function siRequest(state, answer){
  const t = build(state.topicId, state.seed);
  if (!t.ai || typeof answer !== "string") return null;
  const algo = check(state, answer);
  if (algo.ok || algo.cheat) return null;
  return { topic: TOPIC_NAMES[state.topicId], task: t.text, rubric: t.ai.rubric.map(x => x.q), prompt: mask(answer) };
}
// si = SI javobi {reply, checks:[bool], offtopic, injection} yoki null (SI ishlamasa).
export function siVerdict(state, answer, algo, si){
  if (!si) return { ok: algo.ok, messages: algo.messages, reply: algo.reply };
  const t = build(state.topicId, state.seed);
  if (si.injection || si.offtopic) return { ok: false, messages: ["Faqat shu vazifa bo'yicha yozing."], reply: "Men faqat shu vazifa bo'yicha yordam beraman." };
  const miss = t.ai.rubric.filter((x, i) => !si.checks?.[i]).map(x => x.miss);
  const g = t.ai.guard ? t.ai.guard(answer) : null;
  if (!miss.length && !g) return { ok: true, messages: ["SI vazifani to'liq tushundi."], reply: si.reply || "" };
  return { ok: false, messages: g ? [g, ...algo.messages] : algo.messages, reply: algo.reply || si.reply || "" };
}
`;
fs.writeFileSync(path.join(OUT, "practice.mjs"), practiceSrc);

/* ---------- 3. Manifest ---------- */
const files = {};
for (const f of ["content.json", "practice.mjs"]) files[f] = sha(fs.readFileSync(path.join(OUT, f)));
const counts = {
  topics: topics.length,
  bns: topics.reduce((a, t) => a + t.bns.length, 0),
  testBns: topics.reduce((a, t) => a + t.bns.filter(b => b.kind === "test").length, 0),
  practiceBns: topics.reduce((a, t) => a + t.bns.filter(b => b.kind === "practice").length, 0),
  questions: topics.reduce((a, t) => a + t.bns.reduce((s, b) => s + b.pool.length, 0), 0),
  questionsInTestBns: topics.reduce((a, t) => a + t.bns.filter(b => b.kind === "test").reduce((s, b) => s + b.pool.length, 0), 0)
};
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify({ module: "si-asoslari", version: VERSION, built: new Date().toISOString().slice(0, 10), sha256: files, counts }, null, 2) + "\n");
console.log(JSON.stringify({ version: VERSION, counts, sha256: files }, null, 1));
