const CAT_META = {
  work:    { label: 'Work',     icon: '💼' },
  personal:{ label: 'Personal', icon: '🌿' },
  study:   { label: 'Study',    icon: '📚' },
  health:  { label: 'Health',   icon: '💪' },
  other:   { label: 'Other',    icon: '✨' },
};

export const el = (id) => document.getElementById(id);

export function showToast(msg){
  const t = el('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(showToast._t); showToast._t = setTimeout(()=>t.classList.remove('show'), 2200);
}

export function animateCounter(node, target){
  const start = parseInt(node.textContent, 10) || 0;
  const dur = 500; const t0 = performance.now();
  function step(now){
    const p = Math.min(1, (now - t0)/dur);
    const eased = 1 - Math.pow(1-p, 3);
    node.textContent = Math.round(start + (target - start) * eased);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function badge(cls, text){ return `<span class="badge ${cls}">${text}</span>`; }

function formatDue(due){
  if (!due) return '';
  const d = new Date(due); if (isNaN(d)) return '';
  const today = new Date(); today.setHours(0,0,0,0);
  const overdue = d < today;
  const opts = { month:'short', day:'numeric' };
  return `<span class="badge badge-due ${overdue?'overdue':''}">📅 ${d.toLocaleDateString(undefined,opts)}</span>`;
}

function taskRow(task){
  const cat = CAT_META[task.category] || CAT_META.other;
  return `
  <li class="task ${task.completed ? 'done' : ''}" data-id="${task.id}">
    <button class="checkbox" data-action="toggle" aria-label="Toggle">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M5 12l4 4L19 6" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="task-body">
      <div class="task-title">${escapeHtml(task.title)}</div>
      <div class="task-meta">
        ${badge('badge-'+task.priority, task.priority[0].toUpperCase()+task.priority.slice(1))}
        ${badge('badge-cat', cat.icon+' '+cat.label)}
        ${formatDue(task.due)}
      </div>
    </div>
    <div class="task-actions">
      <button class="icon-mini" data-action="edit" title="Edit">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
      </button>
      <button class="icon-mini danger" data-action="delete" title="Delete">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </li>`;
}

function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

export function renderList(list, tasks){
  list.innerHTML = tasks.map(taskRow).join('');
  el('emptyState').classList.toggle('show', tasks.length === 0);
}

export function renderStats(s){
  animateCounter(el('stTotal'), s.total);
  animateCounter(el('stActive'), s.active);
  animateCounter(el('stDone'), s.done);
  animateCounter(el('stHigh'), s.high);
  el('count-all').textContent = s.total;
  el('count-active').textContent = s.active;
  el('count-done').textContent = s.done;
  el('count-high').textContent = s.high;
  // ring
  const C = 2 * Math.PI * 38;
  el('progRing').setAttribute('stroke-dashoffset', C - (C * s.pct / 100));
  el('progPct').textContent = s.pct + '%';
}

export function setActiveFilter(filter){
  document.querySelectorAll('[data-filter]').forEach(n => {
    n.classList.toggle('active', n.dataset.filter === filter);
  });
  const map = {all:'All Tasks', active:'Active Tasks', completed:'Completed', high:'High Priority'};
  el('listTitle').textContent = map[filter] || 'Tasks';
}

export function greet(){
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning ✨' : h < 18 ? 'Good afternoon 🌤️' : 'Good evening 🌙';
  el('greeting').textContent = g;
}
