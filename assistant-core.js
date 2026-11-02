function cleanText(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ\s]/g,' ').replace(/\s+/g,' ').trim();}
const djGenres=['salsa','reggaeton','bachata','merengue','cumbia','rock','pop','electronica','house','techno','hip hop','jazz'];
function parseDJRequest(text){let s=cleanText(text).replace(/^ghost\s*ai\s*/,'');const platform= s.includes('spotify')?'spotify':/deezer|dezzer/.test(s)?'deezer':s.includes('apple music')?'apple':s.includes('youtube')?'youtube':null;
 if(/^(deten|detener|para|parar|pausa|pausar)(\s|$)/.test(s))return {type:'pause'};
 if(/^(inicia|iniciar|empieza|empezar|continua|continuar)(\s|$)/.test(s))return {type:'start'};
 const stripped=s.replace(/^(que\s+)?(la\s+)?(siguiente\s+)?(cancion\s+)?(sea\s+|ponga\s+|salga\s+)?/,'').replace(/^(pon|pone|poner|reproduce|reproducir|busca|buscar|mezcla|mezclar|cambia a|cambiar a|quiero|toca)\s+/,'').replace(/^(de\s+|musica\s+de\s+|musica\s+|algo\s+de\s+)/,'').replace(/\s+(en\s+)?(spotify|deezer|dezzer|apple music|youtube)$/,'').trim();
 const genre=djGenres.find(g=>stripped===g||stripped===`genero ${g}`);
 return genre&&!platform?{type:'genre',genre}:{type:'song',query:stripped||s,platform};
}
function matchLocal(query,tracks){const q=cleanText(query);if(q.length<2)return [];return tracks.filter(t=>t.meta&&!t.meta.silent&&t.state!=='error').map(track=>{const name=cleanText(track.file.name.replace(/\.[^.]+$/,''));return {track,score:name===q?3:name.includes(q)?2:q.split(' ').every(w=>name.includes(w))?1:0};}).filter(x=>x.score).sort((a,b)=>b.score-a.score||a.track.order-b.track.order);}
function musicSearchLinks(query){const q=encodeURIComponent(query);return [{name:'Spotify',id:'spotify',url:`https://open.spotify.com/search/${q}`},{name:'Deezer',id:'deezer',url:`https://www.deezer.com/search/${q}`},{name:'Apple Music',id:'apple',url:`https://music.apple.com/us/search?term=${q}`},{name:'YouTube',id:'youtube',url:`https://www.youtube.com/results?search_query=${q}`}];}
if(typeof module!=='undefined')module.exports={cleanText,parseDJRequest,matchLocal,musicSearchLinks};

