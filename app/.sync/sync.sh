#!/bin/bash
# Empleaido Factory - Sync Script
# Automatically syncs between sephirot (m1) and mini (m2)
# Usage: ./sync.sh [branch-name]

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_DIR="/Users/nadalpiantini/Dev/empleaido-factory/app"
DEFAULT_BRANCH="feature/dashboard-virtual-office"
BRANCH="${1:-$DEFAULT_BRANCH}"

echo -e "${BLUE}🔄 Empleaido Factory Sync${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Detect current hostname
HOSTNAME=$(hostname)
echo -e "${YELLOW}🖥️  Current server:${NC} $HOSTNAME"

# Check if we're in the right directory
if [ ! -d "$REPO_DIR/.git" ]; then
    echo -e "${RED}❌ Error: Not in git repository${NC}"
    echo -e "${YELLOW}📂 Changing to repo directory...${NC}"
    cd "$REPO_DIR" || exit 1
fi

# Change to repo directory
cd "$REPO_DIR" || exit 1

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}🌿 Current branch:${NC} $CURRENT_BRANCH"

# Check if there are uncommitted changes in tracked files
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo -e "${RED}⚠️  You have uncommitted changes!${NC}"
    echo -e "${YELLOW}Please commit or stash them first:${NC}"
    echo ""
    echo "  git status"
    echo "  git add ."
    echo "  git commit -m \"your message\""
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Working tree clean${NC}"
echo ""

# Fetch latest from origin
echo -e "${BLUE}📥 Fetching from origin...${NC}"
git fetch origin

# Check if we need to pull
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})
BASE=$(git merge-base @ @{u})

if [ $LOCAL = $REMOTE ]; then
    echo -e "${GREEN}✅ Already up to date with origin${NC}"
elif [ $LOCAL = $BASE ]; then
    echo -e "${YELLOW}📥 Pulling changes from origin...${NC}"
    git pull origin "$BRANCH"
    echo -e "${GREEN}✅ Pull complete${NC}"
elif [ $REMOTE = $BASE ]; then
    echo -e "${YELLOW}📤 Pushing changes to origin...${NC}"
    git push origin "$BRANCH"
    echo -e "${GREEN}✅ Push complete${NC}"
else
    echo -e "${RED}⚠️  Local and remote have diverged${NC}"
    echo -e "${YELLOW}Pulling changes first...${NC}"
    git pull origin "$BRANCH"
    echo -e "${GREEN}✅ Merge complete, now pushing...${NC}"
    git push origin "$BRANCH"
    echo -e "${GREEN}✅ Sync complete${NC}"
fi

echo ""
echo -e "${BLUE}📊 Current status:${NC}"
git status -sb

echo ""
echo -e "${GREEN}✨ Sync complete!${NC}"
echo -e "${BLUE}Both sephirot (m1) and mini (m2) are now in sync${NC}"
