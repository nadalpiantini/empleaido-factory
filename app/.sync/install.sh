#!/bin/bash
# Install sync system on current server
# Run this on BOTH sephirot (m1) and mini (m2)

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

REPO_DIR="/Users/nadalpiantini/Dev/empleaido-factory/app"

echo -e "${BLUE}🚀 Installing Empleaido Factory Sync System${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Detect hostname
HOSTNAME=$(hostname)
echo -e "${YELLOW}🖥️  Server:${NC} $HOSTNAME"

# Make sync script executable
chmod +x "$REPO_DIR/.sync/sync.sh"
echo -e "${GREEN}✅ sync.sh is executable${NC}"

# Install git hooks
echo -e "${YELLOW}📦 Installing git hooks...${NC}"

# Copy hooks to .git/hooks/
cp "$REPO_DIR/.sync/pre-push" "$REPO_DIR/.git/hooks/pre-push"
chmod +x "$REPO_DIR/.git/hooks/pre-push"
echo -e "${GREEN}✅ pre-push hook installed${NC}"

cp "$REPO_DIR/.sync/post-merge" "$REPO_DIR/.git/hooks/post-merge"
chmod +x "$REPO_DIR/.git/hooks/post-merge"
echo -e "${GREEN}✅ post-merge hook installed${NC}"

echo ""
echo -e "${GREEN}✨ Installation complete!${NC}"
echo ""
echo -e "${YELLOW}📖 Quick reference:${NC}"
echo -e "  Sync command: ${GREEN}.sync/sync.sh${NC}"
echo -e "  Documentation: ${GREEN}SYNC.md${NC}"
echo ""
echo -e "${YELLOW}💡 Run this on BOTH servers (sephirot and mini)${NC}"
echo -e "${YELLOW}💡 Then run: .sync/sync.sh${NC}"
echo ""
