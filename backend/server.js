const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { eq, desc, asc } = require('drizzle-orm');
const ws = require('ws');

// Import schema
const schema = require('../shared/schema.js');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Find user
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username));

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username));

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(schema.users)
      .values({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        role: role || 'user'
      })
      .returning();

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, req.user.id));

    if (!user || !user.isActive) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user info' });
  }
});

// Customers routes
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const customers = await db
      .select()
      .from(schema.customers)
      .orderBy(desc(schema.customers.createdAt));
    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
});

app.post('/api/customers', authenticateToken, async (req, res) => {
  try {
    const [newCustomer] = await db
      .insert(schema.customers)
      .values(req.body)
      .returning();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Failed to create customer' });
  }
});

// Services routes
app.get('/api/services', authenticateToken, async (req, res) => {
  try {
    const services = await db
      .select({
        id: schema.services.id,
        customerId: schema.services.customerId,
        serviceType: schema.services.serviceType,
        serviceDate: schema.services.serviceDate,
        description: schema.services.description,
        cost: schema.services.cost,
        status: schema.services.status,
        notes: schema.services.notes,
        customerName: schema.customers.name,
        customerPhone: schema.customers.phone
      })
      .from(schema.services)
      .leftJoin(schema.customers, eq(schema.services.customerId, schema.customers.id))
      .orderBy(desc(schema.services.serviceDate));
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

app.get('/api/services/today', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayServices = await db
      .select({
        id: schema.services.id,
        customerId: schema.services.customerId,
        serviceType: schema.services.serviceType,
        serviceDate: schema.services.serviceDate,
        description: schema.services.description,
        cost: schema.services.cost,
        status: schema.services.status,
        notes: schema.services.notes,
        customerName: schema.customers.name,
        customerPhone: schema.customers.phone,
        customerAddress: schema.customers.address
      })
      .from(schema.services)
      .leftJoin(schema.customers, eq(schema.services.customerId, schema.customers.id))
      .where(
        and(
          gte(schema.services.serviceDate, today),
          lt(schema.services.serviceDate, tomorrow)
        )
      )
      .orderBy(asc(schema.services.serviceDate));
    
    res.json(todayServices);
  } catch (error) {
    console.error('Get today services error:', error);
    res.status(500).json({ message: 'Failed to fetch today services' });
  }
});

// Rent dues routes
app.get('/api/rent-dues', authenticateToken, async (req, res) => {
  try {
    const rentDues = await db
      .select({
        id: schema.rentDues.id,
        customerId: schema.rentDues.customerId,
        amount: schema.rentDues.amount,
        dueDate: schema.rentDues.dueDate,
        status: schema.rentDues.status,
        paidDate: schema.rentDues.paidDate,
        paymentMethod: schema.rentDues.paymentMethod,
        notes: schema.rentDues.notes,
        customerName: schema.customers.name,
        customerPhone: schema.customers.phone
      })
      .from(schema.rentDues)
      .leftJoin(schema.customers, eq(schema.rentDues.customerId, schema.customers.id))
      .orderBy(desc(schema.rentDues.dueDate));
    res.json(rentDues);
  } catch (error) {
    console.error('Get rent dues error:', error);
    res.status(500).json({ message: 'Failed to fetch rent dues' });
  }
});

// Inventory routes
app.get('/api/inventory', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;
    let query = db.select().from(schema.inventoryItems);
    
    if (category) {
      query = query.where(eq(schema.inventoryItems.category, category));
    }
    
    const inventory = await query.orderBy(asc(schema.inventoryItems.name));
    res.json(inventory);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const totalCustomers = await db
      .select({ count: sql`count(*)` })
      .from(schema.customers)
      .where(eq(schema.customers.status, 'active'));

    const totalServices = await db
      .select({ count: sql`count(*)` })
      .from(schema.services);

    const pendingDues = await db
      .select({ count: sql`count(*)`, total: sql`sum(amount)` })
      .from(schema.rentDues)
      .where(eq(schema.rentDues.status, 'pending'));

    const todayServices = await db
      .select({ count: sql`count(*)` })
      .from(schema.services)
      .where(
        and(
          gte(schema.services.serviceDate, new Date(new Date().setHours(0, 0, 0, 0))),
          lt(schema.services.serviceDate, new Date(new Date().setHours(23, 59, 59, 999)))
        )
      );

    res.json({
      totalCustomers: totalCustomers[0]?.count || 0,
      totalServices: totalServices[0]?.count || 0,
      pendingDues: {
        count: pendingDues[0]?.count || 0,
        amount: pendingDues[0]?.total || 0
      },
      todayServices: todayServices[0]?.count || 0
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});