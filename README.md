# Profile Management Application

This is a full-stack web application for user registration, authentication, and profile management with the following features:

## Features
- User registration with username, email and password
- Secure login system with password hashing
- Profile management (create, update, view)
- Responsive UI with toast notifications
- Support for both local development and server deployment

## Architecture

### Client-side (Frontend)
- Hosted on Netlify or other static hosting
- HTML/CSS/JavaScript frontend
- Local storage for UI state
- Toast notifications for user feedback

### Server-side (Backend)
- Node.js/Express API server
- Secure user authentication
- Database storage for users and profiles
- RESTful API endpoints

## Setup for Development

### Frontend (Static Hosting)
1. Clone the repository
2. Modify `app/config.js` to point to your backend:
   ```javascript
   API_BASE_URL: 'http://localhost:3000' // for local development
   ```
   or
   ```javascript
   API_BASE_URL: 'https://your-deployed-backend.onrender.com' // for deployed backend
   ```

### Backend (API Server)
1. Run the backend server:
   ```bash
   npm run backend
   ```
   or for development with auto-restart:
   ```bash
   npm run backend-dev
   ```

## Deployment

### Frontend Deployment (Netlify)
Deploy the frontend files to Netlify (index.html, login.html, profile.html, registration.html, styles.css, app/ folder).

### Backend Deployment (Railway)
For production deployment of the backend API to Railway, follow the instructions in DEPLOY_INSTRUCTIONS.md

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Profiles
- `GET /api/profiles/:userId` - Get user profiles
- `POST /api/profiles` - Create profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

## Security
- Passwords are hashed using bcrypt
- CORS configured for cross-origin requests
- Input validation on both client and server

## Technologies Used
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: PostgreSQL (compatible with Railway)
- Security: bcrypt for password hashing
- Deployment: Netlify (frontend), Railway/Render/Heroku (backend)
