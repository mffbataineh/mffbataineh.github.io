#!/usr/bin/env python3
"""Regenerates omar/index.html. Edit READY to publish a card. Run from the omar folder."""
import os
L = [
 ("mirrors", "انْعِكَاسُ الضَّوْءِ عَلَى الْمَرَايَا", "الْعُلُومُ", "#2F6FED", "الْمِرْآةُ الْمُسْتَوِيَةُ وَالْمُقَعَّرَةُ وَالْمُحَدَّبَةُ وَامْتِحَانٌ مِنْ ١٠ أَسْئِلَةٍ"),
 ("islamic", "التَّرْبِيَةُ الْإِسْلَامِيَّةُ", "سُورَةُ الْكَهْفِ وَالْعَقْلُ وَالْمَدَارِسُ الْفِقْهِيَّةُ", "#0F8F6A", "دُرُوسٌ مُصَوَّرَةٌ وَأَسْئِلَةٌ تَفَاعُلِيَّةٌ"),
 ("arabic-text", "اللُّغَةُ الْعَرَبِيَّةُ", "الْقِرَاءَةُ وَالْجُمْلَةُ الِاسْمِيَّةُ وَالْفِعْلِيَّةُ", "#F0622F", "رَاشِدٌ وَالنَّحْلَةُ وَعُصْفُورُ سَامِي"),
 ("arabic-visual", "رِحْلَةُ عُمَرَ الْبَصَرِيَّةُ", "اللُّغَةُ الْعَرَبِيَّةُ بِالصُّوَرِ وَالْأَلْوَانِ", "#7B5CFA", "مَحَطَّاتٌ مُصَوَّرَةٌ وَأَلْعَابٌ"),
]
READY = {k: [] for k, *_ in L}
for k in READY:
    if os.path.exists(f"{k}/index.html"): READY[k].append(("lesson", "ابْدَأِ الدَّرْسَ التَّفَاعُلِيَّ", f"{k}/"))
    for v in ("video.html",):
        if os.path.exists(f"{k}/{v}"): READY[k].append(("video", "شَاهِدِ الْفِيدِيُو", f"{k}/{v}"))
cards = ""
for k, t, s, col, d in L:
    btns = "".join(f'<a class="b {c}" href="{h}">{x}</a>' for c, x, h in READY[k]) or '<span class="soon">قَرِيبًا</span>'
    cards += f'<div class="card" style="--c:{col}"><div class="top"><h2>{t}</h2><p class="s">{s}</p></div><p class="d">{d}</p><div class="bs">{btns}</div></div>\n'
html = f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>دُرُوسُ عُمَرَ</title>
<style>
@font-face{{font-family:'Baloo';src:url(assets/baloo800.woff2);font-weight:800}}
@font-face{{font-family:'CairoK';src:url(assets/cairo700.woff2);font-weight:700}}
:root{{--ink:#1B2A49}}*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:'CairoK','Baloo',sans-serif;color:var(--ink);background:linear-gradient(160deg,#FFF7E8,#DDF1FF);min-height:100vh;padding:28px 16px 48px}}
h1{{font-family:'Baloo';font-weight:800;font-size:clamp(34px,6vw,60px);text-align:center;color:#2F6FED;margin-bottom:6px}}
.sub{{text-align:center;font-size:clamp(18px,3vw,26px);margin-bottom:28px}}
.grid{{max-width:1080px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:22px}}
.card{{background:#fff;border-radius:28px;box-shadow:0 10px 30px rgba(30,50,100,.16);padding:22px;display:flex;flex-direction:column;gap:12px;border-top:10px solid var(--c)}}
.card h2{{font-family:'Baloo';font-weight:800;font-size:30px;color:var(--c);line-height:1.3}}
.s{{font-size:20px;margin-top:4px}}.d{{font-size:18px;opacity:.8}}
.bs{{display:flex;flex-direction:column;gap:10px;margin-top:auto}}
.b{{display:block;text-align:center;text-decoration:none;color:#fff;background:var(--c);font-family:'Baloo';font-weight:800;font-size:24px;padding:12px 18px;border-radius:20px}}
.b.video{{background:#3b4a7a}}.b:active{{transform:scale(.97)}}
.soon{{text-align:center;font-family:'Baloo';font-weight:800;font-size:22px;color:#8a94b0;padding:12px;border:3px dashed #cfd8ee;border-radius:20px}}
</style></head><body>
<h1>دُرُوسُ عُمَرَ</h1><p class="sub">دُرُوسٌ مُصَوَّرَةٌ وَتَفَاعُلِيَّةٌ: اضْغَطْ عَلَى الْإِجَابَةِ وَتَعَلَّمْ بِمَرَحٍ</p>
<div class="grid">
{cards}</div></body></html>'''
open("index.html", "w", encoding="utf-8").write(html); print("menu ok", {k: len(v) for k, v in READY.items()})
