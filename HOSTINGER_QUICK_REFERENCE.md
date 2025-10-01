# Hostinger Agency Plan - Quick Reference

## 🚀 Quick Deployment Commands

```bash
# Test deployment setup
./test-deployment.sh

# Deploy to Hostinger Agency plan
./deploy-quick.sh
```

## 🔧 Hostinger Agency Plan Specs

| Feature | Specification |
|---------|---------------|
| **Plan** | Agency Hosting |
| **Websites** | Up to 200 |
| **SSH Port** | 22 |
| **SFTP Port** | 65002 |
| **Support** | Priority 24/7 |
| **Isolation** | Full website isolation |
| **Collaboration** | Client & team access |

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] SSH enabled in hPanel
- [ ] Critical files present
- [ ] Service worker cache version updated
- [ ] Version file updated

### During Deployment
- [ ] Choose SSH (port 22) or SFTP (port 65002)
- [ ] Enter SSH credentials
- [ ] Confirm deployment

### Post-Deployment
- [ ] Clear Hostinger cache (hPanel → Advanced → Website → Clear Website Cache)
- [ ] Test: `https://chicagosmoney.com/deploy-info.php`
- [ ] Verify version timestamp
- [ ] Test site functionality

## 🔑 SSH/SFTP Credentials

**SSH Connection:**
- Host: `your-server-ip` or `chicagosmoney.com`
- Port: `22`
- Username: `your-hostinger-username`
- Password: `your-hostinger-password`

**SFTP Connection:**
- Host: `your-server-ip` or `chicagosmoney.com`
- Port: `65002`
- Username: `your-hostinger-username`
- Password: `your-hostinger-password`

## 📁 File Structure

```
public_html/
├── index.html          # Main page
├── styles.css          # Stylesheet
├── script.js           # JavaScript
├── sw.js              # Service worker
├── manifest.json       # PWA manifest
├── version.txt        # Version tracking
├── deploy-info.php    # Deployment verification
├── IMG/              # Images
├── icons/             # Favicons
├── api/               # PHP APIs
└── css/               # Additional styles
```

## 🛠️ Troubleshooting

**Connection Issues:**
- Try SFTP port 65002 instead of SSH port 22
- Verify SSH is enabled in hPanel
- Check username/password

**Files Not Updating:**
- Clear Hostinger cache
- Check file permissions
- Verify correct directory

**Performance Issues:**
- Use Agency plan CDN
- Optimize images
- Check performance metrics

## 📞 Support

- **Priority Support**: 24/7 multilingual
- **WordPress Experts**: Specialized assistance
- **Agency Features**: Client collaboration tools

## 🔄 Alternative Deployment Methods

1. **hPanel File Manager**: Manual upload via web interface
2. **DeployHQ**: Automated Git deployments
3. **DeployBot**: Third-party deployment service
4. **FTP Client**: Traditional FTP/SFTP upload

---

**Ready to deploy?** Run `./deploy-quick.sh` and follow the prompts!
