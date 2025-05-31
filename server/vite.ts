import { createServer } from "vite";
import { Server } from "http";
import express, { Express } from "express";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

export const log = console.log;

export async function setupVite(app: Express, server: Server) {
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: {
        server
      }
    },
    plugins: [react()],
    root: "client"
  });

  app.use(vite.middlewares);

  return vite;
}

export function serveStatic(app: Express) {
  const clientDist = path.resolve("dist", "client");

  if (!fs.existsSync(clientDist)) {
    throw new Error(
      "Client build not found. Please run 'pnpm build' before starting in production mode."
    );
  }

  app.use(express.static(clientDist, { index: false }));

  // Serve index.html for all routes not starting with /api
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(clientDist, "index.html"));
  });
}
