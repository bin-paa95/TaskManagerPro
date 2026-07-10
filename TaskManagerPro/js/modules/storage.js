import { CONFIG } from '../config.js';
export const storage = {
  save(tasks){ try{ localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(tasks)); }catch(e){ console.warn(e); } },
  load(){ try{ return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) ?? []; }catch{ return []; } },
  clear(){ localStorage.removeItem(CONFIG.STORAGE_KEY); },
  saveTheme(t){ localStorage.setItem(CONFIG.THEME_KEY, t); },
  loadTheme(){ return localStorage.getItem(CONFIG.THEME_KEY) || 'light'; },
};
