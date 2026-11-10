-- CreateEnum
CREATE TYPE "ClinicLocation" AS ENUM ('multan', 'khangarh');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "appointment_requests" (
    "id" TEXT NOT NULL,
    "fullName" VARCHAR(80) NOT NULL,
    "encryptedPhone" TEXT NOT NULL,
    "phoneBlindIndex" VARCHAR(64) NOT NULL,
    "location" "ClinicLocation" NOT NULL,
    "preferredDate" DATE NOT NULL,
    "reason" VARCHAR(300),
    "locale" VARCHAR(5) NOT NULL DEFAULT 'en',
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointment_requests_createdAt_idx" ON "appointment_requests"("createdAt");

-- CreateIndex
CREATE INDEX "appointment_requests_expiresAt_idx" ON "appointment_requests"("expiresAt");

-- CreateIndex
CREATE INDEX "appointment_requests_phoneBlindIndex_idx" ON "appointment_requests"("phoneBlindIndex");

-- CreateIndex
CREATE INDEX "appointment_requests_location_preferredDate_idx" ON "appointment_requests"("location", "preferredDate");
