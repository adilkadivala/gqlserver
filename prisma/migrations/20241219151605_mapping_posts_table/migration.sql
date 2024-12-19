/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_author_name_fkey";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "post_title" TEXT NOT NULL,
    "post_description" TEXT NOT NULL,
    "post_creation_date" TIMESTAMP(3),
    "author_name" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_name_fkey" FOREIGN KEY ("author_name") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
