import { CONFIG } from '../config.js';
export async function fetchSampleTasks() {
  try {
    const res = await fetch(CONFIG.SAMPLE_URL);
    if (!res.ok) throw new Error('Failed to load samples');
    return await res.json();
  } catch (e) { console.warn('fetchSampleTasks:', e); return []; }
}
export function persistAsync(tasks) {
  return new Promise(resolve => setTimeout(() => resolve(tasks), 120));
}
