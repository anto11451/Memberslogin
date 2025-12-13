# Cap's Fitness Website

A premium, app-like fitness coaching website with a dark mode neon fitness theme, client intake, pricing, about, blog functionality, and interactive fitness tools.

## Recent Changes (November 2025)
- Complete dark mode neon theme redesign with cyan/green primary colors and purple/pink accents
- Added Orbitron display font for "FITNESS" branding, Inter for body text
- New pages: Fitness Calculators (/calculators), Knowledge Hub (/knowledge), Body Quiz (/quiz)
- Added shared components: Navbar, Footer, NeonCard, PageWrapper
- Updated all existing pages with new neon styling and animations

## Features

### 1. Landing Page (/)
- Dark neon-themed hero section with animated gradient backgrounds
- Neon glow effects on buttons and interactive elements
- Navigation cards leading to all sections
- Feature highlights with icons

### 2. Fitness Tools & Calculators (/calculators)
- **BMI Calculator** - Body Mass Index with weight status interpretation
- **Body Fat % Calculator** - US Navy method calculation
- **TDEE Calculator** - Total Daily Energy Expenditure based on activity level
- **Ideal Weight Calculator** - Recommended weight range
- **Protein Intake Calculator** - Daily protein needs based on goals

### 3. Knowledge Hub (/knowledge)
- Categorized fitness learning content
- Topics: Nutrition, Workouts, Recovery, Lifestyle, Science
- Article cards with icons and descriptions
- Expandable content sections

### 4. Interactive Body Quiz (/quiz)
- Multi-step fitness assessment
- Questions about goals, experience, preferences, challenges
- Progress tracking
- Personalized recommendations based on answers

### 5. Client Intake Form (/intake)
- 5-step multi-page form with progress indicator
- **Step 1: Personal Details** - Name, age, gender, phone, email
- **Step 2: Body & Lifestyle** - Height, weight, sleep, sitting hours, stress level, activity level
- **Step 3: Health Information** - Medical conditions, medications, surgeries, doctor consultation
- **Step 4: Goals & Training** - Primary goal, training style, days per week, equipment
- **Step 5: Nutrition** - Eating pattern, foods loved/avoided, notes
- **Review Page** - Summary with edit buttons
- **Success Page** - Confirmation with neon animations
- Form data posted to Google Sheets via Apps Script API

### 6. Pricing Page (/pricing)
- Three coaching tiers with neon card styling
- Feature comparison with checkmarks
- Call-to-action buttons with glow effects
- Custom plan inquiry section

### 7. About Page (/about)
- Company mission and story
- Core values with neon icons
- Why Choose Us section
- CTA with glow effects

### 8. Fitness Blog (/blog)
- Displays all published blog posts
- Neon-styled cards with category badges
- Admin dashboard access

### 9. Admin Dashboard (/admin)
- Create new blog posts
- Manage published posts
- Delete functionality
- Login authentication (/admin-login)

## Design Theme

### Colors
- **Background**: #0a0f1a (dark navy)
- **Primary**: #00ff88 (neon green/cyan)
- **Accent**: #a855f7 (purple)
- **Secondary accents**: Pink, cyan gradients

### Typography
- **Display font**: Orbitron (for "FITNESS" branding)
- **Body font**: Inter

### Effects
- Neon glow on buttons and cards
- Animated gradient backgrounds
- Pulse animations on key elements
- Smooth transitions and hover effects

## Technical Stack

### Frontend
- React with TypeScript
- Wouter for routing
- Tailwind CSS + Shadcn UI components
- Framer Motion for animations
- TanStack Query for data fetching

### Backend
- Express.js API
- In-memory storage for blog posts
- Google Sheets integration for intake form

### API Endpoints
- `POST /api/submit-intake` - Submit intake form to Google Sheets
- `GET /api/blog-posts` - Fetch all blog posts
- `GET /api/blog-posts/:id` - Fetch single blog post
- `POST /api/blog-posts` - Create new blog post
- `DELETE /api/blog-posts/:id` - Delete blog post

## Environment Variables
- `GOOGLE_SHEETS_API_URL` - Google Apps Script endpoint for intake submissions
- `GOOGLE_SHEETS_API_SECRET` - Secret key for authentication

## Component Structure
- `/components/Navbar.tsx` - Navigation with neon styling
- `/components/Footer.tsx` - Contact info and links
- `/components/NeonCard.tsx` - Reusable neon-styled card
- `/components/PageWrapper.tsx` - Layout wrapper with Navbar/Footer
- `/pages/*` - All page components

## User Preferences
- Keep all backend/API functionality unchanged
- Only update UI/styling, no logic changes to existing functionality
- Dark mode neon theme is the primary design direction

## Getting Started
1. Update `GOOGLE_SHEETS_API_URL` environment variable with your Apps Script URL
2. Run `npm run dev` to start development server
3. Visit homepage to navigate to different sections
4. Use /admin to manage blog posts
5. Complete intake form to test Google Sheets integration
