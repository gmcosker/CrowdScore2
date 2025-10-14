#!/bin/bash

# 🛡️ CROWDSCORE EMERGENCY RESTORE SCRIPT
# Run this if the app breaks or rounds disappear

echo "🛡️ CROWDSCORE EMERGENCY RESTORE"
echo "================================"

# Check if backup files exist
if [ ! -f "src/index.html.backup" ]; then
    echo "❌ ERROR: Backup files not found!"
    echo "Please ensure backup files exist in src/ folder"
    exit 1
fi

echo "✅ Backup files found. Restoring..."

# Restore from backups
cp src/index.html.backup src/index.html
cp src/style.css.backup src/style.css
cp src/script.js.backup src/script.js

echo "✅ Files restored from backup"

# Sync to dist folder
cp src/index.html dist/index.html
cp src/style.css dist/style.css
cp src/script.js dist/script.js

echo "✅ Files synced to dist folder"

echo ""
echo "🎉 RESTORE COMPLETE!"
echo "===================="
echo "✅ All files restored from backup"
echo "✅ App should be working again"
echo "✅ Refresh your browser at http://localhost:8000/dist/"
echo ""
echo "If you still have issues:"
echo "1. Hard refresh browser (Cmd+Shift+R)"
echo "2. Check server is running"
echo "3. Contact support" 