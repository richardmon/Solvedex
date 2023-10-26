import fs from "fs";
import path from "path";
import { exec as execCb } from "child_process";
import util from "util";

import request from "supertest";
import app from "../../app";

import { describe, it, expect, beforeEach } from "vitest";

let apiKey: string;
const exec = util.promisify(execCb);

// Run migrations to initialize a fresh test database

describe.skip("Posts API", () => {
  beforeEach(async () => {
    if (fs.existsSync(path.join(__dirname, "../../prisma/test.db"))) {
      fs.unlinkSync(path.join(__dirname, "../../prisma/test.db"));
    }

    try {
      await exec("npx dotenv -e .env.test prisma migrate deploy");
      await exec("npx dotenv -e .env.test prisma db seed");
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "testUser",
        password: "testPassword",
      });
      expect(response.status).toBe(200);
      apiKey = response.body.apiKey;
    } catch (error: any) {
      console.error("Error during database setup:", error.message);
    }
  });

  // Test for creating a post
  it("should create a new post", async () => {
    const response = await request(app)
      .post("/posts")
      .set("X-API-KEY", apiKey) // Set the API key in the request header
      .send({
        title: "Test Post",
        content: "This is a test post content",
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test Post");
  });

  // Test for updating a post
  it.skip("should update a post", async () => {
    const postId = 1; // You might need a way to get a valid post ID, possibly from the creation test or a setup function

    const response = await request(app)
      .put(`/posts/${postId}`)
      .set("X-API-KEY", apiKey)
      .send({
        title: "Updated Test Post",
        content: "This is an updated test post content",
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Test Post");
  });

  // Test for deleting a post
  it.skip("should delete a post", async () => {
    const postId = 1; // Again, you'll need a valid post ID

    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set("X-API-KEY", apiKey);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Post deleted successfully");
  });
});
