# 📚 EthosLife Documentation Index

**Local Documentation Storage** - These files are NOT in the Git repository.

---

## 📄 Available Documents

### For Deployment
- **DEPLOY_SCRIPT.md** - Complete deployment guide with detailed instructions for Vercel, Render, and Railway
- **README.md** - Minimal quick start guide (in repository)

### For Development
- **PROJECT_STRUCTURE.md** - Full project structure, all pages, routes, and dependencies
- **CHANGELOG_MARCH_2026.md** - Recent changes and updates

### For Quick Start
- **READY_TO_DEPLOY.md** - Quick deployment checklist

---

## 🔗 Quick Links

### Repository
- **GitHub**: https://github.com/foxampy/EthosLife
- **Main Branch**: `main`
- **Latest Commit**: Check on GitHub

### Deployment Platforms
- **Render**: https://render.com
- **Vercel**: https://vercel.com
- **Railway**: https://railway.app

---

## 📦 What's in the Repository

```
✅ package.json - Dependencies
✅ server.js - Backend entry point
✅ database.js - Database connection
✅ render.yaml - Render configuration
✅ build.sh - Build script
✅ .env.example - Environment template
✅ frontend/ - React application
✅ routes/ - API routes
✅ controllers/ - Business logic
✅ README.md - Quick start guide
✅ .gitignore - Git ignore rules
```

## 📦 What's NOT in the Repository

```
❌ .env - Environment variables (create from .env.example)
❌ node_modules/ - Dependencies (installed during build)
❌ dist/ - Build output (generated during build)
❌ Documentation files (stored locally in docs/)
❌ *.md guides (DEPLOY_SCRIPT, PROJECT_STRUCTURE, etc.)
```

---

## 🚀 Quick Deploy Summary

### 1. Frontend (Vercel)
1. Go to vercel.com
2. Import GitHub repository
3. Root Directory: `frontend`
4. Deploy!

### 2. Backend (Render)
1. Go to render.com
2. New Web Service
3. Connect repository
4. Add environment variables
5. Create PostgreSQL database
6. Deploy!

**Full instructions:** See `DEPLOY_SCRIPT.md` in this folder.

---

## 🔐 Required Environment Variables

### Backend (Render)
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=<generate-secure-key>
CORS_ORIGIN=https://your-app.vercel.app
ADMIN_KEY=<generate-secure-key>
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-api.onrender.com
```

**Complete list:** See `DEPLOY_SCRIPT.md` - Environment Variables Reference section.

---

## 📞 Support

- **GitHub Issues**: https://github.com/foxampy/EthosLife/issues
- **Documentation**: Read files in this `docs/` folder
- **Quick Start**: See `README.md` in repository root

---

*Last Updated: March 2026*
*Version: 2.0.1*
