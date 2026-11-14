---
title: "What the bot is allowed to know"
order: 5
subtitle: "Privacy-aware deployment, taken from a security review back into the chatbot"
summary: "A code review of an intentionally vulnerable PHP app found an API that would hand any user's private notes to anyone who asked. The same class of mistake was sitting in my own chatbot's data model."
finding: "A conversational system is a database with a friendly voice. Everything the customer types is now personal data I am responsible for."
role: "Solo: review, remediation, residual risk register"
status: "Remediated and documented"
stack: ["PHP 8", "MySQL", "Supabase", "Astro"]
techniques: ["Per-record authorization", "Input validation", "Least privilege", "Residual risk disclosure"]
outcomes: ["clo1", "clo3"]
sources:
  - title: "Campus notes security review lab"
    url: "https://claude.ai/chat/25bd5f47-263a-40c0-8807-9d15dc4c0722"
  - title: "Astro dashboard API and routes"
    url: "https://claude.ai/chat/1f49f371-f46a-4f56-ac32-07b50825e744"
---

The lab gave me a deliberately broken PHP notes app and sixty minutes to review it. The finding that stuck was not the SQL injection. It was the API.

The endpoint listed notes for whatever `user_id` appeared in the query string, with no session check at all. Count up through the integers and you have everyone's private notes. The update endpoint was the same in reverse: it matched on note id alone, so anyone could overwrite anyone's work. On top of that, the response reflected whatever `Origin` the caller sent and set `Access-Control-Allow-Credentials: true`, which means any website in the world could read a signed-in user's notes from their browser.

The fixes were not clever. Authenticate every call. Scope every query to the caller, so a note you do not own returns 404 rather than a permissions message that confirms it exists. Drop the CORS reflection entirely and allowlist origins. Require a CSRF token on writes. Enforce a content type and a size cap, parse JSON with an exact-key whitelist, and reject extra keys. Stop printing stack traces to users and log the details privately instead. Use a database account with only the privileges the app needs, not root.

## Carrying it across

Then I looked at my own chatbot's schema.

The `leads` table holds a name, a phone number, a location, free-text details about someone's home, and an array of photo URLs — pictures customers send of the inside of their houses so the shop can quote a restoration. The `conversations` table holds everything anyone has ever typed to the Page, keyed by their Messenger ID. The `customers` table tracks whether a human has taken over.

That is a real personal data store, assembled almost by accident while I was thinking about retrieval quality. Nothing in the course outcome about privacy says "and it only counts if you meant to collect it."

What changed as a result:

- Only data needed to produce a quote gets captured, and the bot asks for it explicitly rather than inferring it from conversation.
- Internal notes on an inquiry are labelled in the interface as not visible to the customer, so staff never have to guess which field the customer can see.
- Photos are referenced, acknowledged, and left for a person. The bot does not analyse them and does not describe what is in someone's living room.
- Credentials live in `.env`, which is in `.gitignore`, and are read server-side only. When I moved my Astro dashboard from a hardcoded fetch to a database, this was the whole reason for the exercise: an API key rendered into a page is a published API key.
- The read path for a dashboard uses a database account with `SELECT` only.
- Client passwords are never stored in a shared project folder. A password manager, and temporary access removed after setup.

## Saying what is still broken

The part of the report I am most pleased with is the table at the end listing what I did **not** fix: no rate limiting on login, account enumeration still possible at registration because the duplicate-email message differs, no password reset or email verification, a `role` column that is stored but never checked because no admin feature exists yet, and no automated tests.

Each row has a reason and a proposed fix. It would have been easy to quietly leave them out, and the report would have read as a cleaner success.

An honest residual risk list is more useful than a clean one, and the same applies to AI work. "The bot handles Taglish" and "the bot handles Taglish in the twelve phrasings I tested" are different claims, and only one of them survives contact with a customer.
