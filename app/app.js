// GTA VI trophy guide & tracker — offline ES module. Loads only ./data/trophies.json,
// keeps the earned checklist in localStorage, and exports/imports progress as JSON.
const STORAGE_KEY = 'gta6-trophy-tracker-v1';
const DATA_URL = './data/trophies.json';
const STAGE_ORDER = [
  'Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4',
  'Story Missions', 'Strangers & Freaks', 'Activities', 'Collectibles',
  'Endgame', 'Final Mission', 'Platinum',
];
const GRADE_CLASS = { platinum: 'grade-platinum', gold: 'grade-gold', silver: 'grade-silver', bronze: 'grade-bronze' };

let trophies = [];
let earned = new Set();
const filters = { grade: 'All', kind: 'All', spoiler: false };

const els = {
  progress: document.getElementById('progress'),
  bar: document.getElementById('bar'),
  grade: document.getElementById('grade'),
  kind: document.getElementById('kind'),
  spoiler: document.getElementById('spoiler'),
  board: document.getElementById('board-body'),
  roadmap: document.getElementById('roadmap'),
};

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function loadFilters() {
  const p = new URLSearchParams(location.search);
  const gRaw = p.get('grade');
  if (gRaw) {
    const g = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze'].find((o) => o.toLowerCase() === gRaw.toLowerCase());
    if (g) {
      filters.grade = g;
      els.grade.value = g;
    }
  }
  const kRaw = p.get('kind');
  if (kRaw) {
    const k = ['All', 'story', 'missable', 'collectibles', 'activities'].find((o) => o.toLowerCase() === kRaw.toLowerCase());
    if (k) {
      filters.kind = k;
      els.kind.value = k;
    }
  }
  if (p.get('spoiler') === '1') {
    filters.spoiler = true;
    els.spoiler.checked = true;
  }
}

function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const ids = Array.isArray(parsed) ? parsed : Array.isArray(parsed.earned) ? parsed.earned : [];
    const known = new Set(trophies.map((t) => t.id));
    for (const id of ids) if (known.has(id)) earned.add(id);
  } catch { /* ignore corrupt storage */ }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ earned: [...earned] }));
}

function hidden(t) {
  return filters.spoiler && t.kind === 'story' && !earned.has(t.id);
}

function render() {
  const n = earned.size;
  els.progress.textContent = `${n} of ${trophies.length} earned`;
  els.bar.style.width = `${(n / trophies.length * 100).toFixed(0)}%`;

  const byStage = new Map();
  for (const t of trophies) {
    if (!byStage.has(t.stage)) byStage.set(t.stage, []);
    byStage.get(t.stage).push(t);
  }

  let roadmap = '<h2>Roadmap to Platinum</h2>';
  for (const stage of STAGE_ORDER) {
    const items = byStage.get(stage);
    if (!items) continue;
    const done = items.filter((t) => earned.has(t.id)).length;
    roadmap += `<h3>${esc(stage)} <span class="count">${done}/${items.length}</span></h3><ul>`;
    for (const t of items) {
      roadmap += `<li><label class="row-check"><input type="checkbox" data-id="${t.id}" ${earned.has(t.id) ? 'checked' : ''} ${hidden(t) ? 'disabled' : ''}> ${hidden(t) ? 'Hidden story trophy' : esc(t.name)} <span class="grade ${GRADE_CLASS[t.grade]}">${t.grade.charAt(0).toUpperCase() + t.grade.slice(1)}</span></label></li>`;
    }
    roadmap += '</ul>';
  }
  els.roadmap.innerHTML = roadmap;

  let rows = '';
  for (const t of trophies) {
    if (filters.grade !== 'All' && t.grade.toLowerCase() !== filters.grade.toLowerCase()) continue;
    if (filters.kind !== 'All' && t.kind !== filters.kind) continue;
    const h = hidden(t);
    rows += `<tr>
      <td><label class="row-check"><input type="checkbox" data-id="${t.id}" ${earned.has(t.id) ? 'checked' : ''}> <span class="tick">${earned.has(t.id) ? '\u2713' : '\u25cb'}</span></label></td>
      <td class="trophy-name ${h ? 'hidden' : ''}">${h ? 'Hidden story trophy' : esc(t.name)}</td>
      <td><span class="grade ${GRADE_CLASS[t.grade]}">${t.grade.charAt(0).toUpperCase() + t.grade.slice(1)}</span></td>
      <td class="kind">${esc(t.kind)}</td>
      <td class="missable">${t.missable ? '<span class="warn">\u26a0 missable</span>' : ''}</td>
      <td class="guide">${h ? 'Unlock this story trophy to see the guide.' : esc(t.guide)}</td>
      <td class="source">${esc(t.source)}</td>
    </tr>`;
  }
  els.board.innerHTML = rows;
}

document.addEventListener('change', (ev) => {
  const cb = ev.target.closest('input[type="checkbox"][data-id]');
  if (!cb) return;
  const id = cb.dataset.id;
  if (cb.checked) earned.add(id); else earned.delete(id);
  save();
  render();
});

els.grade.addEventListener('change', () => { filters.grade = els.grade.value; render(); });
els.kind.addEventListener('change', () => { filters.kind = els.kind.value; render(); });
els.spoiler.addEventListener('change', () => { filters.spoiler = els.spoiler.checked; render(); });

document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ earned: [...earned] }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('import').addEventListener('click', () => document.getElementById('import-file').click());
document.getElementById('import-file').addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const ids = Array.isArray(parsed) ? parsed : Array.isArray(parsed.earned) ? parsed.earned : [];
      const known = new Set(trophies.map((t) => t.id));
      const next = new Set(earned);
      let added = 0;
      for (const id of ids) {
        if (known.has(id) && !next.has(id)) { next.add(id); added += 1; }
      }
      earned = next;
      save();
      render();
      alert(`Imported ${added} trophies.`);
    } catch { alert('Could not import that file.'); }
    ev.target.value = '';
  };
  reader.readAsText(file);
});

fetch(DATA_URL)
  .then((r) => { if (!r.ok) throw new Error('trophies.json failed'); return r.json(); })
  .then((data) => {
    trophies = data.trophies || [];
    loadFilters();
    loadEarned();
    render();
  })
  .catch((err) => {
    els.board.innerHTML = `<tr><td colspan="7">Failed to load trophy list: ${esc(err.message)}</td></tr>`;
  });
