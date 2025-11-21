const settingRepository = require('../repositories/setting.repository');

/**
 * Setting Service
 * Business logic for user settings management
 */
class SettingService {
  /**
   * Get user settings
   */
  async getSettings(userId) {
    let settings = await settingRepository.getSettings(userId);

    // If no settings exist, create defaults
    if (!settings) {
      settings = await settingRepository.createDefaultSettings(userId);
    }

    return {
      notifications_enabled: settings.notificationsEnabled,
      sound_enabled: settings.soundEnabled,
      auto_save_photos: settings.autoSavePhotos,
      photo_quality: settings.photoQuality,
      theme: settings.theme,
      language: settings.language,
      allow_photos_from: settings.allowPhotosFrom,
      hide_from_suggestions: settings.hideFromSuggestions,
    };
  }

  /**
   * Update user settings
   */
  async updateSettings(userId, data) {
    const updateData = {};

    // Map snake_case to camelCase for Prisma
    if (data.notifications_enabled !== undefined) {
      updateData.notificationsEnabled = data.notifications_enabled;
    }
    if (data.sound_enabled !== undefined) {
      updateData.soundEnabled = data.sound_enabled;
    }
    if (data.auto_save_photos !== undefined) {
      updateData.autoSavePhotos = data.auto_save_photos;
    }
    if (data.photo_quality !== undefined) {
      updateData.photoQuality = data.photo_quality;
    }
    if (data.theme !== undefined) {
      updateData.theme = data.theme;
    }
    if (data.language !== undefined) {
      updateData.language = data.language;
    }
    if (data.allow_photos_from !== undefined) {
      updateData.allowPhotosFrom = data.allow_photos_from;
    }
    if (data.hide_from_suggestions !== undefined) {
      updateData.hideFromSuggestions = data.hide_from_suggestions;
    }

    const settings = await settingRepository.updateSettings(userId, updateData);

    return {
      notifications_enabled: settings.notificationsEnabled,
      sound_enabled: settings.soundEnabled,
      auto_save_photos: settings.autoSavePhotos,
      photo_quality: settings.photoQuality,
      theme: settings.theme,
      language: settings.language,
      allow_photos_from: settings.allowPhotosFrom,
      hide_from_suggestions: settings.hideFromSuggestions,
    };
  }
}

module.exports = new SettingService();
