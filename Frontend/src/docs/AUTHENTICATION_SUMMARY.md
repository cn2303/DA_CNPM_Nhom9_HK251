# 🔐 Authentication System - Summary

## ✅ Completed Implementation

### 📦 Files Created/Modified

1. **`/services/auth.ts`** (NEW)
   - Authentication service managing token, userId, role
   - LocalStorage persistence
   - Helper methods for auth state

2. **`/services/api.ts`** (UPDATED)
   - All API calls now automatically send auth headers
   - Token, userId, role included in every request
   - Login endpoint bypasses auth headers

3. **`/components/Login.tsx`** (NEW)
   - Login page component
   - Email & password inputs
   - Error handling & loading states

4. **`/App.tsx`** (UPDATED)
   - Authentication guard
   - Login/logout handlers
   - Session management

---

## 🔑 Authentication Headers

### Every API request automatically includes:

```http
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
X-User-Id: 10
X-User-Role: ADMIN
```

### Example:
```http
GET /book HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbGljZTJAZXhhbXBsZS5jb20i...
X-User-Id: 10
X-User-Role: ADMIN
```

---

## 📋 All Protected APIs

✅ **Every endpoint below automatically sends token, userId, and role:**

### Book API
- GET /book
- GET /book/:id
- POST /book
- PUT /book
- DELETE /book/:id

### User API
- GET /user
- GET /user/:id
- POST /user
- PUT /user
- DELETE /user/:id

### Order API
- GET /order
- GET /order/:id
- GET /order/user/:userId
- GET /order/status/:status
- GET /order/user/:userId/status/:status
- POST /order
- PUT /order
- PUT /order/:orderId/status/:status
- DELETE /order/:id

### Voucher API
- GET /voucher
- GET /voucher/:code
- POST /voucher
- PUT /voucher
- DELETE /voucher/:code

### Category API
- GET /category
- GET /category/:id

### Address API
- GET /address
- GET /address/:id
- GET /address/user/:userId
- POST /address
- PUT /address
- DELETE /address/:id

### OrderAddress API
- GET /OrderAddress
- GET /OrderAddress/:id
- POST /OrderAddress
- PUT /OrderAddress
- DELETE /OrderAddress/:id

### Cart API
- GET /cart
- GET /cart/:id
- PUT /cart
- PUT /cart/:cartId/book/:bookId
- DELETE /cart/:id

### Review API
- GET /review/:id
- GET /review/book/:bookId
- POST /review
- PUT /review
- DELETE /review/:id

---

## 🚀 How It Works

### 1. Login Flow
```typescript
// User enters credentials
email: "alice2@example.com"
password: "123456789"

// POST /auth/login (NO auth headers)
→ Backend validates credentials
→ Returns: { token, userId, role, authenticated }

// Save to localStorage
localStorage.setItem('auth_token', token)
localStorage.setItem('auth_user_id', userId)
localStorage.setItem('auth_role', role)

// User is now authenticated
```

### 2. Subsequent API Calls
```typescript
// Call any API
await bookAPI.getAll()

// Automatically includes:
const token = localStorage.getItem('auth_token')      // "eyJhbGci..."
const userId = localStorage.getItem('auth_user_id')   // "10"
const role = localStorage.getItem('auth_role')        // "ADMIN"

// Headers sent:
Authorization: Bearer eyJhbGci...
X-User-Id: 10
X-User-Role: ADMIN
```

### 3. Logout Flow
```typescript
// User clicks logout
authService.clearAuth()

// Clears localStorage
localStorage.removeItem('auth_token')
localStorage.removeItem('auth_user_id')
localStorage.removeItem('auth_role')

// Redirects to login page
```

---

## 💾 LocalStorage Structure

After successful login:
```javascript
{
  "auth_token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbGljZTJAZXhhbXBsZS5jb20iLCJleHAiOjE3NjUyNjQ3MTksImlhdCI6MTc2NTI2MTExOSwic2NvcGUiOiJDVVNUT01FUiJ9.4etDG0pv_BPr1qG7AhkuUIwKh7Giv0h2jkrCusN17RS4gU3jY-QIoBZ50gi7hAlv3MdUBw6k6pL6GBZ2inQasw",
  "auth_user_id": "10",
  "auth_role": "ADMIN"
}
```

---

## 🧪 Testing

### 1. Check Console Logs
```javascript
// On login
🔐 Calling POST /auth/login (no auth headers)
✅ Login successful: { userId: 10, role: "ADMIN" }
✅ Auth saved: { role: "ADMIN", userId: 10 }
✅ User logged in: { role: "ADMIN", userId: 10 }

// On API calls
🔑 API Call: /book { hasToken: true, userId: 10, role: "ADMIN" }
🔑 API Call: /user { hasToken: true, userId: 10, role: "ADMIN" }
🔑 API Call: /order { hasToken: true, userId: 10, role: "ADMIN" }
```

### 2. Check Network Tab (Browser DevTools)
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page or make an API call
4. Click on any request (e.g., GET /book)
5. Go to "Headers" section
6. Verify:
   ```
   Request Headers:
     Authorization: Bearer eyJhbGci...
     Content-Type: application/json
     X-User-Id: 10
     X-User-Role: ADMIN
   ```

### 3. Check LocalStorage (Browser DevTools)
1. Open DevTools (F12)
2. Go to Application tab
3. Click on "Local Storage" → "http://localhost:5173"
4. Verify:
   ```
   auth_token: eyJhbGci...
   auth_user_id: 10
   auth_role: ADMIN
   ```

---

## 📝 Usage Examples

### Example 1: Get All Books
```typescript
// Call API
const books = await bookAPI.getAll();

// Backend receives:
GET /book
Headers:
  Authorization: Bearer eyJhbGci...
  X-User-Id: 10
  X-User-Role: ADMIN
```

### Example 2: Create Order
```typescript
// Call API
const order = await orderAPI.create({
  status: 'Pending',
  paymentMethod: 'Cash',
  // ... other fields
});

// Backend receives:
POST /order
Headers:
  Authorization: Bearer eyJhbGci...
  X-User-Id: 10
  X-User-Role: ADMIN
Body:
  { status: 'Pending', paymentMethod: 'Cash', ... }
```

### Example 3: Update Order Status
```typescript
// Call API
const updated = await orderAPI.updateStatus(123, 'Processing');

// Backend receives:
PUT /order/123/status/Processing
Headers:
  Authorization: Bearer eyJhbGci...
  X-User-Id: 10
  X-User-Role: ADMIN
```

---

## ⚙️ Configuration

### API Base URL
```typescript
// /services/api.ts
const API_BASE_URL = 'http://localhost:8080';
```

### Auth Header Names
```typescript
// /services/api.ts
Authorization: Bearer <token>     // JWT token
X-User-Id: <userId>               // User ID
X-User-Role: <role>               // User role (ADMIN/CUSTOMER)
```

### LocalStorage Keys
```typescript
// /services/auth.ts
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_ROLE_KEY = 'auth_role';
const AUTH_USER_ID_KEY = 'auth_user_id';
```

---

## 🔒 Security Notes

1. **Token Storage**: Stored in localStorage (consider httpOnly cookies for production)
2. **Token Expiration**: Backend should validate token expiration
3. **HTTPS**: Use HTTPS in production
4. **CORS**: Backend must allow frontend origin
5. **XSS Protection**: Sanitize user inputs

---

## 🎯 Key Features

✅ **Automatic Header Injection**
   - No manual header management needed
   - Just call API methods normally

✅ **Session Persistence**
   - Auto-login on page refresh
   - Token survives browser reload

✅ **Centralized Auth Logic**
   - All auth code in `/services/auth.ts`
   - Easy to modify or extend

✅ **Debug Friendly**
   - Console logs for every API call
   - Easy to trace auth flow

✅ **Type Safe**
   - TypeScript interfaces for auth data
   - Compile-time type checking

---

## 🚨 Important Notes

### Login Endpoint Exception
The `/auth/login` endpoint does NOT send auth headers because:
- It's a public endpoint
- No token exists yet
- Backend doesn't require auth for login

```typescript
// Login call uses direct fetch (not apiCall)
fetch('/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // NO Authorization header
    // NO X-User-Id header
    // NO X-User-Role header
  },
  body: JSON.stringify({ email, password })
})
```

### All Other Endpoints
Every other endpoint uses `apiCall()` which automatically adds:
```typescript
{
  'Authorization': `Bearer ${token}`,
  'X-User-Id': `${userId}`,
  'X-User-Role': `${role}`
}
```

---

## 📚 Code References

### Auth Service
```typescript
// /services/auth.ts
authService.saveAuth(loginResponse)
authService.getToken()
authService.getUserId()
authService.getRole()
authService.clearAuth()
authService.isAuthenticated()
authService.isAdmin()
authService.isCustomer()
```

### API Call
```typescript
// /services/api.ts
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = authService.getToken();
  const userId = authService.getUserId();
  const role = authService.getRole();
  
  // Auto-add headers
  const authHeaders: Record<string, string> = {};
  if (token) authHeaders['Authorization'] = `Bearer ${token}`;
  if (userId) authHeaders['X-User-Id'] = userId.toString();
  if (role) authHeaders['X-User-Role'] = role;
  
  // Make request with headers
  fetch(endpoint, { headers: { ...authHeaders, ...options?.headers } })
}
```

---

## ✅ Checklist

- [x] Auth service created (`/services/auth.ts`)
- [x] API service updated to send headers (`/services/api.ts`)
- [x] Login page created (`/components/Login.tsx`)
- [x] App updated with auth guard (`/App.tsx`)
- [x] All API calls send token, userId, role
- [x] Login endpoint bypasses auth headers
- [x] LocalStorage persistence implemented
- [x] Logout functionality implemented
- [x] Console logging for debugging
- [x] TypeScript types defined

---

## 🎉 Summary

**Every API request now automatically includes:**
```http
Authorization: Bearer <JWT_TOKEN>
X-User-Id: <USER_ID>
X-User-Role: <USER_ROLE>
```

**No manual work needed - just call the API:**
```typescript
await bookAPI.getAll()        // ✅ Headers added automatically
await orderAPI.create(order)  // ✅ Headers added automatically
await userAPI.update(user)    // ✅ Headers added automatically
```

**Backend receives full auth context on every request! 🚀**
