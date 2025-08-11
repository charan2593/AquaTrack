// Fix column name mismatch between database and Drizzle schema
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixColumnNames() {
  console.log('🔧 Fixing column name mismatches...');
  
  const connection = await createConnection(process.env.DATABASE_URL);
  
  try {
    // Check current users table structure
    const [columns] = await connection.execute('DESCRIBE users');
    console.log('📋 Current users table columns:', columns.map(col => col.Field));
    
    // Rename columns to match Drizzle schema expectations
    await connection.execute('ALTER TABLE users CHANGE firstName first_name VARCHAR(100)');
    console.log('✅ Renamed firstName to first_name');
    
    await connection.execute('ALTER TABLE users CHANGE lastName last_name VARCHAR(100)');
    console.log('✅ Renamed lastName to last_name');
    
    await connection.execute('ALTER TABLE users CHANGE createdAt created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    console.log('✅ Renamed createdAt to created_at');
    
    await connection.execute('ALTER TABLE users CHANGE updatedAt updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    console.log('✅ Renamed updatedAt to updated_at');
    
    // Check final structure
    const [finalColumns] = await connection.execute('DESCRIBE users');
    console.log('📋 Updated users table columns:', finalColumns.map(col => col.Field));
    
    console.log('🎉 Column names fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing column names:', error);
  } finally {
    await connection.end();
  }
}

fixColumnNames();