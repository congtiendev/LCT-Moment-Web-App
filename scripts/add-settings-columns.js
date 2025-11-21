const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSettingsColumns() {
  console.log('🚀 Starting to add new settings columns...');

  try {
    // Check if columns already exist by trying to query them
    try {
      await prisma.$queryRaw`
        SELECT notifications_enabled, sound_enabled, auto_save_photos,
               photo_quality, theme, language, allow_photos_from, hide_from_suggestions
        FROM user_settings
        LIMIT 1
      `;
      console.log('✅ All columns already exist! No migration needed.');
      return;
    } catch (error) {
      // Columns don't exist, continue with migration
      console.log('📝 Adding new columns to user_settings table...');
    }

    // Add new columns with default values
    await prisma.$executeRaw`
      ALTER TABLE user_settings
      ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS auto_save_photos BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS photo_quality VARCHAR(20) DEFAULT 'high',
      ADD COLUMN IF NOT EXISTS theme VARCHAR(20) DEFAULT 'system',
      ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'vi',
      ADD COLUMN IF NOT EXISTS allow_photos_from VARCHAR(30) DEFAULT 'friends_only',
      ADD COLUMN IF NOT EXISTS hide_from_suggestions BOOLEAN DEFAULT false
    `;

    console.log('✅ Successfully added new settings columns!');

    // Update existing rows to ensure they have the new columns set
    const result = await prisma.$executeRaw`
      UPDATE user_settings
      SET
        notifications_enabled = COALESCE(notifications_enabled, true),
        sound_enabled = COALESCE(sound_enabled, true),
        auto_save_photos = COALESCE(auto_save_photos, false),
        photo_quality = COALESCE(photo_quality, 'high'),
        theme = COALESCE(theme, 'system'),
        language = COALESCE(language, 'vi'),
        allow_photos_from = COALESCE(allow_photos_from, 'friends_only'),
        hide_from_suggestions = COALESCE(hide_from_suggestions, false)
      WHERE notifications_enabled IS NULL OR sound_enabled IS NULL
    `;

    console.log(`✅ Updated ${result} existing rows with default values`);

    // Verify the changes
    const count = await prisma.userSettings.count();
    console.log(`✅ Total user_settings rows: ${count}`);

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
addSettingsColumns()
  .then(() => {
    console.log('✅ Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
