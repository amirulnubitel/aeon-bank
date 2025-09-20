# 🏦 Aeon Bank - Secure Authentication Demo

A sophisticated banking application demo built with **Next.js 15** and **React 19**, showcasing advanced multi-layered security authentication patterns commonly used in financial institutions.

## 🌟 Features

### 🔐 Advanced Security Architecture

-  **Multi-Step Authentication Flow**: Username → Secure Word → Password → MFA → Success
-  **HMAC-Based Secure Word**: Time-sensitive secure words with 60-second expiration
-  **Client-Side Password Hashing**: SHA-256 hashing before transmission
-  **TOTP Multi-Factor Authentication**: Time-based One-Time Password support
-  **Rate Limiting**: 10-second cooldown for secure word requests
-  **MFA Lockout Protection**: 3 attempts maximum with 15-minute lockout
-  **JWT Session Management**: Secure session handling with JSON Web Tokens

### 🎨 Modern UI/UX

-  **Responsive Design**: Mobile-first approach with Tailwind CSS 4
-  **Progress Indicator**: Visual step-by-step authentication progress
-  **Headless UI Components**: Accessible navigation and interactions
-  **Real-time Feedback**: Instant validation and error handling
-  **Professional Banking Interface**: Clean, modern dashboard design

### 🏗️ Technical Implementation

-  **Next.js 15**: Latest App Router with Server Components
-  **React 19**: Modern React features and hooks
-  **Tailwind CSS 4**: Utility-first CSS framework
-  **TypeScript Ready**: Fully typed for better development experience

## 🚀 Quick Start

### Prerequisites

-  Node.js 18+
-  npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/amirulnubitel/aeon-bank.git
   cd aeon-bank
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔒 Security Features Deep Dive

### 1. Multi-Step Authentication Flow

The application implements a sophisticated 5-step authentication process:

```
Username → Secure Word → Password → MFA → Dashboard Access
```

### 2. Secure Word Authentication

-  **HMAC-SHA256** generation with time-based salt
-  **60-second expiration** window
-  **Rate limiting** prevents brute force attempts
-  **Server-side validation** ensures authenticity

### 3. Client-Side Security

-  **Password hashing** with SHA-256 before transmission
-  **No plaintext passwords** sent over network
-  **Secure token storage** in localStorage
-  **Session persistence** across browser tabs

### 4. TOTP Multi-Factor Authentication

-  **Time-based OTP** using industry-standard algorithms
-  **QR Code generation** for authenticator app setup
-  **30-second time windows** for code validity
-  **Backup codes** support (implementation ready)

### 5. Session Management

-  **JWT tokens** for secure session handling
-  **Automatic token refresh** mechanisms
-  **Cross-tab synchronization** of authentication state
-  **Secure logout** with token invalidation

## 📁 Project Structure

```
aeon-bank/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── getSecureWord/      # Secure word generation
│   │   │   ├── login/              # Authentication endpoint
│   │   │   ├── logout/             # Session termination
│   │   │   ├── transaction-history/ # Mock banking data
│   │   │   └── verifyMfa/          # MFA verification
│   │   ├── components/             # Reusable UI components
│   │   │   ├── login.js            # Main login orchestrator
│   │   │   ├── UsernameStep.js     # Username input step
│   │   │   ├── SecureWordStep.js   # Secure word verification
│   │   │   ├── PasswordStep.js     # Password authentication
│   │   │   ├── MFAStep.js          # Multi-factor authentication
│   │   │   ├── SuccessStep.js      # Completion confirmation
│   │   │   ├── navbar.js           # Navigation component
│   │   │   └── table.js            # Transaction display
│   │   ├── dashboard/              # Protected dashboard
│   │   ├── lib/                    # Utility functions
│   │   ├── globals.css             # Global styles
│   │   ├── layout.js               # Root layout
│   │   └── page.js                 # Landing page
│   └── middleware.js               # Next.js middleware
├── public/                         # Static assets
├── next.config.mjs                 # Next.js configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## 🛠️ Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# WORD Secret
SECURE_WORD_SECRET=secure-word-secret

```

## 🧪 Testing the Authentication Flow

### Demo Credentials

For testing purposes, you can use any username. The system will:

1. **Username Step**: Accept any valid username format
2. **Secure Word**: Generate a time-sensitive secure word
3. **Password Step**: Validate against mock user database
4. **MFA Step**: Provide QR code for authenticator app setup
5. **Success**: Grant access to secure dashboard

### Testing MFA

1. Download any TOTP authenticator app (Google Authenticator, Authy, etc.)
2. Scan the QR code displayed during MFA setup
3. Enter the 6-digit code from your authenticator app
4. Access granted to the secure dashboard

## 🏛️ Banking Features (Demo)

The dashboard showcases typical banking application features:

-  **Account Overview**: Session information and security status
-  **Transaction History**: Mock transaction data display
-  **Security Dashboard**: Overview of implemented security features
-  **Session Management**: Active session monitoring

## 🔐 Security Best Practices Implemented

1. **Defense in Depth**: Multiple layers of security validation
2. **Time-Based Security**: Expiring tokens and rate limiting
3. **Client-Side Hashing**: No plaintext credential transmission
4. **Session Security**: Proper JWT handling and validation
5. **MFA Integration**: Industry-standard TOTP implementation
6. **Rate Limiting**: Protection against brute force attacks
7. **Secure Storage**: Proper token management in browser

## ⚠️ Disclaimer

This is a **demonstration project** showcasing authentication patterns. While it implements real security measures, it should not be used as-is for actual banking applications without proper security audits, compliance reviews, and additional enterprise-grade security measures.

## 🔗 Learn More

-  [Next.js Documentation](https://nextjs.org/docs)
-  [React Documentation](https://react.dev)
-  [Tailwind CSS](https://tailwindcss.com)
-  [TOTP RFC 6238](https://tools.ietf.org/html/rfc6238)
-  [JWT RFC 7519](https://tools.ietf.org/html/rfc7519)

---

**Built with ❤️ by [Amirul](https://github.com/amirulnubitel)**
