# Copilot Instructions for Vind

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is "Vind" - a modern remake of Vine built with Next.js, TypeScript, and Tailwind CSS. The app features short-form video content with modern social media functionality.

## Key Features to Implement
- Short video uploads (6-15 seconds)
- Infinite scroll feed with autoplay
- User authentication and profiles
- Social interactions (likes, comments, shares)
- Video recording/upload capabilities
- Modern responsive UI/UX
- Real-time features

## Tech Stack
- **Frontend**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks and context
- **Media Handling**: HTML5 video, file upload APIs
- **Authentication**: NextAuth.js (to be added)
- **Database**: Local storage for prototype, can scale to MongoDB/PostgreSQL

## Code Style Guidelines
- Use functional components with hooks
- Implement proper TypeScript types
- Follow Tailwind utility-first approach
- Create reusable components
- Implement proper error handling
- Use modern React patterns (Suspense, Error Boundaries)
- Prioritize mobile-first responsive design

## Component Structure
- Keep components small and focused
- Use custom hooks for complex logic
- Implement proper loading and error states
- Create a design system with consistent spacing and colors
- Use semantic HTML for accessibility
