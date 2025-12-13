import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/submit-intake", async (req, res) => {
    try {
      const formData = req.body;
      
      const apiUrl = process.env.GOOGLE_SHEETS_API_URL;
      const apiSecret = process.env.GOOGLE_SHEETS_API_SECRET;

      if (!apiUrl || !apiSecret) {
        console.error("Missing Google Sheets API configuration");
        return res.status(500).json({ 
          success: false, 
          error: "API configuration missing" 
        });
      }

      const payload = {
        _secret: apiSecret,
        formId: "cap_form_v1",
        ...formData,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      res.json({ 
        success: true, 
        message: "Intake submitted successfully",
        data: result 
      });
    } catch (error) {
      console.error("Error submitting to Google Sheets:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/blog-posts", async (_req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog-posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });

  app.delete("/api/blog-posts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
