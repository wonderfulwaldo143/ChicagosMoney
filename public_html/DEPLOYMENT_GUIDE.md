# Chicago's Money - Deployment Guide

## Overview
This repository contains multiple deployment options for Chicago's Money website hosted on Hostinger.

## Deployment Methods

### 1. Quick Deployment (Recommended)
**File:** `deploy-quick.sh`
**Best for:** Regular deployments with automated checks

```bash
# Make executable and run
chmod +x deploy-quick.sh
./deploy-quick.sh
```

**Features:**
- ✅ Automated pre-deployment checks
- ✅ Version file updates
- ✅ Service worker cache busting
- ✅ Interactive SSH credential input
- ✅ Post-deployment URL testing
- ✅ Comprehensive error handling

### 2. Original Deployment Script
**File:** `deploy.sh`
**Best for:** Manual deployment with detailed options

```bash
# Make executable and run
chmod +x deploy.sh
./deploy.sh
```

**Features:**
- ✅ File existence checks
- ✅ SEO validation
- ✅ Image optimization suggestions
- ✅ Manual rsync setup
- ✅ Post-deployment checklist

### 3. Manual Upload via hPanel
**Best for:** One-off fixes or when scripts fail

1. Log into Hostinger hPanel
2. Navigate to File Manager
3. Go to `public_html/`
4. Upload changed files
5. Clear cache: Advanced → Website → Clear Website Cache

## Configuration

### deploy-config.json
Contains deployment settings:
- Site URL and paths
- File inclusion/exclusion rules
- Pre/post deployment tasks
- Testing URLs

## Pre-Deployment Checklist

### Required Files
- [ ] `index.html` - Main page
- [ ] `styles.css` - Stylesheet
- [ ] `script.js` - JavaScript
- [ ] `sw.js` - Service worker
- [ ] `manifest.json` - PWA manifest
- [ ] `version.txt` - Version tracking
- [ ] `deploy-info.php` - Deployment verification

### SEO Checks
- [ ] No `noindex` meta tag in production
- [ ] Proper meta descriptions
- [ ] Canonical URLs set
- [ ] Open Graph tags present

### Performance Checks
- [ ] Images optimized (< 200KB each)
- [ ] CSS/JS minified (if applicable)
- [ ] Service worker cache version updated
- [ ] Critical resources preloaded

## Post-Deployment Tasks

### Immediate (Required)
1. **Clear Hostinger Cache**
   - hPanel → Advanced → Website → Clear Website Cache
   - Wait 1-2 minutes

2. **Test Core Functionality**
   - Visit: `https://chicagosmoney.com/`
   - Check: `https://chicagosmoney.com/deploy-info.php`
   - Verify version timestamp matches deployment

3. **Browser Testing**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Test in incognito mode
   - Check mobile responsiveness

### Recommended (Within 24 hours)
- [ ] Submit sitemap to Google Search Console
- [ ] Test form submissions
- [ ] Verify analytics tracking
- [ ] Check PWA installation
- [ ] Run PageSpeed Insights
- [ ] Test on multiple devices

## Troubleshooting

### Files Not Updating
1. **Check version.txt**: Visit `/deploy-info.php` to see server timestamps
2. **Clear all caches**: Hostinger + browser
3. **Verify file paths**: Ensure files uploaded to `public_html/` root
4. **Check service worker**: Update cache version in `sw.js`

### Deployment Script Issues
1. **SSH Connection**: Verify credentials and port
2. **File Permissions**: Ensure scripts are executable (`chmod +x`)
3. **rsync Missing**: Install via `brew install rsync` (Mac) or package manager

### Common Errors
- **"Permission denied"**: Check SSH key setup or use password auth
- **"No such file or directory"**: Verify remote path exists
- **"Connection refused"**: Check SSH port and firewall settings

## Security Notes

- Never commit SSH keys or passwords
- Use SSH key authentication when possible
- Keep `deploy-config.json` in version control (no secrets)
- Restrict access to `deploy-info.php` if needed

## File Structure

```
ChicagosMoenyRepo/
├── deploy-quick.sh          # Automated deployment
├── deploy.sh                # Original deployment script
├── deploy-config.json       # Configuration file
├── deploy-info.php          # Deployment verification
├── version.txt             # Version tracking
├── sw.js                   # Service worker
└── [website files...]
```

## Support

For deployment issues:
1. Check this guide first
2. Review `deploy-info.php` output
3. Test with manual upload
4. Check Hostinger support documentation
