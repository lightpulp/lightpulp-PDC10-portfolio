export const SITE = {
  // --- Edit these three lines, then everything else follows ---
  author: 'Ron Brian D. Rodriguez',
  course: 'PDC10 — Conversational AI Systems',
  term: 'First semester, 2026–2027',
  tagline:
    'Four months of building things that talk, and learning where they lie.',
};

export interface Outcome {
  id: 'clo1' | 'clo2' | 'clo3' | 'clo4';
  n: number;
  short: string;
  title: string;
  statement: string;
  /** What I actually did, in one sentence. */
  claim: string;
}

export const OUTCOMES: Outcome[] = [
  {
    id: 'clo1',
    n: 1,
    short: 'Principles, limits, risks',
    title: 'Principles, architectures, capabilities, limitations and risks',
    statement:
      'Explain the principles, architectures, capabilities, limitations, and risks of conversational AI and large language models.',
    claim:
      'I ran the same task against a hosted frontier model and an 8B model on a Raspberry-Pi-class box, and designed around the difference instead of pretending it away.',
  },
  {
    id: 'clo2',
    n: 2,
    short: 'Prompt construction',
    title: 'Zero-shot, few-shot, role-based, retrieval-aware, structured prompting',
    statement:
      'Construct effective prompts using zero-shot, few-shot, role-based, retrieval-aware, and structured prompting techniques.',
    claim:
      'My most effective prompts got shorter over the semester. The gains came from naming the output contract and listing what not to produce, not from describing the task harder.',
  },
  {
    id: 'clo3',
    n: 3,
    short: 'Workflow and ethics',
    title: 'Conversational workflows, usability, accessibility, privacy, ethics',
    statement:
      'Design conversational workflows and response strategies that address usability, accessibility, privacy, and ethical considerations.',
    claim:
      'Both of my deployed designs hand control back to a human at a defined point. The bot pauses on a complaint; the farm agent advises and never opens a valve.',
  },
  {
    id: 'clo4',
    n: 4,
    short: 'Evaluation',
    title: 'Factuality, relevance, safety, bias, reliability, user experience',
    statement:
      'Evaluate conversational AI systems using metrics related to factuality, relevance, safety, bias, reliability, and user experience.',
    claim:
      'I caught a fabricated citation that was formatted perfectly and wrong in three fields. Fluent output is the hardest kind to evaluate, so I stopped reading output and started checking sources.',
  },
];

export const outcomeById = Object.fromEntries(
  OUTCOMES.map((o) => [o.id, o]),
) as Record<Outcome['id'], Outcome>;
