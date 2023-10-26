import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import helmet from "helmet";
import posts from "./posts";
import auth from "./auth";
import "../types";

const app = express();
const db = new PrismaClient();

// Middlewares
app.use(helmet());
app.use(express.json());
const authRequired = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header("X-API-KEY");
  if (!apiKey) {
    return res.status(401).json({ error: "No API key provided" });
  }

  const user = await db.user.findUnique({
    where: { apiKey: apiKey },
  });

  if (!user) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  // attach the user to the request object
  req.user = user;

  next();
}

// Routes
app.use("/api/v1/posts", authRequired, posts);
app.use("/api/v1/auth", auth);


export default app;
