/*
  Warnings:

  - Added the required column `cost` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "icon" TEXT,
DROP COLUMN "cost",
ADD COLUMN     "cost" INTEGER NOT NULL;
