# React + Node.js Employee Management System

A full-stack application for managing employees with authentication, built with React and Node.js/Express.

## 📋 Features

- ✅ User authentication with JWT tokens
- ✅ Employee data management (CRUD operations)
- ✅ Protected routes with role-based access
- ✅ SQL Server database integration
- ✅ Responsive system design UI
- ✅ Environment-based configuration

## 🏗️ Project Structure

```
reactForAbed/
├── server/
│   ├── client/                    # React frontend
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Login.js
│   │   │   │   ├── Login.css
│   │   │   │   ├── Employees.js
│   │   │   │   └── Employees.css
│   │   │   ├── App.js             # Main routing component
│   │   │   └── index.js
│   │   ├── public/
│   │   └── package.json
│   ├── .env                       # Environment variables
│   ├── .gitignore                 # Git ignore file
│   ├── server.js                  # Express server entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ 
- **npm** or **yarn**
- **SQL Server** (local or remote)

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd reactForAbed/server
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

### Configuration

Create/update `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=2h

# Database Configuration
DB_USER=sa
DB_PASSWORD=your_password
DB_SERVER=localhost
DB_NAME=UAE_PayData
DB_ENCRYPT=false
DB_TRUST_CERT=true

# API Configuration
API_BASE_URL=http://localhost:5000
```

**⚠️ Important:**
- Change `JWT_SECRET` to a strong random string in production
- Never commit `.env` file to version control (already in `.gitignore`)

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd server/client
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Production Build

Build the React app for production:
```bash
cd server/client
npm run build
```

The optimized files will be in the `build/` directory.

## 🔐 Authentication

### Login
- **Endpoint:** `POST /api/login`
- **Body:** `{ "username": "admin", "password": "1234" }`
- **Response:** `{ "token": "jwt_token_here" }`

### Demo Credentials
- **Username:** admin
- **Password:** 1234

## 📡 API Endpoints

### Login
```
POST /api/login
Content-Type: application/json

Body: { "username": "admin", "password": "1234" }
Response: { "token": "eyJhbGc..." }
```

### Get Employees (Protected)
```
GET /api/employees
Authorization: Bearer {token}

Response: [
  { "empPSC": "EMP001", "empTagId": "TAG001" },
  { "empPSC": "EMP002", "empTagId": "TAG002" }
]
```

### Update Employee (Protected)
```
PUT /api/employees/{empPSC}
Authorization: Bearer {token}
Content-Type: application/json

Body: { "empTagId": "NEW_TAG_ID" }
Response: { "message": "Updated" }
```

## 🌐 IIS Deployment

### Option 1: Static Frontend + Node Backend

1. **Build React for production:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy React `build/` folder to IIS as a static website**

3. **Run Node.js backend as Windows Service or direct execution**

4. **Ensure backend API URL is accessible from IIS:**
   - Update `CLIENT_URL` in backend `.env`
   - Configure CORS if needed

### Option 2: Full IIS Integration

Requires:
- IIS URL Rewrite module
- Application Request Routing (ARR)
- Node.js installed on Windows

## 🛠️ Technology Stack

**Frontend:**
- React 19
- React Router v7
- CSS (System Design)

**Backend:**
- Node.js
- Express.js
- JWT Authentication
- MSSQL (SQL Server)

**DevOps:**
- dotenv for environment management
- CORS for cross-origin requests
- Git for version control

## 📝 Database Schema

### Required Tables

**tblUsers** - User authentication
```sql
CREATE TABLE tblUsers (
  usrID VARCHAR(50) PRIMARY KEY,
  usrPWD VARCHAR(50)
);
```

**tblEmployee** - Employee data
```sql
CREATE TABLE tblEmployee (
  empPSC VARCHAR(50) PRIMARY KEY,
  empTagId VARCHAR(50) NULL
);
```

## 🔒 Security

- JWT tokens expire after 2 hours (configurable in `.env`)
- Passwords stored in database (consider hashing in production)
- CORS configured to accept requests from frontend
- Environment variables protect sensitive data
- `.env` file excluded from git

## 📄 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | ✅ |
| NODE_ENV | Environment (development/production) | ✅ |
| CLIENT_URL | Frontend URL for CORS | ✅ |
| JWT_SECRET | Secret key for JWT signing | ✅ |
| JWT_EXPIRY | Token expiration time | ✅ |
| DB_USER | Database username | ✅ |
| DB_PASSWORD | Database password | ✅ |
| DB_SERVER | Database server address | ✅ |
| DB_NAME | Database name | ✅ |
| DB_TRUST_CERT | Trust self-signed certificates | ✅ |
| DB_ENCRYPT | Use encrypted connection | ✅ |

## 🐛 Troubleshooting

### "Failed to fetch" error
- Ensure backend server is running on port 5000
- Check CORS configuration in `.env`

### Database connection error
- Verify SQL Server is running
- Check credentials in `.env`
- Ensure database and tables exist

### Port already in use
- Change `PORT` in `.env` file
- Or kill existing process on that port

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MSSQL Node.js Package](https://github.com/tediousjs/node-mssql)
- [JWT Documentation](https://jwt.io/)

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Built as a professional full-stack application for interview preparation.

---

**Last Updated:** January 14, 2026
