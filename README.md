# Torba Text Storage App

## Enhanced with Modern UI Animations

This application has been enhanced with smooth animations and transitions using Framer Motion and shadcn-inspired components, demonstrating modern UI/UX principles.

### New Animation Features

- **Entrance Animations**: Cards, buttons, and content fade in with staggered timing
- **Interactive Animations**: Buttons have hover and tap effects, cards lift on hover
- **Form Animations**: Textarea has focus animations, submission feedback is animated
- **List Animations**: Text entries appear with smooth transitions when added or removed
- **Loading Animations**: Enhanced skeleton screens with improved visual feedback
- **Success/Error Animations**: Feedback messages have subtle entrance and exit animations
- **Accessibility Support**: Reduced motion preferences are respected

### Technologies Used

- **Framer Motion**: For advanced animations and motion effects
- **Tailwind CSS**: For styling with custom animation utilities
- **Custom Animation Utilities**: Reusable animation variants and components

### Components with Animations

- `AnimatedButton`: Enhanced button with hover and tap animations
- `AnimatedCard`: Card component with hover effects
- `AnimatedTextarea`: Textarea with focus animations
- `FadeIn` and `SlideIn`: Wrapper components for entrance animations
- `AnimatedSkeleton`: Enhanced loading state animations
- `Fireworks`: Spectacular fireworks animation for successful actions
- Dissolve animation for deleted items
- Custom CSS animation utilities for various effects

The animations are designed to enhance user experience without being distracting, following shadcn UI principles with added visual polish.



A Next.js application that allows users to save and retrieve text entries using PostgreSQL database.

## Features

- Input field for entering text
- Save button to store text in the database
- Display of previously entered text entries
- Timestamps for each entry

## Tech Stack

- Next.js 14 (with App Router)
- PostgreSQL (via Railway)
- Node.js

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string for Railway database

## Deployment to Railway

This app is designed for deployment on Railway. To deploy:

1. Connect your GitHub repository to Railway
2. Add your PostgreSQL database as a service on Railway
3. Set the `DATABASE_URL` environment variable to your Railway database connection string
4. Deploy the application

The application will automatically create the required database table on first run.

## Local Development

1. Install dependencies: `npm install`
2. Set up your PostgreSQL database and set the `DATABASE_URL` environment variable
3. Run the development server: `npm run dev`
