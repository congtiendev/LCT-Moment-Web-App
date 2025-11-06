-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "users"
  ADD COLUMN "provider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
  ADD COLUMN "googleId" TEXT,
  ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "users_googleId_idx" ON "users"("googleId");
