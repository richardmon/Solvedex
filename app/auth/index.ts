import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import crypto from "crypto";
import { Router, Request, Response } from "express";
import { loginValidations, signupValidations } from "./validations";
import { validationResult } from "express-validator";

const router = Router();
const db = new PrismaClient();

router.post(
  "/signup",
  signupValidations,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if the username already exists
    const existingUser = await db.user.findUnique({
      where: { email: email as string },
    });


    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await hash(password, 10);

    // Generate an API key
    const apiKey = crypto.randomBytes(20).toString("hex");

    const newUser = await db.user.create({
      data: {
        name: name as string,
        email: (email as string).toLowerCase(),
        passwordHash: hashedPassword,
        apiKey: apiKey,
      },
    });

    // Return the API key to the user
    res.status(201).json({ apiKey: newUser.apiKey, userId: newUser.id });
  },
);

router.post("/login", loginValidations, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  const user = await db.user.findUnique({
    where: { email: email },
  });

    console.log("existing user", user);

  if (!user) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const isPasswordValid = await compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  console.log("returning", { apiKey: user.apiKey, userId: user.id });
  // Return the API key for the authenticated user
  res.json({ apiKey: user.apiKey, userId: user.id });
});

export default router;
