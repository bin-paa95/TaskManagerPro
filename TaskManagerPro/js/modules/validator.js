import { CONFIG } from '../config.js';
export function validateTask({ title, priority, category }) {
  const errors = [];
  if (!title || !title.trim()) errors.push('Title is required.');
  if (title && title.length > CONFIG.MAX_TITLE_LEN) errors.push(`Title too long (max ${CONFIG.MAX_TITLE_LEN}).`);
  if (!['low','medium','high'].includes(priority)) errors.push('Invalid priority.');
  if (!category) errors.push('Category required.');
  return { ok: errors.length === 0, errors };
}
