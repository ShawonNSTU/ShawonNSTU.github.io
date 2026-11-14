/* Cloudflare Worker: the portfolio chat assistant's AI endpoint.
   POST { question, history, stream? } -> { answer, sources }   or, with stream:true, a server-sent-event stream:
     data: {"sources":[...]}   then   data: {"t":"next piece of text"} ...   then   data: [DONE]
   - Retrieval: finds the few portfolio facts relevant to the question (same engine the website uses).
   - Generation: an open model (Workers AI) answers using ONLY those facts.
   - Safety: origin allow-list, input limits, per-visitor rate limit, no secrets, no logging of questions. */
import * as E from '../../../assets/js/chat-engine.js';
import kb from './kb.json';

const index = E.makeIndex(kb);
const MAX_Q = 300, MAX_HIST = 6, MAX_BODY = 8000, MAX_JD = 5000, MAX_OUT = 1200;

function corsHeaders(origin, allowed) {
  const ok = allowed.includes(origin);
  return ok ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' } : null;
}
const json = (obj, status, cors) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...(cors || {}) } });

/* Strip things a visitor could use to smuggle instructions in. */
const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);

/* Small models like to open with filler ("Based on the portfolio, ..."). Remove it, whatever the prompt says.
   Only touches the very start of an answer, and only capitalises the next word if something was removed. */
function stripFiller(text) {
  let s = String(text).replace(/^\s+/, ''), changed = false, prev;
  do {
    prev = s;
    s = s.replace(/^I can only (?:provide|share|answer with) information (?:from|in) the (?:context|portfolio)[^.\n]*[.:]\s*/i, '')
         .replace(/^(?:Based on|According to|From|Using) (?:the |this |Shaon['\u2019]s |his |Shaon Kanti Dhar['\u2019]s )?[^,:\n]{0,50}?(?:portfolio|context|information provided|provided information)[^,:\n]{0,25}[,:]\s*/i, '');
    if (s !== prev) changed = true;
  } while (s !== prev);
  return changed && s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/* Re-shape the model's token stream into a small, safe event stream for the browser. */
function toClientStream(aiStream, sources) {
  const enc = new TextEncoder(), dec = new TextDecoder();
  const send = (c, o) => c.enqueue(enc.encode('data: ' + JSON.stringify(o) + '\n\n'));
  return new ReadableStream({
    async start(controller) {
      send(controller, { sources });
      const reader = aiStream.getReader();
      let buf = '', sent = 0, stop = false, head = '', headDone = false;
      const emit = (txt) => { const room = MAX_OUT - sent; if (room <= 0) { stop = true; return; } const piece = txt.slice(0, room); sent += piece.length; send(controller, { t: piece }); };
      const flushHead = () => { if (headDone) return; headDone = true; const clean = stripFiller(head); head = ''; if (clean) emit(clean); };   // hold the first ~80 characters so filler can be removed before it is shown
      try {
        while (!stop) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const parts = buf.split('\n\n'); buf = parts.pop();
          for (const blk of parts) {
            for (const ln of blk.split('\n')) {
              if (ln.indexOf('data:') !== 0) continue;
              const v = ln.slice(5).trim();
              if (v === '[DONE]') { stop = true; break; }
              let t = '';
              try {
                const j = JSON.parse(v), r = j.response;
                t = (typeof r === 'string' || typeof r === 'number') ? String(r) : '';      // some models send a number-only token ("40", "2025") as a JSON number
              } catch (e) { /* ignore a malformed event */ }
              t = t.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '');
              if (!t) continue;
              if (!headDone) { head += t; if (head.length >= 80) flushHead(); if (stop) break; continue; }
              emit(t);
              if (stop) break;
            }
            if (stop) break;
          }
        }
      } catch (e) { /* the model stream broke: end cleanly with what was sent */ }
      flushHead();
      try { await reader.cancel(); } catch (e) { /* already closed */ }
      controller.enqueue(enc.encode('data: [DONE]\n\n'));
      controller.close();
    }
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
function withTimeout(p, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    p.then(v => { clearTimeout(timer); resolve(v); }, e => { clearTimeout(timer); reject(e); });
  });
}
/* A model call must not hang: give up after MODEL_TIMEOUT_MS (default 10 s to start a stream, 25 s for a whole answer) so the page can fall back quickly.
   A fast error is retried once (a free-tier hiccup should not cost the visitor the AI answer); a timeout is not. */
async function runModel(env, input, model) {
  const ms = Number(env.MODEL_TIMEOUT_MS) || (input.stream ? 10000 : 25000);     // a stream only has to START in time; a whole answer takes longer
  try { return await withTimeout(env.AI.run(model, input), ms); }
  catch (e) {
    const msg = String(e && e.message || e).slice(0, 200);
    console.error(/timeout/.test(msg) ? 'model_timeout' : 'model_retry', msg);
    if (/timeout/.test(msg)) throw e;
    await sleep(450);
    return await withTimeout(env.AI.run(model, input), ms);
  }
}

/* POST /match { text } -> { match: { role, reqs, notes, found, source } }
   The job description is only used for this one model call: it is not stored or logged. */
async function matchRoute(body, env, cors) {
  const text = String(body && body.text || '').replace(/[\u0000-\u0009\u000b-\u001f\u007f<>]+/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, MAX_JD);
  if (text.length < 30) return json({ error: 'empty' }, 400, cors);
  try {
    const model = env.MODEL_EVAL || env.MODEL || '@cf/meta/llama-3.1-8b-instruct-fp8';
    const out = await runModel(env, { messages: [{ role: 'system', content: E.matchPrompt(index) }, { role: 'user', content: 'JOB DESCRIPTION:\n---\n' + text + '\n---' }], max_tokens: 900, temperature: 0 }, model);
    const r = out && out.response;
    const match = E.finishMatch(index, (typeof r === 'string' || (r && typeof r === 'object')) ? r : (out && out.result && out.result.response));
    if (!match) throw new Error('unparseable');
    return json({ match }, 200, cors);
  } catch (e) {
    console.error('match_error', String(e && e.message || e).slice(0, 200));
    return json({ error: 'model_unavailable' }, 503, cors);
  }
}

export default {
  async fetch(req, env) {
    const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const origin = req.headers.get('Origin') || '';
    const cors = corsHeaders(origin, allowed);

    if (req.method === 'OPTIONS') return cors ? new Response(null, { status: 204, headers: cors }) : new Response(null, { status: 403 });
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors);
    if (!cors) return json({ error: 'forbidden_origin' }, 403);                       // other websites cannot use this endpoint

    const len = Number(req.headers.get('content-length') || 0);
    if (len > MAX_BODY) return json({ error: 'too_large' }, 413, cors);

    if (env.RATE) {                                                                       // per-visitor limit, if the binding is configured
      const ip = req.headers.get('CF-Connecting-IP') || 'anon';
      const { success } = await env.RATE.limit({ key: ip });
      if (!success) return json({ error: 'rate_limited' }, 429, cors);
    }

    let body;
    try { body = await req.json(); } catch { return json({ error: 'bad_json' }, 400, cors); }

    if (new URL(req.url).pathname === '/match') return matchRoute(body, env, cors);        // role matcher: job description -> evidence-checked requirements
    const question = clean(body && body.question, MAX_Q);
    if (!question) return json({ error: 'empty' }, 400, cors);

    const evaluate = E.intent(question) === 'evaluate';                                // "why hire / fund him": send the curated fact sheet, not keyword hits
    const ctx = evaluate ? E.evalContext(index, question) : E.context(index, question, 5);
    if (!ctx.blocks.length) return json({ answer: "I couldn't find that on this portfolio. You can email " + kb.email + '.', sources: [] }, 200, cors);

    const history = (Array.isArray(body.history) ? body.history : []).slice(-MAX_HIST)
      .filter(m => m && (m.role === 'user' || m.role === 'assistant'))
      .map(m => ({ role: m.role, content: clean(m.content, 300) })).filter(m => m.content);

    const messages = [
      { role: 'system', content: E.systemPrompt(kb.email, evaluate ? E.audience(question) : null) + '\n\nCONTEXT (the only facts you may use):\n' + ctx.blocks.join('\n\n') },
      ...history,
      { role: 'user', content: question }
    ];

    try {
      const wantStream = body && body.stream === true;
      const model = (evaluate && env.MODEL_EVAL) || env.MODEL || '@cf/meta/llama-3.1-8b-instruct-fp8';   // MODEL_EVAL is optional: a stronger model for assessment questions
      const out = await runModel(env, { messages, max_tokens: evaluate ? 360 : 260, temperature: evaluate ? 0.1 : 0.2, ...(wantStream ? { stream: true } : {}) }, model);
      if (wantStream && out && typeof out.getReader === 'function') {
        return new Response(toClientStream(out, ctx.sources), { status: 200, headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no', ...(cors || {}) } });
      }
      let answer = clean(out && (out.response || (out.result && out.result.response)), 1200);
      /* keep line breaks the model used for bullets */
      if (out && typeof out.response === 'string') answer = out.response.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, 1200);
      answer = stripFiller(answer);
      if (!answer) throw new Error('empty');
      return json({ answer, sources: ctx.sources }, 200, cors);
    } catch (e) {
      console.error('model_error', String(e && e.message || e).slice(0, 300));          // the reason only: never the visitor's text
      return json({ error: 'model_unavailable' }, 503, cors);                          // the website falls back to its built-in answers
    }
  }
};
