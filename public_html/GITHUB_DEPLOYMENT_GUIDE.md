# GitHub Deployment Guide – Hostinger Cloud Startup

## 🚀 Deployment Options from GitHub

You can ship Chicago's Money to the Hostinger Cloud Startup server in three primary ways:

1. **Local clone + manual deploy** – maximum control, run scripts from your machine.
2. **GitHub Actions** – automated deploy on push (recommended once secrets are set).
3. **DeployHQ** – hosted deployment pipeline with rollback/history.

---

## Option 1: Local Clone + Manual Deployment

**Best for:** full control, local testing before pushing live.

```bash
git clone https://github.com/wonderfulwaldo143/ChicagosMoney.git
cd ChicagosMoney/public_html

# Sanity check
./test-deployment.sh

# Guided deployment (interactive)
./deploy.sh

# Or fully automated with version + SW updates
./deploy-quick.sh
```

**Pros**
- ✅ Works anywhere you can run Bash + rsync
- ✅ Manual verification before syncing
- ✅ Immediate feedback on errors

**Cons**
- ❌ Requires local shell + SSH access
- ❌ You must trigger deployments manually

---

## Option 2: GitHub Actions (Automated)

**Best for:** push-to-deploy, consistent releases, audit trail in GitHub.

### Step 1 – Add Secrets
In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Example Value | Purpose |
|--------|---------------|---------|
| `HOSTINGER_HOST` | `chicagosmoney.com` | SSH host / server IP |
| `HOSTINGER_USER` | `your-username` | Hostinger account username |
| `HOSTINGER_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Private key with no passphrase (Base64 literal) |
| `HOSTINGER_SSH_PORT` | `22` | Cloud Startup uses port 22 for SSH/SFTP |
| `HOSTINGER_PATH` | `~/domains/chicagosmoney.com/public_html` | Deployment target |

Add the accompanying **public** key to hPanel → SSH Access.

### Step 2 – Commit Workflow
Ensure `.github/workflows/deploy.yml` is staged, then:

```bash
git add .github/workflows/deploy.yml
git commit -m "chore: enable GitHub Actions deploy to Hostinger cloud"
git push origin main
```

Every push to `main` will now trigger the workflow (manual dispatch via Actions tab also available).

**Pros**
- ✅ Fully automated once configured
- ✅ Deployment history + logs in GitHub
- ✅ Integrates with required reviews / PRs

**Cons**
- ❌ Requires SSH key management
- ❌ Debugging is via CI logs

---

## Option 3: DeployHQ Integration

**Best for:** teams wanting UI-driven deployments, scheduled releases, and GUI diffing.

Key settings (full guide in `DEPLOYHQ_SETUP.md`):
- Protocol: SSH/SFTP
- Host: `chicagosmoney.com` (or server IP)
- Port: `22`
- Path: `~/domains/chicagosmoney.com/public_html/`
- Repository: `wonderfulwaldo143/ChicagosMoney`

---

## GitHub Actions Workflow – What It Does

1. Checks out `main`.
2. Configures SSH with the provided key.
3. Runs the same version + service-worker bump as `deploy-quick.sh`.
4. rsyncs the repository to `~/domains/chicagosmoney.com/public_html/`.
5. Optionally curls health-check URLs (`/` and `/deploy-info.php`).

### Post-Deployment Reminders
- Clear cache: hPanel → Websites → Manage → CDN & Cache → Clear cache.
- Visit `https://chicagosmoney.com/` & `/deploy-info.php` to confirm.
- Test mobile redirect, salary lookup, contact flows.
- Run PageSpeed Insights (mobile + desktop).

---

## Troubleshooting Cheat Sheet

| Problem | Quick Fix |
|---------|-----------|
| **GitHub Actions: SSH failed** | Ensure SSH key public half is in hPanel; verify hostname/IP; confirm SSH enabled. |
| **Permissions denied** | Regenerate key pair; ensure correct username; check file ownership on server. |
| **Files appear stale** | Clear Hostinger cache and browser cache; confirm workflow bumped service worker cache. |
| **Wrong directory** | Confirm `HOSTINGER_PATH` or rsync target equals `~/domains/chicagosmoney.com/public_html`. |
| **Need manual deploy** | Fallback to `git clone` locally and run `./deploy-quick.sh`. |

---

## Recommended Workflow

1. Develop locally, open PRs, pass checks.
2. Merge into `main`.
3. GitHub Actions deploys automatically.
4. Verify production + clear cache.
5. Tag release if desired.

Keep `deploy-config.json`, docs, and GitHub secrets aligned with hosting changes to avoid drift. Happy shipping! 🚀
