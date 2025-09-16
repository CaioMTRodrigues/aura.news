-- CreateIndex
CREATE INDEX "Asset_issueId_idx" ON "public"."Asset"("issueId");

-- CreateIndex
CREATE INDEX "Asset_kind_idx" ON "public"."Asset"("kind");

-- CreateIndex
CREATE INDEX "CuratedItem_issueId_idx" ON "public"."CuratedItem"("issueId");

-- CreateIndex
CREATE INDEX "CuratedItem_category_idx" ON "public"."CuratedItem"("category");

-- CreateIndex
CREATE INDEX "CuratedItem_impactScore_idx" ON "public"."CuratedItem"("impactScore");

-- CreateIndex
CREATE INDEX "Issue_status_idx" ON "public"."Issue"("status");

-- CreateIndex
CREATE INDEX "Issue_scheduledFor_idx" ON "public"."Issue"("scheduledFor");

-- CreateIndex
CREATE INDEX "SendEvent_type_idx" ON "public"."SendEvent"("type");

-- CreateIndex
CREATE INDEX "SendEvent_createdAt_idx" ON "public"."SendEvent"("createdAt");

-- CreateIndex
CREATE INDEX "Subscriber_status_idx" ON "public"."Subscriber"("status");
