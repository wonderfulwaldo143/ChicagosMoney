# Hostinger Cloud Startup Deployment Playbook

This guide captures the end-to-end workflow we used to launch Chicago's Money with a mobile-first experience and automated Hostinger deploys. Use it as the template for future sites.

## 1. Repo Preparation
- Keep desktop assets in `public_html` alongside mobile pages (`mobile*.html`).
- Shared mobile styling and behaviour live in `css/mobile.css` and `js/mobile-*.js`.
- Smoke tests are tracked in `docs/mobile-smoke-test.md` and must be updated per project.

## 2. Generate a Fresh SSH Key Pair (per site)
```bash
ssh-keygen -t ed25519 -C "deploy@<site-domain>"
# Accept ~/.ssh/id_ed25519 or provide a unique filename
# Leave passphrase empty for automation
```
Keys are site-specific. Rotate immediately if a private key is exposed.

### Install the Public Key in Hostinger
1. hPanel → Websites → <site> → Advanced → **SSH Access**.
2. Remove old or compromised keys.
3. Paste the contents of `~/.ssh/id_ed25519.pub` into **Add SSH Key** and save.

### Store the Private Key in GitHub
- Repository → Settings → Secrets and variables → Actions → New secret `HOSTINGER_SSH_KEY`.
- Paste the entire `~/.ssh/id_ed25519` block (`-----BEGIN … END OPENSSH PRIVATE KEY-----`).

## 3. GitHub Actions Secrets Needed
- `HOSTINGER_HOST` → server IP or domain (e.g. `82.29.196.93`).
- `HOSTINGER_USER` → SSH username from hPanel (e.g. `u419904569`).
- `HOSTINGER_SSH_PORT` → usually `65002` on Cloud Startup.
- `HOSTINGER_PATH` → `~/domains/<domain>/public_html`.
- `HOSTINGER_SSH_KEY` → private key from step 2.
- Optional: `HOSTINGER_FTP_*` only if you need the FTP fallback.

## 4. GitHub Workflow (`.github/workflows/hostinger-deploy.yml`)
Steps executed:
1. Checkout repository.
2. Write private key to `~/.ssh/id_ed25519` with correct permissions.
3. `ssh-keyscan` the Hostinger host to avoid prompts.
4. `rsync -avz --delete` from `public_html/` to the remote path using the secrets.
5. Hit `https://<domain>/` and `/deploy-info.php` to confirm 200 responses.

For new sites, copy the workflow verbatim and only update the secrets.

## 5. Local Deploy Script (`deploy-quick.sh`)
- Runs pre-checks (critical files, SEO, image sizes).
- Updates `version.txt` and bumps the service worker cache version.
- Performs the same rsync command as CI.

Usage:
```bash
cd public_html
./test-deployment.sh   # optional preflight
./deploy-quick.sh      # prompts for SSH target/port
```
Use the expect helper only when password fallback is unavoidable; prefer SSH keys.

## 6. Redirect & Mobile Routing
`js/mobile-redirect.js` detects mobile viewports/UA and routes visitors to `/mobile*.html`. Users can stay on desktop with `?view=desktop`. Each mobile page uses `js/mobile-shared.js` for nav logic and link highlighting.

## 7. Smoke Test Checklist
See `docs/mobile-smoke-test.md`. Key scenarios:
- Auto-redirect and desktop opt-out behaviour.
- Navigation sheet, bottom dock, and safe-area padding.
- Salary lookup (Socrata API connectivity + CSV export).
- Every mobile route (`/mobile.html`, `/mobile-salary.html`, `/mobile-budget.html`, `/mobile-contact.html`, `/mobile-blog.html`, `/mobile-about.html`).

## 8. Common Issues & Fixes
- **SSH “permission denied”** → Confirm the public key is installed in Hostinger, rotate keys if leaked, double-check secrets.
- **Actions still asking for password** → Remove old keys from Hostinger and update the private key secret.
- **Outdated assets after deploy** → `deploy-quick.sh` bumps `sw.js` cache; ensure that commit is pushed post deploy.
- **Desktop testers redirected to mobile** → Append `?view=desktop` or click the “Desktop site” button (clears the mobile preference).

## 9. Launch Checklist (per site)
1. Generate and register a new SSH key pair.
2. Populate GitHub secrets.
3. Copy workflow + scripts into the new repo.
4. Run `./test-deployment.sh` and `./deploy-quick.sh` locally.
5. Push changes; confirm GitHub Actions deploy succeeds.
6. Clear Hostinger cache (hPanel → CDN & Cache → Clear cache).
7. Execute mobile smoke tests on iOS and Android hardware.
8. Capture screenshots for marketing or portfolio use.

## 10. Maintenance
- Rotate keys if exposed or when staff changes occur.
- Update documentation whenever the workflow evolves.
- Keep smoke tests current with product changes.
- Enforce branch protections so the deploy workflow only runs on green builds.

---
To onboard a new site: duplicate the repo structure, redo steps 2–4 with the new domain, and follow the launch checklist. The rest of the framework drops in unchanged.
