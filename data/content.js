/* Copyright (c) 2026 Shaon Kanti Dhar. All rights reserved. Not licensed for reuse, copying or derivative sites. Build ID SKD-74ed513e2a6c-2026. */
/*
  CONTENT FILE: edit this to change what the portfolio says.
  - PROJECTS: case studies (home floor plan uses the first five)
  - ARCHIVE: smaller projects in the records list
  - JOBS, CAPS: Record page (experience, capabilities)
  - CERTS, CONTESTS, AWARDS: Recognition page
  - NEWS: milestones, newest first
  - RESEARCH_AREAS: Research page interests
  Images live in assets/img/. Reference them as 'assets/img/name.webp'.
*/
/* ---------- content ---------- */
var EMAIL='shaonkantidhar07@gmail.com';
var PROJECTS=[
 {id:'smartthings-pro', n:'01', name:'SmartThings Pro', cat:'B2B IoT platform', status:'Live', live:true, role:'Project Leader', period:'Jun 2025 – now', org:'Samsung R&D Institute Bangladesh',
  tagline:'Building management for hotels, offices, stores and schools, now with an AI agent.',
  card:'assets/img/mapview.webp', cover:'assets/img/mapview.webp',
  hi:[['12', 'Engineers led'], ['Starbucks', 'AI agent deployed'], ['Kumho Resort', 'Installed, South Korea']],
  facts:[['12','engineers on the team I lead'],['Starbucks','runs the B2B AI agent'],['Kumho Resort','installed in South Korea']],
  overview:'SmartThings Pro is Samsung\'s IoT and building-management platform for businesses. It takes the SmartThings idea of connecting and automating devices into hotels, offices, shops, schools and apartment complexes, with central dashboards, multi-site management and energy features. I joined as Lead Engineer and now lead the project.',
  did:['Lead 12 engineers across frontend, backend, database and cloud services, and own the calls on architecture, API design, reliability and web performance.','Architected the SmartThings Pro B2B AI Agent and rolled it out to Starbucks.','Built the 3D Map View, multi-site management and the property dashboard for device statistics, usage and control.','Set up an AI-assisted development environment for the team, with internal workflows built on LLMs, RAG and tool integration.'],
  stack:['Vue.js','Three.js','Unity','Chart.js','Spring Boot','LLM agents','RAG','MCP'],
  gallery:[['assets/img/mapview.webp','Map View: 3D floor plan with live device markers','w6'],['assets/img/multisite.webp','Multi-site management on a city map','w3'],['assets/img/dashboard.webp','Property dashboard: device statistics, usage and control','w3'],['assets/img/stpro.webp','SmartThingsPro.AI sign-in','w6']],
  links:[['smartthingspro.ai','https://www.smartthingspro.ai/'],['Samsung product page','https://www.samsung.com/us/business/industries/smartthings-pro/']]},
 {id:'quality-agent', n:'02', name:'PQM Agent', short:'PQM Agent', cat:'AI agent · Engineering quality', status:'In use', role:'Designer & Developer', period:'Runs on every push', org:'Whole organization', l3:'Used by', l1:'Role', l2:'Runs', l4:'Status',
  metaLine:'AI agent · Engineering quality',
  tagline:'An agent that checks every commit for code quality, test results, architecture health and regressions, so developers can stay on features and releases.',
  card:'assets/img/pqm-product.svg', cover:'assets/img/pqm-product.svg',
  hi:[['4','Automatic checks'],['Every push','Starts a run'],['Whole org','Uses the agent']],
  facts:[['4','automatic checks on every commit: static analysis, unit tests, SAM and regression'],['Every push','starts a run, with nothing for the developer to remember or trigger'],['Whole org','every team is checked by the same agent and the same standard']],
  overview:'Keeping code quality up is a second job on top of the real one. Developers build features and ship releases, and quality checks get run late, by hand, or not at all. The PQM Agent (Process Quality Management) takes that work over. Whenever someone pushes a commit, it runs static analysis, runs the unit tests, measures the software architecture maturity (SAM) and checks that the new change has not caused a regression. It is used across the whole organization.',
  did:['Designed and built the PQM Agent, which starts by itself whenever a commit is pushed and needs no manual step from the developer.','Static analysis: scans the changed code for defects and rule violations before the change reaches review.','Unit tests: runs the project\'s unit tests against the new commit and reports what passed and what failed.','Software architecture maturity (SAM): measures the SAM score, so the health of the architecture is tracked on every change and not guessed at release time.','Regression check: compares the new commit with the earlier state, to catch a change that breaks something that used to work.','Rolled it out to the whole organization, so every team is held to the same checks and results can be compared across teams.'],
  flowsTitle:'One push, four checks',
  flows:[
   {n:'01', name:'Commit check', trigger:'Developer pushes a commit', steps:[['Commit pushed','The push starts the agent. No one has to run anything.'],['Collect the change','The agent picks up the commit and the files it touches.'],['Run the four checks','Static analysis, unit tests, SAM and the regression check each run on the change.'],['Build one report','The results of all four checks are put together into a single result.'],['Report to the developer','The developer sees the outcome straight after the push and can fix problems while the change is fresh.']]},
   {n:'02', name:'Regression check', trigger:'Every commit, compared with the earlier state', steps:[['Take the earlier state','What worked before the commit is the reference point.'],['Compare with the commit','The agent checks whether the new change altered behavior that used to work.'],['Flag regressions','Anything that broke is reported with the commit that caused it, before it can reach a release.']]}
  ],
  stack:['AI agent','Static analysis','Unit tests','SAM','Regression checks','Process quality management'],
  gallery:[['assets/img/pqm-product.svg','Product view: a commit pushed by shaon-kanti is checked live, with the agent log and results side by side. The commit and statuses are examples.','w6'],['assets/img/pqm-card.svg','Overview: every push starts four automatic checks and returns one report.','w6']],
  links:[]},
 {id:'enterprise-ai-assistant', n:'03', name:'Enterprise AI Assistant', short:'Enterprise AI Assistant', cat:'Enterprise AI assistant', status:'Initial release', role:'Architect & Lead Developer', period:'Jul 2025 – Mar 2026', org:'Enterprise AI platform',
  metaLine:'Agentic RAG · Enterprise AI',
  tagline:'An agentic RAG assistant that answers questions from an organization\'s documents and data, and cites the exact page.',
  card:'assets/img/enterprise-assistant-product.svg', cover:'assets/img/enterprise-assistant-product.svg',
  points:['Used by 500+ engineers across the organization','Answers grounded in documents, with page-level citations','Hybrid retrieval: vector and full-text search, merged and reranked','Role-aware access: each user sees only the data they may see'],
  overview:'Organizations keep their knowledge in long documents, and an answer is often split across several tables or files, so people spend time searching and asking the same questions again. The Enterprise AI Assistant is a chat assistant that answers from an organization\'s own documents and structured data, and shows where every answer came from. An AI agent plans focused searches, reads what it finds, searches again if it needs more, and only then writes a cited answer. I architected the platform end to end and led its development. It is now used by more than 500 engineers across the organization.',
  did:['Architected the platform end to end: a Next.js web app, a FastAPI service, PostgreSQL with pgvector, document storage, and open-weight models served with vLLM.','Built the agentic RAG pipeline. An agent plans focused searches, reads documents and structured data, repeats until it has the evidence, and streams an answer with numbered citations that open the exact page.','Designed hybrid retrieval: vector and full-text search merged with Reciprocal Rank Fusion, then rescored by a cross-encoder reranker. Table-aware chunking keeps tables intact, so questions that need two tables to answer, such as a rule in one and its exceptions in another, get answered.','Secured access by design: short-lived signed tokens between services, role-based permissions, and row-level rules so each user sees only the data they are allowed to see. Database queries are read-only, row-capped and time-limited.','Built document operations: PDF upload with duplicate detection, page preview, and an index status view that shows when documents change and need re-indexing.','Set the engineering standard: strict type checking and linting, a single migration history for the whole database, and more than 60 automated tests.','Rolled it out across the organization, where it is used by 500+ engineers.'],
  stack:['AI agents','RAG','Hybrid search','Reranking','vLLM','FastAPI','Next.js','PostgreSQL + pgvector'],
  gallery:[['assets/img/enterprise-assistant-product.svg','Product view: the assistant answers a refund-policy question from two documents and cites the pages. The conversation and files are examples.','w6'],['assets/img/enterprise-assistant-pipeline.svg','How the assistant answers: an agent plans searches, uses a document-search tool and a role-aware database tool, then streams a cited answer.','w6']],
  links:[]},
 {id:'lounge', n:'04', name:'Lounge', cat:'Retail Showroom Secured IoT Device Control', status:'IFA 2024 · CES 2025', role:'', period:'Apr 2024 – Dec 2025', org:'Samsung R&D Institute Bangladesh',
  tagline:'Walk up, scan a code, control real devices from your own phone. No app, no account.',
  card:'assets/img/ifa-lounge.webp', cover:'assets/img/ifa-lounge.webp',
  hi:[['0', 'Installs or accounts'], ['2', 'Trade shows: IFA, CES'], ['1', 'R&D Excellence Award']],
  facts:[['0','apps to install or accounts needed'],['2','world trade shows: IFA Berlin and CES Las Vegas'],['1','Samsung R&D Excellence Award']],
  overview:'Lounge is a web app for Samsung showrooms and trade shows. Visitors use their own phones to control SmartThings-connected devices and see how they work together. I was on the core development team from the start and later led the work.',
  decisions:[['No sign-in','Removing the Samsung account step meant anyone passing the booth could try it immediately.'],['Server-Sent Events','Device state is pushed to the phone, so the screen matches the real device.'],['Kotlin + Micronaut','A light JVM backend for device control and sessions.'],['Amazon Aurora','Managed relational storage behind the service.']],
  stack:['Next.js','Kotlin','Micronaut','Amazon Aurora','SSE','OAuth'],
  gallery:[['assets/img/ifa-lounge.webp','IFA 2024 Berlin: Lounge Web on the Samsung booth','w4'],['assets/img/lounge-phone.webp','Lounge on a visitor\'s phone','w2 tall'],['assets/img/ifa-control.webp','“Control the devices directly from visitors\' mobile without downloading an app”','w4'],['assets/img/ces.webp','CES 2025 Las Vegas: SmartThings on show','w6']],
  links:[['Live site','https://loungeweb.samsungiotcloud.com'],['IFA 2024 post','https://www.linkedin.com/feed/update/urn:li:activity:7238078863975534592/'],['CES 2025 post','https://www.linkedin.com/feed/update/urn:li:activity:7303798804804182016/']]},
 {id:'virtual-studio', n:'05', name:'Virtual Studio', cat:'Virtual IoT Showroom', status:'IFA 2024', role:'', period:'Apr 2024 – Mar 2025', org:'Samsung R&D Institute Bangladesh',
  tagline:'The SmartThings retail showroom for places with no devices and weak networks.',
  card:'assets/img/ifa-virtual.webp', cover:'assets/img/ifa-virtual.webp',
  hi:[['IFA 2024', 'Shown on Samsung booth'], ['Virtual', 'Devices, no hardware'], ['Energy', 'Service + Map View']],
  facts:[['Virtual','devices instead of real hardware'],['Energy','Service and Map View built in'],['IFA','2024 Berlin, shown on the Samsung booth']],
  overview:'Virtual Studio is built for online retail and for stores with limited network access. Instead of real hardware, visitors use virtual devices, with features like Energy Service and Map View, so they can understand SmartThings anywhere.',
  stack:['Next.js','Map View'],
  gallery:[['assets/img/ifa-virtual.webp','IFA 2024 Berlin: Virtual Studio on the Samsung booth','w6'],['assets/img/ifa-routine.webp','Routine sharing demo station','w6']],
  links:[['Live site','https://virtual.samsungiots.com']]},
 {id:'test-management', n:'06', name:'AI Test Management', short:'AI Test Management', cat:'AI test automation', status:'Shipped', role:'', period:'Dec 2023 – Jun 2024', org:'Samsung R&D Institute Bangladesh',
  tagline:'An LLM-based system that writes QA test cases from our UI/UX guide, then versions them through every cycle until release.',
  card:'assets/img/tms-product.svg', cover:'assets/img/tms-product.svg',
  hi:[['40+','QA engineers use it']],
  facts:[['40+','QA engineers in the organization use it']],
  overview:'Before an app goes to production, the organization\'s QA engineers test it. They write test cases from the product, run them, and then repeat the work every cycle: which issues were fixed, what must be re-tested, and what new problems appeared. That is slow and hard to keep organized. This project had two parts. The first was AI: I fine-tuned a model on our application\'s UI and UX guide so that it could write test cases from it. The second was the system around the model, built with an LLM, which keeps every test case versioned and follows it through the full cycle until release. It is used by more than 40 QA engineers.',
  did:['Fine-tuned a model on our application\'s UI and UX guide, so it learns how the product should look and behave.','Generated test cases directly from the UI/UX guide, replacing the first draft QA engineers would otherwise write by hand.','Built the system around the model with an LLM, covering how test cases are created, stored and updated.','Added versioning: every test case and every change to it is kept, so a team can see what was tested in which cycle.','Followed the full cycle until release: tests, fixes, re-tests and new issues stay linked to the same test case.'],
  flowsTitle:'Two parts, one system',
  flows:[
   {n:'01', name:'AI: test-case generation', trigger:'A new or updated UI/UX guide', steps:[['Collect the guide','The application\'s UI and UX guide is the training and reference material.'],['Fine-tune the model','The model is tuned on the guide, so it knows our screens, components and rules.'],['Generate test cases','For each screen or rule, the model writes test cases with steps and expected results.'],['Hand over to the system','The generated test cases go into the system as the first version.']]},
   {n:'02', name:'System: versions and release cycle', trigger:'Test cases ready for a release', steps:[['Store the test cases','Each test case is saved with its source section of the guide.'],['Version every change','An edit creates a new version, and older versions stay available.'],['Run a test cycle','QA engineers run the test cases and record the results.'],['Track issues and fixes','Failed tests, fixes and re-tests stay linked to the same test case.'],['Re-test and release','The cycle repeats until the tests pass, and the full history is kept at release.']]}
  ],
  stack:['LLM','Model fine-tuning','Test-case generation','Versioning','UI/UX guidelines','QA process'],
  gallery:[['assets/img/tms-product.svg','Product view: test cases generated from a UI/UX guide section, with a versioned release cycle. The contents are examples.','w6']],
  links:[]},
 {id:'5g-network-visualization', n:'07', name:'5G Network Data Visualization', short:'5G Network', cat:'5G network analytics', status:'5G networks', role:'', period:'Oct 2019 – Mar 2022', org:'Samsung R&D Institute Bangladesh', l4:'Domain',
  tagline:'Interactive web views that turn Samsung 5G network data into something people can see, explore and act on.',
  card:'assets/img/fiveg-product.svg', cover:'assets/img/fiveg-product.svg',
  points:['Turned raw 5G network data into interactive views','Built both the React frontend and the REST APIs','Worked full stack, from MySQL and MongoDB to the screen'],
  overview:'A 5G network produces a huge amount of data, and numbers in a table are hard for people to read. This project made that data visible. I built web apps that present Samsung 5G network data through interactive views, so engineers can look at the network, spot what stands out and dig into it. I worked on both sides: the React components people see and the REST APIs that deliver the data to them.',
  did:['Built the frontend components that turn raw 5G network data into interactive charts and views.','Built the backend REST APIs that serve the network data to those views, with Spring Boot.','Worked across the full stack, from the data stores (MySQL and MongoDB) to the screen in React.','Used Protocol Buffers to exchange network data between services in a compact format.'],
  stack:['React','Spring Boot','REST API','MySQL','MongoDB','Protocol Buffers'],
  gallery:[['assets/img/fiveg-product.svg','Illustration: a 5G network map with a selected cell and trend panels. The picture is an example and contains no real data.','w6']],
  links:[['Samsung Networks','https://www.samsung.com/global/business/networks/our-business/networks-business-overview/']]}
];
var ARCHIVE=[
 {n:'08', name:'Travel Assistant', sub:'NSTU · Oct 2018 – May 2019', role:'Final-year project', text:'An Android app for sharing trips. It checks uploaded photos with Firebase ML Kit and Microsoft\'s content moderation API, shows nearby hospitals, ATMs and police stations through Google APIs, lists tourist spots by district, and gives a 5-day weather forecast.', stack:['Java','Firebase','OpenCV','Google APIs','PHP & MySQL'], links:[['Project report','https://drive.google.com/file/d/1Dq82T5FAXLuBrWfTkniQ3sxqkyNYSYFE/']]},
 {n:'09', name:'Online Food Order & Review', sub:'NSTU · Mar – Jul 2018', role:'Course project', text:'An Android app for ordering from a restaurant menu by category, tracking order status and rating dishes out of five. The ratings feed each dish\'s overall score.', stack:['Java','JavaScript','Firebase','JSON','PHP & MySQL'], links:[]}
];
var JOBS=[
 {when:'Dec 2025 – now', where:'Dhaka · On-site', title:'Project Leader', org:'Samsung R&D Institute Bangladesh', orgUrl:'https://research.samsung.com/srbd', proj:'SmartThings Pro',
  pts:['Lead a team of 12 engineers across frontend, backend, database and cloud services.','Designed and built the PQM Agent, an AI-driven SQE solution that checks every pushed commit and saves 30% of release time, so products reach the market faster. It is used across the whole organization.','Architected the SmartThings Pro B2B AI Agent and rolled it out to Starbucks.','Achieved a 15% improvement in load time and rendering speed on the SmartThings Pro platform by introducing request parallelization, client-side caching, query orchestration, list virtualization and real-time update processing.','Set up an AI-assisted development environment and internal workflows using LLMs, RAG and tool integration.'],
  sk:['Technical project leadership','Vue.js','Front-end development','Backend development','Spring Boot']},
 {when:'Mar 2025 – Dec 2025', where:'Dhaka · On-site', title:'Lead Engineer', org:'Samsung R&D Institute Bangladesh', orgUrl:'https://research.samsung.com/srbd', proj:'Lounge, Virtual Studio, SmartThings Pro',
  pts:['Led 2 SmartThings retail web apps, Lounge and Virtual Studio, that let visitors control SmartThings devices at Samsung showrooms and trade shows.','Architected and led the development of an enterprise agentic RAG assistant that answers questions from documents and data, with page-level citations and role-based access. Used by 500+ engineers across the organization.','Owned application architecture, API integration and real-time device interaction.','Built SmartThings Pro\'s Map View, multi-site management and property dashboard.'],
  sk:['Agentic RAG','Three.js','Unity','Next.js','Kotlin','Micronaut']},
 {when:'Mar 2022 – Mar 2025', where:'Dhaka · On-site', title:'Senior Software Engineer', org:'Samsung R&D Institute Bangladesh', orgUrl:'https://research.samsung.com/srbd', proj:'AI Test Management',
  pts:['Built an AI test-management system: fine-tuned a model on our UI/UX guide to generate QA test cases, and built the LLM-based system that versions them through the full release cycle. Used by 40+ QA engineers.','Applied the automated test procedure successfully in 60+ projects across the organization.'],
  sk:['LLM fine-tuning','AI test automation','Test-case generation','Java','React.js','Spring Boot','MySQL']},
 {when:'Oct 2019 – Mar 2022', where:'Dhaka · On-site', title:'Software Engineer', org:'Samsung R&D Institute Bangladesh', orgUrl:'https://research.samsung.com/srbd', proj:'5G Network Data Visualization',
  pts:['Built the React web apps and Spring Boot REST APIs that turn Samsung 5G network data into interactive views engineers can explore.'],
  sk:['Java','Spring Boot','React','MySQL','MongoDB','Microservices']},
 {when:'Feb 2016 – Oct 2019', where:'Noakhali · Self-employed', title:'Technical Content Writer', org:'NSTU Code Academy', orgUrl:'https://nstu-coding-planet.blogspot.com/', proj:'Competitive programming blog',
  pts:['Wrote hints and solutions for online judge problems and plain explanations of algorithms.'], sk:['Algorithms','Competitive programming']},
 {when:'Aug 2018', where:'Dhaka · Internship', title:'Software Engineering Intern', org:'Opus Technology Limited', orgUrl:'https://drive.google.com/file/d/1_R2xgnXgm8fviO5-jDCDv39_bnRxcr-W/view', proj:'Industrial attachment',
  pts:['Learned how client projects are proposed, run and delivered, then designed and built the base of an Android app with its UI and a Firebase Realtime Database.'], sk:['Android','Java','Firebase']}
];
var CAPS=[
 ['Languages',['TypeScript','Java','Kotlin','Python']],
 ['Frontend',['Vue.js','React','Next.js','Three.js','Unity 3D']],
 ['Backend',['Spring Boot','FastAPI','Micronaut','Spring Data / JPA','Microservices','SSE','OAuth','Event-driven systems']],
 ['AI engineering',['LLM applications','Agent workflows','LangChain','RAG','Hybrid search & reranking','vLLM','Text-to-SQL','Tool / MCP integration']],
 ['Data & infrastructure',['PostgreSQL','pgvector','MySQL','MongoDB','Amazon Aurora','Redis','RabbitMQ','Elasticsearch','Docker','Nginx','Jenkins','AWS']]
];
var CERTS=[
 ['Samsung Global Software Certificate, Professional','Samsung Electronics · Feb 2022',null],
 ['Samsung Global Software Certificate, Advanced','Samsung Electronics · Oct 2019',null],
];
var CONTESTS=[
 ['1st runner-up','Intra University Programming Contest 2016, NSTU'],
 ['Problem setter','Intra University Programming Contest 2018 and 2019, NSTU'],
 ['Vice President','ICE Programming Club, NSTU, and mentor to junior programmers']
];

var POST_HALF='https://www.linkedin.com/posts/shaon-kanti-dhar_half-yearly-achievement-ugcPost-7239649500334583808-jtqq/';
var POST_CES='https://www.linkedin.com/feed/update/urn:li:activity:7303798804804182016/';
var POST_ICON22='https://www.linkedin.com/posts/shaon-kanti-dhar_i-was-awarded-as-icon-of-the-month-for-mar-share-6980531423698964480-YvRd/';
var AWARDS=[
 {name:'Excellence Award', period:'Jan – Mar 2025', note:'For my research work on missed-speech recovery for voice calls and on Bluetooth multipoint security.', img:'assets/img/award-2025-q1.webp'},
 {name:'Excellence Award', period:'Oct – Dec 2024', note:'For my work on Next SmartThings and Lounge, which Samsung showed at CES 2025 in Las Vegas.', img:'assets/img/award.webp', link:POST_CES},
 {name:'Icon Award', period:'May – Jun 2024', note:'For my work on Virtual Studio, the SmartThings retail showroom for places with no devices and weak networks.', img:'assets/img/icon-2024.webp', link:POST_HALF},
 {name:'Excellence Award', period:'Jan – Mar 2024', note:'For my work on AI Test Management: fine-tuning a model on our UI/UX guide so it writes QA test cases, and building the system that versions them through the release cycle.', img:'assets/img/award-2024-q1.webp', link:POST_HALF},
 {name:'Icon of the Month', period:'Mar – Apr 2022', note:'For building major features of an internal tool used by Samsung teams.', img:'assets/img/icon-2022-framed.webp', link:POST_ICON22},
 {name:'Excellence Award', period:'Apr – Jun 2020', note:'For my work on 5G Network Data Visualization, the web apps and APIs that present Samsung 5G network data.', img:'assets/img/award-2020-q2.webp'}
];
var NEWS=[
 ['Dec 2025','Promoted to Project Leader on SmartThings Pro, leading 12 engineers.'],
 ['Dec 2025 – now','Built the PQM Agent, an AI-driven SQE solution that saves 30% of release time across the organization.'],
 ['Aug 2025','Co-inventor on a Samsung patent for reducing light flicker in multi-camera video recording.'],
 ['Jul 2025 – Mar 2026','Architected and built an enterprise agentic RAG assistant, now used by 500+ engineers.'],
 ['Mar 2025','Promoted to Lead Engineer.'],
 ['Jan – Mar 2025','Excellence Award for research on missed-speech recovery and Bluetooth multipoint security.'],
 ['Jan 2025','Lounge shown at CES 2025 in Las Vegas.'],
 ['Oct – Dec 2024','Excellence Award for Next SmartThings and Lounge.'],
 ['Sep 2024','Lounge and Virtual Studio shown at IFA 2024 in Berlin.'],
 ['May – Jun 2024','Icon Award for Virtual Studio, the SmartThings retail showroom.'],
 ['Jan – Mar 2024','Excellence Award for AI Test Management, now used by 40+ QA engineers.'],
 ['Mar 2022','Promoted to Senior Software Engineer.'],
 ['Feb – Mar 2022','Co-inventor on a Samsung patent that separates intentional from accidental touches on wireless earbuds.'],
 ['Oct 2019','Joined Samsung R&D Institute Bangladesh as a Software Engineer.']
];

var RESEARCH_AREAS=[['Security & Privacy','IoT security, AR/VR security, authentication and privacy.'],['Artificial Intelligence','AI agents, large language models, speech and audio processing, and edge AI.'],['Sensing & Interaction','Wearable sensing, context awareness and human–device interaction.'],['Imaging & Media','Computational imaging, video processing and multimedia systems.']];

/* Academic documents. Only the redacted copies in assets/img/acad-*.webp are published
   (date of birth, parents' names and ID, roll, registration and serial numbers are blacked out).
   The original scans stay local and are git-ignored. */
var ACADEMIC=[
 {inst:'Noakhali Science and Technology University', what:'B.Sc. in Information and Communication Engineering', when:'2015 – 2019', score:'CGPA 3.51 / 4.00', docs:[
  ['assets/img/acad-nstu-provisional.webp','Provisional certificate','Provisional certificate, B.Sc. (Engineering), NSTU'],
  ['assets/img/acad-nstu-grade-conversion.webp','Grade-to-mark conversion','Grade to mark conversion certificate, NSTU'],
  ['assets/img/acad-nstu-result-date.webp','Result publication','Certificate for the date of result publication, NSTU'],
  ['assets/img/acad-nstu-transcript-1.webp','Transcript · page 1 of 5','Academic transcript, NSTU, page 1 of 5'],
  ['assets/img/acad-nstu-transcript-2.webp','Transcript · page 2 of 5','Academic transcript, NSTU, page 2 of 5'],
  ['assets/img/acad-nstu-transcript-3.webp','Transcript · page 3 of 5','Academic transcript, NSTU, page 3 of 5'],
  ['assets/img/acad-nstu-transcript-4.webp','Transcript · page 4 of 5','Academic transcript, NSTU, page 4 of 5'],
  ['assets/img/acad-nstu-transcript-5.webp','Transcript · page 5 of 5','Academic transcript, NSTU, page 5 of 5']]},
 {inst:'Feni Government College', what:'Higher Secondary Certificate (HSC), Science', when:'2014', score:'GPA 4.80 / 5.00', docs:[
  ['assets/img/acad-hsc-certificate.webp','Certificate','HSC certificate, Feni Government College, 2014'],
  ['assets/img/acad-hsc-transcript.webp','Transcript','HSC academic transcript, Feni Government College, 2014']]},
 {inst:'Feni Government Pilot High School', what:'Secondary School Certificate (SSC), Science', when:'2012', score:'GPA 5.00 / 5.00', docs:[
  ['assets/img/acad-ssc-certificate.webp','Certificate','SSC certificate, Feni Government Pilot High School, 2012'],
  ['assets/img/acad-ssc-transcript.webp','Transcript','SSC academic transcript, Feni Government Pilot High School, 2012']]}
];

/* Research and patents, newest first. Rendered on the Research page and read by the chatbot. */
var RESEARCH=[
 {title:'Method to reduce light flicker while recording video', kind:'patent', desc:'Syncs camera settings to cut light flicker when recording with several cameras at once.', tags:['Computational imaging','Video processing','Camera synchronization'], date:'Aug 2025'},
 {title:'Missed-speech recovery for voice calls', desc:'Detects when parts of a call are lost to disconnection, poor audio or noise, and recovers the missed speech so the conversation continues without gaps.', tags:['Speech processing','Multimodal sensing','Audio signal processing'], date:'Mar 2025'},
 {title:'A method to increase security when using Bluetooth multipoint', desc:'When earbuds are shared or connected to several devices, calls and private notifications can reach the wrong listener. I proposed rating each earbud\'s trust from the wearer\'s voice and each sound\'s sensitivity, so private audio only plays in a trusted earbud.', tags:['Bluetooth multipoint','Voice biometrics','Audio classification','NLP'], date:'Dec 2024'},
 {title:'Shoulder-surfing defence for VR typing', desc:'Stops attackers from recovering VR passwords by filming hand movements. The virtual keyboard moves, tilts or resizes every few keystrokes within the user\'s comfortable reach, and a security mode adapts to the surroundings.', tags:['AR/VR','Authentication','HMD security'], date:'May – Aug 2024'},
 {title:'Context-aware authentication against fraud', desc:'An authentication framework that senses behaviour and context, uses an LLM to spot deceptive or coerced situations, and raises security step by step to block fraudulent authorization.', tags:['Authentication','Behavioral biometrics','LLM threat detection'], date:'Feb – Apr 2024'},
 {title:'Conversational Q&A on audio media', desc:'A framework that answers questions about audio buried in documents and web pages. It extracts the audio, transcribes it with Whisper and answers with GPT-3.5, so meetings, lectures and podcasts become searchable by asking.', tags:['Automatic speech recognition','Large language models','Conversational QA','Audio understanding'], date:'Jan 2024'},
 {title:'Overexertion warning for wearables', desc:'A smartwatch feature that warns users before they over-exercise. It estimates blood lactate with optical sensing instead of bulky sweat pads, and checks heart rate, temperature, motion, sleep and food intake to avoid false alarms.', tags:['Optical sensing','Lactate','Context awareness','Wearables'], date:'Dec 2023'},
 {title:'Wearable device and control method therefor', kind:'patent', desc:'Uses sensor data to separate intentional touches from accidental ones on wireless earbuds.', tags:['Wearable sensing','Intent recognition','Touch interaction','Earbuds'], date:'Feb – Mar 2022', href:'https://patents.google.com/patent/US20230229260A1/en'}
];
