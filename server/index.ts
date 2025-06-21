import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { env } from "./config/environment";
import { initPayloadCMS, setupCMSRoutes } from "./cms/init";

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

  // Inicializa o Payload CMS se configurado
  if (env.hasPayloadConfig) {
    try {
      log("Inicializando Payload CMS...");
      await initPayloadCMS(
        app, 
        env.databaseConfig.url || '', 
        env.payloadConfig.secret
      );
      setupCMSRoutes(app);
      log("✅ Payload CMS inicializado com sucesso");
    } catch (error) {
      log("❌ Erro ao inicializar o Payload CMS:");
      console.error(error);
    }
  } else {
    log("⚠️ Payload CMS não configurado. Pulando inicialização.");
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 8080
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT || 8080;
  server.listen({
    port,
    host: "localhost",
  }, () => {
    log(`serving on port ${port}`);
    if (env.hasPayloadConfig) {
      log(`Payload Admin URL: http://localhost:${port}/admin`);
    }
  });
})();
