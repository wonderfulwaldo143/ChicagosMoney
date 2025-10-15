# DeployHQ Configuration for Hostinger Cloud Startup

## Setup Instructions

### 1. Create DeployHQ Account
- Go to [DeployHQ.com](https://www.deployhq.com)
- Sign up for an account
- Connect your GitHub repository

### 2. Configure Hostinger Server
In DeployHQ, add a new server with these settings:

**Server Details:**
- **Name**: Chicago's Money - Hostinger Cloud
- **Protocol**: SSH/SFTP
- **Hostname**: Your Hostinger server IP or domain
- **Username**: Your Hostinger username
- **Password**: Your Hostinger password
- **Port**: 22 (SSH/SFTP)
- **Deployment Path**: `~/domains/chicagosmoney.com/public_html/`

### 3. Project Configuration
**Repository Settings:**
- **Repository**: `wonderfulwaldo143/ChicagosMoney`
- **Branch**: `main`
- **Build Command**: (leave empty for static site)
- **Deployment Path**: `~/domains/chicagosmoney.com/public_html/`

**Exclude Files:**
```
.git
.github
.gitignore
.vscode
.DS_Store
deploy.sh
deploy-config.json
deploy-quick.sh
test-deployment.sh
DEPLOYMENT_GUIDE.md
HOSTINGER_CLOUD_DEPLOYMENT.md
HOSTINGER_QUICK_REFERENCE.md
docs
*.md
node_modules
.env
backups
*.log
*.tmp
```

### 4. Deployment Triggers
- **Automatic**: Deploy on push to main branch
- **Manual**: Deploy on demand
- **Rollback**: Easy rollback to previous versions

### 5. Post-Deployment Actions
- **Clear Cache**: Manual step via hPanel
- **Test URLs**: Automatic testing
- **Notifications**: Email/Slack notifications

## Benefits of DeployHQ
- ✅ Automated deployments on Git push
- ✅ Easy rollback to previous versions
- ✅ Deployment history and logs
- ✅ Team collaboration features
- ✅ Integration with Hostinger Cloud Startup plan
