---
title: "Making an 8B model admit it cannot see the rain"
order: 2
subtitle: "Structured output and a validator that distrusts the model"
summary: "A local language model reads one farm sensor node at a time and recommends an action. Every answer it returns is parsed, intersected against a whitelist, clamped, and downgraded to human review when it looks uncertain."
finding: "A prompt cannot enforce a contract. The prompt asks for well-formed output; the validator is what makes malformed output harmless."
role: "Solo build: prompt, schema, PHP validation layer, context builder"
status: "Working software on simulated sensor data; LoRa hardware still in development"
stack: ["Ollama", "PHP 8", "SQLite", "ESP32", "Bootstrap"]
techniques: ["Role-based prompting", "Structured output", "Enumerated vocabularies", "Output validation", "Deterministic floor"]
outcomes: ["clo1", "clo2", "clo4"]
sources:
  - title: "AiAgree — basecamp, prompt and AI endpoint"
    url: "https://claude.ai/chat/bbf34269-bf6c-4602-be25-e3dc07b69b05"
  - title: "AiAgree Coding — sensor node handoff and v2 schema"
    url: "https://claude.ai/chat/33f8a334-ed65-420c-893f-4dbf7738864c"
---

AiAgri is a solar-powered, off-grid monitoring network. Sensor nodes read soil moisture, temperature, humidity, light, rain and gas, and send small binary packets over LoRa to a base station. A language model running locally through Ollama on that base station reads each node and says what the farm should do.

The whole point is that there is no internet. That rules out a frontier model and leaves me with something in the 8B range on hardware a farm can afford. Everything below follows from that constraint.

## Writing for a model that will fill in gaps

The first version of this prompt failed in a way I did not predict. My own example of the output I wanted mentioned rainfall and irrigation water. The database has neither. A small model given a request that references rainfall will produce rainfall, because producing plausible text is what it does.

So rule one is not about the task. It is about the absence of data.

> Use only the data in NODE DATA. Anything not provided — rainfall, water tank level, forecast, valve state — is UNKNOWN. Never invent values. If an unknown affects your decision, say so in `reason` and lower confidence.

Naming the specific missing fields worked far better than a general instruction not to hallucinate. "Do not make things up" is advice. "Rainfall is unknown" is a fact the model can repeat back.

The rest of the rules exist to make the safe choice the easy one: never recommend irrigation from a node that has gone quiet for more than ten minutes, never act on a sensor that looks faulty, prefer doing nothing when the data is ambiguous, and cite the actual numbers in the explanation so a person can check the reasoning against the readings.

## The output is a contract, not prose

The model returns one JSON object per node, drawn from fixed vocabularies:

```json
{
  "node_id": 2,
  "status": "WARNING",
  "actions": ["START_IRRIGATION"],
  "reason": "Soil moisture is 18% and fell 9 points in the last hour.",
  "confidence": 0.91,
  "sensor_flags": [],
  "requires_human_review": false
}
```

Actions come from a closed set: `START_IRRIGATION`, `STOP_IRRIGATION`, `SEND_ALERT`, `NONE`. Flags come from another, including `NODE_OFFLINE` and `MOISTURE_SENSOR_SUSPECT`. A closed vocabulary is what turns model output into something a program can branch on. Free text would have forced me to parse intent out of a sentence, which is the same hallucination problem moved one layer down.

Temperature is zero, and each node gets its own call. Batching four nodes into one prompt was cheaper and noticeably worse — a small model asked to track four sets of readings starts attributing one node's dryness to another.

## The validator is the real safety layer

This is the part I would point at if someone asked what I learned about deploying a language model. The prompt is a request. The validator is the enforcement.

Every response passes through a sanitiser before anything downstream sees it:

- Returned actions are intersected with the allowed list. Anything invented is dropped. An empty result becomes `NONE`.
- `status` must be in the enum, or it becomes `WARNING`.
- `confidence` is clamped to the range 0 to 1, because a model will cheerfully return 1.5.
- `reason` is truncated to 500 characters.
- `sensor_flags` are intersected with the allowed flags.
- Anything below 0.6 confidence is forced to `requires_human_review: true` regardless of what the model said.
- If the response will not parse as JSON at all, that node gets a `WARNING` result with review required and the raw text preserved for debugging — not an exception, not a silent skip.

None of those checks trust the model. Every one of them assumes it will eventually return something wrong, and decides in advance what wrong looks like.

## Context the model can actually hold

The node summary handed to the model is computed, not raw. For each node: the latest reading, the last hour's minimum, average and maximum, the change in moisture over that hour, how many seconds since the node was last heard from, and its recent events.

Pouring an hour of raw readings into the prompt would have been easier to write and worse in every way — longer, slower, and harder for a small model to reason over. Summarising first is context management doing real work.

## The second version: letting rules outrank the model

The node-level prompt I wrote later goes further. Its input includes `rule_alerts`, produced by fixed deterministic thresholds, and the prompt states that those alerts are correct, must all appear in the output, and that the model may never set a level lower than the highest rule alert.

That gives a hybrid with a clear hierarchy. Deterministic rules set a floor. The model can escalate, add nuance, and explain in plain language, but it cannot talk the system out of a safety alert. It also receives `sensor_status` values like `noisy`, `stale` or `warming_up`, and a `calibrated` map, so it knows which percentages are trustworthy and which are rough.

The output schema changed to suit the audience rather than the program: a `level`, a one or two sentence `summary` in the farm's own language with no jargon and no sensor codes, at most four concrete actions in priority order, and `notify_farmer` set only for genuine warnings. A farmer does not need `MOISTURE_SENSOR_SUSPECT`. A farmer needs "check the soil sensor cable."

## Limits I had to state out loud

The model advises. A separate controller decides whether to execute. Nothing the model returns opens a valve.

And when I presented this, I said it runs on simulated data while the hardware is still in development. That mattered. There is real pressure in a pitch to let a working dashboard imply a deployed system, and the honest version of the claim is the one I can defend when someone asks what happens on a real farm at 2am.
