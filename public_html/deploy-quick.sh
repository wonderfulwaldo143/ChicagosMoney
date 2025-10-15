#!/bin/bash

# Chicago's Money - Quick Deployment Script
# Automated deployment with configuration file support

set -euo pipefail

# Load configuration
CONFIG_FILE="deploy-config.json"
if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "❌ Configuration file $CONFIG_FILE not found!"
    exit 1
fi

# Parse JSON config (simple approach)
SITE_URL=$(grep -o '"url": "[^"]*"' "$CONFIG_FILE" | head -n 1 | cut -d'"' -f4)
LOCAL_PATH=$(grep -o '"local_path": "[^"]*"' "$CONFIG_FILE" | head -n 1 | cut -d'"' -f4)
REMOTE_PATH=$(grep -o '"remote_path": "[^"]*"' "$CONFIG_FILE" | head -n 1 | cut -d'"' -f4)
SSH_PORT=$(grep -o '"ssh_port": [0-9]*' "$CONFIG_FILE" | head -n 1 | cut -d':' -f2 | tr -d ' ')
SFTP_PORT=$(grep -o '"sftp_port": [0-9]*' "$CONFIG_FILE" | head -n 1 | cut -d':' -f2 | tr -d ' ')
HOSTINGER_PLAN=$(grep -o '"plan": "[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Pre-deployment checks
pre_deploy_checks() {
    log_info "Running pre-deployment checks..."
    
    # Check critical files
    local critical_files=("index.html" "mobile.html" "styles.css" "script.js" "sw.js" "manifest.json")
    for file in "${critical_files[@]}"; do
        if [[ -f "$file" ]]; then
            log_success "$file exists"
        else
            log_error "$file missing!"
            exit 1
        fi
    done
    
    # Check for noindex
    if grep -q "noindex" "index.html" 2>/dev/null; then
        log_warning "noindex found in index.html - this will prevent search engine indexing"
    fi
    
    log_success "Pre-deployment checks passed"
}

# Update version file
update_version() {
    log_info "Updating version file..."
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local utc_time=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    echo "deploy-$timestamp $utc_time" > version.txt
    log_success "Version updated: deploy-$timestamp"
}

# Update service worker cache
update_service_worker() {
    log_info "Updating service worker cache version..."
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local cache_version="cm-v$(date +%s)-$timestamp"
    
    # Update cache name in sw.js
    if [[ -f "sw.js" ]]; then
        sed -i.bak "s/const CACHE_NAME = '[^']*'/const CACHE_NAME = '$cache_version'/" sw.js
        rm -f sw.js.bak
        log_success "Service worker cache updated: $cache_version"
    fi
}

# Get deployment credentials
get_credentials() {
    echo ""
    log_info "Hostinger $HOSTINGER_PLAN Plan Deployment Configuration"
    echo "Site: $SITE_URL"
    echo "Local path: $LOCAL_PATH"
    echo "Remote path: $REMOTE_PATH"
    echo "SSH port: $SSH_PORT"
    echo "SFTP port: $SFTP_PORT"
    echo ""
    
    read -r -p "SSH target (e.g., user@$SITE_URL): " SSH_TARGET
    if [[ -z "$SSH_TARGET" ]]; then
        log_error "SSH target is required"
        exit 1
    fi
    
    read -r -p "Use SSH (port $SSH_PORT) or SFTP (port $SFTP_PORT)? [ssh/sftp]: " PROTOCOL
    case "${PROTOCOL:-ssh}" in
        sftp|SFTP)
            SSH_PORT=$SFTP_PORT
            log_info "Using SFTP on port $SFTP_PORT"
            ;;
        ssh|SSH|*)
            log_info "Using SSH on port $SSH_PORT"
            ;;
    esac
}

# Build rsync command
build_rsync_command() {
    local excludes=()
    local includes=()
    
    # Read excludes from config
    while IFS= read -r line; do
        if [[ "$line" =~ \"[^\"]+\" ]]; then
            excludes+=("--exclude=${line//\"/}")
        fi
    done < <(grep -A 20 '"excludes"' "$CONFIG_FILE" | grep -o '"[^"]*"' | head -20)
    
    # Build rsync command
    RSYNC_CMD="rsync -avz --delete"
    RSYNC_CMD+=" -e 'ssh -p $SSH_PORT'"
    
    for exclude in "${excludes[@]}"; do
        RSYNC_CMD+=" $exclude"
    done
    
    RSYNC_CMD+=" $LOCAL_PATH/ $SSH_TARGET:$REMOTE_PATH/"
}

# Deploy files
deploy_files() {
    log_info "Deploying files to server..."
    echo "Command: $RSYNC_CMD"
    echo ""
    
    read -r -p "Proceed with deployment? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_warning "Deployment cancelled"
        exit 0
    fi
    
    if eval "$RSYNC_CMD"; then
        log_success "Files deployed successfully!"
    else
        log_error "Deployment failed!"
        exit 1
    fi
}

# Post-deployment tasks
post_deploy_tasks() {
    log_info "Running post-deployment tasks..."
    
    # Test URLs
    log_info "Testing deployed URLs..."
    for url in "https://$SITE_URL/" "https://$SITE_URL/deploy-info.php"; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
            log_success "$url is accessible"
        else
            log_warning "$url returned non-200 status"
        fi
    done
    
    echo ""
    log_info "Post-deployment checklist:"
    echo "□ Clear Hostinger cache (hPanel → Advanced → Website → Clear Website Cache)"
    echo "□ Test site functionality"
    echo "□ Check mobile responsiveness"
    echo "□ Verify analytics tracking"
    echo "□ Test form submissions"
    echo ""
    log_success "Deployment complete! Visit: https://$SITE_URL"
}

# Main deployment flow
main() {
    echo "=========================================="
    echo "   Chicago's Money - Quick Deployment    "
    echo "=========================================="
    echo ""
    
    pre_deploy_checks
    update_version
    update_service_worker
    get_credentials
    build_rsync_command
    deploy_files
    post_deploy_tasks
}

# Run main function
main "$@"
