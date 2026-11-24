// Cherche la position d'un mp3 de bloc (fichier de l'utilisateur) dans la narration complète par corrélation d'enveloppe (10 ms).
const fs=require('fs'),{execFileSync}=require('child_process');const FF='C:/IA/video/depot/outils_video/node_modules/ffmpeg-static/ffmpeg.exe';
const env=(raw)=>{const n=raw.length/2,H=160,m=Math.floor(n/H),e=new Float32Array(m);for(let f=0;f<m;f++){let s=0;for(let i=f*H;i<(f+1)*H;i++){const v=raw.readInt16LE(i*2)/32768;s+=v*v}e[f]=Math.log10(s/H+1e-7)}return e};
const full=env(fs.readFileSync('C:/IA/video/v26_audio/full16k.raw'));
for(const id of process.argv.slice(2)){const f='C:/IA/video/v26_audio/user_bloc_'+id+'.mp3';const raw=execFileSync(FF,['-hide_banner','-loglevel','error','-i',f,'-ac','1','-ar','16000','-f','s16le','-'],{maxBuffer:1e8});const e=env(raw);
 const L=e.length;let me=0;for(const v of e)me+=v/L;const ec=e.map(v=>v-me);let ne=0;for(const v of ec)ne+=v*v;
 let best=-1,bo=0;for(let o=0;o+L<=full.length;o++){let c=0,mf=0;for(let i=0;i<L;i++)mf+=full[o+i];mf/=L;let nf=0;for(let i=0;i<L;i++){const w=full[o+i]-mf;c+=w*ec[i];nf+=w*w}const r=c/Math.sqrt(ne*nf+1e-9);if(r>best){best=r;bo=o}}
 console.log('bloc',id,'durée',(L/100).toFixed(2),'s  meilleure position',(bo/100).toFixed(2),'s  r =',best.toFixed(3));}
