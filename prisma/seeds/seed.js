const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * Seed database with Locket Web App initial data
 * Based on Backend Documentation v1.0.0
 */
async function main() {
  console.log('🌱 Start seeding Locket Web database...\n');

  // ==================== 1. CREATE USERS ====================
  console.log('👥 Creating users...');

  const hashedPassword = await bcrypt.hash('722003xx', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'congtiendev@gmail.com',
      password: hashedPassword,
      name: 'Công Tiến',
      username: 'congtiendev',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Full-stack developer | Tech enthusiast',
      provider: 'email',
      lastLoginAt: new Date(),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'minhanh@gmail.com',
      name: 'Minh Anh',
      username: 'minhanh',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bio: 'Designer & Photographer',
      provider: 'google',
      googleId: 'google_123456789',
      password: null,
      lastLoginAt: new Date(),
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'hoangnam@gmail.com',
      password: hashedPassword,
      name: 'Hoàng Nam',
      username: 'hoangnam',
      avatar: 'https://i.pravatar.cc/150?img=3',
      bio: 'Travel lover | Coffee addict',
      provider: 'email',
      lastLoginAt: new Date(),
    },
  });

  const user4 = await prisma.user.create({
    data: {
      email: 'thuha@gmail.com',
      password: hashedPassword,
      name: 'Thu Hà',
      username: 'thuha',
      avatar: 'https://i.pravatar.cc/150?img=4',
      bio: 'Artist | Book lover',
      provider: 'email',
    },
  });

  const user5 = await prisma.user.create({
    data: {
      email: 'quanghuy@gmail.com',
      password: hashedPassword,
      name: 'Quang Huy',
      username: 'quanghuy',
      avatar: 'https://i.pravatar.cc/150?img=5',
      bio: 'Gamer | Software Engineer',
      provider: 'email',
    },
  });

  console.log('✅ Created 5 users\n');

  // ==================== 2. CREATE USER SETTINGS ====================
  console.log('⚙️  Creating user settings...');

  await prisma.userSettings.createMany({
    data: [
      { userId: user1.id },
      { userId: user2.id, theme: 'dark', language: 'vi' },
      { userId: user3.id, notifyEmail: true },
      { userId: user4.id, isPrivate: true },
      { userId: user5.id },
    ],
  });

  console.log('✅ Created 5 user settings\n');

  // ==================== 3. CREATE FRIENDSHIPS (Bidirectional) ====================
  console.log('🤝 Creating friendships...');

  // User1 <-> User2 (friends)
  await prisma.friendship.create({
    data: { userId: user1.id, friendId: user2.id, isFavorite: true },
  });
  await prisma.friendship.create({
    data: { userId: user2.id, friendId: user1.id },
  });

  // User1 <-> User3 (friends)
  await prisma.friendship.create({
    data: { userId: user1.id, friendId: user3.id, nickname: 'Nam Cute' },
  });
  await prisma.friendship.create({
    data: { userId: user3.id, friendId: user1.id },
  });

  // User2 <-> User3 (friends)
  await prisma.friendship.create({
    data: { userId: user2.id, friendId: user3.id },
  });
  await prisma.friendship.create({
    data: { userId: user3.id, friendId: user2.id, isFavorite: true },
  });

  // User1 <-> User4 (friends)
  await prisma.friendship.create({
    data: { userId: user1.id, friendId: user4.id },
  });
  await prisma.friendship.create({
    data: { userId: user4.id, friendId: user1.id },
  });

  console.log('✅ Created 8 friendships (4 pairs)\n');

  // ==================== 4. CREATE FRIEND REQUESTS ====================
  console.log('📬 Creating friend requests...');

  await prisma.friendRequest.createMany({
    data: [
      {
        senderId: user5.id,
        receiverId: user1.id,
        status: 'pending',
        message: 'Hi! Let\'s be friends!',
      },
      {
        senderId: user4.id,
        receiverId: user5.id,
        status: 'pending',
        message: 'Nice to meet you!',
      },
      {
        senderId: user2.id,
        receiverId: user4.id,
        status: 'accepted',
        respondedAt: new Date(),
      },
      {
        senderId: user3.id,
        receiverId: user5.id,
        status: 'rejected',
        respondedAt: new Date(),
      },
    ],
  });

  console.log('✅ Created 4 friend requests\n');

  // ==================== 5. CREATE PHOTOS ====================
  console.log('📷 Creating photos...');

  const photo1 = await prisma.photo.create({
    data: {
      userId: user1.id,
      imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
      caption: 'Beautiful sunset today! 🌅',
      width: 1920,
      height: 1080,
      fileSize: 2048576,
      mimeType: 'image/jpeg',
      isPublic: true,
    },
  });

  const photo2 = await prisma.photo.create({
    data: {
      userId: user2.id,
      imageUrl: 'https://images.unsplash.com/photo-1682687221038-404cb8830901',
      caption: 'Coffee time ☕',
      width: 1080,
      height: 1350,
      fileSize: 1536000,
      mimeType: 'image/jpeg',
      isPublic: true,
    },
  });

  const photo3 = await prisma.photo.create({
    data: {
      userId: user3.id,
      imageUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
      caption: 'Weekend vibes',
      width: 1920,
      height: 1280,
      fileSize: 2560000,
      mimeType: 'image/jpeg',
      isPublic: true,
    },
  });

  const photo4 = await prisma.photo.create({
    data: {
      userId: user1.id,
      imageUrl: 'https://images.unsplash.com/photo-1682687220866-c856f566f1bd',
      caption: 'Work from home setup 💻',
      width: 1920,
      height: 1080,
      fileSize: 1920000,
      mimeType: 'image/jpeg',
      isPublic: true,
    },
  });

  const photo5 = await prisma.photo.create({
    data: {
      userId: user2.id,
      imageUrl: 'https://images.unsplash.com/photo-1682687221080-5cb261c645cb',
      caption: 'Nature walk 🌳',
      width: 1080,
      height: 1920,
      fileSize: 2240000,
      mimeType: 'image/jpeg',
      isPublic: true,
    },
  });

  const photo6 = await prisma.photo.create({
    data: {
      userId: user4.id,
      imageUrl: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b',
      caption: 'Art exhibition today',
      width: 1920,
      height: 1280,
      fileSize: 2880000,
      mimeType: 'image/jpeg',
      isPublic: true,
    },
  });

  await prisma.photo.createMany({
    data: [
      {
        userId: user3.id,
        imageUrl: 'https://images.unsplash.com/photo-1682687220208-22d7a2543e88',
        caption: 'Beach day 🏖️',
        width: 1920,
        height: 1080,
        fileSize: 2100000,
        mimeType: 'image/jpeg',
        isPublic: true,
      },
      {
        userId: user1.id,
        imageUrl: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae',
        caption: 'Night city lights',
        width: 1920,
        height: 1280,
        fileSize: 2300000,
        mimeType: 'image/jpeg',
        isPublic: true,
      },
      {
        userId: user2.id,
        imageUrl: 'https://images.unsplash.com/photo-1682687221179-171c85ea6ce1',
        caption: 'Healthy lunch 🥗',
        width: 1080,
        height: 1350,
        fileSize: 1700000,
        mimeType: 'image/jpeg',
        isPublic: true,
      },
      {
        userId: user5.id,
        imageUrl: 'https://images.unsplash.com/photo-1682687221248-3116ba6ab483',
        caption: 'Gaming setup 🎮',
        width: 1920,
        height: 1080,
        fileSize: 2400000,
        mimeType: 'image/jpeg',
        isPublic: true,
      },
    ],
  });

  console.log('✅ Created 10 photos\n');

  // ==================== 6. CREATE PHOTO REACTIONS ====================
  console.log('❤️  Creating photo reactions...');

  await prisma.photoReaction.createMany({
    data: [
      { photoId: photo1.id, userId: user2.id, emoji: '❤️' },
      { photoId: photo1.id, userId: user3.id, emoji: '🔥' },
      { photoId: photo2.id, userId: user1.id, emoji: '☕' },
      { photoId: photo3.id, userId: user1.id, emoji: '👍' },
      { photoId: photo4.id, userId: user2.id, emoji: '💻' },
      { photoId: photo5.id, userId: user3.id, emoji: '🌳' },
    ],
  });

  console.log('✅ Created 6 photo reactions\n');

  // ==================== 7. CREATE CHATS ====================
  console.log('💬 Creating chat messages...');

  await prisma.chat.createMany({
    data: [
      // Conversation between User1 and User2
      {
        senderId: user1.id,
        receiverId: user2.id,
        message: 'Hey! How are you?',
        isRead: true,
        readAt: new Date(),
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        senderId: user2.id,
        receiverId: user1.id,
        message: 'I\'m good! Thanks for asking 😊',
        isRead: true,
        readAt: new Date(),
        createdAt: new Date(Date.now() - 3500000),
      },
      {
        senderId: user1.id,
        receiverId: user2.id,
        message: 'Want to grab coffee later?',
        isRead: true,
        readAt: new Date(),
        createdAt: new Date(Date.now() - 3400000),
      },
      {
        senderId: user2.id,
        receiverId: user1.id,
        message: 'Sure! What time?',
        isRead: false,
        createdAt: new Date(Date.now() - 3300000),
      },

      // Conversation between User1 and User3
      {
        senderId: user3.id,
        receiverId: user1.id,
        message: 'Check out my new photo!',
        isRead: true,
        readAt: new Date(),
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      },
      {
        senderId: user1.id,
        receiverId: user3.id,
        message: 'Wow! Amazing shot! 📸',
        isRead: true,
        readAt: new Date(),
        createdAt: new Date(Date.now() - 7100000),
      },
      {
        senderId: user3.id,
        receiverId: user1.id,
        message: 'Thanks! Took it at the beach yesterday',
        isRead: false,
        createdAt: new Date(Date.now() - 7000000),
      },

      // Conversation between User2 and User3
      {
        senderId: user2.id,
        receiverId: user3.id,
        message: 'Are we still on for tonight?',
        isRead: true,
        readAt: new Date(),
        createdAt: new Date(Date.now() - 1800000), // 30 min ago
      },
      {
        senderId: user3.id,
        receiverId: user2.id,
        message: 'Yes! See you at 7pm',
        isRead: false,
        createdAt: new Date(Date.now() - 1700000),
      },
    ],
  });

  console.log('✅ Created 9 chat messages\n');

  // ==================== 8. CREATE NOTIFICATIONS ====================
  console.log('🔔 Creating notifications...');

  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        type: 'friend_request',
        title: 'New Friend Request',
        message: 'Quang Huy sent you a friend request',
        imageUrl: user5.avatar,
        actionUrl: `/friends/requests/${user5.id}`,
        actionData: { requestId: user5.id, senderName: 'Quang Huy' },
        isRead: false,
      },
      {
        userId: user1.id,
        type: 'reaction',
        title: 'New Reaction',
        message: 'Minh Anh reacted ❤️ to your photo',
        imageUrl: user2.avatar,
        actionUrl: `/photos/${photo1.id}`,
        actionData: { photoId: photo1.id, emoji: '❤️' },
        isRead: false,
      },
      {
        userId: user2.id,
        type: 'message',
        title: 'New Message',
        message: 'Công Tiến sent you a message',
        imageUrl: user1.avatar,
        actionUrl: `/chats/${user1.id}`,
        actionData: { senderId: user1.id },
        isRead: true,
        readAt: new Date(),
      },
      {
        userId: user1.id,
        type: 'photo_uploaded',
        title: 'Friend Posted',
        message: 'Minh Anh posted a new photo',
        imageUrl: photo2.imageUrl,
        actionUrl: `/photos/${photo2.id}`,
        actionData: { photoId: photo2.id, userId: user2.id },
        isRead: true,
        readAt: new Date(),
      },
    ],
  });

  console.log('✅ Created 4 notifications\n');

  // ==================== 9. CREATE REFRESH TOKENS ====================
  console.log('🔑 Creating refresh tokens...');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

  await prisma.refreshToken.createMany({
    data: [
      {
        userId: user1.id,
        token: 'refresh_token_user1_web_' + Date.now(),
        expiresAt,
        deviceId: 'device_001',
        deviceName: 'Chrome on Windows',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        isRevoked: false,
      },
      {
        userId: user2.id,
        token: 'refresh_token_user2_mobile_' + Date.now(),
        expiresAt,
        deviceId: 'device_002',
        deviceName: 'iPhone 15 Pro',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/605.1.15',
        isRevoked: false,
      },
      {
        userId: user3.id,
        token: 'refresh_token_user3_web_' + Date.now(),
        expiresAt,
        deviceId: 'device_003',
        deviceName: 'Safari on MacBook',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) Safari/17.0',
        isRevoked: false,
      },
      {
        userId: user1.id,
        token: 'refresh_token_user1_old_' + Date.now(),
        expiresAt: new Date(Date.now() - 86400000), // Expired yesterday
        deviceId: 'device_004',
        deviceName: 'Old Phone',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Linux; Android) Mobile',
        isRevoked: true,
        revokedAt: new Date(),
      },
    ],
  });

  console.log('✅ Created 4 refresh tokens (3 active, 1 revoked)\n');

  // ==================== SUMMARY ====================
  console.log('='.repeat(50));
  console.log('✨ Seeding completed successfully!\n');

  console.log('📊 Database Summary:');
  console.log('   • Users: 5');
  console.log('   • User Settings: 5');
  console.log('   • Friendships: 8 (4 pairs)');
  console.log('   • Friend Requests: 4 (2 pending, 1 accepted, 1 rejected)');
  console.log('   • Photos: 10');
  console.log('   • Photo Reactions: 6');
  console.log('   • Chat Messages: 9');
  console.log('   • Notifications: 4 (2 unread, 2 read)');
  console.log('   • Refresh Tokens: 4 (3 active, 1 revoked)');
  console.log('\n🔐 Test Account:');
  console.log('   Email: congtiendev@gmail.com');
  console.log('   Password: 722003xx');
  console.log('='.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
