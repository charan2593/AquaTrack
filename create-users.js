import { createPool } from 'mysql2/promise';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function createUsers() {
  console.log('🌱 Creating initial users...');
  
  const pool = createPool(process.env.DATABASE_URL);
  
  try {
    // Check if users already exist
    const [existing] = await pool.execute('SELECT COUNT(*) as count FROM users');
    if (existing[0].count > 0) {
      console.log('✅ Users already exist, skipping creation.');
      return;
    }

    const users = [
      {
        mobile: '8500095021',
        password: await hashPassword('password'),
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@aquaflow.com',
        role: 'admin'
      },
      {
        mobile: '9999999999', 
        password: await hashPassword('password'),
        firstName: 'Manager',
        lastName: 'User',
        email: 'manager@aquaflow.com',
        role: 'manager'
      },
      {
        mobile: '7777777777',
        password: await hashPassword('password'),
        firstName: 'Service',
        lastName: 'Boy',
        email: 'service@aquaflow.com',
        role: 'technician'
      }
    ];

    for (const user of users) {
      const id = crypto.randomUUID();
      await pool.execute(
        'INSERT INTO users (id, mobile, password, firstName, lastName, email, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, user.mobile, user.password, user.firstName, user.lastName, user.email, user.role]
      );
      console.log(`✅ Created ${user.role}: ${user.mobile}`);
    }
    
    console.log('🎉 All users created successfully!');
    console.log('📱 Login credentials:');
    console.log('Admin: 8500095021 / password');
    console.log('Manager: 9999999999 / password');
    console.log('Service Boy: 7777777777 / password');
    
  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await pool.end();
  }
}

createUsers();
