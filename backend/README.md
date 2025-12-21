# Zycard Backend API

Production-ready backend for the Zycard e-commerce platform with complete authentication, cart management, order processing, and payment integration.

## Tech Stack

- **Node.js** + **Express.js** - Backend framework
- **PostgreSQL** (Supabase) - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Razorpay** - Payment gateway
- **Google OAuth** - Social authentication

## Features

### Authentication
- Email/Password registration and login
- Google OAuth integration
- JWT-based session management
- Secure password hashing with bcrypt
- Protected routes with middleware

### Cart Management
- User-specific cart system
- Add/update/remove items
- Persistent cart storage
- Real-time cart calculations

### Order Management
- Cash on Delivery (COD)
- Razorpay payment integration (UPI, Cards, Net Banking)
- Order tracking
- Payment verification
- Order history

### Security
- Row Level Security (RLS) in database
- JWT token validation
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (Supabase)
DATABASE_URL=your_supabase_database_url

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Razorpay (TEST MODE)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL
FRONTEND_URL=http://localhost:8080
```

### 3. Database Setup

The database schema is already created using Supabase migrations. Tables include:
- `users` - User accounts
- `cart_items` - Shopping cart
- `orders` - Order records
- `order_items` - Order line items
- `addresses` - Shipping addresses

### 4. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/signup`
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "9876543210"
}
```

#### POST `/api/auth/login`
Login with email and password
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/google-login`
Login with Google
```json
{
  "idToken": "google_id_token"
}
```

#### GET `/api/auth/profile`
Get user profile (requires authentication)
```
Authorization: Bearer <jwt_token>
```

### Cart (`/api/cart`)

All cart endpoints require authentication.

#### GET `/api/cart`
Get user's cart

#### POST `/api/cart/add`
Add item to cart
```json
{
  "productId": "product-id",
  "productName": "Product Name",
  "productImage": "image-url",
  "productPrice": 599,
  "quantity": 1
}
```

#### PUT `/api/cart/update/:id`
Update cart item quantity
```json
{
  "quantity": 2
}
```

#### DELETE `/api/cart/remove/:id`
Remove item from cart

#### DELETE `/api/cart/clear`
Clear entire cart

### Orders (`/api/orders`)

All order endpoints require authentication.

#### POST `/api/orders/cod`
Create Cash on Delivery order
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

#### POST `/api/orders/razorpay/create`
Create Razorpay order (returns Razorpay order ID)

#### POST `/api/orders/razorpay/verify`
Verify Razorpay payment and create order
```json
{
  "razorpayOrderId": "order_xyz",
  "razorpayPaymentId": "pay_xyz",
  "razorpaySignature": "signature",
  "shippingAddress": { ... }
}
```

#### GET `/api/orders/my-orders`
Get user's order history

#### GET `/api/orders/:id`
Get specific order details

## Authentication Flow

### Email/Password Registration
1. User signs up with email and password
2. Password is hashed using bcrypt
3. User record is created in database
4. JWT token is generated and returned
5. Frontend stores token for subsequent requests

### Email/Password Login
1. User provides email and password
2. Server verifies credentials
3. If valid, JWT token is generated
4. Token returned to frontend

### Google OAuth Login
1. User initiates Google login on frontend
2. Frontend receives Google ID token
3. Frontend sends token to backend
4. Backend verifies token with Google
5. If user exists, login; if not, create account
6. JWT token generated and returned

### Protected Routes
1. Frontend includes JWT token in Authorization header
2. Backend middleware validates token
3. If valid, request proceeds; if not, returns 401

## Payment Integration

### Cash on Delivery (COD)
- No external payment processing
- Order created immediately
- Payment collected on delivery

### Razorpay Integration
1. Frontend calls `/api/orders/razorpay/create`
2. Backend creates Razorpay order
3. Frontend opens Razorpay payment modal
4. User completes payment
5. Frontend sends payment details to `/api/orders/razorpay/verify`
6. Backend verifies payment signature
7. If valid, order is created with "paid" status

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents abuse and DDoS
- **Input Validation**: express-validator for request validation
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **RLS**: Database-level security policies

## Error Handling

All API responses follow this structure:

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (dev mode only)"
}
```

## Database Schema

### Users
- Authentication (email/password or Google)
- Profile information
- Timestamps

### Cart Items
- User-specific cart
- Product details cached
- Quantity tracking

### Orders
- Order metadata
- Payment information
- Shipping address
- Status tracking

### Order Items
- Products in each order
- Price at time of order
- Quantity ordered

## Environment-Specific Behavior

### Development
- Detailed error messages
- Console logging enabled
- CORS relaxed

### Production
- Generic error messages
- Minimal logging
- Strict CORS
- Rate limiting enforced

## Testing the API

### Using cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Cart (with token)
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman
1. Import the API endpoints
2. Set up environment variables for tokens
3. Test each endpoint with sample data

## Deployment

### Heroku
```bash
heroku create zycard-backend
heroku config:set DATABASE_URL=...
heroku config:set JWT_SECRET=...
git push heroku main
```

### Railway
```bash
railway init
railway add
railway up
```

### Render
1. Connect GitHub repository
2. Configure environment variables
3. Deploy

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure IP is whitelisted (if applicable)

### JWT Errors
- Verify JWT_SECRET is set
- Check token expiration
- Ensure Authorization header format: `Bearer <token>`

### Razorpay Not Working
- Verify keys are for TEST mode
- Check keys are correctly set in .env
- Ensure frontend sends correct payload

### CORS Errors
- Verify FRONTEND_URL matches actual frontend
- Check CORS configuration in server.js

## Support

For issues or questions:
1. Check this README
2. Review error logs
3. Verify environment variables
4. Test with provided curl commands

## License

MIT License - See LICENSE file for details
