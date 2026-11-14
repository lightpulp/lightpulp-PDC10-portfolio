#!/usr/bin/env python3
"""Flatten the built Astro site into a single self-contained HTML file.

This exists only so the site can be previewed as one shareable link.
The real site is the Astro project; run `npm run dev` for that.
"""
import pathlib, re, json
from bs4 import BeautifulSoup

DIST = pathlib.Path(__file__).resolve().parent.parent / "dist"
OUT = pathlib.Path("/mnt/user-data/outputs/pdc20-preview.html")

ROUTES = [
    ("/", "overview"),
    ("/timeline", "timeline"),
    ("/outcomes", "outcomes"),
    ("/work", "work"),
    ("/prompts", "prompts"),
    ("/reflection", "reflection"),
    ("/work/betis-chatbot", "cs-betis-chatbot"),
    ("/work/aiagri-overseer", "cs-aiagri-overseer"),
    ("/work/one-shot-build-prompt", "cs-one-shot-build-prompt"),
    ("/work/checking-the-citation", "cs-checking-the-citation"),
    ("/work/privacy-boundary", "cs-privacy-boundary"),
    ("/work/threshold-asymmetry", "cs-threshold-asymmetry"),
]
ROUTE_MAP = dict(ROUTES)


def path_for(route):
    rel = "index.html" if route == "/" else route.lstrip("/") + "/index.html"
    return DIST / rel


def rewrite(href):
    """Turn an absolute site path into a hash this single page understands."""
    if not href or href.startswith(("http", "mailto:")):
        return href
    if href.startswith("#"):
        return href
    base, _, frag = href.partition("#")
    base = base.rstrip("/") or "/"
    target = ROUTE_MAP.get(base)
    if target is None:
        return href
    return f"#{target}"


css = "\n".join(p.read_text() for p in sorted((DIST / "_astro").glob("*.css")))

# The spine is identical on every page; take it once from the home page.
home = BeautifulSoup(path_for("/").read_text(), "html.parser")
spine = home.find("nav", class_="spine")
title = home.title.string

sections = []
for route, slug in ROUTES:
    soup = BeautifulSoup(path_for(route).read_text(), "html.parser")
    main = soup.find("main")
    foot = main.find("footer", class_="foot")
    if foot:
        foot.decompose()
    for a in main.find_all("a", href=True):
        a["href"] = rewrite(a["href"])
    sections.append(
        f'<section class="page" id="{slug}" hidden>{main.decode_contents()}</section>'
    )

for a in spine.find_all("a", href=True):
    a["href"] = rewrite(a["href"])
spine_html = spine.decode()

foot_html = (
    '<footer class="foot"><p>Single-file preview of the Astro project. '
    "The real site is eleven routed pages; this flattens them so the whole "
    "thing can be looked at from one link.</p></footer>"
)

router = """
(function () {
  var ids = %s;
  var started = false;
  function show() {
    var id = (location.hash || '#overview').slice(1);
    if (ids.indexOf(id) === -1) {
      // An in-page anchor such as #asking. Leave the current view alone.
      if (started) return;
      id = 'overview';
    }
    started = true;
    ids.forEach(function (x) {
      var el = document.getElementById(x);
      if (el) el.hidden = x !== id;
    });
    document.querySelectorAll('.spine__nav a').forEach(function (a) {
      var t = a.getAttribute('href').slice(1);
      if (t === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    var m = document.getElementById('main');
    if (m) m.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', show);
  show();
})();
""" % json.dumps([s for _, s in ROUTES])

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&amp;display=swap">
<style>
{css}
.page[hidden] {{ display: none; }}
</style>
</head>
<body>
<a class="skip" href="#overview">Skip to content</a>
<div class="shell">
{spine_html}
<main class="main" id="main">
{''.join(sections)}
{foot_html}
</main>
</div>
<script>{router}</script>
</body>
</html>
"""

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(html)
print(f"wrote {OUT} ({len(html) / 1024:.0f} KB), {len(sections)} sections")
