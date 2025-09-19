#!/bin/bash

# Chicago's Money - Deployment Script
# This script helps deploy the website to production

echo "=========================================="
echo "   Chicago's Money - Deployment Script    "
echo "=========================================="
echo ""

# Configuration
SITE_URL="chicagosmoney.com"
PUBLIC_DIR="public_html"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "📋 Pre-deployment Checklist:"
echo ""

# Check for critical files
echo "Checking critical files..."
files_to_check=(
    "$PUBLIC_DIR/index.html"
    "$PUBLIC_DIR/.htaccess"
    "$PUBLIC_DIR/robots.txt"
    "$PUBLIC_DIR/sitemap.xml"
    "$PUBLIC_DIR/manifest.json"
    "$PUBLIC_DIR/sw.js"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        all_files_exist=false
    fi
done

echo ""
echo "🔍 SEO Check:"

# Check for noindex
if grep -q "noindex" "$PUBLIC_DIR/index.html"; then
    echo -e "${RED}⚠️  WARNING: noindex found in index.html${NC}"
else
    echo -e "${GREEN}✓${NC} No noindex directive found"
fi

echo ""
echo "📊 File Size Analysis:"

# Check image sizes
IMG_SIZE=$(du -sh "$PUBLIC_DIR/IMG" 2>/dev/null | cut -f1)
echo "Image folder size: $IMG_SIZE"
if [[ "$IMG_SIZE" == *"M"* ]] && [[ "${IMG_SIZE%%M*}" -gt 2 ]]; then
    echo -e "${YELLOW}⚠️  Consider optimizing images (currently $IMG_SIZE)${NC}"
fi

echo ""
echo "🔧 Optimization Suggestions:"
echo ""

# Minification check
if command_exists uglifyjs; then
    echo -e "${GREEN}✓${NC} UglifyJS available for JavaScript minification"
else
    echo -e "${YELLOW}!${NC} Install UglifyJS for JS minification: npm install -g uglify-js"
fi

if command_exists cssnano; then
    echo -e "${GREEN}✓${NC} CSSNano available for CSS minification"
else
    echo -e "${YELLOW}!${NC} Install CSSNano for CSS minification: npm install -g cssnano-cli"
fi

echo ""
echo "📤 Deployment Options:"
echo ""
echo "1. FTP/SFTP Upload:"
echo "   Upload all contents of $PUBLIC_DIR/ to your web root"
echo ""
echo "2. rsync (recommended):"
echo "   rsync -avz --delete $PUBLIC_DIR/ user@$SITE_URL:/path/to/web/root/"
echo ""
echo "3. Git deployment:"
echo "   git add . && git commit -m 'Launch ready' && git push origin main"
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
echo ""

if [ "$all_files_exist" = true ]; then
    echo -e "${GREEN}✅ All critical files present. Site is ready for deployment!${NC}"
else
    echo -e "${RED}❌ Some critical files are missing. Please review before deploying.${NC}"
fi

echo ""
echo "=========================================="
echo "        Good luck with your launch!       "
echo "=========================================="