# Task Manager Pro — Premium Dashboard

A glassmorphism task manager built with **vanilla HTML / CSS / JavaScript** (ES Modules).

## Features
- Add / Edit / Delete / Complete tasks
- Priority (High / Medium / Low) with colored badges
- Categories with icons (Work, Personal, Study, Health, Other)
- Due dates with overdue detection
- Search (debounced) & filters (All / Active / Completed / High)
- LocalStorage persistence + JSON Import / Export
- Dark mode with smooth theme switching
- Animated statistic cards + progress ring
- Empty-state illustration, toast notifications, micro-interactions
- Fully responsive (mobile / tablet / desktop)

## Run
Because it uses ES Modules, serve it over HTTP:

```bash
# choose one
npx serve .
python3 -m http.server 8000
```

Then open http://localhost:8000

## Session Mapping (10 sessions)
1. Setup — `index.html`, `css/style.css`
2. Layout & responsive — `layout.css`, `responsive.css`
3. Closures — `makeIdGenerator` in `js/classes/Task.js`
4. Classes — `Task`, `TaskManager` (with private `#tasks`)
5. Modules — `js/modules/*`
6. Storage — `modules/storage.js`
7. Async / Fetch — `modules/api.js` + `data/sample.json`
8. Debounce / Throttle — `modules/debounce.js`, `modules/throttle.js`
9. Validation / Logger — `modules/validator.js`, `modules/logger.js`
10. Final polish — dark mode, stats, progress ring, animations
