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

The Worker is deployed at `https://portfolio-chat.shaon-kanti.workers.dev` (account subdomain `shaon-kanti`) and the site points at it (`CHAT_ENDPOINT` in `assets/js/chat.js`). Model: `@cf/meta/llama-3.1-8b-instruct-fp8`.

To redeploy after changing `data/content.js` or the Worker: `cd chatbot/worker && npm run deploy`.

To watch errors while testing: `npx wrangler tail portfolio-chat --format pretty`. The Worker logs only the error reason, never a visitor's question.

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
node chatbot/test.js     # 50 checks: Worker (origins, limits, injection, streaming, fallbacks) and every suggested question
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
