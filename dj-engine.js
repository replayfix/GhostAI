/* Signal-derived features and explainable selection, without a trained model. */
function inspectTrack(samples,sampleRate){
 const tempo=estimateTempo(samples.subarray(0,Math.min(samples.length,sampleRate*90)),sampleRate);
 const blocks=[],step=Math.max(1,Math.floor(sampleRate/2));
 for(let p=0;p<samples.length;p+=step){let sum=0;const end=Math.min(samples.length,p+step);for(let i=p;i<end;i++)sum+=samples[i]*samples[i];blocks.push(Math.sqrt(sum/Math.max(1,end-p)));}
 const peak=Math.max(0,...blocks),threshold=Math.max(.002,peak*.08);let first=blocks.findIndex(v=>v>threshold),last=blocks.length-1;while(last>=0&&blocks[last]<=threshold)last--;
 const duration=samples.length/sampleRate,energy=blocks.reduce((s,v)=>s+v,0)/Math.max(1,blocks.length);
 return {...tempo,duration,energy,cueIn:Math.max(0,first)*.5,cueOut:last<0?duration:Math.min(duration,(last+1)*.5),silent:peak<.002};
}
function planMix(current,next){
 const target=current.bpm*(current.rate||1);let rate=1,synced=false;
 if(target&&next.bpm){const options=[next.bpm,next.bpm/2,next.bpm*2].map(bpm=>({bpm,ratio:target/bpm})).filter(o=>o.ratio>=.92&&o.ratio<=1.08).sort((a,b)=>Math.abs(a.ratio-1)-Math.abs(b.ratio-1));if(options.length){rate=options[0].ratio;synced=true;}}
 const change=Math.abs((current.energy||0)-(next.energy||0));
 const beats=synced?(change>.07?8:16):0;
 return {rate,synced,seconds:synced?beats*60/target:5,effect:change>.07?'echo':'sweep',score:(synced?0:3)+change*10+(synced?Math.abs(rate-1)*5:0),reason:synced?'Tempo compatible; transición al pulso estimado.':'Tempos incompatibles o inciertos; fundido corto sin forzar sincronización.'};
}
function chooseNext(current,tracks){return tracks.filter(t=>t.state==='ready'&&!t.meta.silent).map(track=>({track,plan:planMix(current,track.meta)})).sort((a,b)=>(b.track.priority||0)-(a.track.priority||0)||a.plan.score-b.plan.score||a.track.order-b.track.order)[0]||null;}
if(typeof module!=='undefined')module.exports={inspectTrack,planMix,chooseNext};

