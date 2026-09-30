-- CreateTable
CREATE TABLE "ProductSolution" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "specification" TEXT,
    "companyId" TEXT NOT NULL,
    "contactId" TEXT,
    "principalId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSolutionDocument" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "productSolutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductSolutionDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductSolution_code_key" ON "ProductSolution"("code");

-- CreateIndex
CREATE INDEX "ProductSolution_name_idx" ON "ProductSolution"("name");

-- CreateIndex
CREATE INDEX "ProductSolution_category_idx" ON "ProductSolution"("category");

-- CreateIndex
CREATE INDEX "ProductSolution_brand_idx" ON "ProductSolution"("brand");

-- CreateIndex
CREATE INDEX "ProductSolution_companyId_idx" ON "ProductSolution"("companyId");

-- CreateIndex
CREATE INDEX "ProductSolution_contactId_idx" ON "ProductSolution"("contactId");

-- CreateIndex
CREATE INDEX "ProductSolution_principalId_idx" ON "ProductSolution"("principalId");

-- CreateIndex
CREATE INDEX "ProductSolutionDocument_productSolutionId_idx" ON "ProductSolutionDocument"("productSolutionId");

-- AddForeignKey
ALTER TABLE "ProductSolution" ADD CONSTRAINT "ProductSolution_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSolution" ADD CONSTRAINT "ProductSolution_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSolution" ADD CONSTRAINT "ProductSolution_principalId_fkey" FOREIGN KEY ("principalId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSolution" ADD CONSTRAINT "ProductSolution_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSolutionDocument" ADD CONSTRAINT "ProductSolutionDocument_productSolutionId_fkey" FOREIGN KEY ("productSolutionId") REFERENCES "ProductSolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
