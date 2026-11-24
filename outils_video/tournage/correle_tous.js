// Position de chaque ancien mp3 (voix_v25_sauvegarde) dans la narration complète, par corrélation d'enveloppe autour de la position DP.
const fs=require('fs'),{execFileSync}=require('child_process');const FF='C:/IA/video/depot/outils_video/node_modules/ffmpeg-static/ffmpeg.exe';
const env=(raw)=>{const n=raw.length/2,H=160,m=Math.floor(n/H),e=new Float32Array(m);for(let f=0;f<m;f++){let s=0;for(let i=f*H;i<(f+1)*H;i++){const v=raw.readInt16LE(i*2)/32768;s+=v*v}e[f]=Math.log10(s/H+1e-7)}return e};
const full=env(fs.readFileSync('C:/IA/video/v26_audio/full16k.raw'));const d=require('C:/IA/video/v26_audio/decoupe.json').blocs;
const res={};
for(const b of d){const f='C:/IA/video/depot/voix_v25_sauvegarde/bloc_'+b.id+'.mp3';if(!fs.existsSync(f))continue;
 const raw=execFileSync(FF,['-hide_banner','-loglevel','error','-i',f,'-ac','1','-ar','16000','-f','s16le','-'],{maxBuffer:1e8});const e=env(raw);
 const L=e.length;let me=0;for(const v of e)me+=v/L;const ec=e.map(v=>v-me);let ne=0;for(const v of ec)ne+=v*v;
 const c0=Math.max(0,Math.floor(b.deb*100)-4000),c1=Math.min(full.length-L,Math.floor(b.deb*100)+4000);
 let best=-1,bo=0;for(let o=c0;o<=c1;o++){let c=0,mf=0;for(let i=0;i<L;i++)mf+=full[o+i];mf/=L;let nf=0;for(let i=0;i<L;i++){const w=full[o+i]-mf;c+=w*ec[i];nf+=w*w}const r=c/Math.sqrt(ne*nf+1e-9);if(r>best){best=r;bo=o}}
 res[b.id]={pos:+(bo/100).toFixed(2),r:+best.toFixed(3),duree:+(L/100).toFixed(2),dp:+b.deb.toFixed(2)};
 console.log('bloc',b.id,'ancien',(L/100).toFixed(2),'s  position',(bo/100).toFixed(2),'(DP',b.deb.toFixed(2)+')  r =',best.toFixed(3));}
fs.writeFileSync('C:/IA/video/v26_audio/ancres_anciens.json',JSON.stringify(res,null,1));
