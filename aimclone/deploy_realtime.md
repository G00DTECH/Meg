# Deploy Real-Time AIM Chat (Full Instructions)

This guide will help you deploy the complete, working multi-user AIM chat with real-time messaging.

## Overview

You need to deploy **two parts**:
1. **Backend** (Node.js + Socket.io) - Handles real-time messaging
2. **Frontend** (Static HTML/CSS/JS) - The nostalgic AIM interface

## Part 1: Deploy Backend (Railway - Easiest)

### Option A: Railway (Recommended - Free Tier)

1. **Install Railway CLI** (if you want to use CLI):
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy via GitHub (Easiest)**:
   - Go to [Railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your repository
   - Choose the `backend` folder (or configure root path)
   - Railway auto-detects Node.js and deploys!

3. **Alternative: Deploy via CLI**:
   ```bash
   cd aim-chat/backend
   railway login
   railway init
   railway up
   ```

4. **Get your backend URL**:
   - In Railway dashboard, click your project
   - Go to "Settings" → "Domains"
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://your-app.railway.app`)

### Option B: Render (Also Free)

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: aim-chat-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
5. Click "Create Web Service"
6. Wait for deployment (3-5 minutes)
7. Copy your service URL (e.g., `https://aim-chat-backend.onrender.com`)

### Verify Backend is Running

Visit your backend URL in a browser. You should see:
```json
{
  "message": "AIM Chat Server",
  "users": 0
}
```

## Part 2: Configure Frontend

1. **Update Backend URL** in `app-realtime.js`:

   Open `aim-chat/app-realtime.js` and find this line (near the top):

   ```javascript
   const BACKEND_URL = window.location.hostname === 'localhost'
       ? 'http://localhost:3001'
       : 'YOUR_BACKEND_URL_HERE'; // Replace with your Railway/Render URL
   ```

   Replace `'YOUR_BACKEND_URL_HERE'` with your actual backend URL:

   ```javascript
   const BACKEND_URL = window.location.hostname === 'localhost'
       ? 'http://localhost:3001'
       : 'https://your-app.railway.app'; // Your actual Railway URL
   ```

2. **Save the file**

## Part 3: Deploy Frontend to Netlify

### Option A: Drag & Drop (Fastest)

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the entire `aim-chat` folder onto the page
3. Wait 30 seconds
4. Done! You'll get a URL like `https://random-name.netlify.app`

### Option B: GitHub + Netlify (Better for Updates)

1. **Push to GitHub**:
   ```bash
   cd aim-chat
   git init
   git add .
   git commit -m "Real-time AIM chat"
   git remote add origin https://github.com/YOUR_USERNAME/aim-chat.git
   git push -u origin main
   ```

2. **Deploy on Netlify**:
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings:
     - **Build command**: (leave empty)
     - **Publish directory**: `.`
   - Click "Deploy site"

3. **Get your site URL**: `https://your-site.netlify.app`

## Part 4: Test It!

1. **Open your Netlify URL** in two different browsers (or incognito mode)
2. **Sign in with different screen names** in each browser
3. **You should see each other** in the buddy list!
4. **Double-click a buddy** and send a message
5. **The message should appear** in the other person's chat window in real-time!

## Testing Locally First

Want to test before deploying?

1. **Start Backend**:
   ```bash
   cd aim-chat/backend
   npm install
   npm start
   ```
   Server runs on `http://localhost:3001`

2. **Open Frontend**:
   - Simply open `aim-chat/index.html` in your browser
   - The app will connect to `localhost:3001` automatically

3. **Test with Multiple Tabs**:
   - Open multiple browser tabs/windows
   - Sign in with different names
   - Chat between tabs!

## Troubleshooting

### "Could not connect to AIM servers"

**Problem**: Frontend can't reach backend

**Solutions**:
1. Check backend is running (visit backend URL in browser)
2. Verify you updated `BACKEND_URL` in `app-realtime.js`
3. Check browser console (F12) for errors
4. Make sure backend URL uses `https://` (not `http://` for deployed sites)

### "Screen name already in use"

**Problem**: Someone else is using that name (or you're still connected in another tab)

**Solution**: Try a different screen name or wait 30 seconds

### Backend goes to sleep (Render free tier)

**Problem**: Render free tier spins down after 15 min of inactivity

**Solutions**:
1. Upgrade to paid plan ($7/month)
2. Use Railway instead (better free tier)
3. Use a ping service like UptimeRobot to keep it awake

### No one shows up in buddy list

**Problem**: Other users aren't connected

**Solution**: Make sure at least 2 people are signed in at the same time!

## Cost

**Total Cost: $0**
- Railway backend: Free tier (500 hours/month)
- Netlify frontend: Free tier (100GB bandwidth)
- Perfect for personal use or small friend groups!

## Upgrading for More Users

Free tiers handle ~10-50 concurrent users. Need more?

**Railway Paid Plan**: $5/month + usage
- Scales automatically
- Better uptime
- More resources

**Render Paid Plan**: $7/month
- Always-on (no sleep)
- Faster startup
- Better for busy chat rooms

## Custom Domain (Optional)

Want `aim.yourname.com` instead of random Netlify URL?

1. Buy a domain (Namecheap, Google Domains, etc.)
2. In Netlify: Settings → Domain management → Add custom domain
3. Update your DNS records as instructed
4. Done! SSL certificate is automatic

## Environment Variables (Backend)

Railway and Render automatically set:
- `PORT` - Server port (auto-assigned)

No other config needed!

## Monitoring

Check backend health:
```bash
curl https://your-backend.railway.app/health
```

Returns:
```json
{
  "status": "ok",
  "users": 3,
  "uptime": 7200
}
```

## Features That Work

✅ Real-time messaging between users
✅ See who's online in buddy list
✅ Typing indicators
✅ Away status
✅ User sign on/off notifications
✅ Door sounds and animations
✅ Easter eggs (Konami code, "a/s/l?", etc.)
✅ Multiple simultaneous chat windows
✅ Draggable windows
✅ Rate limiting (20 messages per 10 seconds)
✅ Auto-away after 5 minutes idle

## What's Different from Demo Mode

**Demo Mode** (`app.js`):
- Fake buddies that auto-respond
- No real users
- Single-player experience

**Real-Time Mode** (`app-realtime.js`):
- Real users online
- Actual messaging
- True multi-user chat

## Share Your Site!

Once deployed, share your Netlify URL with friends:
- `https://nostalgic-aim.netlify.app`
- `https://aim-chat-2024.netlify.app`
- `https://throwback-messenger.netlify.app`

Everyone who visits can chat together in real-time! 🎉

## Security Notes

**Current Setup** (Development):
- No authentication (anyone can use any name)
- No message persistence (lost on refresh)
- No encryption (messages sent in plain text)
- No spam protection beyond rate limiting

**For Production** (if you want to make this serious):
- Add user authentication
- Store messages in database
- Add end-to-end encryption
- Implement better spam protection
- Add profanity filters
- Add reporting system

But for a fun nostalgic project with friends? The current setup is perfect! 😎

---

**Questions?** Check browser console (F12) for error messages or backend logs in Railway/Render dashboard.

**Enjoy your nostalgic AIM chat experience!** 💛
