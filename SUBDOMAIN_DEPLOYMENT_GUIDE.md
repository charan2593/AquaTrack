# Deploy AquaFlow to a Subdomain

## Subdomain Examples
- `app.yourdomain.com`
- `aquaflow.yourdomain.com`
- `services.yourdomain.com`
- `manage.yourdomain.com`

## Step-by-Step Process

### Phase 1: Create Subdomain in Hostinger
1. **Login to Hostinger Control Panel**
2. **Go to:** Domains → Your Domain → Subdomains
3. **Create new subdomain:**
   - **Subdomain:** `app` (or your preferred name)
   - **Domain:** `yourdomain.com`
   - **Document Root:** Can be left default for now

### Phase 2: Deploy on Replit
1. **Click the Deploy button** in Replit
2. **Choose:** Autoscale Deployment
3. **Configure deployment settings**

### Phase 3: Add Subdomain to Replit
1. **In Replit Deployment → Domains tab:**
   - Click **"Add Custom Domain"**
   - Enter your subdomain: `app.yourdomain.com`

2. **Replit provides DNS records:**
   ```
   A Record:
   Name: app
   Value: [IP from Replit]
   
   TXT Record:
   Name: app
   Value: [verification token]
   ```

### Phase 4: Update DNS in Hostinger
1. **Go to:** DNS Zone Editor for your domain
2. **Add DNS records:**
   ```
   Type: A
   Name: app
   Points to: [Replit IP address]
   TTL: 3600
   
   Type: TXT
   Name: app
   Content: [Replit verification token]
   TTL: 3600
   ```

### Phase 5: Environment Variables
Set in Replit deployment:
```env
NODE_ENV=production
DATABASE_URL=mysql://u866935527_phw_2025:password@82.25.121.32:3306/u866935527_purehomewaters
SESSION_SECRET=your-secure-random-string
```

## Benefits of Subdomain Approach

✓ **Clean separation:** Main domain for marketing, subdomain for app
✓ **Professional appearance:** `app.yourdomain.com`
✓ **Easy management:** Separate DNS records
✓ **SSL included:** Automatic HTTPS for subdomain
✓ **Flexibility:** Can add more subdomains later

## Example Subdomains for Your Business
- `app.yourdomain.com` - Main application
- `admin.yourdomain.com` - Admin panel (future)
- `api.yourdomain.com` - API endpoints (future)
- `docs.yourdomain.com` - Documentation (future)

## Current Application Ready for Production
✓ Customer management system
✓ Service scheduling
✓ Role-based authentication
✓ Dashboard analytics
✓ Inventory tracking
✓ MySQL database operational

## What's Next?
1. **Tell me your main domain name**
2. **Choose your subdomain name** (e.g., `app`, `aquaflow`, `manage`)
3. **I'll provide specific DNS instructions**

Your water purifier service management system will be accessible at something like `app.yourdomain.com` with full professional features!