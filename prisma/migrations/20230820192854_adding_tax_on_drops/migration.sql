/*
  Warnings:

  - Added the required column `tax` to the `drops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "drops" ADD COLUMN     "tax" BOOLEAN NOT NULL;
