/*
  Warnings:

  - Added the required column `updated_at` to the `sponsor_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sponsorship_schema"."sponsor_items" ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- CreateIndex
CREATE INDEX "donations_status_idx" ON "donation_schema"."donations"("status");
