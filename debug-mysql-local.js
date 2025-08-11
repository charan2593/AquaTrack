// Debug script to test MySQL connection locally
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log('🔍 Testing MySQL Connection...');
  console.log('DATABASE_URL from env:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ No DATABASE_URL found in environment');
    return;
  }

  try {
    // Parse the DATABASE_URL
    const url = new URL(process.env.DATABASE_URL);
    console.log('📋 Connection Details:');
    console.log('  Protocol:', url.protocol);
    console.log('  Host:', url.hostname);
    console.log('  Port:', url.port);
    console.log('  Database:', url.pathname.slice(1));
    console.log('  Username:', url.username);
    console.log('  Password:', url.password ? '***' : 'MISSING');

    const connection = await createConnection({
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: false, // Try without SSL first
      timeout: 10000
    });

    console.log('✅ Connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check your password in Hostinger control panel');
      console.log('2. Verify your IP is allowed (may need to add your local IP)');
      console.log('3. Confirm the username and database name are correct');
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('\n💡 Network issue:');
      console.log('1. Check the hostname/IP address');
      console.log('2. Verify port 3306 is accessible');
      console.log('3. Check if firewall is blocking the connection');
    }
  }
}

testConnection();