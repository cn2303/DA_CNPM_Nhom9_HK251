# API Authentication Documentation

## Overview
Mọi API request đều tự động gửi kèm token, userId, và role trong HTTP headers để backend xác thực.

## Authentication Headers

### Header Structure
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
X-User-Id: <USER_ID>
X-User-Role: <USER_ROLE>
```

### Example Request
```http
GET http://localhost:8080/book
Headers:
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbGljZTJAZXhhbXBsZS5jb20iLCJleHAiOjE3NjUyNjQ3MTksImlhdCI6MTc2NTI2MTExOSwic2NvcGUiOiJDVVNUT01FUiJ9...
  X-User-Id: 10
  X-User-Role: ADMIN
```

## Login Flow

### 1. User Login
```http
POST /auth/login
Body:
{
  "email": "alice2@example.com",
  "password": "123456789"
}

Response:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "authenticated": true,
  "userId": 10,
  "role": "ADMIN"
}
```

### 2. Save Auth Data
```typescript
authService.saveAuth({
  token: "eyJhbGci...",
  userId: 10,
  role: "ADMIN",
  authenticated: true
});
```

### 3. LocalStorage
```javascript
localStorage = {
  "auth_token": "eyJhbGci...",
  "auth_user_id": "10",
  "auth_role": "ADMIN"
}
```

### 4. Subsequent API Calls
All API calls automatically include auth headers:

```typescript
// Example: Get all books
await bookAPI.getAll();

// Actual request sent:
GET /book
Headers:
  Authorization: Bearer eyJhbGci...
  X-User-Id: 10
  X-User-Role: ADMIN
```

## API Methods Coverage

### ✅ Book API
- `getAll()` - GET /book
- `getById(id)` - GET /book/:id
- `create(book)` - POST /book
- `update(book)` - PUT /book
- `delete(id)` - DELETE /book/:id

### ✅ User API
- `getAll()` - GET /user
- `getById(id)` - GET /user/:id
- `create(user)` - POST /user
- `update(user)` - PUT /user
- `delete(id)` - DELETE /user/:id

### ✅ Order API
- `getAll()` - GET /order
- `getById(id)` - GET /order/:id
- `getByUserId(userId)` - GET /order/user/:userId
- `getByStatus(status)` - GET /order/status/:status
- `getByUserIdAndStatus(userId, status)` - GET /order/user/:userId/status/:status
- `create(order)` - POST /order
- `update(order)` - PUT /order
- `updateStatus(orderId, status)` - PUT /order/:orderId/status/:status
- `delete(id)` - DELETE /order/:id

### ✅ Voucher API
- `getAll()` - GET /voucher
- `getByCode(code)` - GET /voucher/:code
- `create(voucher)` - POST /voucher
- `update(voucher)` - PUT /voucher
- `delete(code)` - DELETE /voucher/:code

### ✅ Category API
- `getAll()` - GET /category
- `getById(id)` - GET /category/:id

### ✅ Address API
- `getAll()` - GET /address
- `getById(id)` - GET /address/:id
- `getByUserId(userId)` - GET /address/user/:userId
- `create(address)` - POST /address
- `update(address)` - PUT /address
- `delete(id)` - DELETE /address/:id

### ✅ OrderAddress API
- `getAll()` - GET /OrderAddress
- `getById(id)` - GET /OrderAddress/:id
- `create(orderAddress)` - POST /OrderAddress
- `update(orderAddress)` - PUT /OrderAddress
- `delete(id)` - DELETE /OrderAddress/:id

### ✅ Cart API
- `getAll()` - GET /cart
- `getById(id)` - GET /cart/:id
- `update(cart)` - PUT /cart
- `addBook(cartId, bookId)` - PUT /cart/:cartId/book/:bookId
- `delete(id)` - DELETE /cart/:id

### ✅ Review API
- `getById(id)` - GET /review/:id
- `getByBookId(bookId)` - GET /review/book/:bookId
- `create(review)` - POST /review
- `update(review)` - PUT /review
- `delete(id)` - DELETE /review/:id

### ✅ Auth API
- `login(credentials)` - POST /auth/login (NO auth headers needed)

## Implementation Details

### apiCall Function
```typescript
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Get auth data from localStorage
  const token = authService.getToken();
  const userId = authService.getUserId();
  const role = authService.getRole();
  
  // Build auth headers
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }
  if (userId !== null) {
    authHeaders['X-User-Id'] = userId.toString();
  }
  if (role) {
    authHeaders['X-User-Role'] = role;
  }
  
  // Make request with auth headers
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
  });
  
  // Handle response...
}
```

### Auth Service Methods
```typescript
authService.getToken()    // Returns: "eyJhbGci..." or null
authService.getUserId()   // Returns: 10 or null
authService.getRole()     // Returns: "ADMIN" or "CUSTOMER" or null
```

## Console Logging

Every API call logs auth information:
```
🔑 API Call: /book { hasToken: true, userId: 10, role: "ADMIN" }
🔑 API Call: /order { hasToken: true, userId: 10, role: "ADMIN" }
🔑 API Call: /user { hasToken: true, userId: 10, role: "ADMIN" }
```

## Logout

When user logs out:
```typescript
authService.clearAuth();
// Clears all auth data from localStorage
// All subsequent API calls will NOT include auth headers
```

## Error Handling

### 401 Unauthorized
If backend returns 401, user should be redirected to login page.

### 403 Forbidden
If backend returns 403, user does not have permission.

### Example
```typescript
try {
  await bookAPI.getAll();
} catch (error) {
  if (error.message.includes('401')) {
    // Redirect to login
    authService.clearAuth();
    window.location.reload();
  }
}
```

## Testing

### Check Headers in Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Make an API call (e.g., refresh books)
4. Click on the request
5. Go to "Headers" section
6. Verify:
   - `Authorization: Bearer <token>`
   - `X-User-Id: <userId>`
   - `X-User-Role: <role>`

### Check Console Logs
```
🔐 Auth state on mount: { token: "eyJ...", role: "ADMIN", userId: 10, isAuthenticated: true }
🔑 API Call: /book { hasToken: true, userId: 10, role: "ADMIN" }
🔑 API Call: /user { hasToken: true, userId: 10, role: "ADMIN" }
🔑 API Call: /order { hasToken: true, userId: 10, role: "ADMIN" }
```

## Summary

✅ **All API calls automatically include:**
- Authorization: Bearer <token>
- X-User-Id: <userId>
- X-User-Role: <role>

✅ **No manual header management needed**
- Just call `bookAPI.getAll()`, headers are added automatically

✅ **Works for all endpoints:**
- Book, User, Order, Voucher, Category, Address, OrderAddress, Cart, Review

✅ **Session persistence:**
- Auth data saved in localStorage
- Survives page refresh
- Cleared on logout

✅ **Debug friendly:**
- Console logs for every API call
- Easy to verify in DevTools Network tab
