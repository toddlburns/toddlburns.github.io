// The Cypher — shared logic. No framework, no build.
const Cy = (() => {
  const TZ = 'America/Los_Angeles';
  const store = {
    get(k, d) { try { const v = localStorage.getItem('cypher:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('cypher:' + k, JSON.stringify(v)); } catch (e) {} },
  };
  const laDate = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const dayNum = s => Math.round(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 864e5);
  const dateFor = (launch, n) => { const t = new Date((dayNum(launch) + n - 1) * 864e5); return t.toISOString().slice(0, 10); };
  // puzzle number for a date; cycles if we run past the last puzzle so the demo never breaks
  const numFor = (data, date) => { const i = dayNum(date) - dayNum(data.launch); const L = data.puzzles.length; return i < 0 ? 1 : (i % L) + 1; };
  const todayNum = data => numFor(data, laDate());
  const load = () => fetch('puzzles.json', { cache: 'no-cache' }).then(r => r.json());
  const msToMidnightLA = () => {
    const now = new Date();
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(now).map(p => [p.type, p.value]));
    const s = (+parts.hour % 24) * 3600 + +parts.minute * 60 + +parts.second;
    return (86400 - s) * 1000;
  };
  const search = name => 'https://www.powmag.net/archive?sort=search&search=' + encodeURIComponent(name);
  return { store, laDate, dateFor, numFor, todayNum, load, msToMidnightLA, search };
})();
