import { createPool } from 'mysql2/promise';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

// Use development database URL
const databaseUrl = process.env.DEV_DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DEV_DATABASE_URL not found in environment variables');
  process.exit(1);
}

console.log('🗄️ Setting up development database...');
console.log(`📍 Database: ${databaseUrl.replace(/:[^:]*@/, ':***@')}`);

const pool = createPool(databaseUrl);

async function createTables() {
  try {
    console.log('📋 Creating tables...');

    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        mobile VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'manager', 'service_boy') NOT NULL DEFAULT 'service_boy',
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create customers table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20) NOT NULL,
        phone_verified BOOLEAN DEFAULT FALSE,
        door_no VARCHAR(20),
        address1 VARCHAR(255),
        address2 VARCHAR(255),
        pincode VARCHAR(10),
        product_type VARCHAR(100),
        service_type ENUM('rental', 'amc', 'both') DEFAULT 'rental',
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create services table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        customer_id VARCHAR(36) NOT NULL,
        service_type ENUM('maintenance', 'repair', 'installation', 'inspection') NOT NULL,
        status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
        scheduled_date DATE NOT NULL,
        scheduled_time TIME,
        actual_date DATE,
        actual_time TIME,
        notes TEXT,
        technician_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer_id (customer_id),
        INDEX idx_scheduled_date (scheduled_date),
        INDEX idx_status (status)
      )
    `);

    // Create rent_dues table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS rent_dues (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        customer_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        due_date DATE NOT NULL,
        paid_date DATE,
        status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
        payment_method VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer_id (customer_id),
        INDEX idx_due_date (due_date),
        INDEX idx_status (status)
      )
    `);

    // Create purifier_purchases table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS purifier_purchases (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        customer_id VARCHAR(36) NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        model VARCHAR(50),
        price DECIMAL(10,2) NOT NULL,
        purchase_date DATE NOT NULL,
        warranty_start DATE,
        warranty_end DATE,
        status ENUM('active', 'warranty_expired', 'replaced') DEFAULT 'active',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer_id (customer_id),
        INDEX idx_purchase_date (purchase_date)
      )
    `);

    // Create amc_purchases table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS amc_purchases (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        customer_id VARCHAR(36) NOT NULL,
        plan_name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
        services_included TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer_id (customer_id),
        INDEX idx_start_date (start_date),
        INDEX idx_end_date (end_date)
      )
    `);

    // Create inventory_categories table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS inventory_categories (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create inventory_items table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        category_id VARCHAR(36) NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        sku VARCHAR(50) UNIQUE,
        price DECIMAL(10,2) NOT NULL,
        cost DECIMAL(10,2),
        stock_quantity INT DEFAULT 0,
        min_stock_level INT DEFAULT 0,
        status ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category_id (category_id),
        INDEX idx_sku (sku),
        INDEX idx_status (status)
      )
    `);

    // Create sessions table for authentication
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
        expires INT(11) UNSIGNED NOT NULL,
        data MEDIUMTEXT COLLATE utf8mb4_bin,
        PRIMARY KEY (session_id)
      )
    `);

    console.log('✅ All tables created successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log('👥 Creating initial users...');

    const users = [
      {
        mobile: '8500095021',
        password: await hashPassword('password'),
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User'
      },
      {
        mobile: '9999999999',
        password: await hashPassword('password'),
        role: 'manager',
        first_name: 'Manager',
        last_name: 'User'
      },
      {
        mobile: '7777777777',
        password: await hashPassword('password'),
        role: 'service_boy',
        first_name: 'Service',
        last_name: 'Boy'
      }
    ];

    for (const user of users) {
      await pool.execute(`
        INSERT IGNORE INTO users (mobile, password, role, first_name, last_name)
        VALUES (?, ?, ?, ?, ?)
      `, [user.mobile, user.password, user.role, user.first_name, user.last_name]);
      
      console.log(`✅ Created user: ${user.role} (${user.mobile})`);
    }

  } catch (error) {
    console.error('❌ Error creating users:', error.message);
    throw error;
  }
}

async function createInventoryCategories() {
  try {
    console.log('📦 Creating inventory categories...');

    const categories = [
      { name: 'Water Purifiers', description: 'All types of water purification systems' },
      { name: 'Filters', description: 'Replacement filters and cartridges' },
      { name: 'UV Lights', description: 'UV sterilization lamps and components' },
      { name: 'Motors', description: 'Water pump motors and accessories' },
      { name: 'Spare Parts', description: 'Various spare parts and components' }
    ];

    for (const category of categories) {
      await pool.execute(`
        INSERT IGNORE INTO inventory_categories (name, description)
        VALUES (?, ?)
      `, [category.name, category.description]);
      
      console.log(`✅ Created category: ${category.name}`);
    }

  } catch (error) {
    console.error('❌ Error creating categories:', error.message);
    throw error;
  }
}

async function setupDevelopmentDatabase() {
  try {
    await createTables();
    await createInitialUsers();
    await createInventoryCategories();
    
    console.log('🎉 Development database setup completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('• Admin: 8500095021 / password');
    console.log('• Manager: 9999999999 / password');
    console.log('• Service Boy: 7777777777 / password');
    
  } catch (error) {
    console.error('💥 Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDevelopmentDatabase();