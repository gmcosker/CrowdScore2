# 🛡️ CROWDSCORE SAFETY PROTOCOL

## **CRITICAL: File Structure Requirements**

### **Required Files (Both src/ and dist/ folders):**
- ✅ `index.html` - Complete HTML document structure
- ✅ `style.css` - All styling and themes  
- ✅ `script.js` - All functionality and event handlers

### **Backup Files (src/ folder only):**
- ✅ `index.html.backup` - Working version backup
- ✅ `style.css.backup` - Working version backup  
- ✅ `script.js.backup` - Working version backup

## **🚨 EMERGENCY RECOVERY**

### **If rounds disappear or app breaks:**

1. **Check file integrity:**
   ```bash
   ls -la scorecard-prototype-vibecoded/src/
   ls -la scorecard-prototype-vibecoded/dist/
   ```

2. **Restore from backup:**
   ```bash
   cp scorecard-prototype-vibecoded/src/index.html.backup scorecard-prototype-vibecoded/src/index.html
   cp scorecard-prototype-vibecoded/src/style.css.backup scorecard-prototype-vibecoded/src/style.css
   cp scorecard-prototype-vibecoded/src/script.js.backup scorecard-prototype-vibecoded/src/script.js
   ```

3. **Sync to dist:**
   ```bash
   cp scorecard-prototype-vibecoded/src/index.html scorecard-prototype-vibecoded/dist/index.html
   cp scorecard-prototype-vibecoded/src/style.css scorecard-prototype-vibecoded/dist/style.css
   cp scorecard-prototype-vibecoded/src/script.js scorecard-prototype-vibecoded/dist/script.js
   ```

## **✅ DEVELOPMENT WORKFLOW**

### **Before Making Changes:**
1. Verify all 6 files exist (3 in src/, 3 in dist/)
2. Test app functionality in browser
3. Check that rounds 1-12 are visible

### **After Making Changes:**
1. **ALWAYS** copy from src/ to dist/:
   ```bash
   cp scorecard-prototype-vibecoded/src/*.html scorecard-prototype-vibecoded/dist/
   cp scorecard-prototype-vibecoded/src/*.css scorecard-prototype-vibecoded/dist/
   cp scorecard-prototype-vibecoded/src/*.js scorecard-prototype-vibecoded/dist/
   ```

2. Test in browser at `http://localhost:8000/dist/`
3. Verify changes appear correctly

### **NEVER:**
- ❌ Edit files directly in dist/ folder
- ❌ Delete files without backup
- ❌ Copy partial HTML content
- ❌ Skip the src/ → dist/ sync step

## **🔧 SERVER COMMANDS**

### **Start Server:**
```bash
cd scorecard-prototype-vibecoded && python3 -m http.server 8000
```

### **Stop Server:**
- Press `Ctrl+C` in terminal where server is running
- Or close the terminal window

## **📱 APP FEATURES TO VERIFY**

### **Core Functionality:**
- ✅ 12 rounds visible (1-12)
- ✅ Blue | Round | Red column layout
- ✅ "Blue Won" and "Red Won" buttons
- ✅ Score tracking and totals
- ✅ "Score a New Fight" button
- ✅ Round indicator ("Round X of 12")
- ✅ Theme toggle buttons

### **Visual Elements:**
- ✅ Modern blue/red gradients
- ✅ Rounded score cells (not pill-shaped)
- ✅ Button text on single lines
- ✅ Dark text on final overlay

## **🚨 TROUBLESHOOTING**

### **If app looks broken:**
1. Hard refresh browser (`Cmd+Shift+R`)
2. Check server is running
3. Verify file paths are correct
4. Restore from backup if needed

### **If rounds are missing:**
1. Check JavaScript file is loading
2. Verify HTML structure is complete
3. Check browser console for errors
4. Restore from backup

**Last Updated: August 7, 2025**
**Status: ✅ SAFETY SYSTEM ACTIVE** 