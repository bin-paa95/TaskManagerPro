const makeIdGenerator = () => {
  let n = 0;
  return () => `t_${Date.now().toString(36)}_${(++n).toString(36)}`;
};
const nextId = makeIdGenerator();
const INTERNAL = Symbol('internal');

export class Task {
  constructor({ id, title, priority='medium', category='other', due='', completed=false, createdAt }) {
    this.id = id || nextId();
    this.title = String(title).trim();
    this.priority = priority;
    this.category = category;
    this.due = due;
    this.completed = !!completed;
    this.createdAt = createdAt || new Date().toISOString();
    this[INTERNAL] = { touched: Date.now() };
  }
  toggle(){ this.completed = !this.completed; this[INTERNAL].touched = Date.now(); }
  update(patch){ Object.assign(this, patch); this[INTERNAL].touched = Date.now(); }
  duplicate(){ return new Task(structuredClone({ ...this, id: undefined, createdAt: undefined })); }
}
export const createTask = (data) => new Task(data);
