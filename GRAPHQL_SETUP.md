# GraphQL Backend Setup Guide

## 📦 What's Installed

Your KidsCare app now has a complete GraphQL backend with:

- **Apollo Server** - GraphQL server
- **Prisma ORM** - Type-safe database client
- **SQLite** - Database (configured for development, can switch to PostgreSQL)
- **JWT Authentication** - Secure user authentication
- **Role-based Authorization** - Parent and Admin roles
- **Sample Data** - Pre-configured with users, students, and activities

## 🗄️ Database Setup

### Current Setup: SQLite (Development)

The app is currently configured to use **SQLite** for easy local development. No installation required!

### Quick Start

1. **Database is already set up!** The `.env` file and database are ready to use.

2. **Seed the database** with sample data:

```bash
npm run db:seed
```

This will create:
- 1 Admin user: `admin@kidscare.com` / `admin123`
- 2 Parent users: `parent1@example.com` / `admin123`, `parent2@example.com` / `admin123`
- 6 Students with attendance and activity records

### Switching to PostgreSQL (Production)

If you want to use PostgreSQL instead:

**1. Install PostgreSQL**

**On macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**On Windows:**
- Download from https://www.postgresql.org/download/windows/
- Install and start the PostgreSQL service

**On Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**2. Create Database**

```bash
# Access PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE kidscare;
CREATE USER kidscare_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kidscare TO kidscare_user;

# Exit psql
\q
```

**3. Update Configuration**

Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}

model Activity {
  // ...
  imageUrls   String[]     @default([])  // Change from String?
  // ...
}
```

Edit `.env`:
```env
DATABASE_URL="postgresql://kidscare_user:your_password@localhost:5432/kidscare?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
```

**4. Run Migrations**

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Seed database with sample data
npm run db:seed
```

## 🚀 Start the Server

```bash
npm run dev
```

GraphQL endpoint will be available at:
**http://localhost:3001/api/graphql**

## 🔍 GraphQL Playground

Visit http://localhost:3001/api/graphql in your browser to access Apollo Studio Explorer.

## 🔑 Sample Login Credentials

After running `npm run db:seed`, you can log in with:

- **Admin**: `admin@kidscare.com` / `admin123`
- **Parent 1**: `parent1@example.com` / `admin123`
- **Parent 2**: `parent2@example.com` / `admin123`

## 📝 Example Queries & Mutations

### Register a New User

```graphql
mutation Register {
  register(input: {
    email: "admin@kidscare.com"
    password: "admin123"
    name: "Admin User"
    role: ADMIN
    phone: "+60123456789"
  }) {
    token
    user {
      id
      name
      email
      role
    }
  }
}
```

### Login

```graphql
mutation Login {
  login(input: {
    email: "admin@kidscare.com"
    password: "admin123"
  }) {
    token
    user {
      id
      name
      email
      role
    }
  }
}
```

### Create a Student (Admin only)

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

```graphql
mutation CreateStudent {
  createStudent(input: {
    name: "Eryna Binti Muhammad Zaid"
    class: "Junior"
    parentId: "PARENT_USER_ID"
  }) {
    id
    name
    class
  }
}
```

### Get All Students

```graphql
query GetStudents {
  students {
    id
    name
    class
    parent {
      name
      email
    }
    activities {
      id
      type
      description
      createdAt
    }
  }
}
```

### Create Activity (Admin only)

```graphql
mutation CreateActivity {
  createActivity(input: {
    type: MEAL
    description: "Nasi ayam for lunch"
    imageUrls: ["https://example.com/image.jpg"]
    studentId: "STUDENT_ID"
  }) {
    id
    type
    description
    imageUrls
    student {
      name
    }
  }
}
```

### Mark Attendance (Admin only)

```graphql
mutation MarkAttendance {
  markAttendance(input: {
    studentId: "STUDENT_ID"
    date: "2025-12-13"
    status: PRESENT
    notes: "On time"
  }) {
    id
    status
    date
    student {
      name
    }
  }
}
```

### Get Attendance Stats (Admin only)

```graphql
query GetAttendanceStats {
  attendanceStats(date: "2025-12-13") {
    totalStudents
    presentCount
    absentCount
    lateCount
    attendanceRate
  }
}
```

### Get Recent Activities

```graphql
query GetRecentActivities {
  recentActivities(limit: 10) {
    id
    type
    description
    imageUrls
    createdAt
    student {
      name
      class
    }
    createdBy {
      name
    }
  }
}
```

### Get My Children (Parent only)

```graphql
query MyChildren {
  myChildren {
    id
    name
    class
    activities {
      id
      type
      description
      createdAt
    }
    attendanceRecords {
      id
      date
      status
    }
  }
}
```

## 🔐 Authentication

All protected queries/mutations require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Role-Based Access:

**ADMIN can:**
- Create/update/delete students
- Create/update/delete activities
- Mark attendance
- View all students and activities
- View attendance stats

**PARENT can:**
- View their own children
- View activities for their children
- View attendance for their children

## 🗃️ Database Models

### User
- id, email, name, password, role, phone, address
- Relations: children (Student[])

### Student
- id, name, class, dateOfBirth
- Relations: parent (User), activities (Activity[]), attendanceRecords (AttendanceRecord[])

### Activity
- id, type, description, imageUrls[]
- Relations: student (Student), createdBy (User)

### AttendanceRecord
- id, date, status, notes
- Relations: student (Student), markedBy (User)

## 🛠️ Useful Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name migration_name

# Format Prisma schema
npx prisma format

# View database structure
npx prisma db pull
```

## 📊 Prisma Studio

Run Prisma Studio to view and edit your database:

```bash
npx prisma studio
```

Access at: http://localhost:5555

## 🔄 Next Steps

1. Set up PostgreSQL database
2. Configure .env file
3. Run migrations
4. Test GraphQL API
5. Connect frontend to GraphQL
6. Add file upload for photos
7. Deploy to production

## 🐛 Troubleshooting

**Error: "Can't reach database server"**
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

**Error: "Authentication failed"**
- Check JWT_SECRET in .env
- Verify token in Authorization header

**Error: "Not authorized"**
- Verify user role matches required permission
- Check token is valid and not expired

## 📚 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Docs](https://graphql.org/learn/)
