# CMMS Backend Server

This is the backend server for the CMMS (Computerized Maintenance Management System) Dashboard. It provides RESTful APIs for managing departments, assets, locations, and other maintenance-related data.

## Features

- **Department Management**: CRUD operations for organizational departments
- **MongoDB Integration**: Uses MongoDB with Mongoose ODM
- **Data Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Robust error handling with detailed error responses
- **Security**: Helmet, CORS, and rate limiting for security
- **TypeScript**: Full TypeScript support for type safety

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the server root directory with the following variables:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/cmms-dashboard
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Frontend Configuration
   FRONTEND_URL=http://localhost:3000
   
   # Security Keys
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

## Development

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000` with hot reload enabled.

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Start production server:**
   ```bash
   npm start
   ```

## API Endpoints

### Departments API

- **GET** `/api/departments` - Get all departments with pagination and filtering
  - Query parameters: `page`, `limit`, `search`, `status`, `sortBy`, `sortOrder`
- **GET** `/api/departments/:id` - Get department by ID
- **POST** `/api/departments` - Create new department
- **PUT** `/api/departments/:id` - Update department
- **DELETE** `/api/departments/:id` - Delete department
- **GET** `/api/departments/stats` - Get department statistics

### Health Check

- **GET** `/health` - Server health check

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts        # Database configuration
│   ├── controllers/
│   │   └── departmentController.ts  # Department business logic
│   ├── middleware/
│   │   └── departmentValidation.ts  # Input validation
│   ├── models/
│   │   └── Department.ts      # MongoDB Department model
│   ├── routes/
│   │   └── departmentRoutes.ts # Department API routes
│   └── index.ts               # Main server file
├── dist/                      # Compiled JavaScript files
├── package.json
├── tsconfig.json
└── README.md
```

## Data Models

### Department
```typescript
{
  id: string
  name: string
  description: string
  manager: string
  employeeCount: number
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // For validation errors
}
```

## Contributing

1. Follow TypeScript best practices
2. Add proper validation for new endpoints
3. Include error handling for all operations
4. Update this README for new features

## Future Enhancements

- Authentication and authorization
- Asset management APIs
- Location management APIs
- Maintenance work order APIs
- Inventory management APIs
- Reporting APIs 