#!/usr/bin/env python3
"""python3 video_page.py <folder> <title> : writes <folder>/video.html that plays <folder>/<folder>.mp4"""
import sys
f, t = sys.argv[1], sys.argv[2]
open(f"{f}/video.html", "w", encoding="utf-8").write(f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>{t}</title>
<style>*{{margin:0;box-sizing:border-box}}body{{background:#0f1530;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:12px;font-family:Tahoma,Arial,sans-serif}}
video{{width:100%;max-width:1100px;border-radius:18px;background:#000}}a{{color:#fff;background:#19B37D;text-decoration:none;font-size:22px;font-weight:700;padding:12px 28px;border-radius:18px}}</style></head>
<body><video controls playsinline preload="metadata" src="{f}.mp4"></video><a href="../">العودة إلى قائمة الدروس</a></body></html>''')
