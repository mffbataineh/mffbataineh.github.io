#!/usr/bin/env python3
"""Builds the lesson hub page (index.html) for each child: yousef, fayez, omar, maria.
Run from the repository root:  python3 kids-assets/build_hubs.py
To add a lesson: add a line to its child's list below. Buttons appear automatically
when the lesson folder has index.html (lesson) and/or video.html (video)."""
import os, html

CHILDREN = {
 "yousef": dict(name="يوسف", grade="الصف الثامن", school="مدرسة عين الخليج", emoji="🚀",
   c1="#2b3fa8", c2="#0f8f7e", hello="أهلاً يا يوسف! اختر درساً وابدأ المغامرة. كل إجابة صحيحة تقرّبك من العلامة الكاملة.",
   lessons=[
    ("math-cw3", "الرياضيات", "هيكل امتحان الفصل الأول", "26 درساً من ملزمة المدرسة: شرح بالصوت، أدوات تفاعلية، 146 سؤالاً مع الحل، واختبار تجريبي", "#2563eb", "🧮", "عربي"),
    ("english-eot1", "اللغة الإنجليزية", "End-of-Term 1 Revision", "كلمات وقواعد وقراءة وكتابة، مع نطق إنجليزي وترجمة عربية لكل جملة، واختبار تجريبي", "#e1572a", "🇬🇧", "English"),
   ]),
 "fayez": dict(name="فايز", grade="الصف الحادي عشر", school="", emoji="🎓",
   c1="#1d4ed8", c2="#7b5cfa", hello="أهلاً يا فايز! دروس مصوّرة وتفاعلية: اضغط على الإجابة وتعلّم بمرح.",
   lessons=[
    ("english1", "الْإِنْجِلِيزِيَّةُ: الْجُزْءُ الْأَوَّلُ", "My Family, Animals, Food, School", "الِاخْتِبَارَاتُ مِنْ ١ إِلَى ٤", "#2F6FED", "🇬🇧", ""),
    ("english2", "الْإِنْجِلِيزِيَّةُ: الْجُزْءُ الثَّانِي", "My Day, My House, Review", "الِاخْتِبَارَاتُ مِنْ ٥ إِلَى ٧", "#1E88C9", "🇬🇧", ""),
    ("physics", "الْفِيزِيَاءُ", "الْقِيَاسُ وَالسُّرْعَةُ وَالْقُوَّةُ وَالطَّاقَةُ", "وَرَقَةُ عَمَلِ الصَّفِّ الْحَادِي عَشَرَ", "#F0622F", "⚡", ""),
    ("arabic1", "الْعَرَبِيَّةُ: الْجُزْءُ الْأَوَّلُ", "ضَمَائِرُ الرَّفْعِ وَالتَّنْوِينُ وَعَلَامَاتُ التَّرْقِيمِ", "وَقِصَّةُ السَّمَكَاتِ الثَّلَاثِ", "#0F8F6A", "📜", ""),
    ("arabic2", "الْعَرَبِيَّةُ: الْجُزْءُ الثَّانِي", "مَهَارَاتُ الْقِرَاءَةِ وَالْفَهْمِ", "أَرْبَعُ قِصَصٍ مَعَ أَسْئِلَتِهَا", "#0B7A8F", "📖", ""),
    ("biology", "الْأَحْيَاءُ", "الطَّاقَةُ فِي الْخَلِيَّةِ", "الْبِنَاءُ الضَّوْئِيُّ وَالتَّنَفُّسُ الْخَلَوِيُّ", "#7B5CFA", "🧬", ""),
   ]),
 "omar": dict(name="عمر", grade="الصف العاشر", school="", emoji="🦅",
   c1="#0f766e", c2="#c2410c", hello="أهلاً يا عمر! دروس مصوّرة وأسئلة تفاعلية: شاهد، جرّب، وتعلّم.",
   lessons=[
    ("mirrors", "انْعِكَاسُ الضَّوْءِ عَلَى الْمَرَايَا", "الْعُلُومُ", "الْمِرْآةُ الْمُسْتَوِيَةُ وَالْمُقَعَّرَةُ وَالْمُحَدَّبَةُ وَامْتِحَانٌ مِنْ ١٠ أَسْئِلَةٍ", "#2F6FED", "🔭", ""),
    ("islamic", "التَّرْبِيَةُ الْإِسْلَامِيَّةُ", "سُورَةُ الْكَهْفِ وَالْعَقْلُ وَالْمَدَارِسُ الْفِقْهِيَّةُ", "دُرُوسٌ مُصَوَّرَةٌ وَأَسْئِلَةٌ تَفَاعُلِيَّةٌ", "#0F8F6A", "🕌", ""),
    ("arabic-text", "اللُّغَةُ الْعَرَبِيَّةُ", "الْقِرَاءَةُ وَالْجُمْلَةُ الِاسْمِيَّةُ وَالْفِعْلِيَّةُ", "رَاشِدٌ وَالنَّحْلَةُ وَعُصْفُورُ سَامِي", "#F0622F", "📜", ""),
    ("arabic-visual", "رِحْلَةُ عُمَرَ الْبَصَرِيَّةُ", "اللُّغَةُ الْعَرَبِيَّةُ بِالصُّوَرِ وَالْأَلْوَانِ", "مَحَطَّاتٌ مُصَوَّرَةٌ وَأَلْعَابٌ", "#7B5CFA", "🎨", ""),
   ]),
 "maria": dict(name="ماريا", grade="", school="", emoji="🌸",
   c1="#be185d", c2="#7c3aed", hello="أهلاً يا ماريا! اختاري درساً وابدئي اللعب والتعلّم.",
   lessons=[
    ("maths-quiz", "الرياضيات", "Maths Revision Quiz", "Year 6 · Term 1: Decimals, Circles, Nets, Triangle angles and area", "#2563eb", "🧮", "English"),
    ("arabic-hafeet", "اللغة العربية", "جَبَلُ حَفِيتٍ", "مراجعة امتحان اللغة العربية: الصف الخامس، الفصل الأول", "#0f8f7e", "⛰️", "عربي"),
   ]),
}
ORDER = ["fayez", "omar", "yousef", "maria"]

def page(key):
    ch = CHILDREN[key]; e = html.escape
    cards = ""; nl = nv = 0
    for folder, title, sub, desc, col, icon, lang in ch["lessons"]:
        btns = ""
        if os.path.exists(f"{key}/{folder}/index.html"):
            btns += f'<a class="b" href="{folder}/">▶ ابدأ الدرس التفاعلي</a>'; nl += 1
        if os.path.exists(f"{key}/{folder}/video.html"):
            btns += f'<a class="b video" href="{folder}/video.html">🎬 شاهد الفيديو</a>'; nv += 1
        btns = btns or '<span class="soon">قريباً</span>'
        tag = f'<span class="tag">{e(lang)}</span>' if lang else ""
        cards += f'''<article class="card" style="--c:{col}"><div class="ic">{icon}</div>{tag}<h2>{title}</h2><p class="s">{sub}</p><p class="d">{desc}</p><div class="bs">{btns}</div></article>\n'''
    sibs = "".join(f'<a class="sib{" on" if k == key else ""}" href="../{k}/"><span>{CHILDREN[k]["emoji"]}</span>{CHILDREN[k]["name"]}</a>' for k in ORDER)
    meta = " · ".join(x for x in [ch["grade"], ch["school"]] if x)
    return f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>دروس {ch["name"]}</title>
<style>
@font-face{{font-family:'Cairo';src:url(../kids-assets/fonts/cairo-arabic-800.woff2) format('woff2');font-weight:800;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF}}
@font-face{{font-family:'Cairo';src:url(../kids-assets/fonts/cairo-latin-800.woff2) format('woff2');font-weight:800;unicode-range:U+0000-00FF,U+2000-206F}}
@font-face{{font-family:'Tajawal';src:url(../kids-assets/fonts/tajawal-arabic-500.woff2) format('woff2');font-weight:500;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF}}
@font-face{{font-family:'Tajawal';src:url(../kids-assets/fonts/tajawal-latin-500.woff2) format('woff2');font-weight:500;unicode-range:U+0000-00FF,U+2000-206F}}
@font-face{{font-family:'Tajawal';src:url(../kids-assets/fonts/tajawal-arabic-800.woff2) format('woff2');font-weight:800;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF}}
:root{{--c1:{ch["c1"]};--c2:{ch["c2"]};--ink:#13203f}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:'Tajawal',sans-serif;font-weight:500;color:var(--ink);background:#f4f2fb;min-height:100vh;line-height:1.7}}
h1,h2{{font-family:'Cairo','Tajawal',sans-serif;font-weight:800;line-height:1.35}}
.hero{{position:relative;overflow:hidden;color:#fff;padding:26px 18px 70px;background:radial-gradient(circle at 12% 15%,rgba(255,255,255,.18) 0,transparent 35%),radial-gradient(circle at 92% 85%,color-mix(in srgb,var(--c2) 80%,#fff) 0,transparent 45%),linear-gradient(135deg,var(--c1),var(--c2))}}
.hero .in{{max-width:1080px;margin:0 auto}}
.sibs{{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:26px}}
.sib{{display:flex;align-items:center;gap:6px;text-decoration:none;color:#fff;background:rgba(255,255,255,.14);border:1.5px solid rgba(255,255,255,.28);border-radius:999px;padding:5px 14px 5px 12px;font-weight:800;font-size:15px}}
.sib.on{{background:#fff;color:var(--c1)}}
.who{{display:flex;align-items:center;gap:18px;flex-wrap:wrap}}
.av{{width:92px;height:92px;border-radius:30px;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.35);display:grid;place-items:center;font-size:50px;flex:none;animation:bob 4s ease-in-out infinite}}
@keyframes bob{{50%{{transform:translateY(-6px) rotate(-3deg)}}}}
.hero h1{{font-size:clamp(30px,6vw,50px)}}
.meta{{opacity:.9;font-size:17px}}
.hello{{margin-top:14px;font-size:clamp(17px,2.6vw,21px);max-width:720px;opacity:.95}}
.stats{{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}}
.st{{background:rgba(255,255,255,.14);border-radius:14px;padding:6px 14px;font-weight:800}}
.st b{{font-family:'Cairo';font-size:20px}}
.wave{{position:absolute;bottom:-1px;left:0;width:100%;height:50px}}
main{{max-width:1080px;margin:-34px auto 0;padding:0 16px 50px;position:relative}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:20px}}
.card{{position:relative;background:#fff;border-radius:26px;padding:22px;box-shadow:0 2px 4px rgba(19,32,63,.05),0 14px 34px rgba(19,32,63,.11);display:flex;flex-direction:column;gap:8px;border-top:8px solid var(--c);transition:transform .18s,box-shadow .18s}}
.card:hover{{transform:translateY(-5px);box-shadow:0 20px 44px rgba(19,32,63,.16)}}
.ic{{width:60px;height:60px;border-radius:19px;display:grid;place-items:center;font-size:32px;background:color-mix(in srgb,var(--c) 14%,#fff)}}
.tag{{position:absolute;left:18px;top:20px;font-size:13px;font-weight:800;border-radius:999px;padding:2px 10px;background:color-mix(in srgb,var(--c) 12%,#fff);color:var(--c)}}
.card h2{{font-size:24px;color:var(--c)}}
.s{{font-size:18px;font-weight:800}}
.d{{font-size:16px;opacity:.75}}
.bs{{display:flex;flex-direction:column;gap:10px;margin-top:auto;padding-top:8px}}
.b{{display:block;text-align:center;text-decoration:none;color:#fff;background:var(--c);font-family:'Cairo','Tajawal';font-weight:800;font-size:19px;padding:11px 16px;border-radius:16px;box-shadow:0 6px 14px color-mix(in srgb,var(--c) 30%,transparent)}}
.b.video{{background:#2b3557;box-shadow:none}}
.b:active{{transform:scale(.97)}}
.soon{{text-align:center;font-weight:800;color:#8a94b0;padding:10px;border:2.5px dashed #d3d9ee;border-radius:16px}}
.foot{{text-align:center;color:#8a94b0;font-size:14px;margin-top:30px}}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important;transition:none!important}}}}
</style></head><body>
<header class="hero"><div class="in">
<nav class="sibs" aria-label="دروس الإخوة">{sibs}</nav>
<div class="who"><div class="av">{ch["emoji"]}</div><div><h1>دروس {ch["name"]}</h1><div class="meta">{e(meta)}</div></div></div>
<p class="hello">{ch["hello"]}</p>
<div class="stats"><span class="st">📚 <b>{nl}</b> {"دروس تفاعلية" if nl != 1 else "درس تفاعلي"}</span>{f'<span class="st">🎬 <b>{nv}</b> فيديو</span>' if nv else ""}</div>
</div><svg class="wave" viewBox="0 0 1440 50" preserveAspectRatio="none"><path d="M0 30 C240 0 480 50 720 26 C960 2 1200 44 1440 20 V50 H0Z" fill="#f4f2fb"/></svg></header>
<main><div class="grid">
{cards}</div><p class="foot">صفحة {ch["name"]} · كل الدروس في مكان واحد</p></main>
</body></html>'''

if __name__ == "__main__":
    for k in ORDER:
        open(f"{k}/index.html", "w", encoding="utf-8").write(page(k)); print("hub ok", k)
