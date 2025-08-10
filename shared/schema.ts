import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mobile: varchar("mobile").notNull().unique(),
  password: varchar("password").notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  role: varchar("role").notNull().default('technician'), // admin, manager, technician
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customers table
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email"),
  phone: varchar("phone").notNull(),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  doorNo: varchar("door_no").notNull(),
  address1: varchar("address1").notNull(),
  address2: varchar("address2"),
  pincode: varchar("pincode").notNull(),
  productType: varchar("product_type").notNull(), // aqua-fresh-type1, aqua-fresh-type2, fonix
  serviceType: varchar("service_type").notNull(), // rental, purchase, amc
  status: varchar("status").notNull().default('active'), // active, inactive
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services table
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  serviceType: varchar("service_type").notNull(), // rental, amc
  scheduledDate: date("scheduled_date").notNull(),
  scheduledTime: varchar("scheduled_time").notNull(),
  status: varchar("status").notNull().default('pending'), // pending, completed, cancelled
  technicianId: varchar("technician_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Rent dues table
export const rentDues = pgTable("rent_dues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: date("due_date").notNull(),
  status: varchar("status").notNull().default('pending'), // pending, paid, overdue
  paidDate: date("paid_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Purifier purchases table
export const purifierPurchases = pgTable("purifier_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  productName: varchar("product_name").notNull(),
  modelNumber: varchar("model_number").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: date("purchase_date").notNull(),
  status: varchar("status").notNull().default('pending'), // pending, delivered, cancelled
  warrantyPeriod: integer("warranty_period"), // in months
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AMC purchases table
export const amcPurchases = pgTable("amc_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  planName: varchar("plan_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  servicesPerYear: integer("services_per_year").notNull(),
  status: varchar("status").notNull().default('active'), // active, expired, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory categories
export const inventoryCategories = pgTable("inventory_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // rental, retail, filters, motors, uvlights
  createdAt: timestamp("created_at").defaultNow(),
});

// Inventory items table
export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => inventoryCategories.id),
  name: varchar("name").notNull(),
  model: varchar("model"),
  quantity: integer("quantity").notNull().default(0),
  minStockLevel: integer("min_stock_level").default(5),
  price: decimal("price", { precision: 10, scale: 2 }),
  rentalRate: decimal("rental_rate", { precision: 10, scale: 2 }),
  status: varchar("status").notNull().default('available'), // available, low_stock, out_of_stock
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  phoneVerified: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
  pincode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
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

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertRentDue = z.infer<typeof insertRentDueSchema>;
export type RentDue = typeof rentDues.$inferSelect;
export type InsertPurifierPurchase = z.infer<typeof insertPurifierPurchaseSchema>;
export type PurifierPurchase = typeof purifierPurchases.$inferSelect;
export type InsertAmcPurchase = z.infer<typeof insertAmcPurchaseSchema>;
export type AmcPurchase = typeof amcPurchases.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InventoryCategory = typeof inventoryCategories.$inferSelect;
