#!/bin/bash

# AquaFlow Local Setup Script
# This script helps set up the development environment

echo "🌊 AquaFlow Local Setup"
echo "======================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available"
    exit 1
fi

echo "✅ npm $(npm --version) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚙️  Creating environment file..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file from .env.example"
        echo ""
        echo "📝 Please edit the .env file with your database details:"
        echo "   - DATABASE_URL: Your PostgreSQL connection string"
        echo "   - SESSION_SECRET: A secure secret key"
        echo ""
        echo "Example DATABASE_URL formats:"
        echo "   Local:    postgresql://username:password@localhost:5432/aquaflow_dev"
        echo "   Docker:   postgresql://aquaflow_user:password@localhost:5432/aquaflow_dev"
        echo "   Neon:     postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require"
    else
        echo "❌ .env.example file not found"
        exit 1
    fi
else
    echo "✅ .env file already exists"
fi

# Check if PostgreSQL is accessible (optional)
echo ""
echo "🔍 Checking database connection..."

# Try to load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set in .env file"
    echo "   Please configure your database connection string"
else
    echo "✅ DATABASE_URL configured"
    
    # Test database connection
    echo "🧪 Testing database connection..."
    node -e "
        import { getDatabaseConfig } from './server/config/database.js';
        try {
            const config = getDatabaseConfig();
            console.log('✅ Database configuration valid');
            console.log('   Environment:', config.environment);
            console.log('   Connection pool:', JSON.stringify(config.connectionPool));
        } catch (error) {
            console.log('❌ Database configuration error:', error.message);
            process.exit(1);
        }
    " 2>/dev/null || echo "⚠️  Database configuration check skipped (run after setting up .env)"
fi

echo ""
echo "🗄️  Database Setup"
echo "=================="
echo "If you haven't set up your database yet, choose one option:"
echo ""
echo "Option 1: Docker PostgreSQL (Recommended)"
echo "  docker run --name aquaflow-postgres \\"
echo "    -e POSTGRES_DB=aquaflow_dev \\"
echo "    -e POSTGRES_USER=aquaflow_user \\"
echo "    -e POSTGRES_PASSWORD=your_password \\"
echo "    -p 5432:5432 \\"
echo "    -d postgres:15"
echo ""
echo "Option 2: Local PostgreSQL"
echo "  Create database: CREATE DATABASE aquaflow_dev;"
echo "  Create user: CREATE USER aquaflow_user WITH PASSWORD 'your_password';"
echo "  Grant permissions: GRANT ALL PRIVILEGES ON DATABASE aquaflow_dev TO aquaflow_user;"
echo ""
echo "Option 3: Cloud Database"
echo "  Sign up for Neon (neon.tech) or Supabase (supabase.com)"
echo "  Get connection string and add to .env file"
echo ""

read -p "Press Enter when your database is ready, or Ctrl+C to exit..."

echo "🚀 Running database migrations..."
npm run db:push

if [ $? -eq 0 ]; then
    echo "✅ Database migrations completed successfully"
else
    echo "❌ Database migrations failed"
    echo "   Please check your DATABASE_URL and database connectivity"
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser to:"
echo "   http://localhost:5000"
echo ""
echo "3. Register a new user account to get started"
echo ""
echo "Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm start            - Start production server"
echo "  npm run db:push      - Push database schema changes"
echo "  npm run db:studio    - Open database studio"
echo ""
echo "For troubleshooting, see docs/LOCAL_SETUP.md"
echo ""
echo "Happy coding! 🌊"