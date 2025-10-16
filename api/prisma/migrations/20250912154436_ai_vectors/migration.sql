/*
  Warnings:

  - You are about to drop the `page_embeddings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."page_embeddings" DROP CONSTRAINT "fk_page";

-- DropTable
DROP TABLE "public"."page_embeddings";
