#!/bin/bash

# Chicago's Money - Deployment Test Script
# Tests deployment configuration without actually deploying

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "=========================================="
echo "   Chicago's Money - Deployment Test      "
echo "=========================================="
echo ""

# Test 1: Check configuration file
echo "🔍 Testing configuration file..."
if [[ -f "deploy-config.json" ]]; then
    echo -e "${GREEN}✅ deploy-config.json exists${NC}"
    
    # Parse basic config
    SITE_URL=$(grep -o '"url": "[^"]*"' "deploy-config.json" | cut -d'"' -f4)
    LOCAL_PATH=$(grep -o '"local_path": "[^"]*"' "deploy-config.json" | cut -d'"' -f4)
    REMOTE_PATH=$(grep -o '"remote_path": "[^"]*"' "deploy-config.json" | cut -d'"' -f4)
    
    echo "   Site URL: $SITE_URL"
    echo "   Local Path: $LOCAL_PATH"
    echo "   Remote Path: $REMOTE_PATH"
else
    echo -e "${RED}❌ deploy-config.json missing${NC}"
    exit 1
fi

# Test 2: Check deployment scripts
echo ""
echo "🔍 Testing deployment scripts..."
for script in "deploy-quick.sh" "deploy.sh"; do
    if [[ -f "$script" ]]; then
        if [[ -x "$script" ]]; then
            echo -e "${GREEN}✅ $script exists and is executable${NC}"
        else
            echo -e "${YELLOW}⚠️  $script exists but not executable${NC}"
            chmod +x "$script"
            echo -e "${GREEN}✅ Made $script executable${NC}"
        fi
    else
        echo -e "${RED}❌ $script missing${NC}"
    fi
done

# Test 3: Check critical files
echo ""
echo "🔍 Testing critical files..."
critical_files=("index.html" "mobile.html" "styles.css" "script.js" "sw.js" "manifest.json" "version.txt" "deploy-info.php")
all_good=true

for file in "${critical_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
        all_good=false
    fi
done

# Test 4: Check rsync availability
echo ""
echo "🔍 Testing rsync availability..."
if command -v rsync >/dev/null 2>&1; then
    echo -e "${GREEN}✅ rsync is available${NC}"
    rsync --version | head -1
else
    echo -e "${RED}❌ rsync not found${NC}"
    echo "   Install with: brew install rsync (Mac) or apt-get install rsync (Linux)"
fi

# Test 5: Check SSH availability
echo ""
echo "🔍 Testing SSH availability..."
if command -v ssh >/dev/null 2>&1; then
    echo -e "${GREEN}✅ SSH is available${NC}"
else
    echo -e "${RED}❌ SSH not found${NC}"
fi

# Test 6: Check curl availability (for post-deploy testing)
echo ""
echo "🔍 Testing curl availability..."
if command -v curl >/dev/null 2>&1; then
    echo -e "${GREEN}✅ curl is available${NC}"
else
    echo -e "${RED}❌ curl not found${NC}"
fi

# Summary
echo ""
echo "=========================================="
if [[ "$all_good" == true ]]; then
    echo -e "${GREEN}✅ All tests passed! Ready for deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./deploy-quick.sh"
    echo "2. Enter your SSH credentials when prompted"
    echo "3. Clear Hostinger cache after deployment"
else
    echo -e "${RED}❌ Some tests failed. Please fix issues before deploying.${NC}"
fi
echo "=========================================="
