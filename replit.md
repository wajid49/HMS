# Hotel Management System

## Overview

This is a frontend hotel management application that allows users to browse available rooms, make bookings, and view existing reservations. The system provides a simple booking interface with room selection, guest information collection, and booking management capabilities. Built as a static web application using vanilla JavaScript, Bootstrap 5, and client-side data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- Pure vanilla JavaScript (no frameworks)
- Bootstrap 5 for UI components and responsive design
- Bootstrap Icons for iconography
- Client-side only architecture with no backend server

**Application Structure**
- Multi-page application (MPA) with three main pages:
  - `index.html` - Landing/home page with hero section
  - `rooms.html` - Room browsing and booking initiation
  - `bookings.html` - View and manage all bookings
- Shared navigation across all pages using Bootstrap navbar component
- Centralized JavaScript in `app.js` for booking logic and modal management

**State Management**
- Client-side state stored in browser's localStorage
- Global variables for current booking context (`currentRoomType`, `currentRoomPrice`)
- Modal instances managed via Bootstrap's JavaScript API
- Bookings persisted as JSON in localStorage

**UI/UX Patterns**
- Modal-based booking flow using Bootstrap modals
- Form validation for check-in/check-out dates with dynamic min date constraints
- Responsive card-based layout for room display
- Table-based booking list with action buttons
- Real-time price calculation based on date selection

**Data Flow**
1. User selects room → Opens booking modal with pre-filled room details
2. User fills form → Validates dates and calculates total
3. On submission → Saves to localStorage and redirects to bookings page
4. Bookings page → Loads from localStorage and renders table

**Date Handling**
- Check-in date minimum set to current date
- Check-out date minimum dynamically set based on check-in selection
- Price calculation based on number of nights between dates

## External Dependencies

### UI Framework & Components
- **Bootstrap 5.3.0** (via CDN)
  - CSS framework for responsive layout
  - JavaScript components for modals, navbar, and interactive elements
  - Grid system for responsive design

### Icon Library
- **Bootstrap Icons 1.10.0** (via CDN)
  - Icon set for UI elements (building, check-circle, info-circle, etc.)

### Browser APIs
- **localStorage** - Client-side data persistence for bookings
- **Date API** - Date validation and calculation for booking periods

### Current Limitations
- No backend server or API endpoints
- No database - all data stored in browser localStorage
- No user authentication or session management
- No payment processing integration
- Data exists only in user's browser (not shared across devices)

**Note**: This application is currently frontend-only. Future enhancements may include backend API integration, database persistence (potentially using Drizzle ORM), user authentication, and payment gateway integration.