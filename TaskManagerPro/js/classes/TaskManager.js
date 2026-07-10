import { Task } from './Task.js';

export class TaskManager {
  #tasks = [];
  constructor(initial = []) { this.replaceAll(initial); }

  get all(){ return [...this.#tasks]; }
  get length(){ return this.#tasks.length; }

  *activeTasks(){ for (const t of this.#tasks) if (!t.completed) yield t; }

  add(data){ const t = new Task(data); this.#tasks.unshift(t); return t; }
  remove(id){ this.#tasks = this.#tasks.filter(t => t.id !== id); }
  find(id){ return this.#tasks.find(t => t.id === id); }
  toggle(id){ const t = this.find(id); if (t) t.toggle(); }
  update(id, patch){ const t = this.find(id); if (t) t.update(patch); }
  replaceAll(list){ this.#tasks = list.map(x => x instanceof Task ? x : new Task(x)); }

  filter({ status='all', query='', priority='' } = {}){
    const q = query.trim().toLowerCase();
    return this.#tasks.filter(t => {
      if (status === 'active' && t.completed) return false;
      if (status === 'completed' && !t.completed) return false;
      if (status === 'high' && t.priority !== 'high') return false;
      if (priority && t.priority !== priority) return false;
      if (q && !t.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  stats(){
    const total = this.#tasks.length;
    const done = this.#tasks.filter(t => t.completed).length;
    const active = total - done;
    const high = this.#tasks.filter(t => t.priority === 'high' && !t.completed).length;
    const pct = total ? Math.round((done/total)*100) : 0;
    return { total, done, active, high, pct };
  }

  toJSON(){ return this.#tasks; }
}
