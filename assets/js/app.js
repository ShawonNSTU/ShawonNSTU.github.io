
/* ---------- helpers ---------- */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function chips(a,hi){return '<div class="chips">'+a.map(function(c,i){return '<span class="chip'+(i<(hi||0)?' a':'')+'">'+esc(c)+'</span>'}).join('')+'</div>'}
function ext(t,u){return '<a class="more" href="'+u+'">'+esc(t)+'<svg aria-hidden="true"><use href="#arr"/></svg></a>'}
function sheet(){return ''}
var arrow='<svg aria-hidden="true"><use href="#right"/></svg>';

/* ---------- floor plan ---------- */
function plan(){
  var C=Math.cos(Math.PI/6), S=0.5, ox=300, oy=70, H=40;
  function iso(x,y,z){return [ox+(x-y)*C, oy+(x+y)*S-(z||0)]}
  function pts(a){return a.map(function(p){return p.join(',')}).join(' ')}
  var rooms=[
    {p:PROJECTS[0], x:0,y:0,w:190,d:140},
    {p:PROJECTS[1], x:190,y:0,w:130,d:140},
    {p:PROJECTS[2], x:0,y:140,w:110,d:130},
    {p:PROJECTS[3], x:110,y:140,w:100,d:130},
    {p:PROJECTS[4], x:210,y:140,w:110,d:130}
  ];
  var up=function(p){return [p[0],p[1]-H]};
  var o0=iso(0,0), oX=iso(320,0), oY=iso(0,270);
  var g='<polygon fill="var(--plan-wall)" opacity=".55" points="'+pts([o0,oY,up(oY),up(o0)])+'"/>'+
        '<polygon fill="var(--plan-wall)" opacity=".85" points="'+pts([o0,oX,up(oX),up(o0)])+'"/>';
  rooms.forEach(function(r){
    var a=iso(r.x,r.y),b=iso(r.x+r.w,r.y),c=iso(r.x+r.w,r.y+r.d),d=iso(r.x,r.y+r.d);
    var cx=iso(r.x+r.w/2,r.y+r.d/2);
    g+='<g class="room" tabindex="0" role="link" data-id="'+r.p.id+'" aria-label="'+esc(r.p.name)+' case study">'+
       '<polygon class="floor" points="'+pts([a,b,c,d])+'"/>'+
       '<text x="'+cx[0]+'" y="'+(cx[1]-26)+'" text-anchor="middle">'+r.p.n+'</text>'+
       '<text class="nm" x="'+cx[0]+'" y="'+(cx[1]-8)+'" text-anchor="middle">'+esc(r.p.short||r.p.name)+'</text>'+
       '<g class="pin"><circle class="h" cx="'+cx[0]+'" cy="'+(cx[1]+14)+'" r="9"/><circle class="c" cx="'+cx[0]+'" cy="'+(cx[1]+14)+'" r="5"/></g>'+
       '</g>';
  });
  var A=iso(0,270),B=iso(320,270),D=iso(320,0);
  var front='<polyline points="'+pts([A,B,D])+'" fill="none" stroke="var(--plan-wall)" stroke-width="2"/>';
  return '<svg viewBox="0 10 600 370" role="group" aria-label="Floor plan: each room is a project. Select a room to open its case study.">'+g+front+'</svg>';
}

/* ---------- views ---------- */
function vHome(){
  var cards=PROJECTS.map(function(p,i){return '<a class="pcard'+(i===0?' dark':'')+'" href="#'+p.id+'"><div class="im"><img src="'+p.card+'" alt="" loading="lazy"></div><div class="bd"><div class="top mono"><span>'+esc(p.cat)+'</span><span>'+(p.live?'<span class="live"><i></i>Live</span>':esc(p.status))+'</span></div><h3>'+esc(p.name)+'</h3><p>'+esc(p.tagline)+'</p><div class="go"><span>Read the case study</span>'+arrow+'</div></div></a>'}).join('');
  var recs=PROJECTS.concat(ARCHIVE).map(function(p){
    var isP=!!p.id;
    var txt=isP?p.overview:p.text, st=p.stack, links=isP?[['Open case study','#'+p.id]].concat(p.links):p.links;
    return '<details><summary><span class="mono muted">'+p.n+'</span><h3>'+esc(p.name)+'</h3><span class="sub muted">'+esc(isP?p.cat+' · '+p.period:p.sub)+'</span><span class="pm" aria-hidden="true">+</span></summary>'+
      '<div class="body"><span></span><div><p>'+esc(txt)+'</p>'+chips(st,2)+'</div><div><dl class="kv"><dt>Role</dt><dd>'+esc(p.role)+'</dd><dt>When</dt><dd>'+esc(isP?p.period:p.sub)+'</dd>'+(isP?'<dt>Status</dt><dd>'+esc(p.status)+'</dd>':'')+'</dl><div class="chips">'+links.map(function(l){return ext(l[0],l[1])}).join(' ')+'</div></div></div></details>';
  }).join('');
  return '<div class="wrap">'+sheet('A-00','Home')+
  '<section class="hero">'+
    '<div>'+
      '<span class="eyebrow">Project Leader / Full-stack engineer / AI Engineering</span>'+
      '<h1>I build <em>AI-enabled software</em> and the <em>agents</em> that power it.</h1>'+
      '<p class="lead">Seven years at Samsung R&amp;D Institute Bangladesh. I lead <b>12 engineers</b> on <b>SmartThings Pro</b>, Samsung\'s B2B building-management platform, and architected its AI agent that runs at <b>Starbucks</b>.</p>'+
      '<div class="actions"><a class="btn dark" href="#work">Explore my work'+arrow+'</a><a class="btn" href="#cv">View CV</a><a class="btn" href="#record">Read my record</a></div>'+
      '<div class="portrait-chip"><img src="assets/img/photo.webp" alt="Shaon Kanti Dhar" width="52" height="52"><div><b style="font-weight:600">Shaon Kanti Dhar</b><div class="mono muted">Dhaka, Bangladesh · <span class="live"><i></i>Available for conversations</span></div></div></div>'+
    '</div>'+
    '<div class="plan"><div class="plan-head mono muted"><span>My projects, drawn as a floor plan</span><span>Pick a room</span></div>'+plan()+
      '<div class="plan-tip" id="tip"><div><b id="tip-t">Five rooms, five projects</b><p id="tip-d">Each room is a project I led or built. Hover over a room, or tap it, to read about it.</p></div><a class="btn" id="tip-a" href="#work" style="padding:9px 14px">Open'+arrow+'</a></div>'+
    '</div>'+
  '</section>'+
  '<div class="tags4 mono"><div><span class="muted">01</span><b>IoT platforms</b></div><div><span class="muted">02</span><b>AI agents</b></div><div><span class="muted">03</span><b>Real-time web</b></div><div><span class="muted">04</span><b>Team leadership</b></div></div>'+
  '</div>'+
  '<section class="sec"><div class="wrap"><div class="sec-h"><div><span class="eyebrow">Selected work</span><h2>Things I\'ve <em>shipped</em></h2></div>'+ext('All case studies','#work')+'</div></div>'+
    '<div class="rail" id="rail"><div class="rail-track">'+cards+cards.replace(/<a /g,'<a aria-hidden="true" tabindex="-1" ')+'</div></div>'+
    '<div class="wrap"><div class="rail-ctl"><button type="button" id="rail-btn" aria-pressed="false"><span aria-hidden="true">❚❚</span><span>PAUSE</span></button></div></div>'+
  '</section>'+
  '<section class="sec"><div class="wrap"><div class="sec-h"><div><span class="eyebrow">Project records</span><h2>Roles, stacks &amp; <em>links</em></h2></div><p>Every project in one list. Open a row for the role, stack and sources.</p></div><div class="acc">'+recs+'</div></div></section>'+
  '<section class="sec"><div class="wrap"><div class="sec-h"><div><span class="eyebrow">By the numbers</span><h2>The short <em>version</em></h2></div>'+ext('Full record','#record')+'</div>'+
    '<div class="facts">'+
      '<div class="fact lift"><strong data-count="7">7</strong><span>years at Samsung R&amp;D, from Software Engineer to Project Leader</span></div>'+
      '<div class="fact lift"><strong data-count="12">12</strong><span>engineers on the SmartThings Pro team I lead</span></div>'+
      '<div class="fact lift"><strong>4</strong><span>Samsung R&amp;D awards: two Excellence and two Icon awards</span></div>'+
      '<div class="fact lift"><strong>2</strong><span>Samsung patents as co-inventor, one graded A1</span></div>'+
    '</div></div></section>'+
  '<section class="sec"><div class="wrap"><div class="sec-h"><div><span class="eyebrow">News</span><h2>Recent <em>milestones</em></h2></div>'+ext('All news','#about')+'</div>'+newsList(6)+'</div></section>';
}

function newsList(n){return '<div class="list news">'+NEWS.slice(0,n||NEWS.length).map(function(x){return '<div class="row"><span class="mono muted">'+esc(x[0])+'</span><div><b style="font-size:20px">'+esc(x[1])+'</b></div><span></span></div>'}).join('')+'</div>'}

function vAbout(){
  return '<div class="wrap">'+
  '<div class="case-hero"><span class="eyebrow">01 / About</span><h1>About <em>me</em></h1></div>'+
  '<div class="about">'+
    '<div class="about-text">'+
      '<p>I\'m a full-stack software engineer at Samsung R&amp;D Institute Bangladesh in Dhaka, where I\'ve worked since October 2019. I started as a Software Engineer and I\'m now the Project Leader for <a href="#smartthings-pro">SmartThings Pro</a>, Samsung\'s platform for managing devices in hotels, offices, stores and apartment buildings. I lead 12 engineers across frontend, backend, database and cloud.</p>'+
      '<p>Most of my work sits where software meets physical devices. I built a 3D floor-plan view that shows building managers every device in place, a map for managing many sites at once, and <a href="#lounge">showroom apps</a> that let visitors at IFA in Berlin and CES in Las Vegas control real appliances from their own phones without signing in.</p>'+
      '<p>Lately much of my time goes into AI agents. I architected the SmartThings Pro B2B AI Agent, which went live at Starbucks. I also designed a <a href="#quality-agent">code-quality agent</a> that opens, fixes and follows its own pull requests, and I set up an AI-assisted development environment for my team.</p>'+
      '<p>I also do research on device security. In December 2024 I proposed a <a href="#research">method to keep calls and private notifications on Bluetooth multipoint earbuds</a> from reaching the wrong listener. I\'m a co-inventor on two Samsung patents.</p>'+
      '<p>Before Samsung I studied Information and Communication Engineering at Noakhali Science and Technology University. There I was Vice President of the programming club and set problems for university contests.</p>'+
    '</div>'+
    '<aside class="about-card"><img src="assets/img/photo.webp" alt="Shaon Kanti Dhar" width="655" height="655"><dl class="kv">'+
      '<dt>Role</dt><dd>Project Leader, SmartThings Pro</dd><dt>Company</dt><dd>Samsung R&amp;D Institute Bangladesh</dd><dt>Team</dt><dd>12 engineers</dd><dt>Focus</dt><dd>IoT platforms, real-time web, AI agents</dd><dt>Based in</dt><dd>Dhaka, Bangladesh</dd></dl>'+
      '<div class="chips" style="gap:14px">'+ext('LinkedIn','https://www.linkedin.com/in/shaon-kanti-dhar')+ext('Email me','mailto:'+EMAIL)+'</div></aside>'+
  '</div>'+
  '<section class="sec"><div class="sec-h"><div><span class="eyebrow">News</span><h2>Milestones, <em>newest first</em></h2></div></div>'+newsList()+'</section>'+
  '</div>';
}

function vResearch(){
  var areas=RESEARCH_AREAS.map(function(a,i){return '<div class="cap"><span class="mono muted">'+String(i+1).padStart(2,'0')+'</span><h3>'+esc(a[0])+'</h3><p class="muted">'+esc(a[1])+'</p></div>'}).join('');
  var cards=function(a){return '<div class="decisions">'+a.map(function(d){return '<div class="dec"><b>'+esc(d[0])+'</b><span>'+esc(d[1])+'</span></div>'}).join('')+'</div>'};
  return '<div class="wrap">'+
  '<div class="case-hero"><span class="eyebrow">03 / Research</span><h1>Research &amp; <em>inventions</em></h1><p class="tagline">Ideas I\'ve worked on beyond product work: keeping wearables private, telling real input from accidental input, and syncing cameras.</p></div>'+
  '<section class="sec" style="padding-top:48px"><div class="sec-h"><div><span class="eyebrow">Research interests</span><h2>What I <em>look into</em></h2></div></div><div class="caps" style="grid-template-columns:repeat(4,1fr)">'+areas+'</div></section>'+

  '<section class="sec"><div class="sec-h"><div><span class="eyebrow">Research experience</span><h2>Research &amp; <em>patents</em></h2></div>'+ext('Patent details on Recognition','#recognition')+'</div><div class="list">'+
    '<div class="row"><span class="n">01</span><div><b>A method to increase security when using Bluetooth multipoint</b><div class="muted" style="font-size:14.5px; margin-top:4px; max-width:70ch">When earbuds are shared or connected to several devices, calls and private notifications can reach the wrong listener. I proposed rating each earbud\'s trust from the wearer\'s voice and each sound\'s sensitivity, so private audio only plays in a trusted earbud. Sole researcher, Dec 2024. Not granted.</div>'+chips(['Bluetooth multipoint','Voice biometrics','Audio classification','NLP'],0)+'</div><span class="mono muted">Dec 2024</span></div>'+
    '<a href="https://patents.google.com/patent/US20230229260A1/en"><span class="n">02</span><div><b>Wearable device and control method therefor</b><div class="muted" style="font-size:14.5px; margin-top:4px; max-width:70ch">Uses sensor data to separate intentional touches from accidental ones on wireless earbuds. Co-inventor on a Samsung Electronics patent, graded A1 by SRBD Patents.</div></div><span class="mono muted">US20230229260A1 ↗</span></a>'+
    '<div class="row"><span class="n">03</span><div><b>Method to reduce light flicker while recording video</b><div class="muted" style="font-size:14.5px; margin-top:4px; max-width:70ch">Syncs camera settings to cut light flicker when recording with several cameras at once. Co-inventor on a Samsung Electronics patent.</div></div><span class="mono muted">Samsung Electronics</span></div>'+
  '</div></section>'+
  '<section class="sec"><div class="sec-h"><div><span class="eyebrow">Earlier research</span><h2>From <em>university</em></h2></div></div><div class="list">'+
    '<a href="https://drive.google.com/file/d/1Dq82T5FAXLuBrWfTkniQ3sxqkyNYSYFE/"><span class="n">01</span><div><b>Checking user photos automatically in a travel app</b><div class="muted" style="font-size:14.5px; margin-top:4px; max-width:70ch">My final-year project at NSTU, 2018 to 2019. The Travel Assistant app screened shared photos with Firebase ML Kit and Microsoft\'s content moderation API before publishing them.</div></div><span class="mono muted">Project report ↗</span></a>'+
  '</div></section>'+
  '</div>';
}

var CV_PDF='files/Shaon_Kanti_Dhar_CV.pdf';
function vCV(){
  return '<div class="wrap">'+
  '<div class="cv-head"><div><span class="eyebrow">Curriculum vitae</span><h1 class="serif">My <em>CV</em></h1><p class="muted">Research interests, research and AI experience, work history, awards and skills. Three pages.</p></div>'+
  '<div class="cv-actions"><a class="btn dark" href="'+CV_PDF+'" target="_blank" rel="noopener">Open in new tab'+arrow+'</a><a class="btn" href="'+CV_PDF+'" download>Download PDF</a></div></div>'+
  '<div class="cv-frame"><object data="'+CV_PDF+'#view=FitH" type="application/pdf" aria-label="Shaon Kanti Dhar CV (PDF)">'+
  '<div class="cv-fallback"><p>Your browser can\'t show the PDF here.</p><a class="btn dark" href="'+CV_PDF+'" target="_blank" rel="noopener">Open the CV'+arrow+'</a></div></object></div>'+
  '</div>';
}

function vWork(){
  var rows=PROJECTS.map(function(p){
    return '<a class="pcard lift" href="#'+p.id+'" style="width:auto"><div class="im"><img src="'+p.card+'" alt="" loading="lazy"></div><div class="bd"><div class="top mono"><span>'+p.n+' · '+esc(p.cat)+'</span><span>'+(p.live?'<span class="live"><i></i>Live</span>':esc(p.status))+'</span></div><h3>'+esc(p.name)+'</h3><p>'+esc(p.tagline)+'</p>'+chips(p.stack.slice(0,4),2)+'<div class="go"><span class="mono muted">'+esc(p.role)+' · '+esc(p.period)+'</span>'+arrow+'</div></div></a>';
  }).join('');
  var arch=ARCHIVE.map(function(p){return '<div class="row"><span class="n">'+p.n+'</span><div><b>'+esc(p.name)+'</b><p class="muted" style="font-size:14.5px; margin-top:4px; max-width:70ch">'+esc(p.text)+'</p></div><span class="mono muted">'+esc(p.sub)+'</span></div>'}).join('');
  return '<div class="wrap">'+sheet('A-01','Work')+
   '<div class="case-hero"><span class="eyebrow">02 / Work</span><h1>Selected <em>work</em></h1><p class="tagline">Products for business clients, showrooms and trade-show floors, and the internal tools behind them.</p></div>'+
   '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,520px),1fr)); gap:16px; margin-top:40px">'+rows+'</div>'+
   '<section class="sec"><div class="sec-h"><div><span class="eyebrow">Archive</span><h2>Earlier <em>projects</em></h2></div></div><div class="list">'+arch+'</div></section></div>';
}

function vCase(p){
  var i=PROJECTS.indexOf(p), prev=PROJECTS[(i-1+PROJECTS.length)%PROJECTS.length], next=PROJECTS[(i+1)%PROJECTS.length];
  var gal=p.gallery.map(function(g){return '<button class="g '+g[2]+'" type="button" data-cap="'+esc(g[1])+'"><img src="'+g[0]+'" alt="'+esc(g[1])+'" loading="lazy"><figcaption>'+esc(g[1])+'</figcaption></button>'}).join('');
  return '<div class="wrap">'+sheet('A-0'+(i+2),'Case study '+p.n)+
  '<div class="case-hero"><div class="crumbs"><a href="#work">Work</a><span>/</span><span>'+esc(p.name)+'</span></div>'+
    '<span class="eyebrow">'+p.n+' / '+esc(p.cat)+' '+(p.live?'<span class="live"><i></i>Live</span>':'')+'</span>'+
    '<h1>'+esc(p.name)+'</h1><p class="tagline">'+esc(p.tagline)+'</p>'+
    '<div class="case-meta"><div><span class="mono muted">'+(p.l1||'Role')+'</span><b>'+esc(p.role)+'</b></div><div><span class="mono muted">'+(p.l2||'When')+'</span><b>'+esc(p.period)+'</b></div><div><span class="mono muted">'+(p.l3||'Where')+'</span><b>'+esc(p.org)+'</b></div><div><span class="mono muted">'+(p.l4||'Status')+'</span><b>'+esc(p.status)+'</b></div></div>'+
  '</div>'+
  '<button class="cover'+(p.fit?' fit':'')+'" type="button" data-cap="'+esc(p.gallery[0][1])+'"><img src="'+p.cover+'" alt="'+esc(p.gallery[0][1])+'"></button>'+
  '<div class="case-body"><nav class="toc mono" aria-label="On this page"><a href="#'+p.id+'" data-jump="ov">Overview</a><a href="#'+p.id+'" data-jump="did">What I did</a>'+(p.flows?'<a href="#'+p.id+'" data-jump="flows">How it works</a>':'')+'<a href="#'+p.id+'" data-jump="dec">'+(p.decisionsTitle||'Engineering choices')+'</a><a href="#'+p.id+'" data-jump="gal">Gallery</a><a href="#'+p.id+'" data-jump="stk">Stack &amp; links</a></nav>'+
  '<div class="prose">'+
    '<section id="s-ov"><span class="eyebrow">Overview</span><p>'+esc(p.overview)+'</p><div class="facts" style="grid-template-columns:repeat(3,1fr)">'+p.facts.map(function(f){return '<div class="fact" style="min-height:140px"><strong style="font-size:'+(f[0].length>4?'40px':'64px')+'">'+esc(f[0])+'</strong><span>'+esc(f[1])+'</span></div>'}).join('')+'</div></section>'+
    '<section id="s-did"><span class="eyebrow">What I did</span><h2>My part</h2><ul class="ticks">'+p.did.map(function(d){return '<li>'+esc(d)+'</li>'}).join('')+'</ul></section>'+
    (p.flows?'<section id="s-flows"><span class="eyebrow">How it works</span><h2>Three flows, one agent</h2><div class="flow-tabs" role="tablist" aria-label="Agent flows">'+p.flows.map(function(f,i){return '<button role="tab" type="button" aria-selected="'+(i===0)+'" aria-controls="flow-'+i+'" id="ft-'+i+'"><small>'+f.n+'</small>'+esc(f.name)+'</button>'}).join('')+'</div>'+p.flows.map(function(f,i){return '<div class="flow" role="tabpanel" id="flow-'+i+'" aria-labelledby="ft-'+i+'"'+(i?' hidden':'')+'><p class="trigger mono">Trigger · '+esc(f.trigger)+'</p><ol class="steps">'+f.steps.map(function(st){return '<li><b>'+esc(st[0])+'</b><span>'+esc(st[1])+'</span></li>'}).join('')+'</ol></div>'}).join('')+'</section>':'')+
    '<section id="s-dec"><span class="eyebrow">'+(p.decisionsTitle||'Engineering choices')+'</span><h2>'+(p.decisionsTitle?'What every flow shares':'How it\'s built')+'</h2>'+(p.decisionsIntro?'<p>'+esc(p.decisionsIntro)+'</p>':'')+'<div class="decisions">'+p.decisions.map(function(d){return '<div class="dec"><b>'+esc(d[0])+'</b><span>'+esc(d[1])+'</span></div>'}).join('')+'</div></section>'+
    '<section id="s-gal"><span class="eyebrow">Gallery</span><h2>Screens &amp; photos</h2><div class="gallery" data-group="g">'+gal+'</div></section>'+
    '<section id="s-stk"><span class="eyebrow">Stack &amp; links</span>'+chips(p.stack,3)+'<div class="chips" style="gap:18px; margin-top:6px">'+p.links.map(function(l){return ext(l[0],l[1])}).join('')+'</div></section>'+
  '</div></div>'+
  '<div class="next"><a href="#'+prev.id+'"><span class="mono muted">← Previous</span><b>'+esc(prev.name)+'</b></a><a href="#'+next.id+'"><span class="mono muted">Next →</span><b>'+esc(next.name)+'</b></a></div></div>';
}

function vRecord(){
  var jobs=JOBS.map(function(j,i){return '<div class="job"><span class="n">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(j.when)+'</b><div class="mono muted" style="margin-top:4px">'+esc(j.where)+'</div></div><div><h3>'+esc(j.title)+'</h3><p class="org"><a href="'+j.orgUrl+'">'+esc(j.org)+'</a> · '+esc(j.proj)+'</p><ul>'+j.pts.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>'+chips(j.sk,2)+'</div></div>'}).join('');
  var caps=CAPS.map(function(c,i){return '<div class="cap"><span class="mono muted">'+String(i+1).padStart(2,'0')+'</span><h3>'+esc(c[0])+'</h3>'+chips(c[1],2)+'</div>'}).join('');
  var edu='<div class="edu">'+
   '<div class="ed"><span class="mono muted">2015 – 2019</span><h3>BE in Information &amp; Communication Engineering</h3><p class="muted"><a href="https://nstu.edu.bd/">Noakhali Science and Technology University</a></p><p class="score">3.51 <small>/ 4.00 CGPA</small></p></div>'+
   '<div class="ed"><span class="mono muted">2012 – 2014</span><h3>HSC, Science</h3><p class="muted"><a href="https://fgc.gov.bd/">Feni Govt. College</a></p><p class="score">4.80 <small>/ 5.00</small></p></div>'+
   '<div class="ed"><span class="mono muted">2008 – 2012</span><h3>SSC, Science</h3><p class="muted"><a href="https://en.wikipedia.org/wiki/Feni_Government_Pilot_High_School">Feni Govt. Pilot High School</a></p><p class="score">5.00 <small>/ 5.00 · Golden</small></p></div></div>';
  return '<div class="wrap">'+sheet('A-06','Record')+
   '<div class="case-hero"><span class="eyebrow">04 / Record</span><h1>The <em>record</em></h1><p class="tagline">Seven years at Samsung R&amp;D, the degrees behind them, and the tools I use.</p></div>'+
   '<div class="tabs" role="tablist" aria-label="Record sections"><button role="tab" aria-selected="true" aria-controls="t-exp" id="b-exp"><small>01</small>Experience</button><button role="tab" aria-selected="false" aria-controls="t-edu" id="b-edu"><small>02</small>Education</button><button role="tab" aria-selected="false" aria-controls="t-cap" id="b-cap"><small>03</small>Capabilities</button></div>'+
   '<div role="tabpanel" id="t-exp" aria-labelledby="b-exp"><div class="tl">'+jobs+'</div></div>'+
   '<div role="tabpanel" id="t-edu" aria-labelledby="b-edu" hidden>'+edu+'</div>'+
   '<div role="tabpanel" id="t-cap" aria-labelledby="b-cap" hidden><div class="caps">'+caps+'</div></div>'+
   '</div>';
}

function vRecognition(){
  var certs=CERTS.map(function(c,i){var inner='<span class="n">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(c[0])+'</b><div class="mono muted" style="margin-top:4px">'+esc(c[1])+'</div></div><span class="mono muted">'+(c[2]?'Verify ↗':'Samsung')+'</span>'; return c[2]?'<a href="'+c[2]+'">'+inner+'</a>':'<div class="row">'+inner+'</div>'}).join('');
  var cont=CONTESTS.map(function(c,i){return '<div class="row"><span class="n">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(c[0])+'</b><div class="mono muted" style="margin-top:4px">'+esc(c[1])+'</div></div><span></span></div>'}).join('');
  return '<div class="wrap">'+sheet('A-07','Recognition')+
  '<div class="case-hero"><span class="eyebrow">05 / Recognition</span><h1>Awards, patents &amp; <em>credentials</em></h1><p class="tagline">Four Samsung R&amp;D awards, two patents, five certificates and my competitive programming record.</p></div>'+
  '<div class="facts" style="margin-top:36px"><div class="fact"><strong>4</strong><span>Samsung R&amp;D awards: two Excellence and two Icon</span></div><div class="fact"><strong>2</strong><span>patents as co-inventor</span></div><div class="fact"><strong>5</strong><span>certificates, 3 with verification links</span></div><div class="fact"><strong>6</strong><span>contest placements and roles at NSTU</span></div></div>'+
  '<section class="sec"><div class="rec-grid" data-group="rec">'+
    AWARDS.map(function(a){return '<article class="rc aw"><button class="shot" type="button" data-cap="'+esc(a.name+', '+a.period)+'"><img src="'+a.img+'" alt="'+esc(a.name+' certificate for '+a.period+', presented to Shaon Kanti Dhar')+'" loading="lazy"></button><div class="pad"><span class="eyebrow gold">'+esc(a.period)+'</span><h3>'+esc(a.name)+'</h3><p class="muted">'+esc(a.note)+'</p>'+ext('LinkedIn post',a.link)+'</div></article>'}).join('')+
    '<article class="rc ces"><button class="shot" type="button" data-cap="CES 2025 Las Vegas: SmartThings on show" style="height:100%"><img src="assets/img/ces.webp" alt="Visitors at a Samsung SmartThings display wall at CES 2025" style="aspect-ratio:auto; height:100%"></button></article>'+
    '<article class="rc cesx"><div class="pad"><span class="eyebrow">CES 2025 · Las Vegas</span><h3>Where the Q4 2024 work was shown</h3><p class="muted">Samsung showed the Next SmartThings work and Lounge at CES 2025, January 7 to 10. The Excellence Award for October to December 2024 was for this work.</p></div></article>'+
    '<article class="rc pat"><div class="pad"><span class="eyebrow gold">Patent · Graded A1</span><h3>Wearable device and control method therefor</h3><p class="mono muted">Co-inventor · Samsung Electronics · <a href="https://patents.google.com/patent/US20230229260A1/en">US20230229260A1</a></p><p class="muted">Uses sensor data to separate intentional touches from accidental ones on a wearable device. Filed internally as “Filtering accidental touches in wireless earbud touchpad” and graded A1 by SRBD Patents.</p></div><button class="shot" type="button" data-cap="SRBD Patents certificate of appreciation, grade A1"><img src="assets/img/patent.webp" alt="SRBD Patents certificate of appreciation, grade A1"></button></article>'+
    '<article class="rc pat"><div class="pad"><span class="eyebrow">Patent</span><h3>Method to reduce light flicker while recording video</h3><p class="mono muted">Co-inventor · Samsung Electronics</p><p class="muted">Syncs camera settings to cut light flicker when recording with several cameras at once.</p></div></article>'+
  '</div></section>'+
  '<section class="sec"><div class="sec-h"><div><span class="eyebrow">Certificates</span><h2>Certified &amp; <em>verifiable</em></h2></div></div><div class="list">'+certs+'</div></section>'+
  '<section class="sec"><div class="sec-h"><div><span class="eyebrow">Competitive programming</span><h2>Contests &amp; <em>club</em></h2></div>'+ext('NSTU Code Academy blog','https://nstu-coding-planet.blogspot.com/')+'</div><div class="list">'+cont+'</div></section>'+
  '</div>';
}

function vContact(){
  return '<div class="wrap">'+sheet('A-08','Contact')+
  '<div class="contact"><div><span class="eyebrow"><span class="live"><i></i>Open to conversations</span></span><h1 style="margin-top:18px">Building with <em>connected devices</em> or <em>AI agents?</em> Let\'s talk.</h1>'+
  '<p class="muted" style="margin-top:22px; max-width:52ch; font-size:17px">I\'m happy to talk about IoT platforms, real-time web apps, AI agents for business, or leading a full-stack team.</p>'+
  '<div class="clock"><div><span class="mono muted">Local time in Dhaka</span><b id="clock">--:--</b></div><div><span class="mono muted">Time zone</span><b>UTC+6</b></div></div></div>'+
  '<div class="cbox">'+
    '<div class="crow"><div><span class="mono muted">Email</span><br><b>'+EMAIL+'</b></div><button class="copy" type="button" id="copy">Copy</button></div>'+
    '<a class="crow" href="mailto:'+EMAIL+'"><b>Write an email</b><span class="v">opens your mail app ↗</span></a>'+
    '<a class="crow" href="https://www.linkedin.com/in/shaon-kanti-dhar"><b>LinkedIn</b><span class="v">/in/shaon-kanti-dhar ↗</span></a>'+
    '<a class="crow" href="https://leetcode.com/u/shaon_kanti/"><b>LeetCode</b><span class="v">shaon_kanti ↗</span></a>'+
    '<a class="crow" href="https://nstu-coding-planet.blogspot.com/"><b>Blog</b><span class="v">NSTU Code Academy ↗</span></a>'+
  '</div></div></div>';
}

/* ---------- router ---------- */
var ROUTES={cv:vCV, home:vHome, about:vAbout, research:vResearch, work:vWork, record:vRecord, recognition:vRecognition, contact:vContact};
var main=document.getElementById('main'), clockT=null, rotT=null;
function current(){var h=(location.hash||'').slice(1); return h||'home'}
function render(){
  var r=current(), p=PROJECTS.filter(function(x){return x.id===r})[0];
  var fn=ROUTES[r]||(p?function(){return vCase(p)}:null);
  if(!fn){r='home'; fn=vHome}
  var go=function(){
    main.innerHTML='<div class="view">'+fn()+'</div>';
    window.scrollTo(0,0);
    var top=p?'work':r;
    document.querySelectorAll('#nav a').forEach(function(a){a.toggleAttribute('aria-current',a.getAttribute('href')==='#'+top); if(a.getAttribute('href')==='#'+top) a.setAttribute('aria-current','page')});
    document.title=(p?p.name+' · ':r!=='home'?r.charAt(0).toUpperCase()+r.slice(1)+' · ':'')+'Shaon Kanti Dhar';
    closeMenu(); wire();
  };
  var done=false, run=function(){if(!done){done=true; go()}};
  if(!firstRender && document.startViewTransition && document.visibilityState==='visible' && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    try{document.startViewTransition(run)}catch(e){run()}
    setTimeout(run,400);
  } else run();
  firstRender=false;
}
var firstRender=true;
window.addEventListener('hashchange',render);

/* ---------- per-view wiring ---------- */
function wire(){
  clearInterval(clockT); clearInterval(rotT);
  /* floor plan */
  var tip=document.getElementById('tip');
  if(tip){
    var tt=document.getElementById('tip-t'), td=document.getElementById('tip-d'), ta=document.getElementById('tip-a');
    document.querySelectorAll('.room').forEach(function(g){
      var p=PROJECTS.filter(function(x){return x.id===g.dataset.id})[0];
      function hi(){document.querySelectorAll('.room').forEach(function(o){o.classList.toggle('on',o===g)}); tt.textContent=p.name; td.textContent=p.tagline; ta.href='#'+p.id}
      g.addEventListener('mouseenter',hi); g.addEventListener('focus',hi);
      g.addEventListener('click',function(){location.hash=p.id});
      g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault(); location.hash=p.id}});
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
var ALL=[['Home','Page','#home'],['About','Page','#about'],['Research','Page','#research'],['Work','Page','#work'],['Record','Page','#record'],['Recognition','Page','#recognition'],['Contact','Page','#contact'],['CV','Page','#cv']]
  .concat(PROJECTS.map(function(p){return [p.name,'Case study','#'+p.id]}))
  .concat([['Switch theme','Action',toggleTheme],['Copy email address','Action',copyEmail],['Open LinkedIn','Link','https://www.linkedin.com/in/shaon-kanti-dhar'],['Open LeetCode','Link','https://leetcode.com/u/shaon_kanti/']]);
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

/* ---------- scroll progress ---------- */
var pr=document.getElementById('progress');
addEventListener('scroll',function(){var h=document.documentElement; var m=h.scrollHeight-h.clientHeight; pr.style.width=(m>0?h.scrollTop/m*100:0)+'%'},{passive:true});

render();
