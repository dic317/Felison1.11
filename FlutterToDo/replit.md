# Financial Management Application (Felison FinTech)

## Overview

This is a premium FinTech application called "Felison" that provides comprehensive financial management tools. The application is built as a full-stack web application using React for the frontend and Express.js for the backend, with a focus on premium user experience through dark theme design and modern UI components.

## System Architecture

The application follows a full-stack architecture with clear separation between client and server:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Radix UI with shadcn/ui components for premium design
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful API with proper error handling
- **Session Management**: PostgreSQL-based session storage

### Data Storage Solution
- **Primary Database**: PostgreSQL hosted on Neon
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations with automatic schema generation
- **Fallback Storage**: In-memory storage class for development/demo purposes

## Key Components

### Core Features
1. **Financial Dashboard**: Central hub with news, quick stats, and navigation
2. **Transaction Management**: Full CRUD operations for income/expense tracking
3. **Calendar System**: Event scheduling and financial deadline management
4. **Financial Calculators**: Loan and investment calculation tools
5. **External Portal**: Integration hub for external financial services

### Database Schema
- **Users Table**: User authentication and financial profile data
- **Transactions Table**: Financial transaction records with categorization
- **Events Table**: Calendar events and financial appointments

### UI Component System
- Premium dark theme with glass morphism effects
- Comprehensive component library based on Radix UI primitives
- Custom animations and transitions for enhanced UX
- Responsive design optimized for both desktop and mobile

## Data Flow

1. **Client Requests**: Frontend makes API calls through TanStack Query
2. **API Processing**: Express.js routes handle business logic and validation
3. **Database Operations**: Drizzle ORM manages database interactions
4. **Response Handling**: Structured JSON responses with proper error codes
5. **State Updates**: TanStack Query manages cache invalidation and UI updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **zod**: Runtime type validation
- **wouter**: Lightweight routing solution

### UI Dependencies
- **@radix-ui/**: Complete set of UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety and development experience
- **drizzle-kit**: Database schema management

## Deployment Strategy

### Development Environment
- Vite development server with HMR (Hot Module Replacement)
- Express.js server with automatic restart
- Development-specific error overlays and debugging tools

### Production Build
- Vite production build with optimized bundling
- Express.js server compiled with esbuild
- Static asset serving from build directory
- Environment-based configuration management

### Vercel Deployment
- Frontend: Static React build served by Vercel
- Backend: Serverless functions in `/api` directory
- Database: External PostgreSQL (Neon/Supabase recommended)
- Configuration: `vercel.json` with routing setup
- Environment variables: DATABASE_URL, NODE_ENV

### Database Management
- Drizzle migrations for schema changes
- Environment-based database URL configuration
- Automatic schema validation and type generation

## User Preferences

Preferred communication style: Simple, everyday language.
Layout preference: Mobile-first design with 2x2 grid layout for navigation icons
Theme preference: Dark theme by default with light/dark theme toggle functionality
Language preference: Russian interface

## Recent Changes

- July 02, 2025: Converted layout to mobile-first design
- Removed Quick Overview section and footer components  
- Modified navigation grid to 2x2 layout (Calculator, Portal, Finances, Calendar)
- Added dark/light theme toggle button in header
- Optimized all pages for mobile screen format with max-width constraints
- Reduced component sizes and spacing for mobile viewing
- Updated news section to compact mobile-friendly format
- Fixed calculator functionality with vertical stacking layout to prevent text overflow
- Made calculator forms mobile-friendly with smaller text and better spacing
- Fixed calendar functionality with vertical stacking layout for mobile
- Made calendar events display properly with text truncation to prevent overflow
- Optimized add event dialog for mobile screens with smaller form controls
- Fixed finances functionality with vertical stacking layout for mobile
- Made financial stats cards display vertically instead of in grid
- Optimized transaction list for mobile with better text wrapping and smaller controls
- Fixed portal functionality with vertical stacking layout for mobile
- Made external service cards display vertically with text truncation
- Optimized quick access buttons for mobile with smaller controls and full width
- Removed Quick Access section from portal page as requested
- Translated entire application interface into Russian language
- Updated all page titles, navigation text, and component labels to Russian
- Completed Russian translation of all form components including transaction forms, calendar events, and calculator interfaces
- Translated financial terminology, buttons, placeholders, and result displays to Russian
- Localized calendar component with Russian month names and day abbreviations
- Configured calendar to start week on Monday as per Russian standard
- Updated date formatting to display in Russian locale format

## Changelog

Changelog:
- July 02, 2025. Initial setup
- July 02, 2025. Mobile layout conversion with theme toggle