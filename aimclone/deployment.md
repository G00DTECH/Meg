# Deployment Guide

Step-by-step guide to deploy your AIM chat application.

## Prerequisites

- GitHub account (for deployment via Git)
- Railway account OR Render account (for backend)
- Netlify account (for frontend)

## Step 1: Deploy Backend

### Option A: Railway (Recommended - Free Tier)

1. **Sign up at [railway.app](https://railway.app)**

2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select your repository
   - Choose the `backend` folder (or root if backend is in root)

3. **Configure (if needed):**
   - Railway auto-detects Node.js apps
   - No configuration needed!
   - It will run `npm install` and `npm start` automatically

4. **Generate domain:**
   - Go to "Settings" tab
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://your-app-production.up.railway.app`)

5. **Test your backend:**
   ```bash
   curl https://your-app-production.up.railway.app/health
   ```

   You should see:
   ```json
   {"status":"ok","users":0,"uptime":10}
   ```

### Option B: Render (Alternative - Free Tier)

1. **Sign up at [render.com](https://render.com)**

2. **Create new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure:**
   - Name: `aim-chat-backend`
   - Root Directory: `backend` (if in subfolder)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy the URL (e.g., `https://aim-chat-backend.onrender.com`)

5. **Test your backend:**
   ```bash
   curl https://aim-chat-backend.onrender.com/health
   ```

## Step 2: Update Frontend Configuration

1. **Open `frontend/app.js`**

2. **Find this line (around line 2-6):**
   ```javascript
   const BACKEND_URL = window.location.hostname === 'localhost'
       ? 'http://localhost:3001'
       : 'https://your-backend-url.railway.app';
   ```

3. **Replace with your actual backend URL:**
   ```javascript
   const BACKEND_URL = window.location.hostname === 'localhost'
       ? 'http://localhost:3001'
       : 'https://your-app-production.up.railway.app'; // Your actual URL
   ```

4. **Save the file**

## Step 3: Deploy Frontend

### Option A: Netlify Drag & Drop (Easiest!)

1. **Go to [app.netlify.com/drop](https://app.netlify.com/drop)**

2. **Drag the `frontend` folder** onto the drop zone

3. **Wait 10 seconds** - done!

4. **Get your URL:**
   - Netlify gives you a random URL like `https://remarkable-unicorn-123abc.netlify.app`
   - You can customize it in Site Settings → Domain Management

### Option B: Netlify GitHub (Recommended for Updates)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/aim-chat.git
   git push -u origin main
   ```

2. **Create new site on Netlify:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your repository

3. **Configure build settings:**
   - Base directory: `frontend` (if in subfolder, otherwise leave empty)
   - Build command: (leave empty)
   - Publish directory: `.` or `frontend`

4. **Deploy:**
   - Click "Deploy site"
   - Wait 30 seconds
   - Your site is live!

### Option C: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   netlify deploy --prod
   ```

4. **Follow prompts:**
   - Create & configure a new site
   - Publish directory: `.`
   - Done!

## Step 4: Test Your Deployment

1. **Open your Netlify URL** in a browser

2. **Sign on** with a screen name (e.g., "TestUser1")

3. **Open the same URL in a different browser** (or incognito window)

4. **Sign on** with a different name (e.g., "TestUser2")

5. **You should see both users in the buddy list!**

6. **Double-click a buddy** and send a message

7. **Verify real-time messaging works**

## Step 5: Share & Enjoy!

Share your Netlify URL with friends to test real-time chatting!

Example: `https://nostalgic-aim-chat.netlify.app`

## Troubleshooting

### "Cannot connect to server"

**Problem:** Frontend can't reach backend

**Solutions:**
1. Verify backend is running: `curl https://your-backend-url/health`
2. Check BACKEND_URL in `app.js` is correct
3. Check browser console for CORS errors
4. Ensure backend allows CORS (it should by default)

### "Screen name already in use"

**Problem:** Someone is using that name, or you're reconnecting too quickly

**Solutions:**
1. Use a different screen name
2. Wait 30 seconds and try again
3. Restart the backend (or wait for idle timeout)

### Backend shows "Application failed to respond"

**Problem:** Backend crashed or didn't start

**Solutions:**
1. Check Railway/Render logs
2. Verify `package.json` has correct start script
3. Ensure all dependencies are in `package.json`
4. Check for port binding issues

### Messages not appearing

**Problem:** WebSocket connection issues

**Solutions:**
1. Check browser console for errors
2. Verify Socket.io connection (should see "connected" in console)
3. Try refreshing both browser windows
4. Check if backend rate limiting is active

## Updating Your Deployment

### Update Backend

**Railway:**
- Push to GitHub
- Railway auto-deploys

**Render:**
- Push to GitHub
- Render auto-deploys (may take 2-3 minutes)

### Update Frontend

**Netlify (GitHub):**
- Push to GitHub
- Netlify auto-deploys

**Netlify (Drag & Drop):**
- Drag the updated folder again to the same site

**Netlify (CLI):**
```bash
cd frontend
netlify deploy --prod
```

## Custom Domain (Optional)

### Frontend (Netlify)

1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter your domain (e.g., `aim.yourdomain.com`)
4. Follow DNS configuration instructions
5. Netlify auto-provisions SSL certificate

### Backend (Railway)

1. Go to project Settings
2. Under "Domains", click "Add Custom Domain"
3. Enter your domain (e.g., `api.yourdomain.com`)
4. Configure DNS as instructed
5. Update BACKEND_URL in frontend `app.js`

## Cost Estimate

**Free Tier Limits:**

**Railway:**
- $5 free credit per month
- ~500 hours of runtime
- Enough for a prototype with moderate traffic

**Render:**
- Free tier available
- 750 hours per month
- Spins down after 15 min inactivity

**Netlify:**
- 100 GB bandwidth per month
- Unlimited sites
- More than enough for this project

**Total Cost: $0/month** for MVP testing!

## Monitoring

**Backend Health:**
```bash
# Check if backend is alive
curl https://your-backend-url/health

# Expected response:
{"status":"ok","users":0,"uptime":123}
```

**Frontend Health:**
- Just visit the URL
- Should see sign-on screen

**Logs:**
- Railway: Click on deployment → View Logs
- Render: Logs tab in dashboard
- Netlify: Deploys tab → Function logs (if applicable)

## Security Notes

**For production use, add:**
- [ ] User authentication
- [ ] Rate limiting per IP
- [ ] Input validation
- [ ] XSS protection
- [ ] HTTPS enforcement
- [ ] Environment variables for secrets
- [ ] Database for persistence
- [ ] Message encryption

**This MVP is for educational/testing purposes only!**

## Next Steps

1. ✅ Backend deployed
2. ✅ Frontend deployed
3. ✅ Real-time chat working
4. 🎉 Share with friends!

**Need help?** Check the main README.md or open an issue on GitHub.

---

**Happy Deployment!** 🚀
