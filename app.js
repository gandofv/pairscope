const el = id => document.getElementById(id);
const board = el('board'), ctx = board.getContext('2d');
const challenge = [[85,210],[210,70],[330,175],[390,35],[410,310],[440,188],[605,90],[710,265]];
let points, frames, step, dragging = null;
function load(coords) {
  points = coords.map(([x,y],i)=>({x,y,id:String.fromCharCode(65+i)}));
  restart();
}
function restart() {
  frames = trace(points);
  step = 0;
  draw();
}
function line(a,b,color,dashed=false) {
  ctx.strokeStyle=color;
  ctx.setLineDash(dashed ? [6,6] : []);
  ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
  ctx.setLineDash([]);
}
function draw() {
  const f=frames[step];
  ctx.clearRect(0,0,800,360);
  ctx.fillStyle='#39525b';
  for(let x=10;x<800;x+=20) for(let y=10;y<360;y+=20) ctx.fillRect(x,y,1.5,1.5);
  if(f.split !== undefined) {
    if(f.width !== undefined) {
      ctx.fillStyle='#7be3bb22';
      ctx.fillRect(f.split-f.width,0,2*f.width,360);
    }
    line({x:f.split,y:0},{x:f.split,y:360},'#a4b9ba',true);
  }
  ctx.lineWidth=4;
  if(f.best.pair.length) line(...f.best.pair,'#abf58a');
  ctx.lineWidth=2;
  if(f.pair.length) line(...f.pair,'#ffbf60',true);
  for(const p of points) {
    ctx.fillStyle=f.active.includes(p)?'#e2f5ef':'#68828a';
    ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();
    ctx.font='15px monospace';ctx.fillText(p.id,p.x+7,p.y-6);
  }
  el('metrics').textContent='步骤 '+(step+1)+' / '+frames.length+'　·　比较 '+f.comparisons+' 次　·　最短距离 '+(Number.isFinite(f.best.distance)?f.best.distance.toFixed(1):'—');
  el('message').textContent=f.message;
  el('prev').disabled=step===0;
  el('next').disabled=step===frames.length-1;
}
function position(e) {
  const r=board.getBoundingClientRect();
  return {x:Math.round(Math.max(10,Math.min(778,(e.clientX-r.left)*800/r.width))),y:Math.round(Math.max(18,Math.min(350,(e.clientY-r.top)*360/r.height)))};
}
board.onpointerdown=e=>{
  const pos=position(e);
  dragging=points.find(p=>Math.hypot(p.x-pos.x,p.y-pos.y)<14);
  if(!dragging && points.length<26) {
    dragging={...pos,id:String.fromCharCode(65+points.length)};
    points.push(dragging);restart();
  }
  if(dragging) board.setPointerCapture(e.pointerId);
};
board.onpointermove=e=>{if(dragging){Object.assign(dragging,position(e));restart();}};
board.onlostpointercapture=()=>{dragging=null;};
el('prev').onclick=()=>{if(step>0){step--;draw();}};
el('next').onclick=()=>{if(step<frames.length-1){step++;draw();}};
el('reset').onclick=()=>load(challenge);
el('random').onclick=()=>load(Array.from({length:12},()=>[20+Math.floor(Math.random()*750),25+Math.floor(Math.random()*310)]));
load(challenge);
