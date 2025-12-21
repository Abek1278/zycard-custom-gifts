# API Testing Examples

Complete examples for testing all Zycard backend endpoints.

## Base URL
```
http://localhost:5000
```

## Table of Contents
1. [Authentication](#authentication)
2. [Cart Management](#cart-management)
3. [Order Management](#order-management)
4. [Error Responses](#error-responses)

---

## Authentication

### 1. User Signup

**Endpoint:** `POST /api/auth/signup`

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "fullName": "John Doe",
    "phone": "9876543210"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0IiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNjc4OTg3NjU0LCJleHAiOjE2Nzk1OTI0NTR9.abc123xyz",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "phone": "9876543210"
  }
}
```

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "phone": "9876543210"
  }
}
```

### 3. Google OAuth Login

**Endpoint:** `POST /api/auth/google-login`

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "google_id_token_from_frontend"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Google login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@gmail.com",
    "fullName": "John Doe",
    "phone": null
  }
}
```

### 4. Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "phone": "9876543210",
    "authProvider": "email",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Cart Management

All cart endpoints require authentication (Bearer token in Authorization header).

### 1. Get Cart

**Endpoint:** `GET /api/cart`

**Request:**
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "cart": [
    {
      "id": "cart-item-id-1",
      "productId": "tshirt-1",
      "productName": "Custom Photo T-Shirt",
      "productImage": "https://example.com/tshirt.jpg",
      "productPrice": 599,
      "quantity": 2,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    },
    {
      "id": "cart-item-id-2",
      "productId": "mug-1",
      "productName": "Magic Color Change Mug",
      "productImage": "https://example.com/mug.jpg",
      "productPrice": 449,
      "quantity": 1,
      "createdAt": "2024-01-20T11:00:00.000Z",
      "updatedAt": "2024-01-20T11:00:00.000Z"
    }
  ],
  "total": 1647,
  "itemCount": 3
}
```

### 2. Add Item to Cart

**Endpoint:** `POST /api/cart/add`

**Request:**
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": "tshirt-1",
    "productName": "Custom Photo T-Shirt",
    "productImage": "https://example.com/tshirt.jpg",
    "productPrice": 599,
    "quantity": 1
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "cartItem": {
    "id": "cart-item-id-1",
    "productId": "tshirt-1",
    "productName": "Custom Photo T-Shirt",
    "productImage": "https://example.com/tshirt.jpg",
    "productPrice": 599,
    "quantity": 1
  }
}
```

### 3. Update Cart Item Quantity

**Endpoint:** `PUT /api/cart/update/:id`

**Request:**
```bash
curl -X PUT http://localhost:5000/api/cart/update/cart-item-id-1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "quantity": 3
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart updated",
  "cartItem": {
    "id": "cart-item-id-1",
    "productId": "tshirt-1",
    "productName": "Custom Photo T-Shirt",
    "productImage": "https://example.com/tshirt.jpg",
    "productPrice": 599,
    "quantity": 3
  }
}
```

### 4. Remove Item from Cart

**Endpoint:** `DELETE /api/cart/remove/:id`

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/cart/remove/cart-item-id-1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

### 5. Clear Cart

**Endpoint:** `DELETE /api/cart/clear`

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/cart/clear \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

## Order Management

All order endpoints require authentication.

### 1. Create COD Order

**Endpoint:** `POST /api/orders/cod`

**Request:**
```bash
curl -X POST http://localhost:5000/api/orders/cod \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "shippingAddress": {
      "fullName": "John Doe",
      "phone": "9876543210",
      "address": "123, MG Road, Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "id": "order-uuid",
    "orderNumber": "ZYC1234567890",
    "totalAmount": 1647,
    "shippingFee": 0,
    "grandTotal": 1647,
    "paymentMethod": "cod",
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "createdAt": "2024-01-20T12:00:00.000Z"
  }
}
```

### 2. Create Razorpay Order

**Endpoint:** `POST /api/orders/razorpay/create`

**Request:**
```bash
curl -X POST http://localhost:5000/api/orders/razorpay/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "razorpayOrderId": "order_LnPxTXrQbBZd8s",
  "amount": 164700,
  "currency": "INR",
  "keyId": "rzp_test_1234567890"
}
```

### 3. Verify Razorpay Payment

**Endpoint:** `POST /api/orders/razorpay/verify`

**Request:**
```bash
curl -X POST http://localhost:5000/api/orders/razorpay/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "razorpayOrderId": "order_LnPxTXrQbBZd8s",
    "razorpayPaymentId": "pay_LnPy1xK9CgE4Bs",
    "razorpaySignature": "signature_hash",
    "shippingAddress": {
      "fullName": "John Doe",
      "phone": "9876543210",
      "address": "123, MG Road, Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Payment verified and order placed successfully",
  "order": {
    "id": "order-uuid",
    "orderNumber": "ZYC1234567891",
    "totalAmount": 1647,
    "shippingFee": 0,
    "grandTotal": 1647,
    "paymentMethod": "razorpay",
    "paymentStatus": "paid",
    "orderStatus": "processing",
    "createdAt": "2024-01-20T12:30:00.000Z"
  }
}
```

### 4. Get My Orders

**Endpoint:** `GET /api/orders/my-orders`

**Request:**
```bash
curl -X GET http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order-uuid-1",
      "orderNumber": "ZYC1234567890",
      "totalAmount": 1647,
      "shippingFee": 0,
      "grandTotal": 1647,
      "paymentMethod": "cod",
      "paymentStatus": "pending",
      "orderStatus": "pending",
      "shippingAddress": {
        "fullName": "John Doe",
        "phone": "9876543210",
        "address": "123, MG Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001"
      },
      "createdAt": "2024-01-20T12:00:00.000Z",
      "items": [
        {
          "productId": "tshirt-1",
          "productName": "Custom Photo T-Shirt",
          "productImage": "https://example.com/tshirt.jpg",
          "productPrice": 599,
          "quantity": 2,
          "subtotal": 1198
        },
        {
          "productId": "mug-1",
          "productName": "Magic Color Change Mug",
          "productImage": "https://example.com/mug.jpg",
          "productPrice": 449,
          "quantity": 1,
          "subtotal": 449
        }
      ]
    }
  ]
}
```

### 5. Get Order by ID

**Endpoint:** `GET /api/orders/:id`

**Request:**
```bash
curl -X GET http://localhost:5000/api/orders/order-uuid-1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "order": {
    "id": "order-uuid-1",
    "orderNumber": "ZYC1234567890",
    "totalAmount": 1647,
    "shippingFee": 0,
    "grandTotal": 1647,
    "paymentMethod": "cod",
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "shippingAddress": {
      "fullName": "John Doe",
      "phone": "9876543210",
      "address": "123, MG Road",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "createdAt": "2024-01-20T12:00:00.000Z",
    "items": [
      {
        "productId": "tshirt-1",
        "productName": "Custom Photo T-Shirt",
        "productImage": "https://example.com/tshirt.jpg",
        "productPrice": 599,
        "quantity": 2,
        "subtotal": 1198
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request

**Missing Required Field:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Cart Empty:**
```json
{
  "success": false,
  "message": "Cart is empty"
}
```

### 401 Unauthorized

**No Token Provided:**
```json
{
  "success": false,
  "message": "Please login to continue",
  "error": "No token provided"
}
```

**Invalid Token:**
```json
{
  "success": false,
  "message": "Please login to continue",
  "error": "Invalid or expired token"
}
```

**Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 404 Not Found

**Order Not Found:**
```json
{
  "success": false,
  "message": "Order not found"
}
```

**Cart Item Not Found:**
```json
{
  "success": false,
  "message": "Cart item not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message (development mode only)"
}
```

### 503 Service Unavailable

**Razorpay Not Configured:**
```json
{
  "success": false,
  "message": "Razorpay is not configured. Please use COD payment method."
}
```

---

## Testing Flow

### Complete User Journey

1. **Signup**
```bash
# Create account
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

2. **Add items to cart**
```bash
# Add product 1
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":"tshirt-1","productName":"Custom T-Shirt","productImage":"url","productPrice":599,"quantity":2}'

# Add product 2
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":"mug-1","productName":"Magic Mug","productImage":"url","productPrice":449,"quantity":1}'
```

3. **View cart**
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

4. **Place order**
```bash
curl -X POST http://localhost:5000/api/orders/cod \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"shippingAddress":{"fullName":"Test User","phone":"9876543210","address":"123 Main St","city":"Mumbai","state":"Maharashtra","pincode":"400001"}}'
```

5. **View orders**
```bash
curl -X GET http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer $TOKEN"
```

---

## Postman Collection

Import this JSON into Postman for easy testing:

1. Open Postman
2. Click "Import"
3. Copy the API endpoints from above
4. Set up environment variables:
   - `base_url`: http://localhost:5000
   - `token`: (auto-filled after login)

---

## Testing Tips

1. **Save tokens**: After signup/login, save the token for subsequent requests
2. **Use variables**: In Postman, use `{{base_url}}` and `{{token}}`
3. **Test errors**: Try requests without tokens, with invalid data, etc.
4. **Check database**: Verify data in Supabase dashboard after operations
5. **Monitor logs**: Watch server console for detailed error messages
