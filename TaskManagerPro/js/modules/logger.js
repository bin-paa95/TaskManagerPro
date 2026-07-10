const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
export function createLogger(min = 'info') {
  const threshold = LEVELS[min] ?? 1;
  const log = (lvl, ...a) => { if (LEVELS[lvl] >= threshold) console[lvl](`[${lvl}]`, ...a); };
  return { debug:(...a)=>log('debug',...a), info:(...a)=>log('info',...a), warn:(...a)=>log('warn',...a), error:(...a)=>log('error',...a) };
}
