// AIM Chat Application - Real-time Backend Version
// Backend URL configuration
const BACKEND_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'YOUR_BACKEND_URL_HERE'; // Replace with your Railway/Render URL

class AIMChat {
    constructor() {
        this.currentUser = null;
        this.socket = null;
        this.buddies = new Map(); // Store online buddies
        this.chatWindows = new Map();
        this.awayStatus = false;
        this.awayMessage = '';
        this.userColors = new Map();
        this.typingTimeouts = new Map();

        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();

        // Simulate loading
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showSignOnWindow();
        }, 2000);
    }

    showLoadingScreen() {
        const messages = [
            'Connecting to AIM servers...',
            'Retrieving buddy list...',
            'Almost there...'
        ];

        let messageIndex = 0;
        const messageElement = document.querySelector('.loading-message');

        const messageInterval = setInterval(() => {
            messageIndex++;
            if (messageIndex < messages.length) {
                messageElement.textContent = messages[messageIndex];
            } else {
                clearInterval(messageInterval);
            }
        }, 600);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.display = 'none';
    }

    showSignOnWindow() {
        const signOnWindow = document.getElementById('signOnWindow');
        signOnWindow.style.display = 'block';
        this.makeDraggable(signOnWindow);
    }

    setupEventListeners() {
        // Sign on button
        document.getElementById('signOnBtn').addEventListener('click', () => {
            this.signOn();
        });

        // Enter key on password field
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.signOn();
            }
        });

        // Away button
        document.getElementById('awayBtn').addEventListener('click', () => {
            this.toggleAwayStatus();
        });

        // Set away button
        document.getElementById('setAwayBtn').addEventListener('click', () => {
            this.setAwayStatus();
        });

        // Away preset selection
        document.getElementById('awayPresets').addEventListener('change', (e) => {
            if (e.target.value) {
                document.getElementById('awayMessage').value = e.target.value;
            }
        });

        // Group header collapse
        document.addEventListener('click', (e) => {
            if (e.target.closest('.group-header')) {
                const header = e.target.closest('.group-header');
                this.toggleGroup(header);
            }
        });
    }

    connectToServer() {
        console.log('Connecting to server at:', BACKEND_URL);

        this.socket = io(BACKEND_URL, {
            transports: ['websocket', 'polling']
        });

        // Connection events
        this.socket.on('connect', () => {
            console.log('Connected to server!');
            // Send sign on request
            this.socket.emit('sign_on', this.currentUser);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            showWarning('Connection Error', 'Could not connect to AIM servers. Please try again later.');
        });

        // Sign on success
        this.socket.on('sign_on_success', (data) => {
            console.log('Signed on successfully as', data.screenName);
            this.showWelcomeMessage();
        });

        // Receive initial buddy list
        this.socket.on('buddy_list', (buddyList) => {
            console.log('Received buddy list:', buddyList);
            this.buddies.clear();
            buddyList.forEach(buddy => {
                if (buddy.screenName !== this.currentUser) {
                    this.buddies.set(buddy.screenName, buddy);
                }
            });
            this.populateBuddyList();
        });

        // Someone signed on
        this.socket.on('user_signed_on', (data) => {
            console.log('User signed on:', data.screenName);
            this.buddies.set(data.screenName, data);
            this.populateBuddyList();
            this.addSystemNotification(`${data.screenName} has signed on.`);
            playDoorOpen();
        });

        // Someone signed off
        this.socket.on('user_signed_off', (data) => {
            console.log('User signed off:', data.screenName);
            this.buddies.delete(data.screenName);
            this.populateBuddyList();
            this.addSystemNotification(`${data.screenName} has signed off.`);
            playDoorClose();
        });

        // User status changed
        this.socket.on('user_status_changed', (data) => {
            console.log('User status changed:', data);
            const buddy = this.buddies.get(data.screenName);
            if (buddy) {
                buddy.status = data.status;
                buddy.awayMessage = data.awayMessage;
                this.populateBuddyList();
            }
        });

        // Receive message
        this.socket.on('receive_message', (data) => {
            console.log('Received message from', data.from);
            this.handleIncomingMessage(data);
        });

        // Message sent confirmation
        this.socket.on('message_sent', (data) => {
            console.log('Message sent to', data.to);
        });

        // Typing indicator
        this.socket.on('user_typing', (data) => {
            const chatWindow = this.chatWindows.get(data.from);
            if (chatWindow) {
                this.showTypingIndicator(chatWindow, { name: data.from });
            }
        });

        // Error handling
        this.socket.on('error', (data) => {
            console.error('Socket error:', data.message);
            showWarning('Error', data.message);
        });
    }

    signOn() {
        const screenName = document.getElementById('screenName').value.trim();

        if (!screenName) {
            alert('Please enter a screen name!');
            return;
        }

        if (screenName.length > 20) {
            alert('Screen name must be 20 characters or less!');
            return;
        }

        this.currentUser = screenName;

        // Hide sign on window
        document.getElementById('signOnWindow').style.display = 'none';

        // Show buddy list
        this.showBuddyList();

        // Connect to server
        this.connectToServer();

        // Play door open sound
        playDoorOpen();
    }

    showWelcomeMessage() {
        const { greeting, suggestion } = window.easterEggs.timeBasedGreeting();

        showWarning(
            greeting,
            `Welcome! You've got buddies!\n\n${suggestion}`
        );

        // Start idle detection
        this.startIdleDetection();
    }

    showBuddyList() {
        const buddyListWindow = document.getElementById('buddyListWindow');
        buddyListWindow.style.display = 'flex';

        // Set screen name
        document.querySelector('.screen-name-display').textContent = this.currentUser;

        // Update buddy list title
        document.getElementById('buddyListTitle').textContent = `${this.currentUser} - Buddy List`;

        // Make draggable
        this.makeDraggable(buddyListWindow);
    }

    populateBuddyList() {
        const onlineContainer = document.getElementById('onlineBuddies');
        const offlineContainer = document.getElementById('offlineBuddies');

        onlineContainer.innerHTML = '';
        offlineContainer.innerHTML = '';

        let onlineCount = 0;

        this.buddies.forEach((buddy, screenName) => {
            const buddyElement = this.createBuddyElement({
                name: screenName,
                status: buddy.status,
                awayMessage: buddy.awayMessage,
                online: true
            });
            onlineContainer.appendChild(buddyElement);
            onlineCount++;
        });

        // Update counts
        const totalCount = this.buddies.size;
        document.querySelector('[data-group="online"]').parentElement.querySelector('.buddy-count').textContent = `(${onlineCount}/${totalCount})`;
        document.querySelector('[data-group="offline"]').parentElement.querySelector('.buddy-count').textContent = `(0)`;
        document.getElementById('totalBuddyCount').textContent = `${onlineCount} ${onlineCount === 1 ? 'buddy' : 'buddies'} online`;

        // Check buddy list capacity
        checkBuddyListCapacity(this.buddies.size);
    }

    createBuddyElement(buddy) {
        const div = document.createElement('div');
        div.className = 'buddy-item';

        if (buddy.status === 'away') {
            div.classList.add('away');
        } else {
            div.classList.add('online');
        }

        const statusIndicator = buddy.status === 'away'
            ? '<span class="status-indicator away-indicator">💤</span>'
            : '';

        // Random icon for visual variety
        const icons = ['😎', '🤘', '⚡', '🌟', '🎮', '🎵', '🌈', '💀', '🔥', '✨'];
        const icon = icons[Math.floor(Math.random() * icons.length)];

        div.innerHTML = `
            <div class="buddy-icon">${icon}</div>
            <div class="buddy-name">${buddy.name}</div>
            ${statusIndicator}
        `;

        // Click to open chat
        div.addEventListener('dblclick', () => {
            this.openChatWindow(buddy);
        });

        // Triple-click for profile
        window.easterEggs.setupBuddyTripleClick(div, buddy.name);

        return div;
    }

    toggleGroup(header) {
        const content = header.parentElement.querySelector('.group-content');
        content.classList.toggle('collapsed');
        header.classList.toggle('collapsed');
    }

    openChatWindow(buddy) {
        // Check if chat window already exists
        if (this.chatWindows.has(buddy.name)) {
            const existingWindow = this.chatWindows.get(buddy.name);
            existingWindow.style.display = 'flex';
            existingWindow.style.zIndex = 1000 + this.chatWindows.size;
            return;
        }

        const template = document.getElementById('chatWindowTemplate');
        const chatWindow = template.content.cloneNode(true).querySelector('.chat-window');

        // Set buddy name in title
        chatWindow.querySelector('.buddy-name-title').textContent = buddy.name;
        chatWindow.querySelector('.buddy-name-typing').textContent = buddy.name;

        // Position window
        const offset = this.chatWindows.size * 30;
        chatWindow.style.top = `${20 + offset}%`;
        chatWindow.style.right = `${10 + offset}px`;
        chatWindow.style.zIndex = 1000 + this.chatWindows.size;

        // Setup chat functionality
        this.setupChatWindow(chatWindow, buddy);

        document.body.appendChild(chatWindow);
        this.chatWindows.set(buddy.name, chatWindow);
        this.makeDraggable(chatWindow);
    }

    setupChatWindow(chatWindow, buddy) {
        const input = chatWindow.querySelector('.chat-input');
        const sendBtn = chatWindow.querySelector('.send-btn');
        const warnBtn = chatWindow.querySelector('.warn-btn');
        const closeBtn = chatWindow.querySelector('.close-btn');

        // Send message
        const sendMessage = () => {
            const message = input.value.trim();
            if (!message) return;

            // Check for easter eggs (some still work client-side)
            const easterEgg = window.easterEggs.checkMessageForEasterEgg(message, chatWindow);

            // Add to UI immediately
            this.addMessage(chatWindow, this.currentUser, message, true);
            input.value = '';
            playSendSound();

            // Send to server
            this.socket.emit('send_message', {
                recipient: buddy.name,
                message: message
            });
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Typing indicator
        let typingTimer;
        input.addEventListener('input', () => {
            clearTimeout(typingTimer);
            this.socket.emit('typing', { recipient: buddy.name });

            // Stop typing after 1 second of no input
            typingTimer = setTimeout(() => {
                // Could emit 'stopped_typing' if backend supports it
            }, 1000);
        });

        // Warn button
        warnBtn.addEventListener('click', () => {
            showRateLimitWarning();
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            chatWindow.style.display = 'none';
            this.addSystemMessage(chatWindow, `You have closed the chat window with ${buddy.name}.`);
        });
    }

    handleIncomingMessage(data) {
        const { from, message, timestamp } = data;

        // Open chat window if it doesn't exist
        if (!this.chatWindows.has(from)) {
            this.openChatWindow({ name: from });
        }

        const chatWindow = this.chatWindows.get(from);

        // Hide typing indicator
        this.hideTypingIndicator(chatWindow);

        // Add message
        this.addMessage(chatWindow, from, message, false);

        // Play sound
        playMessageSound();

        // Wobble buddy icon
        const buddyElements = document.querySelectorAll('.buddy-item');
        buddyElements.forEach(el => {
            if (el.querySelector('.buddy-name').textContent === from) {
                el.classList.add('message-received');
                setTimeout(() => el.classList.remove('message-received'), 500);
            }
        });
    }

    addMessage(chatWindow, username, text, isCurrentUser = false) {
        const messagesContainer = chatWindow.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';

        const timestamp = this.formatTimestamp(new Date());
        const color = this.getUserColor(username);

        messageDiv.innerHTML = `
            <span class="message-username" style="color: ${color}">${username}:</span>
            <span class="message-text">${this.escapeHtml(text)}</span>
            <span class="message-timestamp">${timestamp}</span>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addSystemMessage(chatWindow, text) {
        const messagesContainer = chatWindow.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'system-message';
        messageDiv.textContent = text;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addSystemNotification(text) {
        // Add notification to all open chat windows
        this.chatWindows.forEach(chatWindow => {
            this.addSystemMessage(chatWindow, text);
        });
    }

    showTypingIndicator(chatWindow, buddy) {
        const indicator = chatWindow.querySelector('.typing-indicator');
        indicator.style.display = 'flex';

        // Clear existing timeout
        const existingTimeout = this.typingTimeouts.get(buddy.name);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        // Auto-hide after 3 seconds
        const timeout = setTimeout(() => {
            this.hideTypingIndicator(chatWindow);
        }, 3000);

        this.typingTimeouts.set(buddy.name, timeout);
    }

    hideTypingIndicator(chatWindow) {
        const indicator = chatWindow.querySelector('.typing-indicator');
        indicator.style.display = 'none';
    }

    formatTimestamp(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        return `(${hours}:${minutes}:${seconds} ${ampm})`;
    }

    getUserColor(username) {
        if (!this.userColors.has(username)) {
            const colors = ['#0000FF', '#FF0000', '#008000', '#800080', '#FF6600', '#008080'];
            const color = colors[this.userColors.size % colors.length];
            this.userColors.set(username, color);
        }
        return this.userColors.get(username);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    toggleAwayStatus() {
        if (this.awayStatus) {
            // Return from away
            this.awayStatus = false;
            this.awayMessage = '';
            const statusBtn = document.getElementById('awayBtn');
            statusBtn.textContent = 'I\'m Away';
            statusBtn.classList.remove('away');

            // Update server
            this.socket.emit('set_status', {
                status: 'available',
                awayMessage: ''
            });

            playDoorOpen();
            showWarning('Welcome Back!', 'You are no longer away. Your buddies can see you\'re online! 👋');
        } else {
            // Show away message window
            const awayWindow = document.getElementById('awayMessageWindow');
            awayWindow.style.display = 'block';
            this.makeDraggable(awayWindow);
        }
    }

    setAwayStatus() {
        const awayMessage = document.getElementById('awayMessage').value.trim();

        if (!awayMessage) {
            alert('Please enter an away message or select a preset!');
            return;
        }

        this.awayStatus = true;
        this.awayMessage = awayMessage;

        const statusBtn = document.getElementById('awayBtn');
        statusBtn.textContent = 'Return';
        statusBtn.classList.add('away');

        // Update server
        this.socket.emit('set_status', {
            status: 'away',
            awayMessage: awayMessage
        });

        closeAwayWindow();
        playAwaySound();

        showWarning('Away Status Set', `Away message: "${awayMessage}"\n\nYour buddies will see this when they message you! 💤`);
    }

    startIdleDetection() {
        let idleTimer;
        const IDLE_TIME = 10 * 60 * 1000; // 10 minutes

        const resetIdleTimer = () => {
            clearTimeout(idleTimer);

            // Send activity to server
            if (this.socket && this.socket.connected) {
                this.socket.emit('activity');
            }

            idleTimer = setTimeout(() => {
                if (!this.awayStatus) {
                    console.log('User went idle');
                    // Note: Backend handles auto-away after 5 minutes
                }
            }, IDLE_TIME);
        };

        // Reset on any activity
        document.addEventListener('mousemove', resetIdleTimer);
        document.addEventListener('keypress', resetIdleTimer);
        document.addEventListener('click', resetIdleTimer);

        resetIdleTimer();
    }

    makeDraggable(element) {
        const titleBar = element.querySelector('.title-bar');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        titleBar.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;

            isDragging = true;
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
            element.style.zIndex = 1000 + Date.now();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            element.style.left = currentX + 'px';
            element.style.top = currentY + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
            element.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
}

// Helper functions for modals
function showWarning(title, message) {
    const modal = document.getElementById('warningModal');
    const titleElement = modal.querySelector('h2');
    const textElement = modal.querySelector('.warning-text');

    titleElement.textContent = title;
    textElement.textContent = message;
    modal.style.display = 'flex';
}

function closeWarningModal() {
    const modal = document.getElementById('warningModal');
    modal.style.display = 'none';
}

function closeAwayWindow() {
    const awayWindow = document.getElementById('awayMessageWindow');
    awayWindow.style.display = 'none';
    document.getElementById('awayMessage').value = '';
    document.getElementById('awayPresets').value = '';
}

function setAwayStatus(message) {
    if (window.aimChat) {
        document.getElementById('awayMessage').value = message;
        window.aimChat.setAwayStatus();
    }
}

function addSystemMessage(chatWindow, message) {
    if (window.aimChat) {
        window.aimChat.addSystemMessage(chatWindow, message);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aimChat = new AIMChat();
});
