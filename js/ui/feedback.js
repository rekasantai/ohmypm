// Layer 3: Toasts, Advisor Guidance, Mobile Shell Class Sync, Brief Card & Dependency Highlighting.
import { getChapterCfg, store } from '../core/state.js';
import { getGameIconSVG } from './artwork.js';

let depPulseTimer = null;

export function showToast(message, tone = 'info') {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('toast-container');
    if (!container) return;

    const styles = {
        info: 'bg-[#3D2412] text-[#FFFDF8] border-[#C58F2A]',
        success: 'bg-[#235732] text-[#FFFDF8] border-[#A7F3D0]',
        warn: 'bg-[#943011] text-[#FFFDF8] border-[#FDE68A]'
    };

    const toast = document.createElement('div');
    toast.className = `px-3.5 py-2 rounded-xl border-[1.5px] text-xs font-semibold shadow-md animate-crisp-in text-center ${styles[tone] || styles.info}`;
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.style) {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.25s ease';
        }
        setTimeout(() => {
            if (typeof toast.remove === 'function') toast.remove();
        }, 260);
    }, 2300);
}

export function clearToasts() {
    if (typeof document === 'undefined') return;
    const toastBox = document.getElementById('toast-container');
    if (toastBox) toastBox.innerHTML = '';
}

export function updateGuidance(msg) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('guidance-text');
    if (el) el.innerHTML = msg;
}

export function injectBrandingElements() {
    if (typeof document === 'undefined') return;
    const titleIcon = document.getElementById('game-title-icon');
    const tutIcon = document.getElementById('tutorial-game-icon');
    if (titleIcon) titleIcon.innerHTML = getGameIconSVG(34);
    if (tutIcon) tutIcon.innerHTML = getGameIconSVG(36);
}

export function renderWideBriefCard() {
    if (typeof document === 'undefined') return;
    const card = document.getElementById('wide-brief-card');
    if (!card) return;

    const brief = getChapterCfg().brief;
    const counter = brief.counter(store.state);
    card.innerHTML = `
        <div class="flex items-center justify-between mb-0.5">
            <span class="ts-micro font-bold uppercase tracking-wider text-[#C85A32]">${brief.tag}</span>
            <span class="ts-micro font-bold font-mono-crisp ${counter.cls}">${counter.text}</span>
        </div>
        <div class="text-xs sm:text-sm font-bold text-[#241B15]">${brief.title}</div>
        <p class="ts-caption text-[#5A4D41] mt-0.5 leading-snug">
            ${brief.text(store.state)}
        </p>
    `;
}

export function isMobileViewport() {
    return (typeof window !== 'undefined' && typeof window.innerWidth === 'number')
        ? window.innerWidth < 640
        : false;
}

export function syncMobileShellClasses() {
    if (typeof document === 'undefined') return;
    const shell = document.getElementById('app-shell');
    if (shell) {
        if (store.ui.mobileSiteExpanded) shell.classList.add('mobile-site-open');
        else shell.classList.remove('mobile-site-open');

        if (store.ui.mobileExecPeek) shell.classList.add('mobile-exec-peek');
        else shell.classList.remove('mobile-exec-peek');
    }
    const label = document.getElementById('mobile-site-label');
    if (label) label.textContent = store.ui.mobileSiteExpanded ? 'Hide' : 'Site';
    const btn = document.getElementById('btn-mobile-site');
    if (btn && typeof btn.setAttribute === 'function') {
        btn.setAttribute('aria-expanded', store.ui.mobileSiteExpanded ? 'true' : 'false');
    }
    const chev = document.getElementById('mobile-site-chevron');
    if (chev) {
        if (store.ui.mobileSiteExpanded) chev.classList.add('rotate-180');
        else chev.classList.remove('rotate-180');
    }
}

export function highlightDependencyTask(depTaskId) {
    if (!depTaskId) return;
    store.ui.highlightedTaskId = depTaskId;
    if (depPulseTimer) clearTimeout(depPulseTimer);

    if (typeof document !== 'undefined') {
        const el = document.getElementById(`card-${depTaskId}`) || document.getElementById(`backlog-card-${depTaskId}`);
        if (el) {
            if (el.classList) {
                el.classList.remove('dep-highlight-pulse');
                // Force reflow only in real browsers
                void el.offsetWidth;
                el.classList.add('dep-highlight-pulse');
            }
            if (typeof el.scrollIntoView === 'function') {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    depPulseTimer = setTimeout(() => {
        store.ui.highlightedTaskId = null;
        if (typeof document !== 'undefined') {
            const el = document.getElementById(`card-${depTaskId}`) || document.getElementById(`backlog-card-${depTaskId}`);
            if (el && el.classList) el.classList.remove('dep-highlight-pulse');
        }
    }, 1800);
}
