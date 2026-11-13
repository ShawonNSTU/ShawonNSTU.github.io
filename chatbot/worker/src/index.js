/* Cloudflare Worker: the portfolio chat assistant's AI endpoint.
   POST { question, history, stream? } -> { answer, sources }   or, with stream:true, a server-sent-event stream:
     data: {"sources":[...]}   then   data: {"t":"next piece of text"} ...   then   data: [DONE]
   - Retrieval: finds the few portfolio facts relevant to the question (same engine the website uses).
   - Generation: an open model (Workers AI) answers using ONLY those facts.
   - Safety: origin allow-list, input limits, per-visitor rate limit, no secrets, no logging of questions. */
import * as E from '../../../assets/js/chat-engine.js';
import kb from './kb.json';

const index = E.makeIndex(kb);
const MAX_Q = 300, MAX_HIST = 6, MAX_BODY = 6000, MAX_OUT = 1200;

function corsHeaders(origin, allowed) {
  const ok = allowed.includes(origin);
  return ok ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' } : null;
}
const json = (obj, status, cors) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...(cors || {}) } });

/* Strip things a visitor could use to smuggle instructions in. */
const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);

/* Re-shape the model's token stream into a small, safe event stream for the browser. */
function toClientStream(aiStream, sources) {
  const enc = new TextEncoder(), dec = new TextDecoder();
  const send = (c, o) => c.enqueue(enc.encode('data: ' + JSON.stringify(o) + '\n\n'));
  return new ReadableStream({
    async start(controller) {
      send(controller, { sources });
      const reader = aiStream.getReader();
      let buf = '', sent = 0, stop = false;
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
              try { const j = JSON.parse(v); t = typeof j.response === 'string' ? j.response : ''; } catch (e) { /* ignore a malformed event */ }
              t = t.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '');
              if (!t) continue;
              const room = MAX_OUT - sent;
              if (room <= 0) { stop = true; break; }
              const piece = t.slice(0, room); sent += piece.length; send(controller, { t: piece });
            }
            if (stop) break;
          }
        }
      } catch (e) { /* the model stream broke: end cleanly with what was sent */ }
      try { await reader.cancel(); } catch (e) { /* already closed */ }
      controller.enqueue(enc.encode('data: [DONE]\n\n'));
      controller.close();
    }
  });
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
    const question = clean(body && body.question, MAX_Q);
    if (!question) return json({ error: 'empty' }, 400, cors);

    const ctx = E.context(index, question, 5);
    if (!ctx.blocks.length) return json({ answer: "I couldn't find that on this portfolio. You can email " + kb.email + '.', sources: [] }, 200, cors);

    const history = (Array.isArray(body.history) ? body.history : []).slice(-MAX_HIST)
      .filter(m => m && (m.role === 'user' || m.role === 'assistant'))
      .map(m => ({ role: m.role, content: clean(m.content, 300) })).filter(m => m.content);

    const messages = [
      { role: 'system', content: E.systemPrompt(kb.email) + '\n\nCONTEXT (the only facts you may use):\n' + ctx.blocks.join('\n\n') },
      ...history,
      { role: 'user', content: question }
    ];

    try {
      const wantStream = body && body.stream === true;
      const out = await env.AI.run(env.MODEL || '@cf/meta/llama-3.1-8b-instruct', { messages, max_tokens: 260, temperature: 0.2, ...(wantStream ? { stream: true } : {}) });
      if (wantStream && out && typeof out.getReader === 'function') {
        return new Response(toClientStream(out, ctx.sources), { status: 200, headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no', ...(cors || {}) } });
      }
      let answer = clean(out && (out.response || (out.result && out.result.response)), 1200);
      /* keep line breaks the model used for bullets */
      if (out && typeof out.response === 'string') answer = out.response.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, 1200);
      if (!answer) throw new Error('empty');
      return json({ answer, sources: ctx.sources }, 200, cors);
    } catch (e) {
      return json({ error: 'model_unavailable' }, 503, cors);                          // the website falls back to its built-in answers
    }
  }
};
