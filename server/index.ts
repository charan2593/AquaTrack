import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Angular client serving
  if (process.env.NODE_ENV === "production") {
    // Serve built Angular files in production
    const path = await import("path");
    const fs = await import("fs");
    const angularDistPath = path.join(process.cwd(), "angular-client", "dist", "angular");
    
    if (fs.existsSync(angularDistPath)) {
      app.use(express.static(angularDistPath));
      app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api")) {
          return next();
        }
        res.sendFile(path.join(angularDistPath, "index.html"));
      });
    } else {
      console.error("[Angular] Build not found. Run 'cd angular-client && ng build' first.");
    }
  } else {
    // In development, serve info page and let Angular dev server handle the frontend
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }
      
      res.send(`
        <html>
          <head><title>AquaFlow - Angular Development</title></head>
          <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h1>AquaFlow - Angular Client</h1>
            <p>Development mode detected.</p>
            <p>To start the Angular development server, run:</p>
            <code style="background: #f0f0f0; padding: 10px; display: block; margin: 20px; border-radius: 4px;">
              cd angular-client && ng serve --proxy-config proxy.conf.json
            </code>
            <p>The Angular app will be available at <a href="http://localhost:3000">http://localhost:3000</a></p>
            <p>API server is running on port 5000</p>
          </body>
        </html>
      `);
    });
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
