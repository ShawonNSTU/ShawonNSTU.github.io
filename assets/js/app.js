/* Copyright (c) 2026 Shaon Kanti Dhar. All rights reserved. Not licensed for reuse, copying or derivative sites. Build ID SKD-74ed513e2a6c-2026. */

/* ---------- helpers ---------- */
var PF_BUILD='SKD-74ed513e2a6c-2026';
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function chips(a,hi){return '<div class="chips">'+a.map(function(c,i){return '<span class="chip'+(i<(hi||0)?' a':'')+'">'+esc(c)+'</span>'}).join('')+'</div>'}
function ext(t,u){return '<a class="more" href="'+u+'">'+esc(t)+'<svg aria-hidden="true"><use href="#arr"/></svg></a>'}
function sheet(){return ''}
var arrow='<svg aria-hidden="true"><use href="#right"/></svg>';

/* ---------- featured-project showcase ---------- */
function scBody(i){
  var p=PROJECTS[i], f=p.facts&&p.facts[0];
  return '<a class="sc-shot" href="#'+p.id+'" tabindex="-1" aria-hidden="true"><img src="'+p.card+'" alt="" width="1200" height="750">'+
    '<span class="sc-badge mono">'+(p.live?'<span class="live"><i></i>Live</span>':esc(p.status))+'</span></a>'+
    '<div class="sc-info">'+
      '<div class="mono muted sc-meta">'+esc(p.metaLine||[p.cat,p.role,p.period].filter(Boolean).join(' · '))+'</div>'+
      '<h3>'+esc(p.name)+'</h3><p class="muted">'+esc(p.tagline)+'</p>'+
      (p.points?'<ul class="sc-points">'+p.points.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ul>':p.hi?'<dl class="sc-stats">'+p.hi.map(function(h){return '<div><dt>'+esc(h[0])+'</dt><dd>'+esc(h[1])+'</dd></div>'}).join('')+'</dl>':'')+
      '<a class="btn dark sc-go" href="#'+p.id+'">Read the case study'+arrow+'</a>'+
    '</div>';
}
function showcase(){
  var tabs=PROJECTS.map(function(p,i){return '<button type="button" role="tab" id="sct-'+i+'" aria-controls="sc-panel" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'" data-i="'+i+'"><small>'+p.n+'</small>'+esc(p.short||p.name)+'</button>'}).join('');
  return '<div class="showcase" id="showcase">'+
    '<div class="sc-head mono muted"><span>Featured projects</span><span id="sc-count">01 / '+String(PROJECTS.length).padStart(2,'0')+'</span></div>'+
    '<div class="sc-panel" id="sc-panel" role="tabpanel" aria-labelledby="sct-0">'+scBody(0)+'</div>'+
    '<div class="sc-tabs" role="tablist" aria-label="Featured projects">'+tabs+'</div>'+
  '</div>';
}

/* ---------- views ---------- */
function vHome(){
  var cards=PROJECTS.map(function(p,i){return '<a class="pcard'+(i===0?' dark':'')+'" href="#'+p.id+'"><div class="im"><img src="'+p.card+'" alt="" loading="lazy"></div><div class="bd"><div class="top mono"><span>'+esc(p.cat)+'</span><span>'+(p.live?'<span class="live"><i></i>Live</span>':esc(p.status))+'</span></div><h3>'+esc(p.name)+'</h3><p>'+esc(p.tagline)+'</p><div class="go"><span>Read the case study</span>'+arrow+'</div></div></a>'}).join('');
  var recs=PROJECTS.concat(ARCHIVE).map(function(p){
    var isP=!!p.id;
    var txt=isP?p.overview:p.text, st=p.stack, links=isP?[['Open case study','#'+p.id]].concat(p.links):p.links;
    return '<details><summary><span class="mono muted">'+p.n+'</span><h3>'+esc(p.name)+'</h3><span class="sub muted">'+esc(isP?p.cat+' · '+p.period:p.sub)+'</span><span class="pm" aria-hidden="true">+</span></summary>'+
      '<div class="body"><span></span><div><p>'+esc(txt)+'</p>'+chips(st,2)+'</div><div><dl class="kv">'+(p.role?'<dt>Role</dt><dd>'+esc(p.role)+'</dd>':'')+'<dt>When</dt><dd>'+esc(isP?p.period:p.sub)+'</dd>'+(isP?'<dt>Status</dt><dd>'+esc(p.status)+'</dd>':'')+'</dl><div class="chips">'+links.map(function(l){return ext(l[0],l[1])}).join(' ')+'</div></div></div></details>';
  }).join('');
  return '<div class="wrap">'+sheet('A-00','Home')+
  '<section class="hero">'+
    '<div>'+
      '<span class="eyebrow">Lead Engineer / AI Engineering</span>'+
      '<h1>Building <em>AI-enabled Software</em> and the <em>Agents</em> that power it.</h1>'+
      '<p class="lead"><b>7+ years</b> at Samsung R&amp;D Institute Bangladesh, working across the <b>Samsung SmartThings ecosystem</b>. I develop <b>AI-based solutions</b> for its B2B platform, with <b>IoT security</b> built in. I also created an <b>AI-driven SQE</b> (software quality engineering) solution that speeds up product releases and <b>saves 30% of release time</b>.</p>'+
      '<div class="actions"><a class="btn dark" href="#work">View selected work'+arrow+'</a><a class="btn" href="#cv">View CV</a><a class="btn" href="#research">Research</a></div>'+
      '<div class="portrait-chip"><img src="assets/img/photo.webp" alt="Shaon Kanti Dhar" width="52" height="52"><div><b style="font-weight:600">Shaon Kanti Dhar</b><div class="mono muted">Dhaka, Bangladesh · <span class="live"><i></i>Available for conversations</span></div></div></div>'+
    '</div>'+
    showcase()+
  '</section>'+
  '<div class="tags4 mono"><div><span class="muted">01</span><b>Secured IoT platforms</b></div><div><span class="muted">02</span><b>AI agents &amp; LLMs</b></div><div><span class="muted">03</span><b>Research &amp; inventions</b></div><div><span class="muted">04</span><b>Engineering leadership</b></div></div>'+
  '</div>'+
  '<div class="wrap"><a class="match-banner" href="#match"><div><span class="eyebrow">Hiring or reviewing?</span><b>Match me to your role</b><span class="muted">Paste a job description and see what the portfolio backs up, requirement by requirement.</span></div><span class="btn">Open the role matcher'+arrow+'</span></a></div>'+
  '<section class="sec"><div class="wrap"><div class="sec-h"><div><span class="eyebrow">Selected work</span><h2>Selected <em>projects</em></h2></div>'+ext('All case studies','#work')+'</div></div>'+
    '<div class="rail" id="rail"><div class="rail-track">'+cards+cards.replace(/<a /g,'<a aria-hidden="true" tabindex="-1" ')+'</div></div>'+
    '<div class="wrap"><div class="rail-ctl"><button type="button" id="rail-btn" aria-pressed="false"><span aria-hidden="true">❚❚</span><span>PAUSE</span></button></div></div>'+
  '</section>'+
  '<section class="sec"><div class="wrap"><div class="sec-h"><div><span class="eyebrow">Research &amp; patents</span><h2>Research <em>highlights</em></h2></div>'+ext('All research','#research')+'</div><div class="list">'+
    '<a href="#research"><span class="n">01</span><div><b>Method to reduce light flicker while recording video</b><div class="muted" style="font-size:14.5px; margin-top:4px; max-width:70ch">Syncs camera settings to cut light flicker when recording with several cameras at once.</div></div><span class="mono muted">Aug 2025</span></a>'+
    '<a href="#research"><span class="n">02</span><div><b>Missed-speech recovery for voice calls</b><div class="muted" style="font-size:14.5px; margin-top:4px; max-width:70ch">Detects when parts of a call are lost to disconnection, poor audio or noise, and recovers the missed speech so the conversation continues without gaps.</div></div><span class="mono muted">Mar 2025</span></a>'+
    '<a href="#research"><span class="n">03</span><div><b>A method to increase security when using Bluetooth multipoint</b><div class="muted" style="font-size:14.5px; margin-top:4px; max-width:70ch">Rates each earbud\'s trust from the wearer\'s voice, so private audio only plays in a trusted earbud.</div></div><span class="mono muted">Dec 2024</span></a>'+
  '</div></div></section>'+
  '<section class="sec"><div class="wrap"><div class="sec-h"><div><span class="eyebrow">Project index</span><h2>Roles, stacks &amp; <em>links</em></h2></div><p>Every project in one list. Open a row for the role, stack and sources.</p></div><div class="acc">'+recs+'</div></div></section>'+
  '<section class="sec"><div class="wrap"><div class="sec-h"><div><span class="eyebrow">Updates</span><h2>Recent <em>milestones</em></h2></div>'+ext('All news','#about')+'</div>'+newsList(6)+'</div></section>';
}

function newsList(n){return '<div class="list news">'+NEWS.slice(0,n||NEWS.length).map(function(x){return '<div class="row"><span class="mono muted">'+esc(x[0])+'</span><div><b style="font-size:20px">'+esc(x[1])+'</b></div><span></span></div>'}).join('')+'</div>'}

function vAbout(){
  return '<div class="wrap">'+
  '<div class="case-hero"><span class="eyebrow">01 / About</span><h1>About <em>me</em></h1></div>'+
  '<div class="about">'+
    '<div class="about-text">'+
      '<p>I\'m a Project Leader at Samsung R&amp;D Institute Bangladesh in Dhaka. I joined in October 2019 as a Software Engineer and moved through Senior Software Engineer (2022) and Lead Engineer (2025) to Project Leader in December 2025. I now lead 12 engineers across frontend, backend, database and cloud on <a href="#smartthings-pro">SmartThings Pro</a>, Samsung\'s IoT and building-management platform for businesses.</p>'+
      '<p>AI engineering is a growing part of my work. I architected the SmartThings Pro B2B AI Agent, which runs at Starbucks. I architected an <a href="#enterprise-ai-assistant">enterprise AI assistant</a>, an agentic RAG system that answers questions from documents and data with page-level citations, now used by more than 500 engineers. I built the <a href="#quality-agent">PQM Agent</a>, an AI-driven SQE solution that checks every pushed commit and saves 30% of release time across the organization. Before that I fine-tuned a model on our UI/UX guide and built the LLM-based system behind <a href="#test-management">AI Test Management</a>, used by more than 40 QA engineers.</p>'+
      '<p>I work where software meets physical devices. For SmartThings Pro I built the 3D Map View, multi-site management and property dashboard, and led the performance work that improved load time and rendering speed by 15%. I also led the <a href="#lounge">Lounge</a> and <a href="#virtual-studio">Virtual Studio</a> retail web apps, shown at IFA 2024 in Berlin, with Lounge also at CES 2025 in Las Vegas.</p>'+
      '<p>Alongside product work I do <a href="#research">research</a> on security and privacy, AI and wearable sensing. I\'m a co-inventor on two Samsung patents and six further invention proposals, from Bluetooth multipoint security and secure typing for VR headsets to context-aware authentication and missed-speech recovery for voice calls. My work has earned six Samsung R&amp;D <a href="#recognition">awards</a>.</p>'+
      '<p>I studied <a href="#education">Information and Communication Engineering at Noakhali Science and Technology University</a> (CGPA 3.51/4.00), where I was Vice President of the programming club and set problems for university contests.</p>'+
    '</div>'+
    '<aside class="about-card"><img src="assets/img/photo.webp" alt="Shaon Kanti Dhar" width="655" height="655"><dl class="kv">'+
      '<dt>Role</dt><dd>Project Leader, SmartThings Pro</dd><dt>Company</dt><dd>Samsung R&amp;D Institute Bangladesh</dd><dt>Team</dt><dd>12 engineers</dd><dt>Focus</dt><dd>Secured IoT platforms, AI engineering, real-time web</dd><dt>Based in</dt><dd>Dhaka, Bangladesh</dd></dl>'+
      '<div class="chips" style="gap:14px">'+ext('LinkedIn','https://www.linkedin.com/in/shaon-kanti-dhar')+ext('Email me','mailto:'+EMAIL)+'</div></aside>'+
  '</div>'+
  '<section class="sec"><div class="sec-h"><div><span class="eyebrow">Timeline</span><h2>Milestones, <em>newest first</em></h2></div></div>'+newsList()+'</section>'+
  '</div>';
}

function researchRows(){
  return RESEARCH.map(function(r,i){
    var n=String(i+1).padStart(2,'0');
    var body='<span class="n">'+n+'</span><div><b>'+esc(r.title)+'</b><div class="muted" style="font-size:14.5px; margin-top:4px; max-width:70ch">'+esc(r.desc)+'</div>'+(r.tags&&r.tags.length?chips(r.tags,0):'')+'</div><span class="mono muted">'+esc(r.date)+(r.href?' \u2197':'')+'</span>';
    return r.href?'<a href="'+r.href+'">'+body+'</a>':'<div class="row">'+body+'</div>';
  }).join('');
}

function vResearch(){
  var areas=RESEARCH_AREAS.map(function(a,i){return '<div class="cap"><span class="mono muted">'+String(i+1).padStart(2,'0')+'</span><h3>'+esc(a[0])+'</h3><p class="muted">'+esc(a[1])+'</p></div>'}).join('');
  var cards=function(a){return '<div class="decisions">'+a.map(function(d){return '<div class="dec"><b>'+esc(d[0])+'</b><span>'+esc(d[1])+'</span></div>'}).join('')+'</div>'};
  return '<div class="wrap">'+
  '<div class="case-hero"><span class="eyebrow">03 / Research</span><h1>Research &amp; <em>inventions</em></h1></div>'+
  '<section class="sec" style="padding-top:48px"><div class="sec-h"><div><span class="eyebrow">Research interests</span><h2>What I <em>look into</em></h2></div></div><div class="caps" style="grid-template-columns:repeat(4,1fr)">'+areas+'</div></section>'+

  '<section class="sec"><div class="sec-h"><div><span class="eyebrow">Research experience</span><h2>Research &amp; <em>patents</em></h2></div>'+'</div><div class="list">'+
    researchRows()+'</div></section>'+
  '</div>';
}

var CV_PDF='files/Shaon_Kanti_Dhar_CV.pdf?v=20261126';
function vCV(){
  return '<div class="wrap">'+
  '<div class="cv-head"><div><span class="eyebrow">Curriculum vitae</span><h1 class="serif">My <em>CV</em></h1><p class="muted">Research interests, research and AI experience, work history, awards and skills.</p></div>'+
  '<div class="cv-actions"><a class="btn dark" href="'+CV_PDF+'" target="_blank" rel="noopener">Open in new tab'+arrow+'</a><a class="btn" href="'+CV_PDF+'" download>Download PDF</a></div></div>'+
  '<div class="cv-frame"><object data="'+CV_PDF+'#zoom=100&navpanes=0" type="application/pdf" aria-label="Shaon Kanti Dhar CV (PDF)">'+
  '<div class="cv-fallback"><p>Your browser can\'t show the PDF here.</p><a class="btn dark" href="'+CV_PDF+'" target="_blank" rel="noopener">Open the CV'+arrow+'</a></div></object></div>'+
  '</div>';
}

function vWork(){
  var rows=PROJECTS.map(function(p){
    return '<a class="pcard lift" href="#'+p.id+'" style="width:auto"><div class="im"><img src="'+p.card+'" alt="" loading="lazy"></div><div class="bd"><div class="top mono"><span>'+p.n+' · '+esc(p.cat)+'</span><span>'+(p.live?'<span class="live"><i></i>Live</span>':esc(p.status))+'</span></div><h3>'+esc(p.name)+'</h3><p>'+esc(p.tagline)+'</p>'+chips(p.stack.slice(0,4),2)+'<div class="go"><span class="mono muted">'+esc([p.role,p.period].filter(Boolean).join(' · '))+'</span>'+arrow+'</div></div></a>';
  }).join('');
  var arch=ARCHIVE.map(function(p){return '<article class="acard"><div class="top mono muted"><span>'+p.n+'</span><span>'+esc(p.sub)+'</span></div><h3>'+esc(p.name)+'</h3><p class="mono muted role">'+esc(p.role)+'</p><p class="txt">'+esc(p.text)+'</p>'+chips(p.stack||[],0)+((p.links&&p.links.length)?'<div class="chips" style="gap:14px; margin-top:4px">'+p.links.map(function(l){return ext(l[0],l[1])}).join(' ')+'</div>':'')+'</article>'}).join('');
  return '<div class="wrap">'+sheet('A-01','Work')+
   '<div class="case-hero"><span class="eyebrow">02 / Work</span><h1>Selected <em>work</em></h1><p class="tagline">IoT platforms, 5G network tools, AI agents and retail showroom experiences I have built and led at Samsung R&amp;D.</p></div>'+
   '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,520px),1fr)); gap:16px; margin-top:40px">'+rows+'</div>'+
   '<section class="sec"><div class="sec-h"><div><span class="eyebrow">Archive</span><h2>Earlier <em>projects</em></h2></div></div><div class="arch-grid">'+arch+'</div></section></div>';
}

function vCase(p){
  var i=PROJECTS.indexOf(p), prev=PROJECTS[(i-1+PROJECTS.length)%PROJECTS.length], next=PROJECTS[(i+1)%PROJECTS.length];
  var gal=p.gallery.map(function(g){return '<button class="g '+g[2]+'" type="button" data-cap="'+esc(g[1])+'"><img src="'+g[0]+'" alt="'+esc(g[1])+'" loading="lazy"><figcaption>'+esc(g[1])+'</figcaption></button>'}).join('');
  return '<div class="wrap">'+sheet('A-0'+(i+2),'Case study '+p.n)+
  '<div class="case-hero"><div class="crumbs"><a href="#work">Work</a><span>/</span><span>'+esc(p.name)+'</span></div>'+
    '<span class="eyebrow">'+p.n+' / '+esc(p.cat)+' '+(p.live?'<span class="live"><i></i>Live</span>':'')+'</span>'+
    '<h1>'+esc(p.name)+'</h1><p class="tagline">'+esc(p.tagline)+'</p>'+
    '<div class="case-meta'+(p.role?'':' three')+'">'+(p.role?'<div><span class="mono muted">'+(p.l1||'Role')+'</span><b>'+esc(p.role)+'</b></div>':'')+'<div><span class="mono muted">'+(p.l2||'When')+'</span><b>'+esc(p.period)+'</b></div><div><span class="mono muted">'+(p.l3||'Where')+'</span><b>'+esc(p.org)+'</b></div><div><span class="mono muted">'+(p.l4||'Status')+'</span><b>'+esc(p.status)+'</b></div></div>'+
  '</div>'+
  '<button class="cover'+(p.fit?' fit':'')+'" type="button" data-cap="'+esc(p.gallery[0][1])+'"><img src="'+p.cover+'" alt="'+esc(p.gallery[0][1])+'"></button>'+
  '<div class="case-body"><nav class="toc mono" aria-label="On this page"><a href="#'+p.id+'" data-jump="ov">Overview</a>'+(p.did?'<a href="#'+p.id+'" data-jump="did">What I did</a>':'')+''+(p.flows?'<a href="#'+p.id+'" data-jump="flows">How it works</a>':'')+''+(p.decisions?'<a href="#'+p.id+'" data-jump="dec">'+(p.decisionsTitle||'Engineering choices')+'</a>':'')+'<a href="#'+p.id+'" data-jump="gal">Gallery</a><a href="#'+p.id+'" data-jump="stk">Stack &amp; links</a></nav>'+
  '<div class="prose">'+
    '<section id="s-ov"><span class="eyebrow">Overview</span><p>'+esc(p.overview)+'</p>'+(p.points?'<div class="hl-grid">'+p.points.map(function(t){return '<div class="hl"><i aria-hidden="true"></i><p>'+esc(t)+'</p></div>'}).join('')+'</div>':'<div class="facts" style="grid-template-columns:repeat(3,1fr)">'+p.facts.map(function(f){return '<div class="fact" style="min-height:140px"><strong style="font-size:'+(f[0].length>4?'40px':'64px')+'">'+esc(f[0])+'</strong><span>'+esc(f[1])+'</span></div>'}).join('')+'</div>')+'</section>'+
    (p.did?'<section id="s-did"><span class="eyebrow">What I did</span><h2>My part</h2><ul class="ticks">'+p.did.map(function(d){return '<li>'+esc(d)+'</li>'}).join('')+'</ul></section>':'')+
    (p.flows?'<section id="s-flows"><span class="eyebrow">How it works</span><h2>'+esc(p.flowsTitle||'How it works')+'</h2>'+(p.flows.length>1?'<div class="flow-tabs" role="tablist" aria-label="Agent flows">'+p.flows.map(function(f,i){return '<button role="tab" type="button" aria-selected="'+(i===0)+'" aria-controls="flow-'+i+'" id="ft-'+i+'"><small>'+f.n+'</small>'+esc(f.name)+'</button>'}).join('')+'</div>':'')+p.flows.map(function(f,i){return '<div class="flow" role="tabpanel" id="flow-'+i+'" aria-labelledby="ft-'+i+'"'+(i?' hidden':'')+'><p class="trigger mono">Trigger · '+esc(f.trigger)+'</p><ol class="steps">'+f.steps.map(function(st){return '<li><b>'+esc(st[0])+'</b><span>'+esc(st[1])+'</span></li>'}).join('')+'</ol></div>'}).join('')+'</section>':'')+
    (p.decisions?'<section id="s-dec"><span class="eyebrow">'+(p.decisionsTitle||'Engineering choices')+'</span><h2>'+(p.decisionsHeading||(p.decisionsTitle?'What every flow shares':'How it\'s built'))+'</h2>'+(p.decisionsIntro?'<p>'+esc(p.decisionsIntro)+'</p>':'')+'<div class="decisions">'+p.decisions.map(function(d){return '<div class="dec"><b>'+esc(d[0])+'</b><span>'+esc(d[1])+'</span></div>'}).join('')+'</div></section>':'')+
    '<section id="s-gal"><span class="eyebrow">Gallery</span><h2>Screens &amp; photos</h2><div class="gallery" data-group="g">'+gal+'</div></section>'+
    '<section id="s-stk"><span class="eyebrow">Stack &amp; links</span>'+chips(p.stack,3)+'<div class="chips" style="gap:18px; margin-top:6px">'+p.links.map(function(l){return ext(l[0],l[1])}).join('')+'</div></section>'+
  '</div></div>'+
  '<div class="next"><a href="#'+prev.id+'"><span class="mono muted">← Previous</span><b>'+esc(prev.name)+'</b></a><a href="#'+next.id+'"><span class="mono muted">Next →</span><b>'+esc(next.name)+'</b></a></div></div>';
}

/* ---------- academic documents (redacted copies) ---------- */
function academicDocs(){
  var groups=ACADEMIC.map(function(g,gi){
    var thumbs=g.docs.map(function(d){return '<button class="shot doc" type="button" data-cap="'+esc(d[2])+'"><img src="'+d[0]+'" alt="'+esc(d[2])+'" loading="lazy"><span class="mono">'+esc(d[1])+'</span></button>'}).join('');
    return '<div class="doc-group"><div class="doc-head"><div><h4>'+esc(g.inst)+'</h4><p class="muted">'+esc(g.what)+' · '+esc(g.when)+'</p></div><span class="mono muted">'+esc(g.score)+'</span></div>'+
           '<div class="doc-grid" data-group="docs'+gi+'">'+thumbs+'</div></div>';
  }).join('');
  return '<section class="docs"><div class="docs-h"><span class="eyebrow">Academic documents</span><h3>Certificates &amp; <em>transcripts</em></h3></div>'+groups+'</section>';
}

function vRecord(tab){
  tab=tab||'exp';
  var jobs=JOBS.map(function(j,i){return '<div class="job"><span class="n">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(j.when)+'</b><div class="mono muted" style="margin-top:4px">'+esc(j.where)+'</div></div><div><h3>'+esc(j.title)+'</h3><p class="org"><a href="'+j.orgUrl+'">'+esc(j.org)+'</a> · '+esc(j.proj)+'</p><ul>'+j.pts.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>'+chips(j.sk,2)+'</div></div>'}).join('');
  var caps=CAPS.map(function(c,i){return '<div class="cap"><span class="mono muted">'+String(i+1).padStart(2,'0')+'</span><h3>'+esc(c[0])+'</h3>'+chips(c[1],2)+'</div>'}).join('');
  var edu='<div class="edu">'+
   '<div class="ed"><span class="mono muted">2015 – 2019</span><h3>BE in Information &amp; Communication Engineering</h3><p class="muted"><a href="https://nstu.edu.bd/">Noakhali Science and Technology University</a></p><p class="score">3.51 <small>/ 4.00 CGPA</small></p></div>'+
   '<div class="ed"><span class="mono muted">2012 – 2014</span><h3>HSC, Science</h3><p class="muted"><a href="https://fgc.gov.bd/">Feni Govt. College</a></p><p class="score">4.80 <small>/ 5.00</small></p></div>'+
   '<div class="ed"><span class="mono muted">2008 – 2012</span><h3>SSC, Science</h3><p class="muted"><a href="https://en.wikipedia.org/wiki/Feni_Government_Pilot_High_School">Feni Govt. Pilot High School</a></p><p class="score">5.00 <small>/ 5.00</small></p></div></div>';
  return '<div class="wrap">'+sheet('A-06','Record')+
   '<div class="case-hero"><span class="eyebrow">04 / Experience</span><h1>Experience &amp; <em>education</em></h1><p class="tagline">Career history, education and technical skills, from seven years at Samsung R&amp;D.</p></div>'+
   '<div class="tabs" role="tablist" aria-label="Record sections"><button role="tab" aria-selected="'+(tab==='exp')+'" aria-controls="t-exp" id="b-exp"><small>01</small>Experience</button><button role="tab" aria-selected="'+(tab==='edu')+'" aria-controls="t-edu" id="b-edu"><small>02</small>Education</button><button role="tab" aria-selected="'+(tab==='cap')+'" aria-controls="t-cap" id="b-cap"><small>03</small>Capabilities</button></div>'+
   '<div role="tabpanel" id="t-exp" aria-labelledby="b-exp"'+(tab==='exp'?'':' hidden')+'><div class="tl">'+jobs+'</div></div>'+
   '<div role="tabpanel" id="t-edu" aria-labelledby="b-edu"'+(tab==='edu'?'':' hidden')+'>'+edu+academicDocs()+'</div>'+
   '<div role="tabpanel" id="t-cap" aria-labelledby="b-cap"'+(tab==='cap'?'':' hidden')+'><div class="caps">'+caps+'</div></div>'+
   '</div>';
}

function vRecognition(){
  var certs=CERTS.map(function(c,i){var inner='<span class="n">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(c[0])+'</b><div class="mono muted" style="margin-top:4px">'+esc(c[1])+'</div></div><span class="mono muted">'+(c[2]?'Verify ↗':'Samsung')+'</span>'; return c[2]?'<a href="'+c[2]+'">'+inner+'</a>':'<div class="row">'+inner+'</div>'}).join('');
  var cont=CONTESTS.map(function(c,i){return '<div class="row"><span class="n">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(c[0])+'</b><div class="mono muted" style="margin-top:4px">'+esc(c[1])+'</div></div><span></span></div>'}).join('');
  return '<div class="wrap">'+sheet('A-07','Recognition')+
  '<div class="case-hero"><span class="eyebrow">05 / Awards</span><h1>Awards</h1><p class="tagline">Awards, certificates and my competitive programming record.</p></div>'+
  '<section class="sec"><div class="rec-grid" data-group="rec">'+
    AWARDS.map(function(a){return '<article class="rc aw"><button class="shot" type="button" data-cap="'+esc(a.name+', '+a.period)+'"><img src="'+a.img+'" alt="'+esc(a.name+' certificate for '+a.period+', presented to Shaon Kanti Dhar')+'" loading="lazy"></button><div class="pad"><span class="eyebrow gold">'+esc(a.period)+'</span><h3>'+esc(a.name)+'</h3><p class="muted">'+esc(a.note)+'</p>'+(a.link?ext('LinkedIn post',a.link):'')+'</div></article>'}).join('')+
    '<article class="rc ces"><button class="shot" type="button" data-cap="CES 2025 Las Vegas: SmartThings on show" style="height:100%"><img src="assets/img/ces.webp" alt="Visitors at a Samsung SmartThings display wall at CES 2025" style="aspect-ratio:auto; height:100%"></button></article>'+
    '<article class="rc cesx"><div class="pad"><span class="eyebrow">CES 2025 · Las Vegas</span><h3>Where the Q4 2024 work was shown</h3><p class="muted">Samsung showed the Next SmartThings work and Lounge at CES 2025, January 7 to 10. The Excellence Award for October to December 2024 was for this work.</p></div></article>'+
  '</div></section>'+
  '<section class="sec"><div class="sec-h"><div><span class="eyebrow">Certificates</span><h2>Samsung <em>certificates</em></h2></div></div><div class="list">'+certs+'</div></section>'+
  '<section class="sec"><div class="sec-h"><div><span class="eyebrow">Competitive programming</span><h2>Contests &amp; <em>club</em></h2></div>'+ext('NSTU Code Academy blog','https://nstu-coding-planet.blogspot.com/')+'</div><div class="list">'+cont+'</div></section>'+
  '</div>';
}

function vContact(){
  return '<div class="wrap">'+sheet('A-08','Contact')+
  '<div class="contact"><div><span class="eyebrow"><span class="live"><i></i>Open to conversations</span></span><h1 style="margin-top:18px">Let\'s create something <em>secure</em>, <em>intelligent</em> and <em>impactful</em>.</h1>'+
  '<p class="muted" style="margin-top:22px; max-width:52ch; font-size:17px">Whether it\'s an engineering role, a research collaboration or an AI and IoT project, I\'d love to hear from you.</p>'+
  '<div class="clock"><div><span class="mono muted">Local time in Dhaka</span><b id="clock">--:--</b></div><div><span class="mono muted">Time zone</span><b>UTC+6</b></div></div></div>'+
  '<div class="cbox">'+
    '<div class="crow"><div><span class="mono muted">Email</span><br><b>'+EMAIL+'</b></div><button class="copy" type="button" id="copy">Copy</button></div>'+
    '<a class="crow" href="mailto:'+EMAIL+'"><b>Write an email</b><span class="v">opens your mail app ↗</span></a>'+
    '<a class="crow" href="#match"><b>Match me to your role</b><span class="v">paste a job description ↗</span></a>'+
    '<a class="crow" href="https://www.linkedin.com/in/shaon-kanti-dhar"><b>LinkedIn</b><span class="v">/in/shaon-kanti-dhar ↗</span></a>'+
    '<a class="crow" href="https://nstu-coding-planet.blogspot.com/"><b>Blog</b><span class="v">NSTU Code Academy ↗</span></a>'+
  '</div></div></div>';
}

function vMatch(){
  return '<div class="wrap"><div class="case-hero"><span class="eyebrow">Role matcher</span><h1>Match me to <em>your role</em></h1>'+
  '<p class="muted" style="max-width:62ch; margin-top:18px; font-size:17px">Paste a job description or a list of requirements. You get a requirement-by-requirement view of what this portfolio backs up with evidence, and what it does not. The AI reads the role; every result is then checked against the portfolio, so it never claims a skill that is not there.</p></div>'+
  '<section class="sec" style="padding-top:36px"><div class="match">'+
    '<div class="match-in"><label for="jd" class="mono muted">Job description or requirements</label>'+
    '<textarea id="jd" rows="12" maxlength="5000" placeholder="Paste the role here…" spellcheck="false"></textarea>'+
    '<div class="actions"><button class="btn dark" type="button" id="jd-go">Check the match'+arrow+'</button><button class="btn" type="button" id="jd-ex">Try an example</button><button class="btn" type="button" id="jd-clear">Clear</button></div>'+
    '<p class="muted mono" style="font-size:12px; margin-top:14px">When you press Check, the text is sent to an AI model (open model on Cloudflare) to read it. This site does not store it. Do not paste anything confidential.</p></div>'+
    '<div class="match-out" id="jd-out" aria-live="polite"><p class="muted">Results appear here.</p></div>'+
  '</div></section></div>';
}
function matchResult(r){
  if(!r.found && !r.notes.length) return '<p><b>No recognisable requirements found.</b></p><p class="muted" style="margin-top:8px">Paste more of the job description, including the skills and tools it asks for. Or email <a href="mailto:'+EMAIL+'">'+EMAIL+'</a> and describe the role.</p>';
  var lab={strong:'Direct evidence',some:'Related',none:'Not shown'}, ic={strong:'●',some:'◐',none:'○'};
  var must=r.reqs.filter(function(q){return q.importance!=='nice'}), basis=r.source==='ai'&&must.length?must:r.reqs;
  var n={strong:0,some:0,none:0}; basis.forEach(function(q){n[q.status]++});
  var rows=r.reqs.map(function(q){
    var ev=q.evidence.map(function(e){return '<a href="'+esc(e.url)+'">'+esc(e.title)+'</a>'+(e.why?' <span class="muted">('+esc(e.why)+')</span>':'')}).join(' · ');
    var body=r.source==='ai'?(esc(q.note)||'Nothing on the portfolio shows this.')+(ev?'<div class="m-ev">'+ev+'</div>':''):(ev||esc(q.note)||'Nothing on the portfolio shows this.');
    return '<li class="m-'+q.status+'"><span class="m-b mono"><span aria-hidden="true">'+ic[q.status]+'</span> '+lab[q.status]+'</span><div><b>'+esc(q.label)+'</b>'+(r.source==='ai'&&q.importance==='nice'?' <span class="m-tag mono">nice to have</span>':'')+'<div class="muted">'+body+'</div></div></li>';
  }).join('');
  var notes=r.notes.map(function(q){return '<li class="m-'+q.status+'"><span class="m-b mono"><span aria-hidden="true">'+ic[q.status]+'</span> '+(q.status==='strong'?'Met':'Not met')+'</span><div><b>'+esc(q.label)+'</b><div class="muted">'+esc(q.text)+'</div></div></li>'}).join('');
  var head=r.source==='ai'&&must.length?n.strong+' of '+basis.length+' must-have requirements have direct evidence':n.strong+' of '+r.found+' requirements have direct evidence';
  return (r.role?'<p class="mono muted" style="font-size:12px">'+esc(r.role)+'</p>':'')+'<h2 class="m-h">'+head+'</h2>'+
    '<p class="muted">'+n.some+' related, '+n.none+' not shown. Each item links to the page that backs it up.</p>'+
    '<ul class="m-list">'+rows+notes+'</ul>'+
    '<p class="muted mono" style="font-size:12px; margin-top:16px">'+(r.source==='ai'?'Read by an AI model, then checked: every link points to real portfolio content, and an item with no evidence is never shown as a match. Verify anything important in the linked pages.':'Matched by keywords in your browser (the AI model was unavailable). It only knows a fixed list of topics, so treat it as a rough guide.')+'</p>'+
    '<div class="actions" style="margin-top:22px"><a class="btn dark" href="mailto:'+EMAIL+'?subject='+encodeURIComponent('Role for Shaon Kanti Dhar')+'">Email Shaon about this role'+arrow+'</a><a class="btn" href="#cv">View CV</a></div>';
}
function wireMatch(){
  var ta=document.getElementById('jd'), out=document.getElementById('jd-out'), go_=document.getElementById('jd-go'); if(!ta) return;
  var seq=0, ENDPOINT='https://portfolio-chat.shaon-kanti.workers.dev/match';
  function local(t){
    var C=window.PortfolioChat, idx=C.makeIndex(C.buildKB({EMAIL:EMAIL,PROJECTS:PROJECTS,ARCHIVE:ARCHIVE,JOBS:JOBS,CAPS:CAPS,CERTS:CERTS,CONTESTS:CONTESTS,NEWS:NEWS,AWARDS:AWARDS,RESEARCH:RESEARCH}));
    var r=C.matchRole(idx,t); r.source='local'; return r;
  }
  function go(){
    var t=ta.value.trim();
    if(t.length<30){out.innerHTML='<p class="muted">Paste a longer description (at least a few lines) to check.</p>'; return}
    var my=++seq, ctl=window.AbortController?new AbortController():null, timer;
    go_.disabled=true; out.innerHTML='<p class="muted" role="status">Reading the role and checking it against the portfolio…</p>';
    var done=function(r,tag){ if(my!==seq) return; clearTimeout(timer); go_.disabled=false; out.innerHTML=matchResult(r); track('match-check','Role matcher '+tag); };
    var fallback=function(){ done(local(t),'local') };
    timer=setTimeout(function(){ if(ctl) ctl.abort(); },28000);
    fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:t.slice(0,5000)}),signal:ctl?ctl.signal:undefined})
      .then(function(r){ if(!r.ok) throw new Error('http'); return r.json() })
      .then(function(j){ if(!j||!j.match||!j.match.reqs||!j.match.reqs.length) throw new Error('shape'); done(j.match,'ai') })
      .catch(fallback);
  }
  go_.addEventListener('click',go);
  document.getElementById('jd-ex').addEventListener('click',function(){ta.value=window.PortfolioChat.MATCH_EXAMPLE; go()});
  document.getElementById('jd-clear').addEventListener('click',function(){seq++; go_.disabled=false; ta.value=''; out.innerHTML='<p class="muted">Results appear here.</p>'; ta.focus()});
}

/* ---------- router ---------- */
var ROUTES={cv:vCV, home:vHome, about:vAbout, research:vResearch, work:vWork, record:vRecord, education:function(){return vRecord('edu')}, recognition:vRecognition, contact:vContact, match:vMatch};
var main=document.getElementById('main'), clockT=null, rotT=null;
function current(){var h=(location.hash||'').slice(1); return h||'home'}
function render(){
  var r=current(); document.body.setAttribute('data-page',r);
  var  p=PROJECTS.filter(function(x){return x.id===r})[0];
  var fn=ROUTES[r]||(p?function(){return vCase(p)}:null);
  if(!fn){r='home'; fn=vHome}
  var go=function(){
    main.innerHTML='<div class="view">'+fn()+'</div>';
    window.scrollTo(0,0);
    var top=p?'work':(r==='education'?'record':r);
    document.querySelectorAll('#nav a').forEach(function(a){a.toggleAttribute('aria-current',a.getAttribute('href')==='#'+top); if(a.getAttribute('href')==='#'+top) a.setAttribute('aria-current','page')});
    document.title=(p?p.name+' · ':r!=='home'?(({record:'Experience',education:'Education',recognition:'Awards',cv:'CV',match:'Role matcher'})[r]||r.charAt(0).toUpperCase()+r.slice(1))+' · ':'')+'Shaon Kanti Dhar';
    closeMenu(); wire(); wireMatch();
    track(p?p.id:r, document.title);
  };
  var done=false, run=function(){if(!done){done=true; go()}};
  if(!firstRender && document.startViewTransition && document.visibilityState==='visible' && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    try{document.startViewTransition(run)}catch(e){run()}
    setTimeout(run,400);
  } else run();
  firstRender=false;
}
var firstRender=true;

/* ---------- analytics (GoatCounter: page, country, device, source) ---------- */
var lastTracked=null;
function track(page,title){
  var path='/'+(page==='home'?'':page);
  if(path===lastTracked) return;
  var send=function(){
    if(!(window.goatcounter && window.goatcounter.count)) return false;
    try{ window.goatcounter.count({path:path, title:title}); lastTracked=path; }catch(e){}
    return true;
  };
  if(!send()){ var tries=0, t=setInterval(function(){ if(send()||++tries>20) clearInterval(t) },500); }
}
window.addEventListener('hashchange',render);

/* ---------- per-view wiring ---------- */
function wire(){
  clearInterval(clockT); clearInterval(rotT);
  /* featured-project showcase */
  var sc=document.getElementById('showcase');
  if(sc){
    var panel=document.getElementById('sc-panel'), cnt=document.getElementById('sc-count'), tabsEl=[].slice.call(sc.querySelectorAll('[role=tab]'));
    var pick=function(i,focus){
      tabsEl.forEach(function(t,k){t.setAttribute('aria-selected',k===i); t.tabIndex=k===i?0:-1});
      panel.setAttribute('aria-labelledby','sct-'+i); panel.innerHTML=scBody(i); panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
      cnt.textContent=String(i+1).padStart(2,'0')+' / '+String(PROJECTS.length).padStart(2,'0');
      if(focus) tabsEl[i].focus();
    };
    tabsEl.forEach(function(t,i){
      t.addEventListener('click',function(){pick(i)});
      t.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover)').matches) pick(i)});
      t.addEventListener('keydown',function(e){
        var n=tabsEl.length;
        if(e.key==='ArrowRight'){e.preventDefault(); pick((i+1)%n,true)}
        else if(e.key==='ArrowLeft'){e.preventDefault(); pick((i-1+n)%n,true)}
      });
    });
  }
  /* rotating word */
  var rot=document.getElementById('rot');
  if(rot && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    var w=[].slice.call(rot.children), k=0;
    rotT=setInterval(function(){w[k].setAttribute('aria-hidden','true'); k=(k+1)%w.length; w[k].removeAttribute('aria-hidden')},2600);
  }
  /* rail pause */
  var rb=document.getElementById('rail-btn');
  if(rb){rb.addEventListener('click',function(){var r=document.getElementById('rail'); var on=r.classList.toggle('paused'); rb.setAttribute('aria-pressed',on); rb.innerHTML='<span aria-hidden="true">'+(on?'▶':'❚❚')+'</span><span>'+(on?'PLAY':'PAUSE')+'</span>'})}
  /* tabs */
  var tabs=[].slice.call(document.querySelectorAll('[role=tab]'));
  tabs.forEach(function(t){t.addEventListener('click',function(){tabs.forEach(function(o){var s=o===t; o.setAttribute('aria-selected',s); document.getElementById(o.getAttribute('aria-controls')).hidden=!s})})});
  /* toc jumps */
  document.querySelectorAll('[data-jump]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault(); var el=document.getElementById('s-'+a.dataset.jump); if(el) el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})})});
  /* lightbox */
  document.querySelectorAll('.g, .cover, .shot').forEach(function(b){b.addEventListener('click',function(){var grp=b.closest('[data-group]'); var list=grp?[].slice.call(grp.querySelectorAll('.g,.shot')):[b]; if(b.classList.contains('cover')){var gg=document.querySelector('.gallery'); list=gg?[].slice.call(gg.querySelectorAll('.g')):[b]; openLB(list,0); return;} openLB(list,list.indexOf(b))})});
  /* contact */
  var c=document.getElementById('clock');
  if(c){var tick=function(){try{c.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Dhaka'}).format(new Date())}catch(e){c.textContent='UTC+6'}}; tick(); clockT=setInterval(tick,20000)}
  var cp=document.getElementById('copy'); if(cp) cp.addEventListener('click',copyEmail);
  /* lift-in */
  var ls=document.querySelectorAll('.lift');
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre'); io.unobserve(e.target)}})},{rootMargin:'0px 0px -40px 0px'});
    ls.forEach(function(el){var r=el.getBoundingClientRect(); if(r.top>innerHeight){el.classList.add('pre'); io.observe(el)}});
  }
}

/* ---------- lightbox ---------- */
var lb=document.getElementById('lb'), lbList=[], lbI=0;
function lbShow(i){lbI=(i+lbList.length)%lbList.length; var b=lbList[lbI], im=b.querySelector('img'); document.getElementById('lb-img').src=im.src; document.getElementById('lb-img').alt=im.alt; document.getElementById('lb-cap').textContent=b.dataset.cap||im.alt; document.getElementById('lb-p').hidden=document.getElementById('lb-n').hidden=lbList.length<2}
function openLB(list,i){if(!lb.showModal) return; lbList=list; lbShow(i<0?0:i); lb.showModal()}
document.getElementById('lb-p').onclick=function(){lbShow(lbI-1)};
document.getElementById('lb-n').onclick=function(){lbShow(lbI+1)};
document.getElementById('lb-x').onclick=function(){lb.close()};
lb.addEventListener('click',function(e){if(e.target===lb) lb.close()});
lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft') lbShow(lbI-1); if(e.key==='ArrowRight') lbShow(lbI+1)});

/* ---------- theme ---------- */
var root=document.documentElement, themeBtn=document.getElementById('theme');
function isDark(){var t=root.getAttribute('data-theme'); return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
function syncIcon(){themeBtn.innerHTML='<svg><use href="#'+(isDark()?'sun':'moon')+'"/></svg>'; themeBtn.setAttribute('aria-label',isDark()?'Switch to light theme':'Switch to dark theme')}
try{var saved=localStorage.getItem('skd-theme'); if(saved) root.setAttribute('data-theme',saved)}catch(e){}
function toggleTheme(){var n=isDark()?'light':'dark'; root.setAttribute('data-theme',n); try{localStorage.setItem('skd-theme',n)}catch(e){} syncIcon()}
themeBtn.addEventListener('click',toggleTheme); syncIcon();

/* ---------- mobile menu ---------- */
var mb=document.getElementById('menu-btn'), mob=document.getElementById('mobile');
function closeMenu(){mob.classList.remove('open'); mb.setAttribute('aria-expanded','false'); mb.setAttribute('aria-label','Open navigation')}
mb.addEventListener('click',function(){var o=mob.classList.toggle('open'); mb.setAttribute('aria-expanded',o); mb.setAttribute('aria-label',o?'Close navigation':'Open navigation')});

/* ---------- toast + copy ---------- */
function toast(t){var el=document.getElementById('toast'); el.textContent=t; el.classList.add('show'); setTimeout(function(){el.classList.remove('show')},1800)}
function copyEmail(){try{navigator.clipboard.writeText(EMAIL).then(function(){toast('Email copied')},function(){toast(EMAIL)})}catch(e){toast(EMAIL)}}

/* ---------- command palette ---------- */
var cmd=document.getElementById('cmd'), q=document.getElementById('cmd-q'), ul=document.getElementById('cmd-list'), sel=0, items=[];
var ALL=[['Home','Page','#home'],['About','Page','#about'],['Research','Page','#research'],['Work','Page','#work'],['Experience & Education','Page','#record'],['Education','Page','#education'],['Awards','Page','#recognition'],['Contact','Page','#contact'],['CV','Page','#cv'],['Match me to your role','Page','#match']]
  .concat(PROJECTS.map(function(p){return [p.name,'Case study','#'+p.id]}))
  .concat([['Switch theme','Action',toggleTheme],['Copy email address','Action',copyEmail],['Open LinkedIn','Link','https://www.linkedin.com/in/shaon-kanti-dhar']]);
function draw(){
  var s=q.value.toLowerCase().trim(); items=ALL.filter(function(a){return !s||a[0].toLowerCase().indexOf(s)>-1||a[1].toLowerCase().indexOf(s)>-1});
  if(sel>=items.length) sel=0;
  ul.innerHTML=items.length?items.map(function(a,i){return '<li><button type="button" role="option" data-i="'+i+'" aria-selected="'+(i===sel)+'"><span>'+esc(a[0])+'</span><span class="k">'+a[1]+'</span></button></li>'}).join(''):'<li class="muted" style="padding:14px">No matches. Try “work” or “theme”.</li>';
  [].forEach.call(ul.querySelectorAll('button'),function(b){b.addEventListener('click',function(){run(+b.dataset.i)})});
}
function run(i){var a=items[i]; if(!a) return; cmd.close(); if(typeof a[2]==='function') a[2](); else if(a[2].charAt(0)==='#') location.hash=a[2].slice(1); else location.href=a[2]}
function openCmd(){if(!cmd.showModal) return; q.value=''; sel=0; draw(); cmd.showModal(); q.focus()}
document.getElementById('cmd-open').addEventListener('click',openCmd);
q.addEventListener('input',function(){sel=0; draw()});
q.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault(); sel=Math.min(sel+1,items.length-1); draw()} else if(e.key==='ArrowUp'){e.preventDefault(); sel=Math.max(sel-1,0); draw()} else if(e.key==='Enter'){e.preventDefault(); run(sel)}});
cmd.addEventListener('click',function(e){if(e.target===cmd) cmd.close()});
document.addEventListener('keydown',function(e){
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault(); cmd.open?cmd.close():openCmd()}
  else if(e.key==='/'&&!/input|textarea/i.test((document.activeElement||{}).tagName||'')&&!cmd.open){e.preventDefault(); openCmd()}
});

/* ---------- back to top ---------- */
var toTop=document.getElementById('to-top');
if(toTop) toTop.addEventListener('click',function(e){e.preventDefault(); window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});

/* ---------- scroll progress ---------- */
var pr=document.getElementById('progress');
addEventListener('scroll',function(){var h=document.documentElement; var m=h.scrollHeight-h.clientHeight; pr.style.width=(m>0?h.scrollTop/m*100:0)+'%'},{passive:true});

render();
