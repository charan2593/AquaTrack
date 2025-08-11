import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertCustomerSchema, insertServiceSchema, insertRentDueSchema, insertPurifierPurchaseSchema, insertAmcPurchaseSchema, insertInventoryItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Customer routes
  app.get('/api/customers', isAuthenticated, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get('/api/customers/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getCustomerStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching customer stats:", error);
      res.status(500).json({ message: "Failed to fetch customer stats" });
    }
  });

  app.post('/api/customers', isAuthenticated, async (req: any, res) => {
    try {
      // Service boys cannot create customers (read-only access)
      if (req.user?.role === 'service boy') {
        return res.status(403).json({ message: "Access denied. Service boys have read-only access to customers." });
      }
      
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating customer:", error);
        res.status(500).json({ message: "Failed to create customer" });
      }
    }
  });

  app.put('/api/customers/:id', isAuthenticated, async (req: any, res) => {
    try {
      // Service boys cannot update customers (read-only access)
      if (req.user?.role === 'service boy') {
        return res.status(403).json({ message: "Access denied. Service boys have read-only access to customers." });
      }
      
      const { id } = req.params;
      const customerData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(id, customerData);
      res.json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Failed to update customer" });
      }
    }
  });

  app.delete('/api/customers/:id', isAuthenticated, async (req: any, res) => {
    try {
      // Service boys cannot delete customers (read-only access)
      if (req.user?.role === 'service boy') {
        return res.status(403).json({ message: "Access denied. Service boys have read-only access to customers." });
      }
      
      const { id } = req.params;
      await storage.deleteCustomer(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Service routes
  app.get('/api/services', isAuthenticated, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/services/today', isAuthenticated, async (req, res) => {
    try {
      const services = await storage.getTodaysServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching today's services:", error);
      res.status(500).json({ message: "Failed to fetch today's services" });
    }
  });

  app.post('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      // Service boys cannot create services (read-only access)
      if (req.user?.role === 'service boy') {
        return res.status(403).json({ message: "Access denied. Service boys have read-only access to services." });
      }
      
      const serviceData = insertServiceSchema.parse({
        ...req.body,
        scheduledDate: new Date(req.body.scheduledDate)
      });
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating service:", error);
        res.status(500).json({ message: "Failed to create service" });
      }
    }
  });

  // Rent dues routes
  app.get('/api/rent-dues', isAuthenticated, async (req: any, res) => {
    try {
      // Service boys cannot access rent dues
      if (req.user?.role === 'service boy') {
        return res.status(403).json({ message: "Access denied. Service boys cannot access rent dues." });
      }
      
      const rentDues = await storage.getRentDues();
      res.json(rentDues);
    } catch (error) {
      console.error("Error fetching rent dues:", error);
      res.status(500).json({ message: "Failed to fetch rent dues" });
    }
  });

  app.get('/api/rent-dues/today', isAuthenticated, async (req: any, res) => {
    try {
      // Service boys cannot access rent dues
      if (req.user?.role === 'service boy') {
        return res.status(403).json({ message: "Access denied. Service boys cannot access rent dues." });
      }
      
      const rentDues = await storage.getTodaysRentDues();
      res.json(rentDues);
    } catch (error) {
      console.error("Error fetching today's rent dues:", error);
      res.status(500).json({ message: "Failed to fetch today's rent dues" });
    }
  });

  app.put('/api/rent-dues/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const rentDueData = insertRentDueSchema.partial().parse({
        ...req.body,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
        paidDate: req.body.paidDate ? new Date(req.body.paidDate) : undefined
      });
      const rentDue = await storage.updateRentDue(id, rentDueData);
      res.json(rentDue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error updating rent due:", error);
        res.status(500).json({ message: "Failed to update rent due" });
      }
    }
  });

  // Purchase routes
  app.get('/api/purifier-purchases', isAuthenticated, async (req: any, res) => {
    try {
      // Service boys cannot access purifier purchases
      if (req.user?.role === 'service boy') {
        return res.status(403).json({ message: "Access denied. Service boys cannot access purifier purchases." });
      }
      
      const purchases = await storage.getPurifierPurchases();
      res.json(purchases);
    } catch (error) {
      console.error("Error fetching purifier purchases:", error);
      res.status(500).json({ message: "Failed to fetch purifier purchases" });
    }
  });

  app.post('/api/purifier-purchases', isAuthenticated, async (req: any, res) => {
    try {
      // Service boys cannot create purifier purchases
      if (req.user?.role === 'service boy') {
        return res.status(403).json({ message: "Access denied. Service boys cannot create purifier purchases." });
      }
      
      const purchaseData = insertPurifierPurchaseSchema.parse({
        ...req.body,
        purchaseDate: new Date(req.body.purchaseDate)
      });
      const purchase = await storage.createPurifierPurchase(purchaseData);
      res.status(201).json(purchase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating purifier purchase:", error);
        res.status(500).json({ message: "Failed to create purifier purchase" });
      }
    }
  });

  app.get('/api/amc-purchases', isAuthenticated, async (req: any, res) => {
    try {
      // Service boys cannot access AMC purchases
      if (req.user?.role === 'service boy') {
        return res.status(403).json({ message: "Access denied. Service boys cannot access AMC purchases." });
      }
      
      const purchases = await storage.getAmcPurchases();
      res.json(purchases);
    } catch (error) {
      console.error("Error fetching AMC purchases:", error);
      res.status(500).json({ message: "Failed to fetch AMC purchases" });
    }
  });

  app.post('/api/amc-purchases', isAuthenticated, async (req: any, res) => {
    try {
      // Service boys cannot create AMC purchases
      if (req.user?.role === 'service boy') {
        return res.status(403).json({ message: "Access denied. Service boys cannot create AMC purchases." });
      }
      
      const purchaseData = insertAmcPurchaseSchema.parse({
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        packageName: req.body.planName // Map planName to packageName
      });
      const purchase = await storage.createAmcPurchase(purchaseData);
      res.status(201).json(purchase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating AMC purchase:", error);
        res.status(500).json({ message: "Failed to create AMC purchase" });
      }
    }
  });

  // Inventory routes
  app.get('/api/inventory/categories', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user has access to inventory (not manager)
      if (req.user?.role === 'manager') {
        return res.status(403).json({ message: "Access denied. Managers cannot access inventory." });
      }
      
      const categories = await storage.getInventoryCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching inventory categories:", error);
      res.status(500).json({ message: "Failed to fetch inventory categories" });
    }
  });

  app.get('/api/inventory/items', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user has access to inventory (not manager)
      if (req.user?.role === 'manager') {
        return res.status(403).json({ message: "Access denied. Managers cannot access inventory." });
      }
      
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      res.status(500).json({ message: "Failed to fetch inventory items" });
    }
  });

  app.get('/api/inventory/items/category/:categoryId', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user has access to inventory (not manager)
      if (req.user?.role === 'manager') {
        return res.status(403).json({ message: "Access denied. Managers cannot access inventory." });
      }
      
      const { categoryId } = req.params;
      const items = await storage.getInventoryItemsByCategory(categoryId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching inventory items by category:", error);
      res.status(500).json({ message: "Failed to fetch inventory items by category" });
    }
  });

  app.post('/api/inventory/items', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user has access to inventory (not manager)
      if (req.user?.role === 'manager') {
        return res.status(403).json({ message: "Access denied. Managers cannot access inventory." });
      }
      
      const itemData = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating inventory item:", error);
        res.status(500).json({ message: "Failed to create inventory item" });
      }
    }
  });

  // User Management API Routes (Admin only)
  
  // Get all users
  app.get("/api/users", isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin access required." });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Create new user
  app.post("/api/users", isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin access required." });
      }

      const userData = req.body;
      const existingUser = await storage.getUserByMobile(userData.mobile);
      if (existingUser) {
        return res.status(400).json({ message: "Mobile number already registered" });
      }

      const user = await storage.createUser(userData);
      // Don't return password in response
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Update user
  app.put("/api/users/:id", isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin access required." });
      }

      const { id } = req.params;
      const userData = req.body;

      const user = await storage.updateUser(id, userData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't return password in response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Delete user
  app.delete("/api/users/:id", isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin access required." });
      }

      const { id } = req.params;
      
      // Don't allow deleting self
      if (req.user?.id === id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }

      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
