# Overview

AquaFlow is a comprehensive water purifier service management system built with Angular, Node.js/Express, and PostgreSQL. The application provides a complete solution for managing water purifier services, customer data, inventory tracking, and business operations. It features a modern web interface with real-time dashboard analytics, customer management, service scheduling, rent collection tracking, and inventory management capabilities with username/password authentication.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using Angular 18+ with TypeScript and follows a component-based architecture with standalone components. The UI implements a custom winter-themed design system with consistent styling across the application. The application employs Angular Router for client-side routing and HttpClient for API communications with interceptors for authentication.

The frontend implements a responsive design using CSS custom properties with a custom winter-themed color palette. Chart.js is integrated for data visualization, providing interactive charts for dashboard analytics and reporting. The application structure follows Angular's recommended patterns with services, guards, and interceptors for cross-cutting concerns.

## Backend Architecture
The server-side follows a RESTful API architecture built with Express.js and TypeScript. The application uses a layered architecture pattern with clear separation between routes, business logic (storage layer), and data access. Authentication is implemented using Replit's OpenID Connect integration with Passport.js, providing secure user authentication and session management.

The backend implements comprehensive CRUD operations for all major entities (customers, services, inventory, purchases) through a well-defined API interface. Error handling is centralized with proper HTTP status codes and error responses. The server includes middleware for request logging, JSON parsing, and authentication verification.

## Data Storage Solutions
PostgreSQL serves as the primary database, chosen for its reliability and support for complex queries. Drizzle ORM provides type-safe database interactions with automatic TypeScript inference from the schema definitions. The database schema includes tables for users, customers, services, rent dues, purchases, inventory items, and session storage.

Database migrations are managed through Drizzle Kit, ensuring consistent schema evolution across environments. Connection pooling is implemented using Neon's serverless PostgreSQL driver, optimizing performance and connection management.

## Authentication and Authorization
The application implements JWT-based authentication with username/password credentials. User credentials are securely hashed using bcryptjs and stored in PostgreSQL. The system supports multiple user roles (admin, manager, technician) with role-based access controls implemented at both the API and UI levels.

JWT tokens are used for session management with automatic token validation through HTTP interceptors. Authentication state is managed client-side through Angular services with guards protecting routes that require authentication.

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