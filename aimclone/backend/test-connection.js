// Simple test script to verify backend is working
// Run with: node test-connection.js

const io = require('socket.io-client');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

console.log('Testing connection to:', BACKEND_URL);

const socket = io(BACKEND_URL, {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected to server!');
  console.log('Socket ID:', socket.id);

  // Test sign on
  console.log('\n📝 Testing sign on...');
  socket.emit('sign_on', 'TestUser123');
});

socket.on('sign_on_success', (data) => {
  console.log('✅ Sign on successful!');
  console.log('Screen name:', data.screenName);

  // Test buddy list
  console.log('\n👥 Waiting for buddy list...');
});

socket.on('buddy_list', (buddies) => {
  console.log('✅ Received buddy list!');
  console.log('Online buddies:', buddies.length);
  console.log('Buddies:', buddies.map(b => b.screenName).join(', ') || 'None');

  console.log('\n✅ All tests passed!');
  console.log('Backend is working correctly.');

  // Disconnect
  setTimeout(() => {
    socket.disconnect();
    console.log('\n👋 Disconnected. Test complete!');
    process.exit(0);
  }, 1000);
});

socket.on('error', (data) => {
  console.error('❌ Error:', data.message);
  process.exit(1);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
  console.error('\nMake sure the backend server is running on', BACKEND_URL);
  process.exit(1);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.error('❌ Test timed out after 10 seconds');
  process.exit(1);
}, 10000);
