// Layer 0: Cozy Web Audio API sound engine (safe in non-browser/Node environments).
import { uiIcon } from './constants.js';

let ctx = null;
let muted = false;

function initAudio() {
    if (typeof window === 'undefined') return;
    if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }
}

function playTone(freq, type, duration, vol = 0.12, delay = 0) {
    if (muted || typeof window === 'undefined') return;
    initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    gain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.02);
}

export function haptic(pattern = 10) {
    if (muted || typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    try {
        navigator.vibrate(pattern);
    } catch (_err) {
        // Ignore browser vibration restrictions before user gesture or on unsupported devices
    }
}

export const SoundFX = {
    woodClick() {
        haptic(8);
        playTone(220, 'triangle', 0.09, 0.14);
        playTone(140, 'sine', 0.07, 0.1, 0.02);
    },
    authorizeSeal() {
        haptic([18, 30, 24]);
        playTone(150, 'triangle', 0.12, 0.22);
        playTone(95, 'sine', 0.16, 0.25, 0.02);
        playTone(587.33, 'sine', 0.28, 0.1, 0.08);
    },
    coffeeClink() {
        haptic(12);
        playTone(1320, 'sine', 0.18, 0.08);
        playTone(1760, 'sine', 0.22, 0.06, 0.05);
    },
    taskComplete() {
        haptic([12, 25, 18]);
        playTone(523.25, 'sine', 0.2, 0.1, 0);
        playTone(659.25, 'sine', 0.2, 0.1, 0.09);
        playTone(783.99, 'triangle', 0.35, 0.12, 0.18);
    },
    brassBalance() {
        playTone(440, 'sine', 0.3, 0.07);
        playTone(554.37, 'sine', 0.35, 0.06, 0.08);
    },
    alertPop() {
        haptic([20, 35, 20]);
        playTone(392, 'triangle', 0.16, 0.11);
        playTone(493.88, 'triangle', 0.22, 0.11, 0.1);
    },
    toggleMute() {
        muted = !muted;
        return muted;
    }
};

export function isMuted() {
    return muted;
}

export function setMuted(val) {
    muted = Boolean(val);
    syncMuteButton();
    return muted;
}

export function syncMuteButton() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('btn-mute');
    if (!btn) return;
    btn.innerHTML = uiIcon(muted ? 'volumeOff' : 'volumeOn', 'w-4 h-4');
    if (typeof btn.setAttribute === 'function') {
        btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    }
}
