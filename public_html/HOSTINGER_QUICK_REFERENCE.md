# Hostinger Cloud Startup – Quick Reference

## 🚀 Quick Deployment Commands

```bash
# From the project root
cd public_html

# Dry-run / verification
./test-deployment.sh

# Guided deployment (prompts for rsync command)
./deploy.sh

# Automated deployment with version + SW updates
./deploy-quick.sh
```

## 🔧 Cloud Startup Specs

| Feature | Specification |
|---------|---------------|
| **Plan** | Cloud Startup |
| **Websites** | Up to 300 |
| **Compute** | 2 CPU cores, 3 GB RAM |
| **Storage** | 200 GB NVMe SSD |
| **SSH & SFTP Port** | 22 |
| **Directory** | `~/domains/chicagosmoney.com/public_html/` |
| **Backups** | Daily automated + on-demand |
| **Extras** | Staging, CDN toggle, automatic cache |

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] SSH access enabled in hPanel (Account → SSH Access)
- [ ] Critical files present (`index.html`, `mobile.html`, `styles.css`, `script.js`, `sw.js`, `manifest.json`, `version.txt`)
- [ ] Service worker cache + `version.txt` will update via script
- [ ] Image and asset optimizations complete
- [ ] Optional: download/manual backup before release

### During Deployment
- [ ] Run `./deploy-quick.sh` or `./deploy.sh`
- [ ] Enter SSH target `user@chicagosmoney.com` (or server IP)
- [ ] Confirm rsync command to `~/domains/chicagosmoney.com/public_html/`
- [ ] Monitor rsync output for errors (permissions, disk usage, etc.)

### Post-Deployment
- [ ] Clear cache: hPanel → Websites → Manage → CDN & Cache → Clear cache
- [ ] Verify production URLs render (`/`, `/deploy-info.php`)
- [ ] Confirm `version.txt` timestamp + service worker cache bump
- [ ] Test forms, salary lookup, mobile redirect
- [ ] Run PageSpeed Insights (mobile + desktop)

## 🔑 SSH/SFTP Credentials

- **Host**: `chicagosmoney.com` or server IP
- **Port**: `22`
- **Username**: Hostinger account username
- **Auth**: Password or SSH key (recommended)
- **Remote Path**: `~/domains/chicagosmoney.com/public_html/`

Use the same port (22) for SFTP if connecting via tools like FileZilla.

## 📁 File Structure Reminder

```
~/domains/chicagosmoney.com/public_html/
├── index.html
├── mobile.html
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

## 🛠️ Troubleshooting

| Symptom | Fix |
|---------|-----|
| Permission denied | Re-enable SSH, ensure correct username, verify key permissions |
| Files out of date | Clear Hostinger cache and browser cache; ensure service worker cache version updated |
| Wrong directory | Confirm rsync path is `~/domains/chicagosmoney.com/public_html/` |
| Slow performance | Enable CDN, review caching headers, optimize large images |
| SSH disabled | hPanel → SSH Access → enable; regenerate keys if necessary |

## 📞 Support & Resources

- Hostinger Knowledge Base: [support.hostinger.com](https://support.hostinger.com/)
- Cloud Startup product page: [hostinger.com/cloud-hosting](https://www.hostinger.com/cloud-hosting)
- Internal docs: `HOSTINGER_CLOUD_DEPLOYMENT.md`, `DEPLOYHQ_SETUP.md`

---

Ready to ship? Run `./deploy-quick.sh`, aim at `~/domains/chicagosmoney.com/public_html/`, and you're live! 🚀
