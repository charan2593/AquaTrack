// Fix database schema by disabling foreign key constraints first
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixSchemaNoConstraints() {
  console.log('🔧 Fixing database schema (disabling foreign key constraints)...');
  
  const connection = await createConnection(process.env.DATABASE_URL);
  
  try {
    // Disable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    console.log('✅ Disabled foreign key checks');
    
    // Drop all tables
    const tablesToDrop = ['amc_purchases', 'purifier_purchases', 'rent_dues', 'services', 'customers', 'inventory'];
    for (const table of tablesToDrop) {
      try {
        await connection.execute(`DROP TABLE IF EXISTS \`${table}\``);
        console.log(`✅ Dropped table: ${table}`);
      } catch (error) {
        console.log(`⚠️  Could not drop ${table}:`, error.message);
      }
    }
    
    // Create customers table with correct schema
    await connection.execute(`
      CREATE TABLE customers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20) NOT NULL,
        phone_verified BOOLEAN DEFAULT FALSE,
        door_no VARCHAR(50) NOT NULL,
        address1 VARCHAR(255) NOT NULL,
        address2 VARCHAR(255),
        pincode VARCHAR(10) NOT NULL,
        product_type VARCHAR(50) NOT NULL,
        service_type VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created customers table');
    
    // Create services table
    await connection.execute(`
      CREATE TABLE services (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36),
        service_type VARCHAR(20) NOT NULL,
        scheduled_date DATE NOT NULL,
        scheduled_time VARCHAR(10) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        technician_id VARCHAR(36),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created services table');
    
    // Create rent_dues table
    await connection.execute(`
      CREATE TABLE rent_dues (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36),
        amount DECIMAL(10,2) NOT NULL,
        due_date DATE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        paid_date DATE,
        payment_method VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created rent_dues table');
    
    // Create purifier_purchases table
    await connection.execute(`
      CREATE TABLE purifier_purchases (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36),
        product_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        purchase_date DATE NOT NULL,
        warranty_period INT,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created purifier_purchases table');
    
    // Create amc_purchases table
    await connection.execute(`
      CREATE TABLE amc_purchases (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36),
        product_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        purchase_date DATE NOT NULL,
        warranty_period INT,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created amc_purchases table');
    
    // Create inventory table
    await connection.execute(`
      CREATE TABLE inventory (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        category VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        price DECIMAL(10,2),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created inventory table');
    
    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Re-enabled foreign key checks');
    
    console.log('🎉 Database schema fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing schema:', error);
  } finally {
    await connection.end();
  }
}

fixSchemaNoConstraints();