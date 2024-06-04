/*
  Warnings:

  - You are about to drop the column `patDate` on the `BillSale` table. All the data in the column will be lost.
  - You are about to drop the column `patTime` on the `BillSale` table. All the data in the column will be lost.
  - Added the required column `payDate` to the `BillSale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payTime` to the `BillSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillSale" DROP COLUMN "patDate",
DROP COLUMN "patTime",
ADD COLUMN     "payDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "payTime" TEXT NOT NULL;
