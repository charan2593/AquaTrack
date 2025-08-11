// @ts-ignore - Import issues with dynamic database
import { users } from "../shared/mysql-schema";
// @ts-ignore - Import issues with dynamic database  
import { db } from "../server/db";
import { hashPassword } from "../server/auth";

async function seedUsers() {
  console.log('🌱 Seeding initial users...');

  // Check if users already exist
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log('✅ Users already exist, skipping seed.');
    return;
  }

  // Create admin user
  const adminPassword = await hashPassword('password');
  const managerPassword = await hashPassword('password');
  const technicianPassword = await hashPassword('password');

  const initialUsers = [
    {
      mobile: '8500095021',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@aquaflow.com',
      role: 'admin'
    },
    {
      mobile: '9999999999',
      password: managerPassword,
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@aquaflow.com',
      role: 'manager'
    },
    {
      mobile: '7777777777',
      password: technicianPassword,
      firstName: 'Service',
      lastName: 'Boy',
      email: 'service@aquaflow.com',
      role: 'technician'
    }
  ];

  try {
    for (const user of initialUsers) {
      await db.insert(users).values(user);
      console.log(`✅ Created ${user.role}: ${user.mobile}`);
    }
    
    console.log('🎉 All users created successfully!');
    console.log('');
    console.log('📱 Login credentials:');
    console.log('Admin: 8500095021 / password');
    console.log('Manager: 9999999999 / password');
    console.log('Service Boy: 7777777777 / password');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedUsers().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
  });
}

export { seedUsers };