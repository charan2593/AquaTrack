# Deploy AquaFlow to manage.purehomewaters.com

## Your Specific Deployment Configuration

**Main Domain:** purehomewaters.com  
**AquaFlow App:** manage.purehomewaters.com  
**Database:** Already configured on Hostinger MySQL

## Step-by-Step Deployment Process

### Step 1: Deploy on Replit
1. **Click the Deploy button** in your Replit interface
2. **Choose:** Autoscale Deployment (recommended for production)
3. **Application Name:** AquaFlow-PureHomeWaters
4. **Environment Variables:**
   ```env
   NODE_ENV=production
   DATABASE_URL=mysql://u866935527_phw_2025:your_password@82.25.121.32:3306/u866935527_purehomewaters
   SESSION_SECRET=generate-secure-random-string-here
   ```

### Step 2: Add Custom Domain in Replit
1. **Go to Deployment → Domains tab**
2. **Add Custom Domain:** `manage.purehomewaters.com`
3. **Replit will provide DNS records like:**
   ```
   A Record:
   Name: manage
   Value: [Replit IP - will be provided after deployment]
   
   TXT Record:
   Name: manage
   Value: [Verification token - will be provided]
   ```

### Step 3: Configure DNS in Hostinger
1. **Login to Hostinger Control Panel**
2. **Go to:** Domains → purehomewaters.com → DNS Zone
3. **Add these records:**
   ```
   Type: A
   Name: manage
   Points to: [IP from Replit]
   TTL: 3600
   
   Type: TXT
   Name: manage
   Content: [Token from Replit]
   TTL: 3600
   ```

### Step 4: SSL and Final Setup
- **SSL Certificate:** Automatically provided by Replit
- **DNS Propagation:** 5-30 minutes typically
- **Verification:** Domain shows "Verified" in Replit

## Your Final Result
- **Main Website:** https://purehomewaters.com (unchanged)
- **Management System:** https://manage.purehomewaters.com
- **Database:** Stays on Hostinger (no changes)
- **SSL:** Automatic HTTPS for professional appearance

## Login Credentials for Testing
- **Admin:** 8500095021 / password
- **Manager:** 9999999999 / password
- **Service Boy:** 7777777777 / password

## Features Available at manage.purehomewaters.com
✓ Customer Management (create, view, edit, delete)
✓ Service Scheduling and Tracking
✓ Dashboard with Real-time Analytics
✓ Role-based Access Control
✓ Inventory Management
✓ Rent Collection Tracking
✓ Mobile-responsive Design

## Professional Business Setup
Your customers and staff will access the management system at:
**https://manage.purehomewaters.com**

This gives you a professional appearance while keeping your main website separate from your business management tools.

## Next Steps
1. **Click Deploy in Replit**
2. **Get DNS records from Replit**
3. **Update Hostinger DNS**
4. **Test your deployment**

Ready to make your water purifier business management system live!