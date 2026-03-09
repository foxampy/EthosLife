# 🚀 EthosLife Deployment Guide
## Vercel (Frontend) + Render (Backend + Database)

**Version:** 1.0
**Date:** March 9, 2026
**Cost:** $0-19/month (Free tier optimized)

---

# 📋 Overview

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Users (Browser)                      │
└─────────────────────────────────────────────────────────┘
              │
              │ HTTPS
              ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel (Frontend - Free)                   │
│  React App + CDN + Edge Functions                       │
│  URL: https://ethoslife.vercel.app                      │
└─────────────────────────────────────────────────────────┘
              │
              │ API Calls (HTTPS)
              ▼
┌─────────────────────────────────────────────────────────┐
│         Render (Backend API - Starter $7-19/mo)         │
│  Node.js + Express API                                  │
│  URL: https://ethoslife-api.onrender.com                │
└─────────────────────────────────────────────────────────┘
              │
              │ PostgreSQL
              ▼
┌─────────────────────────────────────────────────────────┐
│        Render PostgreSQL (Database - Free 1GB)          │
│  PostgreSQL 15                                          │
│  Auto-backed up                                         │
└─────────────────────────────────────────────────────────┘
```

## Cost Breakdown

| Service | Plan | Cost | What You Get |
|---------|------|------|--------------|
| **Vercel** | Hobby (Free) | $0 | 100GB bandwidth, unlimited deployments |
| **Render Web Service** | Starter | $7-19/mo | No sleep, 512MB RAM, 0.5 CPU |
| **Render PostgreSQL** | Free | $0 | 1GB storage, 90 days backup |
| **Total** | | **$7-19/month** | Production-ready setup |

---

# 📦 Prerequisites

## What You Need

1. **GitHub Account** - For code hosting
2. **Vercel Account** - Free (https://vercel.com/signup)
3. **Render Account** - Free (https://render.com/register)
4. **Domain** (Optional) - For custom URL

## Environment Variables

Create a `.env.production` file locally first:

```bash
# .env.production

# Server
PORT=3000
NODE_ENV=production

# Database (from Render PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/ethoslife

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars

# CORS (your Vercel URL)
CORS_ORIGIN=https://ethoslife.vercel.app,https://ethoslife-*.vercel.app

# Admin
ADMIN_KEY=change-this-to-something-random-and-secure

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN=your_bot_token_here
FOUNDER_CHAT_ID=your_chat_id_here
ADMIN_CHAT_IDS=admin1_chat_id,admin2_chat_id

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (optional for payments)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Qwen AI (optional)
QWEN_API_KEY=your-qwen-api-key

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

# 🎯 Step-by-Step Deployment

## Part 1: Deploy Database (Render PostgreSQL)

### Step 1.1: Create Render Account
1. Go to https://render.com
2. Click "Sign Up"
3. Choose GitHub login (recommended) or email

### Step 1.2: Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. Fill in:
   ```
   Name: ethoslife-db
   Region: Oregon (closest to you)
   Plan: Free (0$/month)
   Database Name: ethoslife
   User: ethoslife
   ```
3. Click **"Create Database"**
4. Wait 2-3 minutes for provisioning

### Step 1.3: Get Connection String
1. Click on your database **"ethoslife-db"**
2. Go to **"Connection"** tab
3. Copy **"External Database URL"**
   ```
   postgresql://ethoslife:password@ep-xxx-xxx.us-east-2.aws.render.com:5432/ethoslife?sslmode=require
   ```
4. **Save this!** You'll need it for backend

### Step 1.4: Configure Database
1. Click **"Settings"**
2. Enable **"Auto-backup"** (Free: 90 days retention)
3. Note the **Internal Database URL** (for backend on same Render account)

---

## Part 2: Deploy Backend API (Render Web Service)

### Step 2.1: Prepare Backend Code

Make sure your `server.js` is production-ready:

```javascript
// server.js - Production checklist

// ✅ Use environment variables
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

// ✅ CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
};

// ✅ Database initialization
async function startServer() {
  try {
    await db.initDatabase();
    console.log('✅ Database connected');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

startServer();
```

### Step 2.2: Create render.yaml (Blueprint)

Create `render.yaml` in root directory:

```yaml
services:
  - type: web
    name: ethoslife-api
    env: node
    region: oregon
    plan: starter
    buildCommand: npm install
    startCommand: npm start
    rootDir: .
    
    healthCheckPath: /api/health
    healthCheckTimeout: 60
    
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      
      - key: DATABASE_URL
        fromDatabase:
          name: ethoslife-db
          property: connectionString
      
      - key: JWT_SECRET
        generateValue: true
        sync: false
      
      - key: JWT_REFRESH_SECRET
        generateValue: true
        sync: false
      
      - key: CORS_ORIGIN
        value: "https://ethoslife.vercel.app,https://ethoslife-*.vercel.app"
      
      - key: ADMIN_KEY
        sync: false
      
      - key: TELEGRAM_BOT_TOKEN
        sync: false
      
      - key: FOUNDER_CHAT_ID
        sync: false
      
      - key: QWEN_API_KEY
        sync: false

databases:
  - name: ethoslife-db
    plan: free
    databaseName: ethoslife
    user: ethoslife
```

### Step 2.3: Deploy Backend

**Option A: Using render.yaml (Recommended)**

1. Push code to GitHub first:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. In Render Dashboard:
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository
   - Select `render.yaml`
   - Click **"Apply"**

3. Render will automatically create:
   - Web service (ethoslife-api)
   - PostgreSQL database (ethoslife-db)
   - All environment variables

**Option B: Manual Deployment**

1. Click **"New +"** → **"Web Service"**
2. Connect GitHub repository
3. Configure:
   ```
   Name: ethoslife-api
   Region: Oregon
   Branch: main
   Root Directory: (leave blank)
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```
4. Choose Plan: **Starter** ($7-19/month)
5. Add Environment Variables:
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Add all variables from `.env.production`
   - For `DATABASE_URL`, use the URL from Part 1
6. Click **"Create Web Service"**

### Step 2.4: Configure Backend Settings

1. Go to your web service **"ethoslife-api"**
2. Click **"Settings"**
3. Configure:
   ```
   ✅ Auto-Deploy: Enabled
   ✅ Health Check Path: /api/health
   ✅ Health Check Timeout: 60 seconds
   ✅ Instance Group Size: 1
   ```

4. **Important:** Disable sleep (Starter plan)
   - Free plan sleeps after 15 min (BAD!)
   - Starter plan stays awake (GOOD!)

### Step 2.5: Verify Backend

1. Wait for deployment (3-5 minutes)
2. Click on your service
3. Copy the URL: `https://ethoslife-api.onrender.com`
4. Test health endpoint:
   ```
   https://ethoslife-api.onrender.com/api/health
   ```
   
   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2026-03-09T12:00:00.000Z"
   }
   ```

5. Check logs:
   - Click **"Logs"** tab
   - Look for: `✅ Database connected`
   - Look for: `🚀 Server running on port 3000`

---

## Part 3: Deploy Frontend (Vercel)

### Step 3.1: Prepare Frontend Code

Update `frontend/.env.production`:

```bash
# frontend/.env.production
VITE_API_URL=https://ethoslife-api.onrender.com/api
VITE_APP_URL=https://ethoslife.vercel.app
VITE_NODE_ENV=production
```

Update `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 5173
  }
})
```

### Step 3.2: Create vercel.json

Create `frontend/vercel.json`:

```json
{
  "version": 2,
  "name": "ethoslife",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ],
  
  "env": {
    "VITE_API_URL": "https://ethoslife-api.onrender.com/api",
    "VITE_APP_URL": "https://ethoslife.vercel.app"
  }
}
```

### Step 3.3: Deploy to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Dashboard** (Recommended):
   
   a. Go to https://vercel.com/new
   
   b. Click **"Import Project"**
   
   c. Select **"Import Git Repository"**
   
   d. Choose your GitHub repository: `EthosLife`
   
   e. Configure:
      ```
      Framework Preset: Vite
      Root Directory: frontend
      Build Command: npm run build
      Output Directory: dist
      Install Command: npm install
      ```
   
   f. Add Environment Variables:
      ```
      VITE_API_URL = https://ethoslife-api.onrender.com/api
      VITE_APP_URL = https://ethoslife.vercel.app
      VITE_NODE_ENV = production
      ```
   
   g. Click **"Deploy"**

3. **Deploy via CLI** (Alternative):
   ```bash
   cd frontend
   vercel login
   vercel --prod
   ```

### Step 3.4: Configure Vercel Settings

1. Go to your project in Vercel Dashboard
2. Click **"Settings"**
3. Configure:

**Build & Development Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Development Command: npm run dev
```

**Environment Variables:**
```
✅ VITE_API_URL = https://ethoslife-api.onrender.com/api
✅ VITE_APP_URL = https://ethoslife.vercel.app
✅ VITE_NODE_ENV = production
```

**Git:**
```
✅ Auto-Expose Commit SHA: Enabled
✅ Production Branch: main
```

### Step 3.5: Verify Frontend

1. Wait for deployment (2-3 minutes)
2. Click on deployment → **"Visit"**
3. Your URL: `https://ethoslife.vercel.app`
4. Test:
   - Landing page loads
   - Navigation works
   - API calls succeed (check browser console)
   - No CORS errors

---

## Part 4: Connect Frontend + Backend

### Step 4.1: Update CORS on Backend

Update `server.js` CORS configuration:

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Step 4.2: Update Render Environment Variables

1. Go to Render Dashboard → ethoslife-api
2. Click **"Environment"**
3. Add/Update:
   ```
   CORS_ORIGIN = https://ethoslife.vercel.app,https://ethoslife-*.vercel.app
   ```
4. Click **"Save Changes"**
5. Service will auto-redeploy

### Step 4.3: Test Integration

1. Open: `https://ethoslife.vercel.app`
2. Open Browser DevTools (F12)
3. Test API call:
   ```javascript
   // In browser console
   fetch('https://ethoslife-api.onrender.com/api/health')
     .then(r => r.json())
     .then(console.log)
   ```
4. Expected: `{"status": "ok", ...}`
5. No CORS errors! ✅

---

# 🔧 Post-Deployment Configuration

## Custom Domain (Optional)

### Vercel Custom Domain

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel Dashboard → Project → **Settings** → **Domains**
3. Add your domain: `ethoslife.com`
4. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. For root domain:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
6. Wait 24-48 hours for DNS propagation

### Render Custom Domain

1. In Render Dashboard → Service → **Settings**
2. Scroll to **"Custom Domain"**
3. Add domain: `api.ethoslife.com`
4. Configure DNS:
   ```
   Type: CNAME
   Name: api
   Value: ethoslife-api.onrender.com
   ```
5. SSL certificate auto-provisioned (Let's Encrypt)

## SSL/TLS

**Automatic!** Both Vercel and Render provide free SSL:
- Vercel: Let's Encrypt (auto-renewed)
- Render: Let's Encrypt (auto-renewed)

No configuration needed! ✅

## Monitoring & Logs

### Vercel Monitoring

1. Go to Vercel Dashboard → Project
2. Click **"Analytics"**
3. View:
   - Page views
   - Bandwidth usage
   - Response times
   - Errors

### Render Monitoring

1. Go to Render Dashboard → Service
2. Click **"Logs"**
3. View:
   - Application logs
   - Errors
   - Request counts
   - Response times

4. Click **"Metrics"**
5. View:
   - CPU usage
   - Memory usage
   - Request count
   - Error rate

## Backup Strategy

### Database Backups

**Render PostgreSQL (Free):**
- Automatic backups: 90 days retention
- Manual backup: Click **"Backup"** → **"Create Backup"**
- Restore: Click **"Restore"** on any backup

**Recommended:** Export critical data weekly:
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Code Backups

**GitHub:**
- All code is already backed up
- Create releases for versions:
  ```bash
  git tag -a v1.0.0 -m "Production Release"
  git push origin v1.0.0
  ```

---

# 🐛 Troubleshooting

## Common Issues

### Issue 1: Backend Won't Start

**Symptoms:**
- Render shows "Crash"
- Logs show: `Error: Cannot find module`

**Solution:**
```bash
# Check package.json has correct start script
"scripts": {
  "start": "node server.js"
}

# Make sure server.js exists in root
# Run locally first: npm start
```

### Issue 2: CORS Errors

**Symptoms:**
- Frontend can't reach backend
- Console: `Access to fetch blocked by CORS policy`

**Solution:**
1. Check backend CORS_ORIGIN env var:
   ```
   CORS_ORIGIN=https://ethoslife.vercel.app
   ```
2. Restart backend service
3. Clear browser cache

### Issue 3: Database Connection Failed

**Symptoms:**
- Logs: `Error: connect ECONNREFUSED`
- Backend crashes on startup

**Solution:**
1. Check DATABASE_URL is correct
2. Verify database is running (Render Dashboard)
3. Check SSL mode:
   ```
   DATABASE_URL=postgresql://...?sslmode=require
   ```
4. Test connection locally with same URL

### Issue 4: Frontend Shows Blank Page

**Symptoms:**
- Vercel deploy succeeds
- Page loads but blank

**Solution:**
1. Check browser console for errors
2. Verify VITE_API_URL is set correctly
3. Check build logs in Vercel
4. Try: `vercel --prod --force`

### Issue 5: Environment Variables Not Working

**Symptoms:**
- `process.env.X` is undefined

**Solution:**
**Backend (Render):**
- Variables must be in Render Dashboard → Environment
- Redeploy after adding variables

**Frontend (Vercel):**
- Variables must start with `VITE_`
- Add in Vercel Dashboard → Settings → Environment Variables
- Redeploy

---

## Performance Optimization

### Frontend (Vercel)

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
})
```

### Backend (Render)

```javascript
// server.js - Enable compression
import compression from 'compression';
app.use(compression());

// Enable caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

---

# 📊 Cost Management

## Free Tier Limits

**Vercel Hobby (Free):**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ 100GB bandwidth to blob storage
- ❌ No custom domain analytics
- ❌ No priority support

**Render Free PostgreSQL:**
- ✅ 1GB storage
- ✅ 90 days backups
- ❌ No point-in-time recovery
- ❌ Limited to 1 database

**Render Starter ($7-19/month):**
- ✅ No sleep (always on)
- ✅ 512MB RAM
- ✅ 0.5 CPU
- ✅ Auto-deploy from Git
- ❌ No auto-scaling

## When to Upgrade

**Upgrade Vercel to Pro ($20/month) when:**
- Need custom domain analytics
- Want priority support
- Exceed 100GB bandwidth
- Need team collaboration

**Upgrade Render to Standard ($25+/month) when:**
- Need more RAM (>512MB)
- Need auto-scaling
- Want SLA guarantee
- Need more CPU

## Cost Optimization Tips

1. **Use Vercel Free tier** - Sufficient for most startups
2. **Render Starter is enough** - Don't overpay for Standard initially
3. **Monitor database size** - Stay under 1GB free limit
4. **Optimize images** - Reduce bandwidth usage
5. **Use CDN** - Vercel Edge Network is free
6. **Cache aggressively** - Reduce API calls

---

# 🎉 Deployment Checklist

## Pre-Deployment

- [ ] Code tested locally
- [ ] All environment variables documented
- [ ] `.env.example` created
- [ ] `render.yaml` configured
- [ ] `vercel.json` configured
- [ ] GitHub repository ready

## Database

- [ ] Render account created
- [ ] PostgreSQL database created
- [ ] Connection string saved
- [ ] Database accessible from backend

## Backend

- [ ] Render Web Service created
- [ ] All environment variables set
- [ ] Starter plan selected (no sleep)
- [ ] Health check configured
- [ ] Auto-deploy enabled
- [ ] Backend URL noted

## Frontend

- [ ] Vercel account created
- [ ] Project connected to GitHub
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables set
- [ ] Frontend URL noted

## Integration

- [ ] CORS configured on backend
- [ ] Frontend API URL points to backend
- [ ] Health endpoint accessible
- [ ] No CORS errors in console
- [ ] Authentication flow tested

## Post-Deployment

- [ ] Landing page loads
- [ ] Registration works
- [ ] Login works
- [ ] Health modules accessible
- [ ] API calls succeed
- [ ] Database saves data
- [ ] Logs show no errors

## Monitoring

- [ ] Vercel analytics enabled
- [ ] Render logs accessible
- [ ] Error tracking set up
- [ ] Backup strategy configured
- [ ] Domain configured (optional)

---

# 📞 Support Resources

## Vercel
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Status: https://www.vercel-status.com/

## Render
- Docs: https://render.com/docs
- Support: https://render.com/support
- Status: https://status.render.com/

## Community
- Vercel Discord: https://vercel.com/discord
- Render Community: https://community.render.com

---

**Last Updated:** March 9, 2026
**Status:** Production Ready ✅
**Estimated Setup Time:** 30-45 minutes
