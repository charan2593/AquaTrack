import { sql } from 'drizzle-orm';
import {
  mysqlTable,
  varchar,
  text,
  int,
  decimal,
  boolean,
  date,
  timestamp,
  json,
  index,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User storage table - MySQL version
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  mobile: varchar("mobile", { length: 15 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: varchar("role", { length: 20 }).notNull().default('technician'), // admin, manager, technician
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Customers table - MySQL version
export const customers = mysqlTable("customers", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 15 }).notNull(),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  doorNo: varchar("door_no", { length: 50 }).notNull(),
  address1: varchar("address1", { length: 255 }).notNull(),
  address2: varchar("address2", { length: 255 }),
  pincode: varchar("pincode", { length: 10 }).notNull(),
  productType: varchar("product_type", { length: 50 }).notNull(),
  serviceType: varchar("service_type", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default('active'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Services table - MySQL version
export const services = mysqlTable("services", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  customerId: varchar("customer_id", { length: 36 }).notNull(),
  serviceType: varchar("service_type", { length: 20 }).notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  scheduledTime: varchar("scheduled_time", { length: 10 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default('pending'),
  technicianId: varchar("technician_id", { length: 36 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Rent dues table - MySQL version
export const rentDues = mysqlTable("rent_dues", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  customerId: varchar("customer_id", { length: 36 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: date("due_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default('pending'),
  paidDate: date("paid_date"),
  paymentMethod: varchar("payment_method", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Purifier purchases table - MySQL version
export const purifierPurchases = mysqlTable("purifier_purchases", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  customerId: varchar("customer_id", { length: 36 }).notNull(),
  productName: varchar("product_name", { length: 100 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: date("purchase_date").notNull(),
  warrantyPeriod: int("warranty_period"),
  status: varchar("status", { length: 20 }).notNull().default('active'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// AMC purchases table - MySQL version
export const amcPurchases = mysqlTable("amc_purchases", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  customerId: varchar("customer_id", { length: 36 }).notNull(),
  packageName: varchar("package_name", { length: 100 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default('active'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Inventory categories table - MySQL version
export const inventoryCategories = mysqlTable("inventory_categories", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Inventory items table - MySQL version
export const inventoryItems = mysqlTable("inventory_items", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  categoryId: varchar("category_id", { length: 36 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  quantity: int("quantity").notNull().default(0),
  price: decimal("price", { precision: 10, scale: 2 }),
  minStock: int("min_stock").default(0),
  maxStock: int("max_stock").default(100),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;
export type RentDue = typeof rentDues.$inferSelect;
export type InsertRentDue = typeof rentDues.$inferInsert;
export type PurifierPurchase = typeof purifierPurchases.$inferSelect;
export type InsertPurifierPurchase = typeof purifierPurchases.$inferInsert;
export type AmcPurchase = typeof amcPurchases.$inferSelect;
export type InsertAmcPurchase = typeof amcPurchases.$inferInsert;
export type InventoryCategory = typeof inventoryCategories.$inferSelect;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = typeof inventoryItems.$inferInsert;

// Validation schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRentDueSchema = createInsertSchema(rentDues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPurifierPurchaseSchema = createInsertSchema(purifierPurchases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAmcPurchaseSchema = createInsertSchema(amcPurchases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Insert types
export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertCustomerType = z.infer<typeof insertCustomerSchema>;
export type InsertServiceType = z.infer<typeof insertServiceSchema>;
export type InsertRentDueType = z.infer<typeof insertRentDueSchema>;
export type InsertPurifierPurchaseType = z.infer<typeof insertPurifierPurchaseSchema>;
export type InsertAmcPurchaseType = z.infer<typeof insertAmcPurchaseSchema>;
export type InsertInventoryItemType = z.infer<typeof insertInventoryItemSchema>;