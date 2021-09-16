/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `oauthId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User.oauthId_unique";

-- CreateTable
CREATE TABLE "OAuth" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiration" DATETIME
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "oAuthId" TEXT,
    FOREIGN KEY ("oAuthId") REFERENCES "OAuth" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("id", "name") SELECT "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_oAuthId_unique" ON "User"("oAuthId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
