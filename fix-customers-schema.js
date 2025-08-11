// Fix customers table schema to match application expectations
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixCustomersSchema() {
  console.log('🔧 Fixing customers table schema...');
  
  const connection = await createConnection(process.env.DATABASE_URL);
  
  try {
    // Check current customers table structure
    const [columns] = await connection.execute('DESCRIBE customers');
    console.log('📋 Current customers table columns:', columns.map(col => col.Field));
    
    // Drop and recreate customers table with correct schema
    await connection.execute('DROP TABLE IF EXISTS customers');
    console.log('✅ Dropped old customers table');
    
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
    console.log('✅ Created customers table with correct schema');
    
    // Fix other tables that might have issues
    await connection.execute('DROP TABLE IF EXISTS services');
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);
    console.log('✅ Fixed services table');
    
    await connection.execute('DROP TABLE IF EXISTS rent_dues');
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);
    console.log('✅ Fixed rent_dues table');
    
    await connection.execute('DROP TABLE IF EXISTS purifier_purchases');
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);
    console.log('✅ Fixed purifier_purchases table');
    
    await connection.execute('DROP TABLE IF EXISTS amc_purchases');
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);
    console.log('✅ Fixed amc_purchases table');
    
    // Create inventory table
    await connection.execute('DROP TABLE IF EXISTS inventory');
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
    
    // Check final structure
    const [finalColumns] = await connection.execute('DESCRIBE customers');
    console.log('📋 Updated customers table columns:', finalColumns.map(col => col.Field));
    
    console.log('🎉 All database schemas fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing schemas:', error);
  } finally {
    await connection.end();
  }
}

fixCustomersSchema();