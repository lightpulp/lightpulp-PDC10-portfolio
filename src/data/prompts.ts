import type { Outcome } from './site';

export interface PromptEntry {
  id: string;
  technique: string;
  title: string;
  /** Where this came from. */
  context: string;
  /** The prompt itself, or a faithful excerpt. */
  text: string;
  /** Why this shape, and what it fixed. */
  why: string;
  outcomes: Outcome['id'][];
}

export const PROMPTS: PromptEntry[] = [
  {
    id: 'zero-shot',
    technique: 'Zero-shot, with constraints on the answer',
    title: 'Pick a mesh protocol',
    context: 'AiAgri — choosing between two LoRa mesh stacks early in development.',
    text: `Right now I need to choose between Meshtastic or MeshCore. Which is
easier to work with if I have to create a web app that accepts data
from a node?

I don't need you to explain every minor detail. Just answer straight,
and why.`,
    why: `No examples, no role, no scaffolding — the task is a comparison the model
can do cold. The work is in the last two lines. Naming the decision I have to make
("easier to work with, for ingesting node data into a web app") stops the answer
being a neutral feature table, and the constraint on length stops it being an essay.
A zero-shot prompt is not a short prompt. It is a prompt where the specificity goes
into the question instead of into examples.`,
    outcomes: ['clo2'],
  },
  {
    id: 'few-shot-format',
    technique: 'Few-shot for format, with the content explicitly fenced off',
    title: 'Generate an Oracle APEX page export',
    context: 'Betis Legacy Furniture catalog page — a file format with no readable specification.',
    text: `Create a complete Oracle APEX demo application [...]

DO NOT FOLLOW THIS. This is just a sample export file:

prompt --application/set_environment
set define off verify off feedback off
whenever sqlerror exit sql.sqlcode rollback
begin
  wwv_flow_imp.import_begin(p_version_yyyy_mm_dd=>'2026.03.30', ...
  [full sample export truncated]`,
    why: `An APEX export is a wall of generated PL/SQL calls, and describing its structure
in words would be hopeless. One real example teaches the format in a way no description can.

The risk with an exemplar is that the model copies its content as well as its shape, so the
example needs a boundary around it. "This is just a sample" was not enough on its own — I had
to pair it with the schema and page spec I actually wanted, so there was something concrete
for the model to put into the learned structure. An example without a counterweight becomes
the answer.`,
    outcomes: ['clo2'],
  },
  {
    id: 'role',
    technique: 'Role-based',
    title: 'The decision engine',
    context: 'AiAgri — first version, one prompt per sensor node.',
    text: `You are the decision engine for an off-grid smart-agriculture
monitoring network.

You receive data for ONE sensor node and must return ONE JSON object.
You only advise. A separate controller decides whether to execute
your actions.`,
    why: `Three sentences, and each one removes a category of wrong answer. "Decision engine"
sets the register — terse and mechanical, not a helpful assistant writing paragraphs. "ONE
sensor node" and "ONE JSON object" bound the input and the output. "You only advise" is the
important one: it tells the model its output is a recommendation passing to a controller, so
it stops writing as though it is about to open a valve.

The role is doing architecture, not personality. I never told it to be an expert agronomist,
because that would have invited confident agricultural claims the data cannot support.`,
    outcomes: ['clo2', 'clo3'],
  },
  {
    id: 'role-audience',
    technique: 'Role-based, written for the reader rather than the system',
    title: 'The farm overseer',
    context: 'AiAgri — second version, output read by a farmer rather than by code.',
    text: `You watch one environmental sensor node on a farm and tell the
farmer what matters and what to do.

[...]

5. summary: one or two plain sentences in the farm's language, no
   jargon, no sensor codes.
[...]
Actions are short, concrete instructions a farmer can do without tools
beyond the farm (e.g. "Water the beds for 15 minutes before 9 am",
"Check the soil sensor cable"). Maximum 4 actions, most important first.`,
    why: `Same system, different reader, so the role changed. The first version's audience was
a PHP controller and the register was machine-facing. This one's audience is a person standing
in a field, so the prompt names the language, bans the sensor codes, caps the number of actions
and gives worked examples of what "concrete" means.

The two examples do more than the adjective. "Short and concrete" produced things like "monitor
soil conditions". "Water the beds for 15 minutes before 9 am" produced instructions someone can
carry out.`,
    outcomes: ['clo2', 'clo3'],
  },
  {
    id: 'retrieval',
    technique: 'Retrieval-aware',
    title: 'Deciding what the retriever is allowed to be responsible for',
    context: 'Betis Legacy Furniture — four source documents, one vector store.',
    text: `System prompt (every turn):
  - Only answer from the knowledge base. If unsure, say a team member
    will follow up.
  - Never invent prices, discounts, or delivery dates.
  - Keep replies short, since Messenger isn't email.
  - Match the customer's language.
  - For quotes, collect: name, contact number, location, item or
    service, quantity, dimensions if known, photos if restoration.

Knowledge base (retrieved on demand, top 4):
  - Product catalog, one chunk per product row
  - Company information
  - Pricing explanations (not pricing rules)`,
    why: `The design question in a RAG system is not "how do I chunk this" but "which
instructions am I willing to have missing from context".

Similarity search returns what resembles the question. A customer asking about a bed will
never retrieve the tone guidelines, so a rule placed in the knowledge base is a rule that
applies sometimes. Anything that must hold on every turn goes in the system prompt; anything
the bot looks up goes in the store. The pricing document had to be split down the middle
along exactly that line — the rule "never give a final quote" is always-on, the explanation
of what drives a reupholstery price is lookup.`,
    outcomes: ['clo2', 'clo3', 'clo4'],
  },
  {
    id: 'structured',
    technique: 'Structured output',
    title: 'A closed vocabulary instead of a sentence',
    context: 'AiAgri — output consumed by a PHP controller.',
    text: `OUTPUT
Return only JSON matching the schema: level, summary, alerts
(level, message), actions (strings), notify_farmer.

Allowed actions: START_IRRIGATION, STOP_IRRIGATION, SEND_ALERT, NONE
Allowed flags:   NODE_OFFLINE, MOISTURE_SENSOR_SUSPECT, [...]
Levels:          ok | info | warning | critical`,
    why: `Enumerating the vocabulary is what makes the output programmable. With free text I
would have had to infer intent from a sentence, which is the same reliability problem moved
one layer down and made harder to test.

A closed set also gives the validator something to check against. Anything outside the list
is dropped rather than interpreted, so an invented action is not a bug — it is a case the
system already handles.`,
    outcomes: ['clo2', 'clo4'],
  },
  {
    id: 'unknowns',
    technique: 'Naming the absent data',
    title: 'Rainfall is unknown',
    context: 'AiAgri — the fix for the first hallucination I caused myself.',
    text: `1. Use ONLY the data in NODE DATA. Anything not provided (rainfall,
   water tank level, forecast, valve state) is UNKNOWN. Never invent
   values. If an unknown affects your decision, say so in "reason" and
   lower confidence.`,
    why: `My own example output mentioned rainfall and irrigation water. The database has
neither, so the model produced them. The cause was my prompt, not the model.

A general instruction not to hallucinate does nothing, because the model is not aware it is
hallucinating. Listing the specific fields that are absent gives it something concrete to
assert instead — and the clause about lowering confidence gives it somewhere to put the
uncertainty rather than resolving it into a guess.`,
    outcomes: ['clo1', 'clo2', 'clo4'],
  },
  {
    id: 'negative',
    technique: 'Negative constraints',
    title: 'Do not build these',
    context: 'Lightpull — a one-week PHP framework that kept arriving as Laravel.',
    text: `This list exists because a capable agent will otherwise add them
unprompted. Every item below is explicitly out of scope.

Framework: no event dispatcher, no service providers, no facades, no
ORM or Active Record, no migration system, no caching layer, no
template engine [...]

If something in this list seems necessary while building, implement the
simplest thing that satisfies the acceptance criteria instead, and note
the shortcut in the README under "Known limitations".`,
    why: `The model's prior for "PHP framework" is a large one, and no amount of saying
"keep it light" overrides a prior. Naming the specific additions is what overrides it.

The final paragraph is the part I would not drop. A prohibition with no alternative makes the
model choose between violating the rule and stalling, and it usually picks the first quietly.
Giving it a cheaper path and a place to log the trade-off turns a hidden violation into a line
in the README.`,
    outcomes: ['clo2'],
  },
  {
    id: 'continuation',
    technique: 'Stopping rule',
    title: 'Say where you stopped',
    context: 'Lightpull — long generations that silently truncate.',
    text: `Every file, complete and runnable. No "// ... rest of implementation"
placeholders. If the response would be too long for one message, write
the framework first and say clearly where you stopped.`,
    why: `Long outputs run out of room, and the default failure is a placeholder comment that
looks like finished code until you run it. Defining what "complete" means, and giving an
explicit protocol for the overflow case, converts a silent defect into a visible handoff.`,
    outcomes: ['clo2', 'clo4'],
  },
  {
    id: 'context-window',
    technique: 'Context management',
    title: 'Summarise before you prompt',
    context: 'Both projects, arrived at independently.',
    text: `Chatbot:  last ~10 messages per customer, keyed by PSID
          + top 4 retrieved chunks

Farm:     one call per node, never batched
          context = latest reading, last hour's min/avg/max,
          moisture delta over the hour, seconds since last seen,
          recent events`,
    why: `Both systems got better when I put less in the context, and in both cases the win
came from computing a summary rather than pasting a log.

Batching four nodes into one prompt was cheaper and measurably worse — a small model asked to
track four sets of readings starts attributing one node's dryness to another. Loading a
customer's full history dragged details from three weeks ago into today's question. The limit
is not only the context window; it is how much a given model can attend to without smearing
one thing into another.`,
    outcomes: ['clo1', 'clo2'],
  },
];
