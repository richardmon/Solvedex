import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../app";
describe.skip("Login Endpoint", () => {
  it("should login the user and return an API key", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "testUser@example.com",
      password: "testPassword",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("apiKey");
  });
});
