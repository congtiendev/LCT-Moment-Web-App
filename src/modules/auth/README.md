# Auth Module

Module xác thực và phân quyền cho Locket Web App, hỗ trợ cả đăng nhập truyền thống (email/password) và Google OAuth 2.0.

## 📁 Cấu trúc

```
src/modules/auth/
├── controllers/
│   ├── auth.controller.js          # Đăng ký, đăng nhập, logout
│   ├── password.controller.js      # Đổi mật khẩu, reset password
│   └── google-auth.controller.js   # Google OAuth callback
├── middlewares/
│   └── auth.middleware.js          # JWT authentication middleware
├── routes/
│   ├── auth.routes.js              # Main auth routes
│   └── google-auth.routes.js       # Google OAuth routes
├── services/
│   ├── auth.service.js             # Business logic đăng ký/đăng nhập
│   ├── token.service.js            # JWT token generation
│   └── password.service.js         # Password hashing, reset
├── strategies/
│   └── google.strategy.js          # Passport Google OAuth strategy
└── validators/
    └── auth.validator.js           # Input validation schemas
```

## 🔐 Authentication Methods

### 1. Local Authentication (Email/Password)

**Register:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass123!",
  "name": "John Doe"
}
```

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

### 2. Google OAuth

**Initiate OAuth:**
```http
GET /api/auth/google
```

**Callback (handled automatically):**
```http
GET /api/auth/google/callback
```

Xem chi tiết tại: [Google OAuth Integration Guide](../../../docs/GOOGLE_OAUTH_INTEGRATION.md)

## 🎯 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/refresh-token` | Refresh access token |
| GET | `/api/auth/verify-email/:token` | Xác thực email |
| POST | `/api/auth/forgot-password` | Yêu cầu reset password |
| POST | `/api/auth/reset-password` | Reset password với token |
| GET | `/api/auth/google` | Khởi tạo Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |

### Protected Endpoints (require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/logout` | Đăng xuất |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại |
| POST | `/api/auth/change-password` | Đổi mật khẩu |

## 🔑 JWT Tokens

### Access Token
- **Duration:** 7 days
- **Usage:** Authenticate API requests
- **Header:** `Authorization: Bearer <token>`

### Refresh Token
- **Duration:** 30 days
- **Usage:** Generate new access token
- **Stored in:** Database (can be revoked)

### Token Response Format
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "provider": "LOCAL"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

## 🛡️ Security Features

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Password Hashing
- Algorithm: **bcrypt**
- Salt rounds: **10**

### Token Security
- JWT signed with `JWT_SECRET` (128-char random hex)
- Refresh tokens stored in database with user association
- Can revoke tokens by deleting from database

### Rate Limiting
- Login attempts limited to prevent brute force
- Configured in `@middlewares/rate-limit.middleware.js`

## 👤 User Providers

```javascript
enum AuthProvider {
  LOCAL   // Email/Password
  GOOGLE  // Google OAuth
}
```

### Provider Behavior

**LOCAL:**
- Password required
- Email verification required
- Manual account creation

**GOOGLE:**
- Password optional (can be null)
- Email auto-verified
- Account linking support
  - If email exists: Link to existing account
  - If new: Create new account

## 🔄 Google OAuth Flow

1. User clicks "Login with Google"
2. Frontend redirects to `/api/auth/google`
3. Backend redirects to Google authentication
4. User logs in with Google
5. Google redirects to `/api/auth/google/callback`
6. Backend:
   - Finds or creates user
   - Links account if email exists
   - Generates JWT tokens
7. Redirects to frontend with tokens
8. Frontend stores tokens and completes login

## 📋 Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-128-char-secret
JWT_REFRESH_SECRET=your-128-char-refresh-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback

# Frontend
FRONTEND_URL=https://your-frontend-domain.com
```

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "name": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📖 Related Documentation

- [Google OAuth Integration Guide](../../../docs/GOOGLE_OAUTH_INTEGRATION.md) - Chi tiết cho Frontend
- [Mail Service](../../core/mail/mail.service.js) - Email verification, password reset
- [Token Service](./services/token.service.js) - JWT generation và validation

## 🚀 Quick Start for Frontend

```javascript
// 1. Login with Google
window.location.href = 'https://api.domain.com/api/auth/google';

// 2. Handle callback at /auth/google/success
const accessToken = new URLSearchParams(window.location.search).get('accessToken');
const refreshToken = new URLSearchParams(window.location.search).get('refreshToken');

// 3. Store tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// 4. Use token for API calls
fetch('https://api.domain.com/api/protected', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## 🐛 Troubleshooting

**Issue:** "Invalid credentials"
- Check email/password are correct
- Ensure password meets requirements

**Issue:** "Token expired"
- Use refresh token to get new access token
- POST to `/api/auth/refresh-token`

**Issue:** "Google OAuth redirect mismatch"
- Check `GOOGLE_CALLBACK_URL` matches Google Console settings
- Verify authorized redirect URIs

**Issue:** "User already exists"
- For Google OAuth: Account will be automatically linked
- For local: Use different email or reset password

## 📞 Support

For issues or questions, contact the backend team or check the main [API documentation](../../../public/api-docs.html).
