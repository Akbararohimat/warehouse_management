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

async function createAdmin(
  name: string,
  email: string,
  password: string
) {
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name,
      role: "ADMIN",
      division: "ADMIN",
      isActive: true,
      passwordHash,
      updatedAt: new Date(),
    },
    create: {
      id: randomUUID(),
      name,
      email,
      passwordHash,
      role: "ADMIN",
      division: "ADMIN",
      isActive: true,
      updatedAt: new Date(),
    },
  });

  console.log("✅ Admin account ready:");
  console.log({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    division: admin.division,
  });
}

async function main() {
  const admin1Name = process.env.ADMIN_NAME;
  const admin1Email = process.env.ADMIN_EMAIL;
  const admin1Password = process.env.ADMIN_PASSWORD;

  const admin2Name = process.env.ADMIN2_NAME;
  const admin2Email = process.env.ADMIN2_EMAIL;
  const admin2Password = process.env.ADMIN2_PASSWORD;

  if (!admin1Name || !admin1Email || !admin1Password) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be configured"
    );
  }

  if (!admin2Name || !admin2Email || !admin2Password) {
    throw new Error(
      "ADMIN2_NAME, ADMIN2_EMAIL, and ADMIN2_PASSWORD must be configured"
    );
  }

  console.log("🚀 Creating admin accounts...\n");

  await createAdmin(
    admin1Name,
    admin1Email,
    admin1Password
  );

  await createAdmin(
    admin2Name,
    admin2Email,
    admin2Password
  );

  console.log("\n🎉 All admin accounts are ready!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });