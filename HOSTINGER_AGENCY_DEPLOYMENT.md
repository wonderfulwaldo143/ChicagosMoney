# Hostinger Agency Plan - Deployment Guide

## Overview
This guide is specifically tailored for deploying Chicago's Money to Hostinger's Agency Hosting Plan, which offers enhanced features for web professionals managing multiple client websites.

## Hostinger Agency Plan Features

### Core Features
- **Client & Team Collaboration**: Secure access sharing per site
- **Full Website Isolation**: Each website operates independently for enhanced security
- **Scalability**: Supports up to 200 websites with superior performance
- **Priority 24/7 Support**: Faster response times and multilingual WordPress experts
- **Exclusive Referral Program**: Earn commissions and offer client discounts

### Technical Specifications
- **SSH Access**: Port 22 (standard SSH)
- **SFTP Access**: Port 65002 (Hostinger-specific SFTP)
- **File Manager**: Full hPanel File Manager access
- **Database**: MySQL database management
- **Backup**: Automated backup systems
- **CDN**: Built-in caching and CDN

## Deployment Methods

### Method 1: Automated rsync Deployment (Recommended)
**Script**: `deploy-quick.sh`

```bash
./deploy-quick.sh
```

**Features:**
- ✅ Hostinger Agency plan optimized
- ✅ SSH/SFTP port selection (22/65002)
- ✅ Automated pre-deployment checks
- ✅ Version tracking and cache busting
- ✅ Post-deployment testing

### Method 2: Manual hPanel Upload
**Best for**: Quick fixes or when automated deployment fails

1. **Access hPanel**: Log into your Hostinger control panel
2. **File Manager**: Navigate to File Manager
3. **Upload Files**: Go to `public_html/` directory
4. **Upload**: Drag and drop or upload files
5. **Clear Cache**: Advanced → Website → Clear Website Cache

### Method 3: Third-Party Integration
**DeployHQ Integration**:
- Connect GitHub repository to DeployHQ
- Configure Hostinger server with SSH/SFTP credentials
- Set deployment path to `public_html/`
- Enable automatic deployments

**DeployBot Integration**:
- Similar setup to DeployHQ
- Automated deployments on Git commits
- Built-in rollback capabilities

## Configuration for Agency Plan

### SSH/SFTP Credentials
Your Hostinger Agency plan provides:
- **SSH Username**: Your account username
- **SSH Password**: Your account password or SSH key
- **Hostname**: Your server IP or domain
- **SSH Port**: 22
- **SFTP Port**: 65002

### File Structure
```
public_html/
├── index.html          # Main website file
├── styles.css          # Stylesheet
├── script.js           # JavaScript
├── sw.js              # Service worker
├── manifest.json       # PWA manifest
├── version.txt        # Version tracking
├── deploy-info.php    # Deployment verification
├── IMG/              # Images directory
├── icons/             # Favicon and app icons
├── api/               # PHP API endpoints
└── css/               # Additional stylesheets
```

## Pre-Deployment Checklist

### Agency Plan Specific
- [ ] **SSH Access Enabled**: Verify SSH is enabled in hPanel
- [ ] **Client Access**: Ensure proper client collaboration settings
- [ ] **Website Isolation**: Confirm site operates independently
- [ ] **Backup**: Create backup before deployment
- [ ] **Performance**: Check Agency plan performance metrics

### Standard Checks
- [ ] All critical files present (`index.html`, `styles.css`, `script.js`, etc.)
- [ ] No `noindex` meta tags in production
- [ ] Service worker cache version updated
- [ ] Version file updated with timestamp
- [ ] Images optimized (< 200KB each)

## Deployment Process

### Step 1: Pre-Deployment
```bash
# Test deployment configuration
./test-deployment.sh

# Verify Hostinger Agency plan settings
./deploy-quick.sh
```

### Step 2: Choose Protocol
When prompted, select:
- **SSH (port 22)**: For standard SSH connections
- **SFTP (port 65002)**: For Hostinger-specific SFTP

### Step 3: Deploy
The script will:
1. Update version tracking
2. Update service worker cache
3. Sync files via rsync
4. Test deployed URLs
5. Provide post-deployment checklist

### Step 4: Post-Deployment
1. **Clear Hostinger Cache**: hPanel → Advanced → Website → Clear Website Cache
2. **Test Site**: Visit `https://chicagosmoney.com/deploy-info.php`
3. **Verify Version**: Check timestamp matches deployment
4. **Test Functionality**: Verify all features work correctly

## Agency Plan Benefits

### Client Management
- **Secure Access Sharing**: Grant clients access to their specific sites
- **Team Collaboration**: Multiple team members can manage deployments
- **Isolated Environments**: Each website operates independently

### Performance
- **Optimized Infrastructure**: Enhanced performance for up to 200 websites
- **Priority Support**: Faster response times for technical issues
- **Built-in CDN**: Automatic caching and content delivery

### Business Features
- **Referral Program**: Earn commissions on client referrals
- **Client Discounts**: Offer special pricing to your clients
- **Professional Tools**: Advanced management features

## Troubleshooting

### Common Issues

**SSH Connection Failed**:
- Verify SSH is enabled in hPanel
- Check username and password
- Try SFTP port 65002 instead of SSH port 22

**Files Not Updating**:
- Clear Hostinger cache via hPanel
- Check file permissions
- Verify files uploaded to correct directory

**Performance Issues**:
- Check Agency plan performance metrics
- Optimize images and code
- Use Hostinger's built-in CDN

### Support
- **Priority Support**: 24/7 multilingual support
- **WordPress Experts**: Specialized WordPress assistance
- **Documentation**: Comprehensive Hostinger guides

## Security Considerations

### Agency Plan Security
- **Website Isolation**: Each site operates independently
- **Secure Access**: Client-specific access controls
- **Backup Systems**: Automated backup and recovery

### Deployment Security
- **SSH Keys**: Use SSH key authentication when possible
- **Secure Credentials**: Never commit passwords or keys
- **File Permissions**: Ensure proper file permissions

## Monitoring and Maintenance

### Agency Plan Monitoring
- **Performance Metrics**: Monitor site performance
- **Client Access**: Track client usage and access
- **Resource Usage**: Monitor resource consumption

### Deployment Monitoring
- **Version Tracking**: Monitor deployment versions
- **Error Logging**: Track deployment errors
- **Performance Testing**: Regular performance checks

## Next Steps

1. **Set Up SSH Access**: Enable SSH in hPanel
2. **Configure Deployment**: Run `./deploy-quick.sh`
3. **Test Deployment**: Verify all functionality
4. **Set Up Monitoring**: Monitor site performance
5. **Client Access**: Configure client collaboration features

For additional support, contact Hostinger's Priority Support team through your Agency plan dashboard.
