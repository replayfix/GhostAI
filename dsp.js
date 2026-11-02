/* Pure signal analysis, shared by browser worker and local verification. */
function estimateTempo(samples,sampleRate){
 const hop=Math.max(1,Math.floor(sampleRate/100)), energy=[];
 for(let i=0;i+hop<samples.length;i+=hop){let s=0;for(let j=0;j<hop;j++)s+=samples[i+j]*samples[i+j];energy.push(Math.sqrt(s/hop));}
 const onset=energy.map((v,i)=>Math.max(0,v-(energy[i-1]||0)));let total=onset.reduce((s,v)=>s+v*v,0);
 if(total<1e-9||onset.length<600)return {bpm:null,confidence:0};
 let best=0,lagBest=0;const fps=sampleRate/hop;
 for(let lag=Math.floor(fps*60/180);lag<=Math.ceil(fps*60/65);lag++){let sum=0,a=0,b=0;for(let i=lag;i<onset.length;i++){sum+=onset[i]*onset[i-lag];a+=onset[i]**2;b+=onset[i-lag]**2;}const score=sum/Math.sqrt(a*b||1);if(score>best){best=score;lagBest=lag;}}
 return {bpm:best>.12?Math.round(60*fps/lagBest):null,confidence:Math.round(best*100)};
}
if(typeof module!=='undefined')module.exports={estimateTempo};

