# Overview

AquaFlow is a comprehensive water purifier service management system built with React, Express, and MySQL. The application is deployment-ready with full functionality tested and working, including customer management, service scheduling, role-based authentication, and dashboard analytics. Ready for production deployment using Replit's infrastructure with custom subdomain integration for professional business use. The application provides a complete solution for managing water purifier services, customer data, inventory tracking, and business operations. It features a modern web interface with real-time dashboard analytics, customer management, service scheduling, rent collection tracking, and inventory management capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built with React 18+ and TypeScript following a component-based architecture. The UI layer utilizes Radix UI components with Tailwind CSS providing a consistent and accessible design system with custom winter-themed styling. The application employs Wouter for client-side routing with protected routes for authentication. State management is handled through React Query for server state and React Context for UI state management.

The frontend implements a responsive design using a custom sidebar layout system with proper mobile responsiveness. Chart.js is integrated for data visualization, providing interactive charts for dashboard analytics and reporting. The application structure follows modern React patterns with custom hooks, context providers, and reusable components.

## Backend Architecture
The server-side follows a RESTful API architecture built with Express.js and TypeScript. The application uses a layered architecture pattern with clear separation between routes, business logic (storage layer), and data access. Authentication is implemented using Replit's OpenID Connect integration with Passport.js, providing secure user authentication and session management.

The backend implements comprehensive CRUD operations for all major entities (customers, services, inventory, purchases) through a well-defined API interface. Error handling is centralized with proper HTTP status codes and error responses. The server includes middleware for request logging, JSON parsing, and authentication verification.

## Data Storage Solutions
MySQL (hosted on Hostinger) serves as the primary database with connection string mysql://u866935527_phw_2025:password@82.25.121.32:3306/u866935527_purehomewaters. The database is fully operational with all tables created and tested. User authentication, customer management, service scheduling, and inventory tracking are all functional with real data operations confirmed. Drizzle ORM provides type-safe database interactions with automatic TypeScript inference from the schema definitions. The database schema includes tables for users, customers, services, rent dues, purchases, inventory items, and session storage.

Database migrations are managed through Drizzle Kit with environment-aware configuration. Connection pooling is implemented using Neon's serverless PostgreSQL driver with optimized settings per environment (dev: 1-5 connections, prod: 2-10 connections). The system automatically validates environment configuration on startup and provides comprehensive logging.

## Authentication and Authorization
The application implements role-based authentication using mobile number/password credentials with scrypt hashing for enhanced security. User sessions are stored in PostgreSQL using connect-pg-simple, providing persistent session management. The system supports multiple user roles (admin, manager, service boy) with comprehensive role-based access controls:

- **Admin**: Full access to all features including User Management and Inventory Dashboard
- **Manager**: Access to Service Management features but restricted from User Management and Inventory Dashboard  
- **Service Boy**: Read-only access to Dashboard, Customer List, and Today's Services only (no User Management, Inventory, or financial operations)

Express.js with Passport.js local strategy handles authentication flow. Role-based restrictions are implemented at both API endpoints (403 forbidden responses) and UI level (menu items hidden based on user role). All user creation is admin-managed with no public registration.

## External Dependencies
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Express.js**: Backend API server with custom username/password authentication
- **Radix UI**: Accessible component library for React applications
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Chart.js**: Data visualization library for dashboard charts and analytics
- **React Query**: Data fetching and server state management for React
- **Wouter**: Lightweight client-side routing library for React
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support

The application follows a monorepo structure with shared TypeScript definitions, enabling type safety across the full stack. Build tooling includes Vite for frontend bundling with ESBuild for backend compilation, providing fast development and production builds.