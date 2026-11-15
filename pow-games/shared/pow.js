// POW Games — shared chrome + helpers. No framework, no build.
// Each game: <body data-game="slug" data-title="Name" data-kicker="Daily ...">, <main id="game">, then PG.boot().
const PG = (() => {
  const TZ = 'America/Los_Angeles';
  const API = 'https://pow-games-api.todd-burns.workers.dev';
  const slug = document.body.dataset.game || 'hub';
  const store = {
    get(k, d) { try { const v = localStorage.getItem('powg:' + slug + ':' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('powg:' + slug + ':' + k, JSON.stringify(v)); } catch (e) {} },
    gget(k, d) { try { const v = localStorage.getItem('powg:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    gset(k, v) { try { localStorage.setItem('powg:' + k, JSON.stringify(v)); } catch (e) {} },
  };
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const laDate = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const dayNum = s => Math.round(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 864e5);
  const dateFor = (launch, n) => new Date((dayNum(launch) + n - 1) * 864e5).toISOString().slice(0, 10);
  // the puzzle number for a date; loops past the end so a demo never breaks
  const numFor = (launch, len, date) => { const i = dayNum(date) - dayNum(launch); return i < 0 ? 1 : (i % len) + 1; };
  const msToMidnightLA = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(new Date()).map(x => [x.type, x.value]));
    return (86400 - ((+p.hour % 24) * 3600 + +p.minute * 60 + +p.second)) * 1000;
  };
  const search = s => 'https://www.powmag.net/archive?sort=search&search=' + encodeURIComponent(s);
  // seeded RNG so a day's puzzle is the same for everyone
  const rng = seed => { let a = 0; for (const c of String(seed)) a = Math.imul(a ^ c.charCodeAt(0), 2654435761) >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  const shuffle = (a, r = Math.random) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = r() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and').replace(/^the /, '').replace(/[^a-z0-9]/g, '');

  // daily picker: ?date=YYYY-MM-DD preview, ?n=K archive (both = practice, no streak)
  function day(launch, len) {
    const q = new URLSearchParams(location.search);
    const today = numFor(launch, len, laDate());
    let n = today, practice = false, label = laDate();
    if (/^\d{4}-\d{2}-\d{2}$/.test(q.get('date') || '')) { n = numFor(launch, len, q.get('date')); practice = true; label = 'Preview ' + q.get('date'); }
    else if (q.get('n')) { const k = parseInt(q.get('n'), 10); if (k >= 1 && k <= len) { n = k; practice = k !== today; label = practice ? 'Archive' : laDate(); } }
    return { n, practice, label, today };
  }

  function chrome() {
    const b = document.body, title = b.dataset.title || 'POW Games', kicker = b.dataset.kicker || 'POW MAG · Games';
    const hub = slug === 'hub';
    const top = document.createElement('header'); top.className = 'powbar';
    top.innerHTML = `<div class="pb-top"><div class="lab"><b>${esc(hub ? 'POW Games' : title)}</b> · ${hub ? 'Play' : 'Daily'}</div>
      <a class="mark" href="https://www.powmag.net/" aria-label="POW MAG"><img src="${hub ? '' : '../'}shared/pow-wordmark.png" alt="POW MAG"></a>
      <a class="cta" href="https://www.powmag.net/subscribe" target="_blank" rel="noopener">Subscribe</a></div>
      <nav><a href="https://www.powmag.net/" target="_blank" rel="noopener">Home</a><a href="https://www.powmag.net/archive" target="_blank" rel="noopener">Archive</a>
      <a href="https://www.powmag.net/s/podcast" target="_blank" rel="noopener">Podcast</a><a class="on" href="${hub ? './' : '../'}">Games</a>
      <a href="https://www.powmag.net/about" target="_blank" rel="noopener">About</a></nav>`;
    b.prepend(top);
    const w = $('wrap');
    if (!hub) {
      const m = document.createElement('header'); m.className = 'mast';
      m.innerHTML = `<div><h1><a href="./">${esc(title)}</a></h1></div>
        <nav aria-label="Pages"><a href="./" aria-current="page">Today</a><a href="../">All games</a></nav>`;
      w.prepend(m);
    }
    const f = document.createElement('footer');
    f.innerHTML = `A demo built for <a href="https://www.powmag.net/">POW MAG</a>, independent rap writing since 2005.${hub ? '' : ' <a href="../">More POW games</a>.'}`;
    w.appendChild(f);
    document.body.insertAdjacentHTML('beforeend', `<div class="rback" id="rback"></div>
      <div class="nag" id="nag" hidden role="dialog" aria-modal="true" aria-label="Sign up for POW MAG"><div class="nag-card"><img class="nag-mark" src="${hub ? '' : '../'}shared/pow-wordmark.png" alt="POW MAG"><div id="nag-body"></div>
      <div class="nag-row"><button class="btn" id="nag-on" type="button">I'm on the list</button><button class="btn" id="nag-close" type="button">Not now, keep playing</button></div></div></div>`);
    $('nag-close').onclick = closeNag; $('nag-on').onclick = () => { markSubbed(); closeNag(); };
    $('nag').addEventListener('click', e => { if (e.target === $('nag')) closeNag(); });
    $('rback').onclick = unpop;
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('nag').hidden) closeNag(); else if (popped) unpop(); } });
  }

  // ---------- POW sign-up pop-ups: never block play; each kind once a day; gone for good after "I'm on the list" ----------
  const NAG_OFF = new URLSearchParams(location.search).has('nonag');
  const EMBED = '<iframe class="ss" src="https://www.powmag.net/embed" title="Sign up for POW MAG" scrolling="no"></iframe>';
  const subbed = () => store.gget('sub', false);
  function nag(kind, c) {
    if (NAG_OFF || subbed() || store.get('nag-' + kind, '') === laDate()) return;
    if (!$('nag').hidden || popped) { if (popped) afterPop = () => nag(kind, c); return; }
    store.set('nag-' + kind, laDate());
    $('nag-body').innerHTML = `<p class="kick">${esc(c.kick)}</p><p class="big">${esc(c.head)}</p><p>${esc(c.body)}</p>${EMBED}`;
    $('nag').hidden = false; $('nag-close').focus();
  }
  function closeNag() { $('nag').hidden = true; $('nag-body').innerHTML = ''; }
  function markSubbed() { store.gset('sub', true); document.querySelectorAll('.signup').forEach(x => x.remove()); }
  function signupBox(head = "Get tomorrow's game in your inbox") {
    if (subbed()) return '';
    setTimeout(() => document.querySelectorAll('.su-on').forEach(b => b.onclick = markSubbed));
    return `<div class="signup"><h3>${esc(head)}</h3><p>POW MAG, free. Rap writing since 2005.</p>${EMBED}<button class="btn su-on" type="button">I'm on the list</button></div>`;
  }

  // ---------- desktop: results pop to centre; Close sends them back ----------
  let popped = false, afterPop = null;
  const wide = () => innerWidth > 900;
  function flip(el, change) {
    const a = el.getBoundingClientRect(); change(); const b = el.getBoundingClientRect();
    const base = popped ? 'translate(-50%,-50%) ' : '';
    el.animate([{ transform: `${base}translate(${a.left - b.left}px,${a.top - b.top}px) scale(${a.width / b.width})`, transformOrigin: 'top left' },
      { transform: base || 'none', transformOrigin: 'top left' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
  function popResults(r = $('results')) {
    if (!r.querySelector('.rx')) { r.insertAdjacentHTML('afterbegin', '<button class="btn rx" type="button">Close ✕</button>'); r.querySelector('.rx').onclick = unpop; }
    if (!wide() || popped) { r.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    flip(r, () => { popped = true; r.classList.add('pop'); }); $('rback').classList.add('on'); r.scrollTop = 0;
  }
  function unpop() {
    if (!popped) return; const r = $('results');
    flip(r, () => { popped = false; r.classList.remove('pop'); }); $('rback').classList.remove('on');
    const f = afterPop; afterPop = null; if (f) setTimeout(f, 500);
  }

  function toast(msg, ms = 1800) { const t = $('toast'); if (!t) return; t.innerHTML = msg ? `<span>${esc(msg)}</span>` : ''; clearTimeout(toast.t); if (msg && ms) toast.t = setTimeout(() => t.innerHTML = '', ms); }
  async function copy(txt) {
    try { await navigator.clipboard.writeText(txt); toast('Copied. Go start some beef.'); }
    catch (e) { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Copied. Go start some beef.'); } catch (e2) { toast('Couldn\'t copy. Screenshot it like it\'s 2012.'); } ta.remove(); }
  }
  function countdown(el, what) {
    const tick = () => { const ms = msToMidnightLA(), h = ms / 36e5 | 0, m = ms / 6e4 % 60 | 0, s = ms / 1e3 % 60 | 0; el.innerHTML = `Next ${esc(what)} in <b>${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}</b>`; };
    tick(); clearInterval(countdown.iv); countdown.iv = setInterval(tick, 1000);
  }
  // streak stats keyed by puzzle number
  function record(n, won, practice) {
    const st = store.get('stats', { played: 0, wins: 0, streak: 0, max: 0, last: 0 });
    if (practice || store.get('counted-' + n, false)) return st;
    st.played++;
    if (won) { st.wins++; st.streak = st.last === n - 1 ? st.streak + 1 : 1; st.last = n; st.max = Math.max(st.max, st.streak); } else { st.streak = 0; st.last = 0; }
    store.set('stats', st); store.set('counted-' + n, true); return st;
  }
  const statsHTML = st => `<div class="stats">${[['Played', st.played], ['Win %', st.played ? Math.round(100 * st.wins / st.played) : 0], ['Streak', st.streak], ['Max', st.max]].map(([k, v]) => `<div><b>${v}</b><span>${k}</span></div>`).join('')}</div>`;

  // type-ahead picker over a list of {label, sub?, keys:[...]} — returns chosen item via onPick
  function autocomplete(input, items, onPick, max = 8) {
    const box = document.createElement('ul'); box.hidden = true; box.setAttribute('role', 'listbox'); input.parentNode.appendChild(box);
    input.setAttribute('autocomplete', 'off'); input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list');
    let cur = [], hi = 0;
    const idx = items.map(it => ({ it, k: [it.label, ...(it.keys || [])].map(norm) }));
    function show() {
      const v = norm(input.value);
      if (!v) { box.hidden = true; cur = []; return; }
      cur = idx.filter(x => x.k.some(k => k.includes(v))).sort((a, b) => (a.k.some(k => k.startsWith(v)) ? 0 : 1) - (b.k.some(k => k.startsWith(v)) ? 0 : 1) || a.it.label.length - b.it.label.length).slice(0, max).map(x => x.it);
      hi = 0; draw();
    }
    function draw() {
      box.innerHTML = cur.map((it, i) => `<li role="option" data-i="${i}" aria-selected="${i === hi}">${esc(it.label)}${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</li>`).join('');
      box.hidden = !cur.length;
    }
    function pick(i) { const it = cur[i]; if (!it) return; input.value = ''; box.hidden = true; cur = []; onPick(it); }
    input.addEventListener('input', show);
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hi + 1, cur.length - 1); draw(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); hi = Math.max(hi - 1, 0); draw(); }
      else if (e.key === 'Enter') { e.preventDefault(); pick(hi); }
      else if (e.key === 'Escape') { box.hidden = true; }
    });
    box.addEventListener('mousedown', e => { const li = e.target.closest('li'); if (li) { e.preventDefault(); pick(+li.dataset.i); } });
    input.addEventListener('blur', () => setTimeout(() => box.hidden = true, 150));
    return { refresh: show };
  }

  async function api(path, body) {
    try {
      const r = await fetch(API + path, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : {});
      if (!r.ok) throw new Error(r.status); return await r.json();
    } catch (e) { console.warn('[POW] api', path, e); return null; }
  }
  const load = f => fetch(f, { cache: 'no-cache' }).then(r => r.json());

  chrome();
  return { $, esc, store, laDate, dateFor, numFor, day, msToMidnightLA, search, rng, shuffle, norm, nag, signupBox, popResults, unpop, toast, copy, countdown, record, statsHTML, autocomplete, api, load, slug };
})();
