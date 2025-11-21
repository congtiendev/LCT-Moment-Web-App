#!/usr/bin/env node
/**
 * Simple Migration Script for Production
 * Directly executes SQL to add missing columns
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMissingColumns() {
  try {
    console.log('🔄 Starting migration to add missing columns...');

    await prisma.$connect();
    console.log('✅ Connected to database');

    // Check current structure first
    console.log('🔍 Checking current table structure...');

    const existingColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;

    const columnNames = existingColumns.map((row) => row.column_name);
    console.log('📋 Existing columns:', columnNames.join(', '));

    // Add google_id column if missing
    if (!columnNames.includes('google_id')) {
      console.log('➕ Adding google_id column...');
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN "google_id" TEXT`;
      await prisma.$executeRaw`CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id")`;
      console.log('✅ Added google_id column');
    } else {
      console.log('✅ google_id column already exists');
    }

    // Add username column if missing
    if (!columnNames.includes('username')) {
      console.log('➕ Adding username column...');
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN "username" TEXT`;
      await prisma.$executeRaw`CREATE UNIQUE INDEX "users_username_key" ON "users"("username")`;
      console.log('✅ Added username column');
    } else {
      console.log('✅ username column already exists');
    }

    // Add bio column if missing
    if (!columnNames.includes('bio')) {
      console.log('➕ Adding bio column...');
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN "bio" TEXT`;
      console.log('✅ Added bio column');
    } else {
      console.log('✅ bio column already exists');
    }

    // Add last_login_at column if missing
    if (!columnNames.includes('last_login_at')) {
      console.log('➕ Adding last_login_at column...');
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN "last_login_at" TIMESTAMP(3)`;
      console.log('✅ Added last_login_at column');
    } else {
      console.log('✅ last_login_at column already exists');
    }

    // ============ Notifications Table Migration ============
    console.log('🔍 Checking notifications table structure...');
    const notificationColumns = await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'notifications'
    `;

    const notifColumnNames = notificationColumns.map((row) => row.column_name);
    console.log('📋 Existing notification columns:', notifColumnNames.join(', '));

    // Add data column if missing
    if (!notifColumnNames.includes('data')) {
      console.log('➕ Adding data column to notifications...');
      await prisma.$executeRaw`ALTER TABLE "notifications" ADD COLUMN "data" JSONB`;
      console.log('✅ Added data column');
    } else {
      console.log('✅ data column already exists');
    }

    // Add related_user_id column if missing
    if (!notifColumnNames.includes('related_user_id')) {
      console.log('➕ Adding related_user_id column to notifications...');
      await prisma.$executeRaw`ALTER TABLE "notifications" ADD COLUMN "related_user_id" TEXT`;
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "notifications_related_user_id_idx" ON "notifications"("related_user_id")`;
      console.log('✅ Added related_user_id column');
    } else {
      console.log('✅ related_user_id column already exists');
    }

    // Add related_item_id column if missing
    if (!notifColumnNames.includes('related_item_id')) {
      console.log('➕ Adding related_item_id column to notifications...');
      await prisma.$executeRaw`ALTER TABLE "notifications" ADD COLUMN "related_item_id" TEXT`;
      console.log('✅ Added related_item_id column');
    } else {
      console.log('✅ related_item_id column already exists');
    }

    // Add foreign key constraint if not exists
    console.log('🔗 Checking foreign key constraint...');
    const fkExists = await prisma.$queryRaw`
      SELECT 1 FROM pg_constraint
      WHERE conname = 'notifications_related_user_id_fkey'
    `;

    if (fkExists.length === 0) {
      console.log('➕ Adding foreign key constraint...');
      await prisma.$executeRaw`
        ALTER TABLE "notifications"
        ADD CONSTRAINT "notifications_related_user_id_fkey"
        FOREIGN KEY ("related_user_id") REFERENCES "users"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
      `;
      console.log('✅ Added foreign key constraint');
    } else {
      console.log('✅ Foreign key constraint already exists');
    }

    // Drop old action_data column if exists
    if (notifColumnNames.includes('action_data')) {
      console.log('🗑️ Dropping old action_data column...');
      await prisma.$executeRaw`ALTER TABLE "notifications" DROP COLUMN "action_data"`;
      console.log('✅ Dropped action_data column');
    } else {
      console.log('✅ action_data column already removed');
    }

    // Generate Prisma Client
    console.log('🔄 Generating Prisma Client...');
    const { execSync } = require('child_process');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma Client generated');
    } catch (generateError) {
      console.warn('⚠️ Prisma Client generation had issues, but continuing...');
      console.warn('Error:', generateError.message);
    }

    console.log('🎉 Migration completed successfully!');
    console.log(
      '💡 Note: If this is running on Render, the service should restart to pick up the new database schema.'
    );
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
addMissingColumns();
