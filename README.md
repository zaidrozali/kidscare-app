# 🏫 KidsCare - Multi-Tenant SaaS Daycare Management Platform

> **Production-ready, enterprise-grade daycare management system built with Next.js 16, GraphQL, and Prisma. Deploy for FREE and scale to 50+ daycare centers at $0/month.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748)](https://www.prisma.io/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-E10098)](https://www.apollographql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![KidsCare Dashboard](https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=KidsCare+Dashboard)

---

## 🌟 Why KidsCare?

KidsCare is a **production-ready multi-tenant SaaS platform** designed for daycare centers and early childhood education providers. Unlike basic school apps, KidsCare offers:

- ✅ **True Multi-Tenancy**: Isolated data per daycare center with subscription tiers
- ✅ **Enterprise Authentication**: NextAuth.js with OAuth2, JWT sessions, and role-based access control
- ✅ **Scalable Architecture**: GraphQL API, optimized database queries, and cloud-ready infrastructure
- ✅ **Free to Deploy**: 100% free hosting for up to 50 daycare centers using Vercel, Neon, and Cloudflare
- ✅ **Audit Logging**: Full compliance tracking for regulatory requirements
- ✅ **Mobile-First Design**: PWA-ready responsive interface for parents and staff

**Perfect for:**
- Portfolio projects showcasing full-stack expertise
- Real-world SaaS deployment for daycare businesses
- Learning modern web development patterns
- Building scalable multi-tenant applications

---

## 🚀 Live Demo

**Demo Site**: [https://kidscare-demo.vercel.app](https://kidscare-demo.vercel.app) *(Coming soon)*

**Demo Credentials:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kidscare.com | admin123 |
| Parent | parent1@example.com | parent123 |

---

## ✨ Features

### 👥 Multi-Tenancy & Subscription Plans

- **Tenant Isolation**: Complete data separation per daycare center
- **Subdomain Routing**: `sunshine.kidscare.app`, `happy-kids.kidscare.app`
- **Flexible Plans**:
  - 🆓 **FREE**: 1 center, 20 students
  - 💼 **BASIC**: 1 center, 50 students
  - 🚀 **PRO**: 5 centers, 500 students
  - 🏢 **ENTERPRISE**: Unlimited

### 🔐 Enterprise Authentication

- **NextAuth.js v4**: Industry-standard authentication
- **Multiple Providers**:
  - Email/Password with bcrypt hashing
  - Google OAuth (unlimited free users)
- **Role-Based Access Control (RBAC)**:
  - SUPER_ADMIN (Platform owner)
  - TENANT_ADMIN (Daycare owner)
  - TEACHER (Staff member)
  - PARENT (Guardian)
- **JWT Sessions**: Stateless, scalable authentication
- **OAuth Integration**: Faster parent signup, no password management

### 📊 Core Functionality

- **Student Management**: Profiles, allergies, notes, parent relationships
- **Attendance Tracking**: Clock in/out, late arrivals, absence notes
- **Activity Feed**: Photo sharing, meal logging, daily updates
- **Dashboard Analytics**: Student statistics, recent activities, quick actions
- **Admin Panel**: Attendance marking, activity uploads, student management
- **Audit Logging**: Compliance tracking for all data changes

### 🛠️ Technical Excellence

- **GraphQL API**: Efficient data fetching with Apollo Server
- **Type Safety**: Full TypeScript coverage with Prisma types
- **Database Migrations**: Version-controlled schema changes
- **Optimized Queries**: Indexed database fields, efficient joins
- **Mobile Responsive**: Tailwind CSS with mobile-first design
- **Error Handling**: Comprehensive error boundaries and validation

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library with Server Components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL state management
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set

**Backend:**
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - GraphQL API
- [Prisma ORM](https://www.prisma.io/) - Type-safe database access
- [NextAuth.js](https://next-auth.js.org/) - Authentication framework
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing

**Database:**
- [SQLite](https://www.sqlite.org/) - Development database
- [PostgreSQL](https://www.postgresql.org/) - Production database (Neon free tier)

**Deployment:**
- [Vercel](https://vercel.com/) - Frontend & API hosting (100GB free)
- [Neon](https://neon.tech/) - PostgreSQL database (512MB free)
- [Cloudflare R2](https://www.cloudflare.com/products/r2/) - File storage (10GB free)
- [Better Stack](https://betterstack.com/) - Monitoring & logging (1M logs free)

### Database Schema

```prisma
// Multi-tenant core models
Tenant (id, name, subdomain, plan, maxStudents)
  └── User (id, email, role, tenantId)
  └── Student (id, name, class, parentId, tenantId)
  └── Activity (id, type, description, studentId, tenantId)
  └── AttendanceRecord (id, date, status, studentId, tenantId)
  └── AuditLog (id, action, entity, userId, tenantId)

// NextAuth models
Session (id, sessionToken, userId, tenantId)
Account (id, provider, providerAccountId, userId)
```

---

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/kidscare.git
cd kidscare
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit [.env](.env) with your configuration:

```env
# Database (SQLite for local dev)
DATABASE_URL="file:./prisma/dev.db"

# Authentication
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
JWT_SECRET="your-jwt-secret"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed demo data
npx prisma db seed
```

This creates:
- 1 Demo tenant: "Demo KidsCare Center"
- 1 Admin: admin@kidscare.com / admin123
- 1 Parent: parent1@example.com / parent123

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

---

## 🚀 Production Deployment

Deploy for **$0/month** with generous free tiers! See [FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md) for complete instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/kidscare)

1. Click "Deploy with Vercel"
2. Set environment variables (see guide)
3. Deploy!

**Total Monthly Cost:** $0 for up to 50 daycare centers

| Service | Free Tier | Usage |
|---------|-----------|-------|
| Vercel | 100 GB bandwidth | Hosting |
| Neon PostgreSQL | 512 MB storage | Database |
| Cloudflare R2 | 10 GB storage | File uploads |
| Google OAuth | Unlimited users | Authentication |
| Better Stack | 1M log events | Monitoring |

**Scaling Cost:** ~$50-75/month at 100 daycare centers

---

## 📖 Documentation

- **[FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md)** - Complete deployment guide for free production hosting
- **[GRAPHQL_SETUP.md](GRAPHQL_SETUP.md)** - GraphQL API documentation and examples
- **[prisma/schema.prisma](prisma/schema.prisma)** - Complete database schema

---

## 🗂️ Project Structure

```
kidscare/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth.js routes
│   │   └── graphql/             # GraphQL API endpoint
│   ├── feed/                    # Activity feed page
│   ├── admin/                   # Admin panel
│   ├── account/                 # Account settings
│   ├── layout.tsx               # Root layout with navigation
│   └── page.tsx                 # Home dashboard
├── components/                  # React components
│   ├── Navigation.tsx          # Bottom nav for mobile
│   └── ...
├── contexts/                    # React Context providers
│   └── AuthContext.tsx         # Authentication state
├── graphql/                     # GraphQL layer
│   ├── schema.ts               # Type definitions
│   └── resolvers.ts            # Query/mutation resolvers
├── lib/                         # Utility functions
│   ├── auth.ts                 # Password hashing
│   ├── prisma.ts               # Prisma client
│   └── apollo-client.ts        # Apollo Client setup
├── prisma/                      # Database layer
│   ├── schema.prisma           # Multi-tenant schema
│   ├── seed.ts                 # Demo data
│   └── migrations/             # Version-controlled migrations
└── public/                      # Static assets
```

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3001)
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Open Prisma Studio (database GUI)
npx prisma migrate dev   # Create new migration
npx prisma db seed       # Seed demo data
npx prisma generate      # Generate Prisma Client

# GraphQL
# Visit http://localhost:3001/api/graphql for Apollo Sandbox
```

---

## 📝 GraphQL API Examples

### Authentication

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
      role
      tenantId
    }
  }
}
```

### Queries

```graphql
# Get all students (scoped to tenant)
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

# Get attendance records
query GetAttendance($date: DateTime!) {
  attendanceRecords(date: $date) {
    student {
      name
      class
    }
    status
    checkInTime
  }
}
```

### Mutations

```graphql
# Mark attendance
mutation MarkAttendance {
  markAttendance(input: {
    studentId: "cm123..."
    date: "2025-01-15T00:00:00Z"
    status: PRESENT
    checkInTime: "2025-01-15T07:30:00Z"
  }) {
    id
    status
  }
}

# Create activity
mutation CreateActivity {
  createActivity(input: {
    studentId: "cm123..."
    type: MEAL
    description: "Lunch: Nasi ayam"
  }) {
    id
    type
    description
    createdAt
  }
}
```

Full API documentation: [GRAPHQL_SETUP.md](GRAPHQL_SETUP.md)

---

## 🔐 Security Features

- ✅ **HTTPS Everywhere** (automatic with Vercel)
- ✅ **Environment Variables** (encrypted Vercel storage)
- ✅ **SQL Injection Protection** (Prisma ORM parameterized queries)
- ✅ **XSS Protection** (Next.js built-in sanitization)
- ✅ **CSRF Protection** (NextAuth.js automatic)
- ✅ **Password Hashing** (bcrypt with salt rounds)
- ✅ **JWT Session Security** (signed tokens, httpOnly cookies)
- ✅ **Rate Limiting** (Vercel middleware ready)
- ✅ **Audit Logging** (all data changes tracked)
- ✅ **Tenant Isolation** (database-level data separation)

---

## 🎯 Use Cases

### For Portfolio

Perfect demonstration of:
- Full-stack TypeScript development
- Multi-tenant SaaS architecture
- GraphQL API design
- Modern authentication patterns
- Database design and migrations
- Production deployment skills
- Free-tier optimization

### For Business

Ready to deploy for:
- Daycare centers
- Preschools
- Kindergartens
- After-school programs
- Tutoring centers
- Early childhood education providers

**Potential Revenue Model:**
- FREE: $0/month (1 center, 20 students)
- BASIC: $29/month (1 center, 50 students)
- PRO: $99/month (5 centers, 500 students)
- ENTERPRISE: Custom pricing

---

## 🛣️ Roadmap

### Phase 1: Core Features (Completed ✅)
- [x] Multi-tenant architecture
- [x] NextAuth.js authentication
- [x] Student management
- [x] Attendance tracking
- [x] Activity feed
- [x] Free deployment guide

### Phase 2: Enhanced Features (In Progress 🚧)
- [ ] File upload to Cloudflare R2
- [ ] Real-time notifications (WebSockets)
- [ ] Parent mobile app (React Native)
- [ ] Billing integration (Stripe)
- [ ] Email notifications (Resend)

### Phase 3: Enterprise (Planned 📋)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Custom branding per tenant
- [ ] API webhooks
- [ ] Two-factor authentication (2FA)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Muhammad Zaid Rozali**

- Portfolio: [yourportfolio.com](https://yourportfolio.com)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), and [Apollo GraphQL](https://www.apollographql.com/)
- Authentication powered by [NextAuth.js](https://next-auth.js.org/)
- Deployed on [Vercel](https://vercel.com/) with [Neon](https://neon.tech/) PostgreSQL
- Icons by [Lucide](https://lucide.dev/)

---

## 📞 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Email: support@kidscare.com
- Documentation: See guides in this repository

---

**⭐ Star this repo if you find it helpful!**

Built with ❤️ for daycare centers and early childhood education providers.
