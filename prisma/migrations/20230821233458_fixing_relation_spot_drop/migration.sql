-- CreateTable
CREATE TABLE "DropsOnSpots" (
    "spotId" TEXT NOT NULL,
    "dropId" TEXT NOT NULL,

    CONSTRAINT "DropsOnSpots_pkey" PRIMARY KEY ("spotId","dropId")
);

-- AddForeignKey
ALTER TABLE "DropsOnSpots" ADD CONSTRAINT "DropsOnSpots_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropsOnSpots" ADD CONSTRAINT "DropsOnSpots_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "drops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
