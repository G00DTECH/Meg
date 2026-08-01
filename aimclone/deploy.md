# Deploy to Netlify

## Quick Deploy (Drag & Drop)

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the entire `aim-chat` folder onto the page
3. Done! Your site is live in seconds

## Deploy via Git (Recommended)

### Step 1: Create Git Repository

```bash
cd C:\Users\justin.harvey\aim-chat
git init
git add .
git commit -m "Initial commit - Nostalgic AIM chat"
```

### Step 2: Push to GitHub

1. Create a new repository on [GitHub](https://github.com/new)
2. Name it something like `aim-chat-nostalgic`
3. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/aim-chat-nostalgic.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (current directory)
5. Click "Deploy site"

Your site will be live at: `https://random-name.netlify.app`

### Step 4: Custom Domain (Optional)

1. In Netlify, go to **Domain settings**
2. Click **Add custom domain**
3. Enter your domain (e.g., `aim-chat.com`)
4. Follow the DNS configuration steps

## What Gets Deployed

```
aim-chat/
├── index.html          ✅ Main app
├── styles.css          ✅ All styling
├── app.js              ✅ Core logic
├── sounds.js           ✅ Sound system
├── easter-eggs.js      ✅ Fun interactions
├── netlify.toml        ✅ Netlify config
└── README.md           ✅ Documentation
```

## Environment Variables

None needed! This is a fully static app that works entirely in the browser.

## Testing Locally

Simply open `index.html` in any browser:
- Chrome (Recommended)
- Firefox
- Safari
- Edge

Or use a local server:
```bash
# Python
python -m http.server 8000

# Node.js (if you have npx)
npx serve

# Then open: http://localhost:8000
```

## Features That Work

✅ Sign-on with any screen name
✅ Buddy list with 14 demo buddies
✅ Open chat windows by double-clicking buddies
✅ Send and receive messages (simulated responses)
✅ Set away status with classic messages
✅ Easter eggs (try "a/s/l?" or Konami code!)
✅ Sounds and animations
✅ Idle detection
✅ Typing indicators
✅ All the nostalgic charm!

## Features That Need Backend (Future)

❌ Real multi-user chat (requires WebSocket server)
❌ Persistent buddy lists (requires database)
❌ User authentication (requires backend)
❌ Message history (requires storage)

For now, this is a **single-player nostalgic experience** with simulated buddies that respond to your messages!

## Troubleshooting

**Issue**: Sounds don't play
- **Solution**: Some browsers block autoplay. Click anywhere on the page first.

**Issue**: Animations are choppy
- **Solution**: Use Chrome or Edge for best performance.

**Issue**: Chat doesn't work
- **Solution**: Check browser console (F12) for errors. Make sure all JS files loaded.

## Making It Real Multi-User

Want real chat functionality? You'll need:

1. **Backend Server** (Node.js + Socket.io)
2. **Deploy backend** to Railway or Render
3. **Connect frontend** to backend WebSocket URL
4. **Add real user management**

Check out the earlier analysis for full architecture details!

## Share Your Site

Once deployed, share the link and watch people rediscover the joy of AIM! 😎

Example URLs:
- `https://nostalgic-aim.netlify.app`
- `https://aim-throwback.netlify.app`
- `https://remember-aim.netlify.app`

---

**Built with love for the golden age of instant messaging.** 💛

**P.S.** Don't forget to try the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A ✨
