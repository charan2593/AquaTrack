# 🗄️ Database Setup Guide - Development & Production Separation

## Overview
Your AquaFlow application now supports separate databases for development and production environments:

- **Development Environment** (Replit): Uses your Hostinger development database
- **Production Environment** (Hostinger deployment): Uses your Hostinger production database

## 🔧 Environment Configuration

### Development Environment (Replit)
Set these environment variables in your Replit Secrets:

```env
NODE_ENV=development
DEV_DATABASE_URL=mysql://your_dev_user:your_dev_password@82.25.121.32:3306/your_dev_database_name
DEV_SESSION_SECRET=dev-session-secret-key
```

### Production Environment (Hostinger)
Set these environment variables when deploying:

```env
NODE_ENV=production
PRODUCTION_DATABASE_URL=mysql://u866935527_phw_2025:your_prod_password@82.25.121.32:3306/u866935527_purehomewaters
PRODUCTION_SESSION_SECRET=super-secure-production-session-secret
```

## 📋 Current Database Information

### Production Database (Already Working)
- **Host:** 82.25.121.32
- **Database:** u866935527_purehomewaters
- **User:** u866935527_phw_2025
- **Tables:** All created and working (users, customers, services, etc.)

### Development Database (New - You Created)
- **Host:** 82.25.121.32 (same Hostinger server)
- **Database:** [Your new dev database name]
- **User:** [Your new dev database user]
- **Status:** Ready for setup

## 🚀 Setup Steps

### Step 1: Get Your Development Database Details
From your Hostinger control panel, get:
1. Development database name
2. Development database username  
3. Development database password

### Step 2: Add Environment Variables
Add these to your Replit Secrets (I'll help you with this):
- `DEV_DATABASE_URL`
- `DEV_SESSION_SECRET`

### Step 3: Database Schema Creation
Once connected, we'll run:
```bash
npm run db:push
```
This will create all necessary tables in your development database.

## ✅ Benefits of This Setup

- **Safe Development:** Your development work won't affect production data
- **Clean Testing:** Fresh database for testing new features
- **Data Isolation:** Development and production data completely separate
- **Easy Switching:** Automatic environment detection

## 🔄 How It Works

The system automatically detects the environment:
- **When NODE_ENV=development:** Uses `DEV_DATABASE_URL`
- **When NODE_ENV=production:** Uses `PRODUCTION_DATABASE_URL`
- **Fallback:** Uses `DATABASE_URL` if specific env vars not found

## 📝 Next Steps

Please provide your new Hostinger development database credentials:
1. Development database name
2. Development database username
3. Development database password

I'll help you set up the environment variables and initialize the development database with all the necessary tables.