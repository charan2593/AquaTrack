import {
  users,
  customers,
  services,
  rentDues,
  purifierPurchases,
  amcPurchases,
  inventoryItems,
  inventoryCategories,
  type User,
  type InsertUser,
  type Customer,
  type InsertCustomer,
  type Service,
  type InsertService,
  type RentDue,
  type InsertRentDue,
  type PurifierPurchase,
  type InsertPurifierPurchase,
  type AmcPurchase,
  type InsertAmcPurchase,
  type InventoryItem,
  type InsertInventoryItem,
  type InventoryCategory,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByMobile(mobile: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  getTodaysServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  
  // Rent due operations
  getRentDues(): Promise<RentDue[]>;
  getTodaysRentDues(): Promise<RentDue[]>;
  createRentDue(rentDue: InsertRentDue): Promise<RentDue>;
  updateRentDue(id: string, rentDue: Partial<InsertRentDue>): Promise<RentDue>;
  
  // Purchase operations
  getPurifierPurchases(): Promise<PurifierPurchase[]>;
  createPurifierPurchase(purchase: InsertPurifierPurchase): Promise<PurifierPurchase>;
  getAmcPurchases(): Promise<AmcPurchase[]>;
  createAmcPurchase(purchase: InsertAmcPurchase): Promise<AmcPurchase>;
  
  // Inventory operations
  getInventoryCategories(): Promise<InventoryCategory[]>;
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItemsByCategory(categoryId: string): Promise<InventoryItem[]>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem>;
  
  // Statistics
  getCustomerStats(): Promise<{ total: number; active: number; inactive: number }>;
  getServiceStats(): Promise<{ total: number; completed: number; pending: number }>;
  getDashboardStats(): Promise<{
    totalCustomers: number;
    todaysServices: number;
    pendingDues: number;
    inventoryItems: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByMobile(mobile: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.mobile, mobile));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(desc(services.scheduledDate));
  }

  async getTodaysServices(): Promise<Service[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db
      .select()
      .from(services)
      .where(eq(services.scheduledDate, today))
      .orderBy(services.scheduledTime);
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  // Rent due operations
  async getRentDues(): Promise<RentDue[]> {
    return await db.select().from(rentDues).orderBy(rentDues.dueDate);
  }

  async getTodaysRentDues(): Promise<RentDue[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db
      .select()
      .from(rentDues)
      .where(and(eq(rentDues.dueDate, today), eq(rentDues.status, 'pending')))
      .orderBy(rentDues.dueDate);
  }

  async createRentDue(rentDue: InsertRentDue): Promise<RentDue> {
    const [newRentDue] = await db.insert(rentDues).values(rentDue).returning();
    return newRentDue;
  }

  async updateRentDue(id: string, rentDue: Partial<InsertRentDue>): Promise<RentDue> {
    const [updatedRentDue] = await db
      .update(rentDues)
      .set({ ...rentDue, updatedAt: new Date() })
      .where(eq(rentDues.id, id))
      .returning();
    return updatedRentDue;
  }

  // Purchase operations
  async getPurifierPurchases(): Promise<PurifierPurchase[]> {
    return await db.select().from(purifierPurchases).orderBy(desc(purifierPurchases.purchaseDate));
  }

  async createPurifierPurchase(purchase: InsertPurifierPurchase): Promise<PurifierPurchase> {
    const [newPurchase] = await db.insert(purifierPurchases).values(purchase).returning();
    return newPurchase;
  }

  async getAmcPurchases(): Promise<AmcPurchase[]> {
    return await db.select().from(amcPurchases).orderBy(desc(amcPurchases.startDate));
  }

  async createAmcPurchase(purchase: InsertAmcPurchase): Promise<AmcPurchase> {
    const [newPurchase] = await db.insert(amcPurchases).values(purchase).returning();
    return newPurchase;
  }

  // Inventory operations
  async getInventoryCategories(): Promise<InventoryCategory[]> {
    return await db.select().from(inventoryCategories).orderBy(inventoryCategories.name);
  }

  async getInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems).orderBy(inventoryItems.name);
  }

  async getInventoryItemsByCategory(categoryId: string): Promise<InventoryItem[]> {
    return await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.categoryId, categoryId))
      .orderBy(inventoryItems.name);
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [newItem] = await db.insert(inventoryItems).values(item).returning();
    return newItem;
  }

  async updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem> {
    const [updatedItem] = await db
      .update(inventoryItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(inventoryItems.id, id))
      .returning();
    return updatedItem;
  }

  // Statistics
  async getCustomerStats(): Promise<{ total: number; active: number; inactive: number }> {
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(customers);
    const activeResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(eq(customers.status, 'active'));
    const inactiveResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(eq(customers.status, 'inactive'));

    return {
      total: totalResult[0]?.count || 0,
      active: activeResult[0]?.count || 0,
      inactive: inactiveResult[0]?.count || 0,
    };
  }

  async getServiceStats(): Promise<{ total: number; completed: number; pending: number }> {
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(services);
    const completedResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(services)
      .where(eq(services.status, 'completed'));
    const pendingResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(services)
      .where(eq(services.status, 'pending'));

    return {
      total: totalResult[0]?.count || 0,
      completed: completedResult[0]?.count || 0,
      pending: pendingResult[0]?.count || 0,
    };
  }

  async getDashboardStats(): Promise<{
    totalCustomers: number;
    todaysServices: number;
    pendingDues: number;
    inventoryItems: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    
    const [customersResult, servicesResult, duesResult, inventoryResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(customers),
      db.select({ count: sql<number>`count(*)` }).from(services).where(eq(services.scheduledDate, today)),
      db.select({ count: sql<number>`count(*)` }).from(rentDues).where(eq(rentDues.status, 'pending')),
      db.select({ count: sql<number>`count(*)` }).from(inventoryItems),
    ]);

    return {
      totalCustomers: customersResult[0]?.count || 0,
      todaysServices: servicesResult[0]?.count || 0,
      pendingDues: duesResult[0]?.count || 0,
      inventoryItems: inventoryResult[0]?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
