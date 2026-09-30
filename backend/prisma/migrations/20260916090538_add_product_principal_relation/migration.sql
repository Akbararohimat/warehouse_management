-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "principalId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_principalId_fkey" FOREIGN KEY ("principalId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
