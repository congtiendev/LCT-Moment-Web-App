# 💬 Chat API Documentation - LCT Moment

## 📋 Tổng quan

API Chat cho phép users nhắn tin về các photos đã được chia sẻ. Mỗi conversation (thread) được gắn với một photo cụ thể và chỉ diễn ra giữa 2 users là bạn bè.

**Base URL**: `https://lct-locket-web-app.onrender.com/api`

**Authentication**: JWT Bearer Token trong header `Authorization`

---

## 🔐 Authentication

Tất cả requests đều cần JWT token:

```bash
Authorization: Bearer <your_access_token>
```

---

## 📚 API Endpoints

### 1️⃣ Get or Create Chat Thread

Tạo hoặc lấy thread hiện có khi user bấm "Reply" trên một photo.

**Endpoint**: `POST /api/chats/threads`

**Request Body**:
```json
{
  "post_id": "550e8400-e29b-41d4-a716-446655440000",
  "other_user_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response 200 OK** - Thread đã tồn tại:
```json
{
  "success": true,
  "message": "Thread retrieved successfully",
  "data": {
    "thread": {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "post_id": "550e8400-e29b-41d4-a716-446655440000",
      "user1_id": "440e8400-e29b-41d4-a716-446655440003",
      "user2_id": "660e8400-e29b-41d4-a716-446655440001",
      "created_at": "2025-01-20T10:30:00.000Z",
      "updated_at": "2025-01-20T15:45:00.000Z",
      "post": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "photo_url": "https://lct-locket-web-app.onrender.com/uploads/photos/abc123.jpg",
        "caption": "Đà Lạt đẹp quá!",
        "sender_id": "660e8400-e29b-41d4-a716-446655440001",
        "created_at": "2025-01-20T10:00:00.000Z",
        "sender": {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "name": "Nguyễn Văn A",
          "username": "nguyenvana",
          "avatar_url": "https://lct-locket-web-app.onrender.com/avatars/user1.jpg"
        }
      },
      "other_user": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Nguyễn Văn A",
        "username": "nguyenvana",
        "avatar_url": "https://lct-locket-web-app.onrender.com/avatars/user1.jpg"
      }
    },
    "is_new": false
  }
}
```

**Response 200 OK** - Thread mới:
```json
{
  "success": true,
  "message": "Thread retrieved successfully",
  "data": {
    "thread": { /* same structure */ },
    "is_new": true
  }
}
```

**Error Responses**:

```json
// 400 - Cannot chat with yourself
{
  "success": false,
  "message": "Cannot create chat thread with yourself"
}

// 403 - Not friends
{
  "success": false,
  "message": "You are not friends with this user"
}

// 404 - Post not found
{
  "success": false,
  "message": "Post not found"
}
```

**cURL Example**:
```bash
curl -X POST https://lct-locket-web-app.onrender.com/api/chats/threads \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "550e8400-e29b-41d4-a716-446655440000",
    "other_user_id": "660e8400-e29b-41d4-a716-446655440001"
  }'
```

---

### 2️⃣ Get Messages in Thread

Lấy danh sách messages trong một thread. Support pagination.

**Endpoint**: `GET /api/chats/threads/:threadId/messages`

**Query Parameters**:
- `limit` (optional): Number of messages to fetch (1-100, default: 50)
- `before` (optional): ISO timestamp, lấy messages trước timestamp này

**Request Examples**:
```bash
# Initial load
GET /api/chats/threads/770e8400-e29b-41d4-a716-446655440002/messages?limit=50

# Load older messages (pagination)
GET /api/chats/threads/770e8400-e29b-41d4-a716-446655440002/messages?limit=50&before=2025-01-20T10:30:00.000Z
```

**Response 200 OK**:
```json
{
  "success": true,
  "message": "Messages retrieved successfully",
  "data": {
    "messages": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440005",
        "thread_id": "770e8400-e29b-41d4-a716-446655440002",
        "post_id": "550e8400-e29b-41d4-a716-446655440000",
        "sender_id": "440e8400-e29b-41d4-a716-446655440003",
        "receiver_id": "660e8400-e29b-41d4-a716-446655440001",
        "message": "Đẹp quá! Mình cũng muốn đi Đà Lạt lắm",
        "photo_url": null,
        "is_read": false,
        "read_at": null,
        "created_at": "2025-01-20T15:46:00.000Z",
        "sender": {
          "id": "440e8400-e29b-41d4-a716-446655440003",
          "name": "Trần Thị B",
          "username": "tranthib",
          "avatar_url": "https://lct-locket-web-app.onrender.com/avatars/user2.jpg"
        }
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440004",
        "thread_id": "770e8400-e29b-41d4-a716-446655440002",
        "post_id": "550e8400-e29b-41d4-a716-446655440000",
        "sender_id": "660e8400-e29b-41d4-a716-446655440001",
        "receiver_id": "440e8400-e29b-41d4-a716-446655440003",
        "message": null,
        "photo_url": "https://lct-locket-web-app.onrender.com/uploads/chat/photo123.jpg",
        "is_read": true,
        "read_at": "2025-01-20T15:50:00.000Z",
        "created_at": "2025-01-20T15:45:00.000Z",
        "sender": {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "name": "Nguyễn Văn A",
          "username": "nguyenvana",
          "avatar_url": "https://lct-locket-web-app.onrender.com/avatars/user1.jpg"
        }
      }
    ],
    "pagination": {
      "has_more": true,
      "oldest_timestamp": "2025-01-20T10:30:00.000Z"
    }
  }
}
```

**Notes**:
- Messages được sort theo `created_at` **DESC** (mới nhất lên đầu)
- Frontend nên reverse array để hiển thị từ cũ → mới
- Ít nhất 1 trong 2 field `message` hoặc `photo_url` sẽ có giá trị
- `pagination.has_more = true` → còn messages cũ hơn để load

**Error Responses**:
```json
// 403 - Not a participant
{
  "success": false,
  "message": "You are not a participant in this chat thread"
}

// 404 - Thread not found
{
  "success": false,
  "message": "Thread not found"
}
```

**cURL Example**:
```bash
curl -X GET "https://lct-locket-web-app.onrender.com/api/chats/threads/770e8400-e29b-41d4-a716-446655440002/messages?limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3️⃣ Send Message

Gửi text message hoặc photo message trong thread.

**Endpoint**: `POST /api/chats/threads/:threadId/messages`

**Request Body** (Text message):
```json
{
  "message": "Đẹp quá! Mình cũng muốn đi Đà Lạt lắm",
  "photo_url": null
}
```

**Request Body** (Photo message):
```json
{
  "message": "Xem ảnh này nè!",
  "photo_url": "https://lct-locket-web-app.onrender.com/uploads/chat/photo123.jpg"
}
```

**Request Body** (Photo only):
```json
{
  "message": null,
  "photo_url": "https://lct-locket-web-app.onrender.com/uploads/chat/photo123.jpg"
}
```

**Validation Rules**:
- Ít nhất 1 trong 2 field `message` hoặc `photo_url` phải có giá trị
- `message` max 2000 characters
- `photo_url` phải là valid URI

**Response 201 Created**:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "message": {
      "id": "bb0e8400-e29b-41d4-a716-446655440007",
      "thread_id": "770e8400-e29b-41d4-a716-446655440002",
      "post_id": "550e8400-e29b-41d4-a716-446655440000",
      "sender_id": "440e8400-e29b-41d4-a716-446655440003",
      "receiver_id": "660e8400-e29b-41d4-a716-446655440001",
      "message": "Đẹp quá! Mình cũng muốn đi Đà Lạt lắm",
      "photo_url": null,
      "is_read": false,
      "read_at": null,
      "created_at": "2025-01-20T16:00:00.000Z",
      "sender": {
        "id": "440e8400-e29b-41d4-a716-446655440003",
        "name": "Trần Thị B",
        "username": "tranthib",
        "avatar_url": "https://lct-locket-web-app.onrender.com/avatars/user2.jpg"
      }
    }
  }
}
```

**Side Effects**:
- ✅ Thread's `updated_at` được cập nhật
- ✅ Notification được tạo cho receiver
- ✅ Socket.IO event `chat:new_message` được emit đến receiver

**Error Responses**:
```json
// 400 - Empty message
{
  "success": false,
  "message": "Either message or photo_url must be provided"
}

// 403 - Not a participant
{
  "success": false,
  "message": "You are not a participant in this chat thread"
}

// 404 - Thread not found
{
  "success": false,
  "message": "Thread not found"
}
```

**cURL Example**:
```bash
curl -X POST https://lct-locket-web-app.onrender.com/api/chats/threads/770e8400-e29b-41d4-a716-446655440002/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Đẹp quá!",
    "photo_url": null
  }'
```

---

### 4️⃣ Mark Messages as Read

Đánh dấu tất cả messages trong thread là đã đọc.

**Endpoint**: `PUT /api/chats/threads/:threadId/read`

**Request**: No body required

**Response 200 OK**:
```json
{
  "success": true,
  "message": "Messages marked as read",
  "data": {
    "marked_count": 5
  }
}
```

**Side Effects**:
- ✅ Tất cả unread messages của current user được mark là `is_read = true`
- ✅ Socket.IO event `chat:messages_read` được emit đến thread participants

**Notes**:
- Chỉ mark messages mà current user là receiver
- Return số lượng messages đã được mark
- Nếu không có unread messages, `marked_count = 0`

**Error Responses**:
```json
// 403 - Not a participant
{
  "success": false,
  "message": "You are not a participant in this chat thread"
}
```

**cURL Example**:
```bash
curl -X PUT https://lct-locket-web-app.onrender.com/api/chats/threads/770e8400-e29b-41d4-a716-446655440002/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5️⃣ Get All Threads (List View)

Lấy danh sách tất cả threads của user cho trang Chats.

**Endpoint**: `GET /api/chats/threads`

**Query Parameters**:
- `limit` (optional): Number of threads (1-50, default: 20)
- `offset` (optional): Offset for pagination (default: 0)

**Request Example**:
```bash
GET /api/chats/threads?limit=20&offset=0
```

**Response 200 OK**:
```json
{
  "success": true,
  "message": "Threads retrieved successfully",
  "data": {
    "threads": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "post_id": "550e8400-e29b-41d4-a716-446655440000",
        "user1_id": "440e8400-e29b-41d4-a716-446655440003",
        "user2_id": "660e8400-e29b-41d4-a716-446655440001",
        "created_at": "2025-01-20T10:30:00.000Z",
        "updated_at": "2025-01-20T16:00:00.000Z",
        "unread_count": 3,
        "last_message": {
          "id": "bb0e8400-e29b-41d4-a716-446655440007",
          "message": "Đẹp quá! Mình cũng muốn đi Đà Lạt lắm",
          "photo_url": null,
          "sender_id": "440e8400-e29b-41d4-a716-446655440003",
          "created_at": "2025-01-20T16:00:00.000Z"
        },
        "post": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "photo_url": "https://lct-locket-web-app.onrender.com/uploads/photos/abc123.jpg",
          "caption": "Đà Lạt đẹp quá!",
          "sender_id": "660e8400-e29b-41d4-a716-446655440001",
          "created_at": "2025-01-20T10:00:00.000Z",
          "sender": {
            "id": "660e8400-e29b-41d4-a716-446655440001",
            "name": "Nguyễn Văn A",
            "username": "nguyenvana",
            "avatar_url": "https://lct-locket-web-app.onrender.com/avatars/user1.jpg"
          }
        },
        "other_user": {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "name": "Nguyễn Văn A",
          "username": "nguyenvana",
          "avatar_url": "https://lct-locket-web-app.onrender.com/avatars/user1.jpg"
        }
      }
    ],
    "pagination": {
      "total": 15,
      "limit": 20,
      "offset": 0,
      "has_more": false
    }
  }
}
```

**Notes**:
- Threads sorted by `updated_at` DESC (mới nhất lên đầu)
- `unread_count` = số messages chưa đọc từ other user
- `last_message` có thể là `null` nếu thread mới tạo chưa có message
- `other_user` = user còn lại (không phải current user)

**cURL Example**:
```bash
curl -X GET "https://lct-locket-web-app.onrender.com/api/chats/threads?limit=20&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6️⃣ Upload Photo for Chat

Upload ảnh trước khi gửi message. Trả về URL để dùng trong `send message` endpoint.

**Endpoint**: `POST /api/chats/upload-photo`

**Request**: `multipart/form-data`
- Field name: `photo`
- Max size: 10MB (recommended)
- Supported formats: JPEG, PNG, WEBP

**Response 200 OK**:
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "photo_url": "https://lct-locket-web-app.onrender.com/uploads/chat/abc123def456.jpg",
    "thumbnail_url": "https://lct-locket-web-app.onrender.com/uploads/chat/thumbs/abc123def456.jpg"
  }
}
```

**Error Responses**:
```json
// 400 - No file
{
  "success": false,
  "error": {
    "code": "NO_FILE",
    "message": "No file uploaded"
  }
}

// 400 - Invalid file type
{
  "success": false,
  "message": "Only image files (JPEG, PNG, WEBP) are allowed"
}
```

**cURL Example**:
```bash
curl -X POST https://lct-locket-web-app.onrender.com/api/chats/upload-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@/path/to/image.jpg"
```

**JavaScript Example**:
```javascript
const formData = new FormData();
formData.append('photo', fileInput.files[0]);

const response = await fetch('https://lct-locket-web-app.onrender.com/api/chats/upload-photo', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

const data = await response.json();
const photoUrl = data.data.photo_url;
```

---

## 🔌 Socket.IO Real-time Events

### Connection Setup

```javascript
import io from 'socket.io-client';

const socket = io('https://lct-locket-web-app.onrender.com', {
  auth: {
    token: `Bearer ${accessToken}`
  },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected to Socket.IO');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error);
});
```

### Join Thread Room

Khi user mở chat thread, join room để nhận real-time updates:

```javascript
socket.emit('chat:join_thread', {
  thread_id: '770e8400-e29b-41d4-a716-446655440002'
}, (response) => {
  if (response.success) {
    console.log('✅ Joined thread room');
  } else {
    console.error('❌ Failed to join:', response.error);
  }
});
```

### Leave Thread Room

Khi user rời khỏi chat thread:

```javascript
socket.emit('chat:leave_thread', {
  thread_id: '770e8400-e29b-41d4-a716-446655440002'
});
```

### Listen for New Messages

```javascript
socket.on('chat:new_message', (data) => {
  console.log('📩 New message received:', data);

  // data structure:
  {
    thread_id: '770e8400-e29b-41d4-a716-446655440002',
    message: {
      id: 'bb0e8400-e29b-41d4-a716-446655440007',
      thread_id: '770e8400-e29b-41d4-a716-446655440002',
      sender_id: '440e8400-e29b-41d4-a716-446655440003',
      receiver_id: '660e8400-e29b-41d4-a716-446655440001',
      message: 'Đẹp quá!',
      photo_url: null,
      created_at: '2025-01-20T16:00:00.000Z',
      sender: {
        id: '440e8400-e29b-41d4-a716-446655440003',
        name: 'Trần Thị B',
        username: 'tranthib',
        avatar_url: 'https://lct-locket-web-app.onrender.com/avatars/user2.jpg'
      }
    }
  }

  // Update UI: Add message to chat list
  addMessageToUI(data.message);
});
```

### Listen for Read Receipts

```javascript
socket.on('chat:messages_read', (data) => {
  console.log('👁️ Messages marked as read:', data);

  // data structure:
  {
    thread_id: '770e8400-e29b-41d4-a716-446655440002',
    reader_id: '660e8400-e29b-41d4-a716-446655440001',
    read_at: '2025-01-20T16:10:00.000Z'
  }

  // Update UI: Show "Đã xem" indicator
  updateReadStatus(data.thread_id, data.read_at);
});
```

---

## 🎨 Frontend Integration Examples

### React/TypeScript Example

```typescript
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';

const API_BASE_URL = 'https://lct-locket-web-app.onrender.com/api';

interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  receiver_id: string;
  message: string | null;
  photo_url: string | null;
  created_at: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar_url: string;
  };
}

interface Thread {
  id: string;
  post_id: string;
  unread_count: number;
  last_message: {
    id: string;
    message: string | null;
    photo_url: string | null;
    created_at: string;
  } | null;
  other_user: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

// API Client
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

// Chat Hook
function useChat(threadId: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Socket.IO
  useEffect(() => {
    const newSocket = io('https://lct-locket-web-app.onrender.com', {
      auth: {
        token: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Join thread room and listen for events
  useEffect(() => {
    if (!socket || !threadId) return;

    // Join thread room
    socket.emit('chat:join_thread', { thread_id: threadId }, (response) => {
      if (!response.success) {
        console.error('Failed to join thread:', response.error);
      }
    });

    // Listen for new messages
    socket.on('chat:new_message', (data) => {
      if (data.thread_id === threadId) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    // Listen for read receipts
    socket.on('chat:messages_read', (data) => {
      if (data.thread_id === threadId) {
        setMessages(prev =>
          prev.map(msg => ({
            ...msg,
            is_read: true,
            read_at: data.read_at
          }))
        );
      }
    });

    return () => {
      socket.emit('chat:leave_thread', { thread_id: threadId });
      socket.off('chat:new_message');
      socket.off('chat:messages_read');
    };
  }, [socket, threadId]);

  // Load messages
  const loadMessages = async () => {
    if (!threadId) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/chats/threads/${threadId}/messages?limit=50`);
      setMessages(response.data.data.messages.reverse()); // Reverse to show old → new
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = async (text: string | null, photoUrl: string | null) => {
    if (!threadId) return;

    try {
      await api.post(`/chats/threads/${threadId}/messages`, {
        message: text,
        photo_url: photoUrl
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Mark as read
  const markAsRead = async () => {
    if (!threadId) return;

    try {
      await api.put(`/chats/threads/${threadId}/read`);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  return {
    messages,
    isLoading,
    loadMessages,
    sendMessage,
    markAsRead
  };
}

// Chat Component
function ChatScreen({ threadId }: { threadId: string }) {
  const { messages, loadMessages, sendMessage, markAsRead } = useChat(threadId);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    loadMessages();
    markAsRead(); // Auto mark as read when opening chat
  }, [threadId]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    await sendMessage(inputText, null);
    setInputText('');
  };

  return (
    <div className="chat-screen">
      <div className="messages-list">
        {messages.map(msg => (
          <div key={msg.id} className="message">
            <img src={msg.sender.avatar_url} alt={msg.sender.name} />
            <div>
              <strong>{msg.sender.name}</strong>
              <p>{msg.message}</p>
              {msg.photo_url && <img src={msg.photo_url} alt="Shared photo" />}
            </div>
          </div>
        ))}
      </div>

      <div className="input-bar">
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Gửi</button>
      </div>
    </div>
  );
}

export default ChatScreen;
```

---

## 📝 Error Handling

### Common Error Codes

| Status | Code | Message | Action |
|--------|------|---------|--------|
| 400 | VALIDATION_ERROR | Validation failed | Check request body |
| 401 | UNAUTHORIZED | Access token required | Refresh token or re-login |
| 403 | FORBIDDEN | Not a participant | User không có quyền access thread |
| 403 | NOT_FRIENDS | Not friends with user | Cannot create chat |
| 404 | NOT_FOUND | Thread/Post not found | Resource không tồn tại |
| 500 | SERVER_ERROR | Internal server error | Retry hoặc báo lỗi |

### Error Handling Example

```typescript
try {
  const response = await api.post('/chats/threads', {
    post_id: postId,
    other_user_id: otherUserId
  });

  return response.data;
} catch (error) {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        alert('Dữ liệu không hợp lệ');
        break;
      case 403:
        if (data.message.includes('not friends')) {
          alert('Bạn cần kết bạn trước khi nhắn tin');
        }
        break;
      case 404:
        alert('Không tìm thấy bài viết');
        break;
      default:
        alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  }
}
```

---

## 🧪 Testing với Postman

### Setup Environment Variables

```
BASE_URL = https://lct-locket-web-app.onrender.com/api
ACCESS_TOKEN = <your_jwt_token>
```

### Test Flow

1. **Login to get token**:
   ```
   POST /auth/login
   Body: { "email": "user@example.com", "password": "password" }
   ```

2. **Get or create thread**:
   ```
   POST /chats/threads
   Body: { "post_id": "...", "other_user_id": "..." }
   ```

3. **Load messages**:
   ```
   GET /chats/threads/:threadId/messages?limit=50
   ```

4. **Send message**:
   ```
   POST /chats/threads/:threadId/messages
   Body: { "message": "Hello!", "photo_url": null }
   ```

5. **Mark as read**:
   ```
   PUT /chats/threads/:threadId/read
   ```

6. **Get all threads**:
   ```
   GET /chats/threads?limit=20&offset=0
   ```

---

## 💡 Best Practices

### Performance

1. **Pagination**: Always use pagination khi load messages/threads
2. **Caching**: Cache threads list ở client để giảm API calls
3. **Lazy Loading**: Chỉ load messages khi user scroll lên top
4. **Debouncing**: Debounce typing indicator nếu implement

### UX

1. **Optimistic Updates**: Show message ngay lập tức, chờ API response sau
2. **Loading States**: Hiển thị skeleton loading khi fetch data
3. **Error Recovery**: Retry logic cho failed requests
4. **Offline Support**: Queue messages khi offline, gửi lại khi online

### Security

1. **Token Refresh**: Auto refresh token khi expired
2. **Input Validation**: Validate user input trước khi gửi API
3. **XSS Prevention**: Sanitize message content khi render
4. **File Validation**: Validate file type/size trước khi upload

---

## 🚀 Deployment Notes

### Production URL
```
https://lct-locket-web-app.onrender.com
```

### Socket.IO Connection
- Primary transport: WebSocket
- Fallback: Long polling
- Reconnection: Automatic

### Rate Limiting
- API: 100 requests/minute per user
- Upload: Max 10MB per file

---

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, liên hệ Backend Team:

- **GitHub Issues**: [LCT-Moment-Web-App/issues](https://github.com/congtiendev/LCT-Moment-Web-App/issues)
- **Email**: tienlc@innocom.vn
- **Slack**: #lct-moment-backend

---

**Document Version**: 1.0
**Last Updated**: 2025-01-21
**API Version**: v1
**Author**: Backend Team
