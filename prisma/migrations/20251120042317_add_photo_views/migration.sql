-- CreateTable
CREATE TABLE "photo_views" (
    "id" TEXT NOT NULL,
    "photo_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photo_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "photo_views_photo_id_idx" ON "photo_views"("photo_id");

-- CreateIndex
CREATE INDEX "photo_views_user_id_idx" ON "photo_views"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "photo_views_photo_id_user_id_key" ON "photo_views"("photo_id", "user_id");

-- AddForeignKey
ALTER TABLE "photo_views" ADD CONSTRAINT "photo_views_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_views" ADD CONSTRAINT "photo_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
