-- CreateEnum
CREATE TYPE "ItemTypes" AS ENUM ('accessory', 'weapon', 'armor');

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" BYTEA NOT NULL,
    "type" "ItemTypes" NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" BYTEA NOT NULL,

    CONSTRAINT "spots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" BYTEA NOT NULL,
    "spotId" TEXT NOT NULL,

    CONSTRAINT "drops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_name_key" ON "items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "spots_name_key" ON "spots"("name");

-- CreateIndex
CREATE UNIQUE INDEX "drops_name_key" ON "drops"("name");

-- AddForeignKey
ALTER TABLE "drops" ADD CONSTRAINT "drops_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
