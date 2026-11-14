/* Portfolio chat widget.
   Answers questions about this portfolio. It works on its own with built-in answers (no AI model),
   and uses an open language model too once CHAT_ENDPOINT points at the deployed Worker
   (see chatbot/README.md). If the model is unavailable, it falls back to the built-in answers.
   Answers appear as a stream: real tokens from the model when it is on, a typed reveal otherwise.
   The conversation lives only on the page: it is cleared on every page load. */
(function () {
  'use strict';

  /* Paste the deployed Worker address here, e.g. 'https://portfolio-chat.<your-subdomain>.workers.dev'.
     Leave it empty to use the built-in answers only. */
  var CHAT_ENDPOINT = 'https://portfolio-chat.shaon-kanti.workers.dev';

  if (!window.PortfolioChat || typeof PROJECTS === 'undefined') return;
  var E = window.PortfolioChat;
  var kb = E.buildKB({ EMAIL: EMAIL, PROJECTS: PROJECTS, ARCHIVE: ARCHIVE, JOBS: JOBS, CAPS: CAPS, CERTS: CERTS, CONTESTS: CONTESTS, NEWS: NEWS, AWARDS: AWARDS, RESEARCH: typeof RESEARCH !== 'undefined' ? RESEARCH : [] });
  var index = E.makeIndex(kb);

  var MAX_Q = 300, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var msgs = [], busy = false, lastAI = false, lastSend = 0, active = null;
  try { sessionStorage.removeItem('skd-chat-v1'); } catch (e) {}          // an older version saved chats; make sure none survive

  /* ---------- tiny DOM helper ---------- */
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') el.className = attrs[k]; else if (k === 'text') el.textContent = attrs[k];
      else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  var SPARK = '<svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true"><path d="M10 2l1.8 4.9L17 8.7l-5.2 1.8L10 16l-1.8-5.5L3 8.7l5.2-1.8L10 2zM16 13l.8 2.2 2.2.8-2.2.8L16 19l-.8-2.2-2.2-.8 2.2-.8L16 13z" fill="currentColor"/></svg>';
  var ARROW = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 10h13M11 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var STOP = '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><rect x="5" y="5" width="10" height="10" rx="2" fill="currentColor"/></svg>';

  /* ---------- safe rich text: **bold**, e-mail and the LinkedIn link only ---------- */
  var LINKABLE = /(https:\/\/www\.linkedin\.com\/in\/shaon-kanti-dhar|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
  function inline(str, into) {
    String(str).split(/(\*\*[^*\n]+\*\*)/).forEach(function (part) {
      if (/^\*\*[^*\n]+\*\*$/.test(part)) { into.appendChild(h('strong', { text: part.slice(2, -2) })); return; }
      part.split(LINKABLE).forEach(function (seg) {
        if (!seg) return;
        if (seg === 'https://www.linkedin.com/in/shaon-kanti-dhar') into.appendChild(h('a', { href: seg, target: '_blank', rel: 'noopener', text: 'LinkedIn' }));
        else if (seg === EMAIL) into.appendChild(h('a', { href: 'mailto:' + EMAIL, text: EMAIL }));
        else into.appendChild(document.createTextNode(seg));
      });
    });
  }
  function block(text, into) {
    var ul = null;
    text = String(text).replace(/([.!?:])[ \t]+[-\u2022][ \t]+(?=[A-Z0-9])/g, '$1\n- ');       // small models sometimes put bullets inline: "... done. - Next ..."
    text.split('\n').forEach(function (ln) {
      var m = ln.match(/^\s*(?:[-*•])\s+(.*)$/);
      if (m) { if (!ul) { ul = h('ul', { class: 'chat-items' }); into.appendChild(ul); } var li = h('li'); inline(m[1], li); ul.appendChild(li); return; }
      ul = null;
      if (ln.trim()) { var p = h('p'); inline(ln, p); into.appendChild(p); }
    });
  }
  function safeUrl(u) { return typeof u === 'string' && (u.charAt(0) === '#' || u.indexOf(E.SITE) === 0) ? u : null; }
  function plain(m) {
    var parts = [m.text || ''];
    (m.items || []).forEach(function (it) { parts.push((it.title ? it.title + ': ' : '') + (it.text || '')); });
    return parts.join(' ').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  }

  /* ---------- panel + header button ---------- */
  var openBtn = h('button', { class: 'chat-open', id: 'chat-open', type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-controls': 'chat-panel', 'aria-label': 'Ask the AI assistant' });
  openBtn.innerHTML = SPARK + '<span>Ask AI</span>';
  var tools = document.querySelector('header.site .tools'), themeBtn = document.getElementById('theme');
  if (tools) tools.insertBefore(openBtn, themeBtn || tools.firstChild); else document.body.appendChild(openBtn);
  var footBtn = h('button', { class: 'btn', type: 'button', 'data-chat-open': '1' });
  footBtn.innerHTML = SPARK + ' Ask AI';
  var fa = document.querySelector('footer .f-actions'); if (fa) fa.appendChild(footBtn);

  var sub = h('span', { class: 'mono', id: 'chat-sub', text: 'Answers from this portfolio' });
  var closeBtn = h('button', { class: 'chat-x', type: 'button', 'aria-label': 'Close chat', text: '×' });
  var log = h('div', { class: 'chat-log', id: 'chat-log', role: 'log', 'aria-live': 'off' });
  var live = h('div', { class: 'chat-sr', role: 'status', 'aria-live': 'polite' });
  var input = h('input', { type: 'text', class: 'chat-input', id: 'chat-input', maxlength: String(MAX_Q), placeholder: 'Ask about projects, research, awards…', 'aria-label': 'Your question', autocomplete: 'off', enterkeyhint: 'send' });
  var send = h('button', { type: 'submit', class: 'chat-send', 'aria-label': 'Send question' });
  send.innerHTML = ARROW;
  var form = h('form', { class: 'chat-form' }, [input, send]);
  var quick = h('div', { class: 'chat-quick', role: 'group', 'aria-label': 'Quick questions' });
  [['Projects', 'Show projects'], ['AI agents', 'What has Shaon built with AI agents?'], ['Research', 'Show research'], ['Awards', 'Which awards has he won?'], ['Contact', 'How can I contact him?']].forEach(function (x) {
    quick.appendChild(h('button', { type: 'button', class: 'chat-sug', 'data-q': x[1], text: x[0] }));
  });
  var panel = h('section', { class: 'chat-panel', id: 'chat-panel', role: 'dialog', 'aria-label': 'Ask about Shaon', hidden: 'hidden' }, [
    h('header', null, [h('div', { class: 'chat-title' }, [h('b', { text: 'Ask about Shaon' }), sub]), closeBtn]),
    log, live, quick, form,
    h('p', { class: 'chat-note mono', text: 'AI assistant. It can be wrong, and it only knows what is on this site. Please don’t share private information.' })
  ]);
  document.body.appendChild(panel);

  function nearBottom() { return log.scrollHeight - log.scrollTop - log.clientHeight < 90; }
  function toBottom(smooth) { log.scrollTo({ top: log.scrollHeight, behavior: smooth && !reduce ? 'smooth' : 'auto' }); }
  function setSub() { sub.textContent = lastAI ? 'AI-assisted · answers from this portfolio' : 'Answers from this portfolio'; }
  function setBusy(b) {
    busy = b; panel.setAttribute('aria-busy', String(b));
    send.classList.toggle('is-stop', b); send.innerHTML = b ? STOP : ARROW;
    send.setAttribute('aria-label', b ? 'Stop answering' : 'Send question');
  }

  /* ---------- typed reveal: shows a growing text target at a natural pace ---------- */
  function Typer(el, onDone) {
    var target = '', shown = 0, ended = false, raf = 0, last = 0, done = false, caret = h('span', { class: 'chat-caret', 'aria-hidden': 'true' });
    function paint() {
      var t = target.slice(0, Math.floor(shown));
      if ((t.match(/\*\*/g) || []).length % 2) t += '**';                      // keep half-typed **bold** from flashing asterisks
      var stick = nearBottom();
      el.textContent = ''; block(t, el);
      if (!done) { var host = el.lastElementChild; if (host && host.tagName === 'UL') host = host.lastElementChild; (host || el).appendChild(caret); }
      if (stick) toBottom(false);
    }
    function finish() { if (done) return; done = true; if (raf) cancelAnimationFrame(raf); raf = 0; shown = target.length; paint(); if (caret.parentNode) caret.parentNode.removeChild(caret); onDone && onDone(); }
    function tick(ts) {
      raf = 0;
      var dt = Math.min(64, ts - (last || ts)) / 1000; last = ts;
      var backlog = target.length - shown;
      var rate = Math.max(70, Math.min(260, backlog * 1.2));                   // characters per second: faster when far behind, gentle at the end
      shown = Math.min(target.length, shown + rate * dt);
      paint();
      if (shown >= target.length) { if (ended) { finish(); return; } last = 0; return; }
      raf = requestAnimationFrame(tick);
    }
    function kick() { if (!raf && !done) raf = requestAnimationFrame(tick); }
    return {
      push: function (s) { target += s; if (reduce) { shown = target.length; paint(); } else kick(); },
      end: function () { ended = true; if (reduce || shown >= target.length) finish(); else kick(); },
      flush: finish, text: function () { return target; }
    };
  }

  /* ---------- a bot message under construction ---------- */
  function newBotRow() {
    var textEl = h('div', { class: 'chat-text' }), bubble = h('div', { class: 'bubble' }, [textEl]);
    var row = h('div', { class: 'msg bot' }, [bubble]);
    log.appendChild(row);
    return { row: row, bubble: bubble, textEl: textEl };
  }
  function itemsEl(m) {
    var ul = h('ul', { class: 'chat-items' });
    (m.items || []).forEach(function (it) {
      var li = h('li', { class: 'chat-in' });
      if (it.title) { if (safeUrl(it.url)) li.appendChild(h('a', { href: it.url, class: 'chat-t', text: it.title })); else li.appendChild(h('strong', { text: it.title })); }
      if (it.text) { if (it.title) li.appendChild(document.createTextNode(' · ')); inline(it.text, li); }
      ul.appendChild(li);
    });
    return ul;
  }
  function tailEls(m) {
    var out = [];
    if (m.links && m.links.length) {
      var d = h('div', { class: 'chat-links chat-in' });
      m.links.forEach(function (l) { if (safeUrl(l.url)) d.appendChild(h('a', { class: 'chat-link', href: l.url, text: l.title + ' →' })); });
      if (d.childNodes.length) out.push(d);
    }
    if (m.suggestions && m.suggestions.length) {
      var s = h('div', { class: 'chat-sugs chat-in' });
      m.suggestions.forEach(function (q) { s.appendChild(h('button', { type: 'button', class: 'chat-sug', 'data-q': q, text: q })); });
      out.push(s);
    }
    return out;
  }
  /* reveal list items one after another, then links and suggestions */
  function revealRest(row, m, cb0) {
    var called = false, cb = function () { if (called) return; called = true; cb0(); };
    var queue = [];
    if (m.items && m.items.length) { var ul = itemsEl(m), lis = [].slice.call(ul.children); ul.innerHTML = ''; row.bubble.appendChild(ul); lis.forEach(function (li) { queue.push(function () { ul.appendChild(li); }); }); }
    tailEls(m).forEach(function (el) { queue.push(function () { row.bubble.appendChild(el); }); });
    var i = 0, timer = 0, stopped = false;
    function step() {
      timer = 0;
      if (stopped) return;
      if (i >= queue.length) { cb(); return; }
      var stick = nearBottom(); queue[i++](); if (stick) toBottom(true);
      timer = setTimeout(step, reduce ? 0 : 110);
    }
    step();
    return function skip() { stopped = true; if (timer) clearTimeout(timer); while (i < queue.length) queue[i++](); cb(); };
  }

  function complete(m, ai) {
    m.role = 'bot'; msgs.push(m); lastAI = !!ai; setSub();
    live.textContent = ''; setTimeout(function () { live.textContent = plain(m); }, 30);   // screen readers hear the finished answer once
    active = null; setBusy(false);
    if (!document.body.classList.contains('chat-touch')) input.focus();
  }

  /* local answer: typed reveal, then items */
  function showLocal(m, thinkMs) {
    var row = null, typer = null, skip = null, timer = 0, finished = false;
    function end() { if (finished) return; finished = true; complete(m, false); }
    function begin() {
      row = newBotRow();
      typer = Typer(row.textEl, function () { skip = revealRest(row, m, end); });
      typer.push(m.text || ''); typer.end();
      if (!m.text) typer.flush();
    }
    timer = setTimeout(begin, thinkMs);
    active = { stop: function () {
      if (timer && !row) { clearTimeout(timer); begin(); }
      if (typer) typer.flush();
      if (skip) skip();
    } };
  }

  /* model answer: real stream from the Worker */
  function streamAI(q, local, wait) {
    var ctl = new AbortController(), first = setTimeout(function () { ctl.abort(); }, 14000), cap = setTimeout(function () { ctl.abort(); }, 45000);
    var idle = 0, row = null, typer = null, sources = [], gotText = false, ended = false, stopped = false, buf = '', dec = new TextDecoder(), reader = null, skip = null;
    function ensureRow() { if (row) return; if (wait.parentNode) wait.parentNode.removeChild(wait); row = newBotRow(); typer = Typer(row.textEl, function () { var m = { text: typer.text(), links: sources }; skip = revealRest(row, m, function () { complete(m, true); }); }); }
    function fallback() { clearTimeout(first); clearTimeout(cap); if (wait.parentNode) wait.parentNode.removeChild(wait); showLocal(local, 0); }
    function bump() { clearTimeout(idle); idle = setTimeout(function () { ctl.abort(); }, 12000); }      // the model went quiet midway: finish with what we have
    function endStream() { if (ended) return; ended = true; clearTimeout(first); clearTimeout(cap); clearTimeout(idle); if (!gotText) { fallback(); return; } typer.end(); }
    function onEvent(d) {
      if (d.sources) sources = (d.sources || []).filter(function (s) { return s && safeUrl(s.url); }).slice(0, 3).map(function (s) { return { title: String(s.title || 'Open').slice(0, 60), url: s.url }; });
      if (typeof d.t === 'string' && d.t) { if (!gotText) { gotText = true; clearTimeout(first); } ensureRow(); typer.push(d.t); }
    }
    function parse(chunk, final) {
      buf += chunk;
      var parts = buf.split('\n\n'); buf = final ? '' : parts.pop();
      parts.forEach(function (blk) {
        blk.split('\n').forEach(function (ln) {
          if (ln.indexOf('data:') !== 0) return;
          var v = ln.slice(5).trim();
          if (v === '[DONE]') { endStream(); return; }
          try { onEvent(JSON.parse(v)); } catch (e) {}
        });
      });
    }
    active = { stop: function () {
      stopped = true; ctl.abort(); clearTimeout(first); clearTimeout(cap); clearTimeout(idle);
      if (!gotText) { if (wait.parentNode) wait.parentNode.removeChild(wait); active = null; setBusy(false); return; }   // stopped before anything arrived
      if (typer) typer.flush(); if (skip) skip(); else endStream();
    } };
    fetch(CHAT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, history: history(), stream: true }), signal: ctl.signal })
      .then(function (r) {
        if (!r.ok) throw new Error('status ' + r.status);
        var ct = r.headers.get('content-type') || '';
        if (ct.indexOf('text/event-stream') < 0 || !r.body || !r.body.getReader) {       // a non-streaming Worker: use its JSON answer
          return r.json().then(function (d) { if (!d || typeof d.answer !== 'string' || !d.answer.trim()) throw new Error('empty'); onEvent({ sources: d.sources }); onEvent({ t: d.answer.trim().slice(0, 1400) }); endStream(); });
        }
        reader = r.body.getReader();
        function pump() {
          return reader.read().then(function (x) {
            if (x.done) { parse(dec.decode(), true); endStream(); return; }
            bump();
            parse(dec.decode(x.value, { stream: true }), false);
            return pump();
          });
        }
        return pump();
      })
      .catch(function () { if (ended || stopped) return; if (!gotText) { fallback(); } else { endStream(); } });
  }

  function history() {
    return msgs.slice(-7, -1).filter(function (m) { return m.text; }).map(function (m) { return { role: m.role === 'user' ? 'user' : 'assistant', content: String(m.text).slice(0, 300) }; });
  }
  function addUser(text) {
    msgs.push({ role: 'user', text: text });
    log.appendChild(h('div', { class: 'msg user' }, [h('div', { class: 'bubble', text: text })]));
    toBottom(true);
  }
  function ask(q) {
    q = String(q || '').replace(/\s+/g, ' ').trim().slice(0, MAX_Q);
    if (!q || busy || Date.now() - lastSend < 400) return;
    lastSend = Date.now();
    input.value = '';
    addUser(q);
    setBusy(true);
    var wait = h('div', { class: 'msg bot', 'aria-hidden': 'true' }, [h('div', { class: 'bubble typing' }, [h('i'), h('i'), h('i')])]);
    log.appendChild(wait); toBottom(true);
    var it = E.intent(q), local = E.answer(index, q);
    if (CHAT_ENDPOINT && (!it || it === 'evaluate')) { streamAI(q, local, wait); return; }                  // open-ended questions go to the model too; its answer is limited to retrieved facts
    var think = reduce ? 0 : 420;
    setTimeout(function () { if (wait.parentNode) wait.parentNode.removeChild(wait); }, think);
    showLocal(local, think);
  }

  /* ---------- open / close ---------- */
  var greeted = false;
  function greet() {
    if (greeted) return; greeted = true;
    var m = { role: 'bot', text: "Hi! I'm an assistant that answers questions about Shaon's work, research and background, using only what's on this portfolio.", suggestions: E.HELP_Q };
    msgs.push(m);
    var row = newBotRow(); block(m.text, row.textEl); tailEls(m).forEach(function (el) { row.bubble.appendChild(el); });
  }
  function isOpen() { return !panel.hidden; }
  function openChat() {
    panel.hidden = false; openBtn.setAttribute('aria-expanded', 'true'); openBtn.classList.add('on'); greet(); toBottom(false);
    setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }, 30);
  }
  function closeChat(refocus) {
    panel.hidden = true; openBtn.setAttribute('aria-expanded', 'false'); openBtn.classList.remove('on');
    if (refocus) openBtn.focus();
  }
  openBtn.addEventListener('click', function () { isOpen() ? closeChat(true) : openChat(); });
  footBtn.addEventListener('click', openChat);
  closeBtn.addEventListener('click', function () { closeChat(true); });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); closeChat(true); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen() && !document.querySelector('dialog[open]')) closeChat(true); });
  form.addEventListener('submit', function (e) { e.preventDefault(); if (!busy) ask(input.value); });
  send.addEventListener('click', function (e) { if (busy) { e.preventDefault(); if (active) active.stop(); } });
  panel.addEventListener('click', function (e) {
    var sug = e.target.closest && e.target.closest('[data-q]');
    if (sug) { if (busy && active) { active.stop(); } lastSend = 0; ask(sug.getAttribute('data-q')); return; }     // a chip interrupts an answer that is still typing
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a && matchMedia('(max-width:700px)').matches) closeChat(false);    // phones: get the panel out of the way
  });
  document.addEventListener('mousedown', function (e) {                      // click outside the panel to close it (desktop)
    if (!isOpen() || matchMedia('(max-width:700px)').matches) return;
    if (panel.contains(e.target) || openBtn.contains(e.target) || footBtn.contains(e.target)) return;
    closeChat(false);
  });
  matchMedia('(pointer:coarse)').matches && document.body.classList.add('chat-touch');

  /* command menu (⌘K) entry */
  if (typeof ALL !== 'undefined' && Array.isArray(ALL)) ALL.push(['Ask the AI assistant', 'Action', function () { openChat(); }]);

  window.SkdChat = { open: openChat, close: closeChat, ask: ask, mode: function () { return CHAT_ENDPOINT ? 'ai+fallback' : 'built-in'; } };
})();
