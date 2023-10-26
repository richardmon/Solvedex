import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  // Your seeding logic here...

  // For example, seeding a User table:

  const hashedPassword = await hash("testPassword", 10);
  const apiKey = crypto.randomBytes(20).toString("hex");
  await prisma.user.create({
    data: {
      name: "John Doe",
      email: "testUser@example.com",
      passwordHash: hashedPassword,
      apiKey: apiKey,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
