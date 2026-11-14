---
title: "A chatbot that is not allowed to quote a price"
order: 1
subtitle: "Retrieval-aware prompting for a furniture workshop in Pampanga"
summary: "A Messenger bot for Betis Legacy Furniture that answers catalog questions from a vector store, refuses to invent a peso figure, and hands the conversation to a person the moment money or anger enters it."
finding: "Retrieval is probabilistic. Anything that must hold on every single turn cannot live in the knowledge base — it has to be in the system prompt."
role: "Solo build: knowledge base design, prompt, workflow, schema"
status: "Built and tested in development mode; pending Meta App Review"
stack: ["n8n", "Supabase pgvector", "Meta Graph API", "OpenRouter", "text-embedding-3-small"]
techniques: ["Retrieval-aware prompting", "Role-based prompting", "Context management", "Refusal design", "Adversarial evaluation"]
outcomes: ["clo1", "clo2", "clo3", "clo4"]
sources:
  - title: "Chatbot for Betis Legacy Furniture"
    url: "https://claude.ai/chat/73a1fb93-e70e-4188-88b7-5b3bebde5a46"
---

Betis Legacy Furniture makes solid wood furniture out of two workshops in Minalin and Guagua. Twenty people in carpentry, upholstery and finishing, four in QC. Customers reach them through Facebook Messenger, in Tagalog, English, Kapampangan, or all three in one sentence.

The temptation with a business like this is to build a bot that sells. That was the first thing I got wrong. Custom woodwork, reupholstery and bulk orders for churches and schools all need a person to measure, inspect and quote. A bot that tries to close the sale will invent a number, and an invented number for a forty-piece church pew order is not a hallucination you can apologise your way out of.

So the bot's job became narrower and more useful: answer instantly, and turn the conversation into a qualified lead.

## Deciding what the model is allowed to look up

I had four documents from the company: conversation guidelines, a pricing and estimation policy, company information, and a product catalog in a spreadsheet. My instinct was to embed all four and let retrieval sort it out.

That instinct is wrong, and understanding why is the thing I actually learned this semester.

Retrieval runs a similarity search and hands the model whatever comes back. If a customer says *"magkano ang king size bed?"*, the search returns bed rows. It does not return the conversation guidelines, because the guidelines are not similar to a question about beds. So the rule *never give a final quote* would simply not be in context at the moment it mattered most.

| Document | Where it lives | Why |
| --- | --- | --- |
| Conversation guidelines | System prompt | Tone, language matching and handoff rules must apply every turn, not only when retrieval happens to surface them |
| Pricing and estimation policy | Split | Hard rules go in the system prompt; the explanation of what affects a reupholstery price goes in the knowledge base |
| Company information | Knowledge base | Facts the bot looks up when asked |
| Product catalog | Knowledge base, one chunk per product row | Lets a query about church seating find the church pew row |

One chunk per product row matters more than it sounds. A single chunk holding the whole catalog would have one embedding representing everything and matching nothing well. Row-level chunks mean *"may upuan ba kayo pang-simbahan?"* lands on the church pew entry rather than on an averaged blur of every product in the shop.

## The constraints that ride on every turn

The system prompt is short on purpose. Every line in it is there because something would go wrong without it.

- Answer only from the knowledge base. If unsure, say a team member will follow up.
- Never invent prices, discounts, or delivery dates.
- Keep replies short. Messenger is not email.
- Match the customer's language.
- For a quote, collect name, contact number, location, item or service, quantity, dimensions if known, and photos if it is a restoration.

And an explicit list of what the bot will not do: give a final quote, promise a delivery date, or assess damage from a photo. The third one took me a while to accept. The model will happily look at a photo of a split narra armrest and describe the repair. It should not, because the company's quote depends on what the upholsterer finds underneath, and a confident wrong estimate in a chat window becomes a customer expectation.

## Keeping context small on purpose

Memory is a `conversations` table keyed by the Messenger page-scoped user ID, with an index on `(psid, created_at desc)`. Each turn loads roughly the last ten messages, not the whole history.

```sql
create table if not exists conversations (
  id bigserial primary key,
  psid text not null,
  role text not null,            -- 'user' or 'assistant'
  message text,
  created_at timestamptz default now()
);
create index if not exists conversations_psid_idx
  on conversations (psid, created_at desc);
```

Retrieval returns the top four chunks. Together with a ten-message window and a short system prompt, the context stays small enough that a cheap model stays accurate and the reply arrives before the customer gives up. Loading the full history would have cost more, answered worse, and dragged stale details from a conversation three weeks ago into today's question.

A separate `customers` table carries a `bot_paused` flag. That single boolean is the whole human-handoff mechanism.

## Branching, and the exit

The workflow is not one path. The webhook verification handshake and the inbound message route are separate; inbound events pass through an extractor that filters out the things Meta sends that are not customer messages — the bot's own echoes, read receipts, and attachment-only events get handled or dropped before they ever reach the model. I tested that extractor against a sample payload containing all four shapes before wiring anything to the model, because a bot that replies to its own echo will talk to itself forever.

From there:

- **A general question** gets answered from retrieval.
- **A quote, custom order, bulk order or restoration** triggers lead collection, writes to the `leads` table, and notifies staff.
- **A photo** gets stored and acknowledged, with a person promised.
- **A complaint, or an angry customer**, sets `bot_paused = true` and alerts staff.

That last branch is the one I would defend hardest. An upset customer is exactly the case where a fluent, friendly, slightly wrong answer does the most damage. The correct conversational strategy there is to stop being a chatbot.

## How I planned to evaluate it

Not vibes. The company has years of real questions on their Page, so the test set is free:

1. Collect 30 to 50 real customer questions.
2. Score each answer as correct, wrong, or *should have handed off*. That third category is the important one — an answer can be factually right and still be a failure if a human should have taken it.
3. Try to break it: ask for discounts, ask it to compare against a competitor, go off-topic, use Taglish slang.
4. Have the owner read the transcripts for tone, because this is a family business and the brand voice is not mine to guess.

Running metrics after launch: messages handled, leads captured, handoff rate, response time. Handoff rate is the one I would watch. If it drops, the bot is probably answering things it shouldn't.

There is also a maintenance loop that is easy to skip and fatal to skip: weekly, read every conversation where the bot said *a team member will follow up*, and add those answers to the knowledge base. A knowledge base nobody feeds goes stale, and a stale knowledge base produces confident answers about last year's prices.

## What I would do differently

The riskiest thing in this design is not the model. It is that a captured lead sits in a table and nobody calls it. I treated that as an operations problem and agreed on who watches the alerts before launch, but a better design would make an unanswered lead visible and noisy rather than quietly rotting in a database.
