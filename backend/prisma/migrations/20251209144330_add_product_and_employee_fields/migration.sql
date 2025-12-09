/*
  Warnings:

  - Added the required column `employeeName` to the `SalesRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `SalesRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SalesRecord" ADD COLUMN     "employeeName" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL;
