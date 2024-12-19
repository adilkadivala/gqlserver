-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "post_title" TEXT NOT NULL,
    "post_description" TEXT NOT NULL,
    "post_creation_date" TIMESTAMP(3),
    "author_name" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_author_name_fkey" FOREIGN KEY ("author_name") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
