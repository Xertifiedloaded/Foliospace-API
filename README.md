# Foliospace API - Express.js Backend (Vercel Serverless)

A RESTful API backend built with Express.js, deployed as a Vercel serverless function for the Foliospace mobile application.

## Features

- User authentication (register, login, OTP verification)
- Portfolio management (profile, education, experience, projects, skills, certificates)
- CV upload and AI parsing
- Waitlist management
- Analytics tracking
- AI agent integration (Gemini)
- Blog and sitemap generation
- JWT-based authentication for mobile apps

## Architecture

This is a traditional Express.js application organized with MVC pattern:
- **Controllers** - Business logic for each feature
- **Routes** - Express route definitions
- **Middleware** - Authentication and request processing
- **Utils** - Helper functions and utilities
- **Config** - Third-party service configurations

The entire Express app is exported as a single Vercel serverless function at `api/index.js`.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (Neon recommended for Vercel)
- Vercel account for deployment
- npm or pnpm

## Installation

1. Clone the repository

2. Install dependencies:
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

3. Set up environment variables in Vercel dashboard or `.env.local`:
\`\`\`bash
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
ALLOWED_ORIGINS=http://localhost:3000,https://yourapp.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM=noreply@foliospace.com
CONTACT_EMAIL=contact@foliospace.com
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

4. Run Prisma migrations:
\`\`\`bash
npx prisma migrate dev
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
# or
vercel dev
\`\`\`

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/create` - Register new account
- `POST /api/auth/login` - Login (web with cookies)
- `POST /api/auth/mobile-login` - Login (mobile with tokens)
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/resend-otp` - Resend verification OTP
- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/contact` - Send contact form message
- `GET /api/auth/session` - Get current user session (requires auth)

### Portfolio (`/api/portfolio`)
- `GET /api/portfolio/dashboard` - Get user dashboard (requires auth)
- `GET /api/portfolio/profile/:username` - Get public profile
- `PUT /api/portfolio/profile` - Update profile (requires auth)
- `POST /api/portfolio/links` - Add social link (requires auth)
- `PUT /api/portfolio/links/:id` - Update link (requires auth)
- `DELETE /api/portfolio/links/:id` - Delete link (requires auth)
- `POST /api/portfolio/education` - Add education (requires auth)
- `PUT /api/portfolio/education/:id` - Update education (requires auth)
- `DELETE /api/portfolio/education/:id` - Delete education (requires auth)
- `POST /api/portfolio/experience` - Add experience (requires auth)
- `PUT /api/portfolio/experience/:id` - Update experience (requires auth)
- `DELETE /api/portfolio/experience/:id` - Delete experience (requires auth)
- `POST /api/portfolio/projects` - Add project (requires auth)
- `PUT /api/portfolio/projects/:id` - Update project (requires auth)
- `DELETE /api/portfolio/projects/:id` - Delete project (requires auth)
- `POST /api/portfolio/skills` - Add skill (requires auth)
- `DELETE /api/portfolio/skills/:id` - Delete skill (requires auth)
- `POST /api/portfolio/certificates` - Add certificate (requires auth)
- `PUT /api/portfolio/certificates/:id` - Update certificate (requires auth)
- `DELETE /api/portfolio/certificates/:id` - Delete certificate (requires auth)

### User (`/api/user`)
- `GET /api/user/skills` - Get user skills
- `GET /api/user/template` - Get portfolio template (requires auth)
- `PUT /api/user/template` - Update portfolio template (requires auth)

### Analytics (`/api/analytics`)
- `POST /api/analytics/track` - Track page visit
- `GET /api/analytics/stats` - Get analytics stats (requires auth)

### Waitlist (`/api/waitlist`)
- `POST /api/waitlist` - Add email to waitlist
- `GET /api/waitlist` - Get all waitlist entries

### Upload (`/api/upload`)
- `POST /api/upload/cv` - Upload and parse CV (requires auth)

### AI (`/api/ai`)
- `POST /api/ai/agent` - Process AI request with Gemini (requires auth)

### Other
- `GET /api/health` - Health check endpoint
- `GET /api/sitemap` - Generate XML sitemap
- `GET /api/blog/:slug` - Get blog post by slug
- `GET /api/references` - Get references

## Authentication

Protected endpoints require a JWT token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

### Mobile App Authentication

Use the `/api/auth/mobile-login` endpoint which returns:
\`\`\`json
{
  "user": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "expiresIn": 604800
}
\`\`\`

Store the `accessToken` and include it in all subsequent requests.

## Deployment to Vercel

1. Install Vercel CLI:
\`\`\`bash
npm i -g vercel
\`\`\`

2. Login to Vercel:
\`\`\`bash
vercel login
\`\`\`

3. Deploy:
\`\`\`bash
vercel --prod
\`\`\`

4. Set environment variables in Vercel dashboard under Settings → Environment Variables

## Development

Run locally with Vercel dev server:
\`\`\`bash
vercel dev
\`\`\`

This simulates the Vercel serverless environment locally.

## Project Structure

\`\`\`
api/
├── index.js              # Main Express app (serverless entry point)
├── controllers/          # Business logic
│   ├── auth.controller.js
│   ├── portfolio.controller.js
│   ├── user.controller.js
│   ├── analytics.controller.js
│   ├── waitlist.controller.js
│   ├── upload.controller.js
│   ├── ai.controller.js
│   ├── reference.controller.js
│   ├── sitemap.controller.js
│   └── blog.controller.js
├── routes/               # Express routes
│   ├── auth.routes.js
│   ├── portfolio.routes.js
│   ├── user.routes.js
│   ├── analytics.routes.js
│   ├── waitlist.routes.js
│   ├── upload.routes.js
│   ├── ai.routes.js
│   ├── reference.routes.js
│   ├── sitemap.routes.js
│   └── blog.routes.js
├── middleware/           # Express middleware
│   └── auth.middleware.js
├── config/               # Configuration
│   └── nodemailer.js
└── utils/                # Helper functions
    ├── generateOtp.js
    ├── emailContent.js
    └── helpers.js
\`\`\`

## Mobile App Integration

This API is optimized for React Native mobile apps:

- **CORS enabled** - Configurable allowed origins
- **JWT authentication** - No cookies, pure token-based auth
- **JSON responses** - All endpoints return JSON
- **Mobile-specific endpoints** - `/api/auth/mobile-login` returns tokens
- **Error handling** - Consistent error response format

## License

ISC
# Foliospace-API
