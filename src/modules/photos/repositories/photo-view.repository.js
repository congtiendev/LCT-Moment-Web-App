const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Photo View Repository
 * Handles database operations for photo views
 */
class PhotoViewRepository {
  /**
   * Record a view (idempotent - won't create duplicate)
   */
  async recordView(photoId, userId) {
    return await prisma.photoView.upsert({
      where: {
        photoId_userId: {
          photoId,
          userId,
        },
      },
      update: {}, // No update needed, just ensure it exists
      create: {
        photoId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  /**
   * Get view count for a photo
   */
  async countByPhotoId(photoId) {
    return await prisma.photoView.count({
      where: { photoId },
    });
  }

  /**
   * Get list of users who viewed a photo
   * Includes their reaction if they reacted to the photo
   */
  async findByPhotoId(photoId, { limit = 50, offset = 0 }) {
    const views = await prisma.photoView.findMany({
      where: { photoId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Get reactions for all viewers in one query
    const viewerIds = views.map((v) => v.userId);
    const reactions = await prisma.photoReaction.findMany({
      where: {
        photoId,
        userId: { in: viewerIds },
      },
      select: {
        userId: true,
        emoji: true,
      },
    });

    // Create a map of userId -> emoji for quick lookup
    const reactionMap = {};
    reactions.forEach((r) => {
      reactionMap[r.userId] = r.emoji;
    });

    // Add reaction to each view
    return views.map((view) => ({
      ...view,
      reaction: reactionMap[view.userId] || null,
    }));
  }

  /**
   * Check if user has viewed a photo
   */
  async hasViewed(photoId, userId) {
    const view = await prisma.photoView.findUnique({
      where: {
        photoId_userId: {
          photoId,
          userId,
        },
      },
    });
    return !!view;
  }

  /**
   * Get view counts for multiple photos
   */
  async getViewCountsForPhotos(photoIds) {
    const counts = await prisma.photoView.groupBy({
      by: ['photoId'],
      where: {
        photoId: { in: photoIds },
      },
      _count: true,
    });

    // Convert to map for easy lookup
    const countMap = {};
    counts.forEach((item) => {
      countMap[item.photoId] = item._count;
    });

    return countMap;
  }
}

module.exports = new PhotoViewRepository();
