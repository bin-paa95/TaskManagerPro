import { CONFIG } from './config.js';
import { TaskManager } from './classes/TaskManager.js';
import { storage } from './modules/storage.js';
import { fetchSampleTasks } from './modules/api.js';
import { debounce } from './modules/debounce.js';
import { throttle } from './modules/throttle.js';
import { createLogger } from './modules/logger.js';
import { validateTask } from './modules/validator.js';
import { el, renderList, renderStats, setActiveFilter, showToast, greet } from './modules/ui.js';

const log = createLogger('info');

export class App {
  constructor(){
    this.tm = new TaskManager(storage.load());
    this.state = { filter: 'all', query: '' };
    this.listEl = el('taskList');
  }

  async init(){
    greet();
    this.applyTheme(storage.loadTheme());
    if (this.tm.length === 0){
      const samples = await fetchSampleTasks();
      samples.forEach(s => this.tm.add(s));
      this.persist();
    }
    this.bind();
    this.render();
  }

  bind(){
    el('taskForm').addEventListener('submit', (e)=>this.onAdd(e));
    el('searchInput').addEventListener('input', debounce(e => {
      this.state.query = e.target.value; this.render();
    }, CONFIG.DEBOUNCE_MS));
    document.querySelectorAll('[data-filter]').forEach(n => {
      n.addEventListener('click', ()=>{ this.state.filter = n.dataset.filter; setActiveFilter(this.state.filter); this.render(); });
    });
    this.listEl.addEventListener('click', (e)=>this.onListClick(e));
    el('themeToggle').addEventListener('click', ()=>this.toggleTheme());
    el('exportBtn').addEventListener('click', ()=>this.exportJson());
    el('importInput').addEventListener('change', (e)=>this.importJson(e));
    window.addEventListener('scroll', throttle(()=>{
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 || 0;
      el('scrollProgress').style.width = pct + '%';
    }, CONFIG.THROTTLE_MS));
  }

  onAdd(e){
    e.preventDefault();
    const data = {
      title: el('titleInput').value,
      priority: el('prioritySelect').value,
      category: el('categorySelect').value,
      due: el('dueInput').value,
    };
    const { ok, errors } = validateTask(data);
    if (!ok){ showToast(errors[0]); return; }
    this.tm.add(data);
    e.target.reset();
    el('prioritySelect').value = 'medium';
    el('categorySelect').value = 'work';
    this.persist(); this.render();
    showToast('✨ Task added');
  }

  onListClick(e){
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const li = e.target.closest('.task'); const id = li?.dataset.id;
    if (!id) return;
    const action = btn.dataset.action;
    if (action === 'toggle'){
      this.tm.toggle(id); this.persist(); this.render();
    } else if (action === 'delete'){
      li.classList.add('removing');
      setTimeout(()=>{ this.tm.remove(id); this.persist(); this.render(); showToast('🗑️ Deleted'); }, 280);
    } else if (action === 'edit'){
      const t = this.tm.find(id);
      const next = prompt('Edit task title:', t.title);
      if (next && next.trim()){ this.tm.update(id, { title: next.trim() }); this.persist(); this.render(); showToast('✏️ Updated'); }
    }
  }

  render(){
    const visible = this.tm.filter({ status: this.state.filter, query: this.state.query });
    renderList(this.listEl, visible);
    renderStats(this.tm.stats());
  }

  persist(){ storage.save(this.tm.toJSON()); }

  toggleTheme(){
    const cur = document.documentElement.dataset.theme || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    this.applyTheme(next); storage.saveTheme(next);
  }
  applyTheme(t){ document.documentElement.dataset.theme = t; }

  exportJson(){
    const blob = new Blob([JSON.stringify(this.tm.toJSON(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'taskflow-export.json'; a.click();
    URL.revokeObjectURL(url); showToast('⬇️ Exported');
  }

  importJson(e){
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (!Array.isArray(data)) throw new Error('Invalid file');
        this.tm.replaceAll(data);
        this.persist(); this.render();
        showToast('⬆️ Imported ' + data.length + ' tasks');
      } catch(err){ log.error(err); showToast('❌ Invalid JSON'); }
    };
    r.readAsText(file); e.target.value = '';
  }
}
