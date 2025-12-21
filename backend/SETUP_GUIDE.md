# Zycard Backend - Quick Setup Guide

This guide will help you get the Zycard backend up and running in minutes.

## Prerequisites

- Node.js 16+ installed
- Supabase account (free tier works)
- Optional: Razorpay account for payment testing
- Optional: Google Cloud Console for OAuth

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Supabase Database

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project (or use existing)
3. Navigate to Project Settings > Database
4. Copy the "Connection string" (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

Example:
```
postgresql://postgres:your_password@db.abcdefghijklmn.supabase.co:5432/postgres
```

## Step 3: Set Up Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Required
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=generate_random_secret_key_here

# Optional for full functionality
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

To generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Verify Database Schema

The database schema was already created via Supabase migrations. Verify tables exist:

1. Go to Supabase Dashboard > Table Editor
2. You should see these tables:
   - users
   - cart_items
   - orders
   - order_items
   - addresses

## Step 5: Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║           🚀 ZYCARD BACKEND API STARTED 🚀           ║
║  Server running on: http://localhost:5000            ║
╚═══════════════════════════════════════════════════════╝
```

## Step 6: Test the API

Test the health endpoint:
```bash
curl http://localhost:5000/
```

Expected response:
```json
{
  "success": true,
  "message": "Zycard Backend API is running",
  "version": "1.0.0"
}
```

## Step 7: Test Authentication

### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "phone": "9876543210"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "fullName": "Test User"
  }
}
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response - you'll need it for authenticated requests.

## Step 8: Test Cart Operations

Add item to cart (replace YOUR_TOKEN with actual JWT):
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": "product-1",
    "productName": "Test Product",
    "productImage": "https://example.com/image.jpg",
    "productPrice": 599,
    "quantity": 1
  }'
```

Get cart:
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Step 9: Test Order Creation

Create COD order:
```bash
curl -X POST http://localhost:5000/api/orders/cod \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "shippingAddress": {
      "fullName": "Test User",
      "phone": "9876543210",
      "address": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  }'
```

## Optional: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Create Web application credentials
7. Add authorized JavaScript origins:
   - `http://localhost:8080` (frontend)
8. Add authorized redirect URIs:
   - `http://localhost:8080`
9. Copy Client ID and Client Secret
10. Add to `.env` file

## Optional: Razorpay Setup

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Activate Test Mode (toggle in top-right)
3. Go to Settings > API Keys
4. Generate Test Keys
5. Copy Key ID and Key Secret
6. Add to `.env` file

Test cards for Razorpay:
- Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Troubleshooting

### "Database connection failed"
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure password has no special characters that need escaping

### "Please login to continue"
- Check Authorization header format: `Bearer <token>`
- Verify token hasn't expired (default: 7 days)
- Try logging in again to get fresh token

### "Razorpay not configured"
- This is expected if you haven't set up Razorpay
- COD orders will still work
- Add Razorpay credentials when ready

### Port already in use
- Change PORT in `.env` file
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

## Next Steps

1. Test all authentication flows
2. Test cart operations
3. Test order creation with COD
4. If needed, configure Razorpay for online payments
5. If needed, configure Google OAuth
6. Update CORS settings for your production frontend URL

## Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL to production domain
- [ ] Use production Razorpay keys (not test keys)
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure database backups
- [ ] Review and adjust rate limits
- [ ] Set up error tracking (e.g., Sentry)

## API Documentation

For complete API documentation, see [README.md](./README.md)

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure database migrations ran successfully
4. Test with the provided curl commands
5. Check Supabase dashboard for database errors
