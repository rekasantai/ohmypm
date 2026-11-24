// Layer 3: Unified Task Card, Inline Desktop Artisan Picker & Mobile Task Action Bar.
// Shared across BOTH Predictive WBS Tree (L2/L3) and Hybrid Agile Sprint Board (L4).
import {
    getMoSCoWBadge,
    getSkillBadgeColor,
    getSkillIconName,
    uiIcon
} from '../core/constants.js';
import {
    computeRemainingTurns,
    getChapterCfg,
    getCrashCost,
    getReworkCost,
    getUnmetDependencyTasks,
    isTaskUnlocked,
    store
} from '../core/state.js';
import { getArtisanPortraitSVG } from './artwork.js';

export function renderInlineArtisanPicker(task, { unitShort, isDefect, reworkCost }) {
    const st = store.state;
    const cols = Math.min(Math.max(st.artisans.length, 1), 4);
    const scrollCls = st.artisans.length > 4 ? 'artisan-dock-grid-scroll pb-1' : '';
    const headerLabel = isDefect
        ? `QA Rework (1 Turn · RM ${reworkCost.toLocaleString()})`
        : `Pick Artisan (${task.skill} Task)`;

    return `
        <div onclick="event.stopPropagation()" class="hidden sm:block mt-2.5 pt-2 border-t border-[#8C6A4A]/40">
            <div class="flex items-center justify-between mb-1.5">
                <span class="ts-micro font-bold uppercase tracking-wider text-[#5C3A21]">${headerLabel}</span>
                <button type="button" onclick="openTaskAssignPicker('${task.id}', event)" class="ts-micro font-bold text-[#7A5434] hover:text-[#241B15] cursor-pointer">Close ✕</button>
            </div>
            <div class="artisan-dock-grid ${scrollCls} gap-1.5" style="--artisan-cols:${cols};">
                ${st.artisans.map(a => {
                    const isCurrent = task.assignedArtisanId === a.id;
                    const isBusy = Boolean(a.assignedTaskId && a.assignedTaskId !== task.id);
                    const isAvailable = !a.resting && !isBusy && !isCurrent;
                    const turns = computeRemainingTurns(task, a, task.crashed);
                    const isLow = a.stamina < 35;

                    if (!isAvailable) {
                        const reason = isCurrent ? 'Current' : a.resting ? '☕ Resting' : 'Busy';
                        return `
                            <button type="button" disabled class="p-1.5 rounded-lg border border-[#8C6A4A]/45 bg-[#EFE6D4] opacity-60 cursor-not-allowed text-left min-w-0">
                                <div class="flex items-center justify-between gap-1">
                                    ${getArtisanPortraitSVG(a.id, 18)}
                                    <span class="ts-micro font-bold font-mono-crisp ${isLow ? 'text-[#B91C1C]' : 'text-[#5A4D41]'}">${a.stamina}%</span>
                                </div>
                                <div class="ts-micro font-bold text-[#3D2412] mt-1 truncate">${a.name}</div>
                                <div class="ts-micro font-semibold text-[#7A5434] truncate">${reason}</div>
                            </button>
                        `;
                    }

                    return `
                        <button type="button" onclick="assignArtisanToTask('${task.id}', '${a.id}', event)" class="p-1.5 rounded-lg border-[1.5px] border-[#8C6A4A] bg-[#FFFDF5] hover:bg-[#F1E7D3] transition cursor-pointer text-left min-w-0">
                            <div class="flex items-center justify-between gap-1">
                                ${getArtisanPortraitSVG(a.id, 18)}
                                <span class="ts-micro font-bold font-mono-crisp ${isLow ? 'text-[#B91C1C]' : 'text-[#5C3A21]'}">${isLow ? '⚠️' : ''}${a.stamina}%</span>
                            </div>
                            <div class="ts-micro font-bold text-[#241B15] mt-1 truncate">${a.name}</div>
                            <div class="flex items-center justify-between gap-1 mt-0.5">
                                <span class="ts-micro font-medium text-[#5A4D41] truncate">${a.skill}</span>
                                <span class="ts-micro font-bold font-mono-crisp text-[#3D2412] shrink-0">${isDefect ? 'Fix 1t' : `~${turns}${unitShort}`}</span>
                            </div>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

export function renderMobileTaskActionBar(task, { assignedArtisan, isDone, isDefect, canReturn, crashEnabled, crashCost }) {
    if ((!assignedArtisan || isDone) && !canReturn) return '';
    return `
        <div onclick="event.stopPropagation()" class="flex sm:hidden items-center gap-2 mt-2.5 pt-2 border-t border-[#8C6A4A]/25">
            ${assignedArtisan ? `
                <button type="button" onclick="swapTaskArtisan('${task.id}', event)" class="btn-tactile flex-1 min-h-[42px] px-2.5 py-1.5 rounded-lg bg-[#F1E7D3] hover:bg-[#E4D4B5] border border-[#8C6A4A]/70 text-xs font-bold text-[#3D2412] flex items-center justify-center gap-1 cursor-pointer">
                    🔄 Swap
                </button>
                ${crashEnabled && !isDefect ? `
                    <button type="button" onclick="toggleTaskCrash('${task.id}', event)" class="btn-tactile flex-1 min-h-[42px] px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer ${task.crashed ? 'bg-[#9E3514] text-white border-[#5C1A06]' : 'bg-[#FFF9E6] hover:bg-[#F5E6BC] text-[#7A5404] border-[#C58F2A]'}">
                        ${task.crashed ? '⚡ Crashed' : `⚡ Crash +RM ${crashCost.toLocaleString()}`}
                    </button>
                ` : ''}
            ` : ''}
            ${canReturn ? `
                <button type="button" onclick="returnTaskToBacklog('${task.id}', event)" class="btn-tactile ${assignedArtisan ? '' : 'w-full'} min-h-[42px] px-2.5 py-1.5 rounded-lg bg-[#FAF5EB] hover:bg-[#EFE6D4] border border-[#8C6A4A]/70 text-xs font-bold text-[#5C3A21] cursor-pointer">
                    ↩ Backlog
                </button>
            ` : ''}
        </div>
    `;
}

export function renderTaskCard(task, opts = {}) {
    const st = store.state;
    const cfg = getChapterCfg();
    const caps = cfg.capabilities || {};
    const crashEnabled = Boolean(caps.crashing);
    const crashCost = getCrashCost();
    const reworkCost = getReworkCost();
    const isAgile = Boolean(opts.variant === 'agile');
    const isDefect = Boolean(task.hasDefect);
    const isDone = !isDefect && task.progress >= 100;
    const unlocked = isDefect ? true : isTaskUnlocked(task, st);
    const assignedArtisan = st.artisans.find(a => a.id === task.assignedArtisanId) || null;
    const unmetTasks = unlocked ? [] : getUnmetDependencyTasks(task, st);
    const unmetNames = unmetTasks.map(t => t.title);
    const canReturn = isAgile && !isDefect && task.progress === 0 && !task.paid;
    const unitShort = cfg.mode === 'agile_sprint' ? 't' : (cfg.time.unit === 'Week' ? 'w' : 'd');
    const isPickerOpen = st.selectedAssignTaskId === task.id && unlocked && !isDone;
    const isPulse = store.ui.highlightedTaskId === task.id;

    let cardStyle = 'rounded-xl p-2.5 sm:p-3 border-[1.5px] border-l-4 transition relative';
    if (isDefect) {
        cardStyle += assignedArtisan
            ? ' bg-[#FEF2F2] border-[#B91C1C] border-l-[#B91C1C] ring-2 ring-[#B91C1C]/25'
            : ' bg-[#FEF2F2] border-[#B91C1C] border-l-[#B91C1C]';
    } else if (isDone) {
        cardStyle += ' bg-[#EFF6F1] border-[#2E6F40] border-l-[#2E6F40]';
    } else if (!unlocked) {
        cardStyle += ' bg-[#EFE6D4] border-[#9C8368] border-l-[#9C8368]';
    } else if (assignedArtisan) {
        const leftBorder = isAgile ? 'border-l-[#C85A32]' : (task.critical ? 'border-l-[#C85A32]' : 'border-l-[#C58F2A]');
        cardStyle += ` bg-[#FFFDF9] border-[#C85A32] ${leftBorder} ring-2 ring-[#C85A32]/20`;
    } else if (isAgile) {
        cardStyle += ` bg-[#FFFDF9] border-[#8C6A4A] ${task.priority === 'must' ? 'border-l-[#B91C1C]' : 'border-l-[#C58F2A]'} hover:border-[#C85A32]`;
    } else if (task.critical) {
        cardStyle += ' bg-[#FFFDF9] border-[#8C6A4A] border-l-[#C85A32] hover:border-[#C85A32]';
    } else {
        cardStyle += ' bg-[#FFFDF9] border-[#8C6A4A] border-l-[#8C6A4A] hover:border-[#C85A32]';
    }
    if (isPulse) cardStyle += ' dep-highlight-pulse';

    const titleRowHtml = isAgile
        ? `
            <div class="flex items-start sm:items-center flex-wrap gap-1.5 min-w-0">
                ${getMoSCoWBadge(task.priority)}
                <span class="ts-micro font-bold font-mono-crisp px-1.5 py-0.5 rounded bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/35">+${task.value} Val</span>
                <h4 class="ts-body sm:ts-caption font-bold text-[#241B15] leading-snug">${task.title}</h4>
            </div>
        `
        : `
            <div class="flex items-start sm:items-center flex-wrap sm:flex-nowrap gap-1.5 min-w-0">
                <span class="shrink-0 flex items-center mt-0.5 sm:mt-0 ${isDone ? 'text-[#2E6F40]' : !unlocked ? 'text-[#7A5434]' : task.critical ? 'text-[#C85A32]' : 'text-[#5C3A21]'}">
                    ${isDone ? uiIcon('check', 'w-3.5 h-3.5') : !unlocked ? uiIcon('lock', 'w-3.5 h-3.5') : uiIcon('compass', 'w-3.5 h-3.5')}
                </span>
                <h4 class="ts-body sm:ts-caption font-bold text-[#241B15] leading-snug sm:truncate ${isDone ? 'line-through text-[#2E6F40]' : ''}">
                    ${task.title}
                </h4>
                <span class="shrink-0 inline-flex items-center gap-0.5 ts-micro font-bold px-1.5 py-0.5 rounded-md border ${getSkillBadgeColor(task.skill)}">
                    ${uiIcon(getSkillIconName(task.skill), 'w-2.5 h-2.5')}
                    <span>${task.skill}</span>
                </span>
            </div>
        `;

    const metaRowHtml = isAgile
        ? `
            <div class="flex flex-wrap items-center gap-1.5 mt-1">
                <span class="shrink-0 inline-flex items-center gap-0.5 ts-micro font-bold px-1.5 py-0.5 rounded-md border ${getSkillBadgeColor(task.skill)}">
                    ${uiIcon(getSkillIconName(task.skill), 'w-2.5 h-2.5')}
                    <span>${task.skill}</span>
                </span>
                <span class="ts-micro font-semibold font-mono-crisp text-[#5A4D41]">
                    ${isDefect ? `QA Fix: RM ${reworkCost.toLocaleString()} · 1 Turn` : `${task.paid ? '✓ Paid' : `RM ${task.cost.toLocaleString()}`} · ${task.effort} ${task.effort === 1 ? 'Turn' : 'Turns'}`}
                </span>
                ${task.persisted && assignedArtisan ? '<span class="ts-micro px-1.5 py-0.5 rounded bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/35 font-bold">↻ Continuing</span>' : ''}
                ${task.crashed ? `<span class="inline-flex items-center gap-0.5 ts-micro px-1.5 py-0.5 rounded bg-[#9E3514] text-white font-bold">${uiIcon('bolt', 'w-2.5 h-2.5')} Crashed</span>` : ''}
            </div>
        `
        : `
            <div class="flex flex-wrap items-center gap-1.5 mt-1">
                <span class="ts-micro font-semibold font-mono-crisp text-[#5A4D41]">
                    ${opts.wbsCode ? `${opts.wbsCode} · ` : ''}${task.paid ? '✓ Paid' : `RM ${task.cost.toLocaleString()}`} · ${task.effort || 1} ${cfg.time.effort[(task.effort || 1) === 1 ? 0 : 1]}
                </span>
                ${task.critical ? `<span class="inline-flex items-center gap-0.5 ts-micro px-1.5 py-0.5 rounded bg-[#C85A32]/15 text-[#943011] border border-[#C85A32]/30 font-bold">${uiIcon('flame', 'w-2.5 h-2.5')} Critical</span>` : ''}
                ${task.outdoor ? `<span class="inline-flex items-center gap-0.5 ts-micro px-1.5 py-0.5 rounded bg-[#2B5783]/12 text-[#1E4063] border border-[#2B5783]/25 font-semibold">${uiIcon('sunCloud', 'w-2.5 h-2.5')} Outdoor</span>` : ''}
                ${task.persisted && assignedArtisan ? '<span class="ts-micro px-1.5 py-0.5 rounded bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/35 font-bold">↻ Continuing</span>' : ''}
                ${task.crashed ? `<span class="inline-flex items-center gap-0.5 ts-micro px-1.5 py-0.5 rounded bg-[#9E3514] text-white font-bold">${uiIcon('bolt', 'w-2.5 h-2.5')} Crashed +50%</span>` : ''}
            </div>
        `;

    const statusSectionHtml = isDefect
        ? `<p class="ts-micro text-[#991B1B] font-bold mt-1">⚠️ Defect (+${task.value} Val paused · 1t QA -RM ${reworkCost.toLocaleString()})</p>`
        : !unlocked
            ? `<p class="ts-micro text-[#943011] font-semibold mt-1">🔒 Needs: ${unmetNames.join(' &amp; ')} <span class="underline opacity-85">↗</span></p>`
            : task.progress > 0 && !isDone
                ? `
                    <div class="mt-1.5">
                        <div class="flex justify-between ts-micro font-bold font-mono-crisp text-[#5C3A21] mb-0.5">
                            <span>Progress</span>
                            <span>${task.progress}%</span>
                        </div>
                        <div class="w-full h-1.5 bg-[#F1E7D3] rounded-full overflow-hidden border border-[#8C6A4A]/50">
                            <div class="h-full bg-[#2E6F40] transition-all duration-300" style="width: ${task.progress}%"></div>
                        </div>
                    </div>
                `
                : '';

    const rightControlHtml = isDone
        ? '<span class="px-2 py-1 rounded-lg bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/40 ts-micro font-bold">Complete</span>'
        : !unlocked
            ? '<span class="px-2 py-1 rounded-lg bg-[#5C3A21]/10 text-[#3D2412] ts-micro font-semibold">Locked</span>'
            : assignedArtisan
                ? `
                    <div class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${isDefect ? 'bg-[#B91C1C] border-[#7F1D1D]' : 'bg-[#C85A32] border-[#7A2A10]'} text-white border" title="Tap card to unassign">
                        ${getArtisanPortraitSVG(assignedArtisan.id, 22)}
                        <div class="text-left leading-none">
                            <div class="ts-micro font-bold">${assignedArtisan.name.split(' ')[0]}</div>
                            <div class="text-[9.5px] font-medium">${isDefect ? 'QA Fix 1t' : (assignedArtisan.skill === task.skill ? 'Specialist' : 'Off-skill')}</div>
                        </div>
                    </div>
                    <div class="hidden sm:flex items-center gap-1">
                        <button type="button" onclick="swapTaskArtisan('${task.id}', event)" class="px-2 py-1 rounded bg-[#F1E7D3] hover:bg-[#E4D4B5] border border-[#8C6A4A]/60 ts-micro font-bold text-[#3D2412] cursor-pointer">
                            🔄 Swap
                        </button>
                        ${crashEnabled && !isDefect ? `
                            <button type="button" onclick="toggleTaskCrash('${task.id}', event)" title="Schedule Crashing: +50% Speed for +RM ${crashCost.toLocaleString()} &amp; -15% extra stamina" class="px-2 py-1 rounded border ts-micro font-bold transition cursor-pointer ${task.crashed ? 'bg-[#9E3514] text-white border-[#5C1A06]' : 'bg-[#FFF9E6] hover:bg-[#F5E6BC] text-[#7A5404] border-[#C58F2A]'}">
                                ${task.crashed ? '⚡ Crashed' : `⚡ Crash +RM ${crashCost.toLocaleString()}`}
                            </button>
                        ` : ''}
                        ${canReturn ? `
                            <button type="button" onclick="returnTaskToBacklog('${task.id}', event)" class="px-2 py-1 rounded bg-[#FAF5EB] hover:bg-[#EFE6D4] border border-[#8C6A4A]/60 ts-micro font-bold text-[#5C3A21] cursor-pointer">
                                ↩ Backlog
                            </button>
                        ` : ''}
                    </div>
                `
                : `
                    <button type="button" onclick="openTaskAssignPicker('${task.id}', event)" class="btn-tactile min-h-[44px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 rounded-lg ${isPickerOpen ? 'bg-[#C85A32] border-[#7A2A10]' : isDefect ? 'bg-[#B91C1C] hover:bg-[#991B1B] border-[#7F1D1D]' : 'bg-[#2E6F40] hover:bg-[#235732] border-[#1B4226]'} text-white ts-caption font-bold border shadow-sm cursor-pointer">
                        ${isPickerOpen ? 'Pick ↓' : isDefect ? '🔧 Fix Defect' : '⚡ Assign'}
                    </button>
                    ${canReturn ? `
                        <button type="button" onclick="returnTaskToBacklog('${task.id}', event)" class="hidden sm:inline-block px-2 py-0.5 rounded bg-[#FAF5EB] hover:bg-[#EFE6D4] border border-[#8C6A4A]/60 ts-micro font-bold text-[#5C3A21] cursor-pointer">
                            ↩ Backlog
                        </button>
                    ` : ''}
                `;

    const pickerHtml = isPickerOpen ? renderInlineArtisanPicker(task, { unitShort, isDefect, reworkCost }) : '';
    const mobileActionBar = renderMobileTaskActionBar(task, { assignedArtisan, isDone, isDefect, canReturn, crashEnabled, crashCost });

    return `
        <div id="card-${task.id}" onclick="openTaskAssignPicker('${task.id}', event)" class="${cardStyle} cursor-pointer">
            <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                    ${titleRowHtml}
                    ${metaRowHtml}
                    ${statusSectionHtml}
                </div>
                <div class="shrink-0 flex flex-col items-end justify-center gap-1">
                    ${rightControlHtml}
                </div>
            </div>
            ${mobileActionBar}
            ${pickerHtml}
        </div>
    `;
}
