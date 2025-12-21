# Zycard Backend - Quick Start Checklist

Follow these steps to get your backend running in 10 minutes.

## Prerequisites Check
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Supabase account created
- [ ] Code editor ready

## Step-by-Step Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Verify Dependencies Installed
```bash
# Check package.json exists
ls package.json

# Dependencies should already be installed
# If not, run: npm install
```

### 3. Get Supabase Connection String

1. Go to https://app.supabase.com/
2. Select your project (or create new)
3. Click "Project Settings" (gear icon)
4. Go to "Database" section
5. Copy the "Connection string" (URI format)
6. Replace `[YOUR-PASSWORD]` with your database password

Example format:
```
postgresql://postgres:your_password@db.xyz.supabase.co:5432/postgres
```

### 4. Generate JWT Secret

Run this command to generate a secure random key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - you'll need it for JWT_SECRET.

### 5. Create .env File

```bash
# Copy the example file
cp .env.example .env

# Open .env in your editor
# Replace with your actual values
```

### 6. Configure Environment Variables

Open `.env` and set these REQUIRED variables:

```env
# REQUIRED
PORT=5000
NODE_ENV=development
DATABASE_URL=your_supabase_connection_string_here
JWT_SECRET=your_generated_secret_from_step_4
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:8080
```

Optional (can configure later):
```env
# For Google Login (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# For Razorpay Payments (optional - COD works without this)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### 7. Verify Database Schema

1. Open Supabase dashboard
2. Click "Table Editor"
3. Verify these tables exist:
   - [x] users
   - [x] cart_items
   - [x] orders
   - [x] order_items
   - [x] addresses

If tables don't exist, they were created via migration. Check Supabase SQL Editor.

### 8. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║           🚀 ZYCARD BACKEND API STARTED 🚀           ║
║  Server running on: http://localhost:5000            ║
╚═══════════════════════════════════════════════════════╝
```

### 9. Test the API

Open a new terminal and run:

```bash
# Test health endpoint
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

### 10. Test User Registration

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

Expected response (200 OK with token):
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "fullName": "Test User"
  }
}
```

**SAVE THE TOKEN** - you'll need it for the next steps.

### 11. Test Protected Endpoint (Cart)

```bash
# Replace YOUR_TOKEN_HERE with the token from step 10
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId": "test-product-1",
    "productName": "Test Product",
    "productImage": "https://example.com/image.jpg",
    "productPrice": 599,
    "quantity": 1
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Item added to cart",
  "cartItem": {
    "id": "...",
    "productId": "test-product-1",
    "productName": "Test Product",
    "productPrice": 599,
    "quantity": 1
  }
}
```

### 12. Verify in Supabase

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Open "users" table - you should see your test user
4. Open "cart_items" table - you should see your test cart item

## Completion Checklist

- [ ] Server starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] User registration works (creates user in database)
- [ ] Login returns JWT token
- [ ] Protected endpoint accepts valid token
- [ ] Protected endpoint rejects missing token (401)
- [ ] Data appears in Supabase tables

## Troubleshooting

### Server won't start
**Error:** "Cannot find module 'express'"
```bash
# Solution: Install dependencies
npm install
```

**Error:** "Database connection failed"
```bash
# Solution: Check DATABASE_URL in .env
# Ensure password has no special characters
# Verify Supabase project is active
```

**Error:** "Port 5000 already in use"
```bash
# Solution: Change PORT in .env or kill existing process
lsof -ti:5000 | xargs kill -9
```

### API returns 401 Unauthorized
```bash
# Issue: Token missing or invalid
# Solution: Ensure Authorization header is correct:
# Authorization: Bearer <token>
# Token should not have quotes or extra spaces
```

### Can't create user
**Error:** "Email already registered"
```bash
# Use a different email or delete test user from Supabase
```

**Error:** "Validation failed"
```bash
# Ensure all required fields are provided:
# - email (valid email format)
# - password (minimum 6 characters)
# - fullName (not empty)
```

### Database tables missing
```bash
# The migration should have created tables automatically
# If not, check Supabase SQL Editor > Migrations
# The migration file should be visible there
```

## What to Do Next

### If Everything Works
1. Test all endpoints using API_EXAMPLES.md
2. Configure Google OAuth (optional)
3. Configure Razorpay (optional)
4. Start integrating with frontend

### If You Hit Issues
1. Check the error message carefully
2. Review SETUP_GUIDE.md for detailed instructions
3. Verify all environment variables are set
4. Check server console logs for details

## Optional: Configure Google OAuth

1. Go to https://console.cloud.google.com/
2. Create project or select existing
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:8080`
6. Copy Client ID and Secret to .env
7. Restart server

## Optional: Configure Razorpay

1. Sign up at https://dashboard.razorpay.com/
2. Switch to "Test Mode" (toggle in top-right)
3. Go to Settings > API Keys
4. Generate Test Keys
5. Copy Key ID and Secret to .env
6. Restart server

Test card for Razorpay:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL to production domain
- [ ] Use production Razorpay keys (not test)
- [ ] Configure HTTPS/SSL
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure database backups
- [ ] Set up server monitoring
- [ ] Review and adjust rate limits
- [ ] Test all endpoints in production

## Getting Help

If you're stuck:
1. Check README.md - Complete documentation
2. Check SETUP_GUIDE.md - Detailed setup
3. Check API_EXAMPLES.md - Testing examples
4. Check ARCHITECTURE.md - Technical details
5. Review error logs in console

## Ready to Deploy?

Backend is production-ready. Choose a platform:
- **Heroku**: Easy deployment with buildpacks
- **Railway**: Modern platform with great DX
- **Render**: Free tier available
- **AWS/GCP/Azure**: For enterprise scale

See README.md for deployment instructions.

---

## Quick Reference

**Start server:**
```bash
npm run dev
```

**Health check:**
```bash
curl http://localhost:5000/
```

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","fullName":"User"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

**Add to cart (with token):**
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"p1","productName":"Product","productPrice":599,"quantity":1}'
```

---

## Success Indicators

When everything is working, you should see:
- Server starts with green checkmarks
- No error messages in console
- API responds to curl requests
- Data appears in Supabase tables
- JWT tokens are generated successfully
- Protected routes require authentication

## You're Ready!

Once all checklist items are complete, your backend is fully operational and ready to integrate with the frontend.

The backend will automatically:
- Authenticate users
- Manage user-specific carts
- Process orders
- Handle payments (COD + Razorpay)
- Enforce security rules
- Return proper error messages

**No frontend changes needed** - the backend is designed to work with your existing React application.
