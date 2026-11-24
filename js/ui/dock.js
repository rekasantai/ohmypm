// Layer 3: Sticky Bottom Dock (Unclipped Mobile Team Chips, Pre-Turn Impact Preview & Primary CTA).
import { getL4SprintNumber } from '../chapters/ch4-agile.js';
import { uiIcon } from '../core/constants.js';
import {
    allWorkPackagesDecomposed,
    computeTurnPreview,
    getChapterCfg,
    getTimeUnit,
    getWorkTurnLabel,
    shortArtisanName,
    store
} from '../core/state.js';
import { getArtisanPortraitSVG } from './artwork.js';

export function renderTurnPreviewStrip() {
    if (typeof document === 'undefined') return;
    const strip = document.getElementById('turn-preview-strip');
    if (!strip) return;

    const st = store.state;
    const cfg = getChapterCfg();
    if (cfg.mode === 'charter' || (cfg.mode === 'wbs_predictive' && st.phase === 'wbs_build')) {
        strip.classList.add('hidden');
        strip.innerHTML = '';
        return;
    }

    strip.classList.remove('hidden');
    const preview = computeTurnPreview(st, cfg);
    if (!preview.hasActions) {
        strip.innerHTML = '<div class="ts-micro text-[#7A5434] font-medium text-center leading-tight">Tap Assign on a Task (or ☕ Rest) to preview turn spend.</div>';
        return;
    }

    const parts = [];
    const spendCls = preview.overBudget ? 'text-[#B91C1C] font-extrabold' : 'text-[#3D2412] font-bold';
    parts.push(`<span class="font-mono-crisp ${spendCls}">Est. spend: RM ${preview.plannedSpend.toLocaleString()}${preview.overBudget ? ' ⚠️ Over Budget' : ''}</span>`);

    if (preview.willCreateDefectCount > 0) {
        parts.push('<span class="px-1.5 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B] font-bold border border-[#B91C1C]/40">⚠️ Defect likely on completion!</span>');
    } else if (preview.burnedOutActive.length > 0) {
        parts.push(`<span class="px-1.5 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B] font-bold border border-[#B91C1C]/40">⚠️ Burnout (-50%): ${preview.burnedOutActive.join(', ')}</span>`);
    } else if (preview.willTireNames.length > 0) {
        parts.push(`<span class="px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#7A5404] font-semibold border border-[#C58F2A]/50">⚡ Low after turn: ${preview.willTireNames.join(', ')}</span>`);
    }

    if (preview.restingNames.length > 0) {
        parts.push(`<span class="px-1.5 py-0.5 rounded bg-[#EFF6F1] text-[#235732] font-semibold border border-[#2E6F40]/35">☕ Resting: ${preview.restingNames.join(', ')}</span>`);
    }

    strip.innerHTML = `<div class="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 ts-micro leading-tight">${parts.join('')}</div>`;
}

export function renderDock() {
    if (typeof document === 'undefined') return;
    const artisanWrapper = document.getElementById('artisan-dock-wrapper');
    const primaryBtn = document.getElementById('btn-primary-action');
    if (!artisanWrapper || !primaryBtn) return;

    const st = store.state;
    const cfg = getChapterCfg();

    if (cfg.mode === 'charter') {
        artisanWrapper.classList.add('hidden');
        renderTurnPreviewStrip();
        const totalSorted = Object.values(st.charterBuckets).reduce((sum, b) => sum + b.filledIds.length, 0);
        const allSorted = totalSorted === st.statements.length;
        primaryBtn.className = allSorted
            ? 'btn-tactile w-full min-h-[46px] py-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-sm border-2 border-[#7F1D1D] border-b-4 flex items-center justify-center gap-2 transition cursor-pointer'
            : 'w-full min-h-[46px] py-3 rounded-xl bg-[#9C8368] text-[#FFFDF8] font-bold text-sm border-2 border-[#7A5434] flex items-center justify-center gap-2 cursor-not-allowed';
        primaryBtn.innerHTML = allSorted
            ? `${uiIcon('scroll', 'w-4 h-4')}<span>Approve Project Charter</span>`
            : `${uiIcon('scroll', 'w-4 h-4')}<span>Sort All ${st.statements.length} Statements (${totalSorted}/${st.statements.length})</span>`;
        return;
    }

    if (cfg.mode === 'wbs_predictive' && st.phase === 'wbs_build') {
        artisanWrapper.classList.add('hidden');
        renderTurnPreviewStrip();
        const totalPlaced = Object.values(st.wbsBuckets).reduce((sum, b) => sum + b.filledIds.length, 0);
        const allMapped = totalPlaced === st.wbsCards.length;
        primaryBtn.className = allMapped
            ? 'btn-tactile w-full min-h-[46px] py-3 rounded-xl bg-[#2E6F40] hover:bg-[#235732] text-white font-bold text-sm border-2 border-[#1B4226] border-b-4 flex items-center justify-center gap-2 transition cursor-pointer'
            : 'w-full min-h-[46px] py-3 rounded-xl bg-[#9C8368] text-[#FFFDF8] font-bold text-sm border-2 border-[#7A5434] flex items-center justify-center gap-2 cursor-not-allowed';
        primaryBtn.innerHTML = allMapped
            ? `${uiIcon('box', 'w-4 h-4')}<span>Approve WBS &amp; Start Build →</span>`
            : `${uiIcon('box', 'w-4 h-4')}<span>Map All ${st.wbsCards.length} Scope Cards (${totalPlaced}/${st.wbsCards.length})</span>`;
        return;
    }

    artisanWrapper.classList.remove('hidden');
    renderTurnPreviewStrip();

    const wbsReady = allWorkPackagesDecomposed(st);
    if (!wbsReady) {
        primaryBtn.className = 'w-full min-h-[46px] py-3 rounded-xl bg-[#9C8368] text-[#FFFDF8] font-bold text-sm border-2 border-[#7A5434] flex items-center justify-center gap-2 cursor-pointer';
        primaryBtn.innerHTML = `${uiIcon('lock', 'w-4 h-4')}<span>Step 1: Decompose All Work Packages First</span>`;
    } else if (cfg.mode === 'agile_sprint') {
        primaryBtn.className = 'btn-tactile w-full min-h-[46px] py-3 rounded-xl bg-[#C85A32] hover:bg-[#B24D28] text-white font-bold text-sm border-2 border-[#7A2A10] border-b-4 flex items-center justify-center gap-2 transition cursor-pointer';
        const ctaText = st.day >= st.maxDays
            ? `Final Turn: Launch Opening Night! (${st.day} of ${st.maxDays})`
            : `Start Sprint ${getL4SprintNumber(st.day)} Turn (${st.day} of ${st.maxDays})`;
        primaryBtn.innerHTML = `${uiIcon('calendar', 'w-4 h-4')}<span>${ctaText}</span>`;
    } else {
        const turnIconName = cfg.time.unit === 'Week' ? 'calendar' : 'sun';
        primaryBtn.className = 'btn-tactile w-full min-h-[46px] py-3 rounded-xl bg-[#C85A32] hover:bg-[#B24D28] text-white font-bold text-sm border-2 border-[#7A2A10] border-b-4 flex items-center justify-center gap-2 transition cursor-pointer';
        primaryBtn.innerHTML = `${uiIcon(turnIconName, 'w-4 h-4')}<span>Start ${getWorkTurnLabel()} (${getTimeUnit(false)} ${st.day} of ${st.maxDays})</span>`;
    }

    const dock = document.getElementById('artisans-dock');
    if (!dock) return;

    const cols = Math.min(Math.max(st.artisans.length, 1), 4);
    const scrollCls = st.artisans.length > 4 ? 'artisan-dock-grid-scroll' : '';
    dock.className = `artisan-dock-grid ${scrollCls} gap-1.5 sm:gap-2 mb-1.5 sm:mb-2`;
    if (dock.style) {
        if (typeof dock.style.setProperty === 'function') dock.style.setProperty('--artisan-cols', String(cols));
        else dock.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    }

    const readyCount = st.artisans.filter(a => !a.assignedTaskId && !a.resting).length;
    const readyPill = document.getElementById('selected-artisan-pill');
    if (readyPill) readyPill.textContent = `${readyCount} of ${st.artisans.length} Ready`;

    dock.innerHTML = st.artisans.map(a => {
        const isBurnedOut = a.stamina < 35;
        const barColor = a.stamina >= 60 ? '#2E6F40' : a.stamina >= 35 ? '#C58F2A' : '#B91C1C';
        const shortName = shortArtisanName(a.name);

        let statusTag = '<span class="ts-micro font-bold text-[#2E6F40]">Ready</span>';
        if (a.resting) {
            statusTag = `<span class="inline-flex items-center gap-0.5 ts-micro font-bold text-[#8C6106]">${uiIcon('coffee', 'w-2.5 h-2.5')} Resting</span>`;
        } else if (a.assignedTaskId) {
            statusTag = '<span class="ts-micro font-bold text-[#C85A32]">Assigned</span>';
        } else if (isBurnedOut) {
            statusTag = '<span class="ts-micro font-bold text-[#B91C1C]">Fatigued</span>';
        }

        const pulseCls = (!a.resting && !a.assignedTaskId && isBurnedOut)
            ? 'animate-fatigue-pulse border-[#B91C1C]'
            : (a.assignedTaskId ? 'border-[#C85A32]' : 'border-[#8C6A4A]');

        return `
            <div onclick="handleArtisanCardTap('${a.id}', event)" class="artisan-card-item rounded-xl p-1.5 sm:p-2 bg-[#FFFDF9] border-[1.5px] ${pulseCls} flex flex-col justify-between min-w-0 cursor-pointer sm:cursor-default">
                <!-- Mobile Compact Unclipped Team Chip (< 640px): portrait left, name on full row, bar + % below -->
                <div class="flex sm:hidden items-center gap-1.5 min-h-[44px] min-w-0">
                    <div class="shrink-0">
                        ${getArtisanPortraitSVG(a.id, 26, { fatigued: isBurnedOut, resting: a.resting, working: Boolean(a.assignedTaskId) })}
                    </div>
                    <div class="flex-1 min-w-0">
                        <span class="artisan-card-name text-[11px] font-bold text-[#241B15] leading-tight block truncate">${shortName}</span>
                        <div class="mt-1 flex items-center gap-1 min-w-0">
                            <div class="flex-1 h-1.5 rounded-full bg-[#E6D9C2] relative overflow-hidden" title="Stamina ${a.stamina}% (35% burnout line)">
                                <div class="h-full rounded-full transition-all duration-300" style="width:${a.stamina}%; background:${barColor};"></div>
                                <span class="absolute top-0 bottom-0 w-[1.5px] bg-[#241B15]/60" style="left:35%;"></span>
                            </div>
                            <span class="text-[9.5px] font-bold font-mono-crisp shrink-0 leading-none ${isBurnedOut ? 'text-[#B91C1C]' : 'text-[#2E6F40]'}">${a.stamina}%</span>
                        </div>
                    </div>
                </div>

                <!-- Desktop Full Roster Card (>= 640px) -->
                <div class="hidden sm:flex sm:flex-col sm:justify-between h-full">
                    <div>
                        <div class="flex items-center justify-between gap-1.5">
                            ${getArtisanPortraitSVG(a.id, 34, { fatigued: isBurnedOut, resting: a.resting, working: Boolean(a.assignedTaskId) })}
                            <div class="text-right min-w-0">
                                <span class="ts-micro font-bold font-mono-crisp ${isBurnedOut ? 'text-[#B91C1C]' : 'text-[#2E6F40]'}">
                                    ${a.stamina}%
                                </span>
                                <div class="ts-micro font-semibold text-[#7A5434] truncate">${a.skill}</div>
                            </div>
                        </div>
                        <div class="artisan-card-name ts-caption font-bold text-[#241B15] mt-1 truncate">${a.name}</div>
                        <div class="mt-1 h-1.5 w-full rounded-full bg-[#E6D9C2] relative overflow-hidden" title="Stamina ${a.stamina}% (35% burnout line)">
                            <div class="h-full rounded-full transition-all duration-300" style="width:${a.stamina}%; background:${barColor};"></div>
                            <span class="absolute top-0 bottom-0 w-[1.5px] bg-[#241B15]/60" style="left:35%;"></span>
                        </div>
                    </div>

                    <div class="mt-1.5 pt-1 border-t border-[#8C6A4A]/30 flex items-center justify-between gap-1">
                        ${statusTag}
                        <button type="button" onclick="toggleRestBreak('${a.id}', event)" title="Rest Break (+45% Stamina)" class="btn-tactile artisan-rest-btn min-h-[28px] px-1.5 py-0.5 rounded border ts-micro font-bold shrink-0 cursor-pointer flex items-center gap-0.5 ${!a.resting && !a.assignedTaskId && isBurnedOut ? 'bg-[#FEE2E2] hover:bg-[#FECACA] border-[#B91C1C] text-[#991B1B]' : 'bg-[#F1E7D3] hover:bg-[#E4D4B5] border-[#8C6A4A]/60 text-[#3D2412]'}">
                            ${a.resting ? 'Cancel' : `${uiIcon('coffee', 'w-2.5 h-2.5')}<span>${!a.assignedTaskId && isBurnedOut ? 'Rest!' : 'Rest'}</span>`}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
