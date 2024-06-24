-- CreateEnum
CREATE TYPE "Deriction" AS ENUM ('LEFT', 'RIGHT');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('NO_SWIPE_QUOTA', 'VERIFIED_LABEL');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(20) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "fullname" VARCHAR(50) NOT NULL,
    "age" INTEGER NOT NULL,
    "bio" VARCHAR(200) NOT NULL,
    "photos" TEXT NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_quota" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "swiperId" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "deriction" "Deriction" NOT NULL,
    "createdAt" BIGINT NOT NULL,

    CONSTRAINT "daily_quota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_purchases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "packageType" "PackageType" NOT NULL,
    "purchase_date" BIGINT NOT NULL,
    "expiryDate" BIGINT NOT NULL,
    "createdAt" BIGINT NOT NULL,

    CONSTRAINT "premium_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_log" (
    "id" SERIAL NOT NULL,
    "userId" UUID,
    "accessToken" TEXT,
    "loginStatus" BOOLEAN,
    "createdAt" BIGINT,

    CONSTRAINT "login_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "daily_quota_swiperId_profileId_idx" ON "daily_quota"("swiperId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "login_log_userId_key" ON "login_log"("userId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_purchases" ADD CONSTRAINT "premium_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
