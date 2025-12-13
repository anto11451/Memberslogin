# Cap's Fitness Intake Website - Design Guidelines

## Design Approach: Reference-Based
**Primary Inspiration:** Apple Fitness + Nike Training Club + Whoop + Modern Coaching Apps
**Aesthetic:** Premium mobile-first fitness onboarding experience that feels like a native app, not a website

## Core Visual Direction

**Overall Feel:** Professional, motivating, friendly, smooth, and premium - a guided fitness intake experience, not a boring form

**Theme Options:** Purple-pink gradient aesthetic OR clean white modern UI (select based on what creates the most premium, app-like feel)

**Mobile-First:** This is primarily a mobile experience - design for mobile viewport first, then enhance for desktop

## Layout System

**Spacing Units:** Use Tailwind units of 4, 6, 8, 12, 16, 20, and 24 (p-4, p-6, m-8, gap-12, etc.)
- Tight spacing: 4-6 for inner component padding
- Standard spacing: 8-12 for section padding and gaps
- Generous spacing: 16-24 for major section separation

**Container Strategy:**
- Form steps: Max-width of 600px (max-w-2xl) centered on screen
- Landing page: Standard responsive containers (max-w-6xl)
- All content should feel contained and focused, not sprawling

## Typography Hierarchy

**Font Selection:** Use modern, clean sans-serif fonts from Google Fonts
- Primary: Inter or Poppins for headings and UI
- Secondary: Same family for body text

**Scale:**
- Hero headline: text-5xl to text-6xl, font-bold
- Section titles: text-3xl to text-4xl, font-semibold
- Step headers: text-2xl, font-semibold
- Form labels: text-sm to text-base, font-medium
- Input text: text-base
- Helper text/tooltips: text-sm, font-normal
- Micro-text (motivational): text-xs to text-sm, font-light

## Component Library

### Landing Page (Page 1)
**Hero Section:**
- Centered vertical layout
- Brand title "Cap's Fitness — Intake" - large, bold typography
- Sub-headline: "Fast onboarding — feels like an app." - medium weight
- Motivational micro-text - light, smaller
- Prominent "Start Now" CTA button - large, rounded, gradient or solid depending on theme
- Clean, uncluttered background (gradient or minimal abstract fitness imagery)
- Height: 80-90vh to create impact without forcing scroll

### Multi-Step Form (Page 2-6)
**Form Container:**
- Card-style containers with rounded corners (rounded-2xl)
- Elevated appearance with subtle shadows
- Clean white or semi-transparent background
- Padding: p-8 to p-12

**Step Indicator:**
- Positioned at top of form
- Progress bar or numbered dots showing 1→5
- Current step highlighted, completed steps marked
- Spacing: mb-8 to mb-12 below indicator

**Form Inputs:**
- Rounded inputs (rounded-lg to rounded-xl)
- Clear focus states
- Generous padding (p-4)
- Labels above inputs with mb-2 spacing
- Required field indicators (asterisk or badge)
- Error states with red accent
- Helper text below inputs (mt-1, text-sm)

**Input Types:**
- Text inputs: Clean, minimal border or subtle background
- Dropdowns: Custom styled to match app aesthetic
- Sliders: Modern track design with gradient fills
- Toggle switches: Rounded, smooth animations
- Multi-tag selectors: Chip-based UI with add/remove interactions
- Textareas: Larger rounded containers, min-height established

**Conditional Fields:**
- Medication/Surgery details: Slide in smoothly when toggle activated
- Equipment selection: Dynamic grid based on training style selection
- Tooltips for Activity Level: Hover/tap to reveal info - subtle info icon

**Navigation:**
- "Next" and "Back" buttons at bottom
- "Next" primary (gradient or solid bold)
- "Back" secondary (ghost or outline style)
- Button spacing: gap-4 between them
- Full width on mobile, max-width on desktop

### Review Page (Final Step)
**Summary Layout:**
- Organized sections matching form steps
- Each section as a card with rounded borders
- Key-value pairs clearly formatted
- Spacing between sections: gap-6
- "Submit" button - prominent, gradient, large
- Edit functionality to return to specific steps

**Success State:**
- Large checkmark icon (green)
- Success message: "We'll contact you soon"
- Clean, centered layout
- Motivational closing message

## Animations & Transitions

**Form Transitions:**
- Step changes: Smooth fade and slide (300-400ms)
- Conditional field reveals: Slide down with fade-in
- Input focus: Subtle scale or glow effect
- Button interactions: Slight scale on press (mobile)

**Avoid:** Excessive animations that slow down the form completion

## Images

**Landing Page Hero:**
- Abstract fitness imagery or gradient background (not photo-heavy)
- If image used: Subtle overlay to ensure text readability
- Image should support brand feel without being distracting

**No images in form steps** - Keep form focused and fast

**Success Page:**
- Optional: Celebratory icon or minimal illustration

## UI Patterns

**Cards:** Consistent rounded corners (rounded-2xl), subtle shadows (shadow-lg), clean backgrounds

**Buttons:**
- Primary CTA: Large (px-8 py-4), rounded-full or rounded-xl, gradient or bold solid
- Secondary: Outline style or ghost, same rounding
- All buttons: font-semibold text

**Form Fields:**
- Consistent height (h-12 to h-14)
- Consistent rounding (rounded-lg to rounded-xl)
- Clear active/focus states

**Tags/Chips:**
- Rounded-full design
- Small padding (px-4 py-2)
- Close icon for removable tags
- Grid or flex layout with gap-2

## Accessibility

- All inputs have associated labels
- Required fields clearly marked
- Error messages descriptive and immediate
- Focus states visible and consistent
- Touch targets minimum 44x44px on mobile
- Sufficient contrast ratios throughout

## Responsive Behavior

**Mobile (default):**
- Single column layouts
- Full-width inputs
- Stacked buttons
- Comfortable padding (p-6 to p-8)

**Desktop (md: and up):**
- Form container centered with max-width
- Wider padding (p-12)
- Multi-column for review summary (grid-cols-2)
- More generous spacing overall