import { Response, Request, Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  postUpdateValidationRules,
  postCreateValidationRules,
} from "./validations";
import { validationResult } from "express-validator";

const router = Router();
const db = new PrismaClient();

// Get all the post
router.get("/", async (_, res) => {
  try {
    const posts = await db.post.findMany();
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new post
router.post(
  "/",
  postCreateValidationRules,
  async (req: Request, res: Response) => {
    if (!req.user)
      throw new Error("This endpoint shouldn't be accesible without an user");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    try {
      const post = await db.post.create({
        data: {
          title: title as string,
          content: content as string,
          userId: req.user.id,
        },
      });
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Delete a specific post
router.delete("/:id", async (req, res) => {
  if (!req.user)
    throw new Error("This endpoint shouldn't be accesible without an user");

  const postId = Number(req.params.id);

  const post = await db.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Check if the current user is the creator of the post
  if (post.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "You are not authorized to delete this post" });
  }

  try {
    const post = await db.post.delete({
      where: { id: postId },
    });
    res.json({ message: "Post deleted successfully", post });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoint to update a post by ID
router.put(
  "/:id",
  postUpdateValidationRules,
  async (req: Request, res: Response) => {
    if (!req.user)
      throw Error("This endpoint shouldn't be accesible without an user");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const postId = Number(req.params.id);
    const { title, content } = req.body;

    const existingPost = await db.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }

    try {
      const post = await db.post.update({
        where: { id: postId },
        data: { title, content },
      });
      res.json({ message: "Post updated successfully", post });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
