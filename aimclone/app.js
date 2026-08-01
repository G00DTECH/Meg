// AIM Chat Application - Main Logic
class AIMChat {
    constructor() {
        this.currentUser = null;
        this.buddies = this.generateDemoBuddies();
        this.chatWindows = new Map();
        this.awayStatus = false;
        this.awayMessage = '';
        this.userColors = new Map();
        this.msgCounts = new Map(); // buddy name -> sent message count
        this.topZ = 100; // monotonic z-index counter for window stacking

        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();

        // Simulate loading
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showSignOnWindow();
        }, 3000);
    }

    showLoadingScreen() {
        const messages = [
            'Connecting to AIM servers...',
            'Retrieving buddy list...',
            'Checking for new messages...',
            'Loading your profile...',
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
        this.addResizeHandles(signOnWindow);
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
            this.openAwayMessageWindow();
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

    signOn() {
        const screenName = document.getElementById('screenName').value.trim();

        if (!screenName) {
            alert('Please enter a screen name!');
            return;
        }

        this.currentUser = screenName;

        // Hide sign on window
        document.getElementById('signOnWindow').style.display = 'none';

        // Show buddy list
        this.showBuddyList();

        // Play door open sound
        playDoorOpen();

        // Show welcome message
        this.showWelcomeMessage();

        // Randomly trigger connection lost toast
        window.easterEggs.randomConnectionLost();
    }

    showWelcomeMessage() {
        const { greeting, suggestion } = window.easterEggs.timeBasedGreeting();

        showWarning(
            greeting,
            `Welcome! You've got buddies!\n\n${suggestion}`
        );
    }

    showBuddyList() {
        const buddyListWindow = document.getElementById('buddyListWindow');
        buddyListWindow.style.display = 'flex';

        // Set screen name
        document.querySelector('.screen-name-display').textContent = this.currentUser;

        // Update buddy list title
        document.getElementById('buddyListTitle').textContent = `${this.currentUser} - Buddy List`;

        // Populate buddies
        this.populateBuddyList();

        // Make draggable
        this.makeDraggable(buddyListWindow);
        this.addResizeHandles(buddyListWindow);
    }

    generateDemoBuddies() {
        const buddyNames = [
            'sk8erboi2003',
            'xXDarkAngelXx',
            'SoccerStar99',
            'PiNkPrInCeSs',
            'RockFan4Eva',
            'GamerGrl',
            'ChillDude420',
            'MusicLover',
            'BeachBum2k',
            'NightOwl247',
            'CoffeAddict',
            'BookWorm99',
            'TechGeek',
            'PartyAnimal'
        ];

        return buddyNames.map((name, index) => ({
            name,
            online: Math.random() > 0.3, // 70% online
            away: Math.random() > 0.7, // 30% of online are away
            idle: Math.random() > 0.8, // 20% of online are idle
            mobile: Math.random() > 0.85, // 15% on mobile
            icon: ['😎', '🤘', '⚡', '🌟', '🎮', '🎵', '🌈', '💀', '🔥', '✨'][index % 10]
        }));
    }

    populateBuddyList() {
        const onlineContainer = document.getElementById('onlineBuddies');
        const offlineContainer = document.getElementById('offlineBuddies');

        onlineContainer.innerHTML = '';
        offlineContainer.innerHTML = '';

        let onlineCount = 0;
        let offlineCount = 0;

        this.buddies.forEach(buddy => {
            const buddyElement = this.createBuddyElement(buddy);

            if (buddy.online) {
                onlineContainer.appendChild(buddyElement);
                onlineCount++;
            } else {
                offlineContainer.appendChild(buddyElement);
                offlineCount++;
            }
        });

        // Update counts
        this.updateBuddyCounts(onlineCount, offlineCount);

        // Check buddy list capacity
        checkBuddyListCapacity(this.buddies.length);
    }

    createBuddyElement(buddy) {
        const div = document.createElement('div');
        div.className = 'buddy-item';

        if (buddy.online) {
            if (buddy.away) {
                div.classList.add('away');
            } else if (buddy.idle) {
                div.classList.add('idle');
            } else {
                div.classList.add('online');
            }
        } else {
            div.classList.add('offline');
        }

        let statusIndicator = '';
        if (buddy.mobile && buddy.online) {
            statusIndicator = '<span class="status-indicator mobile-indicator">📱</span>';
        } else if (buddy.away) {
            statusIndicator = '<span class="status-indicator away-indicator">💤</span>';
        }

        div.innerHTML = `
            <div class="buddy-icon">${buddy.icon}</div>
            <div class="buddy-name">${buddy.name}</div>
            ${statusIndicator}
        `;

        // Click to open chat
        div.addEventListener('dblclick', () => {
            if (buddy.online) {
                this.openChatWindow(buddy);
            }
        });

        // Triple-click for profile
        window.easterEggs.setupBuddyTripleClick(div, buddy.name);

        return div;
    }

    updateBuddyCounts(onlineCount, offlineCount) {
        const totalCount = this.buddies.length;

        // Update group headers
        document.querySelector('[data-group="online"]').parentElement.querySelector('.buddy-count').textContent = `(${onlineCount}/${totalCount})`;
        document.querySelector('[data-group="offline"]').parentElement.querySelector('.buddy-count').textContent = `(${offlineCount})`;

        // Update status bar
        document.getElementById('totalBuddyCount').textContent = `${onlineCount} ${onlineCount === 1 ? 'buddy' : 'buddies'} online`;
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
            existingWindow.style.zIndex = ++this.topZ;
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
        chatWindow.style.zIndex = ++this.topZ;

        // Setup chat functionality
        this.setupChatWindow(chatWindow, buddy);

        document.body.appendChild(chatWindow);
        this.chatWindows.set(buddy.name, chatWindow);
        this.makeDraggable(chatWindow);
        this.addResizeHandles(chatWindow);

        // Show typing indicator after a short delay
        setTimeout(() => {
            this.showTypingIndicator(chatWindow, buddy);
        }, 1000);

        // Send initial message from buddy
        setTimeout(() => {
            this.receiveBuddyMessage(chatWindow, buddy, this.getRandomGreeting());
        }, 2500);

        // Play message sound
        playMessageSound();

        // Wobble buddy icon
        const buddyElements = document.querySelectorAll('.buddy-item');
        buddyElements.forEach(el => {
            if (el.querySelector('.buddy-name').textContent === buddy.name) {
                el.classList.add('message-received');
                setTimeout(() => el.classList.remove('message-received'), 500);
            }
        });
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

            // Check for easter eggs
            const easterEgg = window.easterEggs.checkMessageForEasterEgg(message, chatWindow);

            this.addMessage(chatWindow, this.currentUser, message, true);
            input.value = '';
            playSendSound();

            // Randomly fail to send (classic AIM experience)
            if (Math.random() < 0.05) { // 5% chance
                setTimeout(() => {
                    this.addErrorMessage(chatWindow, 'This message was not sent. Please try again.');
                }, 1000);
                return;
            }

            // If easter egg, respond with special message
            if (easterEgg && easterEgg.trigger) {
                setTimeout(() => {
                    this.showTypingIndicator(chatWindow, buddy);
                }, 500);

                setTimeout(() => {
                    this.receiveBuddyMessage(chatWindow, buddy, easterEgg.response);
                }, 2000);
            } else {
                // Count sent messages per buddy; every 3rd triggers the pasta cooker
                const count = (this.msgCounts.get(buddy.name) || 0) + 1;
                this.msgCounts.set(buddy.name, count);

                if (count % 3 === 0) {
                    // Pasta time — longer fake-typing delay to sell the wall of text
                    setTimeout(() => {
                        this.showTypingIndicator(chatWindow, buddy);
                    }, 600);
                    setTimeout(() => {
                        this.receiveBuddyMessage(chatWindow, buddy, this.pastaCooker(message));
                    }, 5000 + Math.random() * 2000);
                } else {
                    // Short response
                    setTimeout(() => {
                        this.showTypingIndicator(chatWindow, buddy);
                    }, Math.random() * 1000 + 500);
                    setTimeout(() => {
                        this.receiveBuddyMessage(chatWindow, buddy, this.getRandomResponse(message));
                    }, Math.random() * 2000 + 2000);
                }
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
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

    addErrorMessage(chatWindow, text) {
        const messagesContainer = chatWindow.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'error-message';
        messageDiv.innerHTML = `⚠️ ${this.escapeHtml(text)}`;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    receiveBuddyMessage(chatWindow, buddy, message) {
        this.hideTypingIndicator(chatWindow);
        this.addMessage(chatWindow, buddy.name, message, false);
        playMessageSound();

        // Wobble buddy icon
        const buddyElements = document.querySelectorAll('.buddy-item');
        buddyElements.forEach(el => {
            if (el.querySelector('.buddy-name').textContent === buddy.name) {
                el.classList.add('message-received');
                setTimeout(() => el.classList.remove('message-received'), 500);
            }
        });
    }

    showTypingIndicator(chatWindow, buddy) {
        const indicator = chatWindow.querySelector('.typing-indicator');
        indicator.style.display = 'flex';
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
        hours = hours ? hours : 12; // 0 should be 12

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

    getRandomGreeting() {
        const greetings = [
            'hey! what\'s up?',
            'yo!',
            'hey there!',
            'sup?',
            'hi! how are you?',
            'hey! long time no chat!',
            'what\'s going on?',
            'hey! what are you up to?'
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    getRandomResponse(message) {
        const responses = [
            'haha that\'s funny!',
            'yeah totally!',
            'omg really?',
            'lol',
            'that\'s cool!',
            'nice!',
            'awesome!',
            'for real?',
            'no way!',
            'haha yeah',
            'i know right?',
            'same here!',
            'interesting...',
            'tell me more!',
            'that\'s crazy!',
            'wow!',
            'haha nice one'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    pastaCooker(input) {
        // Extract a non-boring keyword from the user's message
        const stop = new Set(['the','a','an','is','it','to','in','on','at','of','and','or','but',
            'i','you','he','she','we','they','my','your','do','did','was','are','be','been',
            'that','this','what','how','when','where','who','have','has','not','no','so',
            'like','just','me','can','will','with','for','from','by','up','its','im','ok',
            'okay','lol','hi','hey','hello','yes','yeah','yea','nope','idk','ur','u','r']);
        const words = input.toLowerCase().replace(/[^a-z\s]/g,'').split(/\s+/)
            .filter(w => w.length > 2 && !stop.has(w));
        const kw  = words[Math.floor(Math.random() * words.length)] || input.split(' ')[0] || 'that';
        const kw2 = words.filter(w => w !== kw)[Math.floor(Math.random() * words.length)] || kw;
        const KW  = kw.toUpperCase();
        const Cap = kw.charAt(0).toUpperCase() + kw.slice(1);

        const pastas = [

`What the heck did you just say about ${kw}?? I'll have you know I graduated top of my AOL class, and I've been involved in numerous secret buddy list raids, and I have over 300 confirmed away messages. I am trained in digital warfare and I'm the top chatter in the entire IM network. You are nothing to me but just another screenname. I will warn you with a precision the likes of which has never been seen on this side of the dial-up connection, mark my words. You think you can get away with saying that stuff about ${kw} over the internet? Think again. As we speak I am contacting my network of chatters across 14 chat rooms and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your profile. You're going offline, kid. I can be anywhere, anytime, and I can warn you in over seven hundred ways, and that's just with my keyboard. Not only am I extensively trained in away message combat, but I have access to every AIM emoticon in existence and I will use them to their full extent to wipe your miserable buddy icon off the face of this list. If only you could have known what unholy retribution your little comment about ${kw} was going to bring down upon you. But you couldn't, you didn't, and now you're paying the price. You goshdarn fool. I will type words all over you and you will drown in them. You're going to regret this. :-)`,

`okay so i wasnt gonna say anything but you bringing up ${kw} just opened a WOUND inside me that i didnt even know was there. do you know what it feels like to hear someone casually throw around "${kw}" like its nothing?? like its just a word?? because to some of us ${kw} is EVERYTHING. i remember the first time i encountered ${kw}. i was in 7th grade. cafeteria. tuesday. my so-called best friend (we dont talk anymore, long story, dont ask) just said "${kw}" out of nowhere and my whole world just. shifted. something inside me broke and i've been trying to put it back together ever since. and now youre here typing about ${kw} like its a casual tuesday and honestly?? im not okay. im going to go update my away message to a linkin park lyric and think about ${kw2} for a while. dont IM me. unless you want to talk about ${kw} seriously. in which case im here. but also im not here. you know what i mean. you know.`,

`⚠️ IMPORTANT MESSAGE ABOUT ${KW} — DO NOT DELETE ⚠️\n\nThis message was sent to me by someone who got it from someone who heard it from someone who was there when ${kw} happened. If you do NOT forward this to 10 people in the next 10 minutes something TERRIBLE will happen that is loosely related to ${kw}. I know because it happened to my cousin's friend's neighbor. She ignored the message about ${kw} and the next morning her away message was just gone. Just. Gone. This is 100% true I looked it up on google.com and it was the first result.\n\nIf you send this to:\n1-3 people: ${kw} will be okay\n4-7 people: ${kw} smiles upon you\n8-10 people: ${kw} changes your life\n10+ people: you become the ${KW} master and AOL sends you a free CD-ROM\n\nI am not joking. Bill Gates is counting the forwards. Do not ignore ${kw2}. That's all I'm saying.`,

`um. ACTUALLY. since we're on the topic of ${kw} i feel like i should clarify some things because this is really important to me personally for reasons i wont get into right now but trust me they are significant. most people THINK they understand ${kw} but they genuinely do not. i have spent a considerable portion of my life (years. not days. YEARS.) researching ${kw} and its implications and what you just said is approximately 30% accurate at best. the other 70% is actually about ${kw2} which is a COMPLETELY different thing that people confuse with ${kw} constantly and it makes me want to log off forever and never come back. my profile even says "${kw} ≠ ${kw2}" and nobody reads it. nobody. i have it right there in my profile and people still come in here and conflate the two like it's nothing. anyway. you were saying? about ${kw}? because i have thoughts. so many thoughts. i have a word document.`,

`According to all known laws of the internet, there is no way that ${kw} should work the way you're describing. ${Cap} doesn't care what the laws say, though. ${Cap} has been defying expectations since approximately 1998 when it first appeared on a Geocities page at www.geocities.com/${kw}fans/main.html. The webmaster was a 13 year old named Kyle from Ohio. The site had a hit counter, a guestbook with 4 entries (all Kyle), a MIDI file that played automatically, and a blinking banner that said "WELCOME TO THE OFFICIAL ${KW} PAGE." Kyle believed in ${kw} when nobody else did. He believed in it through the 56k connection. Through the screeching modem sound. Through the disconnecting every 45 minutes. Kyle is somewhere out there right now and he is still thinking about ${kw}. We are all Kyle. ${kw2} cannot say the same. ${kw2} had its chance and it blew it. ${Cap} is eternal.`,

`*~*~* ${KW} *~*~*\n\ni carry your ${kw} with me\ni carry it in my heart\ni am never without it(anywhere\ni go you go my ${kw})\n\n...okay sorry that was an e.e. cummings thing i edited to be about ${kw} for my away message last year and i never fully recovered from it. the thing is though ${kw} genuinely reminds me of this one time in 10th grade when i stayed up until 4am on AIM talking to someone about ${kw2} and we were like "we'll be friends forever" and then we both switched screennames and never spoke again and sometimes i still think about that. what were we even saying about ${kw}. i forget. it doesn't matter. some things are bigger than ${kw}. not many things. but some.\n\nmood: ${kw}ish\ncurrently listening to: something that sounds like what ${kw} would sound like if ${kw} was a song\naim status: away (but not really)`,

`okay here is a story about ${kw} that i have never told anyone. it was 2002. i was on the family computer. we had one computer in the whole house and i had to use it in the living room with my dad watching tv three feet away. i was on AIM talking to someone about ${kw} — at that age i talked about ${kw} constantly, it was basically my whole personality — and my dad looked over at the screen and went "what's ${kw}?" and i said "you wouldn't understand" and closed the laptop. except it wasn't a laptop it was a desktop so i just kind of. turned off the monitor. he definitely saw. he never said anything. that was the last time ${kw} and my father occupied the same physical space. anyway that has nothing to do with what you said but when you mentioned ${kw} it all came flooding back and i had to share it with someone. that someone is you. i hope you can handle that.`,

`I cannot BELIEVE you said ${kw} to me right now. In THIS chat window. In THIS economy. Do you know how long I have been waiting for someone to bring up ${kw}?? I have been SITTING here refreshing my buddy list WAITING for someone — anyone — to say ${kw} and here you are. Here. You. Are. I want you to know that I have prepared for this moment. I have a whole Word document. It is 47 pages long and it is entirely about ${kw}. I started it in 8th grade. Some of it is in Comic Sans because I was going through something. The point is I am READY to talk about ${kw} and also ${kw2} which is related but different, and I will not be stopped. Where do you want to start. We can start anywhere. I have tabs.`,

        ];

        return pastas[Math.floor(Math.random() * pastas.length)];
    }

    openAwayMessageWindow() {
        const awayWindow = document.getElementById('awayMessageWindow');

        if (this.awayStatus) {
            // Return from away
            this.awayStatus = false;
            this.awayMessage = '';
            const statusBtn = document.getElementById('awayBtn');
            statusBtn.textContent = 'I\'m Away';
            statusBtn.classList.remove('away');
            playDoorOpen();

            showWarning('Welcome Back!', 'You are no longer away. Your buddies can see you\'re online! 👋');
        } else {
            // Show away message window
            awayWindow.style.display = 'block';
            this.makeDraggable(awayWindow);
            this.addResizeHandles(awayWindow);
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

        closeAwayWindow();
        playAwaySound();

        showWarning('Away Status Set', `Away message: "${awayMessage}"\n\nYour buddies will see this when they message you! 💤`);
    }

    makeDraggable(element) {
        const titleBar = element.querySelector('.title-bar');
        let dragging = false, sx, sy, sl, st;

        titleBar.addEventListener('pointerdown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            e.preventDefault();
            e.stopPropagation();
            // snap any transform-centered element to explicit px
            if (element.style.transform && element.style.transform !== 'none') {
                const r = element.getBoundingClientRect();
                element.style.transform = 'none';
                element.style.left = r.left + 'px';
                element.style.top  = r.top  + 'px';
            }
            dragging = true;
            sx = e.clientX; sy = e.clientY;
            const r = element.getBoundingClientRect();
            sl = r.left; st = r.top;
            element.style.zIndex = ++this.topZ;
            element.style.right  = 'auto';
            element.style.bottom = 'auto';
            try { titleBar.setPointerCapture(e.pointerId); } catch (_) {}
        });

        titleBar.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const ew = element.offsetWidth;
            const nl = Math.max(-(ew - 60), Math.min(vw - 60, sl + e.clientX - sx));
            const nt = Math.max(0, Math.min(vh - 30, st + e.clientY - sy));
            element.style.left = nl + 'px';
            element.style.top  = nt + 'px';
        });

        titleBar.addEventListener('pointerup',     () => { dragging = false; });
        titleBar.addEventListener('pointercancel', () => { dragging = false; });
    }

    addResizeHandles(element) {
        ['n','s','e','w','nw','ne','sw','se'].forEach((dir) => {
            const h = document.createElement('div');
            h.className = 'aim-rh aim-rh-' + dir;
            element.appendChild(h);

            let rs = null;

            h.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const r = element.getBoundingClientRect();
                rs = { sx: e.clientX, sy: e.clientY, sw: r.width, sh: r.height, sl: r.left, st: r.top };
                element.style.right  = 'auto';
                element.style.bottom = 'auto';
                element.style.transform = 'none';
                try { h.setPointerCapture(e.pointerId); } catch (_) {}
            });

            h.addEventListener('pointermove', (e) => {
                if (!rs) return;
                const dx = e.clientX - rs.sx, dy = e.clientY - rs.sy;
                let nw = rs.sw, nh = rs.sh, nl = rs.sl, nt = rs.st;
                if (dir.includes('e')) nw = Math.max(250, rs.sw + dx);
                if (dir.includes('s')) nh = Math.max(120, rs.sh + dy);
                if (dir.includes('w')) { nw = Math.max(250, rs.sw - dx); nl = rs.sl + rs.sw - nw; }
                if (dir.includes('n')) { nh = Math.max(120, rs.sh - dy); nt = rs.st + rs.sh - nh; }
                element.style.width  = nw + 'px';
                element.style.height = nh + 'px';
                element.style.left   = nl + 'px';
                element.style.top    = nt + 'px';
            });

            h.addEventListener('pointerup',     () => { rs = null; });
            h.addEventListener('pointercancel', () => { rs = null; });
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
