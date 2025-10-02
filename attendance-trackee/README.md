# 🚀 Attendance Tracker - Development Guide

This is the main React application for the Attendance Tracker system. This README focuses on development setup and technical details.

## 🔧 Development Setup

### Prerequisites
- Node.js 16+ (recommended: 18+)
- npm or yarn
- Backend API server running

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment configuration**
   ```bash
   # Create .env file
   VITE_BACKEND_URL=http://localhost:3000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open application**
   - Navigate to `http://localhost:5173`
   - Default login: `admin` / `admin` (Global Admin)

## 🏗️ Architecture Overview

### Component Structure
```
src/
├── api.ts              # Axios configuration & API calls
├── types.ts            # TypeScript interfaces
├── components/         # Reusable UI components
├── contexts/           # React Context providers
├── pages/             # Route-level components
└── assets/            # Static files
```

### Key Features

#### Authentication System
- **JWT-based authentication** with automatic token refresh
- **Role-based access control** (Global Admin, Vertical Head)
- **Protected routes** with context-aware navigation
- **Secure session management** with automatic logout

#### Global Admin Features
- Create and manage vertical head accounts
- View system-wide attendance analytics
- Export attendance data to Excel format
- Access comprehensive user management

#### Vertical Head Features
- Create and manage meetings for their vertical
- Add team members to their vertical
- Mark attendance with real-time updates
- View meeting history and statistics
- Bulk attendance operations

## 🛠️ Development Scripts

```bash
# Development with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend API URL (required)
VITE_BACKEND_URL=http://localhost:3000

# Debug mode (optional)
VITE_DEBUG=false
```

### Build Configuration
- **Vite**: Modern build tool with Rolldown bundler
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing pipeline

## 🎨 Styling Guidelines

### Tailwind CSS Classes
```tsx
// Consistent spacing and colors
className="p-4 bg-white rounded-lg shadow-md"

// Responsive design
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Interactive states
className="hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
```

### Material-UI Integration
```tsx
import { Button, TextField, Dialog } from '@mui/material';

// Consistent theme usage
<Button variant="contained" color="primary">
  Create Meeting
</Button>
```

## 📡 API Integration

### Authentication Endpoints
```typescript
// Login
POST /auth/globaladmin/login
POST /auth/verticalhead/login

// Logout
POST /auth/globaladmin/logout
POST /auth/verticalhead/logout
```

### Core Operations
```typescript
// Meeting management
GET /verticalhead/meetings
POST /verticalhead/meetings
PUT /verticalhead/attendance/:meetingId

// User management
POST /globaladmin/verticalleads/create
GET /globaladmin/verticalleads
POST /verticalhead/members/add
```

### Error Handling
```typescript
// Global error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle authentication errors
    }
    return Promise.reject(error);
  }
);
```

## 🧪 Testing

### Component Testing
```bash
# Add testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Type Safety
```typescript
// Strict TypeScript configuration
interface Meeting {
  id: string;
  name: string;
  date: string;
  attendance: AttendanceRecord[];
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
# Outputs to dist/ directory
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🐛 Debugging

### Development Tools
- **React DevTools**: Component inspection
- **Redux DevTools**: State management (if added)
- **Network Tab**: API call monitoring
- **Console Logging**: Strategic debug points

### Common Issues
1. **CORS errors**: Check backend CORS configuration
2. **Authentication failures**: Verify JWT token handling
3. **Build errors**: Check TypeScript strict mode settings

## 🔄 State Management

### Context API Usage
```typescript
// AuthContext provides global authentication state
const { user, isAuthenticated, login, logout } = useAuth();

// Protected route implementation
<ProtectedRoute allowedRoles={['vertical_head']}>
  <VerticalHeadDashboard />
</ProtectedRoute>
```

## 📱 Responsive Design

### Breakpoint Strategy
```css
/* Mobile-first approach */
.container {
  @apply w-full px-4;
}

/* Tablet and up */
@screen md {
  .container {
    @apply px-6 max-w-4xl mx-auto;
  }
}

/* Desktop */
@screen lg {
  .container {
    @apply px-8 max-w-6xl;
  }
}
```

## 🔗 Related Documentation

- [Backend API Documentation](../backend/README.md)
- [Deployment Guide](./docs/deployment.md)
- [Component Library](./docs/components.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
