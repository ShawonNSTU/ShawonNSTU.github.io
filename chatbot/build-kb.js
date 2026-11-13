/* Builds the chatbot's knowledge base from the portfolio data.
   Run from the repo root:  node chatbot/build-kb.js
   It writes chatbot/worker/src/kb.json, which the Worker bundles. Re-run it whenever data/content.js changes. */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const E = require(path.join(root, 'assets/js/chat-engine.js'));
const src = fs.readFileSync(path.join(root, 'data/content.js'), 'utf8');
const names = ['EMAIL', 'PROJECTS', 'ARCHIVE', 'JOBS', 'CAPS', 'CERTS', 'CONTESTS', 'NEWS', 'AWARDS', 'RESEARCH'];
const D = new Function(src + '\nreturn {' + names.map(n => n + ': typeof ' + n + " !== 'undefined' ? " + n + ' : undefined').join(',') + '};')();
const kb = E.buildKB(D);
const out = path.join(__dirname, 'worker/src/kb.json');
fs.writeFileSync(out, JSON.stringify(kb));
console.log('knowledge base:', kb.chunks.length, 'chunks,', Math.round(fs.statSync(out).size / 1024) + ' KB ->', path.relative(root, out));
