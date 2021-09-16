/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User.email_unique";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "oauthId" TEXT NOT NULL,
    "name" TEXT
);
INSERT INTO "new_User" ("id", "name", "oauthId") SELECT "id", "name", "oauthId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.oauthId_unique" ON "User"("oauthId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
