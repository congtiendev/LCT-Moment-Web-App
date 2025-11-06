# Frontend Quick Start - Google OAuth

## 🚀 URLs Production

- **Backend API:** `https://lct-locket-web-app.onrender.com`
- **Frontend:** `https://congtiendev-locket-web.figma.site`

## ⚡ Copy-Paste Implementation

### 1. Login Button

```html
<!-- HTML Button -->
<button onclick="loginWithGoogle()">
  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" width="20">
  Continue with Google
</button>

<script>
function loginWithGoogle() {
  window.location.href = 'https://lct-locket-web-app.onrender.com/api/auth/google';
}
</script>
```

### 2. React Component

```jsx
// GoogleLoginButton.jsx
import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'https://lct-locket-web-app.onrender.com/api/auth/google';
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 24px',
        background: '#fff',
        border: '1px solid #dadce0',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: '#3c4043'
      }}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        width="20"
      />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
```

### 3. Callback Handler

Tạo page `/auth/google/success` để nhận tokens:

```jsx
// pages/GoogleAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    // Handle error
    if (error) {
      console.error('Google login failed:', error);
      navigate('/login', {
        state: { error: 'Login failed. Please try again.' }
      });
      return;
    }

    // Handle success
    if (accessToken && refreshToken) {
      // Save tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Fetch user profile
      fetchUserProfile(accessToken)
        .then(() => {
          navigate('/dashboard');
        })
        .catch(() => {
          navigate('/login', {
            state: { error: 'Failed to load profile.' }
          });
        });
    } else {
      navigate('/login', {
        state: { error: 'Invalid response from server.' }
      });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Logging you in...</h2>
        <p>Please wait while we complete your login.</p>
      </div>
    </div>
  );
};

async function fetchUserProfile(accessToken) {
  const response = await fetch('https://lct-locket-web-app.onrender.com/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  const data = await response.json();

  if (data.success) {
    // Save user to state/context
    localStorage.setItem('user', JSON.stringify(data.data));
    return data.data;
  }

  throw new Error(data.message || 'Unknown error');
}

export default GoogleAuthCallback;
```

### 4. Router Configuration

```jsx
// App.jsx hoặc routes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import GoogleAuthCallback from './pages/GoogleAuthCallback';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/google/success" element={<GoogleAuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## 📋 Complete Login Page Example

```jsx
// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Show error from OAuth callback if any
  React.useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
    }
  }, [location]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://lct-locket-web-app.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Save tokens
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://lct-locket-web-app.onrender.com/api/auth/google';
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Login to Locket</h1>

      {error && (
        <div style={{
          padding: '12px',
          background: '#fee',
          color: '#c00',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Email/Password Login */}
      <form onSubmit={handleEmailLogin} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#FFC542',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        margin: '20px 0',
        gap: '10px'
      }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
        <span style={{ color: '#666', fontSize: '14px' }}>OR</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '12px',
          background: '#fff',
          border: '1px solid #dadce0',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          color: '#3c4043'
        }}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          width="20"
        />
        Continue with Google
      </button>
    </div>
  );
};

export default LoginPage;
```

## 🔐 Using Access Token for API Calls

```javascript
// API utility
const API_URL = 'https://lct-locket-web-app.onrender.com/api';

async function apiCall(endpoint, options = {}) {
  const accessToken = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  // Handle token expiration
  if (response.status === 401) {
    // Try to refresh token
    const newToken = await refreshAccessToken();

    if (newToken) {
      // Retry request with new token
      return apiCall(endpoint, options);
    } else {
      // Redirect to login
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  return data;
}

// Refresh token function
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return data.data.accessToken;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }

  return null;
}

// Example usage
async function getUserProfile() {
  const data = await apiCall('/auth/me');
  return data.data;
}

async function updateProfile(name) {
  const data = await apiCall('/users/profile', {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
  return data.data;
}
```

## 🧪 Test URLs

### Test OAuth Flow
1. Mở browser: `https://lct-locket-web-app.onrender.com/api/auth/google`
2. Đăng nhập với Google
3. Sẽ redirect về: `https://congtiendev-locket-web.figma.site/auth/google/success?accessToken=xxx&refreshToken=yyy`

### Test Get User Info
```bash
# Replace YOUR_ACCESS_TOKEN with actual token
curl -X GET "https://lct-locket-web-app.onrender.com/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📱 Expected User Flow

1. User vào trang Login
2. Click "Continue with Google"
3. Redirect đến Google → user đăng nhập
4. Google redirect về backend callback
5. Backend xử lý và redirect về: `https://congtiendev-locket-web.figma.site/auth/google/success?accessToken=xxx&refreshToken=yyy`
6. Frontend lấy tokens từ URL
7. Save tokens vào localStorage
8. Fetch user profile
9. Redirect vào dashboard

## 🐛 Debug Checklist

- [ ] Route `/auth/google/success` exists ở frontend
- [ ] Frontend có xử lý URL params `accessToken` và `refreshToken`
- [ ] Tokens được save vào localStorage
- [ ] Authorization header được thêm vào API calls
- [ ] Handle token expiration (401) → refresh hoặc logout

## 📞 Backend Endpoints Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/google` | GET | No | Khởi tạo OAuth flow |
| `/api/auth/me` | GET | Yes | Get user profile |
| `/api/auth/refresh-token` | POST | No | Refresh access token |
| `/api/auth/logout` | POST | Yes | Logout |

## 🎨 Locket Brand Colors

```css
/* Use these colors for consistent branding */
--locket-yellow: #FFC542;
--locket-yellow-light: #FFD968;
--locket-black: #0F0F0F;
--locket-dark: #1A1A1A;
--locket-bg: #121212;
```

---

✅ **Ready to use!** Copy any code snippet và áp dụng trực tiếp vào project.
