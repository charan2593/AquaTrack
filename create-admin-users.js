import { Pool } from '@neondatabase/serverless';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUsers() {
  // Use Replit's PostgreSQL database
  const databaseUrl = process.env.PGDATABASE ? 
    `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require` :
    'postgresql://neondb_owner:npg_eF4ZaH7sMqgp@ep-polished-math-af7yzbh8.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require';
  
  const pool = new Pool({ connectionString: databaseUrl });
  
  try {
    console.log('Creating admin users...');
    
    const hashedPassword = await hashPassword('password');
    
    // Create admin user
    await pool.query(`
      INSERT INTO users (id, mobile, password, email, first_name, last_name, role, created_at, updated_at)
      VALUES (gen_random_uuid(), '8500095021', $1, 'admin@purehomewaters.com', 'Admin', 'User', 'admin', NOW(), NOW())
      ON CONFLICT (mobile) DO UPDATE SET 
        password = $1,
        role = 'admin',
        updated_at = NOW()
    `, [hashedPassword]);
    
    // Create manager user
    await pool.query(`
      INSERT INTO users (id, mobile, password, email, first_name, last_name, role, created_at, updated_at)
      VALUES (gen_random_uuid(), '9999999999', $1, 'manager@purehomewaters.com', 'Manager', 'User', 'manager', NOW(), NOW())
      ON CONFLICT (mobile) DO UPDATE SET 
        password = $1,
        role = 'manager',
        updated_at = NOW()
    `, [hashedPassword]);
    
    // Create service boy user
    await pool.query(`
      INSERT INTO users (id, mobile, password, email, first_name, last_name, role, created_at, updated_at)
      VALUES (gen_random_uuid(), '7777777777', $1, 'service@purehomewaters.com', 'Service', 'Boy', 'technician', NOW(), NOW())
      ON CONFLICT (mobile) DO UPDATE SET 
        password = $1,
        role = 'technician',
        updated_at = NOW()
    `, [hashedPassword]);
    
    console.log('✅ Admin users created successfully!');
    console.log('Login credentials:');
    console.log('- Admin: 8500095021 / password');
    console.log('- Manager: 9999999999 / password');
    console.log('- Service Boy: 7777777777 / password');
    
    await pool.end();
  } catch (error) {
    console.error('Error creating admin users:', error);
    await pool.end();
    process.exit(1);
  }
}

createAdminUsers();