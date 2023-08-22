/*
  Warnings:

  - You are about to drop the `spot_to_drops` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "spot_to_drops" DROP CONSTRAINT "spot_to_drops_dropId_fkey";

-- DropForeignKey
ALTER TABLE "spot_to_drops" DROP CONSTRAINT "spot_to_drops_spotId_fkey";

-- DropTable
DROP TABLE "spot_to_drops";
