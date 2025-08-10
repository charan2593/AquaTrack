# Overview

AquaFlow is a comprehensive water purifier service management system built with React, Express, and PostgreSQL. The application provides a complete solution for managing water purifier services, customer data, inventory tracking, and business operations. It features a modern web interface with real-time dashboard analytics, customer management, service scheduling, rent collection tracking, and inventory management capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is a hybrid system with both React and Angular implementations available. The primary React application uses Vite build system with TypeScript and provides a complete water purifier service management interface. An Angular 17+ implementation is being developed in parallel in the `angular-client` directory with TypeScript, standalone components, and Material Design.

The React frontend utilizes shadcn/ui components with Tailwind CSS for consistent design, providing dashboard analytics, customer management, service scheduling, inventory tracking, and authentication. The Angular version follows Material Design 3 principles with Angular Material components and employs Angular Router for routing with lazy loading and authentication guards.

Both implementations share the same backend API and authentication system, allowing for seamless switching between frameworks for development and testing purposes.

## Backend Architecture
The server-side follows a RESTful API architecture built with Express.js and TypeScript. The application uses a layered architecture pattern with clear separation between routes, business logic (storage layer), and data access. Authentication is implemented using Replit's OpenID Connect integration with Passport.js, providing secure user authentication and session management.

The backend implements comprehensive CRUD operations for all major entities (customers, services, inventory, purchases) through a well-defined API interface. Error handling is centralized with proper HTTP status codes and error responses. The server includes middleware for request logging, JSON parsing, and authentication verification.

## Data Storage Solutions
PostgreSQL serves as the primary database with separate development and production environments for data isolation and safe development practices. Drizzle ORM provides type-safe database interactions with automatic TypeScript inference from the schema definitions. The database schema includes tables for users, customers, services, rent dues, purchases, inventory items, and session storage.

Database migrations are managed through Drizzle Kit with environment-aware configuration. Connection pooling is implemented using Neon's serverless PostgreSQL driver with optimized settings per environment (dev: 1-5 connections, prod: 2-10 connections). The system automatically validates environment configuration on startup and provides comprehensive logging.

## Authentication and Authorization
The application implements role-based authentication using traditional username/password credentials with bcrypt hashing. User sessions are stored in PostgreSQL using connect-pg-simple, providing persistent session management. The system supports multiple user roles (admin, manager, technician) with role-based access controls implemented at both the API and UI levels.

Express.js with Passport.js local strategy handles authentication flow. Authentication state is managed client-side through Angular services with RxJS observables and HTTP interceptors for automatic session management.

## External Dependencies
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Express.js**: Backend API server with custom username/password authentication
- **Angular Material**: Material Design component library for Angular
- **Chart.js**: Data visualization library for dashboard charts and analytics
- **RxJS**: Reactive programming library for Angular services and HTTP client
- **Angular CLI**: Build and development toolchain for Angular applications
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support

The application follows a monorepo structure with shared TypeScript definitions, enabling type safety across the full stack. Build tooling includes Vite for frontend bundling with ESBuild for backend compilation, providing fast development and production builds.