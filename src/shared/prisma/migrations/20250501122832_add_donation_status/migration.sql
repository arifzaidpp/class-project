/*
  Warnings:

  - You are about to drop the column `password` on the `admins` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `donations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "donation_schema"."DonationStatus" ADD VALUE 'rejected';

-- AlterTable
ALTER TABLE "auth_schema"."admins" DROP COLUMN "password",
ADD COLUMN     "last_login_at" TIMESTAMPTZ,
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "donation_schema"."donations" ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;
