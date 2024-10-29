/*
  Warnings:

  - You are about to drop the column `logSource` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `logType` on the `Log` table. All the data in the column will be lost.
  - Added the required column `action` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "logSource",
DROP COLUMN "logType",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "type" "LogType" NOT NULL;
