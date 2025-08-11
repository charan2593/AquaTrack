# Step-by-Step Hostinger Deployment Guide

## 🎯 Quick Deployment Steps

### Step 1: Prepare Files for Upload
1. **Download/Zip the dist folder** after running the build
2. **Get these files ready:**
   - Your entire project folder OR the built `dist` folder
   - `.env` file with production settings

### Step 2: Hostinger Control Panel Setup
1. **Login to Hostinger Control Panel**
2. **Go to:** Advanced → Node.js Applications
3. **Click:** Create Application
4. **Fill in:**
   - Application name: `aquaflow`
   - Domain/Subdomain: Your chosen domain
   - Node.js version: `18.x` or `20.x`

### Step 3: Upload Files
**Option A: File Manager**
1. Go to **File Manager** in Hostinger
2. Navigate to your domain's `public_html` folder
3. Upload your project files (zip and extract)

**Option B: Git (Recommended)**
1. Push your code to GitHub
2. Use Hostinger's **Git Integration** or terminal to clone

### Step 4: Install Dependencies
1. **Open Hostinger Terminal** (Advanced → Terminal)
2. Navigate to your project folder:
   ```bash
   cd public_html/your-domain-folder
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```

### Step 5: Environment Variables
In Hostinger Node.js Application settings:
```env
NODE_ENV=production
DATABASE_URL=mysql://u866935527_phw_2025:your_password@82.25.121.32:3306/u866935527_purehomewaters
SESSION_SECRET=your-super-secure-random-string-here
PORT=3000
```

### Step 6: Configure Application
1. **Application Startup File:** `server/index.js` (if using built version) or `dist/server/index.js`
2. **Application Root:** Your project directory
3. **Save and Start Application**

### Step 7: Domain Configuration
1. **Point domain** to your Node.js application
2. **Enable SSL** (free with Hostinger)
3. **Test HTTPS connection**

## 📋 Current Application Status
- ✅ MySQL database connected and working
- ✅ Authentication system functional
- ✅ Customer management working
- ✅ Role-based access control implemented
- ✅ All CRUD operations tested

## 🔧 Environment File for Production
Create `.env` in your project root:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://u866935527_phw_2025:YOUR_ACTUAL_PASSWORD@82.25.121.32:3306/u866935527_purehomewaters
SESSION_SECRET=generate-a-long-random-string-here
```

## 🚀 Testing After Deployment
1. **Visit your domain**
2. **Login with:** 8500095021 / password
3. **Test features:**
   - Create customer
   - View dashboard
   - Check different user roles

## ⚡ Quick Troubleshooting
- **Can't connect to database:** Check DATABASE_URL and IP whitelist
- **Application won't start:** Verify Node.js version and startup file path
- **Login issues:** Check SESSION_SECRET is set
- **Missing features:** Ensure all files uploaded correctly

## 📦 Alternative: Use Current Working Version
Since your application is working perfectly in Replit:
1. **Download entire project** from Replit
2. **Upload to Hostinger** following steps above
3. **Keep same database connection** (it's already working)

Would you like me to help you with any specific step of this deployment process?