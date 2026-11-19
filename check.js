const assert = require('node:assert/strict');
const trace = require('./solver');
function check(coords) {
  const points=coords.map(([x,y],id)=>({x,y,id}));
  let expected=Infinity;
  for(let i=0;i<points.length;i++)
    for(const q of points.slice(i+1))
      expected=Math.min(expected,Math.hypot(points[i].x-q.x,points[i].y-q.y));
  assert.equal(trace(points).at(-1).best.distance,expected);
}
[[],[[1,2]],[[0,0],[3,4]],[[2,2],[2,2],[2,4],[2,5]]].forEach(check);
let seed=17;
function coordinate(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%97;}
for(let i=0;i<500;i++)check(Array.from({length:2+i%25},()=>[coordinate(),coordinate()]));
console.log('504 cases passed');
