/*
  Warnings:

  - The values [DINE_IN] on the enum `OrderType` will be removed. If these variants are still used in the database, this will fail.
  - The values [INVOICE,SPLIT] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `completedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `servedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tableId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `itemStatus` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the `Printer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Table` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Offer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Offer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `buildingNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryZoneId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landmark` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `customerName` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerPhone` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerAddress` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notes` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `oldPrice` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'CONFIRMED';
ALTER TYPE "OrderStatus" ADD VALUE 'OUT_FOR_DELIVERY';

-- AlterEnum
BEGIN;
CREATE TYPE "OrderType_new" AS ENUM ('DELIVERY', 'TAKEAWAY');
ALTER TABLE "Order" ALTER COLUMN "orderType" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "orderType" TYPE "OrderType_new" USING ("orderType"::text::"OrderType_new");
ALTER TYPE "OrderType" RENAME TO "OrderType_old";
ALTER TYPE "OrderType_new" RENAME TO "OrderType";
DROP TYPE "OrderType_old";
ALTER TABLE "Order" ALTER COLUMN "orderType" SET DEFAULT 'DELIVERY';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CASH', 'CARD', 'WALLET', 'ONLINE');
ALTER TABLE "Order" ALTER COLUMN "paymentMethod" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
ALTER TABLE "Order" ALTER COLUMN "paymentMethod" SET DEFAULT 'CASH';
COMMIT;

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_tableId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Offer" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "completedAt",
DROP COLUMN "servedAt",
DROP COLUMN "tableId",
ADD COLUMN     "buildingNumber" TEXT NOT NULL,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "deliveryZoneId" TEXT NOT NULL,
ADD COLUMN     "floor" TEXT NOT NULL,
ADD COLUMN     "landmark" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pickedUpAt" TIMESTAMP(3),
ALTER COLUMN "customerName" SET NOT NULL,
ALTER COLUMN "customerPhone" SET NOT NULL,
ALTER COLUMN "customerAddress" SET NOT NULL,
ALTER COLUMN "orderType" SET DEFAULT 'DELIVERY',
ALTER COLUMN "notes" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "completedAt",
DROP COLUMN "itemStatus",
DROP COLUMN "note",
DROP COLUMN "startedAt";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "oldPrice" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;

-- DropTable
DROP TABLE "Printer";

-- DropTable
DROP TABLE "Table";

-- DropEnum
DROP TYPE "ItemStatus";

-- DropEnum
DROP TYPE "TableStatus";

-- CreateTable
CREATE TABLE "DeliveryZone" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deliveryFee" DECIMAL(10,2) NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 30,
    "minOrderAmount" DECIMAL(10,2) NOT NULL,
    "polygon" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeliveryZone_isActive_idx" ON "DeliveryZone"("isActive");

-- CreateIndex
CREATE INDEX "Order_customerPhone_idx" ON "Order"("customerPhone");

-- CreateIndex
CREATE INDEX "Order_deliveryZoneId_idx" ON "Order"("deliveryZoneId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryZoneId_fkey" FOREIGN KEY ("deliveryZoneId") REFERENCES "DeliveryZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
