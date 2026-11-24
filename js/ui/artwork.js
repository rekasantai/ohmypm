// Layer 0: Shared vector artwork, character portraits, and diorama layer helpers.
import { uiIcon } from '../core/constants.js';

export function getGameIconSVG(size = 34) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 36 36" shape-rendering="geometricPrecision" class="block">
        <rect x="1.5" y="1.5" width="33" height="33" rx="9" fill="#FAF5EB" stroke="#C58F2A" stroke-width="2"/>
        <!-- Mini Clipboard -->
        <rect x="8" y="8" width="14" height="19" rx="2.5" fill="#FFFDF9" stroke="#5C3A21" stroke-width="1.5"/>
        <rect x="12" y="6.5" width="6" height="3" rx="1" fill="#C58F2A" stroke="#241B15" stroke-width="1"/>
        <path d="M10.5 13.5 L12 15 L14.5 12" fill="none" stroke="#2E6F40" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="16" y1="13.5" x2="19.5" y2="13.5" stroke="#5C3A21" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M10.5 19 L12 20.5 L14.5 17.5" fill="none" stroke="#2E6F40" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="16" y1="19" x2="19.5" y2="19" stroke="#5C3A21" stroke-width="1.2" stroke-linecap="round"/>
        <!-- Foreground Kopi Cup -->
        <path d="M18.5 19.5 H28.5 L27.2 26.5 C27 27.8 25.8 28.5 23.5 28.5 C21.2 28.5 20 27.8 19.8 26.5 Z" fill="#FFFDF9" stroke="#241B15" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M28.5 21.2 H30.2 C31.1 21.2 31.6 21.8 31.6 22.8 C31.6 23.8 31.1 24.4 30.2 24.4 H27.8" fill="none" stroke="#241B15" stroke-width="1.3" stroke-linecap="round"/>
        <line x1="19" y1="22.5" x2="28" y2="22.5" stroke="#2E6F40" stroke-width="1.2"/>
        <path d="M22 17 Q21.2 15 22.5 13.5" fill="none" stroke="#C85A32" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M25.5 17 Q26.3 15 25 13.5" fill="none" stroke="#C85A32" stroke-width="1.3" stroke-linecap="round"/>
    </svg>`;
}

export function getArtisanPortraitSVG(id, size = 28, opts = {}) {
    const safeId = ['lim', 'salmah', 'danny', 'auntie-mei', 'committee', 'ranger', 'director'].includes(id) ? id : 'danny';
    const isFatigued = Boolean(opts && opts.fatigued);
    const isResting = Boolean(opts && opts.resting);
    const isWorking = Boolean(opts && opts.working);

    let fallbackInner = '';
    if (safeId === 'lim') {
        fallbackInner = `<rect x="1" y="1" width="30" height="30" rx="8" fill="#F1E7D3" stroke="#5C3A21" stroke-width="1.5"/><circle cx="16" cy="18" r="8" fill="#D9A377" stroke="#241B15" stroke-width="1.4"/><path d="M8 14 C8 9, 24 9, 24 14 Z" fill="#6B7280" stroke="#241B15" stroke-width="1.4"/><rect x="10.5" y="15.5" width="4.5" height="3.5" rx="1" fill="#FFFDF9" stroke="#241B15" stroke-width="1.2"/><rect x="17" y="15.5" width="4.5" height="3.5" rx="1" fill="#FFFDF9" stroke="#241B15" stroke-width="1.2"/><line x1="15" y1="17" x2="17" y2="17" stroke="#241B15" stroke-width="1.2"/><path d="M13.5 21.5 Q16 23.5 18.5 21.5" stroke="#241B15" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    } else if (safeId === 'salmah') {
        fallbackInner = `<rect x="1" y="1" width="30" height="30" rx="8" fill="#FCEEE8" stroke="#C85A32" stroke-width="1.5"/><path d="M7 27 C7 12, 25 12, 25 27 Z" fill="#C85A32" stroke="#241B15" stroke-width="1.4"/><circle cx="16" cy="17.5" r="6.5" fill="#E0AC82" stroke="#241B15" stroke-width="1.4"/><circle cx="13.8" cy="16.8" r="1" fill="#241B15"/><circle cx="18.2" cy="16.8" r="1" fill="#241B15"/><path d="M14 20 Q16 22 18 20" stroke="#241B15" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    } else if (safeId === 'auntie-mei') {
        fallbackInner = `<rect x="1" y="1" width="30" height="30" rx="8" fill="#FAF5EB" stroke="#2E6F40" stroke-width="1.5"/><circle cx="16" cy="18" r="7.5" fill="#E6B894" stroke="#241B15" stroke-width="1.4"/><path d="M8.5 15 C8.5 8.5, 23.5 8.5, 23.5 15 Z" fill="#CBD5E1" stroke="#241B15" stroke-width="1.3"/><circle cx="13.8" cy="17.5" r="1" fill="#241B15"/><circle cx="18.2" cy="17.5" r="1" fill="#241B15"/><path d="M13.8 21 Q16 22.8 18.2 21" stroke="#241B15" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
    } else if (safeId === 'committee') {
        fallbackInner = `<rect x="1" y="1" width="30" height="30" rx="8" fill="#FFF9E6" stroke="#C58F2A" stroke-width="1.5"/><circle cx="16" cy="18" r="7.5" fill="#D9A377" stroke="#241B15" stroke-width="1.4"/><path d="M9 14 C9 9, 23 9, 23 14 Z" fill="#475569" stroke="#241B15" stroke-width="1.3"/><rect x="11" y="15.8" width="4" height="3" rx="0.8" fill="none" stroke="#241B15" stroke-width="1.1"/><rect x="17" y="15.8" width="4" height="3" rx="0.8" fill="none" stroke="#241B15" stroke-width="1.1"/>`;
    } else if (safeId === 'ranger') {
        fallbackInner = `<rect x="1" y="1" width="30" height="30" rx="8" fill="#E6F2EA" stroke="#2E6F40" stroke-width="1.5"/><circle cx="16" cy="18.5" r="6.8" fill="#D9A377" stroke="#241B15" stroke-width="1.3"/><path d="M7 14 H25 L22 9 H10 Z" fill="#4D7C0F" stroke="#241B15" stroke-width="1.3"/><circle cx="13.8" cy="18" r="1" fill="#241B15"/><circle cx="18.2" cy="18" r="1" fill="#241B15"/><path d="M14 21 Q16 22.8 18 21" stroke="#241B15" stroke-width="1.2" fill="none" stroke-linecap="round"/><rect x="19" y="23" width="6" height="4" rx="1" fill="#F6D365" stroke="#241B15" stroke-width="0.9"/>`;
    } else if (safeId === 'director') {
        fallbackInner = `<rect x="1" y="1" width="30" height="30" rx="8" fill="#E6F4F1" stroke="#0F766E" stroke-width="1.5"/><path d="M7 29 C7 22, 25 22, 25 29 Z" fill="#134E4A" stroke="#241B15" stroke-width="1.3"/><path d="M12 22 L16 29 L20 22" fill="#FFFDF9" stroke="#C58F2A" stroke-width="1.1"/><circle cx="16" cy="16" r="6.2" fill="#DFAA82" stroke="#241B15" stroke-width="1.3"/><path d="M9.2 16 C9.2 8.5, 22.8 8.5, 22.8 16 C22.8 12.2, 9.2 12.2, 9.2 16 Z" fill="#1E293B" stroke="#241B15" stroke-width="1.2"/><circle cx="13.8" cy="15.5" r="0.9" fill="#241B15"/><circle cx="18.2" cy="15.5" r="0.9" fill="#241B15"/><path d="M14 18.5 Q16 20 18 18.5" stroke="#241B15" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    } else {
        fallbackInner = `<rect x="1" y="1" width="30" height="30" rx="8" fill="#E6F2EA" stroke="#2E6F40" stroke-width="1.5"/><circle cx="16" cy="19" r="7.5" fill="#C98F63" stroke="#241B15" stroke-width="1.4"/><path d="M5 14 L16 6 L27 14 Z" fill="#C58F2A" stroke="#241B15" stroke-width="1.4" stroke-linejoin="round"/><circle cx="13.5" cy="18" r="1" fill="#241B15"/><circle cx="18.5" cy="18" r="1" fill="#241B15"/><path d="M13.5 21.5 Q16 23.5 18.5 21.5" stroke="#241B15" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    }

    const borderCls = isFatigued
        ? 'border-[#B91C1C]'
        : isResting
            ? 'border-[#C58F2A]'
            : isWorking
                ? 'border-[#C85A32]'
                : 'border-[#5C3A21]/75';
    const radiusCls = size >= 32 ? 'rounded-xl' : 'rounded-md';
    const badgeHtml = isFatigued
        ? `<span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#E0F2FE] border border-[#1E3A8A] flex items-center justify-center shadow-sm"><svg viewBox="0 0 12 12" class="w-2.5 h-2.5"><path d="M6 1.5C8 4.4 8.5 6 8.5 7.3a2.5 2.5 0 1 1-5 0C3.5 6 4 4.4 6 1.5z" fill="#0284C7"/></svg></span>`
        : isResting
            ? `<span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#FFF9E6] border border-[#8C6106] flex items-center justify-center text-[#5C3A21] shadow-sm">${uiIcon('coffee', 'w-2 h-2')}</span>`
            : '';

    return `
        <span class="relative inline-block shrink-0 align-middle" style="width:${size}px;height:${size}px;">
            <img src="assets/portrait-${safeId}.jpg" alt="${safeId}" width="${size}" height="${size}" class="w-full h-full object-cover ${radiusCls} border-[1.5px] ${borderCls} block bg-[#F1E7D3]" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='block';"/>
            <svg width="${size}" height="${size}" viewBox="0 0 32 32" style="display:none;" shape-rendering="geometricPrecision" class="block">${fallbackInner}</svg>
            ${badgeHtml}
        </span>
    `;
}

export function getMiniArtisanDioramaSVG(artisan, x, y, mode) {
    const isBurnoutRisk = artisan.stamina < 35;
    let hatAndHead = '';
    let tunicColor = '#5C3A21';
    let toolMarkup = '';

    if (artisan.id === 'lim') {
        tunicColor = '#4B6B88';
        hatAndHead = `
            <circle cx="0" cy="-19" r="5.5" fill="#D9A377" stroke="#241B15" stroke-width="1.2"/>
            <path d="M-5.5 -21.5 C-5.5 -25.5, 5.5 -25.5, 5.5 -21.5 Z" fill="#6B7280" stroke="#241B15" stroke-width="1.1"/>
            <rect x="-3.6" y="-20.2" width="3" height="2.3" rx="0.6" fill="#FFFDF9" stroke="#241B15" stroke-width="0.9"/>
            <rect x="0.6" y="-20.2" width="3" height="2.3" rx="0.6" fill="#FFFDF9" stroke="#241B15" stroke-width="0.9"/>
            <line x1="-0.6" y1="-19" x2="0.6" y2="-19" stroke="#241B15" stroke-width="0.9"/>
        `;
        toolMarkup = `
            <line x1="6" y1="-10" x2="12" y2="-15" stroke="#5C3A21" stroke-width="1.8" stroke-linecap="round"/>
            <rect x="10" y="-18" width="6" height="3.5" rx="1" transform="rotate(-35 13 -16)" fill="#8C582B" stroke="#241B15" stroke-width="1"/>
        `;
    } else if (artisan.id === 'salmah') {
        tunicColor = '#C85A32';
        hatAndHead = `
            <path d="M-6 -12.5 C-6 -25, 6 -25, 6 -12.5 Z" fill="#C85A32" stroke="#241B15" stroke-width="1.2"/>
            <circle cx="0" cy="-18.5" r="4.6" fill="#E0AC82" stroke="#241B15" stroke-width="1.1"/>
            <circle cx="-1.5" cy="-19" r="0.8" fill="#241B15"/>
            <circle cx="1.5" cy="-19" r="0.8" fill="#241B15"/>
            <path d="M-1.5 -16.8 Q0 -15.5 1.5 -16.8" stroke="#241B15" stroke-width="0.9" fill="none" stroke-linecap="round"/>
        `;
        toolMarkup = `
            <line x1="6" y1="-10" x2="12" y2="-16" stroke="#C58F2A" stroke-width="1.6" stroke-linecap="round"/>
            <circle cx="13" cy="-17" r="2.3" fill="#F6D365" stroke="#241B15" stroke-width="0.9"/>
        `;
    } else {
        tunicColor = '#2E6F40';
        hatAndHead = `
            <circle cx="0" cy="-18.5" r="5.2" fill="#C98F63" stroke="#241B15" stroke-width="1.2"/>
            <path d="M-8.5 -21.5 L0 -27.5 L8.5 -21.5 Z" fill="#C58F2A" stroke="#241B15" stroke-width="1.2" stroke-linejoin="round"/>
            <circle cx="-1.6" cy="-18.8" r="0.8" fill="#241B15"/>
            <circle cx="1.6" cy="-18.8" r="0.8" fill="#241B15"/>
            <path d="M-1.8 -16.5 Q0 -15.2 1.8 -16.5" stroke="#241B15" stroke-width="0.9" fill="none" stroke-linecap="round"/>
        `;
        toolMarkup = `
            <rect x="6" y="-13" width="6.5" height="5.5" rx="1" fill="#D9A76A" stroke="#241B15" stroke-width="1"/>
            <line x1="6" y1="-10.5" x2="12.5" y2="-10.5" stroke="#5C3A21" stroke-width="0.8"/>
        `;
    }

    const groundShadow = `<ellipse cx="0" cy="4.5" rx="9" ry="2.6" fill="rgba(36, 27, 21, 0.28)"/>`;

    if (mode === 'resting') {
        return `
            <g transform="translate(${x}, ${y})">
                ${groundShadow}
                <rect x="-7" y="-5" width="14" height="3" rx="1.2" fill="#8C582B" stroke="#241B15" stroke-width="1.1"/>
                <line x1="-5" y1="-2" x2="-6" y2="4.5" stroke="#3D2412" stroke-width="1.5"/>
                <line x1="5" y1="-2" x2="6" y2="4.5" stroke="#3D2412" stroke-width="1.5"/>
                <rect x="-5" y="-13.5" width="10" height="8.5" rx="3" fill="${tunicColor}" stroke="#241B15" stroke-width="1.2"/>
                ${hatAndHead}
                <rect x="6" y="-14" width="4.8" height="5.2" rx="1" fill="#FFFDF9" stroke="#241B15" stroke-width="1"/>
                <line x1="6" y1="-11.6" x2="10.8" y2="-11.6" stroke="#2E6F40" stroke-width="1"/>
                <path d="M8.4 -16 Q7.4 -18.5 8.8 -21.5" stroke="#FFFDF9" stroke-width="1.2" fill="none" stroke-linecap="round" class="diorama-steam"/>
                <rect x="-15" y="-36" width="30" height="8.5" rx="4" fill="#FFF9E6" stroke="#8C6106" stroke-width="0.9"/>
                <text x="0" y="-29.8" text-anchor="middle" fill="#5C3A21" font-size="5.2" font-weight="700">REST</text>
            </g>
        `;
    }

    const sweatMarkup = isBurnoutRisk ? `
        <path d="M8.5 -24 C10.2 -21.6, 10.2 -19.5, 8.5 -19.5 C6.8 -19.5, 6.8 -21.6, 8.5 -24 Z" fill="#38BDF8" stroke="#1E3A8A" stroke-width="0.8"/>
    ` : '';

    return `
        <g transform="translate(${x}, ${y})">
            ${groundShadow}
            <g class="artisan-working-bob">
                <line x1="-2.5" y1="-4.5" x2="-2.8" y2="4" stroke="#241B15" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="2.5" y1="-4.5" x2="2.8" y2="4" stroke="#241B15" stroke-width="1.8" stroke-linecap="round"/>
                <rect x="-5.5" y="-13.5" width="11" height="9.5" rx="3.2" fill="${tunicColor}" stroke="#241B15" stroke-width="1.2"/>
                <line x1="4" y1="-10.5" x2="8" y2="-11.5" stroke="#D9A377" stroke-width="2" stroke-linecap="round"/>
                ${toolMarkup}
                <circle cx="12.5" cy="-16.5" r="2" fill="#F6D365" class="diorama-sparkle"/>
                ${hatAndHead}
                ${sweatMarkup}
            </g>
        </g>
    `;
}

export function getTaskLayerState(st, taskId) {
    const task = st && Array.isArray(st.tasks) ? st.tasks.find(t => t.id === taskId) : null;
    if (!task) return 'blueprint';
    if (task.progress >= 100) return 'done';
    if (task.assignedArtisanId || task.progress > 0 || task.inSprint) return 'active';
    return 'blueprint';
}

export function renderDioramaLayerWrapper(layerState, completedSVG, blueprintSVG, activeSparklePos) {
    if (layerState === 'done') {
        return `<g class="diorama-layer-done" filter="url(#soft-shadow)">${completedSVG}</g>`;
    }
    const activeClass = layerState === 'active' ? 'diorama-active-blueprint' : '';
    const sparkle = (layerState === 'active' && activeSparklePos) ? `
        <g transform="translate(${activeSparklePos.x}, ${activeSparklePos.y})" class="diorama-sparkle">
            <circle cx="0" cy="0" r="3.6" fill="#F6D365" stroke="#C85A32" stroke-width="1"/>
            <path d="M-6 0 L6 0 M0 -6 L0 6" stroke="#F6D365" stroke-width="1.3" stroke-linecap="round"/>
        </g>
    ` : '';
    return `
        <g opacity="${layerState === 'active' ? '0.92' : '0.52'}" class="${activeClass}">
            ${blueprintSVG}
        </g>
        ${sparkle}
    `;
}

export function getCharterBucketLayerState(st, bucketKeys) {
    if (!st || !st.charterBuckets) return 'blueprint';
    const filled = bucketKeys.reduce((sum, k) => sum + st.charterBuckets[k].filledIds.length, 0);
    const max = bucketKeys.reduce((sum, k) => sum + st.charterBuckets[k].maxItems, 0);
    if (filled >= max) return 'done';
    if (filled > 0) return 'active';
    return 'blueprint';
}

export const ARTWORK_HELPERS = {
    getTaskLayerState,
    renderDioramaLayerWrapper,
    getCharterBucketLayerState
};
