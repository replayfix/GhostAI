const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element{
 constructor(){this.children=[];this.nodes=new Map();this.value=0;this.firstChild={textContent:''};this.classList={add(){},remove(){},toggle(){}};}
 querySelector(s){if(!this.nodes.has(s))this.nodes.set(s,new Element);return this.nodes.get(s);}
 querySelectorAll(){return [];}
 append(...nodes){this.children.push(...nodes);}
 prepend(n){this.children.unshift(n);}
 replaceChildren(){this.children=[];}
 insertAdjacentHTML(){}before(){}setAttribute(){}
 get lastChild(){return this.children.at(-1);}
}
const nodes=new Map();const query=s=>{if(!nodes.has(s))nodes.set(s,new Element);return nodes.get(s);};
const context=vm.createContext({console,window:{},document:{createElement:()=>new Element,querySelector:query,querySelectorAll:()=>[],addEventListener(){}},setInterval:()=>1,clearInterval(){},requestAnimationFrame:()=>1,cancelAnimationFrame(){}});
const scripts=['dsp','app','studio','dj-engine','autodj','assistant-core','assistant'];for(const file of scripts)vm.runInContext(fs.readFileSync(`./${file}.js`,'utf8'),context,{filename:file});
(async()=>{vm.runInContext(`dj.tracks.push({order:1,file:{name:'Mi salsa.mp3'},state:'ready',genre:'salsa',meta:{bpm:120,energy:.1}},{order:2,file:{name:'Otra pista.mp3'},state:'ready',meta:{bpm:120,energy:.1}});renderQueue();`,context);
 await vm.runInContext(`handleDJRequest('siguiente Otra pista')`,context);assert.equal(vm.runInContext('dj.tracks[1].priority',context),100);
 await vm.runInContext(`handleDJRequest('cambia a salsa')`,context);assert.equal(vm.runInContext('dj.tracks[0].priority',context),10);assert.equal(vm.runInContext('dj.tracks[1].priority',context),0);
 await vm.runInContext(`handleDJRequest('busca Canción desconocida en Spotify')`,context);assert.equal(query('#musicSearchLinks').children.length,1);assert.ok(query('#musicSearchLinks').children[0].href.includes('open.spotify.com/search/'));
 assert.equal(query('#voiceDJ').disabled,true);
 console.log('PASS: full app initialization, local song request, genre preference, external search link, voice-unavailable fallback.');
})().catch(err=>{console.error(err);process.exitCode=1;});

