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
  facts:[['12','engineers on the team I lead'],['Starbucks','runs the B2B AI agent'],['Kumho Resort','installed in South Korea']],
  overview:'SmartThings Pro is Samsung\'s IoT and building-management platform for businesses. It takes the SmartThings idea of connecting and automating devices into hotels, offices, shops, schools and apartment complexes, with central dashboards, multi-site management and energy features. I joined as Lead Engineer and now lead the project.',
  did:['Lead 12 engineers across frontend, backend, database and cloud services, and own the calls on architecture, API design, reliability and web performance.','Architected the SmartThings Pro B2B AI Agent and rolled it out to Starbucks.','Built the 3D Map View, multi-site management and the property dashboard for device statistics, usage and control.','Set up an AI-assisted development environment for the team, with internal workflows built on LLMs, RAG and tool integration.'],
  decisions:[['Request parallelization','Independent API calls go out together instead of one after another.'],['Client-side caching','Data the screen already has is reused instead of fetched again.'],['Query orchestration','Related queries are coordinated so pages load in a sensible order.'],['List virtualization','Long device lists render only the rows on screen.'],['Real-time updates','Device state changes stream in and update the view as they happen.']],
  stack:['Vue.js','Three.js','Unity','Chart.js','Spring Boot','LLM agents','RAG','MCP'],
  gallery:[['assets/img/mapview.webp','Map View: 3D floor plan with live device markers','w6'],['assets/img/multisite.webp','Multi-site management on a city map','w3'],['assets/img/dashboard.webp','Property dashboard: device statistics, usage and control','w3'],['assets/img/stpro.webp','SmartThingsPro.AI sign-in','w6']],
  links:[['smartthingspro.ai','https://www.smartthingspro.ai/'],['Samsung product page','https://www.samsung.com/us/business/industries/smartthings-pro/']]},
 {id:'quality-agent', n:'02', name:'Code Quality Agent', short:'Quality Agent', cat:'AI agent · Developer workflow', status:'3 flows', role:'One agent, three triggers', period:'Monthly · hourly · always on', org:'GitHub, email, Quality Dashboard, TEM documents', l3:'Connects to', l1:'Design', l2:'Runs', l4:'Flows',
  tagline:'One agent that raises our code-quality scores every month and follows its own pull requests through review.',
  card:'assets/img/agent-product.webp', cover:'assets/img/agent-product.webp',
  facts:[['3','triggers: a monthly schedule, GitHub events, and an always-on check'],['3','pull requests a month, one each for SAM, TEM and CQM'],['5.00','minimum CQM score, with no critical or major issues, before a PR can open']],
  overview:'Keeping code-quality scores up usually means someone has to remember to run the tools, fix the code, open pull requests and chase reviewers. This agent does that work. Once a month it opens fix-up pull requests for three quality measures, SAM, TEM and CQM. It then follows each pull request through review until it is merged and the results are published. A third flow checks that every team member does enough code reviews.',
  did:['Designed one agent with three triggers. All three share one state store and one connector layer.','Monthly build: after day 20, an orchestrator checks for open pull requests. For each measure it creates a branch, runs the tool, fixes code to raise the score and opens a pull request for a human reviewer.','Review lifecycle: GitHub webhooks plus an hourly re-poll. It emails a reviewer once a day until they act, fixes each review thread with one commit and re-runs the pull request\'s own gate so the score cannot drop.','Escalation: after three rounds on one thread, or a change it must not make, the agent stops auto-fixing. It comments asking for direction and emails the reviewer and the lead.','After merge it publishes scores, reports and build files to the Quality Dashboard and updates the TEM documents with attachments.','Compliance: it reads each member\'s code-review count. Anyone with 4 or fewer reviews gets one email a day until they pass, and every change in the count goes straight to the dashboard.'],
  decisionsTitle:'Shared runtime',
  decisionsIntro:'Every flow reads and writes the same state. That is what keeps three promises true: one email per day, no duplicate pull requests and no double publish.',
  decisions:[['Run state','The month, which pull requests exist and where the last run stopped.'],['Daily-send log','Recipient, pull request and date, so each person gets one email a day whatever the poll rate.'],['Round counters','Fix rounds per pull request and per thread, plus the last comment already handled.'],['Repo workspace and code fixer','Clone, edit, run SAM, tests or CQM, then commit. Shared by the build and review flows.'],['Audit log','Every commit, email, publish and escalation, with a timestamp.']],
  flows:[
   {n:'01', name:'Monthly build', trigger:'Schedule · monthly, after day 20', steps:[['Orchestrator','Works out the current month and loads the run state.'],['Check for open PRs','If PRs for SAM, TEM or CQM are already open, nothing new is branched and Flow 02 finishes them.'],['Create branches','One per measure: sam-, tem- and cqm- plus the month.'],['Run the tools','SAM reads the score, unit tests give the TEM score, CQM runs on GitHub and lists issues.'],['Fix the code','Changes code and tests to raise each score. CQM must reach 5.00 with no critical or major issues.'],['Open pull requests','Pushes and opens three PRs, all waiting on a human reviewer.']]},
   {n:'02', name:'Review lifecycle', trigger:'GitHub webhook, plus hourly re-poll', steps:[['Read review state','Reads review status and checks for each PR.'],['No review yet','Emails the reviewer once a day until they act.'],['Changes requested','Reads every thread and sorts it: fix, reply or out of scope. Fixes on the same branch, one commit per thread.'],['Re-run the gate','Runs the PR\'s own check again. The score must not drop. If it fails, it fixes again.'],['Escalate','At round 3, or for a change it must not make, it stops, asks for direction and emails the reviewer and lead.'],['Approved, not merged','Sends the approver a daily nudge to merge.'],['Merged','Publishes results and build files to the Quality Dashboard and updates TEM documents.']]},
   {n:'03', name:'Compliance', trigger:'Always on · review activity checked continuously', steps:[['Read review counts','Reads each member\'s code-review count.'],['More than 4 reviews?','Yes: compliant, no email. No: one email a day until the count passes 4.'],['Count changed','Pushes the new count to the dashboard straight away, in parallel.']]}
  ],
  stack:['AI agent','GitHub webhooks','Scheduled jobs','Email','SAM','TEM','CQM','Quality Dashboard'],
  gallery:[['assets/img/agent-product.webp','Product view: one month of the agent\'s work. Statuses are examples.','w6'],['assets/img/agent-flows.webp','Architecture diagram: one agent, three triggers, one shared runtime','w6']],
  links:[]},
 {id:'lounge', n:'03', name:'Lounge', cat:'Showroom web app', status:'IFA 2024 · CES 2025', role:'Core team, then Lead Engineer', period:'Apr 2024 – Dec 2025', org:'Samsung R&D Institute Bangladesh',
  tagline:'Walk up, scan a code, control real devices from your own phone. No app, no account.',
  card:'assets/img/ifa-lounge.webp', cover:'assets/img/ifa-lounge.webp',
  facts:[['0','apps to install or accounts needed'],['2','world trade shows: IFA Berlin and CES Las Vegas'],['1','Samsung R&D Excellence Award']],
  overview:'Lounge is a web app for Samsung showrooms and trade shows. Visitors use their own phones to control SmartThings-connected devices and see how they work together. I was on the core development team from the start and later led the work.',
  did:['Owned the application architecture, API integration and real-time device interaction across frontend and backend services.','Made the experience work without a Samsung account, so any visitor could try the devices on the spot.','Shipped it for IFA 2024 in Berlin and CES 2025 in Las Vegas.','The work earned a Samsung R&D Excellence Award.'],
  decisions:[['No sign-in','Removing the Samsung account step meant anyone passing the booth could try it immediately.'],['Server-Sent Events','Device state is pushed to the phone, so the screen matches the real device.'],['Kotlin + Micronaut','A light JVM backend for device control and sessions.'],['Amazon Aurora','Managed relational storage behind the service.']],
  stack:['Next.js','Kotlin','Micronaut','Amazon Aurora','SSE','OAuth'],
  gallery:[['assets/img/ifa-lounge.webp','IFA 2024 Berlin: Lounge Web on the Samsung booth','w4'],['assets/img/lounge-phone.webp','Lounge on a visitor\'s phone','w2 tall'],['assets/img/ifa-control.webp','“Control the devices directly from visitors\' mobile without downloading an app”','w4']],
  links:[['Live site','https://loungeweb.samsungiotcloud.com'],['IFA 2024 post','https://www.linkedin.com/feed/update/urn:li:activity:7238078863975534592/'],['CES 2025 post','https://www.linkedin.com/feed/update/urn:li:activity:7303798804804182016/']]},
 {id:'virtual-studio', n:'04', name:'Virtual Studio', cat:'Retail demo', status:'IFA 2024', role:'Lead Engineer', period:'Apr 2024 – Mar 2025', org:'Samsung R&D Institute Bangladesh',
  tagline:'The SmartThings showroom for places with no devices and weak networks.',
  card:'assets/img/ifa-virtual.webp', cover:'assets/img/ifa-virtual.webp',
  facts:[['Virtual','devices instead of real hardware'],['Energy','Service and Map View built in'],['IFA','2024 Berlin, shown on the Samsung booth']],
  overview:'Virtual Studio is built for online retail and for stores with limited network access. Instead of real hardware, visitors use virtual devices, with features like Energy Service and Map View, so they can understand SmartThings anywhere.',
  did:['Led the web app as Lead Engineer.','Built the virtual device experience, Energy Service and Map View for retail and online use.','Shown next to Lounge on the Samsung booth at IFA 2024 in Berlin.'],
  decisions:[['Virtual devices','No dependency on physical hardware or a stable connection at the store.'],['Shared building blocks','Map View and energy features line up with the rest of the SmartThings family.']],
  stack:['Next.js','Virtual devices','Energy Service','Map View'],
  gallery:[['assets/img/ifa-virtual.webp','IFA 2024 Berlin: Virtual Studio on the Samsung booth','w6'],['assets/img/ifa-routine.webp','Routine sharing demo station','w6']],
  links:[['Live site','https://virtual.samsungiots.com']]},
 {id:'test-management', n:'05', name:'Test Management', cat:'Internal platform', status:'Shipped', role:'Senior Software Engineer', period:'Jun 2023 – Dec 2023', org:'Samsung R&D Institute Bangladesh',
  tagline:'One place for QA teams to store test cases, plan runs and estimate effort.',
  card:'assets/img/tms-cases.webp', cover:'assets/img/tms-cases.webp',
  facts:[['7','teams used it'],['35','QA engineers'],['3','core features: repository, plans, estimates']],
  overview:'A test management platform in the spirit of Test Collab, built to help development teams test effectively and avoid functional and compliance failures.',
  did:['Built a centralized test repository for each team.','Built collaborative test plans that several people can work on together.','Built test-effort estimation, so leads can see how much QA time a plan needs.'],
  decisions:[['Spring Boot services','REST APIs and Spring Data on a microservice layout.'],['React front end','Fast editing of large test-case lists and suites.'],['MySQL','Relational storage for suites, cases, plans and runs.']],
  stack:['React.js','Spring Boot','Spring Data','REST API','Microservices','MySQL','Tomcat','Nginx'],
  gallery:[['assets/img/tms-cases.webp','Test case repository with suite tree','w3'],['assets/img/tms-detail.webp','Test case detail with custom fields','w3']],
  links:[['Test Collab, for reference','https://testcollab.io/']]}
];
var ARCHIVE=[
 {n:'06', name:'5G Network Data Visualization', sub:'Samsung · 2019 – 2022', role:'Software Engineer', text:'Web apps that present Samsung 5G network data through interactive views. I built the frontend components and the backend REST APIs.', stack:['Spring Boot','React','MySQL','MongoDB','Protocol Buffers'], links:[['Samsung Networks','https://www.samsung.com/global/business/networks/our-business/networks-business-overview/']]},
 {n:'07', name:'Atlassian Jira Plugin', sub:'Samsung · Mar – Apr 2022', role:'Software Engineer', text:'Built major features for an Atlassian Jira plugin used at Samsung. This work earned the Icon of the Month award for March and April 2022.', stack:['Atlassian Jira','Plugin development'], links:[['LinkedIn post','https://www.linkedin.com/posts/shaon-kanti-dhar_i-was-awarded-as-icon-of-the-month-for-mar-share-6980531423698964480-YvRd/']]},
 {n:'08', name:'Travel Assistant', sub:'NSTU · Oct 2018 – May 2019', role:'Final-year project', text:'An Android app for sharing trips. It checks uploaded photos with Firebase ML Kit and Microsoft\'s content moderation API, shows nearby hospitals, ATMs and police stations through Google APIs, lists tourist spots by district, and gives a 5-day weather forecast.', stack:['Java','Firebase','OpenCV','Google APIs','PHP & MySQL'], links:[['Project report','https://drive.google.com/file/d/1Dq82T5FAXLuBrWfTkniQ3sxqkyNYSYFE/']]},
 {n:'09', name:'Online Food Order & Review', sub:'NSTU · Mar – Jul 2018', role:'Course project', text:'An Android app for ordering from a restaurant menu by category, tracking order status and rating dishes out of five. The ratings feed each dish\'s overall score.', stack:['Java','JavaScript','Firebase','JSON','PHP & MySQL'], links:[]}
];
var JOBS=[
 {when:'Dec 2025 – now', where:'Dhaka · On-site', title:'Project Leader', org:'Samsung R&D Institute Bangladesh', orgUrl:'https://research.samsung.com/srbd', proj:'SmartThings Pro',
  pts:['Lead a team of 12 engineers across frontend, backend, database and cloud services.','Architected the SmartThings Pro B2B AI Agent and rolled it out to Starbucks.','Introduced request parallelization, client-side caching, query orchestration, list virtualization and real-time update processing.','Set up an AI-assisted development environment and internal workflows using LLMs, RAG and tool integration.'],
  sk:['Technical project leadership','Team management','Vue.js','Front-end development']},
 {when:'Mar 2025 – Dec 2025', where:'Dhaka · On-site', title:'Lead Engineer', org:'Samsung R&D Institute Bangladesh', orgUrl:'https://research.samsung.com/srbd', proj:'Lounge, Virtual Studio, SmartThings Pro',
  pts:['Led the web apps that let visitors control SmartThings devices at Samsung showrooms and trade shows.','Owned application architecture, API integration and real-time device interaction.','Built SmartThings Pro\'s Map View, multi-site management and property dashboard.'],
  sk:['Three.js','Unity','Next.js','Kotlin','Micronaut']},
 {when:'Mar 2022 – Mar 2025', where:'Dhaka · On-site', title:'Senior Software Engineer', org:'Samsung R&D Institute Bangladesh', orgUrl:'https://research.samsung.com/srbd', proj:'Test Management System',
  pts:['Built the Test Management System, used by 7 teams and 35 QA engineers.','Designed and built web software across the full lifecycle, from requirements to deployment, mainly in Java and TypeScript.'],
  sk:['Java','React.js','Spring Boot','MySQL','MongoDB','Microservices','Data migration','Perforce','Jenkins','Nginx','Design patterns']},
 {when:'Oct 2019 – Mar 2022', where:'Dhaka · On-site', title:'Software Engineer', org:'Samsung R&D Institute Bangladesh', orgUrl:'https://research.samsung.com/srbd', proj:'5G Network Data Visualization',
  pts:['Built web apps and REST APIs that present Samsung 5G network data through interactive views.','Built internal web apps with Spring Boot, React, MySQL, MongoDB, Protocol Buffers and Helix Perforce.'],
  sk:['Java','Spring Boot','Spring MVC','Spring Data','JPA','JUnit','MySQL','Git']},
 {when:'Feb 2016 – Oct 2019', where:'Noakhali · Self-employed', title:'Technical Content Writer', org:'NSTU Code Academy', orgUrl:'https://nstu-coding-planet.blogspot.com/', proj:'Competitive programming blog',
  pts:['Wrote hints and solutions for online judge problems and plain explanations of algorithms.'], sk:['Algorithms','Competitive programming']},
 {when:'Aug 2018', where:'Dhaka · Internship', title:'Software Engineering Intern', org:'Opus Technology Limited', orgUrl:'https://drive.google.com/file/d/1_R2xgnXgm8fviO5-jDCDv39_bnRxcr-W/view', proj:'Industrial attachment',
  pts:['Learned how client projects are proposed, run and delivered, then designed and built the base of an Android app with its UI and a Firebase Realtime Database.'], sk:['Android','Java','Firebase']}
];
var CAPS=[
 ['Languages',['TypeScript','Java','Kotlin','Python']],
 ['Frontend',['Vue.js','React','Next.js','Three.js','Unity 3D','Pinia','TanStack Query','Chart.js']],
 ['Backend',['Spring Boot','Micronaut','Spring MVC','Spring Data / JPA','REST APIs','Microservices','SSE','OAuth','Event-driven systems']],
 ['AI engineering',['LLM applications','Agent workflows','LangChain','RAG','Text-to-SQL','Tool / MCP integration']],
 ['Data & infrastructure',['PostgreSQL','MySQL','MongoDB','Amazon Aurora','Redis','RabbitMQ','Elasticsearch','Docker','Nginx','Jenkins','AWS']],
 ['Practice',['Technical project leadership','Team management','Full-stack architecture','Web performance','Design patterns','JUnit','Git / Perforce']]
];
var CERTS=[
 ['Samsung Global Software Certificate, Professional','Samsung Electronics · Feb 2022',null],
 ['Samsung Global Software Certificate, Advanced','Samsung Electronics · Oct 2019',null],
 ['Learning MongoDB','LinkedIn Learning · May 2022','https://www.linkedin.com/learning/certificates/ae235bd554bf3de1e3ea7580e0a6c1b564389a71c4d486499d23dc95d1adbd42/'],
 ['React.js Essential Training','LinkedIn Learning · May 2022','https://www.linkedin.com/learning/certificates/608f6aee0bb2d35b18fb41ccbcd2c9575434ab1e366926b0a825cf3cdce0b3b2/'],
 ['Learning Full-Stack JavaScript Development: MongoDB, Node, and React','LinkedIn Learning · Apr 2022','https://www.linkedin.com/learning/certificates/a7220cc09f3fbc98391ac79408343bf83f452b9f8bb5fa267de167d35d34774a/']
];
var CONTESTS=[
 ['1st runner-up','Intra University Programming Contest 2016, NSTU'],
 ['2nd runner-up','Intra ICE Programming Contest 2016, NSTU'],
 ['Judge & problem setter','Intra ICE Programming Contest 2017, NSTU'],
 ['Judge & problem setter','ICE FEST Programming Contest 2018, NSTU'],
 ['Problem setter','Intra University Programming Contest 2018 and 2019, NSTU'],
 ['Vice President','ICE Programming Club, NSTU, and mentor to junior programmers']
];

var POST_HALF='https://www.linkedin.com/posts/shaon-kanti-dhar_half-yearly-achievement-ugcPost-7239649500334583808-jtqq/';
var POST_CES='https://www.linkedin.com/feed/update/urn:li:activity:7303798804804182016/';
var POST_ICON22='https://www.linkedin.com/posts/shaon-kanti-dhar_i-was-awarded-as-icon-of-the-month-for-mar-share-6980531423698964480-YvRd/';
var AWARDS=[
 {name:'Excellence Award', period:'Oct – Dec 2024', note:'For my work on Next SmartThings and Lounge, which Samsung showed at CES 2025 in Las Vegas.', img:'assets/img/award.webp', link:POST_CES},
 {name:'Icon Award', period:'May – Jun 2024', note:'For my contribution to the company in May and June 2024.', img:'assets/img/icon-2024.webp', link:POST_HALF},
 {name:'Excellence Award', period:'Jan – Mar 2024', note:'For my contribution to the company from January to March 2024.', img:'assets/img/award-2024-q1.webp', link:POST_HALF},
 {name:'Icon of the Month', period:'Mar – Apr 2022', note:'For major contributions to features of an Atlassian Jira plugin.', img:'assets/img/icon-2022.webp', link:POST_ICON22}
];
var NEWS=[
 ['Dec 2025','Promoted to Project Leader on SmartThings Pro, leading a team of 12 engineers.'],
 ['Mar 2025','Promoted to Lead Engineer.'],
 ['Jan 2025','Lounge on show at CES 2025 in Las Vegas.'],
 ['Dec 2024','Proposed a method to protect calls and private notifications on Bluetooth multipoint earbuds.'],
 ['Oct – Dec 2024','Excellence Award for my work on Next SmartThings and Lounge.'],
 ['Sep 2024','Lounge and Virtual Studio on the Samsung booth at IFA 2024 in Berlin.'],
 ['May – Jun 2024','Icon Award from Samsung R&D Institute Bangladesh.'],
 ['Jan – Mar 2024','Excellence Award from Samsung R&D Institute Bangladesh.'],
 ['Jun 2023','Started building the Test Management System, later used by 7 teams.'],
 ['Mar 2022','Promoted to Senior Software Engineer.'],
 ['Mar – Apr 2022','Icon of the Month for features in an Atlassian Jira plugin.'],
 ['Feb 2022','Samsung Global Software Certificate, Professional level.'],
 ['Oct 2019','Joined Samsung R&D Institute Bangladesh as a Software Engineer. Passed the Samsung Global Software Certificate, Advanced level.'],
 ['2019','Graduated from NSTU in Information and Communication Engineering, CGPA 3.51 out of 4.']
];

var RESEARCH_AREAS=[['Device security & privacy','Keeping private audio and input on wearables in the right hands.'],['On-device AI','Voice embeddings, audio classification and NLP running on the phone.'],['Wearable interaction','Telling intentional input apart from accidental input.'],['Camera systems','Keeping several cameras in sync while recording.']];


