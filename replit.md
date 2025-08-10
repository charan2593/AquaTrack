# Overview

AquaFlow is a comprehensive water purifier service management system built with React, Express, and PostgreSQL. The application provides a complete solution for managing water purifier services, customer data, inventory tracking, and business operations. It features a modern web interface with real-time dashboard analytics, customer management, service scheduling, rent collection tracking, and inventory management capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is being migrated from React to Angular 17+ with TypeScript following a component-based architecture. The UI layer utilizes Angular Material components providing a consistent and accessible design system with Material Design 3 principles. The application employs Angular Router for client-side routing with lazy loading and guards for authentication. State management is handled through Angular services and RxJS observables for reactive programming patterns.

The frontend implements a responsive design using Angular Material themes with a custom winter-themed color palette. Chart.js is integrated for data visualization, providing interactive charts for dashboard analytics and reporting. The application structure follows Angular's recommended organization with standalone components, services, and feature modules.

## Backend Architecture
The server-side follows a RESTful API architecture built with Express.js and TypeScript. The application uses a layered architecture pattern with clear separation between routes, business logic (storage layer), and data access. Authentication is implemented using Replit's OpenID Connect integration with Passport.js, providing secure user authentication and session management.

The backend implements comprehensive CRUD operations for all major entities (customers, services, inventory, purchases) through a well-defined API interface. Error handling is centralized with proper HTTP status codes and error responses. The server includes middleware for request logging, JSON parsing, and authentication verification.

## Data Storage Solutions
PostgreSQL serves as the primary database, chosen for its reliability and support for complex queries. Drizzle ORM provides type-safe database interactions with automatic TypeScript inference from the schema definitions. The database schema includes tables for users, customers, services, rent dues, purchases, inventory items, and session storage.

Database migrations are managed through Drizzle Kit, ensuring consistent schema evolution across environments. Connection pooling is implemented using Neon's serverless PostgreSQL driver, optimizing performance and connection management.

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