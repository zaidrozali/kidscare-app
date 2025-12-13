# 🏫 KidsCare - School Management App

A modern school/childcare management application built with Next.js, GraphQL, and Prisma.

## ✨ Features

- **Role-Based Access Control**: Separate views for Parents and Admins
- **Attendance Tracking**: Mark and track student attendance
- **Activity Feed**: Share photos, meals, and daily activities
- **Dashboard**: Statistics and insights for admins
- **Real-time Updates**: GraphQL API for efficient data fetching
- **Responsive Design**: Mobile-first design that works on all devices

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

The database is already configured with SQLite (no installation needed!).
Just run the seed script to create sample data:

```bash
npm run db:seed
```

This creates:
- 1 Admin user
- 2 Parent users
- 6 Students
- Sample activities and attendance records

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 🔑 Login Credentials

**Admin Account:**
- Email: `admin@kidscare.com`
- Password: `admin123`

**Parent Accounts:**
- Email: `parent1@example.com` / `parent2@example.com`
- Password: `admin123`

## 📱 Pages

- **Home (/)**: Dashboard with quick actions
- **/feed**: Activity feed with photos and updates
- **/admin**: Admin panel (admin only) with:
  - Dashboard tab: Statistics and recent activities
  - Attendance tab: Mark student attendance
  - Upload tab: Create new activities
- **/account**: Switch between Parent and Admin roles (demo mode)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: GraphQL with Apollo Server
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt

## 📚 GraphQL API

The GraphQL API is available at: **http://localhost:3001/api/graphql**

For detailed API documentation, see [GRAPHQL_SETUP.md](./GRAPHQL_SETUP.md)

### Example Queries

**Login:**
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

**Get Students:**
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
  }
}
```

## 🗂️ Project Structure

```
my-school-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home dashboard
│   ├── feed/              # Activity feed
│   ├── admin/             # Admin panel
│   ├── account/           # Account settings
│   └── api/graphql/       # GraphQL endpoint
├── components/            # React components
├── contexts/              # React context providers
├── graphql/               # GraphQL schema and resolvers
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Sample data
│   └── dev.db            # SQLite database file
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:seed` - Seed database with sample data
- `npx prisma studio` - Open Prisma Studio (database GUI)

## 📖 Documentation

- [GraphQL Setup Guide](./GRAPHQL_SETUP.md) - Complete GraphQL API documentation
- [Prisma Docs](https://www.prisma.io/docs) - Learn about Prisma ORM
- [Next.js Docs](https://nextjs.org/docs) - Learn about Next.js

## 🚢 Deployment

### Switching to PostgreSQL for Production

1. Follow the PostgreSQL setup instructions in [GRAPHQL_SETUP.md](./GRAPHQL_SETUP.md)
2. Update `prisma/schema.prisma` to use PostgreSQL
3. Run migrations: `npx prisma migrate deploy`
4. Deploy to Vercel, Netlify, or your preferred platform

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

Built with Next.js, GraphQL, and Prisma
