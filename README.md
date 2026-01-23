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
├── client/                        # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Login.css
│   │   │   ├── Employees.js
│   │   │   └── Employees.css
│   │   ├── App.js                 # Main routing component
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .gitignore
│
├── server/                        # Express backend
│   ├── server.js                  # Express server entry point
│   ├── .env                       # Environment variables
│   ├── .gitignore                 # Git ignore file
│   └── package.json
│
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
   cd reactForAbed
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
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
cd client
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Production Build

Build the React app for production:
```bash
cd client
npm run build
```

The optimized files will be in the `client/build/` directory.

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
  { "empPSC": "EMP001", "empTagId": "TAG001", "empProjID": 1 },
  { "empPSC": "EMP002", "empTagId": "TAG002", "empProjID": 2 }
]
```

### Get Projects (Protected)
```
GET /api/projects
Authorization: Bearer {token}

Response: [
  { "prjSeq": 1, "prjDesc": "Project Alpha" },
  { "prjSeq": 2, "prjDesc": "Project Beta" },
  { "prjSeq": 3, "prjDesc": "Project Gamma" }
]
```

### Update Employee (Protected)
```
PUT /api/employees/{empPSC}
Authorization: Bearer {token}
Content-Type: application/json

Body: { 
  "empTagId": "NEW_TAG_ID",
  "empProjID": 2
}
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
   - Update `CLIENT_URL` in `server/.env`
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

### Database: UAE_PayData

#### tblUsers - User Authentication
```sql
CREATE TABLE tblUsers (
  usrID VARCHAR(50) PRIMARY KEY,
  usrPWD VARCHAR(50)
);
```

| Column | Type | Description |
|--------|------|-------------|
| usrID | VARCHAR(50) | User login ID (Primary Key) |
| usrPWD | VARCHAR(50) | User password |

**Sample Data:**
```sql
INSERT INTO tblUsers VALUES ('admin', '1234');
```

---

#### tblEmployee - Employee Information
```sql
CREATE TABLE tblEmployee (
  empPSC VARCHAR(50) PRIMARY KEY,
  empTagId VARCHAR(50) NULL,
  empProjID INT NULL
);
```

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| empPSC | VARCHAR(50) | NO | Employee PSC/ID (Primary Key) |
| empTagId | VARCHAR(50) | YES | Employee Tag/Category ID |
| empProjID | INT | YES | Foreign Key to tblProjects (prjSeq) |

**Constraints:**
- `empPSC` is the primary identifier
- `empProjID` should reference `tblProjects.prjSeq` (optional)

**Sample Data:**
```sql
INSERT INTO tblEmployee VALUES ('EMP001', 'TAG_A', 1);
INSERT INTO tblEmployee VALUES ('EMP002', 'TAG_B', 2);
INSERT INTO tblEmployee VALUES ('EMP003', NULL, NULL);
```

---

#### tblProjects - Project Definitions
```sql
CREATE TABLE tblProjects (
  prjSeq INT PRIMARY KEY IDENTITY(1,1),
  prjDesc VARCHAR(100) NOT NULL
);
```

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| prjSeq | INT | NO | Project Sequence ID (Primary Key, Auto-increment) |
| prjDesc | VARCHAR(100) | NO | Project Description/Name |

**Constraints:**
- `prjSeq` auto-increments starting from 1
- `prjDesc` cannot be NULL

**Sample Data:**
```sql
INSERT INTO tblProjects (prjDesc) VALUES ('Project Alpha');
INSERT INTO tblProjects (prjDesc) VALUES ('Project Beta');
INSERT INTO tblProjects (prjDesc) VALUES ('Project Gamma');
```

---

### Data Relationships

```
tblProjects (1)
    ↓
    └──→ tblEmployee (Many)
         └── empProjID → prjSeq
```

**Foreign Key Constraint (Recommended):**
```sql
ALTER TABLE tblEmployee
ADD CONSTRAINT FK_Employee_Project 
FOREIGN KEY (empProjID) REFERENCES tblProjects(prjSeq);
```

---

### Database Setup Script

```sql
-- Create Database
CREATE DATABASE UAE_PayData;
USE UAE_PayData;

-- Create Tables
CREATE TABLE tblUsers (
  usrID VARCHAR(50) PRIMARY KEY,
  usrPWD VARCHAR(50)
);

CREATE TABLE tblProjects (
  prjSeq INT PRIMARY KEY IDENTITY(1,1),
  prjDesc VARCHAR(100) NOT NULL
);

CREATE TABLE tblEmployee (
  empPSC VARCHAR(50) PRIMARY KEY,
  empTagId VARCHAR(50) NULL,
  empProjID INT NULL,
  CONSTRAINT FK_Employee_Project FOREIGN KEY (empProjID) REFERENCES tblProjects(prjSeq)
);

-- Insert Sample Data
INSERT INTO tblUsers VALUES ('admin', '1234');

INSERT INTO tblProjects (prjDesc) VALUES ('Project Alpha');
INSERT INTO tblProjects (prjDesc) VALUES ('Project Beta');
INSERT INTO tblProjects (prjDesc) VALUES ('Project Gamma');

INSERT INTO tblEmployee VALUES ('EMP001', 'ADMIN', 1);
INSERT INTO tblEmployee VALUES ('EMP002', 'USER', 2);
INSERT INTO tblEmployee VALUES ('EMP003', 'INTERN', NULL);
INSERT INTO tblEmployee VALUES ('EMP004', 'MANAGER', 1);
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

**Last Updated:** January 23, 2026
