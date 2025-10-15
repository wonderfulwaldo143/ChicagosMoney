#!/bin/bash

# Chicago's Money - Deployment Script
# Prevents accidental nested directories during deployment

set -euo pipefail

# Configuration
SITE_URL="chicagosmoney.com"
WEB_ROOT="."
DEFAULT_REMOTE_DIR="~/domains/${SITE_URL}/public_html"
FTP_HOST_DEFAULT="ftp.${SITE_URL}"
FTP_PORT_DEFAULT="21"
SSH_PORT_DEFAULT="65002"
FTP_ROOT_DEFAULT="public_html"
# Default rsync excludes (non-web/dev files)
RSYNC_EXCLUDES=(
  --exclude='.git' \
  --exclude='.github' \
  --exclude='.gitignore' \
  --exclude='.vscode' \
  --exclude='.DS_Store' \
  --exclude='.claude' \
  --exclude='deploy.sh' \
  --exclude='docs' \
  --exclude='*.md'
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ALL_FILES_EXIST=true

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

to_lower() {
  printf '%s' "$1" | LC_ALL=C tr '[:upper:]' '[:lower:]'
}

normalize_remote_path() {
  local path="$1"
  local normalized="${path%/}"

  if [[ -z "$normalized" ]]; then
    normalized="$DEFAULT_REMOTE_DIR"
  fi

  local parts=()
  IFS='/' read -r -a parts <<< "$normalized"

  local cleaned=()
  for segment in "${parts[@]}"; do
    if [[ -n "$segment" ]]; then
      cleaned+=("$segment")
    fi
  done

  local last_default="public_html"
  while (( ${#cleaned[@]} >= 2 )); do
    local last_index=$(( ${#cleaned[@]} - 1 ))
    local prev_index=$(( last_index - 1 ))
    local last_lower
    local prev_lower
    last_lower=$(to_lower "${cleaned[$last_index]}")
    prev_lower=$(to_lower "${cleaned[$prev_index]}")

    if [[ "$last_lower" == "$last_default" && "$prev_lower" == "$last_default" ]]; then
      unset 'cleaned[last_index]'
      cleaned=("${cleaned[@]}")
    else
      break
    fi
  done

  normalized=$(IFS='/'; echo "${cleaned[*]}")

  if [[ "$path" == /* ]]; then
    normalized="/$normalized"
  fi

  if [[ -z "$normalized" ]]; then
    normalized="$DEFAULT_REMOTE_DIR"
  fi

  echo "$normalized"
}

print_header() {
  echo "=========================================="
  echo "   Chicago's Money - Deployment Script    "
  echo "=========================================="
  echo ""
  echo "Target platform: Hostinger Cloud Startup (~/domains/$SITE_URL/public_html)"
  echo ""
}

run_predeployment_checks() {
  echo "📋 Pre-deployment Checklist:"
  echo ""

  echo "Checking critical files..."
  local files_to_check=(
    "$WEB_ROOT/index.html"
    "$WEB_ROOT/.htaccess"
    "$WEB_ROOT/robots.txt"
    "$WEB_ROOT/sitemap.xml"
    "$WEB_ROOT/manifest.json"
    "$WEB_ROOT/sw.js"
  )

  ALL_FILES_EXIST=true
  for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
      echo -e "${GREEN}✓${NC} $file exists"
    else
      echo -e "${RED}✗${NC} $file missing"
      ALL_FILES_EXIST=false
    fi
  done

  echo ""
  echo "🔍 SEO Check:"
  if grep -q "noindex" "$WEB_ROOT/index.html" 2>/dev/null; then
    echo -e "${RED}⚠️  WARNING: noindex found in index.html${NC}"
  else
    echo -e "${GREEN}✓${NC} No noindex directive found"
  fi

  echo ""
  echo "📊 File Size Analysis:"
  local img_size
  img_size=$(du -sh "$WEB_ROOT/IMG" 2>/dev/null | cut -f1)
  if [ -n "$img_size" ]; then
    echo "Image folder size: $img_size"
    if [[ "$img_size" == *"M"* ]]; then
      local numeric_size=${img_size%%M*}
      if [[ "$numeric_size" =~ ^[0-9]+$ ]] && [ "$numeric_size" -gt 2 ]; then
        echo -e "${YELLOW}⚠️  Consider optimizing images (currently $img_size)${NC}"
      fi
    fi
  else
    echo "Image folder not found."
  fi
}

print_optimization_suggestions() {
  echo ""
  echo "🔧 Optimization Suggestions:"
  echo ""

  if command_exists uglifyjs; then
    echo -e "${GREEN}✓${NC} UglifyJS available for JavaScript minification"
  else
    echo -e "${YELLOW}!${NC} Install UglifyJS: npm install -g uglify-js"
  fi

  if command_exists cssnano; then
    echo -e "${GREEN}✓${NC} CSSNano available for CSS minification"
  else
    echo -e "${YELLOW}!${NC} Install CSSNano: npm install -g cssnano-cli"
  fi
}

print_deployment_options() {
  echo ""
  echo "📤 Deployment Options:"
  echo ""
  echo "1) FTP/SFTP: Upload all contents of the repository root to your web root"
  echo "   (Do not nest the files inside an extra directory on the server.)"
  echo "   Host: ${FTP_HOST_DEFAULT}  Port: ${FTP_PORT_DEFAULT}  Directory: ${FTP_ROOT_DEFAULT}/"
  echo ""
  echo "2) rsync (recommended):"
  echo "   rsync -avz --delete ./ user@$SITE_URL:~/domains/$SITE_URL/public_html/"
  echo ""
  echo "3) lftp mirror (FTP fallback):"
  echo "   lftp -u \"FTP_USER\" -p ${FTP_PORT_DEFAULT} ${FTP_HOST_DEFAULT}"
  echo "     mirror -R --delete ./ ${FTP_ROOT_DEFAULT}/"
  echo ""
}

sync_with_rsync() {
  if ! command_exists rsync; then
    echo -e "${RED}✗ rsync is not installed. Install it first to enable automatic syncing.${NC}"
    return 1
  fi

  echo ""
  echo "🔐 Remote Sync Setup"
  read -r -p "SSH target (e.g. user@$SITE_URL): " ssh_target
  if [[ -z "$ssh_target" ]]; then
    echo -e "${YELLOW}!${NC} No SSH target provided. Skipping remote sync."
    return 1
  fi

  read -r -p "SSH port [22]: " ssh_port
  ssh_port=${ssh_port:-$SSH_PORT_DEFAULT}

  read -r -p "Remote web root path [${DEFAULT_REMOTE_DIR}]: " remote_path
  local normalized_path
  normalized_path=$(normalize_remote_path "${remote_path:-$DEFAULT_REMOTE_DIR}")
  if [[ -n "${remote_path:-}" && "$normalized_path" != "${remote_path%/}" ]]; then
    echo -e "${YELLOW}!${NC} Adjusted remote path to '$normalized_path' to avoid nested directories."
  fi

  echo ""
  echo "The following command will deploy the site without creating an extra directory level:"
  echo "  rsync -avz --delete -e 'ssh -p ${ssh_port}' ${RSYNC_EXCLUDES[*]} ${WEB_ROOT}/ ${ssh_target}:${normalized_path}/"
  read -r -p "Proceed with deployment? (y/N): " confirmation
  if [[ ! "$confirmation" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}!${NC} Deployment cancelled."
    return 1
  fi

  if rsync -avz --delete -e "ssh -p ${ssh_port}" "${RSYNC_EXCLUDES[@]}" "${WEB_ROOT}/" "${ssh_target}:${normalized_path}/"; then
    echo -e "${GREEN}✅ Deployment complete. Copied repository contents to ${normalized_path}/ without nesting.${NC}"
    return 0
  else
    echo -e "${RED}❌ rsync failed. Review the output above and try again.${NC}"
    return 1
  fi
}

sync_with_lftp() {
  if ! command_exists lftp; then
    echo -e "${RED}✗ lftp is not installed. Install it to enable FTP uploads (e.g. brew install lftp).${NC}"
    return 1
  fi

  echo ""
  echo "🔐 FTP Mirror Setup"
  read -r -p "FTP hostname [${FTP_HOST_DEFAULT}]: " ftp_host
  ftp_host=${ftp_host:-$FTP_HOST_DEFAULT}

  read -r -p "FTP port [${FTP_PORT_DEFAULT}]: " ftp_port
  ftp_port=${ftp_port:-$FTP_PORT_DEFAULT}

  read -r -p "FTP username: " ftp_user
  if [[ -z "$ftp_user" ]]; then
    echo -e "${YELLOW}!${NC} No username provided. Aborting FTP sync."
    return 1
  fi

  read -r -s -p "FTP password: " ftp_pass
  echo ""
  if [[ -z "$ftp_pass" ]]; then
    echo -e "${YELLOW}!${NC} No password provided. Aborting FTP sync."
    return 1
  fi

  read -r -p "Remote directory relative to login root [${FTP_ROOT_DEFAULT}]: " ftp_remote_dir
  ftp_remote_dir=${ftp_remote_dir:-$FTP_ROOT_DEFAULT}

  echo ""
  echo "The following lftp mirror command will run:"
  echo "  mirror -R --delete ${WEB_ROOT}/ -> ${ftp_remote_dir}/"
  read -r -p "Proceed with FTP deployment? (y/N): " confirmation
  if [[ ! "$confirmation" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}!${NC} FTP deployment cancelled."
    return 1
  fi

  lftp -u "$ftp_user","$ftp_pass" -p "$ftp_port" "$ftp_host" <<EOF
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ftp:passive-mode true
mirror -R --delete --verbose "${WEB_ROOT}/" "${ftp_remote_dir}/"
bye
EOF

  if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ FTP deployment complete. Files mirrored to ${ftp_remote_dir}/.${NC}"
    return 0
  else
    echo -e "${RED}❌ FTP deployment failed. Review the output above and try again.${NC}"
    return 1
  fi
}

prompt_remote_sync() {
  echo "Choose a deployment transport:"
  echo "  1) rsync over SSH (recommended)"
  echo "  2) FTP mirror via lftp"
  echo "  3) Skip automated sync"
  read -r -p "Selection [3]: " transport_choice

  case "${transport_choice:-3}" in
    1)
      if ! sync_with_rsync; then
        echo -e "${YELLOW}!${NC} Remote sync skipped or failed. Upload manually when ready."
      fi
      ;;
    2)
      if ! sync_with_lftp; then
        echo -e "${YELLOW}!${NC} Remote sync skipped or failed. Upload manually when ready."
      fi
      ;;
    *)
      echo "Skipping automatic remote sync. Upload the repository contents manually when ready."
      ;;
  esac
}

print_post_deployment_tasks() {
  echo ""
  echo "📝 Post-Deployment Tasks:"
  echo ""
  echo "[ ] Submit sitemap to Google Search Console"
  echo "[ ] Submit sitemap to Bing Webmaster Tools"
  echo "[ ] Test form submission"
  echo "[ ] Test PWA installation"
  echo "[ ] Check all links"
  echo "[ ] Verify analytics tracking"
  echo "[ ] Test on mobile devices"
  echo "[ ] Run PageSpeed Insights"
}

print_final_status() {
  echo ""
  if [ "$ALL_FILES_EXIST" = true ]; then
    echo -e "${GREEN}✅ All critical files present. Site is ready for deployment!${NC}"
  else
    echo -e "${RED}❌ Some critical files are missing. Please review before deploying.${NC}"
  fi
  echo ""
  echo "=========================================="
  echo "        Good luck with your launch!       "
  echo "=========================================="
}

main() {
  print_header
  run_predeployment_checks
  print_optimization_suggestions
  print_deployment_options
  prompt_remote_sync
  print_post_deployment_tasks
  print_final_status
}

main "$@"
