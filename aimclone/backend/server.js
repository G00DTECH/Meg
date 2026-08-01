const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory storage
const users = new Map(); // socketId -> { screenName, status, awayMessage, lastActivity }
const messageRateLimit = new Map(); // socketId -> timestamp[]

// Rate limiting config
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const RATE_LIMIT_MAX = 20; // 20 messages per window

// Helper functions
function getOnlineUsers() {
  return Array.from(users.values()).map(user => ({
    screenName: user.screenName,
    status: user.status,
    awayMessage: user.awayMessage
  }));
}

function checkRateLimit(socketId) {
  const now = Date.now();
  if (!messageRateLimit.has(socketId)) {
    messageRateLimit.set(socketId, []);
  }

  const timestamps = messageRateLimit.get(socketId).filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (timestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }

  timestamps.push(now);
  messageRateLimit.set(socketId, timestamps);
  return true;
}

function updateUserActivity(socketId) {
  const user = users.get(socketId);
  if (user) {
    user.lastActivity = Date.now();
    if (user.status === 'away') {
      user.status = 'available';
      user.awayMessage = '';
      io.emit('user_status_changed', {
        screenName: user.screenName,
        status: user.status,
        awayMessage: ''
      });
    }
  }
}

// Check for idle users every 30 seconds
setInterval(() => {
  const now = Date.now();
  const IDLE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  users.forEach((user, socketId) => {
    if (user.status === 'available' && now - user.lastActivity > IDLE_THRESHOLD) {
      user.status = 'away';
      user.awayMessage = 'I am away from my computer right now.';
      io.emit('user_status_changed', {
        screenName: user.screenName,
        status: user.status,
        awayMessage: user.awayMessage
      });
    }
  });
}, 30000);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('sign_on', (screenName) => {
    // Validate screen name
    if (!screenName || screenName.trim().length === 0 || screenName.length > 20) {
      socket.emit('error', { message: 'Invalid screen name' });
      return;
    }

    screenName = screenName.trim();

    // Check if screen name already in use
    const existingUser = Array.from(users.values()).find(
      user => user.screenName.toLowerCase() === screenName.toLowerCase()
    );

    if (existingUser) {
      socket.emit('error', { message: 'Screen name already in use' });
      return;
    }

    // Add user
    users.set(socket.id, {
      screenName,
      status: 'available',
      awayMessage: '',
      lastActivity: Date.now()
    });

    // Send success to user
    socket.emit('sign_on_success', { screenName });

    // Send current buddy list to new user
    socket.emit('buddy_list', getOnlineUsers());

    // Broadcast to all users that someone signed on
    socket.broadcast.emit('user_signed_on', {
      screenName,
      status: 'available'
    });

    console.log(`${screenName} signed on`);
  });

  socket.on('send_message', (data) => {
    const sender = users.get(socket.id);
    if (!sender) {
      socket.emit('error', { message: 'Not signed in' });
      return;
    }

    // Check rate limit
    if (!checkRateLimit(socket.id)) {
      socket.emit('error', {
        message: 'You are sending messages too quickly. Please slow down.'
      });
      return;
    }

    updateUserActivity(socket.id);

    const { recipient, message } = data;

    if (!message || message.trim().length === 0) {
      return;
    }

    // Find recipient
    const recipientEntry = Array.from(users.entries()).find(
      ([_, user]) => user.screenName === recipient
    );

    if (!recipientEntry) {
      socket.emit('error', { message: 'User not found' });
      return;
    }

    const [recipientSocketId, recipientUser] = recipientEntry;

    // Send message to recipient
    io.to(recipientSocketId).emit('receive_message', {
      from: sender.screenName,
      message: message.trim(),
      timestamp: Date.now()
    });

    // Echo back to sender for confirmation
    socket.emit('message_sent', {
      to: recipient,
      message: message.trim(),
      timestamp: Date.now()
    });

    console.log(`${sender.screenName} -> ${recipient}: ${message.trim()}`);
  });

  socket.on('set_status', (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    const { status, awayMessage } = data;

    if (['available', 'away'].includes(status)) {
      user.status = status;
      user.awayMessage = status === 'away' ? (awayMessage || 'I am away from my computer right now.') : '';
      user.lastActivity = Date.now();

      io.emit('user_status_changed', {
        screenName: user.screenName,
        status: user.status,
        awayMessage: user.awayMessage
      });

      console.log(`${user.screenName} status changed to ${status}`);
    }
  });

  socket.on('typing', (data) => {
    const sender = users.get(socket.id);
    if (!sender) return;

    const { recipient } = data;

    // Find recipient
    const recipientEntry = Array.from(users.entries()).find(
      ([_, user]) => user.screenName === recipient
    );

    if (recipientEntry) {
      const [recipientSocketId] = recipientEntry;
      io.to(recipientSocketId).emit('user_typing', {
        from: sender.screenName
      });
    }
  });

  socket.on('activity', () => {
    updateUserActivity(socket.id);
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const { screenName } = user;

      // Remove user
      users.delete(socket.id);
      messageRateLimit.delete(socket.id);

      // Broadcast to all users that someone signed off
      io.emit('user_signed_off', { screenName });

      console.log(`${screenName} signed off`);
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    users: users.size,
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'AIM Chat Server',
    users: users.size
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`AIM Chat Server running on port ${PORT}`);
});
