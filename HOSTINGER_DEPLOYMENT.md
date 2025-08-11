# Hostinger Deployment Guide for AquaFlow

## Overview
Deploy both frontend and backend to your Hostinger hosting account using their Node.js hosting features.

## Prerequisites
- ✅ Hostinger hosting account with Node.js support
- ✅ MySQL database already configured and working
- ✅ Domain/subdomain for your application

## Step 1: Prepare Application for Production

### 1.1 Environment Configuration
Create production environment file:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://u866935527_phw_2025:your_password@82.25.121.32:3306/u866935527_purehomewaters
SESSION_SECRET=your-super-secure-session-secret-here
```

### 1.2 Package.json Scripts
Ensure these scripts are in package.json:

```json
{
  "scripts": {
    "build": "vite build",
    "start": "NODE_ENV=production node dist/server/index.js",
    "build:server": "tsx --build server",
    "preview": "vite preview"
  }
}
```

## Step 2: Build Process

### 2.1 Frontend Build
```bash
npm run build
```

### 2.2 Backend Build
```bash
npm run build:server
```

## Step 3: Hostinger Deployment Options

### Option A: File Manager Upload
1. **Compress Files**: Create a zip of your project (exclude node_modules)
2. **Upload**: Use Hostinger File Manager to upload and extract
3. **Install Dependencies**: Use Hostinger's Node.js terminal to run `npm install`
4. **Start Application**: Configure startup script in Hostinger Node.js panel

### Option B: Git Deployment (Recommended)
1. **Push to Git**: Push your code to GitHub/GitLab
2. **Clone on Hostinger**: Use terminal to clone repository
3. **Install & Build**: Run installation and build commands
4. **Configure**: Set up environment variables and startup

## Step 4: Hostinger Configuration

### 4.1 Node.js Application Setup
In your Hostinger control panel:
1. Go to **Advanced → Node.js**
2. Create new Node.js application
3. Set **Application Root**: Your project directory
4. Set **Application Startup File**: `dist/server/index.js`
5. Set **Node.js Version**: Latest LTS (18.x or 20.x)

### 4.2 Environment Variables
Add these in Hostinger Node.js environment variables:
```
NODE_ENV=production
DATABASE_URL=mysql://u866935527_phw_2025:your_password@82.25.121.32:3306/u866935527_purehomewaters
SESSION_SECRET=your-secure-secret
```

### 4.3 Domain Configuration
1. Point your domain/subdomain to the Node.js application
2. Update any CORS settings if needed
3. Enable HTTPS (Hostinger provides free SSL)

## Step 5: File Structure for Hostinger

Your deployed structure should look like:
```
your-domain-folder/
├── dist/                 # Built files
│   ├── server/          # Backend build
│   └── client/          # Frontend build
├── node_modules/        # Dependencies
├── package.json
├── .env                 # Production environment
└── public/              # Static assets
```

## Step 6: Database Migration

Since your database is already configured:
1. Ensure all tables exist (they do from our setup)
2. Verify connection from Hostinger server
3. Run any necessary data migrations

## Step 7: SSL and Security

1. **Enable SSL**: Hostinger provides free SSL certificates
2. **Update URLs**: Ensure all API calls use HTTPS in production
3. **Session Security**: Set secure cookie flags for HTTPS

## Step 8: Testing Deployment

After deployment, test:
1. **Login**: Try logging in with your admin credentials
2. **Database**: Create/view customers, services, etc.
3. **API Endpoints**: Verify all CRUD operations work
4. **Role Access**: Test different user role permissions

## Troubleshooting

### Common Issues:
1. **Module Not Found**: Run `npm install` in correct directory
2. **Database Connection**: Verify DATABASE_URL and IP whitelist
3. **Port Issues**: Hostinger assigns ports automatically
4. **Build Errors**: Check Node.js version compatibility

### Logs:
- Check Hostinger Node.js application logs
- Monitor error logs for database connection issues
- Verify environment variables are set correctly

## Production Optimizations

1. **Database Pooling**: Already configured for production
2. **Caching**: Consider adding Redis if needed
3. **CDN**: Use Hostinger's CDN for static assets
4. **Monitoring**: Set up uptime monitoring

## Backup Strategy

1. **Database**: Regular MySQL backups via Hostinger
2. **Files**: Keep Git repository updated
3. **Environment**: Document all environment variables

Would you like me to help with any specific step of this deployment process?