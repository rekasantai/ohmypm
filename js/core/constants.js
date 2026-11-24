// Layer 0: Shared game constants, storage keys, UI icons, and pure badge helpers.

export const SPECIALIST_SPEED = 100;
export const OFFSKILL_SPEED = 68; // Effort 1 -> 68% (2 turns), Effort 2 -> 34% (3 turns, zero 99% trap)
export const CRASH_COST = 500;
export const CRASH_SPEED_BONUS = 50;
export const CRASH_EXTRA_STAMINA = 15;
export const L4_REWORK_COST = 1000;

export const SAVE_KEY = 'ohMyPM.progress.v1';
export const ACTIVE_RUN_KEY = 'ohMyPM.activeRun.v1';
export const PREFS_KEY = 'ohMyPM.prefs.v1';

export const RETRO_BTN = {
    primary: 'w-full min-h-[46px] py-3 rounded-xl bg-[#2E6F40] hover:bg-[#235732] text-white font-bold text-sm border-2 border-[#1B4226] border-b-4 transition cursor-pointer',
    secondary: 'w-full min-h-[40px] py-2 rounded-xl bg-[#F1E7D3] border-[1.5px] border-[#8C6A4A] text-[#3D2412] font-semibold text-xs cursor-pointer',
    retry: 'w-full min-h-[46px] py-3 rounded-xl bg-[#C85A32] text-white font-bold text-sm border-2 border-[#7A2A10] border-b-4 cursor-pointer'
};

export const NEUTRAL_MODAL_BTN = 'w-full min-h-[44px] text-left p-3 rounded-xl border-[1.5px] border-[#8C6A4A] bg-[#FFFDF9] hover:bg-[#F1E7D3] transition cursor-pointer';
export const DISABLED_MODAL_BTN = 'w-full min-h-[44px] text-left p-3 rounded-xl border-[1.5px] border-[#8C6A4A] bg-[#EFE6D4] opacity-60 cursor-not-allowed';

export const UI_ICONS = {
    scroll: '<path d="M4 2.5h7a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 11 14H3.5A1.5 1.5 0 0 1 2 12.5V4.5A2 2 0 0 1 4 2.5z"/><path d="M5.5 6h4.5M5.5 8.5h4.5M5.5 11h3"/>',
    box: '<path d="M8 1.8L13.5 5v6L8 14.2 2.5 11V5L8 1.8z"/><path d="M2.5 5L8 8.2 13.5 5M8 8.2v6"/>',
    calendar: '<rect x="2" y="3" width="12" height="11" rx="2"/><path d="M5 1.5v3M11 1.5v3M2 6.5h12M5.5 9.5h2v2h-2z"/>',
    coin: '<circle cx="8" cy="8" r="5.8"/><path d="M8 4.8v6.4M9.6 6.2c0-.7-.7-1.1-1.6-1.1s-1.6.4-1.6 1.1.7 1 1.6 1.2 1.6.5 1.6 1.3-.7 1.1-1.6 1.1-1.6-.4-1.6-1.1"/>',
    clock: '<circle cx="8" cy="8.5" r="5.5"/><path d="M8 5.5v3l2 1.2M6 1.8h4"/>',
    compass: '<circle cx="8" cy="8" r="6"/><polygon points="10.8,5.2 9,9 5.2,10.8 7,7" fill="currentColor" stroke="none"/>',
    shield: '<path d="M8 1.8L13 4v3.8c0 3.2-2.1 5.4-5 6.4-2.9-1-5-3.2-5-6.4V4l5-2.2z"/>',
    flame: '<path d="M8.5 1.8c.4 2.2-1.2 3.4-1.2 5 0 1 .8 1.7 1.7 1.7s1.7-.9 1.7-2.2c1.4 1.2 2.1 2.7 2.1 4.2a4.8 4.8 0 1 1-9.6 0c0-2.8 2-4.6 5.3-8.7z"/>',
    sunCloud: '<circle cx="6" cy="5.5" r="2.2"/><path d="M6 1.8v.8M2.5 5.5h.8M3.6 3.1l.6.6M8.4 3.1l-.6.6"/><path d="M6.5 13h5a2.3 2.3 0 0 0 .3-4.5A3.2 3.2 0 0 0 5.6 9a2 2 0 0 0 .9 4z"/>',
    rain: '<path d="M4.5 10h7a2.5 2.5 0 0 0 .3-4.9A3.5 3.5 0 0 0 5.2 5a2.4 2.4 0 0 0-.7 5z"/><path d="M5.5 12l-1 2.2M8.5 12l-1 2.2M11.5 12l-1 2.2"/>',
    coffee: '<path d="M3 6.5h7.5v4a3.5 3.5 0 0 1-7.5 0v-4z"/><path d="M10.5 7.5h1.8a1.5 1.5 0 0 1 0 3h-1.8"/><path d="M5 3.8c0-.8.8-1 .8-1.8M7.8 3.8c0-.8.8-1 .8-1.8"/>',
    lock: '<rect x="3.5" y="7" width="9" height="6.8" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>',
    check: '<circle cx="8" cy="8" r="6"/><path d="M5.2 8.2l1.9 1.9 3.7-3.8"/>',
    bolt: '<polygon points="9,1.5 3.5,9 7.8,9 7,14.5 12.5,7 8.2,7"/>',
    refresh: '<path d="M13 5.5A5.5 5.5 0 0 0 3.7 4.2M3 2v2.5h2.5"/><path d="M3 10.5a5.5 5.5 0 0 0 9.3 1.3M13 14v-2.5h-2.5"/>',
    hammer: '<path d="M9.5 3l3.5 3.5-1.8 1.8-1.4-1.4-5.6 5.6-1.4-1.4 5.6-5.6-1.4-1.4L9.5 3z"/>',
    utensils: '<path d="M4.5 2v4.5M6.2 2v4.5M2.8 2v4.5a1.7 1.7 0 0 0 3.4 0M4.5 8v6"/><path d="M11.5 2v12M11.5 2c1.6 1 1.8 4 0 5.5"/>',
    truck: '<rect x="1.5" y="4.5" width="8.5" height="6.5" rx="1"/><path d="M10 6.5h2.8l1.7 2v2.5H10z"/><circle cx="4.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/>',
    sun: '<circle cx="8" cy="8" r="3"/><path d="M8 1.8v1.5M8 12.7v1.5M1.8 8h1.5M12.7 8h1.5M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M3.6 12.4l1.1-1.1M11.3 4.7l1.1-1.1"/>',
    volumeOn: '<path d="M2.5 6v4h3l3.5 3V3L5.5 6h-3z"/><path d="M11.5 5.3a3.8 3.8 0 0 1 0 5.4"/><path d="M13.5 3.5a6.5 6.5 0 0 1 0 9"/>',
    volumeOff: '<path d="M2.5 6v4h3l3.5 3V3L5.5 6h-3z"/><path d="M11.5 6l3 4M14.5 6l-3 4"/>',
    guide: '<circle cx="8" cy="8" r="6.5"/><path d="M6.2 6.2a1.9 1.9 0 0 1 3.6.7c0 1.3-1.8 1.6-1.8 2.8"/><circle cx="8" cy="12" r="0.6" fill="currentColor" stroke="none"/>',
    chevronDown: '<path d="M4 6l4 4 4-4"/>',
    spark: '<path d="M8 1.8L9.5 6.5 14.2 8 9.5 9.5 8 14.2 6.5 9.5 1.8 8 6.5 6.5z"/>',
    stage: '<path d="M8 2.5a2 2 0 0 1 2 2v3a2 2 0 0 1-4 0v-3a2 2 0 0 1 2-2z"/><path d="M4.5 7.5a3.5 3.5 0 0 0 7 0M8 11v3M5.5 14h5"/>',
    map: '<path d="M1.5 3.5L5.5 2l5 2 4-1.5v10l-4 1.5-5-2-4 1.5v-10z"/><path d="M5.5 2v10M10.5 4v10"/>'
};

export function uiIcon(name, cls = 'w-3.5 h-3.5 inline-block shrink-0') {
    const body = UI_ICONS[name] || UI_ICONS.spark;
    return `<svg viewBox="0 0 16 16" aria-hidden="true" class="${cls}" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

export function getSkillIconName(skill) {
    if (skill === 'Carpentry') return 'hammer';
    if (skill === 'Culinary') return 'utensils';
    return 'truck';
}

export function getSkillBadgeColor(skill) {
    if (skill === 'Carpentry') return 'bg-[#5C3A21]/15 text-[#3D2412] border-[#5C3A21]/40';
    if (skill === 'Culinary') return 'bg-[#C85A32]/15 text-[#943011] border-[#C85A32]/40';
    return 'bg-[#2E6F40]/15 text-[#235732] border-[#2E6F40]/40';
}

export function getMoSCoWBadge(priority) {
    if (priority === 'must') return '<span class="ts-micro font-bold px-1.5 py-0.5 rounded bg-[#B91C1C]/15 text-[#991B1B] border border-[#B91C1C]/35">MUST</span>';
    if (priority === 'should') return '<span class="ts-micro font-bold px-1.5 py-0.5 rounded bg-[#C58F2A]/20 text-[#7A5404] border border-[#C58F2A]/45">SHOULD</span>';
    return '<span class="ts-micro font-bold px-1.5 py-0.5 rounded bg-[#64748B]/15 text-[#475569] border border-[#64748B]/30">COULD</span>';
}

export function scrambleStatements(items) {
    const arr = [...items];
    const originalOrder = items.map(i => i.id).join(',');
    let attempts = 0;
    do {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        attempts++;
    } while (arr.map(i => i.id).join(',') === originalOrder && attempts < 10);
    return arr;
}

export function renderCharterReferenceBox(summary) {
    if (!summary) return '';
    return `
        <details class="mb-2.5 rounded-lg bg-[#F1E7D3] border border-[#8C6A4A]/60 text-[11px] text-[#3D2412] leading-snug">
            <summary class="flex items-center justify-between gap-2 px-2.5 py-2 font-bold text-[#5C3A21] cursor-pointer list-none">
                <span>📜 Check Approved Charter Baseline</span>
                <svg viewBox="0 0 16 16" class="details-chev w-3.5 h-3.5 text-[#7A5434] transition-transform duration-200 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
            </summary>
            <div class="px-2.5 pb-2 pt-1 border-t border-[#8C6A4A]/35 space-y-0.5">
                <div><strong>Objective:</strong> ${summary.objective}</div>
                <div><strong>Constraints:</strong> ${summary.constraints}</div>
                <div><strong>Out of Scope:</strong> ${summary.outOfScope}</div>
            </div>
        </details>
    `;
}

export function getScopeFeedbackMessage(st) {
    const outcome = st && st.scopeDecisionOutcome;
    if (!outcome) return null;
    const gw = st.goodwillStars || 0;
    const gwLabel = gw > 0 ? `+${gw}` : `${gw}`;
    const map = {
        in_scope_accepted: { warn: false, text: `🤝 Stakeholder Goodwill: ${gwLabel} • Included in-scope bilingual labels & food hygiene within plan.` },
        in_scope_rejected: { warn: true, text: `🤝 Stakeholder Goodwill: ${gwLabel} • Declined core usability & hygiene already implied by the stall Charter.` },
        in_scope_deferred: { warn: true, text: `🤝 Stakeholder Goodwill: ${gwLabel} • Deferred core pricing & food hygiene that were needed for opening day.` },
        in_scope_overformal: { warn: false, text: `🤝 Stakeholder Goodwill: ${gwLabel} • Requested a schedule extension for items already in scope.` },
        backlog: { warn: false, text: `🤝 Stakeholder Goodwill: ${gwLabel} • Properly deferred out-of-scope stage to Phase 2 Backlog.` },
        rejected: { warn: false, text: `🤝 Stakeholder Goodwill: ${gwLabel} • Protected scope by declining the out-of-scope stage.` },
        change_request: { warn: false, text: `🤝 Stakeholder Goodwill: ${gwLabel} • Used formal Change Control to re-baseline budget, schedule & scope.` },
        creep_accepted: { warn: true, text: `⚠️ Scope Creep Warning (Goodwill ${gwLabel}) • Accepted an unfunded stage outside the Charter.` },
        agile_reprioritized: { warn: false, text: `🤝 Stakeholder Goodwill: ${gwLabel} • Adapted Product Backlog at Sprint 1 Review without disrupting WIP.` },
        agile_rush_disrupted: { warn: true, text: `⚡ Sprint Disruption (Goodwill ${gwLabel}) • Expedited change directly into Sprint with RM 2,500 rush premium.` },
        agile_rigid_declined: { warn: true, text: `⚠️ Missed Adaptation (Goodwill ${gwLabel}) • Ignored high-value stakeholder feedback at Sprint 1 Review.` }
    };
    return map[outcome] || null;
}
