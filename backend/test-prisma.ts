import "dotenv/config";
import prisma from "./src/config/prisma";

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  const companyCount = await prisma.company.count();
  const productCount = await prisma.product.count();
  const solutionCount = await prisma.productSolution.count();
  const userCount = await prisma.user.count();

  console.log({
    companyCount,
    productCount,
    solutionCount,
    userCount,
  });

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
