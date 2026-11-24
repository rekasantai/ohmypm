// Layer 3: Live Sarawak Restoration Diorama Renderer.
import { uiIcon } from '../core/constants.js';
import { getChapterCfg, store } from '../core/state.js';
import { ARTWORK_HELPERS, getMiniArtisanDioramaSVG } from './artwork.js';
import { renderWideBriefCard } from './feedback.js';

export function renderDiorama() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('diorama-viewport');
    if (!container) return;

    const st = store.state;
    const cfg = getChapterCfg();
    const tod = cfg.getDioramaTimeOfDay(st);
    const scene = cfg.buildDioramaSVG(st, ARTWORK_HELPERS);
    const metrics = cfg.getHudMetrics(st);

    let artisansMarkup = '';
    (st.artisans || []).forEach((art, idx) => {
        if (art.resting) {
            const slot = scene.restSlots[idx % scene.restSlots.length];
            artisansMarkup += getMiniArtisanDioramaSVG(art, slot.x, slot.y, 'resting');
        } else if (art.assignedTaskId) {
            const task = st.tasks.find(t => t.id === art.assignedTaskId);
            if (task && (task.progress < 100 || task.hasDefect)) {
                const pos = scene.stationCoords[task.id] || scene.restSlots[idx % scene.restSlots.length];
                artisansMarkup += getMiniArtisanDioramaSVG(art, pos.x, pos.y, 'working');
            }
        }
    });

    container.innerHTML = `
        <svg id="diorama-svg-el" viewBox="0 0 420 170" preserveAspectRatio="xMidYMid slice" shape-rendering="geometricPrecision" class="w-full block bg-[#3D2412]">
            <defs>
                <linearGradient id="diorama-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${tod.skyTop}"/>
                    <stop offset="100%" stop-color="${tod.skyBottom}"/>
                </linearGradient>
                <linearGradient id="wood-teak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#8C5227"/>
                    <stop offset="100%" stop-color="#5C3A21"/>
                </linearGradient>
                <linearGradient id="wood-warm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#B87E45"/>
                    <stop offset="100%" stop-color="#8C582B"/>
                </linearGradient>
                <linearGradient id="brass-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FDE68A"/>
                    <stop offset="50%" stop-color="#C58F2A"/>
                    <stop offset="100%" stop-color="#8C6106"/>
                </linearGradient>
                <linearGradient id="roof-terra" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#D96E47"/>
                    <stop offset="100%" stop-color="#A84220"/>
                </linearGradient>
                <linearGradient id="glass-sheen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#F0F9FF" stop-opacity="0.92"/>
                    <stop offset="100%" stop-color="#BAE6FD" stop-opacity="0.72"/>
                </linearGradient>
                <radialGradient id="glow-gold" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#FDE68A" stop-opacity="0.85"/>
                    <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
                </radialGradient>
                <radialGradient id="glow-red" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#FCA5A5" stop-opacity="0.75"/>
                    <stop offset="100%" stop-color="#DC2626" stop-opacity="0"/>
                </radialGradient>
                <filter id="soft-shadow" x="-8%" y="-8%" width="116%" height="116%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#241B15" flood-opacity="0.28"/>
                </filter>
            </defs>
            ${scene.backdrop}
            ${scene.layers}
            ${artisansMarkup}
            <rect x="0" y="0" width="420" height="170" fill="${tod.ambientTint}" pointer-events="none"/>
        </svg>

        <div class="absolute top-1.5 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span class="px-2 py-0.5 rounded-md bg-[#241B15]/85 backdrop-blur-[2px] text-[#FFFDF8] ts-micro font-bold font-mono-crisp border border-[#C58F2A] flex items-center gap-1">
                ${uiIcon('compass', 'w-3 h-3 text-[#F6D365]')}
                <span>${metrics.dioramaBadgeText}</span>
            </span>
            <span class="px-2 py-0.5 rounded-md bg-[#FFFDF9]/95 backdrop-blur-[2px] text-[#3D2412] ts-micro font-bold border border-[#8C6A4A] flex items-center gap-1">
                ${uiIcon('clock', 'w-3 h-3 text-[#5C3A21]')}
                <span>${tod.label}</span>
            </span>
        </div>
    `;

    renderWideBriefCard();
}
