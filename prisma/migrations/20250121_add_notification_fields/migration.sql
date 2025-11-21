-- AlterTable
ALTER TABLE "notifications"
ADD COLUMN IF NOT EXISTS "data" JSONB,
ADD COLUMN IF NOT EXISTS "related_user_id" TEXT,
ADD COLUMN IF NOT EXISTS "related_item_id" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notifications_related_user_id_idx" ON "notifications"("related_user_id");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'notifications_related_user_id_fkey'
  ) THEN
    ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_user_id_fkey"
    FOREIGN KEY ("related_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Drop old column if exists
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "action_data";
