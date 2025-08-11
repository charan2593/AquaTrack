// Build script for production deployment
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🏗️  Building AquaFlow for production deployment...');

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
  }

  // Build frontend
  console.log('⚛️  Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Frontend build completed');

  // Build backend
  console.log('🖥️  Building backend...');
  execSync('npx tsx --build server', { stdio: 'inherit' });
  console.log('✅ Backend build completed');

  // Copy package.json and other necessary files
  console.log('📦 Copying necessary files...');
  
  const filesToCopy = [
    'package.json',
    'package-lock.json',
    '.env.example'
  ];

  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join('dist', file));
      console.log(`✅ Copied ${file}`);
    }
  });

  // Create production package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const prodPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    main: 'server/index.js',
    scripts: {
      start: 'node server/index.js',
      "db:push": "drizzle-kit push --config=drizzle.mysql.config.ts"
    },
    dependencies: packageJson.dependencies,
    engines: packageJson.engines || {
      "node": ">=18.0.0",
      "npm": ">=8.0.0"
    }
  };

  fs.writeFileSync(
    path.join('dist', 'package.json'),
    JSON.stringify(prodPackageJson, null, 2)
  );
  console.log('✅ Created production package.json');

  // Copy drizzle config for database operations
  if (fs.existsSync('drizzle.mysql.config.ts')) {
    fs.copyFileSync('drizzle.mysql.config.ts', path.join('dist', 'drizzle.mysql.config.ts'));
    console.log('✅ Copied drizzle config');
  }

  // Copy shared schema
  if (fs.existsSync('shared')) {
    fs.mkdirSync(path.join('dist', 'shared'), { recursive: true });
    fs.copyFileSync('shared/mysql-schema.ts', path.join('dist', 'shared', 'mysql-schema.ts'));
    console.log('✅ Copied shared schema');
  }

  // Create deployment README
  const deploymentInstructions = `# AquaFlow Production Deployment

## Quick Start
1. Upload this entire 'dist' folder to your Hostinger Node.js application directory
2. Run: npm install
3. Set environment variables in Hostinger control panel:
   - NODE_ENV=production
   - DATABASE_URL=your_mysql_connection_string
   - SESSION_SECRET=your_secure_secret
4. Start the application (Hostinger will handle this automatically)

## Environment Variables Required:
- NODE_ENV=production
- DATABASE_URL=mysql://u866935527_phw_2025:password@82.25.121.32:3306/u866935527_purehomewaters
- SESSION_SECRET=your-super-secure-random-string

## Files Included:
- server/ - Built backend application
- client/ - Built frontend (static files)
- package.json - Production dependencies
- shared/ - Database schema

## Hostinger Setup:
1. Set Application Startup File: server/index.js
2. Node.js Version: 18.x or higher
3. Environment: production

Your AquaFlow application is ready for deployment!
`;

  fs.writeFileSync(path.join('dist', 'DEPLOYMENT_README.md'), deploymentInstructions);
  console.log('✅ Created deployment instructions');

  console.log('\n🎉 Production build completed successfully!');
  console.log('📁 Built files are in the /dist directory');
  console.log('📖 See DEPLOYMENT_README.md in /dist for deployment instructions');
  console.log('\n📦 Ready for Hostinger deployment:');
  console.log('   1. Zip the /dist folder');
  console.log('   2. Upload to your Hostinger Node.js application');
  console.log('   3. Set environment variables');
  console.log('   4. Start your application');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}