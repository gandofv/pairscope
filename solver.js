// Preserve both coordinate orderings through each recursive split.
function trace(points) {
  const frames = [];
  let comparisons = 0;
  function solve(xs, ys) {
    let best = { distance: Infinity, pair: [] };
    let split, width;
    function record(message, pair = []) {
      frames.push({message, active: xs, pair, best, split, width, comparisons});
    }
    function compare(a, b) {
      comparisons++;
      const distance = Math.hypot(a.x-b.x, a.y-b.y);
      if (distance < best.distance) best = {distance, pair: [a,b]};
      record('比较 ' + a.id + ' 与 ' + b.id + '，距离为 ' + distance.toFixed(1), [a,b]);
    }
    if (xs.length <= 3) {
      record('子问题只有 ' + xs.length + ' 个点，直接两两比较。');
      for (let i=0; i<xs.length; i++)
        for (let j=i+1; j<xs.length; j++) compare(xs[i],xs[j]);
      return best;
    }
    const mid = Math.floor(xs.length/2);
    split = (xs[mid-1].x + xs[mid].x)/2;
    record('按横坐标分成左右两组，分别寻找最近点对。');
    const left = xs.slice(0,mid), included = new Set(left);
    const a = solve(left, ys.filter(p=>included.has(p)));
    const b = solve(xs.slice(mid), ys.filter(p=>!included.has(p)));
    best = a.distance <= b.distance ? a : b;
    width = best.distance;
    const strip = ys.filter(p=>Math.abs(p.x-split)<width);
    record('两侧的较短距离为 ' + width.toFixed(1) + '。按纵坐标扫描带内的 ' + strip.length + ' 个点。');
    for (let i=0; i<strip.length; i++) {
      for (let j=i+1; j<strip.length && strip[j].y-strip[i].y<best.distance; j++) {
        if (included.has(strip[i]) !== included.has(strip[j])) compare(strip[i], strip[j]);
      }
    }
    return best;
  }
  const best = solve([...points].sort((a,b)=>a.x-b.x), [...points].sort((a,b)=>a.y-b.y));
  frames.push({message:best.pair.length ? '最近点对为 ' + best.pair.map(p=>p.id).join(' 与 ') : '请至少放置两个点。', best,active:points,pair:[],comparisons});
  return frames;
}
if (typeof module !== 'undefined') module.exports = trace;
