# Cap's Fitness - Premium Fitness Dashboard

## Overview

Cap's Fitness is a comprehensive fitness web application combining a public marketing website with a members-only dashboard. The platform provides interactive body mapping for exercise exploration, workout tracking, nutrition planning, streak monitoring, and progress visualization. Users authenticate against Google Sheets as the primary data backend, with member data, workouts, programs, and progress all synced through a Google Apps Script API endpoint.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (December 2025)

### API Integration Complete
All dashboard pages now sync with Google Sheets API instead of mock data:
- **WorkoutsPage**: Fetches exercises from Global_Workouts sheet with category filters (Legs, Arms, Cardio, Stretching)
- **PlansPage**: Loads programs from Programs sheet with day-wise detailed schedule
- **ProfilePage**: Reads/writes user data directly from Users sheet
- **NutritionPage**: Syncs food entries to User_Progress sheet for authenticated users
- **AdminPage**: Full user management with correct credentials (iamcap / Sunshine@123)
- **Dashboard**: Removed Protein Goal and Your Plan cards, syncs with API

### Bug Fixes
- Fixed Workout Partner countdown bug where "3, 2, 1" voice was cut off before transitions
- Added 1.5 second delay and "Go!" voice cue after countdown
- Fixed date parsing errors in ProgressPage

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript using functional components and hooks

**Routing**: Wouter handles client-side navigation between public marketing pages (Home, About, Pricing, Blog, Calculators, Knowledge, Quiz) and authenticated dashboard routes (Dashboard, Workouts, Plans, Nutrition, Progress, Profile, Streak, Body Map, Admin)

**State Management**:
- React Context API manages authentication state (user login, admin access)
- TanStack Query handles server state and API caching
- Local storage persists user-specific data like weight history and streak records

**UI System**:
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS with custom neon theme (dark background, green/cyan primary, purple accents)
- Framer Motion for page transitions and micro-animations
- Custom fonts: Orbitron (display), Outfit (body), Rajdhani (monospace)

**Key Features**:
- Interactive SVG body map with clickable muscle groups linking to exercises
- Multi-step intake form with validation and progress tracking
- Fitness calculators (BMI, TDEE, body fat, protein requirements)
- Daily streak tracking with calendar visualization
- Workout partner mode with timer and exercise guidance

### Backend Architecture

**Server**: Express.js with TypeScript serving both API routes and static files

**Build System**:
- Vite bundles the React frontend
- esbuild compiles the Express server for production
- Custom build script in `script/build.ts` handles the full pipeline

**API Design**: RESTful endpoints under `/api` prefix for authentication and data operations

**Data Layer**:
- Primary data storage via Google Sheets accessed through Google Apps Script web app
- Drizzle ORM configured for PostgreSQL (schema defined but Google Sheets is the active backend)
- In-memory storage class for session/user management on the server side

### Authentication Flow

Users authenticate by validating credentials against the Google Sheets "Users" sheet. The Apps Script endpoint handles login verification and returns user profile data. Admin access uses separate hardcoded credentials for the admin panel.

### Data Synchronization

All member data flows through the Google Apps Script API:
- **Endpoint**: `https://script.google.com/macros/s/AKfycbyaOcyGLPkxYEN2EeQRH0PaIsxxQdek8t4zhb2gfe2lWdtE7wya2llV8Etw1ZmlixPQ/exec`
- **Operations**: User login, profile updates, progress tracking, streak logging, nutrition submission
- **Sheet Structure**: Users, Progress, Streaks, Global_Workouts, Programs, Recipes

## External Dependencies

### Google Sheets API (Primary Backend)
- Google Apps Script web app deployed as public API
- Manages all user data, workouts, programs, and tracking
- Sheet ID: `1u85NPq9HJQkWPs4kq2HFNbZ0wzHVcbInSCMXU1GW5yw`

### Database (Future/Alternate)
- PostgreSQL via Drizzle ORM (configured in `drizzle.config.ts`)
- Schema defined in `shared/schema.ts` for users table
- Currently not the primary data source - Google Sheets handles data

### Third-Party Libraries
- **UI**: Radix UI primitives, Tailwind CSS, Framer Motion, Recharts (charts)
- **State**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Build Tools**: Vite, esbuild, TypeScript

### Replit Integration
- Runtime error overlay plugin for development
- Cartographer and dev banner plugins in non-production
- Meta images plugin for OpenGraph tag management

### External Services Ready
- Stripe integration (dependency present, implementation ready)
- Nodemailer for email (dependency present)
- OpenAI/Gemini AI integration (dependencies present)