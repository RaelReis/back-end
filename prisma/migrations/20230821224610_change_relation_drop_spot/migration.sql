/*
  Warnings:

  - You are about to drop the column `spotId` on the `drops` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "drops" DROP CONSTRAINT "drops_spotId_fkey";

-- AlterTable
ALTER TABLE "drops" DROP COLUMN "spotId";

-- CreateTable
CREATE TABLE "spot_to_drops" (
    "id" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "dropId" TEXT NOT NULL,

    CONSTRAINT "spot_to_drops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DropToSpot" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DropToSpot_AB_unique" ON "_DropToSpot"("A", "B");

-- CreateIndex
CREATE INDEX "_DropToSpot_B_index" ON "_DropToSpot"("B");

-- AddForeignKey
ALTER TABLE "spot_to_drops" ADD CONSTRAINT "spot_to_drops_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_to_drops" ADD CONSTRAINT "spot_to_drops_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "drops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DropToSpot" ADD CONSTRAINT "_DropToSpot_A_fkey" FOREIGN KEY ("A") REFERENCES "drops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DropToSpot" ADD CONSTRAINT "_DropToSpot_B_fkey" FOREIGN KEY ("B") REFERENCES "spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
