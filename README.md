# Ivy Training & Consulting UK – GitHub Pages Site

## Preview locally (recommended)
1) Install VS Code
2) Install the **Live Server** extension
3) Open this folder in VS Code
4) Right-click `index.html` → **Open with Live Server**

## Add videos (hero + sessions)
This project already includes MP4 files in `assets/`. The pages are currently wired to these filenames:
- `VIDEO-2026-01-23-11-13-20.mp4` (hero background + hands-on lab clip)
- `VIDEO-2026-01-23-11-13-21.mp4` (classroom-style clip)
- `VIDEO-2026-01-23-11-13-26.mp4` (online/webinar clip)

If you want nicer, stable filenames (recommended), rename the files and update the `<source src="...">` paths in `index.html` and `courses.html`.

## Deploy on GitHub Pages
GitHub → Repo → Settings → Pages → Deploy from branch → `main` / `(root)`.
