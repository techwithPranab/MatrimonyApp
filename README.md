# MatrimonyWeb - Production-Ready Matrimony Platform

A full-stack matrimony web application built with Next.js 14, TypeScript, MongoDB, and AI-powered matching.

## Features

### 🔐 Authentication & Security
- Email/password and OAuth (Google) authentication
- Role-based access control (user, moderator, admin)
- Secure password hashing with bcrypt
- Session management with NextAuth.js

### 👤 Profile Management
- Comprehensive profile creation with step-by-step onboarding
- Photo upload with privacy controls
- Profile verification system (email, phone, documents)
- Profile completeness tracking

### 🤖 AI-Powered Matching
- Smart compatibility scoring algorithm
- AI-generated profile summaries and headlines
- Personalized ice-breaker message suggestions
- Content moderation using AI

### 🔍 Advanced Search & Discovery
- Multi-criteria search with filters
- Location-based matching
- Community and religion-based filtering
- Saved searches with email alerts

### 💬 Real-time Communication
- Instant messaging with Pusher
- Typing indicators and read receipts
- Photo sharing in conversations
- Connection requests and management

### 💳 Subscription Management
- Multiple subscription tiers (Free, Basic, Premium, Elite)
- Stripe integration for payments
- Feature-based entitlements
- Subscription management dashboard

### 🛡️ Safety & Moderation
- Content moderation for text and images
- Report and block functionality
- Admin moderation panel
- Audit logging for admin actions

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- shadcn/ui component library
- Professional corporate design
- Accessibility compliant (WCAG AA)
- Dark mode support

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Real-time**: Pusher
- **Payments**: Stripe
- **File Upload**: UploadThing
- **AI Services**: OpenAI-compatible APIs
- **Testing**: Vitest, React Testing Library, Playwright
- **Code Quality**: ESLint, Prettier, Husky

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd matrimony-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values.

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Demo Accounts

After running the seed script, you can use these demo accounts:

- **User**: demo@matrimonyweb.com / password123
- **Premium User**: priya@matrimonyweb.com / password123

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run e2e` - Run end-to-end tests
- `npm run seed` - Seed database with sample data

## Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── (marketing)/        # Marketing pages (landing, pricing)
│   ├── (auth)/            # Authentication pages
│   ├── (user)/            # User dashboard and features
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── forms/            # Form components
│   └── ...               # Feature-specific components
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   ├── validators/       # Zod schemas
│   ├── ai/               # AI service providers
│   └── matching/         # Matching algorithms
├── models/               # Mongoose models
├── scripts/              # Utility scripts
└── public/               # Static assets
```

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
