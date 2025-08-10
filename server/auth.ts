import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { getDatabaseConfig } from "./config/database.js";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  // Check if the stored password is properly hashed (contains a dot separator)
  if (!stored.includes('.')) {
    return false; // Invalid hash format, deny login
  }
  
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    return false; // Invalid hash format, deny login
  }
  
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Get environment-aware database configuration
  const dbConfig = getDatabaseConfig();
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  console.log(`[Auth] Setting up authentication for ${dbConfig.environment} environment`);
  
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: dbConfig.databaseUrl,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  const sessionSettings: session.SessionOptions = {
    secret: dbConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: dbConfig.environment === 'production', // Enable secure cookies in production
      maxAge: sessionTtl,
      sameSite: dbConfig.environment === 'production' ? 'strict' : 'lax',
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: 'mobile' }, async (mobile, password, done) => {
      try {
        const user = await storage.getUserByMobile(mobile);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: 'Invalid mobile number or password' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { mobile, password, email, firstName, lastName, role = 'technician' } = req.body;
      
      if (!mobile || !password) {
        return res.status(400).json({ message: "Mobile number and password are required" });
      }

      const existingUser = await storage.getUserByMobile(mobile);
      if (existingUser) {
        return res.status(400).json({ message: "Mobile number already registered" });
      }

      const user = await storage.createUser({
        mobile,
        password: await hashPassword(password),
        email,
        firstName,
        lastName,
        role,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user.id,
          mobile: user.mobile,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({
          id: user.id,
          mobile: user.mobile,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user as SelectUser;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  });
}

export const isAuthenticated = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};