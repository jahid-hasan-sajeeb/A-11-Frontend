# ContestForge Client

ContestForge is a full-stack contest management platform frontend built with React, Tailwind CSS, local auth (no external provider), TanStack Query, and AOS animations.

## Live Site URL

- http://localhost:5173 (development)

## Key Features

- Home page with animated hero banner and backend-powered type search.
- Popular contests section sorted by participant count.
- All contests page with type tabs and pagination-ready API integration.
- Private contest details page with live countdown and submission modal.
- Contest registration payment flow (Stripe test mode with local mock fallback).
- Three-role dashboard UX: User, Creator, Admin.
- Admin panels for user role management and contest moderation.
- Leaderboard route ranked by dynamic win count.
- Extra navbar routes: Success Stories and Help Center.
- Dark/light theme toggle persisted in localStorage.
- Subtle page animations using AOS.
- Responsive design across mobile, tablet, and desktop.

## Stack

- React (Vite)
- Tailwind CSS (pure Tailwind)
- React Router
- TanStack Query
- React Hook Form
- Local mock authentication
- AOS (animations)
- Axios

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Environment Variables

Create a `.env` file with all keys from `.env.example`.
