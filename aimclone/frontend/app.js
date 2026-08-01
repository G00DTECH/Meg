// Configuration
const BACKEND_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://your-backend-url.railway.app'; // Replace with your deployed backend URL

// State
let socket = null;
let currentUser = null;
let chatWindows = new Map(); // buddy name -> window element
let typingTimeouts = new Map();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeSignIn();
    loadScreenName();
});

function initializeSignIn() {
    const signinButton = document.getElementById('signin-button');
    const screennameInput = document.getElementById('screenname-input');

    signinButton.addEventListener('click', signOn);
    screennameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') signOn();
    });
}

function loadScreenName() {
    const savedScreenName = localStorage.getItem('aim_screen_name');
    if (savedScreenName) {
        document.getElementById('screenname-input').value = savedScreenName;
    }
}

function signOn() {
    const screenName = document.getElementById('screenname-input').value.trim();
    const errorElement = document.getElementById('signin-error');

    if (!screenName) {
        errorElement.textContent = 'Please enter a screen name';
        return;
    }

    if (screenName.length > 20) {
        errorElement.textContent = 'Screen name too long (max 20 characters)';
        return;
    }

    errorElement.textContent = '';

    // Connect to server
    socket = io(BACKEND_URL, {
        transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
        socket.emit('sign_on', screenName);
    });

    socket.on('sign_on_success', (data) => {
        currentUser = data.screenName;
        localStorage.setItem('aim_screen_name', currentUser);
        showBuddyList();
        initializeSocketListeners();
        playSound('door-open');
    });

    socket.on('error', (data) => {
        errorElement.textContent = data.message;
    });

    socket.on('connect_error', () => {
        errorElement.textContent = 'Cannot connect to server. Please try again.';
    });
}

function showBuddyList() {
    document.getElementById('signin-screen').style.display = 'none';
    const buddyListWindow = document.getElementById('buddy-list-window');
    buddyListWindow.style.display = 'block';
    document.getElementById('current-user-name').textContent = currentUser;

    initializeBuddyListControls();
    makeDraggable(buddyListWindow);
}

function initializeBuddyListControls() {
    // Status dropdown
    const statusSelect = document.getElementById('status-select');
    statusSelect.addEventListener('change', (e) => {
        const status = e.target.value;
        if (status === 'away') {
            showAwayMessageDialog();
        } else {
            socket.emit('set_status', { status: 'available' });
        }
    });

    // Away message button
    const awayBtn = document.getElementById('away-message-btn');
    awayBtn.addEventListener('click', showAwayMessageDialog);

    // Sign off button
    document.getElementById('signoff-btn').addEventListener('click', signOff);

    // Away dialog controls
    document.getElementById('away-dialog-close').addEventListener('click', hideAwayMessageDialog);
    document.getElementById('away-message-cancel').addEventListener('click', hideAwayMessageDialog);
    document.getElementById('away-message-save').addEventListener('click', saveAwayMessage);
}

function showAwayMessageDialog() {
    document.getElementById('away-dialog').style.display = 'block';
    makeDraggable(document.getElementById('away-dialog'));
}

function hideAwayMessageDialog() {
    document.getElementById('away-dialog').style.display = 'none';
    // Reset status dropdown if they cancel
    if (document.getElementById('status-select').value === 'away') {
        document.getElementById('status-select').value = 'available';
    }
}

function saveAwayMessage() {
    const awayMessage = document.getElementById('away-message-text').value.trim();
    socket.emit('set_status', {
        status: 'away',
        awayMessage: awayMessage || 'I am away from my computer right now.'
    });
    document.getElementById('status-select').value = 'away';
    document.getElementById('away-message-btn').style.display = 'inline-block';
    hideAwayMessageDialog();
}

function signOff() {
    if (socket) {
        socket.disconnect();
    }

    // Close all chat windows
    chatWindows.forEach(window => window.remove());
    chatWindows.clear();

    // Reset UI
    document.getElementById('buddy-list-window').style.display = 'none';
    document.getElementById('signin-screen').style.display = 'block';
    document.getElementById('signin-error').textContent = '';

    currentUser = null;
    playSound('door-close');
}

function initializeSocketListeners() {
    socket.on('buddy_list', (buddies) => {
        updateBuddyList(buddies);
    });

    socket.on('user_signed_on', (data) => {
        showNotification(`${data.screenName} signed on`, 'info', 'Buddy Sign On');
        playSound('door-open');
        refreshBuddyList();
    });

    socket.on('user_signed_off', (data) => {
        showNotification(`${data.screenName} signed off`, 'info', 'Buddy Sign Off');
        playSound('door-close');

        // Close chat window if open
        if (chatWindows.has(data.screenName)) {
            chatWindows.get(data.screenName).remove();
            chatWindows.delete(data.screenName);
        }

        refreshBuddyList();
    });

    socket.on('user_status_changed', (data) => {
        refreshBuddyList();

        // Update chat window if open
        if (chatWindows.has(data.screenName)) {
            const window = chatWindows.get(data.screenName);
            const header = window.querySelector('.chat-header');

            if (data.status === 'away' && data.awayMessage) {
                const systemMsg = createSystemMessage(`${data.screenName} is away: ${data.awayMessage}`);
                window.querySelector('.chat-messages').appendChild(systemMsg);
                scrollToBottom(window.querySelector('.chat-messages'));
            }
        }
    });

    socket.on('receive_message', (data) => {
        handleIncomingMessage(data);
    });

    socket.on('message_sent', (data) => {
        // Confirmation that message was sent
    });

    socket.on('user_typing', (data) => {
        showTypingIndicator(data.from);
    });
}

function refreshBuddyList() {
    // Request updated buddy list
    // Note: In this implementation, we track it client-side
    // For a more robust solution, emit a request to server
}

function updateBuddyList(buddies) {
    const buddyListElement = document.getElementById('buddy-list');
    const onlineCountElement = document.getElementById('online-count');

    // Filter out current user
    const otherBuddies = buddies.filter(b => b.screenName !== currentUser);

    onlineCountElement.textContent = otherBuddies.length;

    if (otherBuddies.length === 0) {
        buddyListElement.innerHTML = '<div class="no-buddies">No buddies online</div>';
        return;
    }

    buddyListElement.innerHTML = '';

    otherBuddies.forEach(buddy => {
        const buddyItem = document.createElement('div');
        buddyItem.className = 'buddy-item';
        buddyItem.innerHTML = `
            <span class="buddy-status ${buddy.status}"></span>
            <span class="buddy-name">${buddy.screenName}</span>
        `;

        buddyItem.addEventListener('dblclick', () => {
            openChatWindow(buddy.screenName);
        });

        buddyListElement.appendChild(buddyItem);
    });
}

function openChatWindow(buddyName) {
    // If window already exists, focus it
    if (chatWindows.has(buddyName)) {
        const existingWindow = chatWindows.get(buddyName);
        existingWindow.style.zIndex = getHighestZIndex() + 1;
        return;
    }

    // Clone template
    const template = document.getElementById('chat-window-template');
    const chatWindow = template.content.cloneNode(true).firstElementChild;

    // Set buddy name
    chatWindow.querySelector('.chat-title').textContent = `Instant Message with ${buddyName}`;
    chatWindow.querySelector('.chat-buddy-name').textContent = buddyName;

    // Position window (cascade)
    const windowCount = chatWindows.size;
    chatWindow.style.top = `${100 + windowCount * 30}px`;
    chatWindow.style.left = `${300 + windowCount * 30}px`;
    chatWindow.style.zIndex = getHighestZIndex() + 1;

    // Add event listeners
    const closeBtn = chatWindow.querySelector('.chat-close');
    closeBtn.addEventListener('click', () => {
        chatWindow.remove();
        chatWindows.delete(buddyName);
    });

    const sendBtn = chatWindow.querySelector('.send-btn');
    const chatInput = chatWindow.querySelector('.chat-input');

    sendBtn.addEventListener('click', () => sendMessage(buddyName, chatWindow));
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(buddyName, chatWindow);
        }
    });

    // Typing indicator
    chatInput.addEventListener('input', () => {
        socket.emit('typing', { recipient: buddyName });
        socket.emit('activity'); // Update activity
    });

    // Warn and Block buttons (just for show)
    chatWindow.querySelector('.warn-btn').addEventListener('click', () => {
        showNotification('This feature is not available', 'error');
    });

    chatWindow.querySelector('.block-btn').addEventListener('click', () => {
        showNotification('This feature is not available', 'error');
    });

    document.body.appendChild(chatWindow);
    chatWindows.set(buddyName, chatWindow);

    makeDraggable(chatWindow);
    chatInput.focus();
}

function sendMessage(buddyName, chatWindow) {
    const chatInput = chatWindow.querySelector('.chat-input');
    const message = chatInput.value.trim();

    if (!message) return;

    // Send to server
    socket.emit('send_message', {
        recipient: buddyName,
        message: message
    });

    // Add to chat window
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageElement = createMessageElement(currentUser, message, true);
    messagesContainer.appendChild(messageElement);

    chatInput.value = '';
    scrollToBottom(messagesContainer);

    socket.emit('activity'); // Update activity
}

function handleIncomingMessage(data) {
    const { from, message, timestamp } = data;

    // Open chat window if not already open
    if (!chatWindows.has(from)) {
        openChatWindow(from);
    }

    const chatWindow = chatWindows.get(from);
    const messagesContainer = chatWindow.querySelector('.chat-messages');

    // Add message
    const messageElement = createMessageElement(from, message, false);
    messagesContainer.appendChild(messageElement);

    scrollToBottom(messagesContainer);
    playSound('message');

    // Show notification if window is not focused
    showNotification(`${from}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`, 'info', 'New Message');
}

function createMessageElement(sender, message, isOutgoing) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
        <div class="message-sender ${isOutgoing ? 'outgoing' : ''}">${sender}:</div>
        <div class="message-text">${escapeHtml(message)}</div>
        <div class="message-time">${time}</div>
    `;

    return messageDiv;
}

function createSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = text;
    return messageDiv;
}

function showTypingIndicator(buddyName) {
    if (!chatWindows.has(buddyName)) return;

    const chatWindow = chatWindows.get(buddyName);
    const indicator = chatWindow.querySelector('.typing-indicator');

    indicator.style.display = 'inline';

    // Clear existing timeout
    if (typingTimeouts.has(buddyName)) {
        clearTimeout(typingTimeouts.get(buddyName));
    }

    // Hide after 3 seconds
    const timeout = setTimeout(() => {
        indicator.style.display = 'none';
        typingTimeouts.delete(buddyName);
    }, 3000);

    typingTimeouts.set(buddyName, timeout);
}

function showNotification(message, type = 'info', title = 'AIM') {
    const container = document.getElementById('notification-container');

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-title">${title}</div>
        <div class="notification-message">${escapeHtml(message)}</div>
    `;

    container.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('removing');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function playSound(soundName) {
    // Sound effects would be loaded here
    // For now, we'll use visual feedback instead
    console.log(`Sound: ${soundName}`);
}

function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getHighestZIndex() {
    const windows = document.querySelectorAll('.window');
    let highest = 0;

    windows.forEach(window => {
        const zIndex = parseInt(window.style.zIndex) || 0;
        if (zIndex > highest) highest = zIndex;
    });

    return highest;
}

// Make windows draggable
function makeDraggable(element) {
    const titlebar = element.querySelector('.window-titlebar');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    titlebar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('control-btn')) return;

        isDragging = true;
        element.classList.add('dragging');
        element.style.zIndex = getHighestZIndex() + 1;

        initialX = e.clientX - (parseInt(element.style.left) || element.offsetLeft);
        initialY = e.clientY - (parseInt(element.style.top) || element.offsetTop);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        element.style.left = currentX + 'px';
        element.style.top = currentY + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.classList.remove('dragging');
        }
    });
}

// Track user activity
let activityInterval = setInterval(() => {
    if (socket && socket.connected) {
        socket.emit('activity');
    }
}, 60000); // Every minute

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (socket) {
        socket.disconnect();
    }
    clearInterval(activityInterval);
});

// Request buddy list updates periodically
setInterval(() => {
    if (socket && socket.connected && currentUser) {
        // Buddy list updates are handled via events
        // This is just to ensure we stay in sync
    }
}, 30000); // Every 30 seconds
