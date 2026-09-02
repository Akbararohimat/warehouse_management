-- CreateEnum
CREATE TYPE "RequestFor" AS ENUM ('CUSTOMER', 'COMPANY');

-- CreateEnum
CREATE TYPE "RequestPriority" AS ENUM ('NORMAL', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ON_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "SalesRequest" (
    "id" TEXT NOT NULL,
    "requestFor" "RequestFor" NOT NULL,
    "priority" "RequestPriority" NOT NULL DEFAULT 'NORMAL',
    "request" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedById" TEXT NOT NULL,
    "handledById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestFollowUp" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestFollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SalesRequest_requestedById_idx" ON "SalesRequest"("requestedById");

-- CreateIndex
CREATE INDEX "SalesRequest_handledById_idx" ON "SalesRequest"("handledById");

-- CreateIndex
CREATE INDEX "SalesRequest_status_idx" ON "SalesRequest"("status");

-- CreateIndex
CREATE INDEX "SalesRequest_priority_idx" ON "SalesRequest"("priority");

-- CreateIndex
CREATE INDEX "SalesRequest_createdAt_idx" ON "SalesRequest"("createdAt");

-- CreateIndex
CREATE INDEX "RequestFollowUp_requestId_idx" ON "RequestFollowUp"("requestId");

-- CreateIndex
CREATE INDEX "RequestFollowUp_userId_idx" ON "RequestFollowUp"("userId");

-- CreateIndex
CREATE INDEX "RequestFollowUp_createdAt_idx" ON "RequestFollowUp"("createdAt");

-- AddForeignKey
ALTER TABLE "SalesRequest" ADD CONSTRAINT "SalesRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesRequest" ADD CONSTRAINT "SalesRequest_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestFollowUp" ADD CONSTRAINT "RequestFollowUp_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "SalesRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestFollowUp" ADD CONSTRAINT "RequestFollowUp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
