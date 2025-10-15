# Hostinger Cloud Startup – Deployment Guide

## Overview
This guide documents how to deploy Chicago's Money on a Hostinger **Cloud Startup** plan. The cloud tier provides dedicated resources, a different directory layout, and standard SSH/SFTP ports compared to the legacy Agency hosting.

## Cloud Startup Highlights

| Capability | Notes |
|------------|-------|
| Dedicated resources | 2 CPU cores, 3 GB RAM (scales with plan) |
| Storage & bandwidth | 200 GB NVMe SSD, unmetered bandwidth |
| Websites | Up to 300 sites per account |
| Backups | Daily automatic backups + on-demand snapshots |
| Access | SSH/SFTP on port 22, hPanel File Manager |
| Performance | Built-in caching, global CDN toggle, staging environments |

## Directory Layout
For each domain Hostinger provisions the following structure:

```
~/domains/<your-domain>/public_html/
├── index.html
├── styles.css
├── script.js
├── sw.js
├── manifest.json
├── version.txt
├── deploy-info.php
├── IMG/
├── icons/
├── api/
└── css/
```

**Important:** Deploy directly into `~/domains/chicagosmoney.com/public_html/`. Avoid creating nested `public_html/public_html` folders.

## Deployment Options

### 1. Automated rsync (Recommended)
- Script: `./deploy-quick.sh`
- Reads `deploy-config.json`
- Updates `version.txt` and service-worker cache
- Uses rsync over SSH/SFTP (port 22) to sync `./` → `~/domains/chicagosmoney.com/public_html/`

### 2. Guided checklist (`deploy.sh`)
- Provides pre-flight checks, rsync command builder, and post-deploy reminders
- Default remote path updated for the cloud layout

### 3. hPanel File Manager
- Upload zipped build via hPanel → Files → File Manager
- Extract inside `domains/chicagosmoney.com/public_html/`

### 4. Third-Party Integrations
- DeployHQ / DeployBot continue to work—point the target directory to `~/domains/chicagosmoney.com/public_html/`

## Pre-Deployment Checklist

- [ ] SSH access enabled for the account
- [ ] `deploy-config.json` reflects the Cloud Startup plan (ports/path)
- [ ] Critical files present (`index.html`, `mobile.html`, `styles.css`, `script.js`, `sw.js`, `manifest.json`, `version.txt`)
- [ ] Service worker cache/version bumped if assets changed
- [ ] `version.txt` timestamp updated by the deployment script
- [ ] Images optimized (< 200 KB where possible)
- [ ] Backups confirmed (automated daily + manual if needed)

## Running `deploy-quick.sh`

```bash
cd public_html
./deploy-quick.sh
```

1. Script performs pre-checks.
2. Prompts for `user@chicagosmoney.com` (or server IP).
3. Choose SSH or SFTP; both use port 22 on Cloud plans.
4. Confirms rsync command targeting `~/domains/chicagosmoney.com/public_html/`.
5. After sync, tests key URLs and prints post-deploy checklist.

## Running `deploy.sh` (Interactive Mode)

```bash
cd public_html
./deploy.sh
```

- Presents pre-deployment checks, optimization tips, and rsync instructions.
- Default target directory = `~/domains/chicagosmoney.com/public_html`.
- Useful when you want a guided flow instead of full automation.

## Post-Deployment Tasks

- [ ] Clear cache: hPanel → Websites → Manage Site → CDN & Caching → Clear cache
- [ ] Verify `https://chicagosmoney.com/` and `https://chicagosmoney.com/deploy-info.php`
- [ ] Confirm `version.txt` timestamp reflects the deployment
- [ ] Test contact forms and API endpoints
- [ ] Check mobile redirect to `mobile.html`
- [ ] Trigger PageSpeed Insights audits (mobile + desktop)

## Troubleshooting

| Issue | Resolution |
|-------|-----------|
| Permission denied | Ensure SSH user matches hosting account; regenerate SSH keys if needed |
| Files syncing to wrong folder | Confirm remote path is `~/domains/chicagosmoney.com/public_html` |
| Changes not visible | Clear Hostinger cache and browser cache; confirm service worker cache version updated |
| Slow performance | Enable CDN, review caching headers, optimize assets |
| SSH disabled | Re-enable SSH from hPanel → Account → SSH Access |

## Best Practices

- Use SSH keys rather than passwords for deployments.
- Keep `deploy-config.json` in sync with hosting changes (ports, paths).
- Store rsync command history in your password manager with environment-specific notes.
- After major releases, download a manual backup snapshot for archival purposes.
- Document any server-level tweaks (PHP version, cron jobs) alongside this guide.

## References

- Hostinger knowledge base: [https://support.hostinger.com/](https://support.hostinger.com/)
- Cloud hosting product page: [https://www.hostinger.com/cloud-hosting](https://www.hostinger.com/cloud-hosting)
- Internal quick reference: `HOSTINGER_QUICK_REFERENCE.md`

Happy shipping! 🚀
