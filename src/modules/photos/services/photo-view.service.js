const photoViewRepository = require('../repositories/photo-view.repository');
const photoRepository = require('../repositories/photo.repository');
const AppException = require('@exceptions/app.exception');
const logger = require('@utils/logger');

/**
 * Photo View Service
 * Business logic for photo view tracking
 */
class PhotoViewService {
  /**
   * Record a photo view
   */
  async recordView(photoId, userId) {
    // Check if photo exists
    const photo = await photoRepository.findById(photoId, false, false);
    if (!photo) {
      throw new AppException('Photo not found', 404);
    }

    // Check permission: owner or friend
    if (photo.userId !== userId) {
      const areFriends = await photoRepository.areFriends(userId, photo.userId);
      if (!areFriends) {
        throw new AppException('You do not have permission to view this photo', 403);
      }
    }

    // Record view (idempotent)
    const view = await photoViewRepository.recordView(photoId, userId);

    logger.info(`Photo view recorded: ${photoId} by user ${userId}`);

    return {
      id: view.id,
      photo_id: view.photoId,
      user_id: view.userId,
      created_at: view.createdAt,
    };
  }

  /**
   * Get viewers list for a photo
   */
  async getViewers(photoId, currentUserId, { limit = 50, offset = 0 }) {
    // Check if photo exists and user has permission
    const photo = await photoRepository.findById(photoId, false, false);
    if (!photo) {
      throw new AppException('Photo not found', 404);
    }

    // Only photo owner can see who viewed
    if (photo.userId !== currentUserId) {
      throw new AppException('Only photo owner can see viewers list', 403);
    }

    const [views, total] = await Promise.all([
      photoViewRepository.findByPhotoId(photoId, { limit, offset }),
      photoViewRepository.countByPhotoId(photoId),
    ]);

    return {
      viewers: views.map((v) => ({
        user: v.user
          ? {
              id: v.user.id,
              name: v.user.name,
              username: v.user.username,
              avatar: v.user.avatar,
            }
          : null,
        viewed_at: v.createdAt,
      })),
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total,
      },
    };
  }
}

module.exports = new PhotoViewService();
