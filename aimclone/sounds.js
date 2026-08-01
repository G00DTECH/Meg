// AIM Sound System - Classic Nostalgic Sounds
class AIMSounds {
    constructor() {
        this.enabled = true;
        this.soundLibrary = {
            doorOpen: '🚪 *door opens*',
            doorClose: '🚪 *door closes*',
            message: '🔔 uh oh!',
            away: '🚪 *creaky door*',
            warning: '⚠️ *warning*',
            send: '📤 *whoosh*'
        };
    }

    // Play sound with text notification
    play(soundName) {
        if (!this.enabled) return;

        const soundText = this.soundLibrary[soundName];
        if (soundText) {
            this.showSoundNotification(soundText);
        }

        // In a real implementation, you'd play actual audio files here
        // For now, we'll use the Web Audio API to create simple beeps
        this.playBeep(soundName);
    }

    playBeep(soundName) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different frequencies for different sounds
            const soundFrequencies = {
                doorOpen: [200, 400],
                doorClose: [400, 200],
                message: [800, 600, 800],
                away: [300, 250],
                warning: [600, 500, 600],
                send: [400, 500]
            };

            const frequencies = soundFrequencies[soundName] || [440];

            oscillator.frequency.setValueAtTime(frequencies[0], audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

            // Fade out
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);

            // Play additional notes for multi-tone sounds
            if (frequencies.length > 1) {
                frequencies.slice(1).forEach((freq, index) => {
                    setTimeout(() => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                        gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                        osc.start(audioContext.currentTime);
                        osc.stop(audioContext.currentTime + 0.15);
                    }, (index + 1) * 150);
                });
            }
        } catch (e) {
            console.log('Audio not available:', e);
        }
    }

    showSoundNotification(text) {
        const notification = document.createElement('div');
        notification.className = 'sound-notification';
        notification.textContent = text;
        notification.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 11px;
            z-index: 10000;
            animation: soundPop 1.5s ease-out forwards;
            pointer-events: none;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes soundPop {
                0% {
                    opacity: 0;
                    transform: translateY(10px) scale(0.8);
                }
                20% {
                    opacity: 1;
                    transform: translateY(0) scale(1.05);
                }
                80% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.9);
                }
            }
        `;

        if (!document.querySelector('#soundPopStyle')) {
            style.id = 'soundPopStyle';
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 1500);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Initialize global sounds instance
window.aimSounds = new AIMSounds();

// Sound effect helpers
function playDoorOpen() {
    window.aimSounds.play('doorOpen');
}

function playDoorClose() {
    window.aimSounds.play('doorClose');
}

function playMessageSound() {
    window.aimSounds.play('message');
}

function playAwaySound() {
    window.aimSounds.play('away');
}

function playWarningSound() {
    window.aimSounds.play('warning');
}

function playSendSound() {
    window.aimSounds.play('send');
}
