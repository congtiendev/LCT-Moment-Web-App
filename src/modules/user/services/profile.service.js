const AppException = require('@exceptions/app.exception');
const userRepository = require('../repositories/user.repository');
const { app } = require('@config');

class ProfileService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId, {
      id: true,
      email: true,
      name: true,
      bio: true,
      phone: true,
      avatar: true,
      username: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    });

    if (!user) {
      throw new AppException('User not found', 404);
    }

    // Transform avatar to full URL
    if (user.avatar && !user.avatar.startsWith('http')) {
      user.avatar = `${app.appUrl}${user.avatar}`;
    }

    return user;
  }

  async updateProfile(userId, data) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppException('User not found', 404);
    }

    const { email, password, role, ...allowedData } = data;

    const updatedUser = await userRepository.update(userId, allowedData);

    const { password: __, ...profile } = updatedUser;

    // Transform avatar to full URL
    if (profile.avatar && !profile.avatar.startsWith('http')) {
      profile.avatar = `${app.appUrl}${profile.avatar}`;
    }

    return profile;
  }

  async uploadAvatar(userId, file) {
    if (!file) {
      throw new AppException('No file uploaded', 400);
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;

    await userRepository.update(userId, { avatar: avatarUrl });

    // Return full URL
    return `${app.appUrl}${avatarUrl}`;
  }
}

module.exports = new ProfileService();
