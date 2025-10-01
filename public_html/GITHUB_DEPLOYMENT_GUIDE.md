# GitHub Deployment Guide - Hostinger Agency Plan

## 🚀 Deployment Options from GitHub

You have **3 main ways** to deploy your Chicago's Money website from GitHub to Hostinger Agency plan:

### **Option 1: Local Clone + Manual Deployment**
**Best for**: Full control, testing before deployment

```bash
# Clone repository locally
git clone https://github.com/wonderfulwaldo143/ChicagosMoney.git
cd ChicagosMoney

# Test deployment setup
./test-deployment.sh

# Deploy to Hostinger
./deploy-quick.sh
```

**Pros:**
- ✅ Full control over deployment process
- ✅ Can test locally before deploying
- ✅ Interactive prompts for credentials
- ✅ Immediate feedback and error handling

**Cons:**
- ❌ Requires local setup
- ❌ Manual process each time

---

### **Option 2: GitHub Actions (Automated)**
**Best for**: Automatic deployments on every push

#### Setup Steps:

1. **Add GitHub Secrets** (in your GitHub repository):
   - Go to: Settings → Secrets and variables → Actions
   - Add these secrets:
     ```
     HOSTINGER_HOST=your-server-ip-or-domain
     HOSTINGER_USER=your-hostinger-username
     HOSTINGER_SSH_KEY=your-ssh-private-key
     HOSTINGER_SSH_PORT=22
     HOSTINGER_PATH=public_html
     ```

2. **Push the workflow file**:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "feat: add GitHub Actions deployment workflow"
   git push origin main
   ```

3. **Deploy automatically**:
   - Every push to `main` branch triggers deployment
   - Or manually trigger via GitHub Actions tab

**Pros:**
- ✅ Fully automated
- ✅ Deploys on every push
- ✅ No local setup required
- ✅ Deployment history in GitHub

**Cons:**
- ❌ Requires SSH key setup
- ❌ Less control over deployment process

---

### **Option 3: DeployHQ Integration**
**Best for**: Professional deployment management

#### Setup Steps:

1. **Create DeployHQ Account**:
   - Go to [DeployHQ.com](https://www.deployhq.com)
   - Sign up and connect GitHub

2. **Configure Hostinger Server**:
   ```
   Protocol: SSH/SFTP
   Hostname: your-server-ip-or-domain
   Username: your-hostinger-username
   Password: your-hostinger-password
   Port: 22 (SSH) or 65002 (SFTP)
   Deployment Path: public_html/
   ```

3. **Set Up Project**:
   - Repository: `wonderfulwaldo143/ChicagosMoney`
   - Branch: `main`
   - Auto-deploy on push: ✅

**Pros:**
- ✅ Professional deployment management
- ✅ Easy rollbacks
- ✅ Deployment history and logs
- ✅ Team collaboration features

**Cons:**
- ❌ Third-party service (costs money)
- ❌ Additional setup required

---

## 🔧 GitHub Actions Setup (Recommended)

### Step 1: Generate SSH Key
```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@chicagosmoney.com"

# Copy public key to Hostinger
cat ~/.ssh/id_rsa.pub
# Add this to your Hostinger SSH keys in hPanel
```

### Step 2: Add GitHub Secrets
In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `HOSTINGER_HOST` | `your-server-ip` | Your Hostinger server IP or domain |
| `HOSTINGER_USER` | `your-username` | Your Hostinger username |
| `HOSTINGER_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Your SSH private key |
| `HOSTINGER_SSH_PORT` | `22` | SSH port (22) or SFTP port (65002) |
| `HOSTINGER_PATH` | `public_html` | Deployment directory |

### Step 3: Commit and Push
```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add automated deployment to Hostinger Agency plan"
git push origin main
```

### Step 4: Monitor Deployment
- Go to **Actions** tab in GitHub
- Watch the deployment workflow run
- Check deployment status and logs

---

## 📋 Deployment Workflow

### What Happens During Deployment:

1. **Code Checkout**: GitHub Actions checks out your code
2. **SSH Setup**: Configures SSH connection to Hostinger
3. **Version Update**: Updates `version.txt` with timestamp
4. **Cache Busting**: Updates service worker cache version
5. **File Sync**: Uses rsync to upload files to Hostinger
6. **Testing**: Tests deployed URLs
7. **Notification**: Reports deployment success/failure

### Post-Deployment Steps:

1. **Clear Hostinger Cache**: hPanel → Advanced → Website → Clear Website Cache
2. **Verify Deployment**: Visit `https://chicagosmoney.com/deploy-info.php`
3. **Test Functionality**: Ensure all features work correctly

---

## 🛠️ Troubleshooting

### GitHub Actions Issues:

**SSH Connection Failed**:
- Verify SSH key is added to Hostinger
- Check `HOSTINGER_HOST` secret is correct
- Ensure SSH is enabled in hPanel

**Deployment Failed**:
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Test SSH connection manually

**Files Not Updating**:
- Clear Hostinger cache via hPanel
- Check file permissions
- Verify deployment path is correct

### Manual Deployment Fallback:

If automated deployment fails:
```bash
# Clone locally and deploy manually
git clone https://github.com/wonderfulwaldo143/ChicagosMoney.git
cd ChicagosMoney
./deploy-quick.sh
```

---

## 🎯 Recommended Workflow

### For Development:
1. **Make changes** locally
2. **Test locally** with `python3 -m http.server 8000`
3. **Commit and push** to GitHub
4. **GitHub Actions** automatically deploys
5. **Clear Hostinger cache** via hPanel
6. **Test live site**

### For Quick Fixes:
1. **Make changes** directly in GitHub (or locally)
2. **Push to main** branch
3. **Wait for deployment** (2-3 minutes)
4. **Clear cache** and test

---

## 📊 Monitoring

### GitHub Actions:
- **Deployment History**: Actions tab shows all deployments
- **Success/Failure**: Clear status indicators
- **Logs**: Detailed deployment logs for debugging

### Hostinger Agency Plan:
- **Performance Metrics**: Monitor site performance
- **Client Access**: Track client usage
- **Resource Usage**: Monitor resource consumption

---

## 🚀 Next Steps

1. **Choose your deployment method** (GitHub Actions recommended)
2. **Set up GitHub secrets** for automated deployment
3. **Test deployment** with a small change
4. **Monitor** deployment process
5. **Set up notifications** for deployment status

**Ready to deploy?** Choose your preferred method and follow the setup steps!
