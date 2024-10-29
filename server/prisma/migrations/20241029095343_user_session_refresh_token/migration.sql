/*
  Warnings:

  - Made the column `refreshToken` on table `UserSession` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "refreshToken" SET NOT NULL;
