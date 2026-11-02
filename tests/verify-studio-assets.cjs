const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const root='./';const html=fs.readFileSync(root+'index.html','utf8');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(scripts,['dsp.js','app.js','studio.js','dj-engine.js','autodj.js','assistant-core.js','assistant.js']);
for(const file of scripts){assert.ok(fs.existsSync(root+file));new vm.Script(fs.readFileSync(root+file,'utf8'),{filename:file});}
for(const file of ['style.css','studio.css'])assert.ok(html.includes(file)&&fs.existsSync(root+file));
const source=html+scripts.map(f=>fs.readFileSync(root+f,'utf8')).join('\n');
for(const id of ['startDJ','haltDJ','clearDJ','queueFiles','setMode','djEffects','djBase','assistantText','assistantReply','voiceDJ','voiceState'])assert.ok(source.includes('id="'+id+'"'),id);
console.log('PASS: all local assets, script ordering, JavaScript parsing, playlist and assistant controls.');

