-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Cycle" ADD VALUE 'WEEKLY';
ALTER TYPE "Cycle" ADD VALUE 'DAILY';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "tags" TEXT[];
