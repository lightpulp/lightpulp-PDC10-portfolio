import type { Outcome } from './site';

export interface Phase {
  id: string;
  n: number;
  name: string;
  range: string;
  /** The move that defines this phase. */
  move: string;
  /** What I was still getting wrong. */
  limit: string;
}

export const PHASES: Phase[] = [
  {
    id: 'asking',
    n: 1,
    name: 'Asking',
    range: 'June 18 – July 11',
    move:
      'Open questions with the goal described and nothing else. I brought the idea and expected the model to bring the shape.',
    limit:
      'Three of my first four prompts came back as questions rather than answers, because the facts that decide the answer — my skill level, my platform, my budget — were only in my head.',
  },
  {
    id: 'constraining',
    n: 2,
    name: 'Constraining',
    range: 'August 16 – August 28',
    move:
      'Negative constraints arrive, and so does the runtime. "Do not change the structure." "This runs on an EC2 instance, do not make the file too large."',
    limit:
      'I was fencing off what I did not want touched, but I still described what I did want in adjectives. "More professional" is not a specification.',
  },
  {
    id: 'specifying',
    n: 3,
    name: 'Specifying',
    range: 'September 10 – September 24',
    move:
      'Counts, formats and exclusions. Thirty questions here, twenty there, no case-based items, output as a table with a total row. Where a rubric existed, I pasted the rubric.',
    limit:
      'I specified the output and forgot to bound the volume. Asking for a runnable PHP sample got me 1,250 lines and six markdown files, and I had to ask where the actual code went.',
  },
  {
    id: 'handoff',
    n: 4,
    name: 'Handing off',
    range: 'October 3 – October 29',
    move:
      'Prompts became documents. Numbered sections, file trees, hardware facts, standing project rules, and a line telling the model not to start until I said so.',
    limit:
      'The briefs were good at describing the system and still assumed the model would get the output right if the input was detailed enough. Nothing in them said what to do when it did not.',
  },
  {
    id: 'contracting',
    n: 5,
    name: 'Contracting',
    range: 'November 2 – now',
    move:
      'The prompt states a contract and a program enforces it. Closed vocabularies, JSON schemas, a validator that distrusts the output, explicit non-goals, and citations checked against the publisher.',
    limit:
      'Every check is still run by me, by hand, on the day. I have no automated evaluation, and that is the next thing to build.',
  },
];

export type Source = 'claude' | 'chatgpt' | 'offline';

export interface Entry {
  date: string;
  display: string;
  title: string;
  phase: Phase['id'];
  source: Source;
  url?: string;
  /** What I was doing and what I asked for. */
  asked: string;
  /** A faithful excerpt of the prompt, where I have one. */
  excerpt?: string;
  /** What this shows about how I was prompting. */
  shows: string;
  outcomes?: Outcome['id'][];
  /** Turning points. Rendered with a marker. */
  mark?: boolean;
}

export const ENTRIES: Entry[] = [
  // ---------------------------------------------------------------- ASKING
  {
    date: '2026-06-18',
    display: 'Jun 18',
    title: 'Online egg tapping game',
    phase: 'asking',
    source: 'claude',
    url: 'https://claude.ai/chat/4568c717-3497-48bb-9d6a-b5d3d14fffd9',
    asked:
      'Described a mobile egg-battling game — three egg types, durability levels, crates from hens — and asked which language, framework or engine to build it on.',
    excerpt: 'what programming language or framework or game engine should i create this on',
    shows:
      'The answer depends entirely on my experience level, my platform and whether I want it fast or scalable. None of those were in the prompt, so the reply was three questions back at me. My first prompt of the semester cost a round trip.',
    outcomes: ['clo2'],
  },
  {
    date: '2026-06-18',
    display: 'Jun 18',
    title: 'Anonymous video platform',
    phase: 'asking',
    source: 'claude',
    url: 'https://claude.ai/chat/d87a191c-47b0-445c-95c3-f539af2fed0a',
    asked:
      'Admin-only uploads, user accounts that can like, save and comment, and a requirement to stay anonymous as the creator.',
    shows:
      'Asked what the content was and what to call it, I answered "I\'d rather not say" and "let\'s find a name later". Deferring the decisions that shape the build just moves them to the end, where they cost more.',
  },
  {
    date: '2026-06-18',
    display: 'Jun 18',
    title: 'Fake gambling app for addiction harm reduction',
    phase: 'asking',
    source: 'claude',
    url: 'https://claude.ai/chat/a08eda15-0e76-45cc-b1ab-ab619fc01597',
    asked:
      'Pitched an app where a deposit is simulated as gambled but never actually moves, aimed at families of problem gamblers, and asked what I thought of it.',
    shows:
      'The first time I used the model as a critic rather than a generator. The useful output was the objections — that holding real money makes me a financial service with KYC obligations, and that open-sourcing everything except the API leaves out the part where the trust actually lives.',
    outcomes: ['clo1', 'clo3'],
    mark: true,
  },
  {
    date: '2026-06-19',
    display: 'Jun 19',
    title: 'Kalimba tabs to number notation',
    phase: 'asking',
    source: 'claude',
    url: 'https://claude.ai/chat/bddf880c-d313-485c-8c99-1721975993fb',
    asked: 'Pasted thirty lines of letter tabs and asked for them in numbers.',
    excerpt: 'this is kalimba tabs, can you transpose it to numbers?\n*- is an octave higher',
    shows:
      'Eleven words and it worked perfectly, because the task is closed and I supplied the one piece of notation the model could not guess. Short prompts are not weak prompts. They are weak when the task is open and the constraints are missing.',
    outcomes: ['clo2'],
  },
  {
    date: '2026-06-23',
    display: 'Jun 23',
    title: 'Taho Simulator — Unity prototype',
    phase: 'asking',
    source: 'claude',
    url: 'https://claude.ai/chat/7e470c5b-e678-45f0-9601-041e9f59f8c6',
    asked:
      'A Filipino street-vendor sim. I wrote the prompt as a document with numbered sections: about the game, the core loop, progression, target platforms, tech stack, my own skill level, and a phased prototype roadmap.',
    excerpt: `CONTEXT PROMPT — TAHO SIMULATOR (Unity)
1. About the Game  [...]
My current skill level: Still learning Unity.
2. Prototype Roadmap (Current Goal)
Phase 2 — The Cart
  [...]
  Do NOT build real wheel physics yet`,
    shows:
      'The earliest ancestor of everything I write now. It already has the three moves I would not use consistently for another four months: sections, a stated skill level, and a "do NOT build this yet" line scoping a phase.',
    outcomes: ['clo2'],
    mark: true,
  },
  {
    date: '2026-06-23',
    display: 'Jun 23',
    title: 'Taho Simulator — the debugging collapse',
    phase: 'asking',
    source: 'claude',
    url: 'https://claude.ai/chat/7e470c5b-e678-45f0-9601-041e9f59f8c6',
    asked:
      'Later in the same chat, a cup rotating when it should not. Three exchanges of the model guessing at colliders and Rigidbodies before it asked for the script.',
    shows:
      'I had written an excellent context prompt and then debugged in all-caps one-liners. The answer arrived the moment the actual script appeared: holding E to talk to an NPC was also the rotate key. The structure I used to plan did not survive contact with frustration.',
    outcomes: ['clo2'],
  },
  {
    date: '2026-07-11',
    display: 'Jul 11',
    title: 'Apocalypse-ready cyberdeck',
    phase: 'asking',
    source: 'claude',
    url: 'https://claude.ai/chat/257b1c54-01b5-4975-b871-c6b7f806ef38',
    asked:
      'Listed four features I already wanted — radio, solar, ammo-box enclosure, USB storage — and asked for more.',
    excerpt: 'these are my ideas\nadd more',
    shows:
      'Two words, and the right shape for the job. Seeding a list with my own entries sets the register and the scale better than any description would. Good for ideation, useless for anything I intend to build.',
    outcomes: ['clo2'],
  },

  // ---------------------------------------------------------- CONSTRAINING
  {
    date: '2026-08-08',
    display: 'Aug 8',
    title: 'Continuous versus linear growth',
    phase: 'constraining',
    source: 'offline',
    asked:
      'Arguing with a friend about a videogame buff and needing the word for the difference between compounding and additive growth.',
    excerpt:
      'what you call the growth when its continuous, like i have 100 apples, scenario 1, 5% of apples are added everydat so 105 + (.5) scenario 2, 5, are added everyday, 100 + 5 + 5',
    shows:
      'Misspelled, unpunctuated, and fine. Both scenarios are spelled out with numbers, so the concept is unambiguous even though the sentence is a mess. Precision lives in the example, not the grammar.',
  },
  {
    date: '2026-08-08',
    display: 'Aug 8',
    title: 'Poem, and the pirate',
    phase: 'constraining',
    source: 'offline',
    asked:
      'Stuck on a poem built from "I cannot be a soldier, I hate following orders", and later asked the same shape for a pirate.',
    shows:
      'Creative unblocking by handing over the pattern and leaving the slot empty. The model fills the form I built rather than inventing one.',
  },
  {
    date: '2026-08-16',
    display: 'Aug 16',
    title: 'IPT10 lab 3 — registration form styling',
    phase: 'constraining',
    source: 'claude',
    url: 'https://claude.ai/chat/182e188b-b322-450b-af3d-6f2e270e2c86',
    asked:
      'Pasted the starter HTML and asked for Bootstrap styling in a separate file, green primary on white, form on the left, right side left empty for a placeholder.',
    excerpt: 'do not make the styling complex & keep the structure',
    shows:
      'Pasting the actual artifact instead of describing it. The named colour, the named layout and the instruction to keep the structure mean there is almost nothing left to guess.',
    outcomes: ['clo2'],
  },
  {
    date: '2026-08-17',
    display: 'Aug 17',
    title: 'Lightpulp portfolio — responsive pass',
    phase: 'constraining',
    source: 'claude',
    url: 'https://claude.ai/chat/5daf071e-4f2c-4378-b905-a94287416886',
    asked: 'Three improvements to an existing site, fenced in by four prohibitions and a deployment fact.',
    excerpt: `* Do not change the format
* Do not change style
* Do not change strucutre
* Do not change content (unless told)
* This is run on an amazon ec2 instance, do not make the file too large, just use simple bootstrap

1. the site looks like its only set for mobile viewing, it is not responsive
2. Try to add more depth on the text
3. Make it more professional looking without removing the feel`,
    shows:
      'The first prompt where I lead with what must not change, and the first time the deployment target is treated as a design constraint rather than an afterthought. The "(unless told)" is me leaving myself an override, which is the same escape-hatch move I would formalise in November.',
    outcomes: ['clo2'],
    mark: true,
  },
  {
    date: '2026-08-20',
    display: 'Aug 20',
    title: 'ESP32-CAM dashcam',
    phase: 'constraining',
    source: 'claude',
    url: 'https://claude.ai/chat/12f8b4e0-fb70-454e-b9a6-63492f63d20f',
    asked:
      'Stated my hardware limit — the camera module takes every pinout, leaving USB and power — and asked what else the board could usefully do inside that limit.',
    shows:
      'Stating the constraint is what got it corrected. The microSD slot actually coexists with the camera on the AI-Thinker board, so my premise was wrong and the reply said so before answering. A vaguer question would have been answered inside my mistake.',
    outcomes: ['clo1', 'clo2'],
    mark: true,
  },
  {
    date: '2026-08-20',
    display: 'Aug 20',
    title: 'Orange Pi payroll server over SSH',
    phase: 'constraining',
    source: 'claude',
    url: 'https://claude.ai/chat/69b7a465-180a-4124-87d9-130f5659c20d',
    asked:
      'How to edit files on an Armbian Orange Pi from VS Code. I supplied the web server, the path, the IP, the username and the password.',
    shows:
      'Complete environment, one-shot answer, no clarifying round trip. It is also the prompt I would write differently today: I pasted a live credential into a chat log. By November I was moving keys into .env and asking how to keep them out of the frontend.',
    outcomes: ['clo3'],
  },
  {
    date: '2026-08-28',
    display: 'Aug 28',
    title: 'Full-body tracking dance game',
    phase: 'constraining',
    source: 'offline',
    asked:
      'Laid out a plan — Python tracker on the phone, Unity for the game, TV as display only, socket between them — and asked two questions about it.',
    excerpt:
      'Is my approach with Unity + Python viable or is there a better option?\nWhat should I note?',
    shows:
      '"What should I note?" is the most useful thing I asked all summer. The first question checks the plan I have; the second asks for the problems I have not thought of yet. I still open design conversations this way.',
    outcomes: ['clo1'],
  },

  // ------------------------------------------------------------ SPECIFYING
  {
    date: '2026-09-10',
    display: 'Sep 10',
    title: 'Cheapest DIY mesh radio build',
    phase: 'specifying',
    source: 'chatgpt',
    asked:
      'A parts list for a Meshtastic or MeshCore node, with the output format dictated in the prompt.',
    excerpt: `Lets say i already have an esp32, I want to go the cheapest route so i can
duplicate the device many times. If the modules for meshcore and meshtastic
are different, provide the best & cheapest ones for each. give listings for
power sources like solar+battery & wired. list the modules in a table and
their prices along with the esp32 & total the price for each.`,
    shows:
      'Three things at once: the selection criterion (cheapest, because I am duplicating it), a branch instruction for the case where the two stacks differ, and the exact output format down to the total row. This is the first prompt I wrote that reads like a specification.',
    outcomes: ['clo2'],
    mark: true,
  },
  {
    date: '2026-09-12',
    display: 'Sep 12',
    title: 'Jellyfin library playing nothing',
    phase: 'specifying',
    source: 'offline',
    asked: 'Re-uploaded a whole music library to my server and no song would play.',
    shows:
      'My own note on this one, written at the time: the instructions look too casual, but the situation was expressed clearly and with enough context that the answer landed on the second reply. Register and rigour are different things, and I had started to notice.',
  },
  {
    date: '2026-09-13',
    display: 'Sep 13',
    title: 'yt-dlp bash script, then a lower bitrate for SymbianOS',
    phase: 'specifying',
    source: 'offline',
    asked:
      'A download script for my library, then a second pass re-encoding it low enough to play on an old Symbian phone.',
    shows:
      'Noted at the time that the model already had my OS, my server and my yt-dlp setup from earlier in the thread. First time I treated the conversation itself as accumulated context rather than starting clean.',
    outcomes: ['clo2'],
  },
  {
    date: '2026-09-17',
    display: 'Sep 17',
    title: 'AWS foundations quiz, 50 items',
    phase: 'specifying',
    source: 'claude',
    url: 'https://claude.ai/chat/2a9543b6-c1dd-41f0-82d3-ef6615ea240f',
    asked: 'A technical quiz generated from the course document, specified by counts and exclusions.',
    excerpt: `* Focus 30 questions mainly on aws services
* the remaining 20 should be about general questions
* No need for case to case basis type questions
* keyword = meaning type of questions
* make it interactable
* make it really technical`,
    shows:
      'Counts, a question-type exclusion and a required format. It is also the prompt where I specified the output beautifully and forgot to attach the input document, and the reply was a request for the file. Precision about the result does not help if the source is missing.',
    outcomes: ['clo2', 'clo4'],
  },
  {
    date: '2026-09-23',
    display: 'Sep 23',
    title: 'Mediator pattern research article',
    phase: 'specifying',
    source: 'claude',
    url: 'https://claude.ai/chat/2859dd7c-d313-4d3f-a534-2935c173d0ce',
    asked:
      'Pasted the entire midterm rubric — the five-page table, the reference requirements, the figure attribution rules, the formatting spec — and named my chosen pattern.',
    shows:
      'When a specification already exists, hand over the specification. Paraphrasing a rubric into a request loses exactly the details the rubric was written to pin down, such as "broken images = -10".',
    outcomes: ['clo2'],
  },
  {
    date: '2026-09-23',
    display: 'Sep 23',
    title: 'Airport runway mediator, first attempt',
    phase: 'specifying',
    source: 'claude',
    url: 'https://claude.ai/chat/c4ade729-d183-48e4-aa35-6b72fbd92ba3',
    asked:
      'A runnable PSR-12 PHP sample of the Mediator pattern, 3 to 5 pages, Bootstrap, red, airport theme, plus a UML diagram and a one-page explanation.',
    shows:
      'I got around 1,250 lines, eight classes, four web pages and six markdown documents. Every constraint I wrote was honoured. I had not written the one that mattered, which is how much.',
    outcomes: ['clo2'],
  },
  {
    date: '2026-09-24',
    display: 'Sep 24',
    title: 'Airport runway mediator, second attempt',
    phase: 'specifying',
    source: 'claude',
    url: 'https://claude.ai/chat/b9480cb0-9ae0-4f75-9ba3-1c5b836b9a35',
    asked: 'Same brief, tightened.',
    excerpt: '* be only 3-5 php files\n* BE REALLY FUCKING SIMPLE',
    shows:
      'The follow-up — "gang, where the fuck is the other php codes" — is the lesson. Unbounded generation produces volume, and volume buries the deliverable. "Files" instead of "pages" and an explicit simplicity demand is a crude version of the non-goals list I would write six weeks later.',
    outcomes: ['clo2'],
    mark: true,
  },
  {
    date: '2026-09-23',
    display: 'Sep 23',
    title: 'Hackathons and IoT events in Pampanga',
    phase: 'specifying',
    source: 'claude',
    url: 'https://claude.ai/chat/b8179322-8314-4fc8-b2ff-9ced20b1f843',
    asked: 'Events I could actually join, with my situation supplied so the results would be filtered to it.',
    excerpt:
      'For your information, Im a BSIT 3rd year student, In Pampanga philippines. Find relevant information for me',
    shows:
      'Casual register, precise targeting. Year level, course and province are the three facts that make the difference between a generic list and a usable one.',
  },

  // --------------------------------------------------------------- HANDOFF
  {
    date: '2026-10-02',
    display: 'Oct 2',
    title: 'Phone has no internet, PC does',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/f39611d6-2176-4de9-a887-82f06fb0543b',
    asked:
      'Described the symptom and the topology, then corrected the model twice as its picture of my network turned out to be wrong.',
    shows:
      'Troubleshooting is not one prompt, it is a sequence of evidence. The thread only resolved when I reported something I had not thought was relevant — that the 5 GHz band worked — which turned a DNS theory into a 2.4 GHz radio problem.',
    outcomes: ['clo4'],
  },
  {
    date: '2026-10-03',
    display: 'Oct 3',
    title: 'Offline Pac-Man with an Arduino controller',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/0839a7b0-6ebd-4ff0-bd46-8314598d4b12',
    asked: 'A Python game and an Arduino sketch, with the pin assignments and the deployment constraint given up front.',
    excerpt: `make me a simple pacman game using python, no internet required.
do not go web base because Ill be using other ports for other games.
[...]
joystick is A0 = xaxis A1 =yaxis
button 1 = digital 2
button 2 = digital 4`,
    shows:
      'A prohibition with its reason attached. "Do not go web based" alone invites a workaround; "because I will be using other ports for other games" tells the model what the constraint is protecting, so it can honour the intent rather than the letter.',
    outcomes: ['clo2'],
    mark: true,
  },
  {
    date: '2026-10-04',
    display: 'Oct 4',
    title: 'Joystick threshold and a dead Y axis',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/e6774f55-6174-4e37-a07a-149d8fb18975',
    asked: 'Pasted the sketch, named the symptom, and stated the behaviour I wanted.',
    excerpt: 'only when threshold is hit like 65% to press key, then check why my y axis is not working',
    shows:
      'Code plus symptom plus target behaviour is the minimum viable debugging prompt, and the contrast with June is the whole point. Two causes came back: the if/else chain never reached the Y branch, and the stick resting at 331 instead of 512 meant it was on 3.3 V, so my 65% was really 45%.',
    outcomes: ['clo2', 'clo4'],
  },
  {
    date: '2026-10-08',
    display: 'Oct 8',
    title: 'Pac-Man booth on a laptop hotspot',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/892ed933-4577-4b68-a5dc-f8ca37cba278',
    asked:
      'A booth build for our college event: offline, players join my access point, simple student-ID login, leaderboard.',
    excerpt:
      'everything even the assets should be solely on my pc so that 0 internet is needed\n[...] would only need student ID & name (i.e. 24-2156-111',
    shows:
      'Giving the ID format as a sample rather than a regex. One example of real data is less ambiguous than a description of it, and it became the validation rule in three later projects.',
    outcomes: ['clo2'],
  },
  {
    date: '2026-10-11',
    display: 'Oct 11',
    title: 'Pac-Man online — Next.js, Supabase, Vercel',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/d1d76ecc-b10e-473a-83b7-20fa7e6b1d31',
    asked:
      'The most specified prompt I had written up to that point: tech stack, deployment constraints, numbered features, asset naming, and my working directory pasted in.',
    excerpt: `- Deployment: Vercel-ready. (Note: Since Vercel has a read-only filesystem, use supabase)
- Leave the variables for api keys empty,
- I will be adding the API keys on Vercel myself
[...]
4. Asset Placeholders:
   - Use simple placeholders or colored shapes/labels for assets so we don't waste
     tokens, but structure the code so they can easily be swapped out later using
     these exact names: ghost1, ghost1_scared, ghost2, ghost2_scared.`,
    shows:
      'Three new habits in one prompt. I pre-empted a platform failure the model would otherwise have hit, I kept secrets out of generated code on purpose, and I named the placeholder assets so swapping them later would be a file copy rather than a search. The cost note is me budgeting the output.',
    outcomes: ['clo2', 'clo3'],
    mark: true,
  },
  {
    date: '2026-10-12',
    display: 'Oct 12',
    title: 'Pac-Man restyled for our organization',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/37bb9b35-a5c4-4d12-9860-29868d9b25df',
    asked: 'Re-theme the game around MSD, our org, using our logo and shirt design as the source.',
    shows:
      'Handing over the artifacts instead of describing the brand. Later in the same thread I corrected two of its assumptions from my own testing — the score API accepts 10k, and lives should carry across levels — which is faster than a fresh prompt.',
  },
  {
    date: '2026-10-14',
    display: 'Oct 14',
    title: 'UniLink customer validation deck',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/508a044b-949d-4c5c-83f3-626d5b19989a',
    asked:
      'Supplied the validation board, the interview transcripts and the seven-slide guideline, and asked for the deck plus a script.',
    shows:
      'The valuable output was not the slides. It caught that our own numbers did not agree — 5,000 requests from 300 users is seventeen each — and told us to change it before a judge did. Giving it the source data turns it into a consistency checker on my own work.',
    outcomes: ['clo4'],
    mark: true,
  },
  {
    date: '2026-10-14',
    display: 'Oct 14',
    title: 'Heroes on the Road interview questions',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/30d3f16d-a953-4746-a2ae-92049fe48d77',
    asked:
      'Tagalog interview questions for a donation drive, with last year\'s full transcript pasted in as the reference for tone.',
    shows:
      'Few-shot with a real artifact. A transcript carries the register, the honorifics and the kind of answer we wanted in a way no adjective would have. The questions came back usable in the language they would actually be asked in.',
    outcomes: ['clo2', 'clo3'],
  },
  {
    date: '2026-10-25',
    display: 'Oct 25',
    title: 'AI-CODE-RED — put it online',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/e55f9847-54ac-45a7-a74d-67364868d3c3',
    asked: 'Four words against an existing repository.',
    excerpt: 'Help me make this run online',
    shows:
      'A short prompt works when the context is the codebase rather than the sentence. The reply split into what works today and what is genuinely unfinished, and flagged that the host passcode must not reuse the one printed in the public README.',
    outcomes: ['clo3'],
  },
  {
    date: '2026-10-26',
    display: 'Oct 26',
    title: 'OpenBooth — handoff document',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/b9c1bf26-c982-4844-b6cb-b8803dd89f07',
    asked:
      'A photobooth build already half-finished, handed over as a numbered document: what it is, the file tree, the hardware facts, the known limits.',
    excerpt: `# HANDOFF: Photobooth project (Python/FastAPI + web UI)
You are taking over an in-progress photobooth build. Read all of this before
answering. The code described here already exists and mostly works.
[...]
Printer: Epson EcoTank L3250 on A4 paper (confirmed). It has ~3 mm unprintable
margins on A4, because its borderless printing only goes up to 4x6.
[...]
Rule I set for this project: no directory has more than 4 Python files.
Keep it that way.`,
    shows:
      'The prompt stopped being a request and became a briefing. Two parts carry most of the weight: the measured hardware fact, which prevents a design that cannot physically print, and the standing architectural rule, which survives every later turn in the thread.',
    outcomes: ['clo2'],
    mark: true,
  },
  {
    date: '2026-10-27',
    display: 'Oct 27',
    title: 'UniLink validation boards',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/f072c0db-9b1e-4f42-9e05-60deaca4b480',
    asked: 'Four more interviews formatted as validation boards, with one completed board given as the template.',
    excerpt: 'follow strictly the format i give you,',
    shows:
      'One filled-in example and an instruction to copy it exactly. Textbook one-shot prompting, and the right tool when the output has to match a document someone else will grade.',
    outcomes: ['clo2'],
  },
  {
    date: '2026-10-29',
    display: 'Oct 29',
    title: 'CollageNight — handoff with a stop condition',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/715f65d5-f563-4fff-8b1c-88ef4520a9a9',
    asked:
      'A two-page Next.js gallery on Google Drive, handed over as a document whose section 9 said not to begin implementation until I gave the word.',
    shows:
      'The reply was a read-back of its understanding, the design decisions it intended to hold to, and two choices it wanted me to make first. Building a checkpoint into the prompt is how I stopped discovering misunderstandings after four hundred lines of code.',
    outcomes: ['clo2', 'clo3'],
    mark: true,
  },
  {
    date: '2026-10-29',
    display: 'Oct 29',
    title: 'CollageNight — main page design',
    phase: 'handoff',
    source: 'claude',
    url: 'https://claude.ai/chat/693d0617-2d64-4b8f-aeaf-b98ceb6d5403',
    asked:
      'Red and black, prom-night feeling, minimal tech elements because we are a computer studies college, placeholder images, credit our organization, and focus on the main page only.',
    shows:
      'A design brief with a scope limit in it. "Focus on the main page for now" is the difference between one page I can review and two I have to skim.',
  },

  // ----------------------------------------------------------- CONTRACTING
  {
    date: '2026-11-02',
    display: 'Nov 2',
    title: 'Oracle APEX page export',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/a4165914-1c46-40fb-8d6d-9bfd7c395613',
    asked:
      'A full schema plus an importable APEX page, with a real export file pasted in as a format reference and fenced off from the content.',
    excerpt: 'DO NOT FOLLOW THIS, This is just a sample export file',
    shows:
      'Few-shot where the example teaches the shape and an explicit boundary stops it supplying the substance. An APEX export is a wall of generated PL/SQL that would be hopeless to describe in words, so the example is doing work nothing else could.',
    outcomes: ['clo2'],
  },
  {
    date: '2026-11-02',
    display: 'Nov 2',
    title: 'AiAgri sensor node — the farm-facing prompt',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/33f8a334-ed65-420c-893f-4dbf7738864c',
    asked:
      'A prompt for a local model reading one ESP32 node, with sensor tolerances, calibration state, fault status and deterministic rule alerts all declared in the input.',
    excerpt: `- rule_alerts: alerts from fixed safety rules. These are correct. Include every
  warning and critical rule alert in your output and never set a level lower
  than the highest rule alert.
[...]
5. summary: one or two plain sentences in the farm's language, no jargon,
   no sensor codes.`,
    shows:
      'Deterministic rules set a floor the model is forbidden to go below, and the model supplies the nuance and the plain language above it. The first time I wrote a prompt where the model is explicitly not the authority.',
    outcomes: ['clo1', 'clo2', 'clo3'],
    mark: true,
  },
  {
    date: '2026-11-03',
    display: 'Nov 3',
    title: 'Betis Legacy Furniture — the retrieval boundary',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/73a1fb93-e70e-4188-88b7-5b3bebde5a46',
    asked:
      'Four company documents and one vector store, and the question of which of them the retriever could be trusted to surface.',
    shows:
      'Retrieval is probabilistic, so a rule placed in the knowledge base is a rule that applies sometimes. Splitting the pricing document down the middle — the always-on rule in the system prompt, the lookup detail in the store — is the single most useful thing I learned this semester.',
    outcomes: ['clo1', 'clo2', 'clo3', 'clo4'],
    mark: true,
  },
  {
    date: '2026-11-04',
    display: 'Nov 4',
    title: 'AiAgri — the validator',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/bbf34269-bf6c-4602-be25-e3dc07b69b05',
    asked:
      'A PHP endpoint that runs the decision prompt per node and refuses to trust what comes back.',
    excerpt: `Allowed actions intersected with the whitelist. Status forced into the enum
or downgraded to WARNING. Confidence clamped to 0..1. Below 0.6 forces
requires_human_review. Unparseable output becomes a flagged WARNING,
not an exception and not a silent skip.`,
    shows:
      'The end of the arc. The prompt is a request; the program is the enforcement. Every check in the sanitiser assumes the prompt failed, which is a different relationship with the model than the one I had in June.',
    outcomes: ['clo1', 'clo2', 'clo4'],
    mark: true,
  },
  {
    date: '2026-11-05',
    display: 'Nov 5',
    title: 'Lightpull — a prompt made of non-goals',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/a1fefa97-fe1b-40ef-8c5f-c84fa5c18731',
    asked:
      'A one-shot brief for a PHP framework and CMS, about a third of which is a list of things not to build.',
    excerpt: `This list exists because a capable agent will otherwise add them unprompted.
[...]
If something in this list seems necessary while building, implement the
simplest thing that satisfies the acceptance criteria instead, and note the
shortcut in the README under "Known limitations".`,
    shows:
      'September\'s "BE REALLY FUCKING SIMPLE" with six weeks of learning applied to it. The prohibition is itemised rather than general, and it has an escape hatch, so a trade-off becomes a line in the README instead of a silent violation.',
    outcomes: ['clo2'],
  },
  {
    date: '2026-11-05',
    display: 'Nov 5',
    title: 'Two paper reviews, two wrong citations',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/12789afe-c586-48bc-89f4-46f38a11e7b8',
    asked: 'APA 7th references for two papers, checked against the publishers rather than accepted as written.',
    shows:
      'Both came back immaculate and wrong — one in author order and page range against IEEE\'s record, one dated to the online-first release rather than the published issue. Verify the arbitrary, read the reasoned.',
    outcomes: ['clo1', 'clo4'],
    mark: true,
  },
  {
    date: '2026-11-06',
    display: 'Nov 6',
    title: 'Campus Notes security review',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/25bd5f47-263a-40c0-8807-9d15dc4c0722',
    asked:
      'A code review of a deliberately vulnerable PHP app, delivered as findings, fixes, tests and a table of what I did not fix.',
    shows:
      'The API handed any user\'s private notes to anyone who passed their id. I then found the same shape in my own chatbot schema, which stores names, phone numbers and photos of customers\' homes. The residual-risk table is the part I am proudest of.',
    outcomes: ['clo1', 'clo3'],
  },
  {
    date: '2026-11-07',
    display: 'Nov 7',
    title: 'Astro routes, .env and a database',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/1f49f371-f46a-4f56-ac32-07b50825e744',
    asked: 'Three numbered questions about a dashboard, the first of them about safety.',
    excerpt: 'the api is served through the frontend in catfacts.astro , how do i make it safer?',
    shows:
      'Asking the security question before being bitten by it, which is new. It is also the chat this portfolio is built out of — I learned Astro\'s routing and server-side data loading here three days before using them for this site.',
    outcomes: ['clo3'],
  },
  {
    date: '2026-11-07',
    display: 'Nov 7',
    title: 'Framework and hosting for client work',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/d8a3d961-5d95-4bb4-b745-6d1bf644c777',
    asked:
      'A lightweight framework to cycle alongside Next.js, and cheap hosting where one account can hold many client sites.',
    shows:
      'I kept pushing back until the pricing made sense rather than accepting the first table. The useful answer came three turns in, when the question changed from "which plan" to "which of these costs is actually a decision I have to make".',
    outcomes: ['clo4'],
  },
  {
    date: '2026-11-08',
    display: 'Nov 8',
    title: 'Quotation template review',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/1b3e4980-b736-4078-8388-dc19df723b44',
    asked: 'A critique of my own pricing and scope-of-work document, with the output format and the tone specified.',
    excerpt:
      'NO NEED TO CREATE A DOCUMENT, just state as text\n\nBe clear, be concise and point out only what is necessary, be strict.',
    shows:
      'Naming the deliverable I did not want, and asking to be judged strictly rather than encouraged. Both are things I would not have thought to write in August.',
  },
  {
    date: '2026-11-09',
    display: 'Nov 9',
    title: 'EyeWay — obstacle detection for blind users',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/609040a9-eca8-4ffc-ba82-ba5e3c7f6ab9',
    asked:
      'Wiring an ESP32-CAM into an existing MobileNetV2 detection pipeline that drives vibration motors on a pair of glasses.',
    shows:
      'The 0.8 confidence threshold is the whole project. A missed obstacle leaves the user at their baseline; a false buzz teaches them to ignore the device. The two failures cost different amounts, so maximising accuracy would be the wrong target.',
    outcomes: ['clo1', 'clo3', 'clo4'],
  },
  {
    date: '2026-11-10',
    display: 'Nov 10',
    title: 'AWS load balancer failover, twice',
    phase: 'contracting',
    source: 'claude',
    url: 'https://claude.ai/chat/84a00c31-dab1-4f86-a9e7-6557b0c9859f',
    asked:
      'Pasted the lab sheet and asked for depth, with the depth itself specified — and then recalibrated when the answer overshot.',
    excerpt:
      'Be in depth, provide the page, then certain configurations, no need to be to indepth for configurations\nIm in Singapore\n[...]\nno t tooo indepth',
    shows:
      'Verbosity is a parameter I now set and adjust, rather than something I accept. The region is in the prompt because it changes the availability zone names and the console labels.',
    outcomes: ['clo2'],
  },
];

export const entriesByPhase = (id: string) => ENTRIES.filter((e) => e.phase === id);

export function byMonth(entries: Entry[]) {
  const out: { key: string; label: string; items: Entry[] }[] = [];
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  for (const e of sorted) {
    const key = e.date.slice(0, 7);
    const label = new Date(e.date + 'T00:00:00Z').toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const last = out[out.length - 1];
    if (last && last.key === key) last.items.push(e);
    else out.push({ key, label, items: [e] });
  }
  return out;
}

export const SOURCE_LABEL: Record<Source, string> = {
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  offline: 'From my deliverables log',
};
