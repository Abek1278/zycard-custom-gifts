# Zycard Backend Architecture

Complete technical overview of the Zycard e-commerce backend system.

## System Overview

The Zycard backend is a production-ready RESTful API built with Node.js and Express.js, using PostgreSQL (via Supabase) for data persistence. It provides complete authentication, cart management, order processing, and payment integration for an e-commerce platform.

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT + Google OAuth
- **Payment**: Razorpay

### Key Dependencies
- `express` - Web framework
- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `razorpay` - Payment gateway SDK
- `google-auth-library` - Google OAuth
- `express-validator` - Input validation
- `helmet` - Security headers
- `cors` - Cross-origin resource sharing
- `express-rate-limit` - API rate limiting

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                    (React + Vite)                           │
│                   http://localhost:8080                      │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/HTTPS
                        │ JWT Token in Headers
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                           │
│                  http://localhost:5000                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Middleware Layer                         │  │
│  │  • CORS                                               │  │
│  │  • Helmet (Security Headers)                          │  │
│  │  • Rate Limiting                                      │  │
│  │  • Body Parser (JSON)                                 │  │
│  │  • Authentication (JWT Verification)                  │  │
│  │  • Input Validation                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 Route Layer                           │  │
│  │                                                        │  │
│  │  /api/auth      ──▶  authRoutes                       │  │
│  │  /api/cart      ──▶  cartRoutes                       │  │
│  │  /api/orders    ──▶  orderRoutes                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controller Layer                         │  │
│  │                                                        │  │
│  │  authController      ──▶  Business Logic              │  │
│  │  cartController      ──▶  Data Processing             │  │
│  │  orderController     ──▶  Payment Integration         │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Database Layer                           │  │
│  │                                                        │  │
│  │  • Connection Pool (pg)                               │  │
│  │  • Query Execution                                    │  │
│  │  • Transaction Management                             │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ SQL Queries
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                 POSTGRESQL DATABASE                          │
│                      (Supabase)                              │
│                                                              │
│  Tables:                                                     │
│  • users             - User accounts & auth                  │
│  • cart_items        - Shopping cart items                   │
│  • orders            - Order records                         │
│  • order_items       - Order line items                      │
│  • addresses         - User addresses                        │
│                                                              │
│  Security:                                                   │
│  • Row Level Security (RLS)                                  │
│  • Indexes for performance                                   │
│  • Foreign key constraints                                   │
└─────────────────────────────────────────────────────────────┘

                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                            │
│                                                              │
│  • Google OAuth      - Social authentication                 │
│  • Razorpay          - Payment processing                    │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
backend/
├── config/
│   └── database.js              # PostgreSQL connection pool
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── cartController.js        # Cart management
│   └── orderController.js       # Order & payment processing
├── middleware/
│   ├── auth.js                  # JWT verification middleware
│   └── validator.js             # Input validation rules
├── routes/
│   ├── authRoutes.js            # Auth endpoint definitions
│   ├── cartRoutes.js            # Cart endpoint definitions
│   └── orderRoutes.js           # Order endpoint definitions
├── utils/
│   ├── jwt.js                   # JWT helper functions
│   └── orderNumber.js           # Order number generation
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies & scripts
├── server.js                    # Main application entry
├── README.md                    # Main documentation
├── SETUP_GUIDE.md              # Quick setup instructions
├── API_EXAMPLES.md             # API testing examples
└── ARCHITECTURE.md             # This file
```

## Data Flow

### Authentication Flow

#### Email/Password Registration
```
1. Client sends: POST /api/auth/signup
   { email, password, fullName, phone }

2. Middleware validates input

3. Controller:
   - Checks if email exists
   - Hashes password with bcrypt (10 rounds)
   - Creates user record in database
   - Generates JWT token
   - Returns token + user data

4. Client stores token (localStorage/cookies)

5. Client includes token in subsequent requests:
   Authorization: Bearer <token>
```

#### Google OAuth Login
```
1. Frontend initiates Google Sign-In
2. Google returns ID token
3. Client sends: POST /api/auth/google-login
   { idToken }

4. Backend verifies token with Google
5. If valid:
   - Check if user exists (by google_id or email)
   - If new: create user record
   - If existing: link Google ID
   - Generate JWT token
   - Return token + user data
```

#### Protected Routes
```
1. Client includes: Authorization: Bearer <token>
2. Auth middleware extracts and verifies JWT
3. If valid: adds userId to req object, continues
4. If invalid: returns 401 Unauthorized
```

### Cart Flow

```
User Login ──▶ JWT Token ──▶ Add to Cart
                                 │
                                 ▼
                         Check if item exists
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
              Item exists              New item
                    │                         │
                    ▼                         ▼
           Update quantity              Insert new record
                    │                         │
                    └────────────┬────────────┘
                                 ▼
                          Return updated cart

View Cart ──▶ GET /api/cart ──▶ Fetch all items for userId
                                       │
                                       ▼
                               Calculate totals
                                       │
                                       ▼
                               Return cart data

Update Quantity ──▶ PUT /api/cart/update/:id
                            │
                            ▼
                    Verify ownership (userId match)
                            │
                            ▼
                    Update quantity in DB
                            │
                            ▼
                    Return updated item

Remove Item ──▶ DELETE /api/cart/remove/:id
                        │
                        ▼
                Verify ownership
                        │
                        ▼
                Delete record
                        │
                        ▼
                Return success
```

### Order Flow

#### Cash on Delivery (COD)
```
1. User clicks "Place Order"
2. Frontend sends: POST /api/orders/cod
   { shippingAddress }

3. Backend:
   ┌─ BEGIN TRANSACTION ─┐
   │                      │
   │  1. Fetch cart items │
   │  2. Calculate totals │
   │  3. Create order     │
   │  4. Create order items│
   │  5. Clear cart       │
   │                      │
   └─ COMMIT TRANSACTION ─┘

4. Return order details

5. Order status: pending
   Payment status: pending
```

#### Razorpay Payment
```
1. User selects "Pay Online"

2. Frontend: POST /api/orders/razorpay/create
   Backend:
   - Fetch cart items
   - Calculate total
   - Create Razorpay order
   - Return: razorpayOrderId, amount, keyId

3. Frontend opens Razorpay modal
   User completes payment

4. Razorpay returns:
   - razorpayOrderId
   - razorpayPaymentId
   - razorpaySignature

5. Frontend: POST /api/orders/razorpay/verify
   {
     razorpayOrderId,
     razorpayPaymentId,
     razorpaySignature,
     shippingAddress
   }

6. Backend:
   - Verify signature (HMAC SHA256)
   - If valid:
     ┌─ BEGIN TRANSACTION ─┐
     │                      │
     │  1. Fetch cart       │
     │  2. Create order     │
     │  3. Mark as PAID     │
     │  4. Create order items│
     │  5. Clear cart       │
     │                      │
     └─ COMMIT TRANSACTION ─┘
   - Return order details

7. Order status: processing
   Payment status: paid
```

## Database Schema

### Users Table
```sql
users (
  id              UUID PRIMARY KEY,
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT,                     -- NULL for Google users
  full_name       TEXT,
  phone           TEXT,
  auth_provider   TEXT NOT NULL,            -- 'email' | 'google'
  google_id       TEXT UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
)
```

**Indexes**: email, google_id

**RLS Policies**:
- Users can read/update only their own profile
- No public access

### Cart Items Table
```sql
cart_items (
  id              UUID PRIMARY KEY,
  user_id         UUID REFERENCES users(id),
  product_id      TEXT NOT NULL,
  product_name    TEXT NOT NULL,
  product_image   TEXT,
  product_price   NUMERIC(10,2) NOT NULL,
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
)
```

**Indexes**: user_id

**RLS Policies**:
- Users can CRUD only their own cart items

### Orders Table
```sql
orders (
  id                    UUID PRIMARY KEY,
  order_number          TEXT UNIQUE NOT NULL,
  user_id               UUID REFERENCES users(id),
  total_amount          NUMERIC(10,2) NOT NULL,
  shipping_fee          NUMERIC(10,2) DEFAULT 0,
  grand_total           NUMERIC(10,2) NOT NULL,
  payment_method        TEXT NOT NULL,         -- 'cod' | 'razorpay'
  payment_status        TEXT NOT NULL,         -- 'pending' | 'paid' | 'failed'
  razorpay_order_id     TEXT,
  razorpay_payment_id   TEXT,
  razorpay_signature    TEXT,
  order_status          TEXT NOT NULL,         -- 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address      JSONB NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
)
```

**Indexes**: user_id, order_number

**RLS Policies**:
- Users can view/create only their own orders

### Order Items Table
```sql
order_items (
  id              UUID PRIMARY KEY,
  order_id        UUID REFERENCES orders(id),
  product_id      TEXT NOT NULL,
  product_name    TEXT NOT NULL,
  product_image   TEXT,
  product_price   NUMERIC(10,2) NOT NULL,
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  subtotal        NUMERIC(10,2) NOT NULL
)
```

**Indexes**: order_id

**RLS Policies**:
- Users can view items of their own orders only

## Security Implementation

### 1. Authentication Security
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: HS256 algorithm, 7-day expiration
- **Token Storage**: Client-side (frontend responsibility)
- **Token Validation**: Middleware on all protected routes

### 2. Database Security
- **Row Level Security (RLS)**: Enabled on all tables
- **User Isolation**: Users can only access their own data
- **SQL Injection Prevention**: Parameterized queries
- **Connection Pool**: Managed connections, timeouts

### 3. API Security
- **Rate Limiting**: 100 requests per 15 minutes (general), 10 requests per 15 minutes (auth)
- **CORS**: Configured for specific frontend origin
- **Helmet**: Security headers (XSS, clickjacking protection)
- **Input Validation**: express-validator on all inputs
- **Error Handling**: Generic messages in production

### 4. Payment Security
- **Signature Verification**: HMAC SHA256 for Razorpay
- **Idempotency**: Order numbers prevent duplicates
- **Transaction Integrity**: Database transactions for consistency
- **Sensitive Data**: Razorpay keys in environment variables only

## Performance Optimization

### Database
- Indexed columns for fast lookups
- Connection pooling (max 20 connections)
- Prepared statements via parameterized queries

### API
- Efficient SQL queries (select only needed columns)
- Pagination ready (not implemented yet, but structure supports it)
- Minimal data transformation

### Caching (Future Enhancement)
- Redis for session storage
- Cache frequently accessed data
- Reduce database load

## Error Handling Strategy

### Client Errors (4xx)
- **400 Bad Request**: Validation failures
- **401 Unauthorized**: Missing/invalid token
- **404 Not Found**: Resource doesn't exist
- **429 Too Many Requests**: Rate limit exceeded

### Server Errors (5xx)
- **500 Internal Server Error**: Unhandled exceptions
- **503 Service Unavailable**: External service issues (Razorpay)

### Error Response Format
```json
{
  "success": false,
  "message": "User-friendly message",
  "error": "Detailed error (dev mode only)"
}
```

### Logging Strategy
- Console logging in development
- Structured logging recommended for production
- Log levels: error, warn, info, debug

## Scalability Considerations

### Current Design
- Stateless API (horizontal scaling ready)
- Database connection pooling
- JWT tokens (no server-side session storage)

### Future Enhancements
- **Load Balancing**: Multiple server instances behind LB
- **Redis**: Distributed caching, session storage
- **CDN**: Static asset delivery
- **Message Queue**: Async order processing
- **Microservices**: Split auth, cart, orders into separate services

## Deployment Architecture

### Recommended Stack
```
Production Environment:
├── Application Server
│   ├── Node.js runtime
│   ├── PM2 process manager
│   └── Environment variables
├── Database
│   ├── Supabase PostgreSQL
│   └── Automated backups
├── Load Balancer (optional)
│   └── Nginx / AWS ALB
├── SSL/TLS
│   └── Let's Encrypt / ACM
└── Monitoring
    ├── Application logs
    ├── Database metrics
    └── Error tracking (Sentry)
```

## Environment Configuration

### Development
```env
NODE_ENV=development
DATABASE_URL=supabase_dev_url
JWT_SECRET=dev_secret
RAZORPAY_KEY_ID=test_key
FRONTEND_URL=http://localhost:8080
```

### Production
```env
NODE_ENV=production
DATABASE_URL=supabase_prod_url
JWT_SECRET=strong_random_secret
RAZORPAY_KEY_ID=live_key
FRONTEND_URL=https://zycard.com
```

## Testing Strategy

### Manual Testing
- Use curl commands (see API_EXAMPLES.md)
- Postman collection for all endpoints
- Test both success and error cases

### Automated Testing (Recommended for Production)
- Unit tests: Controllers, utilities
- Integration tests: API endpoints
- E2E tests: Complete user flows
- Load testing: Performance benchmarks

## Monitoring & Maintenance

### Key Metrics to Monitor
- API response times
- Error rates
- Database query performance
- Active connections
- Memory usage
- CPU utilization

### Recommended Tools
- **APM**: New Relic, Datadog
- **Error Tracking**: Sentry
- **Logging**: Winston, Logz.io
- **Uptime**: UptimeRobot, Pingdom

## API Versioning

Current version: v1 (implicit)

Future versions can be added:
```
/api/v1/auth
/api/v2/auth
```

## Compliance & Best Practices

### Security
- OWASP Top 10 addressed
- PCI DSS considerations (using Razorpay)
- GDPR considerations (data privacy)

### Code Quality
- ESLint for code standards
- Prettier for formatting
- Git hooks for pre-commit checks

### Documentation
- Inline code comments
- API documentation (this file)
- Setup guides
- Architecture diagrams

## Future Roadmap

### Short Term
- Email notifications (order confirmation)
- Order status updates
- Admin dashboard APIs
- Product review system

### Medium Term
- Inventory management
- Discount codes / coupons
- Wishlist functionality
- Multiple shipping addresses

### Long Term
- Microservices architecture
- Real-time notifications (WebSocket)
- Advanced analytics
- Mobile app APIs

## Support & Maintenance

### Regular Tasks
- Database backups (automated via Supabase)
- Security updates (npm audit)
- Dependency updates
- Log rotation
- Performance monitoring

### Emergency Procedures
- Database restoration
- Rollback procedures
- Incident response plan
- Customer communication

---

## Conclusion

This backend provides a solid foundation for an e-commerce platform with:
- Secure authentication
- User-specific cart management
- Order processing with multiple payment methods
- Scalable architecture
- Production-ready security

The system is designed to be maintainable, extensible, and performant, ready for both development and production environments.
