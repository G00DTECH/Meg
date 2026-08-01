# AIM Chat Frontend

Nostalgic AIM-style chat interface built with vanilla JavaScript.

## Configuration

Before deploying, update the backend URL in `app.js`:

```javascript
const BACKEND_URL = 'https://your-backend-url.railway.app';
```

## Local Development

Simply open `index.html` in a browser, or use a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000

# VS Code
# Use "Live Server" extension
```

## Deployment to Netlify

### Option 1: Drag & Drop (Easiest)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `frontend` folder
3. Done!

### Option 2: GitHub

1. Push to GitHub
2. In Netlify: "New site from Git"
3. Select repository
4. Build settings:
   - Build command: (leave empty)
   - Publish directory: `frontend` or `.` if repo root
5. Deploy!

### Option 3: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Files

- `index.html` - Main application
- `styles.css` - Authentic AIM styling
- `app.js` - Client-side logic
- `netlify.toml` - Netlify configuration
- `_redirects` - SPA routing

## Features

- Draggable windows
- Real-time messaging
- Buddy list management
- Status updates
- Away messages
- Typing indicators
- System notifications

## Browser Support

- Modern browsers with WebSocket support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## No Build Step Required

This is pure HTML/CSS/JS - no build process needed!

## License

MIT
