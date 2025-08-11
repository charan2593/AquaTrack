# Deploy AquaFlow to Your Existing Hostinger Domain

## 🎯 Quick Deployment for Existing Hostinger Domain

Since you already have a Hostinger domain, here's the streamlined deployment process:

### Step 1: Prepare Your Deployment Package
Your production files are ready in the `/dist` folder:
- ✅ `index.js` - Your Express server
- ✅ `public/` - Your React frontend
- ✅ `package.json` - Production dependencies
- ✅ `shared/` - Database schema
- ✅ `DEPLOYMENT_INSTRUCTIONS.md` - Complete guide

### Step 2: Upload to Your Hostinger Domain
1. **Login to Hostinger Control Panel**
2. **Go to File Manager**
3. **Navigate to your domain folder** (usually `public_html/yourdomain.com`)
4. **Upload the entire `/dist` folder contents**
   - You can zip the `/dist` folder and upload/extract it
   - Or upload files individually

### Step 3: Set Up Node.js Application
1. **Go to:** Advanced → Node.js Applications
2. **Create New Application:**
   - **Application Name:** AquaFlow
   - **Domain:** Select your existing domain
   - **Node.js Version:** 18.x or 20.x
   - **Application Root:** `/public_html/yourdomain.com`
   - **Application Startup File:** `index.js`

### Step 4: Install Dependencies
In Hostinger Terminal:
```bash
cd public_html/yourdomain.com
npm install
```

### Step 5: Environment Variables
Add these in your Node.js Application environment settings:
```
NODE_ENV=production
DATABASE_URL=mysql://u866935527_phw_2025:your_password@82.25.121.32:3306/u866935527_purehomewaters
SESSION_SECRET=your-secure-random-string
PORT=3000
```

### Step 6: Start Your Application
- **Save Configuration**
- **Start Application** from Hostinger panel
- **Enable SSL** (free with Hostinger)

### Step 7: Test Your Deployment
Visit your domain and test:
- Login with: **8500095021** / **password**
- Create customers
- Check dashboard
- Test role-based access

## 🔧 Your Database is Already Working
- ✅ MySQL connection: `82.25.121.32:3306`
- ✅ Database: `u866935527_purehomewaters`
- ✅ All tables created and functional
- ✅ Test users already exist

## 📋 What's Working Right Now
- Customer management (create, view, delete)
- Service scheduling
- Dashboard analytics
- Role-based authentication
- Inventory management
- Rent tracking

## 🚀 Quick Start Commands
If you have SSH access to Hostinger:
```bash
# Navigate to your domain
cd public_html/yourdomain.com

# Upload and extract your files
# (Use File Manager or Git)

# Install dependencies
npm install

# Start application (Hostinger handles this)
npm start
```

## 🆘 Need Help?
- **Domain setup issues:** Check DNS settings in Hostinger
- **Node.js problems:** Verify application startup file path
- **Database connection:** Ensure IP whitelist includes Hostinger servers

Your AquaFlow application is production-ready and fully tested. The deployment should be straightforward since all the complex setup (database, authentication, features) is already working perfectly.

What's your domain name? I can help you with any specific configuration needed.