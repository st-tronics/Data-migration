#!/bin/bash

# ============================================================================
# Build Script for Netlify Deployment
# This script builds your frontend and prepares it for Netlify
# ============================================================================

echo "🚀 Building Data Migration Tool for Netlify..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: frontend directory not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Navigate to frontend directory
cd frontend

echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: npm install failed!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔨 Step 2: Building the application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: Build failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Your app is ready for Netlify!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 The build folder is located at:"
echo -e "${BLUE}   $(pwd)/build${NC}"
echo ""
echo "📋 Next steps:"
echo "   1. Open Finder and navigate to: $(pwd)/build"
echo "   2. Go to https://app.netlify.com"
echo "   3. Drag the 'build' folder to Netlify"
echo "   4. Your demo will be live in 30 seconds!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Open the build folder in Finder (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo ""
    echo "🔍 Opening build folder in Finder..."
    open build
fi

# Made with Bob
