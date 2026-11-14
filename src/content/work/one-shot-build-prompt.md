---
title: "The prompt that mostly says what not to build"
order: 3
subtitle: "Scope control as the main job of a generation prompt"
summary: "A single prompt meant to produce an entire PHP framework and CMS in one pass. Roughly a third of it is a list of things the model must not add."
finding: "For a generation task, describing the goal harder does nothing. Naming the acceptance criteria, the non-goals and the stopping rule does almost all the work."
role: "Solo: specification and prompt design"
status: "Prompt complete; one-week build"
stack: ["PHP 8", "Composer", "Plain PHP templates"]
techniques: ["Structured prompting", "Negative constraints", "Acceptance criteria", "Continuation protocol"]
outcomes: ["clo2", "clo3"]
sources:
  - title: "Lightpull Ideation — framework and CMS build prompt"
    url: "https://claude.ai/chat/a1fefa97-fe1b-40ef-8c5f-c84fa5c18731"
---

The assignment was a do-it-yourself PHP framework, one week, kept light. I wanted to generate the first full pass of it from a single prompt, then take over by hand.

My first attempts produced something impressive and useless. Asked for a small framework, the model gave me service providers, an event dispatcher, facades, a query builder and the beginnings of an ORM. None of that was wrong. All of it was out of scope, and every extra layer was something I would have had to read, understand and defend in a one-week project.

The problem was not that my description was too vague. It was that the model's prior for "PHP framework" is Laravel, and nothing in my prompt pushed back against that prior.

## Three moves that fixed it

**Acceptance criteria instead of description.** Every feature got the specific rules it had to satisfy rather than an adjective. Slugs are generated on create and never regenerated when the name is edited, because existing links would break. Uploaded images are validated by MIME type read from the file contents, not from the extension or the client-supplied type, capped at 2 MB, and renamed. A product referenced by an inquiry must not break the record. Those are testable. "Handle images properly" is not.

**An explicit non-goals section.** This is the part I would reuse on every generation task I ever write:

> This list exists because a capable agent will otherwise add them unprompted. Every item below is explicitly out of scope.

Then three paragraphs of them, split by layer — framework, application, tooling — ending with an escape hatch rather than a wall:

> If something in this list seems necessary while building, implement the simplest thing that satisfies the acceptance criteria instead, and note the shortcut in the README under "Known limitations".

The escape hatch matters. A hard prohibition with no alternative pushes the model into either violating the rule silently or stalling. Giving it a named cheaper path and a place to record the compromise means I find out about the trade-off instead of discovering it later in the code.

**A stopping rule.** Long generations fail in a specific, annoying way: the model runs out of room and papers over it with `// ... rest of implementation`. So the output format said what complete means and what to do when the response will not fit:

> Every file, complete and runnable. No `// ... rest of implementation` placeholders. If the response would be too long for one message, write the framework first and say clearly where you stopped.

A truncation I know about is a continuation. A truncation hidden behind a comment is a bug I find at 1am.

## Why this sits under the ethics outcome too

The security requirements in the prompt were not negotiable and were written that way: every query goes through a single database layer with bound parameters, passwords through `password_hash()`, a user cannot delete their own account and the check is repeated server-side rather than only hiding the button. Internal notes on an inquiry are labelled in the interface as not visible to the customer.

Putting those in the prompt as requirements rather than hoping for them is the same lesson as the validator in the farm project. If a property has to hold, state it as a constraint and then verify it. Do not assume a capable generator will remember.
