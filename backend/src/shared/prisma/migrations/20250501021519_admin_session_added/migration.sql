-- CreateTable
CREATE TABLE "auth_schema"."admin_sessions" (
    "admin_id" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "ip_address" VARCHAR(45),
    "device_id" TEXT,
    "login_method" TEXT NOT NULL DEFAULT 'password',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active_at" TIMESTAMPTZ,

    CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_sessions_admin_id_idx" ON "auth_schema"."admin_sessions"("admin_id");

-- CreateIndex
CREATE INDEX "admin_sessions_expires_idx" ON "auth_schema"."admin_sessions"("expires");

-- CreateIndex
CREATE INDEX "admin_sessions_ip_address_idx" ON "auth_schema"."admin_sessions"("ip_address");

-- AddForeignKey
ALTER TABLE "auth_schema"."admin_sessions" ADD CONSTRAINT "admin_sessions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "auth_schema"."admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_schema"."admin_sessions" ADD CONSTRAINT "admin_sessions_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "auth_schema"."devices"("device_id") ON DELETE CASCADE ON UPDATE CASCADE;
