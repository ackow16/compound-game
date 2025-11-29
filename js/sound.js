export class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playPop() {
        // High pitched short sine for "pop"
        this.playTone(600, 'sine', 0.1, 0.1);
    }

    playClick() {
        // Very short high click
        this.playTone(800, 'triangle', 0.05, 0.05);
    }

    playThud() {
        // Lower pitch for drop
        this.playTone(200, 'sine', 0.15, 0.15);
    }

    playSuccess() {
        // Major chord arpeggio
        const now = this.ctx.currentTime;
        [440, 554, 659].forEach((freq, i) => { // A Major
            setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.1), i * 50);
        });
    }

    playError() {
        // Dissonant low
        this.playTone(150, 'sawtooth', 0.3, 0.1);
        setTimeout(() => this.playTone(140, 'sawtooth', 0.3, 0.1), 50);
    }
}
