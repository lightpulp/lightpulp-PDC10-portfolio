# PDC20 learning portfolio

An Astro site built around a timeline of 47 conversations from 18 June to
10 November 2026, showing how the way I prompt changed over five phases, with
the four PDC20 learning outcomes mapped onto the evidence.

The timeline (`src/data/timeline.ts`) is the centrepiece. Six threads are also
written up as full case studies in `src/content/work/`.

## Read this first

The case studies were drafted from your own chat history, so the *facts* come
from what you actually built — the Supabase schema, the `sanitize()` validator,
the APA corrections, the 0.8 confidence threshold. But the **prose, the framing
and the conclusions are a first draft, not your words yet.**

Before you submit this, go through every page and rewrite anything that does not
sound like you. Two reasons. First, a portfolio in someone else's voice reads as
one, and an examiner who asks you to explain a sentence you did not write will
find out in about four seconds. Second, a few claims need your confirmation:

- `src/data/site.ts` — your name, the course title and the term. I guessed the
  term.
- `src/content/work/betis-chatbot.md` — I wrote that App Review is pending.
  Update it if that has changed.
- `src/content/work/aiagri-overseer.md` — says the LoRa hardware is still in
  development. Same.
- `src/pages/reflection.astro` — the "Claims I cannot make" section. That section
  is the strongest thing here, so make sure every limitation in it is still true.
- Every `sources:` URL points at a claude.ai conversation. **Those links only
  open for you.** Either keep them as your own index, or replace them with
  screenshots or repository links before you share the site with anyone else.

## Run it

```bash
npm install
npm run dev          # http://localhost:4321
```

```bash
npm run build        # static output in dist/
npm run preview      # serve dist/ locally
```

Node 18 or newer. There is no database, no API key and no server — it builds to
plain static files.

## Structure

```
src/
  content/work/*.md        one markdown file per case study
  content.config.ts        the frontmatter schema those files must satisfy
  data/site.ts             your name, course, and the four outcomes
  data/timeline.ts         the five phases and all 47 dated entries
  data/prompts.ts          the prompt library
  components/
    Artifact.astro         framed prompt/output block
    RuleSheet.astro        numbered rules with margin annotations (the hero)
    Spine.astro            left navigation
  layouts/Base.astro       page shell, fonts, skip link
  pages/
    index.astro            overview
    timeline.astro         the chronological log, grouped by month
    outcomes.astro         evidence map, one section per outcome
    work/index.astro       case study index
    work/[...slug].astro   case study template
    prompts.astro          prompt library
    reflection.astro       reflection and limitations
  styles/global.css        all design tokens live at the top of this file
tools/make-preview.py      flattens dist/ into one shareable HTML file
```

## Editing the timeline

Everything is in `src/data/timeline.ts`. `PHASES` holds the five phases, each
with the move that defines it and what I was still getting wrong. `ENTRIES`
holds one object per conversation:

```ts
{
  date: '2026-10-26',          // sorts and groups the entry
  display: 'Oct 26',
  title: 'OpenBooth — handoff document',
  phase: 'handoff',            // must match a PHASES id
  source: 'claude',            // claude | chatgpt | offline
  url: 'https://claude.ai/...',// optional
  asked: '...',                // what I was doing
  excerpt: '...',              // the prompt itself, optional
  shows: '...',                // what it demonstrates
  outcomes: ['clo2'],          // optional
  mark: true,                  // optional; renders as a turning point
}
```

A phase band is drawn automatically above the first entry of each phase, so
adding an entry in the middle of a phase needs nothing else. Entries sort by
`date`, so the order in the file does not matter.

**Entries marked `source: 'offline'` or `'chatgpt'` came from your PDC10
deliverables document, not from a chat I can read.** I transcribed the prompts
from that file. Check them against the original before submitting, and if you
still have the screenshots, they belong next to those entries.

## Adding a case study

Drop a new `.md` file in `src/content/work/`. The schema in
`src/content.config.ts` is enforced at build time, so a missing field fails the
build rather than rendering blank. Copy an existing file's frontmatter and edit
it.

`outcomes` must be some subset of `clo1` to `clo4`. Those IDs are what wires the
case study into the outcomes page and the spine, so getting them right is what
makes the evidence map work.

## Changing the design

Every colour, typeface and size is a custom property at the top of
`src/styles/global.css`, with a dark-mode block below it. Change them there
rather than hunting through components.

The palette: stone paper, narra-brown ink, teal for verified claims, and rust
used only to mark guardrails and failures. If you add a new accent, give it a
job — the rust is readable precisely because it never decorates anything.

## Deploying

Cloudflare Pages, which you are already set up for:

1. Push this folder to a Git repository.
2. Cloudflare dashboard, Workers & Pages, Create, connect the repository.
3. Framework preset **Astro**. Build command `npm run build`, output directory
   `dist`.
4. Set `site` in `astro.config.mjs` to the deployed URL once you have it.

Netlify and Vercel both auto-detect Astro with the same settings.

## The preview file

`tools/make-preview.py` reads `dist/` and writes a single self-contained HTML
file with all eleven pages and hash-based navigation. It exists only for sharing
a link to the whole thing at once. Run `npm run build` first, then:

```bash
python3 tools/make-preview.py
```

It needs `beautifulsoup4`.
