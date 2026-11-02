const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
global.estimateTempo=require('../dsp.js').estimateTempo;
const {inspectTrack,planMix,chooseNext}=require('../dj-engine.js');
const {parseDJRequest,matchLocal,musicSearchLinks}=require('../assistant-core.js');
for(const bpm of [90,120,150]){const sr=8000,s=new Float32Array(sr*30);for(let k=0;k<30*bpm/60;k++){const p=Math.round(k*60/bpm*sr);for(let j=0;j<100;j++)s[p+j]=Math.exp(-j/20);}const r=inspectTrack(s,sr);assert.ok(Math.abs(r.bpm-bpm)<=2);assert.equal(r.silent,false);}
assert.equal(inspectTrack(new Float32Array(80000),8000).silent,true);
assert.equal(planMix({bpm:120,energy:.1},{bpm:60,energy:.1}).synced,true);
assert.equal(planMix({bpm:120,energy:.1},{bpm:150,energy:.1}).synced,false);
assert.equal(planMix({bpm:null},{bpm:150}).seconds,5);
assert.deepEqual(parseDJRequest('GhostAI, cambia a salsa'),{type:'genre',genre:'salsa'});
assert.equal(parseDJRequest('GhostAI, siguiente Despacito').query,'despacito');
assert.equal(parseDJRequest('busca Bad Bunny en Spotify').platform,'spotify');
assert.equal(parseDJRequest('busca Bad Bunny en Spotify').query,'bad bunny');
assert.equal(parseDJRequest('GhostAI pausa').type,'pause');
assert.ok(musicSearchLinks('a&b')[0].url.endsWith('a%26b'));
assert.equal(matchLocal('despacito',[{file:{name:'Luis Fonsi - Despacito.mp3'},meta:{},state:'ready'}]).length,1);
const tracks=[{order:1,state:'ready',meta:{bpm:150,energy:.1}},{order:2,state:'ready',meta:{bpm:120,energy:.1}}];
assert.equal(chooseNext({bpm:120,energy:.1},tracks).track.order,2);tracks[0].priority=100;assert.equal(chooseNext({bpm:120,energy:.1},tracks).track.order,1);
// Exercise the real playlist controller with a deterministic clock and audio/DOM adapters.
class Element{constructor(){this.children=[];this.nodes=new Map;this.value=0;this.classList={add(){},remove(){}};}querySelector(s){if(!this.nodes.has(s))this.nodes.set(s,new Element);return this.nodes.get(s);}querySelectorAll(){return [this.querySelector('.play'),this.querySelector('.reset')];}append(...n){this.children.push(...n);}prepend(n){this.children.unshift(n);}replaceChildren(){this.children=[];}before(){}get lastChild(){return this.children.at(-1);}}
const nodes=new Map;const $=s=>{if(!nodes.has(s))nodes.set(s,new Element);return nodes.get(s);};
function param(){return {value:0,cancelScheduledValues(){},setValueAtTime(){},setTargetAtTime(){},linearRampToValueAtTime(){},setValueCurveAtTime(){}};}
const ctx={currentTime:0,decodeAudioData:async()=>({duration:60,sampleRate:10,numberOfChannels:1,getChannelData:()=>new Float32Array(600)}),resume:async()=>{}};
const decks=[0,1].map(()=>({el:new Element,offset:0,rate:1,loading:0,gain:{gain:param()},low:{gain:param()},wet:{gain:param()}}));
const sandbox={console,document:{createElement:()=>new Element,querySelector:$},$,decks,ctx,audio:()=>ctx,voices:new Set,draw(){},status(){},setCross(){},stopDrums(){},startDrums(){},hit(){},echoDeck(){},routeDeck(){},cancelTransition(){},setInterval:()=>1,clearInterval(){},chooseNext,planMix,estimateTempo,inspectTrack,
 play(d,when){d.source={};d.started=when??ctx.currentTime;},stop(d){d.source=null;}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('./autodj.js','utf8'),sandbox);
async function flush(){await new Promise(setImmediate);}
(async()=>{const state=vm.runInContext('dj',sandbox);for(let i=0;i<3;i++)state.tracks.push({id:i,order:i,file:{name:`Track ${i}`,arrayBuffer:async()=>new ArrayBuffer(1)},state:'ready',meta:{bpm:120,energy:.1,cueIn:0,cueOut:60}});
 await $('#startDJ').onclick();await flush();assert.equal(state.running,true);assert.equal(state.standby.track.order,1);
 ctx.currentTime=52;vm.runInContext('tickDJ()',sandbox);assert.ok(state.mix);ctx.currentTime=61;vm.runInContext('tickDJ()',sandbox);await flush();assert.equal(state.active,1);assert.equal(state.tracks[0].state,'done');assert.equal(state.standby.track.order,2);
 ctx.currentTime=104;vm.runInContext('tickDJ()',sandbox);assert.ok(state.mix);ctx.currentTime=114;vm.runInContext('tickDJ()',sandbox);await flush();assert.equal(state.active,0);assert.equal(state.tracks[1].state,'done');decks[0].source=null;vm.runInContext('tickDJ()',sandbox);assert.equal(state.running,false);assert.equal(state.tracks[2].state,'done');
 for(const t of state.tracks)t.state='ready';ctx.currentTime=200;await $('#startDJ').onclick();await flush();ctx.currentTime=252;vm.runInContext('tickDJ()',sandbox);assert.ok(state.mix);$('#haltDJ').onclick();assert.equal(state.running,false);assert.equal(state.mix,null);assert.ok(decks.some(d=>d.source));
 console.log('PASS: signal analysis, tempo fallback, selection, assistant parsing, three-track deck alternation, completion, pause during transition.');
})().catch(e=>{console.error(e);process.exitCode=1;});


