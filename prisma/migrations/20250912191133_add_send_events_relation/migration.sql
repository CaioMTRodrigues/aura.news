-- CreateEnum
CREATE TYPE "public"."IssueStatus" AS ENUM ('draft', 'scheduled', 'sent');

-- CreateEnum
CREATE TYPE "public"."Tag" AS ENUM ('IA', 'Startups', 'DevHacks', 'Gadgets', 'MercadoTech', 'FuturoDoTrabalho');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('open', 'click', 'bounce', 'spam');

-- CreateEnum
CREATE TYPE "public"."AssetKind" AS ENUM ('logo', 'thumb', 'header', 'icon');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('admin', 'editor');

-- CreateEnum
CREATE TYPE "public"."SubscriberStatus" AS ENUM ('active', 'unconfirmed', 'unsub');

-- CreateTable
CREATE TABLE "public"."Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "public"."SubscriberStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Issue" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "preheader" TEXT NOT NULL,
    "status" "public"."IssueStatus" NOT NULL DEFAULT 'draft',
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CuratedItem" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "category" "public"."Tag" NOT NULL,
    "impactScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CuratedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Draft" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GrowthPack" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "ctas" JSONB NOT NULL,
    "posts" JSONB NOT NULL,
    "abSubjects" JSONB NOT NULL,

    CONSTRAINT "GrowthPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SendEvent" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "type" "public"."EventType" NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SendEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Asset" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "kind" "public"."AssetKind" NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "public"."Subscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_slug_key" ON "public"."Issue"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Draft_issueId_key" ON "public"."Draft"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthPack_issueId_key" ON "public"."GrowthPack"("issueId");

-- CreateIndex
CREATE INDEX "SendEvent_issueId_idx" ON "public"."SendEvent"("issueId");

-- CreateIndex
CREATE INDEX "SendEvent_subscriberId_idx" ON "public"."SendEvent"("subscriberId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."CuratedItem" ADD CONSTRAINT "CuratedItem_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Draft" ADD CONSTRAINT "Draft_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrowthPack" ADD CONSTRAINT "GrowthPack_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SendEvent" ADD CONSTRAINT "SendEvent_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SendEvent" ADD CONSTRAINT "SendEvent_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "public"."Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
