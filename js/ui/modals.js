// Layer 3: Modals, Sarawak Career Map & PM Passport Drawer, Clipboard Events, Retro & Mobile Action Sheets.
import {
    CHAPTERS,
    getCareerRank,
    getChapter,
    getMaxTotalStars,
    getTotalEarnedStars
} from '../chapters/index.js';
import { SoundFX } from '../core/audio.js';
import { RetinaConfetti } from '../core/confetti.js';
import {
    DISABLED_MODAL_BTN,
    NEUTRAL_MODAL_BTN,
    RETRO_BTN,
    getScopeFeedbackMessage
} from '../core/constants.js';
import {
    computeRemainingTurns,
    getChapterCfg,
    getReworkCost,
    isTaskUnlocked,
    loadActiveRun,
    saveProgress,
    store
} from '../core/state.js';
import { getArtisanPortraitSVG } from './artwork.js';
import { isMobileViewport } from './feedback.js';
import { renderChapterBar } from './hud.js';

function rememberFocus() {
    if (typeof document !== 'undefined' && document.activeElement) {
        store.ui.lastFocusedEl = document.activeElement;
    }
}

function restoreFocus() {
    const el = store.ui.lastFocusedEl;
    store.ui.lastFocusedEl = null;
    if (el && typeof el.focus === 'function') {
        try {
            el.focus();
        } catch (_err) {
            // Element might have been detached during re-render.
        }
    }
}

// ---- 3-Step Interactive Welcome & Tutorial Modal ----
export function getTutorialSteps() {
    return [
        {
            badge: 'Step 1 of 3 • Career Arc',
            title: 'From Street Cart to Waterfront Festival',
            subtitle: 'A RekaSantai Game',
            illustration: `
                <svg viewBox="0 0 280 86" shape-rendering="geometricPrecision" class="w-full h-[84px] rounded-xl border border-[#8C6A4A]/50 bg-[#F5E8CE] block">
                    <rect x="0" y="72" width="280" height="14" fill="#C85A32"/>
                    <rect x="18" y="14" width="244" height="58" fill="#FFFDF9" stroke="#5C3A21" stroke-width="1.4"/>
                    <rect x="88" y="8" width="104" height="16" rx="3" fill="#5C3A21" stroke="#C58F2A" stroke-width="1.4"/>
                    <text x="140" y="18.5" text-anchor="middle" fill="#F6D365" font-family="Fraunces, serif" font-weight="700" font-size="8">OH MY PM!</text>
                    <rect x="44" y="42" width="76" height="30" rx="2" fill="#8C5227" stroke="#241B15" stroke-width="1.2"/>
                    <path d="M38 42 L48 30 L116 30 L126 42 Z" fill="#C85A32" stroke="#241B15" stroke-width="1.2"/>
                    <rect x="156" y="46" width="80" height="26" rx="2" fill="#E6F4EA" stroke="#241B15" stroke-width="1.2"/>
                    <rect x="172" y="34" width="14" height="12" rx="2" fill="#C58F2A" stroke="#241B15" stroke-width="1.1"/>
                    <path d="M179 31 Q177 27 180 24" stroke="#C85A32" stroke-width="1.3" fill="none" stroke-linecap="round"/>
                </svg>
            `,
            body: `
                <p class="text-xs text-[#241B15] leading-relaxed">
                    Grow your Sarawakian heritage restoration reputation across <strong>${CHAPTERS.length} progressively bigger commissions</strong>—each unlocking higher stakes and real <strong>Project Management</strong> tools:
                </p>
                <div class="bg-[#FAF5EB] p-2.5 rounded-xl border border-[#8C6A4A]/60 text-[11px] text-[#3D2412] space-y-1">
                    ${CHAPTERS.map(ch => `<div>${ch.tutorial.chapterLine}</div>`).join('')}
                </div>
            `
        },
        {
            badge: 'Step 2 of 3 • Core Framework',
            title: 'The Iron Triangle & Lifecycle',
            subtitle: 'Scope • Schedule • Budget',
            illustration: `
                <svg viewBox="0 0 280 86" shape-rendering="geometricPrecision" class="w-full h-[84px] rounded-xl border border-[#8C6A4A]/50 bg-[#3D2412] block">
                    <line x1="140" y1="10" x2="140" y2="26" stroke="#C58F2A" stroke-width="2.2"/>
                    <circle cx="140" cy="28" r="4" fill="#F6D365"/>
                    <line x1="52" y1="36" x2="228" y2="36" stroke="#C58F2A" stroke-width="3" stroke-linecap="round"/>
                    <rect x="28" y="42" width="66" height="24" rx="5" fill="#29170B" stroke="#F6D365" stroke-width="1.2"/>
                    <text x="61" y="57" text-anchor="middle" fill="#F6D365" font-size="8" font-weight="700">💰 BUDGET</text>
                    <rect x="107" y="48" width="66" height="24" rx="5" fill="#29170B" stroke="#FFFDF8" stroke-width="1.2"/>
                    <text x="140" y="63" text-anchor="middle" fill="#FFFDF8" font-size="8" font-weight="700">📅 SCHEDULE</text>
                    <rect x="186" y="42" width="66" height="24" rx="5" fill="#29170B" stroke="#A7F3D0" stroke-width="1.2"/>
                    <text x="219" y="57" text-anchor="middle" fill="#A7F3D0" font-size="8" font-weight="700">📐 SCOPE</text>
                </svg>
            `,
            body: `
                <p class="text-xs text-[#241B15] leading-relaxed">
                    Every project balances <strong>Scope</strong>, <strong>Schedule</strong>, and <strong>Budget</strong>. Earn client referrals by mastering each stage:
                </p>
                <div class="bg-[#FAF5EB] p-2.5 rounded-xl border border-[#8C6A4A]/60 text-[11px] text-[#3D2412] space-y-1">
                    ${CHAPTERS.map(ch => `<div>${ch.tutorial.lifecycleLine}</div>`).join('')}
                </div>
            `
        },
        {
            badge: 'Step 3 of 3 • Execution & Team',
            title: 'Pick Specialists, Stamina & Work Cycles',
            subtitle: 'Decompose, Assign & Execute',
            illustration: `
                <svg viewBox="0 0 280 86" shape-rendering="geometricPrecision" class="w-full h-[84px] rounded-xl border border-[#8C6A4A]/50 bg-[#FAF5EB] block">
                    <rect x="16" y="14" width="76" height="58" rx="8" fill="#FFFDF9" stroke="#5C3A21" stroke-width="1.4"/>
                    <text x="54" y="34" text-anchor="middle" font-size="14">⚡</text>
                    <text x="54" y="49" text-anchor="middle" fill="#241B15" font-size="7.5" font-weight="700">Pick Specialist</text>
                    <text x="54" y="61" text-anchor="middle" fill="#2E6F40" font-size="7" font-weight="700">Saves 1 Full Turn</text>

                    <rect x="102" y="14" width="76" height="58" rx="8" fill="#FFF9E6" stroke="#C58F2A" stroke-width="1.4"/>
                    <text x="140" y="34" text-anchor="middle" font-size="14">☕</text>
                    <text x="140" y="49" text-anchor="middle" fill="#5C3A21" font-size="7.5" font-weight="700">Rest Breaks</text>
                    <text x="140" y="61" text-anchor="middle" fill="#8C6106" font-size="7" font-weight="700">+45% Stamina</text>

                    <rect x="188" y="14" width="76" height="58" rx="8" fill="#FCEEE8" stroke="#C85A32" stroke-width="1.4"/>
                    <text x="226" y="34" text-anchor="middle" font-size="14">☀️</text>
                    <text x="226" y="49" text-anchor="middle" fill="#9E3514" font-size="7.5" font-weight="700">Workday / Week</text>
                    <text x="226" y="61" text-anchor="middle" fill="#241B15" font-size="7" font-weight="700">Build Diorama</text>
                </svg>
            `,
            body: `
                <p class="text-xs text-[#241B15] leading-relaxed">
                    Tap <strong>Assign</strong> on any ready Task to pick a team member (<strong>Uncle Lim</strong>, <strong>Kak Salmah</strong>, or <strong>Danny</strong>). Matching specialists save a full turn—and assigned artisans automatically continue multi-day work until finished or fatigued (&lt;35% stamina).
                </p>
                <div class="bg-[#FAF5EB] p-2.5 rounded-xl border border-[#8C6A4A]/60 text-[11px] text-[#3D2412] space-y-1">
                    <div>☕ Schedule <strong>Rest Breaks</strong> before stamina drops below 35% to prevent <strong>Burnout</strong> (-50% speed).</div>
                    <div>🗓️ Advance turn-by-turn across daily builds (L2), weekly control (L3), and Hybrid Agile Sprints (L4)!</div>
                </div>
            `
        }
    ];
}

export function renderTutorialModal() {
    if (typeof document === 'undefined') return;
    const overlay = document.getElementById('tutorial-overlay');
    if (!overlay) return;

    if (!store.tutorialState.showTutorial) {
        overlay.classList.add('tutorial-hidden');
        return;
    }

    const steps = getTutorialSteps();
    overlay.classList.remove('tutorial-hidden');
    const step = steps[store.tutorialState.step] || steps[0];
    const contentEl = document.getElementById('tutorial-step-content');
    const dotsEl = document.getElementById('tutorial-dots');
    const backBtn = document.getElementById('tut-btn-back');
    const nextBtn = document.getElementById('tut-btn-next');

    if (contentEl) {
        contentEl.innerHTML = `
            <div class="space-y-2.5 animate-crisp-in">
                <div class="flex items-center justify-between gap-2">
                    <span class="inline-block px-2.5 py-0.5 rounded-full bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/35 text-[10px] font-bold">
                        ${step.badge}
                    </span>
                    <span class="text-[10px] font-semibold text-[#7A5434]">${step.subtitle}</span>
                </div>
                <h2 id="tut-modal-title" class="text-lg font-bold text-[#5C3A21] leading-snug">${step.title}</h2>
                ${step.illustration}
                ${step.body}
            </div>
        `;
    }

    if (dotsEl) {
        dotsEl.innerHTML = steps.map((_, idx) => {
            const isActive = idx === store.tutorialState.step;
            return `
                <button type="button" onclick="openTutorialModal(${idx})" aria-label="Tutorial Step ${idx + 1}" class="w-7 h-7 rounded-full text-[11px] font-bold font-mono-crisp transition cursor-pointer flex items-center justify-center ${isActive ? 'bg-[#C85A32] text-white border border-[#7A2A10] scale-105' : 'bg-[#F1E7D3] text-[#5C3A21] border border-[#8C6A4A]/60 hover:bg-[#E4D4B5]'}">
                    ${idx + 1}
                </button>
            `;
        }).join('');
    }

    if (backBtn && backBtn.style) {
        backBtn.style.visibility = store.tutorialState.step === 0 ? 'hidden' : 'visible';
    }
    if (nextBtn) {
        if (store.tutorialState.step === steps.length - 1) {
            nextBtn.textContent = 'Start Level 1 🚀';
            nextBtn.className = 'min-h-[42px] px-4 py-2 rounded-xl bg-[#C85A32] hover:bg-[#B24D28] text-white text-xs font-bold border-2 border-[#7A2A10] border-b-4 transition cursor-pointer';
        } else {
            nextBtn.textContent = 'Next →';
            nextBtn.className = 'min-h-[42px] px-4 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#235732] text-white text-xs font-bold border-2 border-[#1B4226] border-b-4 transition cursor-pointer';
        }
    }
}

export function openTutorialModal(stepIndex = 0) {
    rememberFocus();
    store.tutorialState.showTutorial = true;
    store.tutorialState.step = Math.max(0, Math.min(getTutorialSteps().length - 1, stepIndex));
    renderTutorialModal();
}

export function closeTutorialModal() {
    SoundFX.woodClick();
    store.tutorialState.showTutorial = false;
    renderTutorialModal();
    restoreFocus();
}

export function changeTutorialStep(delta) {
    SoundFX.woodClick();
    const steps = getTutorialSteps();
    const next = store.tutorialState.step + delta;
    if (next < 0) return;
    if (next >= steps.length) {
        closeTutorialModal();
        return;
    }
    store.tutorialState.step = next;
    renderTutorialModal();
}

// ---- Confirm Dialog ----
export function showConfirm({ emoji = '⚠️', title, body, cancelLabel, okLabel, onOk }) {
    rememberFocus();
    store.ui.confirmOnOk = onOk || null;
    if (typeof document === 'undefined') return;
    document.getElementById('confirm-emoji').textContent = emoji;
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-body').textContent = body;
    document.getElementById('confirm-cancel-btn').textContent = cancelLabel;
    document.getElementById('confirm-ok-btn').textContent = okLabel;
    document.getElementById('confirm-modal').classList.remove('hidden');
    SoundFX.alertPop();
}

export function closeConfirm(accepted) {
    const action = accepted ? store.ui.confirmOnOk : null;
    store.ui.confirmOnOk = null;
    if (typeof document !== 'undefined') {
        document.getElementById('confirm-modal').classList.add('hidden');
    }
    if (accepted) SoundFX.woodClick();
    if (action) action();
    else restoreFocus();
}

// ---- Sarawak Career Map & PM Career Passport Drawer/Modal ----
export function buildCareerMapMarkup() {
    const earned = getTotalEarnedStars(store.levelStars);
    const maxStars = getMaxTotalStars();
    const rank = getCareerRank(earned, maxStars);
    const pct = maxStars > 0 ? Math.round((earned / maxStars) * 100) : 0;
    const savedRun = loadActiveRun();
    const completedCount = CHAPTERS.filter(ch => store.completedLevels[ch.id]).length;

    const passportBadgesHtml = CHAPTERS.map(ch => {
        const unlocked = Boolean(store.completedLevels[ch.id]);
        const badge = ch.retro.badge(true);
        return `
            <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg border text-left ${unlocked ? 'bg-[#FFF9E6] border-[#C58F2A] text-[#3D2412]' : 'bg-[#F1E7D3]/60 border-[#8C6A4A]/40 text-[#7A5434] opacity-75'}">
                <span class="text-sm shrink-0">${unlocked ? badge.icon : '🔒'}</span>
                <span class="ts-micro font-bold leading-tight">${badge.title}</span>
            </div>
        `;
    }).join('');

    const chapterCardsHtml = CHAPTERS.map(ch => {
        const isCurrent = Number(store.currentLevel) === ch.id;
        const isDone = Boolean(store.completedLevels[ch.id]);
        const stars = store.levelStars[ch.id] || 0;
        const hasSavedDraft = Boolean(savedRun && savedRun.level === ch.id && !isCurrent);
        const starsText = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

        return `
            <div class="rounded-xl p-2.5 border-[1.5px] flex items-center gap-2.5 transition ${isCurrent ? 'bg-[#FFF9E6] border-[#C58F2A] ring-2 ring-[#C58F2A]/25' : 'bg-[#FFFDF9] border-[#8C6A4A]/70 hover:border-[#C85A32]'}">
                <div class="w-16 h-12 rounded-lg overflow-hidden border border-[#7A5434] bg-[#3D2412] shrink-0 relative">
                    <img src="${ch.backdrop}" alt="${ch.title}" loading="lazy" class="w-full h-full object-cover block" onerror="this.style.display='none';"/>
                    <span class="absolute bottom-0.5 right-0.5 text-xs leading-none drop-shadow">${ch.emoji}</span>
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="ts-micro font-bold uppercase tracking-wider text-[#C85A32]">Ch ${ch.order}</span>
                        <span class="ts-micro font-semibold text-[#5A4D41] truncate">${ch.domain}</span>
                        ${isCurrent ? '<span class="px-1.5 py-0.2 rounded bg-[#C58F2A]/25 text-[#5C3A21] text-[9.5px] font-bold">Playing</span>' : ''}
                        ${hasSavedDraft ? '<span class="px-1.5 py-0.2 rounded bg-[#2E6F40]/15 text-[#235732] text-[9.5px] font-bold">Saved</span>' : ''}
                    </div>
                    <div class="ts-caption font-bold text-[#241B15] truncate mt-0.5">${ch.title}</div>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-xs tracking-tight">${starsText}</span>
                        <span class="ts-micro font-mono-crisp text-[#5A4D41]">${isDone ? '✓ Completed' : 'Ready'}</span>
                    </div>
                </div>
                <button type="button" onclick="selectCareerChapter(${ch.id})" class="btn-tactile shrink-0 min-h-[40px] px-3 py-1.5 rounded-lg ts-caption font-bold border cursor-pointer ${isCurrent ? 'bg-[#5C3A21] text-[#FFFDF8] border-[#241B15]' : isDone ? 'bg-[#2E6F40] hover:bg-[#235732] text-white border-[#1B4226]' : 'bg-[#C85A32] hover:bg-[#B24D28] text-white border-[#7A2A10]'}">
                    ${isCurrent ? 'Resume' : isDone ? 'Replay' : 'Play →'}
                </button>
            </div>
        `;
    }).join('');

    return { rank, earned, maxStars, pct, completedCount, passportBadgesHtml, chapterCardsHtml };
}

export function renderCareerMap() {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('career-map-modal');
    const body = document.getElementById('career-map-body');
    if (!modal || !body) return;

    const { rank, earned, maxStars, pct, completedCount, passportBadgesHtml, chapterCardsHtml } = buildCareerMapMarkup();

    body.innerHTML = `
        <!-- Sarawak PM Career Passport -->
        <div class="bg-[#FAF5EB] rounded-xl p-3 border-[1.5px] border-[#C58F2A] mb-3">
            <div class="flex items-center justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-2 min-w-0">
                    <span class="text-2xl shrink-0">${rank.icon}</span>
                    <div class="min-w-0">
                        <div class="ts-micro font-bold uppercase tracking-wider text-[#8C6106]">Sarawak PM Career Passport</div>
                        <div class="text-sm font-bold text-[#241B15] truncate">${rank.title}</div>
                    </div>
                </div>
                <div class="text-right shrink-0">
                    <div class="text-sm font-bold font-mono-crisp text-[#8C6106]">★ ${earned}/${maxStars}</div>
                    <div class="ts-micro font-semibold text-[#5A4D41]">${completedCount}/${CHAPTERS.length} Chapters</div>
                </div>
            </div>
            <div class="h-1.5 w-full rounded-full bg-[#E6D9C2] overflow-hidden mb-2">
                <div class="h-full rounded-full bg-[#C58F2A] transition-all duration-300" style="width:${pct}%;"></div>
            </div>
            <div class="ts-micro font-medium text-[#5A4D41] mb-2">${rank.nextHint}</div>
            <div class="grid grid-cols-2 gap-1.5">
                ${passportBadgesHtml}
            </div>
        </div>

        <!-- Scrollable Chapter Selector Cards -->
        <div class="space-y-2">
            ${chapterCardsHtml}
        </div>
    `;
}

export function openCareerMap() {
    if (store.state && store.state.isExecuting) return;
    rememberFocus();
    SoundFX.woodClick();
    store.ui.careerMapOpen = true;
    renderCareerMap();
    if (typeof document !== 'undefined') {
        const modal = document.getElementById('career-map-modal');
        if (modal) modal.classList.remove('hidden');
    }
}

export function closeCareerMap() {
    store.ui.careerMapOpen = false;
    if (typeof document !== 'undefined') {
        const modal = document.getElementById('career-map-modal');
        if (modal) modal.classList.add('hidden');
    }
    restoreFocus();
}

// ---- Mid-Project Clipboard Event Modal ----
export function openEventModal(modalSpec) {
    if (!modalSpec || typeof document === 'undefined') return;
    const modal = document.getElementById('event-modal');
    if (!modal) return;
    document.getElementById('modal-emoji').innerHTML = modalSpec.emojiHtml || '';
    document.getElementById('modal-tag').textContent = modalSpec.tag || '';
    document.getElementById('modal-title').textContent = modalSpec.title || '';
    document.getElementById('modal-body').innerHTML = modalSpec.bodyHtml || '';
    document.getElementById('modal-actions').innerHTML = (modalSpec.actions || []).map(act => `
        <button type="button" onclick="resolveChapterEvent('${act.id}')" ${act.disabled ? 'disabled' : ''} class="${act.disabled ? DISABLED_MODAL_BTN : NEUTRAL_MODAL_BTN}">
            <div class="text-xs font-bold text-[#241B15]">${act.title}</div>
            <div class="text-[11px] text-[#5A4D41]">${act.desc}</div>
        </button>
    `).join('');
    modal.classList.remove('hidden');
}

export function closeEventModal() {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('event-modal');
    if (modal) modal.classList.add('hidden');
}

// ---- Retrospective Certificate Modal ----
export function renderRetroActions(actions) {
    return actions.map(a => `
        <button type="button" onclick="${a.onclick}" class="${RETRO_BTN[a.style] || RETRO_BTN.secondary}">
            ${a.label}
        </button>
    `).join('');
}

export function renderRetroHints(isVictory) {
    if (typeof document === 'undefined') return;
    const box = document.getElementById('retro-hints');
    if (!box) return;
    if (isVictory) {
        box.classList.add('hidden');
        box.innerHTML = '';
        return;
    }
    const cfg = getChapterCfg();
    const payload = typeof cfg.buildFailureHints === 'function' ? cfg.buildFailureHints(store.state) : null;
    if (!payload || !Array.isArray(payload.hints) || payload.hints.length === 0) {
        box.classList.add('hidden');
        box.innerHTML = '';
        return;
    }

    box.innerHTML = `
        <div class="text-[10px] font-bold uppercase tracking-wider text-[#8C6106] mb-1.5">${payload.heading}</div>
        <div class="space-y-2">
            ${payload.hints.map(h => `
                <div class="flex items-start gap-2 text-[11px] text-[#3D2412] leading-snug">
                    <span class="text-base shrink-0">${h.icon}</span>
                    <div><div class="font-bold">${h.title}</div><div>${h.text}</div></div>
                </div>
            `).join('')}
        </div>
    `;
    box.classList.remove('hidden');
}

export function openRetrospective(isVictory) {
    SoundFX.taskComplete();
    if (isVictory) {
        RetinaConfetti.launch();
    }
    const st = store.state;
    const cfg = getChapterCfg();
    const doneCount = st.tasks.filter(t => t.progress >= 100).length;
    const totalCount = Math.max(1, st.tasks.length);
    const scopePct = cfg.mode === 'charter' ? 100 : Math.round((doneCount / totalCount) * 100);
    const daysRemaining = cfg.mode === 'charter' ? st.maxDays : Math.max(0, st.maxDays - st.day);
    const totalSaved = st.budget + (st.contingencyReserve || 0);

    const mastery = cfg.evaluateMastery(st, isVictory, daysRemaining, totalSaved);
    if (isVictory) {
        store.levelStars[st.level] = Math.max(store.levelStars[st.level] || 0, mastery.stars);
        store.completedLevels[st.level] = true;
        saveProgress();
        renderChapterBar();
    }

    if (typeof document === 'undefined') return;
    const modal = document.getElementById('retro-modal');
    const score = cfg.getRetroScorecard(st, isVictory, { scopePct, daysRemaining, totalSaved });

    document.getElementById('retro-budget').textContent = score.budgetText;
    const timeLabelEl = document.getElementById('retro-time-label');
    const retroDaysEl = document.getElementById('retro-days');
    const retroQualEl = document.getElementById('retro-quality');
    if (timeLabelEl) timeLabelEl.textContent = score.timeLabel;
    if (retroDaysEl) retroDaysEl.textContent = score.timeText;
    if (retroQualEl) retroQualEl.textContent = score.qualityText;

    document.getElementById('retro-stars-display').innerHTML = [0, 1, 2].map(idx => {
        const filled = idx < mastery.stars;
        return `<span class="animate-star-pop text-base ${filled ? 'text-[#C58F2A]' : 'text-[#B49474]/60'}" style="animation-delay:${idx * 120}ms">${filled ? '⭐' : '☆'}</span>`;
    }).join('');
    document.getElementById('retro-stars-criteria').innerHTML = mastery.criteria.map(c => `
        <div class="flex items-start gap-1.5 ${c.met ? 'text-[#235732] font-semibold' : 'text-[#5A4D41]'}">
            <span class="shrink-0">${c.met ? '✅' : '⬜'}</span>
            <span class="leading-snug">${c.label}</span>
        </div>
    `).join('');

    const scopeFeedbackEl = document.getElementById('retro-scope-feedback');
    if (scopeFeedbackEl) {
        const fb = cfg.mode !== 'charter' ? getScopeFeedbackMessage(st) : null;
        if (fb) {
            scopeFeedbackEl.textContent = fb.text;
            scopeFeedbackEl.className = `mt-2 pt-2 border-t border-[#C58F2A]/40 text-[11px] leading-snug font-semibold ${fb.warn ? 'text-[#9E3514]' : 'text-[#235732]'}`;
        } else {
            scopeFeedbackEl.textContent = '';
            scopeFeedbackEl.className = 'hidden mt-2 pt-2 border-t border-[#C58F2A]/40 text-[11px] leading-snug';
        }
    }

    const lvlRetro = cfg.retroPrompts;
    st.retroChoice = { wentWell: 0, toImprove: 0 };
    const retroSection = document.getElementById('retro-reflection-section');
    if (retroSection) {
        retroSection.innerHTML = `
            <div>
                <label class="block text-[10.5px] font-bold text-[#2E6F40] mb-1">✅ Project Retrospective — What Went Well</label>
                <div class="grid grid-cols-1 gap-1">
                    ${lvlRetro.well.map((txt, idx) => `
                        <button type="button" onclick="selectRetro('wentWell', ${idx}, this)" class="retro-opt-well min-h-[36px] text-left text-[11px] leading-snug p-2 rounded-xl ${idx === 0 ? 'border-2 border-[#2E6F40] bg-[#FFF9E6]' : 'border-[1.5px] border-[#8C6A4A] bg-white hover:bg-[#2E6F40]/10'} transition cursor-pointer">
                            ${txt}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div>
                <label class="block text-[10.5px] font-bold text-[#C85A32] mb-1">📝 Project Retrospective — What to Improve</label>
                <div class="grid grid-cols-1 gap-1">
                    ${lvlRetro.improve.map((txt, idx) => `
                        <button type="button" onclick="selectRetro('toImprove', ${idx}, this)" class="retro-opt-improve min-h-[36px] text-left text-[11px] leading-snug p-2 rounded-xl ${idx === 0 ? 'border-2 border-[#C85A32] bg-[#FFF9E6]' : 'border-[1.5px] border-[#8C6A4A] bg-white hover:bg-[#C85A32]/10'} transition cursor-pointer">
                            ${txt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    const retroCfg = cfg.retro;
    const badge = retroCfg.badge(isVictory);
    document.getElementById('retro-phase-tag').textContent = retroCfg.phaseTag(isVictory);
    document.getElementById('retro-headline').textContent = retroCfg.headline(isVictory, scopePct);
    document.getElementById('retro-sub').textContent = retroCfg.sub(isVictory);
    document.getElementById('badge-icon').textContent = badge.icon;
    document.getElementById('badge-title').textContent = badge.title;
    document.getElementById('badge-desc').textContent = badge.desc;
    document.getElementById('retro-footer-actions').innerHTML = renderRetroActions(retroCfg.actions(isVictory));

    renderRetroHints(isVictory);
    if (modal) modal.classList.remove('hidden');
}

// ---- Chapter Story Intro Modal (dynamic across CHAPTERS) ----
export function showChapterIntro(lvl) {
    const ch = getChapter(lvl);
    const data = ch && ch.intro;
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('chapter-intro-modal');
    if (!data || !modal) return;

    const currentIdx = ch.order;
    document.getElementById('intro-progress').innerHTML = CHAPTERS.map((item, i) => {
        const n = item.order;
        const done = n < currentIdx;
        const current = n === currentIdx;
        const dot = done
            ? 'bg-[#2E6F40] text-white border-[#1B4226]'
            : current
                ? 'bg-[#C85A32] text-white border-[#7A2A10] scale-110'
                : 'bg-[#F1E7D3] text-[#7A5434] border-[#8C6A4A]/60';
        const line = i < CHAPTERS.length - 1
            ? `<span class="w-5 sm:w-6 h-[2px] ${n < currentIdx ? 'bg-[#2E6F40]' : 'bg-[#8C6A4A]/40'}"></span>`
            : '';
        return `<span class="w-7 h-7 rounded-full border-2 text-[11px] font-bold flex items-center justify-center ${dot}">${done ? '✓' : n}</span>${line}`;
    }).join('');

    const sceneBanner = document.getElementById('intro-scene-banner');
    if (sceneBanner && ch.backdrop) {
        sceneBanner.innerHTML = `
            <img src="${ch.backdrop}" alt="${data.title}" loading="lazy" class="w-full h-full object-cover block" onerror="this.parentElement.classList.add('hidden')"/>
            <div class="absolute inset-0 bg-gradient-to-t from-[#241B15]/70 via-[#241B15]/15 to-transparent"></div>
            <span class="absolute bottom-1.5 left-3 text-[10px] font-bold uppercase tracking-wider text-[#FAF5EB] drop-shadow">${data.place}</span>
        `;
        sceneBanner.classList.remove('hidden');
    } else if (sceneBanner) {
        sceneBanner.classList.add('hidden');
    }

    document.getElementById('intro-tag').textContent = data.tag;
    document.getElementById('intro-emoji').textContent = data.emoji;
    document.getElementById('intro-title').textContent = data.title;
    document.getElementById('intro-place').textContent = data.place;
    document.getElementById('intro-story').innerHTML = data.story.map(t => `<p>${t}</p>`).join('');
    document.getElementById('intro-stats').innerHTML = data.stats.map(([icon, label, value]) => `
        <div class="bg-[#FAF5EB] p-2 rounded-xl border-[1.5px] border-[#8C6A4A]">
            <div class="text-[10px] font-semibold text-[#5A4D41]">${icon} ${label}</div>
            <div class="text-sm font-bold font-mono-crisp text-[#5C3A21] mt-0.5">${value}</div>
        </div>`).join('');

    const carryEl = document.getElementById('intro-carry');
    const carryHtml = data.carryFrom ? data.carryFrom(store.state) : '';
    if (carryHtml) {
        carryEl.innerHTML = `<div class="font-bold mb-1">${data.carryTitle}</div><div class="space-y-0.5">${carryHtml}</div>`;
        carryEl.classList.remove('hidden');
    } else {
        carryEl.classList.add('hidden');
    }

    document.getElementById('intro-skill-label').textContent = data.skillLabel;
    document.getElementById('intro-skills').innerHTML = data.skills.map(t => `<div>${t}</div>`).join('');
    document.getElementById('intro-start-btn').textContent = data.cta;

    modal.scrollTop = 0;
    modal.classList.remove('hidden');
    SoundFX.authorizeSeal();
}

export function startChapterFromIntro() {
    SoundFX.woodClick();
    if (typeof document !== 'undefined') {
        const modal = document.getElementById('chapter-intro-modal');
        if (modal) modal.classList.add('hidden');
    }
    restoreFocus();
}

// ---- Mobile Bottom Action Sheet ----
export function renderMobileSheet() {
    if (typeof document === 'undefined') return;
    const sheet = document.getElementById('mobile-action-sheet');
    const content = document.getElementById('mobile-sheet-content');
    if (!sheet || !content) return;

    const st = store.state;
    const cfg = getChapterCfg();
    if (!isMobileViewport() || st.isExecuting) {
        sheet.classList.add('hidden');
        return;
    }

    const pickTask = st.selectedAssignTaskId
        ? st.tasks.find(t => t.id === st.selectedAssignTaskId && (t.progress < 100 || t.hasDefect) && (t.hasDefect || isTaskUnlocked(t, st)))
        : null;

    if (pickTask) {
        const isDefect = Boolean(pickTask.hasDefect);
        const reworkCost = getReworkCost();
        const unitShort = cfg.mode === 'agile_sprint' ? 't' : (cfg.time.unit === 'Week' ? 'w' : 'd');
        content.innerHTML = `
            <div class="flex items-start justify-between gap-2 pb-2.5 mb-3 border-b border-[#8C6A4A]/35">
                <div class="min-w-0">
                    <div class="ts-micro font-bold uppercase tracking-wider ${isDefect ? 'text-[#B91C1C]' : 'text-[#C85A32]'}">${isDefect ? `QA Rework (1 Turn · RM ${reworkCost.toLocaleString()})` : `Assign ${pickTask.skill} Task`}</div>
                    <h3 class="text-base font-bold text-[#241B15] leading-snug">${pickTask.title}</h3>
                </div>
                <button type="button" onclick="closeMobileSheet()" aria-label="Close Assign Sheet" class="min-w-[44px] min-h-[44px] rounded-xl bg-[#F1E7D3] border border-[#8C6A4A] text-sm font-bold text-[#3D2412] flex items-center justify-center shrink-0 cursor-pointer">
                    ✕
                </button>
            </div>
            <div class="space-y-2">
                ${st.artisans.map(a => {
                    const isCurrent = pickTask.assignedArtisanId === a.id;
                    const isBusy = Boolean(a.assignedTaskId && a.assignedTaskId !== pickTask.id);
                    const isAvailable = !a.resting && !isBusy && !isCurrent;
                    const isMatch = a.skill === pickTask.skill;
                    const turns = computeRemainingTurns(pickTask, a, pickTask.crashed);
                    const isLow = a.stamina < 35;
                    const barColor = a.stamina >= 60 ? '#2E6F40' : a.stamina >= 35 ? '#C58F2A' : '#B91C1C';

                    if (!isAvailable) {
                        const reason = isCurrent ? 'Currently assigned here' : a.resting ? '☕ Scheduled for Rest Break' : 'Assigned to another task';
                        return `
                            <button type="button" disabled class="w-full min-h-[60px] p-2.5 rounded-xl border border-[#8C6A4A]/45 bg-[#EFE6D4] opacity-65 cursor-not-allowed flex items-center justify-between gap-3 text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    ${getArtisanPortraitSVG(a.id, 40, { fatigued: isLow, resting: a.resting, working: Boolean(a.assignedTaskId) })}
                                    <div class="min-w-0">
                                        <div class="text-sm font-bold text-[#3D2412] truncate">${a.name} · <span class="font-medium">${a.skill}</span></div>
                                        <div class="ts-caption font-semibold text-[#7A5434] truncate">${reason}</div>
                                    </div>
                                </div>
                                <span class="ts-caption font-bold font-mono-crisp shrink-0 ${isLow ? 'text-[#B91C1C]' : 'text-[#5A4D41]'}">${a.stamina}%</span>
                            </button>
                        `;
                    }

                    return `
                        <button type="button" onclick="assignArtisanToTask('${pickTask.id}', '${a.id}', event)" class="btn-tactile w-full min-h-[62px] p-2.5 rounded-xl border-[1.5px] ${isMatch ? 'border-[#2E6F40] bg-[#EFF6F1]' : 'border-[#8C6A4A] bg-[#FFFDF5]'} hover:bg-[#F1E7D3] transition cursor-pointer flex items-center justify-between gap-3 text-left">
                            <div class="flex items-center gap-2.5 min-w-0 flex-1">
                                ${getArtisanPortraitSVG(a.id, 40, { fatigued: isLow })}
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <span class="text-sm font-bold text-[#241B15]">${a.name}</span>
                                        <span class="ts-micro font-bold px-1.5 py-0.5 rounded ${isMatch ? 'bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/35' : 'bg-[#F1E7D3] text-[#5A4D41] border border-[#8C6A4A]/40'}">${isMatch ? '★ Specialist' : `${a.skill} (Off-skill)`}</span>
                                    </div>
                                    <div class="mt-1.5 flex items-center gap-2">
                                        <div class="flex-1 h-1.5 rounded-full bg-[#E6D9C2] relative overflow-hidden">
                                            <div class="h-full rounded-full" style="width:${a.stamina}%; background:${barColor};"></div>
                                            <span class="absolute top-0 bottom-0 w-[1.5px] bg-[#241B15]/60" style="left:35%;"></span>
                                        </div>
                                        <span class="ts-micro font-bold font-mono-crisp shrink-0 ${isLow ? 'text-[#B91C1C]' : 'text-[#5C3A21]'}">${isLow ? '⚠️ ' : ''}${a.stamina}%</span>
                                    </div>
                                </div>
                            </div>
                            <span class="shrink-0 px-2.5 py-1.5 rounded-lg ${isDefect ? 'bg-[#B91C1C]' : 'bg-[#2E6F40]'} text-white ts-caption font-bold font-mono-crisp">${isDefect ? 'Fix 1t →' : `~${turns}${unitShort} →`}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
        sheet.classList.remove('hidden');
        return;
    }

    const artisan = store.ui.mobileArtisanSheetId
        ? st.artisans.find(a => a.id === store.ui.mobileArtisanSheetId)
        : null;

    if (artisan) {
        const isBurnedOut = artisan.stamina < 35;
        const barColor = artisan.stamina >= 60 ? '#2E6F40' : artisan.stamina >= 35 ? '#C58F2A' : '#B91C1C';
        const assignedTask = artisan.assignedTaskId ? st.tasks.find(t => t.id === artisan.assignedTaskId) : null;
        content.innerHTML = `
            <div class="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-[#8C6A4A]/35">
                <div class="flex items-center gap-3 min-w-0">
                    ${getArtisanPortraitSVG(artisan.id, 52, { fatigued: isBurnedOut, resting: artisan.resting, working: Boolean(artisan.assignedTaskId) })}
                    <div class="min-w-0">
                        <div class="ts-micro font-bold uppercase tracking-wider text-[#C85A32]">${artisan.skill} Specialist</div>
                        <h3 class="text-lg font-bold text-[#241B15] leading-snug">${artisan.name}</h3>
                        <div class="ts-caption font-semibold text-[#5A4D41]">${artisan.resting ? '☕ Scheduled for Rest Break' : assignedTask ? `🔨 Assigned: ${assignedTask.title}` : isBurnedOut ? '⚠️ Fatigued (< 35% stamina = -50% speed)' : '✅ Ready for assignment'}</div>
                    </div>
                </div>
                <button type="button" onclick="closeMobileSheet()" aria-label="Close Artisan Sheet" class="min-w-[44px] min-h-[44px] rounded-xl bg-[#F1E7D3] border border-[#8C6A4A] text-sm font-bold text-[#3D2412] flex items-center justify-center shrink-0 cursor-pointer">
                    ✕
                </button>
            </div>

            <div class="bg-[#FAF5EB] p-3 rounded-xl border-[1.5px] border-[#8C6A4A]/60 mb-3">
                <div class="flex items-center justify-between ts-caption font-bold mb-1.5">
                    <span class="text-[#5C3A21]">Stamina (${isBurnedOut ? 'Burnout Risk!' : '35% Burnout Line'})</span>
                    <span class="font-mono-crisp ${isBurnedOut ? 'text-[#B91C1C]' : 'text-[#2E6F40]'}">${artisan.stamina}%</span>
                </div>
                <div class="h-2.5 w-full rounded-full bg-[#E6D9C2] relative overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-300" style="width:${artisan.stamina}%; background:${barColor};"></div>
                    <span class="absolute top-0 bottom-0 w-[2px] bg-[#241B15]/70" style="left:35%;"></span>
                </div>
            </div>

            <div class="space-y-2">
                <button type="button" onclick="toggleRestBreak('${artisan.id}', event); closeMobileSheet();" class="btn-tactile w-full min-h-[48px] py-3 rounded-xl font-bold text-sm border-2 flex items-center justify-center gap-2 transition cursor-pointer ${artisan.resting ? 'bg-[#F1E7D3] text-[#3D2412] border-[#8C6A4A]' : isBurnedOut ? 'bg-[#B91C1C] text-white border-[#7F1D1D] border-b-4' : 'bg-[#2E6F40] text-white border-[#1B4226] border-b-4'}">
                    ${artisan.resting ? 'Cancel Rest Break' : '☕ Schedule Rest Break (+45% Stamina)'}
                </button>
                ${assignedTask ? `
                    <button type="button" onclick="closeMobileSheet(); openTaskAssignPicker('${assignedTask.id}', event);" class="btn-tactile w-full min-h-[46px] py-2.5 rounded-xl bg-[#FAF5EB] border-[1.5px] border-[#8C6A4A] text-xs font-bold text-[#3D2412] cursor-pointer">
                        Unassign from ${assignedTask.title}
                    </button>
                ` : ''}
            </div>
        `;
        sheet.classList.remove('hidden');
        return;
    }

    sheet.classList.add('hidden');
}

// ---- Global Escape Handler (does not dismiss mandatory event/retro dialogs) ----
export function handleGlobalKeydown(e, { closeMobileSheetFn } = {}) {
    if (!e || e.key !== 'Escape' || typeof document === 'undefined') return;
    const confirmModal = document.getElementById('confirm-modal');
    if (confirmModal && !confirmModal.classList.contains('hidden')) {
        closeConfirm(false);
        return;
    }
    const sheet = document.getElementById('mobile-action-sheet');
    if (sheet && !sheet.classList.contains('hidden') && typeof closeMobileSheetFn === 'function') {
        closeMobileSheetFn();
        return;
    }
    const careerModal = document.getElementById('career-map-modal');
    if (careerModal && !careerModal.classList.contains('hidden')) {
        closeCareerMap();
        return;
    }
    const tutOverlay = document.getElementById('tutorial-overlay');
    if (tutOverlay && !tutOverlay.classList.contains('tutorial-hidden')) {
        closeTutorialModal();
        return;
    }
    const introModal = document.getElementById('chapter-intro-modal');
    if (introModal && !introModal.classList.contains('hidden')) {
        startChapterFromIntro();
    }
}
