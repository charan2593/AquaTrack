# Overview

AquaFlow is a comprehensive water purifier service management system built with React, Express, and PostgreSQL. The application provides a complete solution for managing water purifier services, customer data, inventory tracking, and business operations. It features a modern web interface with real-time dashboard analytics, customer management, service scheduling, rent collection tracking, and inventory management capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React 18 with TypeScript and follows a component-based architecture. The UI layer utilizes shadcn/ui components built on top of Radix UI primitives, providing a consistent and accessible design system. The application employs Wouter for client-side routing, offering a lightweight alternative to React Router. State management is handled through TanStack Query (React Query) for server state synchronization and caching, eliminating the need for complex global state management solutions.

The frontend implements a responsive design using Tailwind CSS with a custom winter-themed color palette. Chart.js is integrated for data visualization, providing interactive charts for dashboard analytics and reporting. The application structure follows a feature-based organization with shared components, hooks, and utilities.

## Backend Architecture
The server-side follows a RESTful API architecture built with Express.js and TypeScript. The application uses a layered architecture pattern with clear separation between routes, business logic (storage layer), and data access. Authentication is implemented using Replit's OpenID Connect integration with Passport.js, providing secure user authentication and session management.

The backend implements comprehensive CRUD operations for all major entities (customers, services, inventory, purchases) through a well-defined API interface. Error handling is centralized with proper HTTP status codes and error responses. The server includes middleware for request logging, JSON parsing, and authentication verification.

## Data Storage Solutions
PostgreSQL serves as the primary database, chosen for its reliability and support for complex queries. Drizzle ORM provides type-safe database interactions with automatic TypeScript inference from the schema definitions. The database schema includes tables for users, customers, services, rent dues, purchases, inventory items, and session storage.

Database migrations are managed through Drizzle Kit, ensuring consistent schema evolution across environments. Connection pooling is implemented using Neon's serverless PostgreSQL driver, optimizing performance and connection management.

## Authentication and Authorization
The application implements role-based authentication using Replit's OAuth 2.0 / OpenID Connect provider. User sessions are stored in PostgreSQL using connect-pg-simple, providing persistent session management. The system supports multiple user roles (admin, manager, technician) with role-based access controls implemented at both the API and UI levels.

Passport.js handles the OAuth flow with automatic user profile synchronization. Authentication state is managed client-side through React Query with automatic token refresh and logout handling.

## External Dependencies
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit Authentication**: OAuth 2.0 / OpenID Connect provider for user authentication
- **Radix UI**: Headless component library for accessible UI primitives
- **Chart.js**: Data visualization library for dashboard charts and analytics
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind
- **TanStack Query**: Server state management and data synchronization
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support

The application follows a monorepo structure with shared TypeScript definitions, enabling type safety across the full stack. Build tooling includes Vite for frontend bundling with ESBuild for backend compilation, providing fast development and production builds.