# Settings & Profile Management API Documentation

## Tổng quan

API này cung cấp đầy đủ tính năng quản lý cài đặt người dùng, bao gồm:
- Quản lý cài đặt người dùng (thông báo, giao diện, quyền riêng tư)
- Quản lý profile (cập nhật avatar, thông tin cá nhân)
- Quản lý dữ liệu (xóa ảnh, xóa tài khoản)

**Base URL**: `https://lct-locket-web-app.onrender.com/api`

## Authentication

Tất cả các endpoint đều yêu cầu JWT token trong header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 1. User Settings

### 1.1. Get User Settings

Lấy tất cả cài đặt của user hiện tại.

**Endpoint**: `GET /users/settings`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response Success (200)**:
```json
{
  "success": true,
  "settings": {
    "notifications_enabled": true,
    "sound_enabled": true,
    "auto_save_photos": false,
    "photo_quality": "high",
    "theme": "system",
    "language": "vi",
    "allow_photos_from": "friends_only",
    "hide_from_suggestions": false
  }
}
```

**Response Error (401)**:
```json
{
  "success": false,
  "message": "Access token is required"
}
```

### 1.2. Update User Settings

Cập nhật cài đặt người dùng. Có thể gửi một hoặc nhiều trường để cập nhật.

**Endpoint**: `PUT /users/settings`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "notifications_enabled": true,
  "sound_enabled": false,
  "auto_save_photos": true,
  "photo_quality": "high",
  "theme": "dark",
  "language": "en",
  "allow_photos_from": "everyone",
  "hide_from_suggestions": true
}
```

**Field Descriptions**:
- `notifications_enabled` (boolean, optional): Bật/tắt thông báo
- `sound_enabled` (boolean, optional): Bật/tắt âm thanh
- `auto_save_photos` (boolean, optional): Tự động lưu ảnh
- `photo_quality` (string, optional): Chất lượng ảnh - `"high"` | `"medium"` | `"low"`
- `theme` (string, optional): Giao diện - `"system"` | `"light"` | `"dark"`
- `language` (string, optional): Ngôn ngữ - `"vi"` | `"en"`
- `allow_photos_from` (string, optional): Cho phép nhận ảnh từ - `"everyone"` | `"friends_only"` | `"none"`
- `hide_from_suggestions` (boolean, optional): Ẩn khỏi gợi ý kết bạn

**Response Success (200)**:
```json
{
  "success": true,
  "settings": {
    "notifications_enabled": true,
    "sound_enabled": false,
    "auto_save_photos": true,
    "photo_quality": "high",
    "theme": "dark",
    "language": "en",
    "allow_photos_from": "everyone",
    "hide_from_suggestions": true
  }
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "photo_quality",
      "message": "photo_quality must be one of [high, medium, low]"
    }
  ]
}
```

---

## 2. Profile Management

### 2.1. Upload Avatar

Upload ảnh đại diện mới cho user.

**Endpoint**: `POST /users/avatar`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data
```

**Request Body (Form Data)**:
- `avatar` (file, required): File ảnh (JPEG, PNG, WEBP)
- Giới hạn kích thước: 5MB
- Định dạng được hỗ trợ: `.jpg`, `.jpeg`, `.png`, `.webp`

**cURL Example**:
```bash
curl -X POST https://lct-locket-web-app.onrender.com/api/users/avatar \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "avatar=@/path/to/image.jpg"
```

**JavaScript/Fetch Example**:
```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

const response = await fetch('https://lct-locket-web-app.onrender.com/api/users/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

const data = await response.json();
```

**Response Success (200)**:
```json
{
  "success": true,
  "avatar_url": "/uploads/avatars/abc123-uuid.jpg",
  "message": "Avatar updated successfully"
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "message": "No file uploaded"
}
```

**Response Error (400 - Invalid file type)**:
```json
{
  "success": false,
  "message": "Only image files (JPEG, PNG, WEBP) are allowed for avatars"
}
```

### 2.2. Update Profile

Cập nhật thông tin profile (tên, bio).

**Endpoint**: `PUT /users/profile`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Nguyễn Văn A",
  "bio": "Full-stack developer | Coffee lover ☕"
}
```

**Field Descriptions**:
- `name` (string, optional): Tên hiển thị (1-100 ký tự)
- `bio` (string, optional): Tiểu sử (tối đa 500 ký tự, có thể để trống)

**Response Success (200)**:
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "Nguyễn Văn A",
    "bio": "Full-stack developer | Coffee lover ☕",
    "avatar_url": "/uploads/avatars/abc123-uuid.jpg",
    "username": "nguyenvana",
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-11-21T07:30:00.000Z"
  }
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "name must be at least 1 character"
    }
  ]
}
```

---

## 3. Data Management

### 3.1. Delete All Photos

Xóa tất cả ảnh của user (hành động không thể hoàn tác).

**Endpoint**: `DELETE /photos/all`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response Success (200)**:
```json
{
  "success": true,
  "deleted_count": 42,
  "message": "All photos deleted successfully"
}
```

**Response Error (401)**:
```json
{
  "success": false,
  "message": "Access token is required"
}
```

**⚠️ Warning**:
- Hành động này sẽ xóa TẤT CẢ ảnh của user
- Không thể khôi phục sau khi xóa
- Nên hiển thị dialog xác nhận trước khi gọi API

### 3.2. Delete Account

Xóa tài khoản user (hành động cực kỳ nguy hiểm, không thể hoàn tác).

**Endpoint**: `DELETE /users/account`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "confirmation": "DELETE MY ACCOUNT"
}
```

**Field Descriptions**:
- `confirmation` (string, required): PHẢI là chuỗi chính xác `"DELETE MY ACCOUNT"` (viết hoa, có dấu cách)

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Response Error (400 - Wrong confirmation)**:
```json
{
  "success": false,
  "message": "Please confirm account deletion by sending: {\"confirmation\": \"DELETE MY ACCOUNT\"}"
}
```

**⚠️ DANGER ZONE**:
- Hành động này sẽ XÓA VĨNH VIỄN tài khoản
- Tất cả dữ liệu liên quan (ảnh, bạn bè, thông báo) đều bị xóa
- KHÔNG THỂ KHÔI PHỤC
- Bắt buộc phải có confirmation string chính xác
- Nên có 2-3 bước xác nhận trong UI trước khi gọi API

---

## Frontend Integration Examples

### React/TypeScript Example

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://lct-locket-web-app.onrender.com/api';

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

// 1. Get user settings
export const getUserSettings = async () => {
  const response = await api.get('/users/settings');
  return response.data.settings;
};

// 2. Update settings
export const updateSettings = async (settings: Partial<UserSettings>) => {
  const response = await api.put('/users/settings', settings);
  return response.data.settings;
};

// 3. Upload avatar
export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data.avatar_url;
};

// 4. Update profile
export const updateProfile = async (name?: string, bio?: string) => {
  const response = await api.put('/users/profile', { name, bio });
  return response.data.user;
};

// 5. Delete all photos (with confirmation)
export const deleteAllPhotos = async () => {
  if (!window.confirm('Bạn có chắc muốn xóa TẤT CẢ ảnh? Hành động này không thể hoàn tác!')) {
    return;
  }

  const response = await api.delete('/photos/all');
  return response.data;
};

// 6. Delete account (with double confirmation)
export const deleteAccount = async () => {
  const firstConfirm = window.confirm(
    'CẢNH BÁO: Bạn sắp XÓA TÀI KHOẢN của mình!\n\n' +
    'Tất cả dữ liệu sẽ bị mất vĩnh viễn.\n\n' +
    'Bạn có chắc chắn muốn tiếp tục?'
  );

  if (!firstConfirm) return;

  const secondConfirm = window.prompt(
    'Để xác nhận, vui lòng nhập chính xác: DELETE MY ACCOUNT'
  );

  if (secondConfirm !== 'DELETE MY ACCOUNT') {
    alert('Xác nhận không đúng. Hành động đã bị hủy.');
    return;
  }

  const response = await api.delete('/users/account', {
    data: { confirmation: 'DELETE MY ACCOUNT' }
  });

  // Clear local storage and redirect to login
  localStorage.clear();
  window.location.href = '/login';

  return response.data;
};

// TypeScript interfaces
interface UserSettings {
  notifications_enabled: boolean;
  sound_enabled: boolean;
  auto_save_photos: boolean;
  photo_quality: 'high' | 'medium' | 'low';
  theme: 'system' | 'light' | 'dark';
  language: 'vi' | 'en';
  allow_photos_from: 'everyone' | 'friends_only' | 'none';
  hide_from_suggestions: boolean;
}
```

### Vue.js Example

```javascript
// api/settings.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lct-locket-web-app.onrender.com/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

export default {
  // Get settings
  async getSettings() {
    const { data } = await api.get('/users/settings');
    return data.settings;
  },

  // Update settings
  async updateSettings(settings) {
    const { data } = await api.put('/users/settings', settings);
    return data.settings;
  },

  // Upload avatar
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post('/users/avatar', formData);
    return data.avatar_url;
  },

  // Update profile
  async updateProfile(name, bio) {
    const { data } = await api.put('/users/profile', { name, bio });
    return data.user;
  },

  // Delete all photos
  async deleteAllPhotos() {
    const { data } = await api.delete('/photos/all');
    return data;
  },

  // Delete account
  async deleteAccount() {
    const { data } = await api.delete('/users/account', {
      data: { confirmation: 'DELETE MY ACCOUNT' }
    });
    return data;
  }
};
```

---

## Error Handling

Tất cả các endpoint đều có thể trả về các lỗi sau:

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token is required"
}
```
**Giải pháp**: Kiểm tra xem user đã đăng nhập chưa, token còn hạn không

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [...]
}
```
**Giải pháp**: Kiểm tra lại dữ liệu gửi lên, đảm bảo đúng format

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```
**Giải pháp**: Báo lỗi cho backend team

---

## Notes cho Frontend Developers

1. **Avatar Upload**:
   - Nên resize ảnh trước khi upload để giảm bandwidth
   - Hiển thị preview trước khi upload
   - Có progress bar cho trải nghiệm tốt hơn

2. **Settings Form**:
   - Chỉ gửi các field đã thay đổi thay vì gửi toàn bộ object
   - Lưu settings ngay khi user thay đổi (auto-save) hoặc có nút "Save"
   - Cache settings ở local để giảm số lần gọi API

3. **Delete Actions**:
   - PHẢI có confirmation dialog cho delete all photos
   - PHẢI có 2-3 bước confirmation cho delete account
   - Hiển thị rõ ràng hậu quả của hành động

4. **Error Handling**:
   - Luôn có try-catch khi gọi API
   - Hiển thị error message thân thiện với user
   - Log error để debug

5. **Loading States**:
   - Hiển thị loading spinner khi đang gọi API
   - Disable buttons để tránh double-click
   - Có timeout cho các request lâu

---

## Testing với Postman

Import collection này vào Postman để test: [Link to Postman collection]

Hoặc test thủ công:

1. Đăng nhập để lấy access token
2. Thêm token vào header `Authorization: Bearer YOUR_TOKEN`
3. Test từng endpoint theo thứ tự:
   - GET settings → PUT settings
   - POST avatar → PUT profile
   - DELETE photos → DELETE account (test cuối cùng!)

---

## Support

Nếu có vấn đề hoặc câu hỏi, liên hệ Backend Team:
- Email: tienlc@innocom.vn
- GitHub: [Repository Link]
