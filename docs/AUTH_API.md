# EthosLife Auth API Documentation

## Base URL
```
/api/auth
```

## Authentication Methods
- **Email/Password** - Traditional registration and login
- **Google OAuth** - One-click Google sign-in
- **Telegram** - Telegram Web App authentication

## Endpoints

### Email/Password Auth

#### POST /register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe",
  "referral_code": "ABC123" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "userId": "uuid"
}
```

#### POST /login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatarUrl": "https://...",
    "role": "user",
    "isEmailVerified": true,
    "subscriptionTier": "free"
  },
  "token": "access_token_jwt",
  "refreshToken": "refresh_token_jwt"
}
```

#### POST /verify-email
Verify email address with code.

**Request Body:**
```json
{
  "userId": "uuid",
  "code": "123456"
}
```

#### POST /resend-verification
Resend verification email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /reset-password
Reset password with code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

### OAuth

#### POST /google
Google OAuth login.

**Request Body:**
```json
{
  "credential": "google_id_token"
}
```

#### POST /telegram
Telegram authentication.

**Request Body:**
```json
{
  "id": 123456,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "photo_url": "https://...",
  "auth_date": 1234567890,
  "hash": "auth_hash"
}
```

### Token Management

#### POST /refresh
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

#### POST /logout
Logout current device.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

#### POST /logout-all
Logout from all devices (requires authentication).

**Headers:**
```
Authorization: Bearer access_token
```

### User Profile (Protected)

#### GET /me
Get current user profile.

**Headers:**
```
Authorization: Bearer access_token
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://...",
    "phone": "+1234567890",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "wallet_address": "0x...",
    "subscription_tier": "premium",
    "referral_code": "ABC123",
    "referral_earnings": 100.00,
    "is_email_verified": true
  }
}
```

#### PUT /profile
Update user profile.

**Headers:**
```
Authorization: Bearer access_token
```

**Request Body:**
```json
{
  "full_name": "John Doe Updated",
  "phone": "+9876543210",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "avatar_url": "https://...",
  "bio": "Health enthusiast",
  "location": "New York, USA"
}
```

#### POST /change-password
Change password.

**Headers:**
```
Authorization: Bearer access_token
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Referrals (Protected)

#### GET /referrals
Get user's referrals and stats.

**Headers:**
```
Authorization: Bearer access_token
```

**Response:**
```json
{
  "success": true,
  "referrals": [
    {
      "id": "uuid",
      "referred_name": "Jane Doe",
      "status": "converted",
      "earnings": 50.00,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "stats": {
    "total_referrals": 10,
    "converted": 5,
    "total_earnings": 250.00
  }
}
```

## Authentication Flow

### Registration Flow
1. User submits registration form
2. System creates user with unverified status
3. Verification email sent with 6-digit code
4. User submits code to verify email
5. Account activated

### Login Flow
1. User submits credentials
2. System validates and returns JWT tokens
3. Access token (15 min) used for API calls
4. Refresh token (7 days) used to get new access token

### Password Reset Flow
1. User requests password reset
2. System sends 6-digit code via email
3. User submits code with new password
4. Password updated, all sessions invalidated

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "message": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Account is deactivated"
}
```

### 409 Conflict
```json
{
  "error": "Email already registered"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

## Environment Variables

```env
# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Email (Production)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
SMTP_SECURE=false

# App URL
APP_URL=https://app.ethoslife.com
```

## Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Tokens**: Short-lived access tokens (15 min), long-lived refresh tokens (7 days)
- **Rate Limiting**: Recommended to implement on API gateway
- **Email Verification**: Required for email/password accounts
- **Password Reset**: Secure code-based reset with expiration
- **Session Management**: Track and invalidate sessions per device
