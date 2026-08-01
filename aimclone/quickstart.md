# Quick Start Guide

Get AIM Chat running locally in 5 minutes!

## Prerequisites

- Node.js installed (v14 or higher)
- A web browser
- Two browser windows (to test chat between users)

## Step 1: Start the Backend (Terminal 1)

```bash
cd aim-chat/backend
npm install
npm start
```

You should see:
```
AIM Chat Server running on port 3001
```

Keep this terminal running!

## Step 2: Start the Frontend (Terminal 2)

Open a new terminal:

```bash
cd aim-chat/frontend

# Choose one:
python -m http.server 8000
# OR
npx http-server -p 8000
# OR just open index.html directly in browser
```

## Step 3: Test It Out!

1. **Open browser #1:**
   - Go to `http://localhost:8000`
   - Enter screen name: "CoolKid99"
   - Click "Sign On"

2. **Open browser #2 (or incognito):**
   - Go to `http://localhost:8000`
   - Enter screen name: "SkaterBoi"
   - Click "Sign On"

3. **Start chatting:**
   - In browser #1, you'll see "SkaterBoi" in the buddy list
   - Double-click "SkaterBoi" to open chat
   - Type a message and hit Send
   - Check browser #2 - message appears instantly!

## That's It!

You now have a working AIM-style chat app running locally.

## What's Next?

- Read [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to the web
- Read [README.md](README.md) for full documentation
- Customize the styling in `frontend/styles.css`
- Add features to `backend/server.js`

## Troubleshooting

**Backend won't start:**
- Make sure port 3001 is not in use
- Run `npm install` again
- Check Node.js version: `node --version` (should be v14+)

**Frontend can't connect:**
- Make sure backend is running on port 3001
- Check `app.js` - BACKEND_URL should be `http://localhost:3001`
- Open browser console (F12) for error messages

**Can't see other users:**
- Open browser console and check for Socket.io connection
- Make sure you're using different screen names
- Try refreshing both browsers

## Pro Tips

- Use browser DevTools (F12) to see real-time Socket.io events
- Check the Network tab to see WebSocket connection
- Use "Inspect Element" to see the nostalgic CSS styling
- Open 3-4 browser windows to simulate a busy chat room!

**Enjoy your trip back to 1999!** 🟡
