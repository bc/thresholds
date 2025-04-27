import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // No additional backend routes needed as processing happens client-side
  // If we want to add storage of processed data later, we could add endpoints here
  
  const httpServer = createServer(app);

  return httpServer;
}
