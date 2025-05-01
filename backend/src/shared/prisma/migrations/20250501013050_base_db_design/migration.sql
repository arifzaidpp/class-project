-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth_schema";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "donation_schema";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "location_schema";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "sponsorship_schema";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "donation_schema"."DonationStatus" AS ENUM ('draft', 'pending', 'confirmed');

-- CreateTable
CREATE TABLE "auth_schema"."admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_schema"."devices" (
    "device_id" TEXT NOT NULL,
    "device_type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("device_id")
);

-- CreateTable
CREATE TABLE "donation_schema"."donations" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "country_name" TEXT NOT NULL,
    "state_name" TEXT NOT NULL,
    "city_name" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "screenshot_link" TEXT,
    "status" "donation_schema"."DonationStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_schema"."countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_schema"."states" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_schema"."cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state_id" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsorship_schema"."sponsor_items" (
    "id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "sponsored_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sponsor_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsorship_schema"."sponsors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_link" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "place" TEXT NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsorship_schema"."sponsor_contributions" (
    "sponsor_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "count_contributed" INTEGER NOT NULL,

    CONSTRAINT "sponsor_contributions_pkey" PRIMARY KEY ("sponsor_id","item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "auth_schema"."admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_id_key" ON "auth_schema"."devices"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "location_schema"."countries"("name");

-- AddForeignKey
ALTER TABLE "donation_schema"."donations" ADD CONSTRAINT "donations_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "auth_schema"."devices"("device_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_schema"."states" ADD CONSTRAINT "states_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "location_schema"."countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_schema"."cities" ADD CONSTRAINT "cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "location_schema"."states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorship_schema"."sponsor_contributions" ADD CONSTRAINT "sponsor_contributions_sponsor_id_fkey" FOREIGN KEY ("sponsor_id") REFERENCES "sponsorship_schema"."sponsors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorship_schema"."sponsor_contributions" ADD CONSTRAINT "sponsor_contributions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "sponsorship_schema"."sponsor_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
