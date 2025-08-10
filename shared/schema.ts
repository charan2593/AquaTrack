import { sql } from 'drizzle-orm';
import {
  boolean,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 100 }).unique(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Customers table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 15 }),
  email: varchar("email", { length: 100 }),
  address: text("address"),
  city: varchar("city", { length: 50 }),
  state: varchar("state", { length: 50 }),
  pincode: varchar("pincode", { length: 10 }),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Services table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  serviceType: varchar("service_type", { length: 50 }).notNull(),
  serviceDate: timestamp("service_date").notNull(),
  description: text("description"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 20 }).default("scheduled").notNull(),
  technicianId: integer("technician_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Rent dues table
export const rentDues = pgTable("rent_dues", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  paidDate: timestamp("paid_date"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Purifier purchases table
export const purifierPurchases = pgTable("purifier_purchases", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  productName: varchar("product_name", { length: 100 }).notNull(),
  model: varchar("model", { length: 50 }),
  serialNumber: varchar("serial_number", { length: 100 }),
  purchaseDate: timestamp("purchase_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  warranty: integer("warranty"), // in months
  status: varchar("status", { length: 20 }).default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AMC purchases table
export const amcPurchases = pgTable("amc_purchases", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  purifierId: integer("purifier_id").references(() => purifierPurchases.id),
  planName: varchar("plan_name", { length: 100 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  servicesIncluded: integer("services_included"),
  servicesUsed: integer("services_used").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Inventory items table
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // rental, retail, filters, motors, uv_lights
  description: text("description"),
  sku: varchar("sku", { length: 50 }),
  brand: varchar("brand", { length: 50 }),
  model: varchar("model", { length: 50 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  rentPrice: decimal("rent_price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0).notNull(),
  minStock: integer("min_stock").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertCustomerSchema = createInsertSchema(customers).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertServiceSchema = createInsertSchema(services).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertRentDueSchema = createInsertSchema(rentDues).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertPurifierPurchaseSchema = createInsertSchema(purifierPurchases).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertAmcPurchaseSchema = createInsertSchema(amcPurchases).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type RentDue = typeof rentDues.$inferSelect;
export type InsertRentDue = z.infer<typeof insertRentDueSchema>;

export type PurifierPurchase = typeof purifierPurchases.$inferSelect;
export type InsertPurifierPurchase = z.infer<typeof insertPurifierPurchaseSchema>;

export type AmcPurchase = typeof amcPurchases.$inferSelect;
export type InsertAmcPurchase = z.infer<typeof insertAmcPurchaseSchema>;

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;