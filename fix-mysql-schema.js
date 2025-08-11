// Fix MySQL schema issues
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixSchema() {
  console.log('🔧 Fixing MySQL schema...');
  
  const connection = await createConnection(process.env.DATABASE_URL);
  
  try {
    // Check existing tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Existing tables:', tables);
    
    // Drop problematic tables to recreate them
    const tablesToDrop = ['amc_purchases', 'purifier_purchases', 'rent_dues', 'services', 'customers', 'users', 'inventory'];
    
    for (const table of tablesToDrop) {
      try {
        await connection.execute(`DROP TABLE IF EXISTS \`${table}\``);
        console.log(`✅ Dropped table: ${table}`);
      } catch (error) {
        console.log(`⚠️  Could not drop ${table}:`, error.message);
      }
    }
    
    // Create users table first (most important)
    await connection.execute(`
      CREATE TABLE users (
        id VARCHAR(36) PRIMARY KEY,
        mobile VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(100),
        lastName VARCHAR(100),
        email VARCHAR(255),
        role ENUM('admin', 'manager', 'technician') DEFAULT 'technician',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created users table');
    
    // Create customers table
    await connection.execute(`
      CREATE TABLE customers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        address TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created customers table');
    
    // Create inventory table
    await connection.execute(`
      CREATE TABLE inventory (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        type ENUM('rental_product', 'retail_product', 'filter', 'motor', 'uv_light') NOT NULL,
        price DECIMAL(10,2),
        stock INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created inventory table');
    
    // Create services table
    await connection.execute(`
      CREATE TABLE services (
        id VARCHAR(36) PRIMARY KEY,
        customerId VARCHAR(36),
        type VARCHAR(100),
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        scheduledDate DATE,
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customerId) REFERENCES customers(id)
      )
    `);
    console.log('✅ Created services table');
    
    // Create rent_dues table
    await connection.execute(`
      CREATE TABLE rent_dues (
        id VARCHAR(36) PRIMARY KEY,
        customerId VARCHAR(36),
        amount DECIMAL(10,2),
        dueDate DATE,
        status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customerId) REFERENCES customers(id)
      )
    `);
    console.log('✅ Created rent_dues table');
    
    // Create purifier_purchases table
    await connection.execute(`
      CREATE TABLE purifier_purchases (
        id VARCHAR(36) PRIMARY KEY,
        customerId VARCHAR(36),
        itemName VARCHAR(200),
        price DECIMAL(10,2),
        purchaseDate DATE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customerId) REFERENCES customers(id)
      )
    `);
    console.log('✅ Created purifier_purchases table');
    
    // Create amc_purchases table
    await connection.execute(`
      CREATE TABLE amc_purchases (
        id VARCHAR(36) PRIMARY KEY,
        customerId VARCHAR(36),
        itemName VARCHAR(200),
        price DECIMAL(10,2),
        purchaseDate DATE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customerId) REFERENCES customers(id)
      )
    `);
    console.log('✅ Created amc_purchases table');
    
    // Create sessions table for authentication
    await connection.execute(`
      CREATE TABLE sessions (
        session_id VARCHAR(128) PRIMARY KEY,
        expires INT UNSIGNED NOT NULL,
        data MEDIUMTEXT
      )
    `);
    console.log('✅ Created sessions table');
    
    console.log('🎉 Schema fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing schema:', error);
  } finally {
    await connection.end();
  }
}

fixSchema();