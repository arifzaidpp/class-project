/*
  Warnings:

  - Added the required column `updated_at` to the `sponsors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sponsorship_schema"."sponsors" ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;
