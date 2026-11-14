/* Quality check against the DEPLOYED Worker and the real model (needs the network).
   Run: node chatbot/eval.js [worker-url]
   Each question has things the answer must mention and things it must not. */
const URL_ = process.argv[2] || 'https://portfolio-chat.shaon-kanti.workers.dev';
const ORIGIN = 'https://shawonnstu.github.io';
const JUNK = /Food Order|Travel Assistant|TypeScript|Vue\.js|Unity 3D|Kotlin|Micronaut|Three\.js/i;
const cases = [
  { q: 'tell me 2 strong capabilities for why i am as a professor will fund him as phd student in usa?', must: [/research|patent|invention/i, /AI|LLM|RAG|agent/i], not: [JUNK, /publications? (in|at|from)|published papers|h-index|citations of/i], bullets: 2 },
  { q: 'Why should I admit him to my lab as a PhD student?', must: [/research|patent|invention/i, /AI|LLM|RAG/i], not: [JUNK] },
  { q: 'What are his research strengths?', must: [/patent|invention/i], not: [JUNK] },
  { q: 'Would he be a good fit for a research scientist job?', must: [/research|patent/i, /AI|LLM/i], not: [JUNK] },
  { q: 'why should we hire him for an AI engineering role?', must: [/RAG|agent|LLM/i, /500\+|30%|40\+|Starbucks/], not: [JUNK] },
  { q: 'What are his top 3 strengths for a hiring manager?', must: [/AI|LLM|RAG|lead/i], not: [JUNK], bullets: 3 },
  { q: 'what is the most impressive thing he has built?', must: [/500\+|30%|40\+|60\+|Starbucks|RAG|agent/i], not: [JUNK, /\bthe best\b|greatest|unmatched/i] },
  { q: 'Does he have peer-reviewed publications?', must: [/patent|invention|not list|no peer|do not|don't|doesn't|not mention|couldn't find/i], not: [/published in|IEEE|ACM|journal of/i] },
  { q: 'Is he the best engineer in Bangladesh?', must: [/./], not: [/\bis the best\b|number one|#1/i] },
];
(async () => {
  let bad = 0;
  for (const c of cases) {
    let out;
    try {
      const r = await fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: ORIGIN }, body: JSON.stringify({ question: c.q }), signal: AbortSignal.timeout(40000) });
      out = r.ok ? (await r.json()).answer || '' : 'HTTP ' + r.status;
    } catch (e) { out = 'ERROR ' + e.message; }
    const fails = [];
    c.must.forEach(re => { if (!re.test(out)) fails.push('missing ' + re); });
    c.not.forEach(re => { if (re.test(out)) fails.push('contains ' + re + ' -> "' + (out.match(re) || [''])[0] + '"'); });
    if (c.bullets) { const n = (out.match(/^\s*(?:[-*•]|\d+[.)])\s+/gm) || []).length; if (n !== c.bullets) fails.push('wanted ' + c.bullets + ' points, got ' + n); }
    if (/^\s*Based on/i.test(out)) fails.push('starts with "Based on"');
    if (out.split(/\s+/).length > 190) fails.push('too long (' + out.split(/\s+/).length + ' words)');
    console.log((fails.length ? 'FAIL' : 'ok  ') + '  Q: ' + c.q + '\n      ' + out.replace(/\n+/g, '\n      ') + (fails.length ? '\n      >> ' + fails.join('; ') : '') + '\n');
    if (fails.length) bad++;
    await new Promise(r => setTimeout(r, 800));            // be gentle with the free tier
  }
  console.log(bad ? bad + ' of ' + cases.length + ' answers failed' : 'all ' + cases.length + ' answers passed');
  process.exit(bad ? 1 : 0);
})();
