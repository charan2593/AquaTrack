import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'aquaflow-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist directory (if exists)
if (fs.existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// In-memory data storage (for demo purposes)
let users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
    email: 'admin@aquaflow.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let customers = [
  {
    id: 1,
    name: 'John Doe',
    phone: '9876543210',
    email: 'john.doe@email.com',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '9876543211',
    email: 'jane.smith@email.com',
    address: '456 Park Avenue',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

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
    const user = users.find(u => u.username === username && u.isActive);
    if (!user) {
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

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id && u.isActive);
    if (!user) {
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

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const stats = {
      totalCustomers: customers.filter(c => c.status === 'active').length,
      totalServices: 25,
      pendingDues: {
        count: 8,
        amount: 15000
      },
      todayServices: 5
    };

    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// Customers routes
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
});

// Catch all handler for Angular routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'src', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ message: 'AquaFlow API Server - Angular app not built yet' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AquaFlow server running on port ${PORT}`);
  console.log('Demo login credentials:');
  console.log('Username: admin');
  console.log('Password: admin123');
});