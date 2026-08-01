# AIM Chat Backend Server

Express.js + Socket.io backend for real-time instant messaging.

## Quick Start

```bash
npm install
npm start
```

Server runs on port 3001 (or PORT environment variable).

## Deployment

### Railway (Recommended)

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway init
railway up
```

3. Get your URL:
```bash
railway domain
```

### Render

1. Create new Web Service on [render.com](https://render.com)
2. Connect GitHub repository
3. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Deploy!

### Manual Deployment

Required environment variables:
- `PORT` - Server port (auto-set by most platforms)

## API Endpoints

### HTTP Endpoints

- `GET /` - Server info and status
- `GET /health` - Health check (returns user count and uptime)

### Socket.io Events

**Client → Server:**
- `sign_on` - Sign on with screen name
- `send_message` - Send message to recipient
- `set_status` - Update user status (available/away)
- `typing` - Notify recipient of typing
- `activity` - Update last activity timestamp

**Server → Client:**
- `sign_on_success` - Sign on confirmation
- `buddy_list` - Initial buddy list
- `user_signed_on` - New user notification
- `user_signed_off` - User disconnect notification
- `user_status_changed` - Status update notification
- `receive_message` - Incoming message
- `message_sent` - Outgoing message confirmation
- `user_typing` - Typing notification
- `error` - Error message

## Rate Limiting

- 20 messages per 10 seconds per user
- Prevents spam and abuse

## Auto-Away

Users are automatically set to "Away" after 5 minutes of inactivity.

## Monitoring

Check server health:
```bash
curl https://your-app.railway.app/health
```

Response:
```json
{
  "status": "ok",
  "users": 5,
  "uptime": 3600
}
```

## Testing

Start server locally:
```bash
npm start
```

Test with Socket.io client or use the frontend application.

## Production Considerations

For production deployment, consider:
- Database for user persistence (Redis, PostgreSQL)
- Session management
- Authentication/authorization
- Rate limiting per IP
- Message persistence
- Horizontal scaling with Redis adapter
- SSL/TLS encryption
- Logging and monitoring
- Error tracking (Sentry, etc.)

## License

MIT
