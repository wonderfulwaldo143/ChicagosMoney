# Agent Playbook

Use this guide as the quick reference for working safely and efficiently in this repo.

## Quick Checklist
- Confirm the task scope, inspect the existing implementation, and note any related docs (e.g., `CLAUDE.md`, `CLAUDE_SITE.md`, `FORMSPREE_SETUP.md`).
- Make focused changes that match current patterns in HTML, CSS, and JS.
- Preview updates locally, run manual smoke tests, and check the console before wrapping up.
- Review the diff, ensure filenames and casing remain consistent, and leave the repo in a buildable state.

## Repository Layout
- Primary site files now live at the repository root (`index.html`, `styles.css`, `script.js`, service worker, manifest, etc.).
- Image assets belong in `IMG/` with kebab-case filenames (e.g., `hero-mobile.jpg`).
- Additional static assets (favicons, sitemap, feeds) stay alongside the main files unless a dedicated folder already exists.
- Configuration references: `FORMSPREE_SETUP.md` for forms, `CHANGELOG.md` for shipped changes.

## Local Workflow
- Serve the site without a build step: `python3 -m http.server 8000` then open `http://localhost:8000/`.
- Optional formatting (if available locally): `npx prettier -w index.html styles.css script.js`.
- When touching CSS/JS, reuse existing utilities/components; avoid introducing frameworks or build dependencies.

## Coding Standards
- Indentation 2 spaces, UTF-8 encoding, LF line endings.
- HTML: use semantic tags, keep attribute order consistent (`id`, `class`, `data-*`, others), and avoid inline event handlers.
- CSS: prefer Flexbox/Grid, write classes in kebab-case, group variables and utilities near the top of a file, minimize ID selectors.
- JS: modern ES6+, functions/variables in camelCase, wrap new code to avoid leaking globals (modules or IIFE), sanitize any user input before use.

## QA Expectations
- Smoke test after changes: load the page, ensure links/forms work, and confirm no console errors or missing assets.
- Responsive check at least at 360px, 768px, 1024px, and 1440px.
- Accessibility pass: Lighthouse or equivalent, verify keyboard navigation, alt text, and contrast where touched.
- Cross-browser sanity check in the latest Chrome and Firefox.

## Version Control & Handoff
- Use Conventional Commit messages (e.g., `feat: add sticky header`, `fix: correct mobile nav z-index`, `docs: update forms guide`).
- Keep PRs small. Include change summary, rationale, before/after screenshots for UI shifts, linked issue/task, and manual test notes.
- Document noteworthy behavior changes in `CHANGELOG.md` when applicable.

## Security & Housekeeping
- Never commit secrets or API keys; reference `FORMSPREE_SETUP.md` for form configuration.
- Prefer external assets over inline styles/scripts unless there's a clear need.
- Optimize new images before committing (target under ~200 KB when practical) and keep filenames stable.
- Clean up temporary files or debugging code before submitting work.
