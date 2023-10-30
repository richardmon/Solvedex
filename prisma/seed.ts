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
      name: "Richard",
      email: "richard@example.com",
      passwordHash: hashedPassword,
      apiKey: apiKey,
      posts: {
        create: [
          {
            title: "Long Post 1",
            content:
              "This is the content of a much longer post. It contains more details, explanations, and examples to provide a comprehensive understanding of the topic. This post discusses various aspects and nuances, ensuring that readers gain a deep insight into the subject matter.",
          },
          {
            title: "Long Post 2",
            content:
              "Here's another lengthy post. It delves into intricate details, presents multiple viewpoints, and offers a thorough analysis. By reading this post, one can grasp the complexities and intricacies of the discussed topic. The post aims to be informative and engaging, making it a must-read for enthusiasts.",
          },
        ],
      },
    },
  });

  const hashedPassword2 = await hash("testPassword", 10);
  const apiKey2 = crypto.randomBytes(20).toString("hex");
  await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      passwordHash: hashedPassword2,
      apiKey: apiKey2,
      posts: {
        create: [
          {
            title: "Delete Test",
            content: "This is the content of post 1.",
          },
          {
            title: "Modify Test",
            content: "This is the content of post 2.",
          },
          {
            title: "Static Test",
            content: "This is the content of post 3.",
          },
        ],
      },
    },
  });

  console.log("the database has been seeded 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
