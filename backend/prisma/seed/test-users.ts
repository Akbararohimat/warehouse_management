import "dotenv/config";

import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { randomUUID } from "crypto";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const users = [
    {
      name: process.env.RND_NAME,
      email: process.env.RND_EMAIL,
      password: process.env.RND_PASSWORD,
      role: "EMPLOYEE" as const,
      division: "RND" as const,
    },
    {
      name: process.env.SALES_NAME,
      email: process.env.SALES_EMAIL,
      password: process.env.SALES_PASSWORD,
      role: "EMPLOYEE" as const,
      division: "SALES" as const,
    },
  ];

  for (const user of users) {
    if (!user.name || !user.email || !user.password) {
      throw new Error(
        "RND_NAME, RND_EMAIL, RND_PASSWORD, SALES_NAME, SALES_EMAIL, and SALES_PASSWORD must be configured"
      );
    }

    const passwordHash = await bcrypt.hash(user.password, 12);

    const account = await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
        role: user.role,
        division: user.division,
        isActive: true,
        passwordHash,
        updatedAt: new Date(),
      },
      create: {
        id: randomUUID(),
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        division: user.division,
        isActive: true,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ ${account.division} account ready: ${account.email}`);
  }
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });