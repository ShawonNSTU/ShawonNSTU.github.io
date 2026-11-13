/* Portfolio chat widget.
   Answers questions about this portfolio. It works on its own with built-in answers (no AI model),
   and uses an open language model too once CHAT_ENDPOINT points at the deployed Worker
   (see chatbot/README.md). If the model is unavailable, it falls back to the built-in answers. */
(function () {
  'use strict';

  /* Paste the deployed Worker address here, e.g. 'https://portfolio-chat.<your-subdomain>.workers.dev'.
     Leave it empty to use the built-in answers only. */
  var CHAT_ENDPOINT = '';

  if (!window.PortfolioChat || typeof PROJECTS === 'undefined') return;
  var E = window.PortfolioChat;
  var kb = E.buildKB({ EMAIL: EMAIL, PROJECTS: PROJECTS, ARCHIVE: ARCHIVE, JOBS: JOBS, CAPS: CAPS, CERTS: CERTS, CONTESTS: CONTESTS, NEWS: NEWS, AWARDS: AWARDS, RESEARCH: typeof RESEARCH !== 'undefined' ? RESEARCH : [] });
  var index = E.makeIndex(kb);

  var STORE = 'skd-chat-v1', MAX_Q = 300, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var msgs = [], busy = false, lastAI = false, lastSend = 0;

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
  var SPARK = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M10 2l1.8 4.9L17 8.7l-5.2 1.8L10 16l-1.8-5.5L3 8.7l5.2-1.8L10 2zM16 13l.8 2.2 2.2.8-2.2.8L16 19l-.8-2.2-2.2-.8 2.2-.8L16 13z" fill="currentColor"/></svg>';

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
    var lines = String(text).split('\n'), ul = null;
    lines.forEach(function (ln) {
      var m = ln.match(/^\s*(?:[-*•])\s+(.*)$/);
      if (m) { if (!ul) { ul = h('ul', { class: 'chat-items' }); into.appendChild(ul); } var li = h('li'); inline(m[1], li); ul.appendChild(li); return; }
      ul = null;
      if (ln.trim()) { var p = h('p'); inline(ln, p); into.appendChild(p); }
    });
  }
  function safeUrl(u) { return typeof u === 'string' && (u.charAt(0) === '#' || u.indexOf(E.SITE) === 0) ? u : null; }

  /* ---------- render one message ---------- */
  function renderBot(m) {
    var b = h('div', { class: 'bubble' });
    if (m.text) block(m.text, b);
    if (m.items && m.items.length) {
      var ul = h('ul', { class: 'chat-items' });
      m.items.forEach(function (it) {
        var li = h('li');
        if (it.title) { if (safeUrl(it.url)) li.appendChild(h('a', { href: it.url, class: 'chat-t', text: it.title })); else li.appendChild(h('strong', { text: it.title })); }
        if (it.text) { if (it.title) li.appendChild(document.createTextNode(' · ')); inline(it.text, li); }
        ul.appendChild(li);
      });
      b.appendChild(ul);
    }
    if (m.links && m.links.length) {
      var d = h('div', { class: 'chat-links' });
      m.links.forEach(function (l) { if (safeUrl(l.url)) d.appendChild(h('a', { class: 'chat-link', href: l.url, text: l.title + ' →' })); });
      if (d.childNodes.length) b.appendChild(d);
    }
    if (m.suggestions && m.suggestions.length) {
      var s = h('div', { class: 'chat-sugs' });
      m.suggestions.forEach(function (q) { s.appendChild(h('button', { type: 'button', class: 'chat-sug', 'data-q': q, text: q })); });
      b.appendChild(s);
    }
    return b;
  }

  /* ---------- panel ---------- */
  var fab = h('button', { class: 'chat-fab', id: 'chat-fab', type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-controls': 'chat-panel' });
  fab.innerHTML = SPARK + '<span>Ask AI</span>';
  var sub = h('span', { class: 'mono', id: 'chat-sub', text: 'Answers from this portfolio' });
  var closeBtn = h('button', { class: 'chat-x', type: 'button', 'aria-label': 'Close chat', text: '×' });
  var log = h('div', { class: 'chat-log', id: 'chat-log', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions' });
  var input = h('input', { type: 'text', class: 'chat-input', id: 'chat-input', maxlength: String(MAX_Q), placeholder: 'Ask about projects, research, awards…', 'aria-label': 'Your question', autocomplete: 'off', enterkeyhint: 'send' });
  var send = h('button', { type: 'submit', class: 'chat-send', 'aria-label': 'Send question' });
  send.innerHTML = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 10h13M11 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var form = h('form', { class: 'chat-form' }, [input, send]);
  var quick = h('div', { class: 'chat-quick', role: 'group', 'aria-label': 'Quick questions' });
  [['Projects', 'Show projects'], ['AI agents', 'What has Shaon built with AI agents?'], ['Research', 'Show research'], ['Awards', 'Which awards has he won?'], ['Contact', 'How can I contact him?']].forEach(function (x) {
    quick.appendChild(h('button', { type: 'button', class: 'chat-sug', 'data-q': x[1], text: x[0] }));
  });
  var panel = h('section', { class: 'chat-panel', id: 'chat-panel', role: 'dialog', 'aria-label': 'Ask about Shaon', hidden: 'hidden' }, [
    h('header', null, [h('div', { class: 'chat-title' }, [h('b', { text: 'Ask about Shaon' }), sub]), closeBtn]),
    log, quick, form,
    h('p', { class: 'chat-note mono', text: 'AI assistant. It can be wrong, and it only knows what is on this site. Please don’t share private information.' })
  ]);
  document.body.appendChild(fab); document.body.appendChild(panel);

  function scrollDown() { log.scrollTo({ top: log.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }); }
  function setSub() { sub.textContent = lastAI ? 'AI-assisted · answers from this portfolio' : 'Answers from this portfolio'; }
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-30).map(function (m) { return { role: m.role, text: m.text, items: m.items, links: m.links }; }))); } catch (e) {} }
  function addMsg(m, noSave) {
    msgs.push(m);
    var row = h('div', { class: 'msg ' + (m.role === 'user' ? 'user' : 'bot') });
    if (m.role === 'user') row.appendChild(h('div', { class: 'bubble', text: m.text })); else row.appendChild(renderBot(m));
    log.appendChild(row); scrollDown(); if (!noSave) save();
    return row;
  }
  function typing() { var r = h('div', { class: 'msg bot', 'aria-hidden': 'true' }, [h('div', { class: 'bubble typing' }, [h('i'), h('i'), h('i')])]); log.appendChild(r); scrollDown(); return r; }
  function setBusy(b) { busy = b; input.disabled = b; send.disabled = b; panel.setAttribute('aria-busy', String(b)); }

  function history() {
    return msgs.slice(-7, -1).filter(function (m) { return m.text; }).map(function (m) { return { role: m.role === 'user' ? 'user' : 'assistant', content: String(m.text).slice(0, 300) }; });
  }
  function ask(q) {
    q = String(q || '').replace(/\s+/g, ' ').trim().slice(0, MAX_Q);
    if (!q || busy || Date.now() - lastSend < 500) return;
    lastSend = Date.now();
    input.value = '';
    addMsg({ role: 'user', text: q });
    setBusy(true);
    var wait = typing(), it = E.intent(q), local = E.answer(index, q);
    var finish = function (m, ai) { if (wait.parentNode) wait.parentNode.removeChild(wait); lastAI = !!ai; setSub(); m.role = 'bot'; addMsg(m); setBusy(false); if (!document.body.classList.contains('chat-touch')) input.focus(); };
    var useAI = CHAT_ENDPOINT && !it && !local.miss;
    if (!useAI) { setTimeout(function () { finish(local, false); }, reduce ? 0 : 380); return; }
    var ctl = new AbortController(), timer = setTimeout(function () { ctl.abort(); }, 14000);
    fetch(CHAT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, history: history() }), signal: ctl.signal })
      .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.json(); })
      .then(function (d) {
        clearTimeout(timer);
        if (!d || typeof d.answer !== 'string' || !d.answer.trim()) throw new Error('empty');
        var links = (d.sources || []).filter(function (s) { return s && safeUrl(s.url); }).slice(0, 3).map(function (s) { return { title: String(s.title || 'Open').slice(0, 60), url: s.url }; });
        finish({ text: d.answer.trim().slice(0, 1400), links: links }, true);
      })
      .catch(function () { clearTimeout(timer); finish(local, false); });
  }

  /* ---------- open / close ---------- */
  var greeted = false;
  function greet() {
    if (greeted) return; greeted = true;
    if (!msgs.length) addMsg({ role: 'bot', text: "Hi! I'm an assistant that answers questions about Shaon's work, research and background, using only what's on this portfolio.", suggestions: E.HELP_Q }, true);
  }
  function openChat() {
    panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); fab.hidden = true; greet(); scrollDown();
    setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }, 30);
  }
  function closeChat(refocus) {
    panel.hidden = true; fab.hidden = false; fab.setAttribute('aria-expanded', 'false');
    if (refocus) fab.focus();
  }
  fab.addEventListener('click', openChat);
  closeBtn.addEventListener('click', function () { closeChat(true); });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); closeChat(true); } });
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  panel.addEventListener('click', function (e) {
    var sug = e.target.closest && e.target.closest('[data-q]');
    if (sug) { ask(sug.getAttribute('data-q')); return; }
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a && matchMedia('(max-width:700px)').matches) closeChat(false);    // phones: get the panel out of the way
  });
  matchMedia('(pointer:coarse)').matches && document.body.classList.add('chat-touch');

  /* restore this tab's conversation */
  try {
    var saved = JSON.parse(sessionStorage.getItem(STORE) || '[]');
    if (Array.isArray(saved) && saved.length) { greeted = true; saved.forEach(function (m) { if (m && (m.role === 'user' || m.role === 'bot') && typeof m.text === 'string') addMsg(m, true); }); }
  } catch (e) {}

  /* command menu (⌘K) entry */
  if (typeof ALL !== 'undefined' && Array.isArray(ALL)) ALL.push(['Ask the AI assistant', 'Action', function () { openChat(); }]);

  window.SkdChat = { open: openChat, close: closeChat, ask: ask, mode: function () { return CHAT_ENDPOINT ? 'ai+fallback' : 'built-in'; } };
})();
