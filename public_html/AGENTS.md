# Repository Guidelines

## Project Structure & Module Organization
- Root contains `index.html`, `styles.css`, `script.js` and the `IMG/` assets folder.
- Keep images in `IMG/` (kebab-case names, e.g., `hero-mobile.jpg`).
- Place any additional static assets (favicons, sitemap) at repo root unless a clear subfolder exists.

## Build, Test, and Development Commands
- Serve locally (no build step): `python3 -m http.server 8000` then open `http://localhost:8000/`.
- Optional formatting (if installed locally): `npx prettier -w index.html styles.css script.js`.
- Validate HTML/CSS (manual): use W3C validators or Chrome DevTools > Lighthouse for quick checks.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; UTF-8; LF line endings.
- HTML: semantic tags (`header`, `main`, `section`, `footer`); attributes in consistent order (`id`, `class`, `data-*`, others).
- CSS: classes in kebab-case (e.g., `.site-header`); group variables/utilities first; prefer flex/grid; avoid ID selectors.
- JS: ES6+; functions/variables in camelCase; modules or IIFE to avoid globals; no inline event handlers in HTML.
- Assets: use kebab-case filenames; optimize images before commit (target <200KB when practical).

## Testing Guidelines
- Manual smoke tests: load page, no console errors, links work, forms submit.
- Responsive checks: verify at 360px, 768px, 1024px, 1440px breakpoints.
- Accessibility: run Lighthouse; ensure keyboard navigation and alt text for images.
- Cross-browser: test latest Chrome and Firefox at minimum.

## Commit & Pull Request Guidelines
- Commit messages: Conventional Commits style, e.g., `feat: add sticky header`, `fix: correct mobile nav z-index`, `docs: update forms guide`.
- Scope PRs narrowly; include:
  - Summary of changes and rationale
  - Before/after screenshots (UI changes)
  - Linked issue or task reference
  - Manual test notes (browsers, breakpoints)

## Security & Configuration Tips
- Do not commit secrets or API keys. Configure forms via `FORMSPREE_SETUP.md`.
- Avoid inline scripts/styles where possible; prefer external files.
- Validate/sanitize any user-input handling in `script.js`.

## Agent-Specific Notes
- Keep changes minimal and surgical; match existing patterns.
- If adding tools, avoid introducing build dependencies unless necessary for a clear benefit.
