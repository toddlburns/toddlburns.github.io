// node validate.js — checks puzzles.json
const fs = require('fs');
const d = JSON.parse(fs.readFileSync(__dirname + '/puzzles.json', 'utf8'));
const errs = []; const seen = new Map();
if (!/^\d{4}-\d{2}-\d{2}$/.test(d.launch || '')) errs.push('launch date missing or not YYYY-MM-DD');
d.puzzles.forEach((p, i) => {
  const id = `#${p.n ?? '?'}`;
  if (p.n !== i + 1) errs.push(`${id}: expected n=${i + 1}`);
  if (!Array.isArray(p.groups) || p.groups.length !== 4) { errs.push(`${id}: needs exactly 4 groups`); return; }
  const tiles = [], levels = [];
  p.groups.forEach((g, j) => {
    if (!g.name || !String(g.name).trim()) errs.push(`${id} group ${j + 1}: no name`);
    if (![1, 2, 3, 4].includes(g.level)) errs.push(`${id} group ${j + 1}: level must be 1-4`);
    levels.push(g.level);
    if (!Array.isArray(g.tiles) || g.tiles.length !== 4) errs.push(`${id} "${g.name}": needs exactly 4 tiles`);
    (g.tiles || []).forEach(t => { if (!String(t).trim()) errs.push(`${id}: empty tile`); tiles.push(String(t).trim().toLowerCase()); });
  });
  if (new Set(levels).size !== 4) errs.push(`${id}: levels must be 1,2,3,4 once each`);
  const dup = tiles.filter((t, k) => tiles.indexOf(t) !== k);
  if (dup.length) errs.push(`${id}: duplicate tiles: ${[...new Set(dup)].join(', ')}`);
  if (new Set(tiles).size !== 16) errs.push(`${id}: needs 16 unique tiles (has ${new Set(tiles).size})`);
  const sig = p.groups.map(g => (g.tiles || []).map(t => t.trim().toLowerCase()).sort().join('|')).sort().join('||');
  if (seen.has(sig)) errs.push(`${id}: identical to #${seen.get(sig)}`); else seen.set(sig, p.n);
});
if (errs.length) { console.error(errs.map(e => '✗ ' + e).join('\n')); process.exit(1); }
console.log(`✓ ${d.puzzles.length} puzzles OK (launch ${d.launch})`);
