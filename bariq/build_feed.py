"""Builds bariq/news.json, the public feed read by the Bariq iOS app.

Usage: python3 build_feed.py <dir with exported news/*.json docs> <updated ISO timestamp>
Each input file is one AI Observatory story as exported by ArtifactData (out_dir).
"""
import json, pathlib, sys

FIELDS = ["published", "category", "importance", "source", "url",
          "title_en", "summary_en", "title_ar", "summary_ar"]

src = pathlib.Path(sys.argv[1])
updated = sys.argv[2]
stories = []
for f in sorted(src.glob("*.json")):
    doc = json.loads(f.read_text(encoding="utf-8"))
    data = doc.get("data", doc)
    story = {"id": doc.get("id", f.stem)}
    story.update({k: data.get(k) for k in FIELDS})
    if story["title_en"] and story["title_ar"] and story["published"]:
        stories.append(story)

stories.sort(key=lambda s: (s["published"], s["importance"] or 0), reverse=True)
out = pathlib.Path(__file__).with_name("news.json")
out.write_text(json.dumps({"updated": updated, "count": len(stories), "stories": stories},
                          ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"wrote {len(stories)} stories to {out}")
