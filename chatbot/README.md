# Portfolio chat assistant

An "Ask AI" button in the header (and the footer, and the ⌘K menu) opens a chat panel on every page that answers questions about the portfolio. The panel drops down from the header, so it never covers page content.

It has two layers:

1. **Built-in answers** (already live). The browser searches the portfolio data and answers directly. No server, no AI model, no cost, and it can only say what is on the site.
2. **An open language model** (optional, free). A small Cloudflare Worker gives an open model (Llama via Workers AI) only the relevant facts and asks it to answer from them. If it is unavailable or the free daily allowance is used up, the site silently falls back to layer 1, so visitors never see an error.

Answers appear as a stream. With the model on, text arrives token by token from the Worker; with the built-in answers, the text is typed out at a natural pace. The Stop button ends an answer early, and clicking a quick question interrupts one that is still typing.

The conversation lives only on the page, so it starts fresh on every page load. It is kept while you move between pages of the site, because the site never reloads.

```
Visitor ──▶ chat panel (assets/js/chat.js)
              ├─ built-in answer  (assets/js/chat-engine.js)      always works
              └─ POST question ──▶ Worker (chatbot/worker)         optional
                                      ├─ retrieve facts  (same engine)
                                      └─ Workers AI model ──▶ answer + links
```

## Status

The Worker is deployed at `https://portfolio-chat.shaon-kanti.workers.dev` (account subdomain `shaon-kanti`) and the site points at it (`CHAT_ENDPOINT` in `assets/js/chat.js`). Models: `@cf/meta/llama-3.1-8b-instruct-fp8` for normal questions, `@cf/meta/llama-3.3-70b-instruct-fp8-fast` for assessments.

To redeploy after changing `data/content.js` or the Worker: `cd chatbot/worker && npm run deploy`.

To watch errors while testing: `npx wrangler tail portfolio-chat --format pretty`. The Worker logs only the error reason, never a visitor's question.

## How it answers "why hire / fund / admit him?" questions

Keyword search is the wrong tool for assessment questions: it returns whatever shares a word with the question (the skills list, old student apps). So these questions take a different path:

1. `E.intent()` recognises an assessment ("strengths", "why should I fund / hire / admit him", "PhD", "professor", "best", "good fit" ...).
2. The Worker sends the model a short, ranked **fact sheet** (`buildHighlights` in `assets/js/chat-engine.js`) instead of search hits. For an academic audience it leads with the research record, then applied AI, then the academic record. For a recruiter it leads with AI systems, then leadership.
3. The prompt tells the model to pick the strongest points for the visitor's purpose, give exactly the number asked for, quote numbers exactly, never combine facts into new claims, and be honest that the portfolio lists patents and invention proposals but no peer-reviewed publications.
4. The Worker strips filler openers ("Based on the portfolio, ...") from the answer.

The fact sheet quotes headline numbers (500+, 30%, 40+, 60+, 12 ...). `node chatbot/test.js` fails if any of them stops matching the site, so they cannot drift silently. These questions use a stronger model, `MODEL_EVAL` in `wrangler.toml` (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`). In testing it answered in under 2.5 s with the same strong answer every time, where the 8B model took 5-13 s and varied. Cost (Cloudflare's published prices): about 60 of the 10,000 free neurons per day for one assessment question, so roughly 170 a day. Past the free allowance requests fail, and the page falls back to the built-in answers. Nothing is charged on the Free plan. Remove the `MODEL_EVAL` line to use the 8B model for everything.

Quality check against the real model: `node chatbot/eval.js` (9 questions with must-mention and must-not-mention rules). It needs the network and uses a little of the free allowance. Model answers vary a little from call to call, so run it twice before trusting a single failure.

## Set it up from scratch (about 5 minutes, free, no card)

You need a free Cloudflare account and Node.js 18+.

```bash
cd chatbot/worker
npm install
npx wrangler login          # opens a browser to sign in to Cloudflare
npm run deploy              # rebuilds the knowledge base, then deploys
```

The command prints an address like `https://portfolio-chat.<your-subdomain>.workers.dev`.

Then open `assets/js/chat.js` and paste it into the first setting:

```js
var CHAT_ENDPOINT = 'https://portfolio-chat.<your-subdomain>.workers.dev';
```

Bump the `?v=` number on the script links in `index.html`, then commit and push.
The panel's sub-title changes to "AI-assisted" when a model answered.

## Keeping it up to date

All facts come from `data/content.js`. After you change it, rebuild the Worker's copy:

```bash
node chatbot/build-kb.js        # or: npm run deploy  (does this for you)
```

The built-in layer reads `data/content.js` directly in the browser, so it is always current.

## Safety

- **No secrets.** The model is reached through a Cloudflare binding, so there is no API key to leak.
- **Only your site can call the Worker.** Edit `ALLOWED_ORIGINS` in `wrangler.toml` if the address changes.
- **Answers are restricted to retrieved facts**, with a system prompt that forbids inventing anything and refuses private details.
- **Input limits:** 300 characters per question, 6 history turns, 6 KB per request.
- **Rate limit:** uncomment the `RATE` block in `wrangler.toml` to cap each visitor.
- **Streaming is capped:** the Worker stops after 1,200 characters, strips control characters and skips malformed events. If the stream breaks midway, the page keeps what it received.
- **Model output is shown as plain text.** HTML in a reply is never executed, and only links to your own site are kept.
- **Nothing is logged by the Worker.** Cloudflare may keep standard request logs; the chat tells visitors not to share private information.

## Costs and limits

Workers AI has a daily free allowance. Check the current figure in the Cloudflare dashboard, since it can change. When it runs out the Worker returns an error and the site uses the built-in answers until the next day.

Models get retired. The first model I used, `llama-3.1-8b-instruct`, was deprecated on 2026-05-30 and the Worker then returned `model_unavailable`. If the chat ever shows built-in answers only, run `npx wrangler tail portfolio-chat` and look for `model_error`. To list current models: `npx wrangler ai models`. Then change `MODEL` in `wrangler.toml` to a text-generation model that returns `{"response": ...}` (the Llama family does) and redeploy.

## Tests

```bash
node chatbot/test.js     # 102 checks: Worker (origins, limits, injection, streaming, fallbacks) and every suggested question
```

## Files

| File | Purpose |
|---|---|
| `assets/js/chat-engine.js` | Knowledge base, search and built-in answers (browser and Worker) |
| `assets/js/chat.js` | The chat panel |
| `chatbot/worker/src/index.js` | The Worker |
| `chatbot/worker/src/kb.json` | Generated knowledge base (`node chatbot/build-kb.js`) |
| `chatbot/worker/wrangler.toml` | Worker settings |
| `chatbot/test.js` | Worker tests |
