# 🚀 Quick Start Guide - AI Tools Monitoring Platform

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ (via Docker recommended)
- npm or yarn

## 🏃 Start the Application (5 minutes)

### 1. Start Database

```bash
# Start PostgreSQL and Redis with Docker
docker compose up -d

# Verify containers are running
docker compose ps
```

### 2. Setup Backend

```bash
cd backend

# Database is already configured in .env
# Run migrations
node ace migration:run

# Seed database with demo data (2 users + 16 AI tools)
node ace db:seed

# Start backend server (runs on http://localhost:3333)
npm run dev
```

**Backend is now running! ✅**

Test it: Open http://localhost:3333 in your browser

### 3. Setup Frontend (New Terminal)

```bash
cd frontend

# Frontend .env is already configured
# Start frontend dev server (runs on http://localhost:5173)
npm run dev
```

**Frontend is now running! ✅**

Open http://localhost:5173 in your browser

## 🎉 Your Application is Ready!

### What You Can Do Now:

1. **Browse AI Tools** - Visit http://localhost:5173/tools
   - View 16 pre-seeded AI tools (ChatGPT, Claude, Cursor, Midjourney, etc.)
   - Filter by category (LLM, Code Assistant, Image Generation, etc.)
   - Filter by pricing (Free, Freemium, Paid)
   - Search tools by name/description
   - View ratings, views, features, pros/cons

2. **Test API Endpoints** (via Postman, curl, or browser)

   **Public endpoints:**
   - `GET http://localhost:3333/api/tools` - List all tools
   - `GET http://localhost:3333/api/tools/chatgpt` - Get ChatGPT details
   - `GET http://localhost:3333/api/tools/search?q=code` - Search tools

   **Auth endpoints:**
   - `POST http://localhost:3333/api/auth/register` - Create account
   - `POST http://localhost:3333/api/auth/login` - Login

   **Test accounts** (seeded):
   - Admin: `admin@aitools.com` / `Admin123!`
   - User: `john@example.com` / `User123!`

3. **Create Your First Tool** (requires auth)

   ```bash
   # Login first to get token
   curl -X POST http://localhost:3333/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"uid":"admin@aitools.com","password":"Admin123!"}'

   # Use the token to create a tool
   curl -X POST http://localhost:3333/api/tools \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -d '{
       "name": "My AI Tool",
       "description": "An amazing AI tool for developers",
       "category": "Code Assistant",
       "url": "https://example.com",
       "pricing": "free"
     }'
   ```

## 📊 What's Included

### Backend (AdonisJS 6)
- ✅ JWT Authentication with access tokens
- ✅ Tools CRUD with permissions (owner/admin can edit/delete)
- ✅ Rate limiting (3 req/15min for register, 5 req/15min for login)
- ✅ Input validation with Vine
- ✅ Full-text search
- ✅ Pagination and filters
- ✅ Security: CSRF protection, CORS, input sanitization

### Frontend (React + TypeScript)
- ✅ React Router for navigation
- ✅ React Query for API state management
- ✅ AuthContext for authentication
- ✅ Tailwind CSS + shadcn/ui components
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Tools browsing with filters and search
- ✅ Pagination

### Database (PostgreSQL)
- ✅ 10 tables created (users, tools, articles, ai_models, comments, ratings, bookmarks, tags, api_keys, sources)
- ✅ 2 test users seeded
- ✅ 16 popular AI tools seeded with full data

## 🛠️ Development Commands

### Backend
```bash
cd backend

# Run migrations
node ace migration:run

# Rollback migrations
node ace migration:rollback

# Seed database
node ace db:seed

# Run tests
npm test

# Build for production
npm run build
```

### Frontend
```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Backend (port 3333)
lsof -ti:3333 | xargs kill

# Frontend (port 5173)
lsof -ti:5173 | xargs kill
```

### Database Connection Error
```bash
# Check if PostgreSQL container is running
docker compose ps

# Restart containers
docker compose restart

# Check logs
docker compose logs postgres
```

### Fresh Start
```bash
# Stop all
docker compose down

# Delete database volume (WARNING: deletes all data)
docker compose down -v

# Start fresh
docker compose up -d
cd backend && node ace migration:run && node ace db:seed
```

## 📚 Next Steps

1. **Add More Features**
   - Implement login/register forms in frontend
   - Add comments system
   - Add ratings/reviews
   - Add bookmarks functionality

2. **Explore the Code**
   - Backend: `backend/app/controllers/` - API controllers
   - Frontend: `frontend/src/components/` - React components
   - Database: `backend/database/migrations/` - DB schema

3. **Deploy to Production**
   - See `README.md` for deployment instructions
   - Configure environment variables for production
   - Setup reverse proxy (nginx)
   - Enable SSL/HTTPS

## 🐛 Known Limitations (MVP)

- Login/Register pages show placeholder (API works, UI not implemented)
- Comments, ratings, bookmarks UI not implemented (backend ready)
- No image upload for tools (URLs only)
- No admin dashboard UI (API endpoints exist)

## 📞 Support

- Check `README.md` for full documentation
- Backend API runs on: http://localhost:3333
- Frontend app runs on: http://localhost:5173
- Database: PostgreSQL on port 5432

---

**Enjoy building with AI Tools Monitor! 🎉**
