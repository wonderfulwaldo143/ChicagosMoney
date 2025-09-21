#!/bin/bash

# Chicago's Money - Deployment Script
# Helps deploy the website to production without nesting extra folders
# Helps deploy the website to production without nesting extra folders

set -euo pipefail
set -euo pipefail

# Configuration
SITE_URL="chicagosmoney.com"
PUBLIC_DIR="public_html"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ALL_FILES_EXIST=true

ALL_FILES_EXIST=true

command_exists() {
  command -v "$1" >/dev/null 2>&1
  command -v "$1" >/dev/null 2>&1
}

normalize_remote_path() {
  local path="$1"
  local normalized="$path"

  while [[ "$normalized" == */$PUBLIC_DIR/$PUBLIC_DIR ]]; do
    normalized="${normalized%/$PUBLIC_DIR}"
  done

  if [[ "$normalized" == "$PUBLIC_DIR/$PUBLIC_DIR" ]]; then
    normalized="$PUBLIC_DIR"
  fi

  echo "$normalized"
}

print_header() {
  echo "=========================================="
  echo "   Chicago's Money - Deployment Script    "
  echo "=========================================="
  echo ""
}

run_predeployment_checks() {
  echo "📋 Pre-deployment Checklist:"
  echo ""

  echo "Checking critical files..."
  local files_to_check=(
  echo "Checking critical files..."
  local files_to_check=(
    "$PUBLIC_DIR/index.html"
    "$PUBLIC_DIR/.htaccess"
    "$PUBLIC_DIR/robots.txt"
    "$PUBLIC_DIR/sitemap.xml"
    "$PUBLIC_DIR/manifest.json"
    "$PUBLIC_DIR/sw.js"
  )
  )

  ALL_FILES_EXIST=true
  for file in "${files_to_check[@]}"; do
  ALL_FILES_EXIST=true
  for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
      echo -e "${GREEN}✓${NC} $file exists"
      echo -e "${GREEN}✓${NC} $file exists"
    else
      echo -e "${RED}✗${NC} $file missing"
      ALL_FILES_EXIST=false
      echo -e "${RED}✗${NC} $file missing"
      ALL_FILES_EXIST=false
    fi
  done
  done

  echo ""
  echo "🔍 SEO Check:"
  if grep -q "noindex" "$PUBLIC_DIR/index.html"; then
  echo ""
  echo "🔍 SEO Check:"
  if grep -q "noindex" "$PUBLIC_DIR/index.html"; then
    echo -e "${RED}⚠️  WARNING: noindex found in index.html${NC}"
  else
  else
    echo -e "${GREEN}✓${NC} No noindex directive found"
  fi
  fi

  echo ""
  echo "📊 File Size Analysis:"
  local img_size
  img_size=$(du -sh "$PUBLIC_DIR/IMG" 2>/dev/null | cut -f1)
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
  echo ""
  echo "📊 File Size Analysis:"
  local img_size
  img_size=$(du -sh "$PUBLIC_DIR/IMG" 2>/dev/null | cut -f1)
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
  if command_exists uglifyjs; then
    echo -e "${GREEN}✓${NC} UglifyJS available for JavaScript minification"
  else
  else
    echo -e "${YELLOW}!${NC} Install UglifyJS for JS minification: npm install -g uglify-js"
  fi
  fi

  if command_exists cssnano; then
  if command_exists cssnano; then
    echo -e "${GREEN}✓${NC} CSSNano available for CSS minification"
  else
  else
    echo -e "${YELLOW}!${NC} Install CSSNano for CSS minification: npm install -g cssnano-cli"
  fi
}
  fi
}

print_deployment_options() {
  echo ""
  echo "📤 Deployment Options:"
  echo ""
  echo "1. FTP/SFTP Upload:"
  echo "   Upload all contents of $PUBLIC_DIR/ to your web root"
  echo "   (Do not upload the folder itself to avoid $PUBLIC_DIR/$PUBLIC_DIR.)"
  echo ""
  echo "2. rsync (recommended):"
  echo "   rsync -avz --delete $PUBLIC_DIR/ user@$SITE_URL:/path/to/web/root/"
  echo ""
  echo "3. Git deployment:"
  echo "   git add . && git commit -m 'Launch ready' && git push origin main"
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

  read -r -p "Remote web root path [public_html]: " remote_path
  local trimmed_input="${remote_path%/}"
  if [[ -z "$trimmed_input" ]]; then
    trimmed_input="$PUBLIC_DIR"
  fi
  local normalized_path
  normalized_path=$(normalize_remote_path "$trimmed_input")
  if [[ "$normalized_path" != "$trimmed_input" ]]; then
    echo ""
    echo -e "${YELLOW}!${NC} Adjusted remote path to '${normalized_path}' to avoid uploading into ${PUBLIC_DIR}/${PUBLIC_DIR}."
  fi
  remote_path="$normalized_path"

  echo ""
  echo "The following command will deploy the site without creating an extra public_html directory:"
  echo "  rsync -avz --delete ${PUBLIC_DIR}/ ${ssh_target}:${remote_path}/"
  read -r -p "Proceed with deployment? (y/N): " confirmation
  if [[ ! "$confirmation" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}!${NC} Deployment cancelled."
    return 1
  fi

  if rsync -avz --delete "${PUBLIC_DIR}/" "${ssh_target}:${remote_path}/"; then
    echo ""
    echo -e "${GREEN}✅ Deployment complete! The contents of ${PUBLIC_DIR}/ were copied directly to ${remote_path}/ without creating a nested folder.${NC}"
    return 0
  else
    echo ""
    echo -e "${RED}❌ rsync failed. Review the output above and try again.${NC}"
    return 1
  fi
}

prompt_remote_sync() {
  read -r -p "Would you like to sync ${PUBLIC_DIR}/ to a remote server now? (y/N): " deploy_now
  if [[ "$deploy_now" =~ ^[Yy]$ ]]; then
    if ! sync_with_rsync; then
      echo ""
      echo -e "${YELLOW}!${NC} Remote sync skipped or failed. Upload manually when ready."
    fi
  else
    echo "Skipping automatic remote sync. Upload the contents of ${PUBLIC_DIR}/ manually when ready."
  fi
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
  echo "[ ] Set up monitoring"
  echo ""

  echo "🚀 Ready to launch? Here's your final checklist:"
  echo ""
  echo "1. Backup everything first"
  echo "2. Upload all files from $PUBLIC_DIR/"
  echo "3. Set permissions (644 for files, 755 for directories)"
  echo "4. Test the live site thoroughly"
  echo "5. Submit sitemaps to search engines"
  echo "6. Monitor for 24 hours"
}

print_final_status() {
  echo ""
  if [ "$ALL_FILES_EXIST" = true ]; then
  echo "🚀 Ready to launch? Here's your final checklist:"
  echo ""
  echo "1. Backup everything first"
  echo "2. Upload all files from $PUBLIC_DIR/"
  echo "3. Set permissions (644 for files, 755 for directories)"
  echo "4. Test the live site thoroughly"
  echo "5. Submit sitemaps to search engines"
  echo "6. Monitor for 24 hours"
}

print_final_status() {
  echo ""
  if [ "$ALL_FILES_EXIST" = true ]; then
    echo -e "${GREEN}✅ All critical files present. Site is ready for deployment!${NC}"
  else
  else
    echo -e "${RED}❌ Some critical files are missing. Please review before deploying.${NC}"
  fi
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
