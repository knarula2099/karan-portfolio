/* ---------- dark mode ---------- */
const modeBtn = document.getElementById('modeBtn');
const root = document.documentElement;

function getSaved(){
  try { return localStorage.getItem('theme'); } catch(e){ return null; }
}
function save(t){
  try { localStorage.setItem('theme', t); } catch(e){ /* preview environments may block storage */ }
}
function applyTheme(t){
  root.setAttribute('data-theme', t);
  modeBtn.textContent = t === 'dark' ? '☀' : '☾';
  modeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let theme = getSaved() || (systemDark ? 'dark' : 'light');
applyTheme(theme);
modeBtn.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  save(theme);
});

/* ---------- page routing ---------- */
const PAGES = ['home','about','experience','work','play','contact'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let nameAnimated = false;

function showPage(name){
  if (!PAGES.includes(name)) name = 'home';
  PAGES.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.toggle('active', p === name);
  });
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-nav') === name && a.closest('nav'));
  });
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  if (name === 'home' && !nameAnimated && !reduceMotion) {
    nameAnimated = true;
    document.querySelectorAll('.lt').forEach((el, i) => {
      el.style.opacity = '0';
      setTimeout(() => { el.classList.add('flip'); }, 120 + i * 90);
    });
  }
}

function route(){
  const hash = location.hash.replace('#/', '').replace('#', '');
  showPage(hash || 'home');
}
window.addEventListener('hashchange', route);
route();

/* ---------- connections game ---------- */
const GROUPS = [
  { name: 'Shipped at Audible Sight', cls: 'g-yellow', items: ['AD PIPELINE','STUDIO MODE','TRANSCRIPTS','SAML SSO'] },
  { name: 'Stack of choice',          cls: 'g-green',  items: ['AZURE','AKS','COSMOS DB','AUTH0'] },
  { name: 'Off the clock',            cls: 'g-blue',   items: ['WORDLE','COOKING','SIDE QUESTS','PUZZLE BOTS'] },
  { name: 'The UCSD years',           cls: 'g-purple', items: ['COMMENCEMENT','RA ×2 YEARS','3.9 GPA','CSFOREACH'] },
];
const tilesEl = document.getElementById('tiles');
const solvedEl = document.getElementById('solved');
const msgEl = document.getElementById('gameMsg');
const submitBtn = document.getElementById('submitBtn');
const mistakesEl = document.getElementById('mistakes');

let board = GROUPS.flatMap(g => g.items.map(item => ({ item, group: g })));
let selected = [], mistakes = 0, solvedCount = 0, over = false;

function shuffle(arr){ for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } }

function render(){
  tilesEl.innerHTML = '';
  board.forEach(t => {
    const b = document.createElement('button');
    b.className = 'tile' + (selected.includes(t) ? ' sel' : '');
    b.textContent = t.item;
    b.setAttribute('aria-pressed', selected.includes(t));
    b.addEventListener('click', () => toggle(t));
    t.el = b;
    tilesEl.appendChild(b);
  });
  submitBtn.disabled = selected.length !== 4 || over;
}

function toggle(t){
  if (over) return;
  if (selected.includes(t)) selected = selected.filter(x => x !== t);
  else if (selected.length < 4) selected.push(t);
  render();
}

function say(text){ msgEl.textContent = text; }

function solveGroup(g){
  const row = document.createElement('div');
  row.className = 'solved-row ' + g.cls;
  row.innerHTML = '<b>' + g.name + '</b><span>' + g.items.join(' · ') + '</span>';
  solvedEl.appendChild(row);
  board = board.filter(t => t.group !== g);
  solvedCount++;
}

submitBtn.addEventListener('click', () => {
  if (selected.length !== 4 || over) return;
  const g = selected[0].group;
  const allMatch = selected.every(t => t.group === g);
  if (allMatch) {
    solveGroup(g);
    selected = [];
    render();
    if (solvedCount === 4) { over = true; say('Perfect. You basically know me now.'); }
    else say('Nice — "' + g.name + '" solved.');
  } else {
    const counts = {};
    selected.forEach(t => counts[t.group.name] = (counts[t.group.name] || 0) + 1);
    const oneAway = Object.values(counts).some(c => c === 3);
    mistakes++;
    mistakesEl.querySelectorAll('i')[4 - mistakes].classList.add('used');
    selected.forEach(t => t.el && t.el.classList.add('shake'));
    say(oneAway ? 'One away…' : 'Not a group. The sneaky one strikes again?');
    if (mistakes >= 4) {
      over = true;
      say('Out of guesses — revealing. (Auth0 was the trap, wasn\u0027t it?)');
      setTimeout(() => {
        GROUPS.forEach(g => { if (board.some(t => t.group === g)) solveGroup(g); });
        selected = []; render();
      }, 700);
    }
    setTimeout(() => { selected.forEach(t => t.el && t.el.classList.remove('shake')); }, 450);
  }
});

document.getElementById('shuffleBtn').addEventListener('click', () => { shuffle(board); render(); });
document.getElementById('deselectBtn').addEventListener('click', () => { selected = []; render(); });

shuffle(board);
render();
