import { type User, type InsertUser, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private blogPosts: Map<string, BlogPost>;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    
    this.seedBlogPosts();
  }

  private seedBlogPosts() {
    const samplePosts: InsertBlogPost[] = [
      {
        title: "5 Essential Exercises for Building Strength",
        content: "Master these fundamental movements to build a strong foundation: squats, deadlifts, bench press, overhead press, and rows. These compound exercises engage multiple muscle groups and are the cornerstone of any effective strength training program.",
        author: "Coach Sarah Johnson",
        category: "Strength Training",
      },
      {
        title: "Nutrition Basics: Fueling Your Fitness Journey",
        content: "Proper nutrition is 80% of your results. Focus on whole foods, adequate protein intake (0.8-1g per pound of body weight), complex carbohydrates for energy, and healthy fats for hormone production. Stay hydrated and time your meals around your workouts for optimal performance.",
        author: "Nutritionist Mike Chen",
        category: "Nutrition",
      },
      {
        title: "The Importance of Rest and Recovery",
        content: "Your muscles don't grow in the gym - they grow when you rest. Ensure you're getting 7-9 hours of quality sleep, incorporate active recovery days, and don't be afraid to take a full rest day when needed. Listen to your body and prioritize recovery as much as training.",
        author: "Coach Sarah Johnson",
        category: "Recovery",
      },
    ];

    samplePosts.forEach((post) => {
      const id = randomUUID();
      const blogPost: BlogPost = {
        ...post,
        id,
        createdAt: new Date(),
      };
      this.blogPosts.set(id, blogPost);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
}

export const storage = new MemStorage();
