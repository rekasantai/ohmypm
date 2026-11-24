// Layer 3: Workspace View Renderers (Charter, WBS Builder, Inline WBS Tree, Agile Sprint Board).
import { getL4Metrics, getL4SprintNumber } from '../chapters/ch4-agile.js';
import { getMoSCoWBadge, getSkillBadgeColor, getSkillIconName, uiIcon } from '../core/constants.js';
import { getChapterCfg, getUnmetDependencyTasks, isTaskUnlocked, store } from '../core/state.js';
import { getArtisanPortraitSVG } from './artwork.js';
import { isMobileViewport } from './feedback.js';
import { renderTaskCard } from './task-card.js';

export function renderCharter() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('charter-workspace');
    if (!container) return;
    const st = store.state;
    const mobile = isMobileViewport();
    const placedIds = Object.values(st.charterBuckets).flatMap(b => b.filledIds);
    const remainingStatements = st.statements.filter(s => !placedIds.includes(s.id));

    let statementsHtml = '';
    if (remainingStatements.length > 0) {
        if (mobile) {
            const idx = ((store.ui.charterDeckIdx % remainingStatements.length) + remainingStatements.length) % remainingStatements.length;
            store.ui.charterDeckIdx = idx;
            const active = remainingStatements[idx];
            if (st.selectedStatementId !== active.id) st.selectedStatementId = active.id;
            const isBounced = st.bouncedStatementId === active.id;

            statementsHtml = `
                <div data-swipe-deck="charter" class="swipe-surface paper-card rounded-xl p-2.5 bg-[#FFFDF9] border-[#C58F2A]">
                    <div class="flex items-center justify-between gap-2 mb-1.5">
                        <div class="flex items-center gap-2 min-w-0">
                            ${getArtisanPortraitSVG('auntie-mei', 28)}
                            <span class="ts-caption font-bold text-[#5C3A21] truncate">Auntie Mei · Card ${idx + 1}/${remainingStatements.length}</span>
                        </div>
                        <div class="flex items-center gap-1 shrink-0">
                            <button type="button" onclick="stepCharterDeck(-1)" aria-label="Previous statement" ${remainingStatements.length <= 1 ? 'disabled' : ''} class="min-w-[34px] min-h-[32px] rounded-lg bg-[#F1E7D3] border border-[#8C6A4A]/70 text-xs font-bold text-[#3D2412] disabled:opacity-40 cursor-pointer">◀</button>
                            <button type="button" onclick="stepCharterDeck(1)" aria-label="Next statement" ${remainingStatements.length <= 1 ? 'disabled' : ''} class="min-w-[34px] min-h-[32px] rounded-lg bg-[#F1E7D3] border border-[#8C6A4A]/70 text-xs font-bold text-[#3D2412] disabled:opacity-40 cursor-pointer">▶</button>
                        </div>
                    </div>
                    <div onclick="selectStatement('${active.id}')" class="p-2.5 rounded-xl border-[1.5px] transition cursor-pointer ${isBounced ? 'animate-bounce-back border-[#B91C1C] bg-[#FEE2E2]' : 'bg-[#FFF5D6] border-[#C85A32] ring-2 ring-[#C85A32]/20'}">
                        <div class="ts-caption font-semibold text-[#241B15] leading-snug">${active.text}</div>
                        <div class="ts-micro font-bold text-[#C85A32] mt-1">↓ Tap matching Charter slot below</div>
                    </div>
                </div>
            `;
        } else {
            statementsHtml = `
                <div class="paper-card rounded-xl p-3 bg-[#FFFDF9]">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2.5">
                            ${getArtisanPortraitSVG('auntie-mei', 36)}
                            <div class="ts-caption font-bold text-[#5C3A21]">Auntie Mei’s Statement Cards</div>
                        </div>
                        <span class="ts-micro font-bold font-mono-crisp px-2 py-0.5 rounded bg-[#F1E7D3] text-[#5C3A21] shrink-0">${remainingStatements.length} left</span>
                    </div>
                    <div class="grid grid-cols-1 gap-1.5">
                        ${remainingStatements.map(s => {
                            const isSelected = st.selectedStatementId === s.id;
                            const isBounced = st.bouncedStatementId === s.id;
                            return `
                                <div onclick="selectStatement('${s.id}')" class="min-h-[46px] p-2.5 rounded-xl border-[1.5px] transition cursor-pointer flex items-center justify-between gap-2 ${isBounced ? 'animate-bounce-back border-[#B91C1C] bg-[#FEE2E2]' : isSelected ? 'bg-[#FFF5D6] border-[#C85A32] ring-2 ring-[#C85A32]/25' : 'bg-[#FFFDF5] border-[#C58F2A] hover:bg-[#FFF9E6]'}">
                                    <div class="ts-caption sm:ts-body font-medium text-[#241B15] leading-snug">${s.text}</div>
                                    <span class="shrink-0 px-2.5 py-1.5 rounded-lg ${isSelected ? 'bg-[#C85A32] text-white' : 'bg-[#F1E7D3] text-[#3D2412] border border-[#8C6A4A]/60'} ts-micro font-bold">
                                        ${isSelected ? 'Selected' : 'Select'}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    } else if (mobile) {
        st.selectedStatementId = null;
    }

    const bucketsHtml = Object.entries(st.charterBuckets).map(([key, bucket]) => {
        const filledStmts = bucket.filledIds.map(id => st.statements.find(s => s.id === id)).filter(Boolean);
        const isComplete = filledStmts.length >= bucket.maxItems;
        const awaitingTarget = Boolean(st.selectedStatementId) && !isComplete;
        return `
            <div onclick="handleCharterBucketClick('${key}')" class="min-h-[42px] sm:min-h-[48px] p-2 sm:p-2.5 rounded-xl border-[1.5px] transition cursor-pointer ${isComplete ? 'bg-[#EFF6F1] border-[#2E6F40]' : awaitingTarget ? 'bg-[#FFFDF5] border-dashed border-[#C85A32] hover:bg-[#FFF5D6]' : 'bg-[#FAF5EB] border-dashed border-[#8C6A4A] hover:bg-[#F1E7D3]'}">
                <div class="flex items-center justify-between gap-2">
                    <span class="ts-caption font-bold text-[#5C3A21]">${bucket.icon} ${bucket.label}</span>
                    <span class="ts-micro font-bold shrink-0 ${isComplete ? 'text-[#2E6F40]' : awaitingTarget ? 'text-[#C85A32]' : 'text-[#7A5434]'}">
                        ${isComplete ? `✓ ${filledStmts.length}/${bucket.maxItems}` : awaitingTarget ? `Place (${filledStmts.length}/${bucket.maxItems})` : `${bucket.hint} (${filledStmts.length}/${bucket.maxItems})`}
                    </span>
                </div>
                ${filledStmts.length > 0 ? `
                    <div class="mt-1 space-y-1">
                        ${filledStmts.map(fs => `
                            <div class="ts-micro sm:ts-caption font-bold text-[#241B15] bg-white/85 px-2 py-0.5 sm:py-1 rounded border border-[#8C6A4A]/40 truncate">
                                • ${fs.shortLabel}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    container.innerHTML = `
        ${statementsHtml}

        <div class="paper-card rounded-2xl p-2.5 sm:p-4 bg-[#FFFDF8] border-2 border-[#7A5434] relative overflow-hidden">
            <div class="flex items-center justify-between pb-1.5 sm:pb-2 mb-2 border-b-[1.5px] border-[#8C6A4A]/50">
                <div>
                    <span class="hidden sm:block ts-micro font-bold uppercase tracking-widest text-[#C85A32]">Initiating Phase Document</span>
                    <h3 class="text-sm sm:text-base font-bold text-[#5C3A21]">📜 Project Charter • Main Bazaar Cart</h3>
                </div>
                <span class="ts-caption font-bold font-mono-crisp px-2 py-0.5 rounded-md bg-[#5C3A21]/10 text-[#5C3A21] border border-[#5C3A21]/30 shrink-0">
                    ${placedIds.length}/${st.statements.length}
                </span>
            </div>

            <div class="space-y-1.5 sm:space-y-2">
                ${bucketsHtml}
            </div>

            ${st.charterAuthorized ? `
                <div class="mt-3 pt-2.5 border-t-[1.5px] border-[#8C6A4A]/40 flex items-center justify-between">
                    <span class="text-[11px] font-bold text-[#2E6F40]">Approved by Sponsor &amp; PM</span>
                    <div class="animate-seal">
                        <svg width="128" height="32" viewBox="0 0 128 32" shape-rendering="geometricPrecision" class="block">
                            <rect x="1.5" y="1.5" width="125" height="29" rx="5" fill="#FEE2E2" stroke="#B91C1C" stroke-width="2"/>
                            <rect x="4" y="4" width="120" height="24" rx="3" fill="none" stroke="#B91C1C" stroke-width="0.8"/>
                            <text x="64" y="20" text-anchor="middle" fill="#B91C1C" font-family="Fraunces, serif" font-weight="700" font-size="11.5" letter-spacing="1.2">APPROVED</text>
                        </svg>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

export function renderWbsBuilder() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('charter-workspace');
    if (!container) return;
    const st = store.state;
    const mobile = isMobileViewport();
    const placedIds = Object.values(st.wbsBuckets).flatMap(b => b.filledIds);
    const remainingCards = st.wbsCards.filter(c => !placedIds.includes(c.id));

    let cardsHtml = '';
    if (remainingCards.length > 0) {
        if (mobile) {
            const idx = ((store.ui.wbsDeckIdx % remainingCards.length) + remainingCards.length) % remainingCards.length;
            store.ui.wbsDeckIdx = idx;
            const active = remainingCards[idx];
            if (st.selectedWbsCardId !== active.id) st.selectedWbsCardId = active.id;
            const isBounced = st.bouncedWbsCardId === active.id;

            cardsHtml = `
                <div data-swipe-deck="wbs" class="swipe-surface paper-card rounded-xl p-2.5 bg-[#FFFDF9] border-[#C58F2A]">
                    <div class="flex items-center justify-between gap-2 mb-1.5">
                        <span class="ts-caption font-bold text-[#5C3A21] truncate">📋 Scope Card ${idx + 1}/${remainingCards.length}</span>
                        <div class="flex items-center gap-1 shrink-0">
                            <button type="button" onclick="stepWbsDeck(-1)" aria-label="Previous scope card" ${remainingCards.length <= 1 ? 'disabled' : ''} class="min-w-[34px] min-h-[32px] rounded-lg bg-[#F1E7D3] border border-[#8C6A4A]/70 text-xs font-bold text-[#3D2412] disabled:opacity-40 cursor-pointer">◀</button>
                            <button type="button" onclick="stepWbsDeck(1)" aria-label="Next scope card" ${remainingCards.length <= 1 ? 'disabled' : ''} class="min-w-[34px] min-h-[32px] rounded-lg bg-[#F1E7D3] border border-[#8C6A4A]/70 text-xs font-bold text-[#3D2412] disabled:opacity-40 cursor-pointer">▶</button>
                        </div>
                    </div>
                    <div onclick="selectWbsCard('${active.id}')" class="p-2.5 rounded-xl border-[1.5px] transition cursor-pointer ${isBounced ? 'animate-bounce-back border-[#B91C1C] bg-[#FEE2E2]' : 'bg-[#FFF5D6] border-[#C85A32] ring-2 ring-[#C85A32]/20'}">
                        <div class="flex items-center justify-between gap-2">
                            <div class="ts-caption font-bold text-[#241B15]">${active.title}</div>
                            <span class="ts-micro font-mono-crisp font-semibold text-[#5C3A21] shrink-0">${active.meta.split('•')[0].trim()}</span>
                        </div>
                        <div class="ts-micro text-[#5A4D41] leading-snug mt-0.5">${active.desc}</div>
                        <div class="ts-micro font-bold text-[#C85A32] mt-1">↓ Tap matching WBS package below</div>
                    </div>
                </div>
            `;
        } else {
            cardsHtml = `
                <div class="paper-card rounded-xl p-3 bg-[#FFFDF9]">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-xl">📋</span>
                            <div class="ts-caption font-bold text-[#5C3A21]">Scope Deliverable Cards</div>
                        </div>
                        <span class="ts-micro font-bold font-mono-crisp px-2 py-0.5 rounded bg-[#F1E7D3] text-[#5C3A21] shrink-0">${remainingCards.length} left</span>
                    </div>
                    <div class="grid grid-cols-1 gap-1.5">
                        ${remainingCards.map(c => {
                            const isSelected = st.selectedWbsCardId === c.id;
                            const isBounced = st.bouncedWbsCardId === c.id;
                            return `
                                <div onclick="selectWbsCard('${c.id}')" class="min-h-[46px] p-2.5 rounded-xl border-[1.5px] transition cursor-pointer flex items-center justify-between gap-2 ${isBounced ? 'animate-bounce-back border-[#B91C1C] bg-[#FEE2E2]' : isSelected ? 'bg-[#FFF5D6] border-[#C85A32] ring-2 ring-[#C85A32]/25' : 'bg-[#FFFDF5] border-[#C58F2A] hover:bg-[#FFF9E6]'}">
                                    <div class="min-w-0">
                                        <div class="ts-caption sm:ts-body font-bold text-[#241B15]">${c.title}</div>
                                        <div class="ts-micro text-[#5A4D41] leading-snug">${c.desc}</div>
                                    </div>
                                    <span class="shrink-0 px-2.5 py-1.5 rounded-lg ${isSelected ? 'bg-[#C85A32] text-white' : 'bg-[#F1E7D3] text-[#3D2412] border border-[#8C6A4A]/60'} ts-micro font-bold">
                                        ${isSelected ? 'Selected' : 'Select'}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    } else if (mobile) {
        st.selectedWbsCardId = null;
    }

    const bucketsHtml = Object.entries(st.wbsBuckets).map(([key, bucket]) => {
        const filledCards = bucket.filledIds.map(id => st.wbsCards.find(c => c.id === id)).filter(Boolean);
        const isComplete = filledCards.length >= bucket.maxItems;
        const awaitingTarget = Boolean(st.selectedWbsCardId) && !isComplete;
        const isOutBucket = key === 'outOfScope';
        return `
            <div onclick="handleWbsBucketClick('${key}')" class="min-h-[42px] sm:min-h-[48px] p-2 sm:p-2.5 rounded-xl border-[1.5px] transition cursor-pointer ${isComplete ? (isOutBucket ? 'bg-[#FEF2F2] border-[#B91C1C]' : 'bg-[#EFF6F1] border-[#2E6F40]') : awaitingTarget ? 'bg-[#FFFDF5] border-dashed border-[#C85A32] hover:bg-[#FFF5D6]' : 'bg-[#FAF5EB] border-dashed border-[#8C6A4A] hover:bg-[#F1E7D3]'}">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 min-w-0">
                        <span class="ts-micro font-bold font-mono-crisp px-1.5 py-0.5 rounded ${isOutBucket ? 'bg-[#B91C1C]/15 text-[#991B1B]' : 'bg-[#5C3A21]/10 text-[#5C3A21]'} shrink-0">${bucket.code}</span>
                        <span class="ts-caption font-bold text-[#5C3A21] truncate">${bucket.icon} ${bucket.label}</span>
                    </div>
                    <span class="shrink-0 ts-micro font-bold ${isComplete ? (isOutBucket ? 'text-[#991B1B]' : 'text-[#2E6F40]') : awaitingTarget ? 'text-[#C85A32]' : 'text-[#7A5434]'}">
                        ${isComplete ? `✓ ${filledCards.length}/${bucket.maxItems}` : awaitingTarget ? `Place (${filledCards.length}/${bucket.maxItems})` : `${filledCards.length}/${bucket.maxItems}`}
                    </span>
                </div>
                ${filledCards.length > 0 ? `
                    <div class="mt-1 space-y-1 pl-2.5 sm:pl-3 border-l-2 ${isOutBucket ? 'border-[#B91C1C]/40' : 'border-[#2E6F40]/40'}">
                        ${filledCards.map((fc, idx) => `
                            <div class="ts-micro sm:ts-caption font-bold text-[#241B15] bg-white/85 px-2 py-0.5 sm:py-1 rounded border border-[#8C6A4A]/40 flex items-center justify-between gap-2">
                                <span class="truncate">${isOutBucket ? '🚫' : `${bucket.code}.${idx + 1}`} ${fc.title}</span>
                                <span class="hidden sm:inline ts-micro font-mono-crisp text-[#5A4D41] shrink-0">${fc.meta}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    container.innerHTML = `
        ${cardsHtml}

        <div class="paper-card rounded-2xl p-2.5 sm:p-4 bg-[#FFFDF8] border-2 border-[#7A5434] relative overflow-hidden">
            <div class="flex items-center justify-between pb-1.5 sm:pb-2 mb-2 border-b-[1.5px] border-[#8C6A4A]/50">
                <div>
                    <span class="hidden sm:block ts-micro font-bold uppercase tracking-widest text-[#C85A32]">Step 1 • WBS 100% Rule Decomposition</span>
                    <h3 class="text-sm sm:text-base font-bold text-[#5C3A21]">📦 Work Breakdown Structure (1.0 Stall)</h3>
                </div>
                <span class="ts-caption font-bold font-mono-crisp px-2 py-0.5 rounded-md bg-[#5C3A21]/10 text-[#5C3A21] border border-[#5C3A21]/30 shrink-0">
                    ${placedIds.length}/${st.wbsCards.length}
                </span>
            </div>

            <div class="space-y-1.5 sm:space-y-2">
                ${bucketsHtml}
            </div>

            ${st.wbsAuthorized ? `
                <div class="mt-3 pt-2.5 border-t-[1.5px] border-[#8C6A4A]/40 flex items-center justify-between">
                    <span class="text-[11px] font-bold text-[#2E6F40]">WBS 100% Rule Verified</span>
                    <div class="animate-seal">
                        <svg width="136" height="32" viewBox="0 0 136 32" shape-rendering="geometricPrecision" class="block">
                            <rect x="1.5" y="1.5" width="133" height="29" rx="5" fill="#DCFCE7" stroke="#2E6F40" stroke-width="2"/>
                            <text x="68" y="20" text-anchor="middle" fill="#235732" font-family="Fraunces, serif" font-weight="700" font-size="10.5" letter-spacing="0.8">WBS APPROVED</text>
                        </svg>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

export function renderAgileBoard() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('wbs-tree-workspace');
    if (!container) return;
    const st = store.state;
    const mobile = isMobileViewport();
    const m4 = getL4Metrics(st);
    const sp = getL4SprintNumber(st.day);
    const wipLimit = st.wipLimit || (getChapterCfg().capabilities && getChapterCfg().capabilities.wipLimit) || 3;
    const priorityRank = { must: 0, should: 1, could: 2 };

    const activeTasks = st.tasks.filter(t => t.inSprint && (t.progress < 100 || t.hasDefect));
    const backlogTasks = st.tasks
        .filter(t => !t.inSprint && t.progress < 100 && !t.hasDefect)
        .sort((a, b) => (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9));
    const verifiedTasks = st.tasks.filter(t => t.progress >= 100 && !t.hasDefect);
    const unassignedSprintCount = activeTasks.filter(t => !t.assignedArtisanId && (t.hasDefect || isTaskUnlocked(t, st))).length;
    const hasFreeArtisan = st.artisans.some(a => !a.assignedTaskId && !a.resting);

    const activeTab = ['sprint', 'backlog', 'done'].includes(store.ui.agileMobileTab)
        ? store.ui.agileMobileTab
        : 'backlog';

    const sprintBannerHtml = `
        <div class="paper-card rounded-2xl p-2.5 sm:p-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5434] animate-crisp-in">
            <div class="flex items-center justify-between gap-2 mb-1">
                <div class="min-w-0">
                    <div class="ts-micro font-bold uppercase tracking-wider text-[#C85A32]">Sprint ${sp}/3 · Turn ${st.day}/${st.maxDays}</div>
                    <div class="hidden sm:block ts-caption font-bold text-[#241B15]">Festival Value Goal: ≥ ${st.minLaunchValue || 80} pts &amp; 3/3 Must-Haves</div>
                </div>
                <span class="shrink-0 ts-micro font-bold font-mono-crisp px-2 py-0.5 rounded-md border ${m4.activeSprintCount >= wipLimit ? 'bg-[#C85A32]/15 text-[#943011] border-[#C85A32]/40' : 'bg-[#2E6F40]/15 text-[#235732] border-[#2E6F40]/35'}">
                    WIP ${m4.activeSprintCount}/${wipLimit}
                </span>
            </div>
            <div class="h-2 w-full rounded-full bg-[#E6D9C2] relative overflow-hidden border border-[#8C6A4A]/40">
                <div class="h-full rounded-full transition-all duration-300 ${m4.canLaunch ? 'bg-[#2E6F40]' : 'bg-[#C58F2A]'}" style="width:${Math.min(100, m4.verifiedValue)}%;"></div>
                <span class="absolute top-0 bottom-0 w-[2px] bg-[#241B15]/75" style="left:80%;" title="Minimum 80 Value Launch Threshold"></span>
            </div>
            <div class="flex items-center justify-between ts-micro font-semibold text-[#5A4D41] mt-1">
                <span>Must: <strong class="${m4.mustDone === m4.mustTotal ? 'text-[#2E6F40]' : 'text-[#991B1B]'}">${m4.mustDone}/${m4.mustTotal}</strong> · ${m4.openDefects > 0 ? `<strong class="text-[#B91C1C]">${m4.openDefects} Defect${m4.openDefects > 1 ? 's' : ''} ⚠️</strong>` : '0 Defects ✅'}</span>
                <span class="font-mono-crisp text-[#241B15]">${m4.verifiedValue}/100 Val</span>
            </div>
        </div>
    `;

    const tabBtnCls = (tabKey) => {
        const isOn = activeTab === tabKey;
        return isOn
            ? 'btn-tactile min-h-[38px] px-2 py-1.5 rounded-lg bg-[#C58F2A] text-[#241B15] ts-micro font-extrabold border border-[#241B15] cursor-pointer truncate'
            : 'btn-tactile min-h-[38px] px-2 py-1.5 rounded-lg text-[#DECBA8] hover:bg-[#5C3A21] ts-micro font-bold cursor-pointer truncate';
    };

    const sprintUnassignedBadge = (unassignedSprintCount > 0 && activeTab !== 'sprint')
        ? ` <span class="inline-block ml-0.5 px-1.5 py-0.2 rounded-full bg-[#C85A32] text-white text-[9.5px] font-extrabold leading-tight align-middle">${unassignedSprintCount}</span>`
        : '';

    const mobileTabsHtml = mobile ? `
        <div id="agile-mobile-tabs" role="tablist" aria-label="Sprint Board Views" class="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#3D2412] border border-[#8C5E35]">
            <button type="button" role="tab" aria-selected="${activeTab === 'sprint'}" onclick="setAgileMobileTab('sprint')" class="${tabBtnCls('sprint')}">
                Sprint (${m4.activeSprintCount}/${wipLimit})${sprintUnassignedBadge}
            </button>
            <button type="button" role="tab" aria-selected="${activeTab === 'backlog'}" onclick="setAgileMobileTab('backlog')" class="${tabBtnCls('backlog')}">
                Backlog (${backlogTasks.length})
            </button>
            <button type="button" role="tab" aria-selected="${activeTab === 'done'}" onclick="setAgileMobileTab('done')" class="${tabBtnCls('done')}">
                Done (${verifiedTasks.length})
            </button>
        </div>
    ` : '';

    const activeCardsHtml = activeTasks.length > 0
        ? activeTasks.map(task => renderTaskCard(task, { variant: 'agile' })).join('')
        : `
            <div class="rounded-xl p-3 border-2 border-dashed border-[#C58F2A]/70 bg-[#FFF9E6]/60 text-center ts-caption font-medium text-[#5C3A21]">
                ${mobile
                    ? `No items in Sprint ${sp}. Switch to <strong>Backlog</strong> and tap <strong>+ Pull</strong> (up to ${wipLimit}).`
                    : `Tap <strong>+ Pull</strong> on up to ${wipLimit} items from the <strong>Product Backlog</strong> below to fill Sprint ${sp}.`}
            </div>
        `;

    const sprintSectionHtml = `
        <div class="paper-card rounded-2xl p-2.5 sm:p-3 bg-[#FAF5EB] border-[1.5px] border-[#7A5434] space-y-2">
            <div class="flex items-center justify-between pb-1.5 border-b border-[#8C6A4A]/40">
                <span class="ts-micro font-bold uppercase tracking-wider text-[#C85A32]">🔄 Active Sprint ${sp} (WIP ${m4.activeSprintCount}/${wipLimit})</span>
                <span class="ts-micro font-semibold text-[#5A4D41]">${activeTasks.length} active</span>
            </div>
            <div class="space-y-2">${activeCardsHtml}</div>
        </div>
    `;

    const backlogHtml = backlogTasks.length > 0 ? `
        <div class="paper-card rounded-2xl p-2 sm:p-3 bg-[#FAF5EB] border-[1.5px] border-[#7A5434]">
            <div class="flex items-center justify-between pb-1.5 sm:pb-2 mb-1.5 sm:mb-2 border-b border-[#8C6A4A]/40">
                <div>
                    <div class="ts-micro font-bold uppercase tracking-wider text-[#5C3A21]">Product Backlog (Value Order)</div>
                    <div class="hidden sm:block ts-caption font-bold text-[#241B15]">Choose What Delivers Most Value Before Turn 6</div>
                </div>
                <span class="ts-micro font-bold font-mono-crisp px-2 py-0.5 rounded bg-[#F1E7D3] text-[#5C3A21]">${backlogTasks.length} left</span>
            </div>
            <div class="space-y-1.5">
                ${backlogTasks.map(task => {
                    const unmetTasks = getUnmetDependencyTasks(task, st);
                    const unmetNames = unmetTasks.map(t => t.title);
                    const wipFull = m4.activeSprintCount >= wipLimit;
                    const isPulse = store.ui.highlightedTaskId === task.id;
                    const showQuickAssign = mobile && !wipFull && unmetNames.length === 0 && hasFreeArtisan;
                    if (showQuickAssign) {
                        return `
                            <div id="backlog-card-${task.id}" class="rounded-xl p-2.5 bg-[#FFFDF9] border-[1.5px] ${task.priority === 'could' ? 'border-[#9C8368] bg-[#F8F3E8]' : 'border-[#8C6A4A]'} ${isPulse ? 'dep-highlight-pulse' : ''}">
                                <div class="min-w-0">
                                    <div class="flex items-center flex-wrap gap-1.5">
                                        ${getMoSCoWBadge(task.priority)}
                                        <span class="ts-micro font-bold font-mono-crisp px-1.5 py-0.5 rounded bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/35">+${task.value} Val</span>
                                        <span class="ts-caption font-bold text-[#241B15] leading-snug">${task.title}</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-1.5 mt-1">
                                        <span class="inline-flex items-center gap-0.5 ts-micro font-bold px-1.5 py-0.5 rounded border ${getSkillBadgeColor(task.skill)}">${uiIcon(getSkillIconName(task.skill), 'w-2.5 h-2.5')}<span>${task.skill}</span></span>
                                        <span class="ts-micro font-semibold font-mono-crisp text-[#5A4D41]">RM ${task.cost.toLocaleString()} · ${task.effort}t</span>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-[#8C6A4A]/25">
                                    <button type="button" onclick="pullTaskToSprint('${task.id}', event)" class="btn-tactile min-h-[40px] px-2.5 py-1.5 rounded-lg font-bold ts-caption border shadow-sm cursor-pointer bg-[#5C3A21] hover:bg-[#3D2412] text-white border-[#241B15]">
                                        + Pull
                                    </button>
                                    <button type="button" onclick="pullAndAssignTask('${task.id}', event)" class="btn-tactile min-h-[40px] px-2.5 py-1.5 rounded-lg font-bold ts-caption border shadow-sm cursor-pointer bg-[#2E6F40] hover:bg-[#235732] text-white border-[#1B4226]">
                                        ⚡ Pull &amp; Assign
                                    </button>
                                </div>
                            </div>
                        `;
                    }
                    return `
                        <div id="backlog-card-${task.id}" class="rounded-xl p-2 sm:p-2.5 bg-[#FFFDF9] border-[1.5px] ${task.priority === 'could' ? 'border-[#9C8368] bg-[#F8F3E8]' : 'border-[#8C6A4A]'} ${isPulse ? 'dep-highlight-pulse' : ''} flex items-center justify-between gap-2">
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center flex-wrap gap-1.5">
                                    ${getMoSCoWBadge(task.priority)}
                                    <span class="ts-micro font-bold font-mono-crisp px-1.5 py-0.5 rounded bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/35">+${task.value} Val</span>
                                    <span class="ts-caption font-bold text-[#241B15] leading-snug">${task.title}</span>
                                </div>
                                <div class="flex flex-wrap items-center gap-1.5 mt-1">
                                    <span class="inline-flex items-center gap-0.5 ts-micro font-bold px-1.5 py-0.5 rounded border ${getSkillBadgeColor(task.skill)}">${uiIcon(getSkillIconName(task.skill), 'w-2.5 h-2.5')}<span>${task.skill}</span></span>
                                    <span class="ts-micro font-semibold font-mono-crisp text-[#5A4D41]">RM ${task.cost.toLocaleString()} · ${task.effort}t</span>
                                    ${unmetNames.length > 0 ? `<button type="button" onclick="focusDependencyTask('${unmetTasks[0].id}', event)" class="ts-micro font-semibold text-[#943011] underline cursor-pointer">Needs: ${unmetNames.join(' &amp; ')} ↗</button>` : ''}
                                </div>
                            </div>
                            <button type="button" onclick="pullTaskToSprint('${task.id}', event)" class="btn-tactile shrink-0 min-h-[42px] sm:min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-lg font-bold ts-caption border shadow-sm cursor-pointer ${wipFull ? 'bg-[#EFE6D4] text-[#7A5434] border-[#8C6A4A]/60' : 'bg-[#5C3A21] hover:bg-[#3D2412] text-white border-[#241B15]'}">
                                ${wipFull ? 'WIP Full' : '+ Pull'}
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    ` : (mobile ? '<div class="paper-card rounded-2xl p-3 bg-[#FAF5EB] text-center ts-caption font-medium text-[#5C3A21]">All Product Backlog items pulled into Sprint!</div>' : '');

    const doneHtml = verifiedTasks.length > 0 ? `
        <div class="paper-card rounded-2xl p-2.5 sm:p-3 bg-[#EFF6F1] border-[1.5px] border-[#2E6F40]">
            <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#2E6F40]/30">
                <span class="ts-micro font-bold uppercase tracking-wider text-[#235732]">✅ Verified Pavilion Increments (${verifiedTasks.length})</span>
                <span class="ts-micro font-bold font-mono-crisp text-[#235732]">+${m4.verifiedValue} Val</span>
            </div>
            <div class="grid grid-cols-1 gap-1">
                ${verifiedTasks.map(vt => `
                    <div class="flex items-center justify-between gap-2 px-2 py-1 rounded bg-white/80 border border-[#2E6F40]/25 ts-caption">
                        <span class="font-bold text-[#235732] truncate">${vt.title}</span>
                        <span class="shrink-0 ts-micro font-bold font-mono-crisp text-[#2E6F40]">+${vt.value} Val ✓</span>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : (mobile ? '<div class="paper-card rounded-2xl p-3 bg-[#FAF5EB] text-center ts-caption font-medium text-[#5C3A21]">No verified increments yet — complete Sprint work to score Festival Value!</div>' : '');

    if (mobile) {
        const panelHtml = activeTab === 'sprint'
            ? sprintSectionHtml
            : activeTab === 'done'
                ? doneHtml
                : backlogHtml;
        container.innerHTML = `${sprintBannerHtml}${mobileTabsHtml}<div class="swipe-surface space-y-3" data-swipe-agile="1">${panelHtml}</div>`;
        return;
    }

    container.innerHTML = `
        ${sprintBannerHtml}
        ${sprintSectionHtml}
        ${backlogHtml}
        ${doneHtml}
    `;
}

export function renderInlineWBSTree() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('wbs-tree-workspace');
    if (!container) return;
    const st = store.state;
    const mobile = isMobileViewport();
    const totalWPs = st.workPackages.length;
    const decomposedCount = st.workPackages.filter(w => w.decomposed).length;
    const allDecomposed = decomposedCount === totalWPs;
    const assignedCount = st.tasks.filter(t => t.assignedArtisanId && t.progress < 100).length;

    const stepBannerHtml = (totalWPs > 1 && !allDecomposed) ? `
        <div class="hidden sm:flex rounded-xl p-2.5 bg-[#FFFDF9] border-[1.5px] border-[#8C6A4A] items-center justify-between gap-2 ts-caption">
            <div class="flex items-center gap-1.5 font-bold text-[#C85A32]">
                <span>1️⃣</span>
                <span>Step 1: Decompose WBS (${decomposedCount}/${totalWPs})</span>
            </div>
            <span class="text-[#8C6A4A]">→</span>
            <div class="flex items-center gap-1.5 font-medium text-[#7A5434]">
                <span>2️⃣</span>
                <span>Step 2: Assign Team (${assignedCount} active)</span>
            </div>
        </div>
    ` : '';

    const treeHtml = st.workPackages.map((wp, wpIdx) => {
        const wpTasks = wp.taskIds.map(id => st.tasks.find(t => t.id === id)).filter(Boolean);
        const wpDoneCount = wpTasks.filter(t => t.progress >= 100).length;
        const wpAllDone = wpTasks.length > 0 && wpDoneCount === wpTasks.length;

        if (!wp.decomposed) {
            return `
                <div class="paper-card rounded-2xl p-2.5 sm:p-3.5 border-2 border-dashed border-[#5C3A21] bg-[#FFF9EC] animate-crisp-in">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
                            <span class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F1E7D3] flex items-center justify-center text-lg sm:text-xl border-[1.5px] border-[#8C6A4A] shrink-0">${wp.icon}</span>
                            <div class="min-w-0">
                                <div class="ts-micro font-bold uppercase tracking-wider text-[#C85A32]">WBS 1.${wpIdx + 1} · ${wpTasks.length} Tasks</div>
                                <div class="ts-caption sm:ts-body font-bold text-[#241B15] leading-snug truncate">${wp.title}</div>
                                <div class="hidden sm:block ts-caption font-medium text-[#5A4D41]">${wp.subtitle} — cannot assign until decomposed</div>
                            </div>
                        </div>
                        <button type="button" onclick="decomposeWorkPackage('${wp.id}')" class="shrink-0 min-h-[42px] sm:min-h-[40px] px-3 py-1.5 rounded-xl bg-[#5C3A21] hover:bg-[#3D2412] text-[#FFFDF8] ts-caption font-bold border border-[#241B15] shadow-sm transition cursor-pointer">
                            Decompose ▾
                        </button>
                    </div>
                </div>
            `;
        }

        const isCompletedExpanded = Boolean(store.ui.expandedCompletedWps && store.ui.expandedCompletedWps[wp.id]);
        if (mobile && wpAllDone && !isCompletedExpanded) {
            return `
                <div id="wp-collapsed-${wp.id}" onclick="toggleCompletedWp('${wp.id}')" class="paper-card rounded-2xl px-3 py-2 bg-[#EFF6F1] border-[1.5px] border-[#2E6F40] flex items-center justify-between gap-2 cursor-pointer">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="text-sm shrink-0">✅</span>
                        <span class="ts-caption font-bold text-[#235732] truncate">WBS 1.${wpIdx + 1} · ${wp.title}</span>
                    </div>
                    <span class="shrink-0 ts-micro font-bold font-mono-crisp text-[#235732]">${wpDoneCount}/${wpTasks.length} Done ▾</span>
                </div>
            `;
        }

        const childTasksHtml = wpTasks.map((task, tIdx) => {
            const wbsCode = `1.${wpIdx + 1}.${tIdx + 1}`;
            return `
                <div class="relative pl-2.5 sm:pl-4">
                    <div class="absolute left-0 top-0 bottom-1/2 w-2 sm:w-3 border-l-2 border-b-2 border-[#8C6A4A]/65 rounded-bl-md pointer-events-none"></div>
                    ${tIdx < wpTasks.length - 1 ? '<div class="absolute left-0 top-1/2 bottom-0 border-l-2 border-[#8C6A4A]/65 pointer-events-none"></div>' : ''}
                    ${renderTaskCard(task, { variant: 'predictive', wbsCode })}
                </div>
            `;
        }).join('');

        const wpHeaderClickAttr = (mobile && wpAllDone) ? `onclick="toggleCompletedWp('${wp.id}')"` : '';
        const wpHeaderCursorCls = (mobile && wpAllDone) ? 'cursor-pointer' : '';
        const wpCollapseChev = (mobile && wpAllDone) ? ' ▴' : '';

        return `
            <div class="paper-card rounded-2xl p-2 sm:p-3 bg-[#FAF5EB] border-[1.5px] border-[#7A5434] animate-crisp-in">
                <div ${wpHeaderClickAttr} class="flex items-center justify-between gap-2 pb-1.5 sm:pb-2 mb-1.5 sm:mb-2 border-b border-[#8C6A4A]/40 ${wpHeaderCursorCls}">
                    <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <span class="text-base shrink-0">${wp.icon}</span>
                        <div class="min-w-0">
                            <div class="hidden sm:block ts-micro font-bold uppercase tracking-wider text-[#2E6F40]">WBS 1.${wpIdx + 1} • Decomposed Work Package</div>
                            <div class="ts-caption font-bold text-[#241B15] truncate"><span class="sm:hidden text-[#2E6F40]">WBS 1.${wpIdx + 1} · </span>${wp.title}</div>
                        </div>
                    </div>
                    <span class="shrink-0 ts-micro font-bold font-mono-crisp px-2 py-0.5 rounded bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/30">
                        ${wpDoneCount}/${wpTasks.length} Done${wpCollapseChev}
                    </span>
                </div>
                <div class="space-y-1.5 sm:space-y-2">
                    ${childTasksHtml}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = stepBannerHtml + treeHtml;
}

export function renderWorkspace() {
    if (typeof document === 'undefined') return;
    const charterWs = document.getElementById('charter-workspace');
    const wbsTreeWs = document.getElementById('wbs-tree-workspace');
    if (!charterWs || !wbsTreeWs) return;

    const cfg = getChapterCfg();
    const st = store.state;

    if (cfg.mode === 'charter') {
        charterWs.classList.remove('hidden');
        wbsTreeWs.classList.add('hidden');
        renderCharter();
    } else if (cfg.mode === 'wbs_predictive' && st.phase === 'wbs_build') {
        charterWs.classList.remove('hidden');
        wbsTreeWs.classList.add('hidden');
        renderWbsBuilder();
    } else if (cfg.mode === 'agile_sprint') {
        charterWs.classList.add('hidden');
        wbsTreeWs.classList.remove('hidden');
        renderAgileBoard();
    } else {
        charterWs.classList.add('hidden');
        wbsTreeWs.classList.remove('hidden');
        renderInlineWBSTree();
    }
}
