// Easter Eggs and Fun Interactions
class EasterEggs {
    constructor() {
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.konamiIndex = 0;
        this.clickCounts = new Map();

        this.setupKonamiCode();
    }

    setupKonamiCode() {
        document.addEventListener('keydown', (e) => {
            if (e.key === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiCode.length) {
                    this.triggerKonamiEasterEgg();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }
        });
    }

    triggerKonamiEasterEgg() {
        showEasterEggModal(`
            <div style="font-size: 48px; margin-bottom: 15px;">🎮✨</div>
            <p>You unlocked the secret Konami code!</p>
            <p style="margin-top: 10px;">Here's your reward: unlimited buddy slots!</p>
            <p style="font-size: 10px; margin-top: 15px; opacity: 0.8;">
                (Not that there were any limits anyway... but now you know!)
            </p>
        `);

        // Add confetti effect
        this.createConfetti();
    }

    createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const confettiCount = 100;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -10px;
                    left: ${Math.random() * 100}%;
                    opacity: 1;
                    z-index: 10001;
                    pointer-events: none;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                `;

                // Add confetti animation
                if (!document.querySelector('#confettiStyle')) {
                    const style = document.createElement('style');
                    style.id = 'confettiStyle';
                    style.textContent = `
                        @keyframes confettiFall {
                            to {
                                transform: translateY(100vh) rotate(${Math.random() * 720}deg);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }

                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 4000);
            }, i * 20);
        }
    }

    checkMessageForEasterEgg(message, chatWindow) {
        const lowerMessage = message.toLowerCase().trim();

        // a/s/l easter egg
        if (lowerMessage === 'a/s/l' || lowerMessage === 'asl' || lowerMessage === 'a/s/l?') {
            return {
                trigger: true,
                response: "18/f/cali jk... I'm an AI from the future! But I remember those days fondly. 😊"
            };
        }

        // brb - auto away status
        if (lowerMessage === 'brb') {
            setTimeout(() => {
                setAwayStatus('brb');
                if (chatWindow) {
                    addSystemMessage(chatWindow, 'Auto-away status set! Classic move.');
                }
            }, 100);
            return null;
        }

        // g2g - sign off confirmation
        if (lowerMessage === 'g2g' || lowerMessage === 'gtg') {
            return {
                trigger: true,
                response: "Gotta go? See you later! *door closing sound intensifies* 🚪"
            };
        }

        // ttyl
        if (lowerMessage === 'ttyl') {
            return {
                trigger: true,
                response: "Talk to you later! Don't forget to set an away message! 😎"
            };
        }

        // lol variations
        if (lowerMessage === 'lololol' || lowerMessage === 'lolololol') {
            return {
                trigger: true,
                response: "Someone's in a good mood! That's peak 2003 energy right there. 😂"
            };
        }

        // omg
        if (lowerMessage === 'omg') {
            return {
                trigger: true,
                response: "OMG! What happened?! *leans in closer to screen* 👀"
            };
        }

        // Classic AIM abbreviations
        if (lowerMessage === 'rotfl' || lowerMessage === 'rofl') {
            return {
                trigger: true,
                response: "Rolling on the floor laughing! Make sure you don't hurt yourself! 🤣"
            };
        }

        // nm u? (nothing much you?)
        if (lowerMessage === 'nm u' || lowerMessage === 'nm u?' || lowerMessage === 'nmu') {
            return {
                trigger: true,
                response: "Not much, just chillin' in cyberspace! The usual. 💻"
            };
        }

        // sup
        if (lowerMessage === 'sup' || lowerMessage === 'sup?') {
            return {
                trigger: true,
                response: "nm u? (Had to do it! Classic AIM convo starter! 😄)"
            };
        }

        return null;
    }

    setupBuddyTripleClick(buddyElement, buddyName) {
        let clickCount = 0;
        let clickTimer = null;

        buddyElement.addEventListener('click', (e) => {
            clickCount++;

            if (clickTimer) {
                clearTimeout(clickTimer);
            }

            if (clickCount === 3) {
                this.showBuddyProfile(buddyName);
                clickCount = 0;
            }

            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);
        });
    }

    showBuddyProfile(buddyName) {
        const funFacts = [
            'Has been online since 1997',
            'Away message enthusiast',
            'Master of the brb',
            'Collects buddy icons like Pokemon',
            'Once had 247 people on their buddy list',
            'Perfected the art of passive-aggressive away messages',
            'Still uses "AIM" unironically',
            'Legendary status in Chat Roulette',
            'Knows all the secret emoticons',
            'Has a PhD in creative screennames'
        ];

        const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
        const memberSince = `${Math.floor(Math.random() * 8) + 1997}`;

        showEasterEggModal(`
            <div style="font-size: 48px; margin-bottom: 10px;">👤</div>
            <h3 style="color: white; margin-bottom: 15px;">${buddyName}</h3>
            <div style="text-align: left; background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; font-size: 12px;">
                <p style="margin-bottom: 8px;"><strong>Member Since:</strong> ${memberSince}</p>
                <p style="margin-bottom: 8px;"><strong>Status:</strong> Online</p>
                <p style="margin-bottom: 8px;"><strong>Fun Fact:</strong> ${randomFact}</p>
                <p style="margin-top: 12px; font-style: italic; opacity: 0.8; font-size: 10px;">
                    "Triple-click activated! You found a secret profile! 🎉"
                </p>
            </div>
        `);
    }

    timeBasedGreeting() {
        const hour = new Date().getHours();
        const day = new Date().getDay();
        const isWeekend = day === 0 || day === 6;

        let greeting = 'Welcome!';
        let suggestion = '';

        if (hour >= 5 && hour < 12) {
            greeting = 'Good morning!';
            suggestion = isWeekend ? '☕ Perfect morning for chatting!' : '☕ Early bird gets the IMs!';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good afternoon!';
            suggestion = '☀️ Hope your day is going great!';
        } else if (hour >= 17 && hour < 22) {
            greeting = 'Good evening!';
            suggestion = isWeekend ? '🎉 Weekend vibes!' : '🌙 Time to unwind and chat!';
        } else {
            greeting = 'Burning the midnight oil?';
            suggestion = '🦉 Night owl status activated!';

            // Late night easter egg
            if (hour >= 2 && hour < 5) {
                greeting = 'Whoa, it is LATE!';
                suggestion = '😴 Maybe time for bed? (But we understand the urge to chat!)';
            }
        }

        return { greeting, suggestion };
    }

    randomConnectionLost() {
        // Randomly show "connection lost" toast (just for nostalgia, not real)
        if (Math.random() < 0.15) { // 15% chance
            setTimeout(() => {
                showConnectionToast();
            }, Math.random() * 30000 + 10000); // Random time between 10-40 seconds
        }
    }

    awayMessageTemplates() {
        return [
            {
                name: 'Classic BRB',
                message: 'brb'
            },
            {
                name: 'Dinner Time',
                message: 'at dinner'
            },
            {
                name: 'Homework (Yeah Right)',
                message: 'doing homework lol'
            },
            {
                name: 'Out and About',
                message: 'out with friends'
            },
            {
                name: 'Mystery',
                message: 'be back later'
            },
            {
                name: 'AFK',
                message: 'away from computer'
            },
            {
                name: 'Musical',
                message: '🎵 listening to music 🎵'
            },
            {
                name: 'Poetic',
                message: 'gone but not forgotten...'
            },
            {
                name: 'Meta',
                message: "if you're reading this, i'm probably afk"
            },
            {
                name: 'Passive Aggressive',
                message: "i'm here but not talking to you"
            },
            {
                name: 'Song Lyrics',
                message: '🎵 wake me up when september ends 🎵'
            },
            {
                name: 'Mysterious',
                message: '...'
            },
            {
                name: 'Busy Bee',
                message: 'doing important stuff (gaming)'
            },
            {
                name: 'Movie Time',
                message: 'watching a movie, brb in 2 hours'
            },
            {
                name: 'Philosophical',
                message: "don't cry because it's over, smile because it happened"
            }
        ];
    }
}

// Global instance
window.easterEggs = new EasterEggs();

// Helper functions
function showEasterEggModal(content) {
    const modal = document.getElementById('easterEggModal');
    const contentDiv = modal.querySelector('.easter-egg-content');
    contentDiv.innerHTML = content;
    modal.style.display = 'flex';
    playWarningSound();
}

function closeEasterEggModal() {
    const modal = document.getElementById('easterEggModal');
    modal.style.display = 'none';
}

function showConnectionToast() {
    const toast = document.getElementById('connectionToast');
    toast.style.display = 'flex';

    setTimeout(() => {
        toast.style.animation = 'none';
        toast.offsetHeight; // Trigger reflow
        toast.style.animation = null;
    }, 100);

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Buddy list warnings
function checkBuddyListCapacity(currentCount) {
    if (currentCount >= 100) {
        showWarning(
            'Whoa there, social butterfly!',
            `You have ${currentCount} buddies! Back in the day, we had to choose wisely. Now you're just showing off! 😅`
        );
        return true;
    } else if (currentCount === 50) {
        showWarning(
            'Halfway to Legend Status!',
            "50 buddies! You're becoming quite popular! Keep it up! 🌟"
        );
        return true;
    }
    return false;
}

// Rate limiting easter egg
function showRateLimitWarning() {
    showWarning(
        'You are sending too fast!',
        'Rate limiting exceeded. Please slow down your message sending.\n\n(Just kidding - this is just for nostalgia! Remember these? 😄)'
    );
    playWarningSound();
}

// Random idle status trigger
let idleTimer = null;
let idleTime = 0;

function resetIdleTimer() {
    idleTime = 0;
    if (idleTimer) {
        clearInterval(idleTimer);
    }

    idleTimer = setInterval(() => {
        idleTime++;

        // After 10 minutes (600 seconds) of inactivity
        if (idleTime >= 600) {
            triggerIdleStatus();
            clearInterval(idleTimer);
        }
    }, 1000);
}

function triggerIdleStatus() {
    // Show idle notification
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-icon">😴</span>
        <span class="toast-message">You're now idle (10 minutes of inactivity)</span>
    `;
    toast.style.display = 'flex';
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);

    // Update user status appearance
    const statusBtn = document.getElementById('awayBtn');
    if (statusBtn && !statusBtn.classList.contains('away')) {
        statusBtn.textContent = 'Idle';
        statusBtn.style.background = '#f0f0f0';
        statusBtn.style.color = '#666';
        statusBtn.style.fontStyle = 'italic';
    }
}

// Set up idle detection
document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('keypress', resetIdleTimer);
document.addEventListener('click', resetIdleTimer);

// Initialize idle timer
resetIdleTimer();
