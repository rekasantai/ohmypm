// Layer 4: Core Game Engine — turn execution, event dispatch, user actions & view orchestration.
import { getChapter } from '../chapters/index.js';
import { getL4Metrics, getL4SprintNumber } from '../chapters/ch5-agile.js';
import { clearToasts, highlightDependencyTask, injectBrandingElements, isMobileViewport, showToast, syncGuidanceClamp, syncMobileShellClasses, updateGuidance } from '../ui/feedback.js';
import { renderWorkspace } from '../ui/board.js';
import { renderDiorama } from '../ui/diorama.js';
import { renderDock } from '../ui/dock.js';
import { renderChapterBar, renderHUD } from '../ui/hud.js';
import {
    closeCareerMap,
    closeConfirm,
    closeEventModal,
    openCareerMap,
    openEventModal,
    openRetrospective,
    renderCareerMap,
    renderMobileSheet,
    renderTutorialModal,
    showChapterIntro,
    showConfirm
} from '../ui/modals.js';
import { SoundFX, setMuted } from './audio.js';
import { RetinaConfetti } from './confetti.js';
import { CRASH_EXTRA_STAMINA, uiIcon } from './constants.js';
import {
    allWorkPackagesDecomposed,
    clearActiveRun,
    clearSavedProgress,
    computeRemainingTurns,
    computeTurnSpeed,
    getChapterCfg,
    getCrashCost,
    getReworkCost,
    getTimeUnit,
    getUnmetDependencies,
    getUnmetDependencyTasks,
    getWorkTurnLabel,
    hasUnsavedProgress,
    isTaskUnlocked,
    loadActiveRun,
    loadPrefs,
    loadProgress,
    saveActiveRun,
    savePrefs,
    saveProgress,
    stateSignature,
    store
} from './state.js';

export function renderAll() {
    syncMobileShellClasses();
    renderChapterBar();
    renderHUD();
    renderDiorama();
    renderWorkspace();
    renderDock();
    renderMobileSheet();
}

export function handleViewportChange() {
    RetinaConfetti.resizeCanvas();
    syncMobileShellClasses();
    syncGuidanceClamp();
    renderHUD();
    renderWorkspace();
    renderMobileSheet();
}

export function toggleMute() {
    const nextMuted = SoundFX.toggleMute();
    store.prefs.muted = nextMuted;
    savePrefs();
    setMuted(nextMuted);
}

export function toggleFastTurn() {
    store.prefs.fastTurn = !store.prefs.fastTurn;
    savePrefs();
    SoundFX.woodClick();
    renderChapterBar();
    showToast(
        store.prefs.fastTurn
            ? '⏩ Fast Turn ON — workday animations skipped'
            : '🎬 Normal Turn animations restored',
        'info'
    );
}

export function toggleMobileSiteDrawer() {
    SoundFX.woodClick();
    store.ui.mobileSiteExpanded = !store.ui.mobileSiteExpanded;
    syncMobileShellClasses();
}

export function handleArtisanCardTap(artisanId, event) {
    if (!isMobileViewport()) return;
    openMobileArtisanSheet(artisanId, event);
}

export function openMobileArtisanSheet(artisanId, event) {
    if (event) event.stopPropagation();
    if (store.state.isExecuting) return;
    SoundFX.woodClick();
    store.state.selectedAssignTaskId = null;
    store.ui.mobileArtisanSheetId = artisanId;
    renderMobileSheet();
}

export function closeMobileSheet() {
    const hadSheet = Boolean(store.state.selectedAssignTaskId || store.ui.mobileArtisanSheetId);
    store.state.selectedAssignTaskId = null;
    store.ui.mobileArtisanSheetId = null;
    renderMobileSheet();
    if (hadSheet && store.state.phase === 'execution') {
        renderWorkspace();
    }
}

export function toggleContextBanner() {
    SoundFX.woodClick();
    store.ui.contextExpanded = !store.ui.contextExpanded;
    renderHUD();
}

export function toggleGuidanceExpand() {
    if (!isMobileViewport()) return;
    SoundFX.woodClick();
    store.ui.guidanceExpanded = !store.ui.guidanceExpanded;
    syncGuidanceClamp();
}

export function stepCharterDeck(delta) {
    const st = store.state;
    if (!st || !st.statements) return;
    const placedIds = Object.values(st.charterBuckets || {}).flatMap(b => b.filledIds || []);
    const remaining = st.statements.filter(s => !placedIds.includes(s.id));
    if (remaining.length <= 1) return;
    SoundFX.woodClick();
    const cur = Math.max(0, Math.min(store.ui.charterDeckIdx || 0, remaining.length - 1));
    const next = (cur + delta + remaining.length) % remaining.length;
    store.ui.charterDeckIdx = next;
    st.selectedStatementId = remaining[next].id;
    renderWorkspace();
}

export function stepWbsDeck(delta) {
    const st = store.state;
    if (!st || !st.wbsCards) return;
    const placedIds = Object.values(st.wbsBuckets || {}).flatMap(b => b.filledIds || []);
    const remaining = st.wbsCards.filter(c => !placedIds.includes(c.id));
    if (remaining.length <= 1) return;
    SoundFX.woodClick();
    const cur = Math.max(0, Math.min(store.ui.wbsDeckIdx || 0, remaining.length - 1));
    const next = (cur + delta + remaining.length) % remaining.length;
    store.ui.wbsDeckIdx = next;
    st.selectedWbsCardId = remaining[next].id;
    renderWorkspace();
}

export function setAgileMobileTab(tab) {
    if (!['sprint', 'backlog', 'done'].includes(tab)) return;
    SoundFX.woodClick();
    store.ui.agileMobileTab = tab;
    renderWorkspace();
}

export function toggleCompletedWp(wpId) {
    if (!store.ui.expandedCompletedWps) store.ui.expandedCompletedWps = {};
    store.ui.expandedCompletedWps[wpId] = !store.ui.expandedCompletedWps[wpId];
    SoundFX.woodClick();
    renderWorkspace();
}

export function focusDependencyTask(depTaskId, event) {
    if (event) event.stopPropagation();
    SoundFX.woodClick();
    const cfg = getChapterCfg();
    if (cfg && cfg.mode === 'agile_sprint' && isMobileViewport()) {
        const depTask = (store.state.tasks || []).find(t => t.id === depTaskId);
        if (depTask) {
            store.ui.agileMobileTab = depTask.done ? 'done' : depTask.inSprint ? 'sprint' : 'backlog';
            renderWorkspace();
        }
    }
    highlightDependencyTask(depTaskId);
}

// ---- Chapter Switching & Resets ----
export function switchLevel(lvl) {
    if (store.state && store.state.isExecuting) return;
    const prevState = store.state;
    SoundFX.woodClick();
    clearActiveRun();
    store.ui.contextExpanded = false;
    store.ui.guidanceExpanded = false;
    store.ui.charterDeckIdx = 0;
    store.ui.wbsDeckIdx = 0;
    store.ui.riskDeckIdx = 0;
    store.ui.agileMobileTab = 'backlog';
    store.ui.expandedCompletedWps = {};
    store.ui.mobileSiteExpanded = false;
    store.ui.mobileExecPeek = false;
    store.ui.mobileArtisanSheetId = null;
    store.ui.activeEvent = null;
    store.ui.highlightedTaskId = null;
    syncMobileShellClasses();

    const targetLvl = Number(lvl);
    const chapter = getChapter(targetLvl);
    store.currentLevel = chapter.id;
    store.state = chapter.createState(prevState);
    store.levelBaselineSig = stateSignature(store.state);

    updateGuidance(chapter.startGuidance);
    renderAll();
}

export function requestLevelSwitch(lvl) {
    if (store.state && store.state.isExecuting) return;
    const targetLvl = Number(lvl);
    if (!hasUnsavedProgress()) {
        switchLevel(targetLvl);
        return;
    }
    const same = targetLvl === store.currentLevel;
    showConfirm({
        emoji: same ? '🔄' : '🧭',
        title: same ? `Restart Level ${targetLvl}?` : `Leave Level ${store.currentLevel}?`,
        body: same
            ? 'Your progress in this level will be lost and it will start again from the beginning. Stars you have already earned are kept.'
            : `Your progress in Level ${store.currentLevel} will be lost. Stars you have already earned are kept.`,
        cancelLabel: 'Keep Playing',
        okLabel: same ? `Restart Level ${targetLvl}` : `Switch to Level ${targetLvl}`,
        onOk: () => switchLevel(targetLvl)
    });
}

export function requestRestartCurrentLevel() {
    requestLevelSwitch(store.currentLevel);
}

export function selectCareerChapter(lvl) {
    closeCareerMap();
    const targetLvl = Number(lvl);
    if (targetLvl === Number(store.currentLevel)) return;
    const saved = loadActiveRun();
    if (saved && saved.level === targetLvl && !hasUnsavedProgress()) {
        resumeSavedRun(saved);
        return;
    }
    requestLevelSwitch(targetLvl);
}

export function confirmResetProgress() {
    showConfirm({
        emoji: '🗑️',
        title: 'Reset saved progress?',
        body: 'This clears all earned stars and completed chapters saved in this browser. The level you are playing now is not affected.',
        cancelLabel: 'Keep My Stars',
        okLabel: 'Reset Saved Progress',
        onOk: () => {
            clearSavedProgress();
            renderChapterBar();
            if (store.ui.careerMapOpen) renderCareerMap();
            showToast('Saved progress cleared.', 'success');
        }
    });
}

function resumeSavedRun(savedRun) {
    const ch = getChapter(savedRun.level);
    store.currentLevel = ch.id;
    store.state = savedRun.state;
    store.levelBaselineSig = savedRun.baselineSig || stateSignature(ch.createState());
    store.ui.contextExpanded = false;
    store.ui.mobileSiteExpanded = false;
    store.ui.mobileExecPeek = false;
    store.ui.mobileArtisanSheetId = null;
    store.ui.activeEvent = null;
    syncMobileShellClasses();
    updateGuidance(`📌 <strong>Resumed Ch ${ch.order}: ${ch.title}</strong> (${ch.getHudMetrics(store.state).dayText}). Pick up right where you left off!`);
    renderAll();
    const pendingEv = (ch.events || []).find(ev => ev.check(store.state));
    if (pendingEv) {
        store.ui.activeEvent = pendingEv;
        openEventModal(pendingEv.buildModal(store.state, { uiIcon }));
    }
}

// ---- Chapter 1: Project Charter ----
export function selectStatement(stmtId) {
    const st = store.state;
    if (st.charterAuthorized) return;
    SoundFX.woodClick();
    st.selectedStatementId = (st.selectedStatementId === stmtId) ? null : stmtId;
    st.bouncedStatementId = null;
    renderWorkspace();
}

export function handleCharterBucketClick(bucketKey) {
    const st = store.state;
    if (st.charterAuthorized) return;
    const bucket = st.charterBuckets[bucketKey];
    if (!bucket) return;

    if (bucket.filledIds.length > 0 && !st.selectedStatementId) {
        bucket.filledIds.pop();
        SoundFX.woodClick();
        saveActiveRun();
        renderHUD();
        renderDiorama();
        renderWorkspace();
        renderDock();
        return;
    }

    if (!st.selectedStatementId) {
        SoundFX.alertPop();
        showToast('Tap one of Auntie Mei’s statement cards first.', 'info');
        updateGuidance('Select one of Auntie Mei’s statement cards above first, then tap its matching Project Charter slot.');
        return;
    }

    const stmt = st.statements.find(s => s.id === st.selectedStatementId);
    if (!stmt) return;

    if (stmt.targetBucket !== bucketKey) {
        SoundFX.alertPop();
        st.bouncedStatementId = stmt.id;
        st.bounceCount = (st.bounceCount || 0) + 1;
        const hints = {
            objective: 'Objective describes the core product/deliverable being created.',
            constraints: 'Constraints define fixed Budget (RM) and Schedule limits.',
            success: 'Success Criteria define measurable quality checks for completion.',
            outOfScope: 'Out of Scope states what is explicitly excluded from the project.'
        };
        showToast(`↩️ Bounced back! That doesn't fit ${bucket.label}.`, 'warn');
        updateGuidance(`↩️ <strong>Statement bounced back:</strong> ${hints[bucketKey]}`);
        saveActiveRun();
        renderWorkspace();
        setTimeout(() => {
            st.bouncedStatementId = null;
        }, 400);
        return;
    }

    if (bucket.filledIds.length >= bucket.maxItems) {
        SoundFX.alertPop();
        showToast(`${bucket.label} already has ${bucket.maxItems}/${bucket.maxItems} items.`, 'info');
        return;
    }

    if (!bucket.filledIds.includes(stmt.id)) {
        bucket.filledIds.push(stmt.id);
    }
    st.selectedStatementId = null;
    st.bouncedStatementId = null;
    SoundFX.woodClick();

    const totalStatements = st.statements.length;
    const totalPlaced = Object.values(st.charterBuckets).reduce((sum, b) => sum + b.filledIds.length, 0);
    if (totalPlaced === totalStatements) {
        showToast(`All ${totalStatements} Charter items sorted! Ready to approve.`, 'success');
        updateGuidance(`All ${totalStatements} statements sorted! Tap <strong>Approve Project Charter</strong> below.`);
    } else {
        updateGuidance(`Placed <strong>${stmt.shortLabel}</strong> (${totalPlaced}/${totalStatements} sorted). Keep organizing the Project Charter.`);
    }

    saveActiveRun();
    renderHUD();
    renderDiorama();
    renderWorkspace();
    renderDock();
}

export function authorizeProjectCharter() {
    const st = store.state;
    const totalStatements = st.statements.length;
    const totalPlaced = Object.values(st.charterBuckets).reduce((sum, b) => sum + b.filledIds.length, 0);
    if (totalPlaced < totalStatements) {
        SoundFX.alertPop();
        showToast(`Sort all ${totalStatements} statement cards into the Charter first.`, 'warn');
        updateGuidance(`Sort all ${totalStatements} statement cards into the Project Charter before approving.`);
        return;
    }

    st.charterAuthorized = true;
    store.completedLevels[st.level] = true;
    saveProgress();
    clearActiveRun();
    SoundFX.authorizeSeal();
    showToast('📜 Project Charter Approved! Phase 1 Complete!', 'success');
    updateGuidance('📜 <strong>Project Charter Approved!</strong> Initiating Phase complete — opening Project Retrospective...');
    renderAll();

    setTimeout(() => {
        openRetrospective(true);
    }, 950);
}

// ---- Chapter 2: WBS 100% Rule Builder ----
export function selectWbsCard(cardId) {
    const st = store.state;
    if (st.wbsAuthorized) return;
    SoundFX.woodClick();
    st.selectedWbsCardId = (st.selectedWbsCardId === cardId) ? null : cardId;
    st.bouncedWbsCardId = null;
    renderWorkspace();
}

export function handleWbsBucketClick(bucketKey) {
    const st = store.state;
    if (st.wbsAuthorized) return;
    const bucket = st.wbsBuckets[bucketKey];
    if (!bucket) return;

    if (bucket.filledIds.length > 0 && !st.selectedWbsCardId) {
        bucket.filledIds.pop();
        SoundFX.woodClick();
        saveActiveRun();
        renderHUD();
        renderDiorama();
        renderWorkspace();
        renderDock();
        return;
    }

    if (!st.selectedWbsCardId) {
        SoundFX.alertPop();
        showToast('Tap a deliverable card above first.', 'info');
        updateGuidance('Select a deliverable card above first, then tap its matching <strong>WBS Work Package</strong> slot.');
        return;
    }

    const card = st.wbsCards.find(c => c.id === st.selectedWbsCardId);
    if (!card) return;

    if (card.targetBucket !== bucketKey) {
        SoundFX.alertPop();
        st.bouncedWbsCardId = card.id;
        st.wbsBounceCount = (st.wbsBounceCount || 0) + 1;
        const hints = {
            'l2-wp-1': 'WBS 1.1 covers structural timber framing and the pitched canopy roof.',
            'l2-wp-2': 'WBS 1.2 covers the glass display counter, Kek Lapis, and Teh Tarik dispenser.',
            'l2-wp-3': 'WBS 1.3 covers night-market lanterns and wooden menu signage.',
            'outOfScope': 'Out of Scope is only for items explicitly excluded by the Siniawan Project Charter (such as the Gas-Fired Wok & Exhaust Hood).'
        };
        const extraOutNote = card.targetBucket === 'outOfScope'
            ? ' Gas-Fired Wok &amp; Exhaust Hood is excluded by the Siniawan Charter — place it in <strong>Out of Scope</strong>!'
            : '';
        showToast(`↩️ Bounced back! Doesn't belong in ${bucket.label}.`, 'warn');
        updateGuidance(`↩️ <strong>WBS 100% Rule Check:</strong> ${hints[bucketKey]}${extraOutNote}`);
        saveActiveRun();
        renderWorkspace();
        setTimeout(() => {
            st.bouncedWbsCardId = null;
        }, 400);
        return;
    }

    if (bucket.filledIds.length >= bucket.maxItems) {
        SoundFX.alertPop();
        showToast(`${bucket.label} already has ${bucket.maxItems}/${bucket.maxItems} items.`, 'info');
        return;
    }

    if (!bucket.filledIds.includes(card.id)) {
        bucket.filledIds.push(card.id);
    }
    st.selectedWbsCardId = null;
    st.bouncedWbsCardId = null;
    SoundFX.woodClick();

    const totalCards = st.wbsCards.length;
    const totalPlaced = Object.values(st.wbsBuckets).reduce((sum, b) => sum + b.filledIds.length, 0);
    if (totalPlaced === totalCards) {
        showToast(`All ${totalCards} WBS items mapped! Ready to approve WBS.`, 'success');
        updateGuidance(`All ${totalCards} scope items decomposed into the WBS! Tap <strong>Approve WBS &amp; Start Build</strong> below.`);
    } else {
        updateGuidance(`Decomposed <strong>${card.title}</strong> (${totalPlaced}/${totalCards} mapped). Keep building the WBS Tree.`);
    }

    saveActiveRun();
    renderHUD();
    renderDiorama();
    renderWorkspace();
    renderDock();
}

export function approveWbsBaseline() {
    const st = store.state;
    const totalCards = st.wbsCards.length;
    const totalPlaced = Object.values(st.wbsBuckets).reduce((sum, b) => sum + b.filledIds.length, 0);
    if (totalPlaced < totalCards) {
        SoundFX.alertPop();
        showToast(`Map all ${totalCards} deliverable cards into the WBS first.`, 'warn');
        updateGuidance(`Decompose all ${totalCards} deliverable cards into the WBS Tree before starting execution.`);
        return;
    }

    st.wbsAuthorized = true;
    SoundFX.authorizeSeal();
    showToast('📦 WBS Baseline Approved! Team Unlocked!', 'success');
    updateGuidance('📦 <strong>WBS Approved!</strong> Now assign your team to the decomposed WBS Tasks.');
    renderWorkspace();

    setTimeout(() => {
        st.phase = 'execution';
        saveActiveRun();
        updateGuidance('<strong>Step 2:</strong> Tap <strong>⚡ Assign</strong> on ready WBS Tasks (complete prerequisite tasks first!), then tap <strong>☀️ Start Workday</strong>.');
        renderAll();
    }, 1050);
}

// ---- Chapter 4: Interactive Risk Register Actions ----
export function stepRiskDeck(delta) {
    const st = store.state;
    if (!st || !Array.isArray(st.riskRegister) || st.riskRegister.length <= 1) return;
    SoundFX.woodClick();
    const len = st.riskRegister.length;
    const cur = Math.max(0, Math.min(store.ui.riskDeckIdx || 0, len - 1));
    store.ui.riskDeckIdx = (cur + delta + len) % len;
    renderWorkspace();
}

export function selectRiskStrategy(riskId, strategyId) {
    const st = store.state;
    if (!st || st.isExecuting || st.phase !== 'risk_plan' || st.riskPlanAuthorized) return;
    const risk = (st.riskRegister || []).find(r => r.id === riskId);
    if (!risk) return;
    const nextOpt = (risk.options || []).find(o => o.id === strategyId);
    if (!nextOpt) return;

    const prevOpt = (risk.options || []).find(o => o.id === risk.selectedStrategy);
    const prevCost = prevOpt ? prevOpt.cost : 0;
    const availableWithRefund = (st.contingencyReserve || 0) + prevCost;

    if (nextOpt.cost > availableWithRefund) {
        SoundFX.alertPop();
        showToast(`⚠️ Need RM ${nextOpt.cost.toLocaleString()} Reserve (have RM ${availableWithRefund.toLocaleString()}).`, 'warn');
        updateGuidance(`⚠️ <strong>Insufficient Reserve:</strong> Switch another risk response or pick a lower-cost option (Reserve available: <strong>RM ${availableWithRefund.toLocaleString()}</strong>).`);
        return;
    }

    st.contingencyReserve = availableWithRefund - nextOpt.cost;
    risk.selectedStrategy = nextOpt.id;
    st.riskOptimalCount = (st.riskRegister || []).filter(r => r.selectedStrategy === r.optimalId).length;
    SoundFX.woodClick();

    const idx = st.riskRegister.findIndex(r => r.id === riskId);
    if (idx >= 0) store.ui.riskDeckIdx = idx;

    const plannedCount = st.riskRegister.filter(r => Boolean(r.selectedStrategy)).length;
    if (plannedCount === st.riskRegister.length) {
        showToast(`All ${st.riskRegister.length} risks planned! (RM ${st.contingencyReserve.toLocaleString()} Reserve kept)`, 'success');
        updateGuidance(`All ${st.riskRegister.length} risks planned! Keep spare Reserve for surprises, then tap <strong>Approve Risk Plan &amp; Start Build</strong>.`);
    } else {
        if (isMobileViewport()) {
            const nextUnplanned = st.riskRegister.findIndex(r => !r.selectedStrategy);
            if (nextUnplanned >= 0) store.ui.riskDeckIdx = nextUnplanned;
        }
        updateGuidance(`<strong>${risk.code} ${risk.title}:</strong> Set to <strong>${nextOpt.tag}</strong> (${plannedCount}/${st.riskRegister.length} planned · Reserve <strong>RM ${st.contingencyReserve.toLocaleString()}</strong>).`);
    }

    saveActiveRun();
    renderHUD();
    renderDiorama();
    renderWorkspace();
    renderDock();
}

export function approveRiskRegister() {
    const st = store.state;
    if (!st || st.isExecuting || st.phase !== 'risk_plan') return;
    const risks = st.riskRegister || [];
    const plannedCount = risks.filter(r => Boolean(r.selectedStrategy)).length;
    if (plannedCount < risks.length) {
        SoundFX.alertPop();
        showToast(`Plan all ${risks.length} Risk Register items first (${plannedCount}/${risks.length}).`, 'warn');
        updateGuidance(`Choose a response for all <strong>${risks.length} Risk Register</strong> cards before starting Week 1 build.`);
        return;
    }

    st.riskPlanAuthorized = true;
    SoundFX.authorizeSeal();
    showToast(`🛡️ Risk Plan Approved! (RM ${st.contingencyReserve.toLocaleString()} Reserve ready)`, 'success');
    updateGuidance('🛡️ <strong>Risk Plan Approved!</strong> Starting Week 1 execution along Sungai Semenggoh...');
    renderWorkspace();

    setTimeout(() => {
        st.phase = 'execution';
        saveActiveRun();
        updateGuidance('<strong>Phase 2 — Execution:</strong> Start <strong>Pilings</strong>, <strong>Timber</strong> &amp; <strong>Tea Kitchen</strong> in Week 1!');
        renderAll();
    }, 950);
}

// ---- Agile Sprint Pull & Return ----
export function pullTaskToSprint(taskId, event) {
    if (event) event.stopPropagation();
    const st = store.state;
    const cfg = getChapterCfg();
    const wipLimit = st.wipLimit || (cfg.capabilities && cfg.capabilities.wipLimit);
    if (st.isExecuting || !wipLimit) return;

    const task = st.tasks.find(t => t.id === taskId);
    if (!task || task.inSprint || (task.progress >= 100 && !task.hasDefect)) return;

    const m = getL4Metrics(st);
    if (m.activeSprintCount >= wipLimit) {
        SoundFX.alertPop();
        showToast(`WIP Limit (${wipLimit}) reached! Finish or return an active Sprint item first.`, 'warn');
        updateGuidance(`📦 <strong>WIP Limit (${wipLimit}/${wipLimit}):</strong> Complete an Active Sprint item or tap <strong>↩ Backlog</strong> on an unstarted item before pulling more.`);
        return;
    }

    task.inSprint = true;
    if (isMobileViewport() && (m.activeSprintCount + 1) >= wipLimit) {
        store.ui.agileMobileTab = 'sprint';
    }
    SoundFX.woodClick();
    saveActiveRun();
    showToast(`📥 Pulled "${task.title}" into Sprint ${getL4SprintNumber(st.day)}`, 'success');
    updateGuidance(`Pulled <strong>${task.title}</strong> (+${task.value} Value) into <strong>Active Sprint ${getL4SprintNumber(st.day)}</strong>. Tap <strong>⚡ Assign</strong> when ready!`);
    renderAll();
}

export function pullAndAssignTask(taskId, event) {
    if (event) event.stopPropagation();
    const st = store.state;
    const task = st && st.tasks ? st.tasks.find(t => t.id === taskId) : null;
    if (!task) return;
    if (!task.inSprint) pullTaskToSprint(taskId, event);
    if (!task.inSprint) return;
    if (isMobileViewport()) {
        store.ui.agileMobileTab = 'sprint';
    }
    openTaskAssignPicker(taskId);
}

export function returnTaskToBacklog(taskId, event) {
    if (event) event.stopPropagation();
    const st = store.state;
    const cfg = getChapterCfg();
    if (st.isExecuting || !(cfg.capabilities && cfg.capabilities.wipLimit)) return;

    const task = st.tasks.find(t => t.id === taskId);
    if (!task || !task.inSprint || task.progress > 0 || task.paid || task.hasDefect) return;

    if (task.assignedArtisanId) {
        const art = st.artisans.find(a => a.id === task.assignedArtisanId);
        if (art) art.assignedTaskId = null;
    }
    task.assignedArtisanId = null;
    task.crashed = false;
    task.persisted = false;
    task.inSprint = false;
    st.selectedAssignTaskId = null;

    SoundFX.woodClick();
    saveActiveRun();
    showToast(`↩ Returned "${task.title}" to Product Backlog`, 'info');
    updateGuidance(`Returned <strong>${task.title}</strong> to the Product Backlog — freeing a Sprint WIP slot.`);
    renderAll();
}

// ---- Predictive WBS Decomposition & Task Assignments ----
export function decomposeWorkPackage(wpId) {
    const st = store.state;
    if (st.isExecuting) return;
    const wp = st.workPackages.find(w => w.id === wpId);
    if (!wp || wp.decomposed) return;

    wp.decomposed = true;
    SoundFX.woodClick();
    saveActiveRun();

    if (allWorkPackagesDecomposed(st)) {
        showToast('✅ WBS 100% Rule satisfied! Step 2: Assign Team.', 'success');
        updateGuidance('✅ <strong>Step 2: Assign Team &amp; Run Day!</strong> Tap <strong>Assign</strong> on any ready Task to auto-match the right specialist.');
    } else {
        const remaining = st.workPackages.filter(w => !w.decomposed).length;
        updateGuidance(`Work Package decomposed inline! Tap <strong>Decompose</strong> on the remaining <strong>${remaining} Work Package(s)</strong>.`);
    }
    renderAll();
}

export function openTaskAssignPicker(taskId, event) {
    if (event) event.stopPropagation();
    const st = store.state;
    const cfg = getChapterCfg();
    const caps = cfg.capabilities || {};
    if (st.isExecuting) return;

    const task = st.tasks.find(t => t.id === taskId);
    if (!task || (task.progress >= 100 && !task.hasDefect)) return;

    if (caps.wipLimit && !task.inSprint) {
        SoundFX.alertPop();
        showToast('Pull this item into your Active Sprint first (WIP limit 3).', 'info');
        updateGuidance('Tap <strong>+ Pull</strong> to bring a Backlog item into your <strong>Active Sprint</strong> before assigning.');
        return;
    }

    if (!isTaskUnlocked(task, st)) {
        SoundFX.alertPop();
        const unmetTasks = getUnmetDependencyTasks(task, st);
        const unmet = getUnmetDependencies(task, st).join(' & ');
        if (unmetTasks[0]) {
            const cfg = getChapterCfg();
            if (cfg && cfg.mode === 'agile_sprint' && isMobileViewport()) {
                store.ui.agileMobileTab = unmetTasks[0].done ? 'done' : unmetTasks[0].inSprint ? 'sprint' : 'backlog';
                renderWorkspace();
            }
            highlightDependencyTask(unmetTasks[0].id);
        }
        showToast(`🔒 Dependency locked! Finish ${unmet} first.`, 'warn');
        updateGuidance(`🔒 Dependency Locked! Complete <strong>${unmet}</strong> first (highlighted in amber).`);
        return;
    }

    if (task.assignedArtisanId) {
        const existing = st.artisans.find(a => a.id === task.assignedArtisanId);
        if (existing) existing.assignedTaskId = null;
        task.assignedArtisanId = null;
        task.crashed = false;
        task.persisted = false;
        st.selectedAssignTaskId = null;
        SoundFX.woodClick();
        saveActiveRun();
        updateGuidance(`Unassigned team member from <strong>${task.title}</strong>.`);
        renderAll();
        return;
    }

    const reworkCost = getReworkCost();
    const neededCost = task.hasDefect ? reworkCost : (task.paid ? 0 : task.cost);
    if (st.budget < neededCost) {
        SoundFX.alertPop();
        showToast(`⚠️ Insufficient Budget! Need RM ${neededCost.toLocaleString()}.`, 'warn');
        updateGuidance(`⚠️ Insufficient Budget! Need <strong>RM ${neededCost.toLocaleString()}</strong> to ${task.hasDefect ? 'run QA Rework on' : 'start'} this Task.`);
        return;
    }

    const available = st.artisans.filter(a => !a.assignedTaskId && !a.resting);
    if (available.length === 0) {
        st.selectedAssignTaskId = null;
        SoundFX.alertPop();
        showToast('All team members are currently assigned or resting.', 'info');
        updateGuidance('All team members are assigned or resting. Tap <strong>Start Workday</strong> below to execute!');
        renderAll();
        return;
    }

    SoundFX.woodClick();
    store.ui.mobileArtisanSheetId = null;
    st.selectedAssignTaskId = (st.selectedAssignTaskId === taskId) ? null : taskId;
    if (st.selectedAssignTaskId) {
        if (task.hasDefect) {
            updateGuidance(`Pick an artisan to fix the Quality Defect on <strong>${task.title}</strong> (1 Turn · RM ${reworkCost.toLocaleString()} rework).`);
        } else {
            updateGuidance(`Pick an artisan for <strong>${task.title}</strong> (${task.skill} specialist saves a full ${getTimeUnit(false).toLowerCase()}).`);
        }
    }
    renderAll();
}

export function assignArtisanToTask(taskId, artisanId, event) {
    if (event) event.stopPropagation();
    const st = store.state;
    const cfg = getChapterCfg();
    const caps = cfg.capabilities || {};
    if (st.isExecuting) return;

    const task = st.tasks.find(t => t.id === taskId);
    const artisan = st.artisans.find(a => a.id === artisanId);
    if (!task || !artisan || (task.progress >= 100 && !task.hasDefect) || artisan.resting) return;
    if (caps.wipLimit && !task.inSprint) return;
    if (!isTaskUnlocked(task, st)) return;

    if (artisan.assignedTaskId === task.id) {
        st.selectedAssignTaskId = null;
        renderAll();
        return;
    }
    if (artisan.assignedTaskId) {
        SoundFX.alertPop();
        showToast(`${artisan.name} is already assigned to another Task.`, 'info');
        return;
    }

    const reworkCost = getReworkCost();
    const neededCost = task.hasDefect ? reworkCost : (task.paid ? 0 : task.cost);
    if (st.budget < neededCost) {
        SoundFX.alertPop();
        showToast(`⚠️ Insufficient Budget! Need RM ${neededCost.toLocaleString()}.`, 'warn');
        return;
    }

    if (task.assignedArtisanId) {
        const prevArtisan = st.artisans.find(a => a.id === task.assignedArtisanId);
        if (prevArtisan) prevArtisan.assignedTaskId = null;
    }

    artisan.assignedTaskId = task.id;
    task.assignedArtisanId = artisan.id;
    task.persisted = false;
    st.selectedAssignTaskId = null;

    SoundFX.woodClick();
    if (task.hasDefect) {
        saveActiveRun();
        showToast(`🔧 ${artisan.name} assigned for QA Rework (1 Turn • -RM ${reworkCost.toLocaleString()})`, 'info');
        updateGuidance(`🔧 Assigned <strong>${artisan.name}</strong> to resolve Quality Defect on <strong>${task.title}</strong> (-RM ${reworkCost.toLocaleString()}, 1 Turn).`);
        renderAll();
        return;
    }

    const isMatch = artisan.skill === task.skill;
    const turns = computeRemainingTurns(task, artisan, task.crashed);
    const unit = cfg.time.effort[turns === 1 ? 0 : 1];
    const badgeText = isMatch
        ? `⚡ ${artisan.name} assigned (Specialist • ~${turns} ${unit})`
        : `👷 ${artisan.name} assigned (Off-skill • ~${turns} ${unit})`;
    showToast(badgeText, isMatch ? 'success' : 'info');
    if (artisan.stamina < 35) {
        const qaWarn = caps.qualityDefects ? ' (can also trigger a Quality Defect!)' : '';
        updateGuidance(`⚠️ <strong>${artisan.name}</strong> has low stamina (${artisan.stamina}%) — consider ☕ Rest to avoid -50% Burnout speed${qaWarn}!`);
    } else {
        updateGuidance(`Assigned <strong>${artisan.name}</strong> to <strong>${task.title}</strong> (${isMatch ? 'Specialist' : 'Off-skill'} • ~${turns} ${unit}).`);
    }
    saveActiveRun();
    renderAll();
}

export function swapTaskArtisan(taskId, event) {
    if (event) event.stopPropagation();
    const st = store.state;
    if (st.isExecuting) return;

    const task = st.tasks.find(t => t.id === taskId);
    if (!task || !task.assignedArtisanId) return;

    const otherAvailable = st.artisans.filter(a => !a.assignedTaskId && !a.resting && a.id !== task.assignedArtisanId);
    if (otherAvailable.length === 0) {
        SoundFX.alertPop();
        showToast('No other unassigned team members available to swap.', 'info');
        return;
    }

    SoundFX.woodClick();
    store.ui.mobileArtisanSheetId = null;
    st.selectedAssignTaskId = (st.selectedAssignTaskId === taskId) ? null : taskId;
    if (st.selectedAssignTaskId) {
        updateGuidance(`Pick an available artisan to replace the current assignment on <strong>${task.title}</strong>.`);
    }
    renderAll();
}

export function toggleTaskCrash(taskId, event) {
    if (event) event.stopPropagation();
    const st = store.state;
    const cfg = getChapterCfg();
    const caps = cfg.capabilities || {};
    if (st.isExecuting || !caps.crashing) return;

    const task = st.tasks.find(t => t.id === taskId);
    if (!task || !task.assignedArtisanId || task.hasDefect || task.progress >= 100) return;

    const crashCost = getCrashCost();
    const reworkCost = getReworkCost();
    if (!task.crashed) {
        const reservedForOtherTasks = st.tasks.reduce((sum, t) => {
            if (t.id === task.id || !t.assignedArtisanId || (t.progress >= 100 && !t.hasDefect)) return sum;
            const base = t.hasDefect ? reworkCost : (t.paid ? 0 : t.cost);
            return sum + base + (t.crashed ? crashCost : 0);
        }, 0);
        const neededForThisTask = (task.paid ? 0 : task.cost) + crashCost;
        if (st.budget - reservedForOtherTasks < neededForThisTask) {
            SoundFX.alertPop();
            showToast(`⚠️ Need RM ${crashCost.toLocaleString()} spare operating budget to Crash!`, 'warn');
            updateGuidance(`⚠️ <strong>Insufficient Budget to Crash:</strong> Need <strong>RM ${crashCost.toLocaleString()}</strong> spare operating budget for overtime compression.`);
            return;
        }
        task.crashed = true;
        SoundFX.coffeeClink();
        showToast(`⚡ Schedule Crash ON (+50% Speed, -RM ${crashCost.toLocaleString()})`, 'info');
        const qaWarn = (caps.qualityDefects && !st.qaShieldActive) ? ' — ⚠️ unshielded rushing risks a Quality Defect!' : '';
        updateGuidance(`⚡ <strong>Schedule Crashing Active</strong> on <strong>${task.title}</strong> (+50% Speed for +RM ${crashCost.toLocaleString()} &amp; -${CRASH_EXTRA_STAMINA}% extra stamina)${qaWarn}.`);
    } else {
        task.crashed = false;
        SoundFX.woodClick();
        showToast('Schedule Crash removed.', 'info');
        updateGuidance(`Removed Schedule Crash from <strong>${task.title}</strong>.`);
    }
    saveActiveRun();
    renderAll();
}

export function toggleRestBreak(artisanId, event) {
    if (event) event.stopPropagation();
    const st = store.state;
    if (st.isExecuting) return;
    const artisan = st.artisans.find(a => a.id === artisanId);
    if (!artisan) return;

    SoundFX.coffeeClink();
    if (!artisan.resting && artisan.assignedTaskId) {
        const prevTask = st.tasks.find(t => t.id === artisan.assignedTaskId);
        if (prevTask) {
            prevTask.assignedArtisanId = null;
            prevTask.crashed = false;
            prevTask.persisted = false;
        }
        artisan.assignedTaskId = null;
    }
    st.selectedAssignTaskId = null;
    artisan.resting = !artisan.resting;
    if (artisan.resting) {
        showToast(`☕ ${artisan.name} scheduled for Rest Break (+45% Stamina)`, 'info');
        updateGuidance(`☕ <strong>${artisan.name}</strong> scheduled for a <strong>Rest Break</strong> (+45% Stamina, prevents Burnout).`);
    } else {
        updateGuidance(`<strong>${artisan.name}</strong> is back on active duty.`);
    }
    saveActiveRun();
    renderAll();
}

// ---- Primary CTA & Workday Execution Loop ----
export function handlePrimaryCTA() {
    const cfg = getChapterCfg();
    const st = store.state;
    if (cfg.mode === 'charter') {
        authorizeProjectCharter();
        return;
    }
    if (cfg.mode === 'wbs_predictive' && st.phase === 'wbs_build') {
        approveWbsBaseline();
        return;
    }
    if (cfg.mode === 'risk_predictive' && st.phase === 'risk_plan') {
        approveRiskRegister();
        return;
    }
    startWorkday();
}

function appendExecLog(html) {
    if (typeof document === 'undefined') return;
    const logsEl = document.getElementById('exec-logs');
    if (!logsEl) return;
    const div = document.createElement('div');
    div.className = 'animate-crisp-in leading-snug';
    div.innerHTML = html;
    logsEl.appendChild(div);
}

export function startWorkday() {
    const st = store.state;
    const cfg = getChapterCfg();
    const caps = cfg.capabilities || {};
    if (st.isExecuting) return;

    const turnWord = getWorkTurnLabel().toLowerCase();
    const unitLower = getTimeUnit(false).toLowerCase();

    if (!allWorkPackagesDecomposed(st)) {
        SoundFX.alertPop();
        showToast('📦 Decompose all Work Packages first (Step 1).', 'warn');
        updateGuidance(`📦 <strong>Step 1 Incomplete:</strong> Tap <strong>Decompose</strong> on all Work Packages before starting the ${turnWord}.`);
        return;
    }

    const activeAssignments = st.tasks.filter(t => t.assignedArtisanId && (t.progress < 100 || t.hasDefect));
    const restingArtisans = st.artisans.filter(a => a.resting);
    if (activeAssignments.length === 0 && restingArtisans.length === 0) {
        SoundFX.alertPop();
        if (isMobileViewport()) {
            if (cfg.mode === 'agile_sprint') {
                const activeSprintTasks = st.tasks.filter(t => t.inSprint && (t.progress < 100 || t.hasDefect));
                if (activeSprintTasks.length === 0) {
                    store.ui.agileMobileTab = 'backlog';
                    renderWorkspace();
                    showToast('Pull at least one Backlog item into Sprint first.', 'warn');
                    updateGuidance('Switch to <strong>Backlog</strong> and tap <strong>+ Pull</strong> or <strong>⚡ Pull &amp; Assign</strong>.');
                    return;
                }
                store.ui.agileMobileTab = 'sprint';
                renderWorkspace();
                const firstSprintTask = activeSprintTasks.find(t => !t.assignedArtisanId && (t.hasDefect || isTaskUnlocked(t, st)));
                if (firstSprintTask) highlightDependencyTask(firstSprintTask.id);
            } else {
                const firstTask = st.tasks.find(t => t.progress < 100 && !t.assignedArtisanId && isTaskUnlocked(t, st));
                if (firstTask) highlightDependencyTask(firstTask.id);
            }
        }
        showToast('Assign a Task or schedule a Rest Break first.', 'warn');
        updateGuidance(`Assign a Task or schedule a <strong>☕ Rest Break</strong> before starting the ${turnWord}.`);
        return;
    }

    const crashCost = getCrashCost();
    const reworkCost = getReworkCost();
    st.selectedAssignTaskId = null;
    store.ui.mobileArtisanSheetId = null;
    st.isExecuting = true;
    store.ui.mobileExecPeek = true;
    syncMobileShellClasses();
    renderMobileSheet();
    clearToasts();
    SoundFX.coffeeClink();

    const isMonsoonWindow = Boolean(caps.monsoonWindow && st.hasWeatherRisk && (st.day === 3 || st.day === 4));
    const hasOutdoorAssigned = activeAssignments.some(t => t.outdoor);
    const rainChance = (st.day === 4 && (st.monsoonHitCount || 0) === 0) ? 0.75 : 0.5;
    const rainLostOutdoorDay = Boolean(isMonsoonWindow && hasOutdoorAssigned && !st.tarpBought && Math.random() < rainChance);
    if (rainLostOutdoorDay) st.monsoonHitCount = (st.monsoonHitCount || 0) + 1;

    const logLines = [];
    const completedToday = [];
    const defectToday = [];
    const pausedForFatigue = [];
    const continuingToday = [];

    let readyLeft = st.tasks.filter(t =>
        (!caps.wipLimit || t.inSprint) &&
        t.progress < 100 && !t.assignedArtisanId &&
        (t.deps || []).every(d => { const dt = st.tasks.find(x => x.id === d); return dt && dt.progress >= 100; })
    ).length;

    st.artisans.forEach(artisan => {
        if (artisan.resting) {
            artisan.stamina = Math.min(100, artisan.stamina + 45);
            artisan.resting = false;
            logLines.push(`☕ <strong>${artisan.name}</strong> took a Rest Break (+45% Stamina → ${artisan.stamina}%).`);
            return;
        }

        if (!artisan.assignedTaskId) {
            if (readyLeft > 0) {
                st.idleWithWorkCount = (st.idleWithWorkCount || 0) + 1;
                readyLeft--;
            }
            logLines.push(`🌿 <strong>${artisan.name}</strong> waited on site (use ☕ Rest to recover stamina).`);
            return;
        }

        const task = st.tasks.find(t => t.id === artisan.assignedTaskId);
        if (!task) return;

        if (task.hasDefect) {
            if (st.budget >= reworkCost) st.budget -= reworkCost;
            task.hasDefect = false;
            task.crashed = false;
            task.persisted = false;
            task.assignedArtisanId = null;
            artisan.assignedTaskId = null;
            artisan.stamina = Math.max(0, artisan.stamina - 35);
            st.defectsFixed = (st.defectsFixed || 0) + 1;
            completedToday.push(`QA Fix: ${task.title}`);
            logLines.push(`🔧 <strong>${artisan.name}</strong> resolved the Quality Defect on <strong>${task.title}</strong> (-RM ${reworkCost.toLocaleString()} rework). ✅ <strong>Verified!</strong>`);
            return;
        }

        if (!task.paid) {
            st.budget -= task.cost;
            task.paid = true;
        }

        if (artisan.skill !== task.skill) {
            st.mismatchCount = (st.mismatchCount || 0) + 1;
        }

        const isBurnedOut = artisan.stamina < 35;
        if (isBurnedOut) {
            st.burnoutIncidents = (st.burnoutIncidents || 0) + 1;
        }

        const isCrashed = Boolean(task.crashed && caps.crashing && st.budget >= crashCost);
        if (isCrashed) {
            st.budget -= crashCost;
            st.crashCount = (st.crashCount || 0) + 1;
        }

        let speed = computeTurnSpeed(task, artisan, isCrashed, cfg);
        let note = `🔨 <strong>${artisan.name}</strong> ${task.flavor}.`;
        if (rainLostOutdoorDay && task.outdoor) {
            speed = 0;
            note = `🌧️ <strong>Monsoon Rain!</strong> Outdoor work on <strong>${task.title}</strong> lost 1 full ${unitLower} (no Risk Mitigation tarp).`;
        } else {
            if (isBurnedOut) {
                note += ' <span class="text-[#C85A32] font-bold">(Burnout: -50% speed)</span>';
            }
            if (isCrashed) {
                note += ` <span class="text-[#9E3514] font-bold">(⚡ Crashed: +50% speed, -RM ${crashCost.toLocaleString()})</span>`;
            } else if (isMonsoonWindow && task.outdoor && st.tarpBought) {
                note += ' <span class="text-[#2E6F40] font-bold">(Heavy-duty tarp Risk Mitigation active!)</span>';
            }
        }

        const causedDefect = Boolean(caps.qualityDefects && (isBurnedOut || (isCrashed && !st.qaShieldActive)));
        task.progress = Math.min(100, Math.round(task.progress + speed));
        if (task.progress >= 100) {
            if (causedDefect) {
                task.hasDefect = true;
                st.defectsCreated = (st.defectsCreated || 0) + 1;
                defectToday.push(task.title);
                note += ` <span class="text-[#B91C1C] font-bold">⚠️ Quality Defect! (-RM ${reworkCost.toLocaleString()} QA rework needed; Value paused)</span>`;
            } else {
                note += ' ✅ <strong>Complete!</strong>';
                completedToday.push(task.title);
            }
        } else if (speed > 0) {
            note += ` (${task.progress}%)`;
        }
        logLines.push(note);

        const staminaDrain = 35 + (isCrashed ? CRASH_EXTRA_STAMINA : 0);
        artisan.stamina = Math.max(0, artisan.stamina - staminaDrain);
        task.crashed = false;

        if (task.progress >= 100) {
            artisan.assignedTaskId = null;
            task.assignedArtisanId = null;
            task.persisted = false;
        } else if (artisan.stamina < 35) {
            artisan.assignedTaskId = null;
            task.assignedArtisanId = null;
            task.persisted = false;
            pausedForFatigue.push(`${artisan.name} (${artisan.stamina}%) on ${task.title}`);
        } else {
            task.persisted = true;
            continuingToday.push(`${artisan.name} → ${task.title}`);
        }
    });

    const execSummary = { rainLostOutdoorDay, completedToday, defectToday, pausedForFatigue, continuingToday };
    const overlay = typeof document !== 'undefined' ? document.getElementById('execution-overlay') : null;

    if (store.prefs.fastTurn || !overlay) {
        st.isExecuting = false;
        store.ui.mobileExecPeek = false;
        syncMobileShellClasses();
        SoundFX.taskComplete();
        renderDiorama();
        if (completedToday.length > 0) {
            showToast(`⏩ Completed: ${completedToday.join(', ')}`, 'success');
        }
        finishDay(execSummary);
        return;
    }

    const progressBar = document.getElementById('exec-progress-bar');
    const logsContainer = document.getElementById('exec-logs');
    const execIcon = document.getElementById('exec-icon');
    const execTitle = document.getElementById('exec-title');
    const execSub = document.getElementById('exec-subtitle');

    if (execIcon) execIcon.textContent = cfg.exec.icon;
    if (execTitle) execTitle.textContent = `Executing ${getTimeUnit(false)} ${st.day} ${getWorkTurnLabel()}`;
    if (execSub) execSub.textContent = cfg.exec.subtitle;
    if (logsContainer) logsContainer.innerHTML = '';
    if (progressBar && progressBar.style) progressBar.style.width = '0%';
    overlay.classList.remove('hidden');

    let step = 0;
    const totalSteps = 12;
    let overlayFinished = false;
    let finishTimer = null;

    function completeOverlay(immediate = false) {
        if (overlayFinished) return;
        overlayFinished = true;
        clearInterval(interval);
        if (finishTimer) clearTimeout(finishTimer);
        overlay.onclick = null;
        if (immediate && progressBar && progressBar.style) {
            progressBar.style.width = '100%';
        }
        overlay.classList.add('hidden');
        st.isExecuting = false;
        store.ui.mobileExecPeek = false;
        syncMobileShellClasses();
        finishDay(execSummary);
    }

    overlay.onclick = () => {
        SoundFX.woodClick();
        completeOverlay(true);
    };

    const interval = setInterval(() => {
        step++;
        const pct = Math.min(100, Math.round((step / totalSteps) * 100));
        if (progressBar && progressBar.style) progressBar.style.width = `${pct}%`;

        if (step === 2 && logLines[0]) appendExecLog(logLines[0]);
        if (step === 5 && logLines[1]) appendExecLog(logLines[1]);
        if (step === 9 && logLines[2]) appendExecLog(logLines[2]);

        if (step >= totalSteps) {
            clearInterval(interval);
            SoundFX.taskComplete();
            finishTimer = setTimeout(() => completeOverlay(false), 320);
        }
    }, 60);
    renderDiorama();
}

export function finishDay(execSummary = {}) {
    const st = store.state;
    const cfg = getChapterCfg();
    const {
        rainLostOutdoorDay = false,
        pausedForFatigue = [],
        continuingToday = []
    } = execSummary;

    const endCheck = cfg.checkTurnEnd(st);
    if (endCheck && endCheck.done) {
        if (endCheck.isVictory) {
            store.completedLevels[st.level] = true;
            saveProgress();
        }
        clearActiveRun();
        renderAll();
        openRetrospective(Boolean(endCheck.isVictory));
        return;
    }

    st.day += 1;
    saveActiveRun();
    renderAll();

    const dueEvent = (cfg.events || []).find(ev => ev.check(st));
    if (dueEvent) {
        if (dueEvent.sound === 'brassBalance') SoundFX.brassBalance();
        else SoundFX.alertPop();
        store.ui.activeEvent = dueEvent;
        openEventModal(dueEvent.buildModal(st, { uiIcon }));
        return;
    }

    if (typeof cfg.getPostTurnGuidance === 'function') {
        const msg = cfg.getPostTurnGuidance(st, execSummary);
        if (msg) {
            if (msg.toast) showToast(msg.toast, 'warn');
            if (msg.guidance) updateGuidance(msg.guidance);
            return;
        }
    }

    const unitLabel = getTimeUnit(false);
    const prevUnitWord = cfg.time.previous;
    if (rainLostOutdoorDay) {
        showToast('🌧️ Monsoon rain delayed outdoor tasks!', 'warn');
        updateGuidance(`⚠️ Monsoon rain delayed outdoor work ${prevUnitWord}! Check team stamina for <strong>${unitLabel} ${st.day}</strong>.`);
    } else if (pausedForFatigue.length > 0 || continuingToday.length > 0) {
        const notes = [];
        if (pausedForFatigue.length > 0) {
            notes.push(`⚠️ Paused (&lt;35% stamina): <strong>${pausedForFatigue.join(', ')}</strong> — schedule ☕ Rest or swap!`);
        }
        if (continuingToday.length > 0) {
            notes.push(`↻ Continuing: <strong>${continuingToday.join(', ')}</strong>.`);
        }
        updateGuidance(`<strong>${unitLabel} ${st.day}:</strong> ${notes.join(' ')}`);
    } else {
        updateGuidance(`Start of <strong>${unitLabel} ${st.day}</strong>! Check team stamina and tap <strong>Assign</strong> on ready Tasks.`);
    }
}

export function resolveChapterEvent(choice) {
    const ev = store.ui.activeEvent;
    store.ui.activeEvent = null;
    closeEventModal();
    if (!ev || typeof ev.onResolve !== 'function') return;

    ev.onResolve(store.state, choice, {
        showToast,
        updateGuidance,
        sound: SoundFX,
        renderAll,
        saveActiveRun
    });
    saveActiveRun();
    renderAll();
}

export function advanceToNextLevel(nextLvl) {
    if (typeof document !== 'undefined') {
        const retroModal = document.getElementById('retro-modal');
        if (retroModal) retroModal.classList.add('hidden');
    }
    switchLevel(nextLvl);
    showChapterIntro(nextLvl);
}

export function replayCurrentLevel() {
    if (typeof document !== 'undefined') {
        const retroModal = document.getElementById('retro-modal');
        if (retroModal) retroModal.classList.add('hidden');
    }
    switchLevel(store.currentLevel);
}

export function selectRetro(type, index, btn) {
    SoundFX.woodClick();
    store.state.retroChoice[type] = index;
    if (typeof document === 'undefined') return;
    const selector = type === 'wentWell' ? '.retro-opt-well' : '.retro-opt-improve';
    document.querySelectorAll(selector).forEach(el => {
        el.classList.remove('border-2', 'border-[#2E6F40]', 'border-[#C85A32]', 'bg-[#FFF9E6]');
        el.classList.add('border-[1.5px]', 'border-[#8C6A4A]', 'bg-white');
    });
    if (btn && btn.classList) {
        btn.classList.remove('border-[1.5px]', 'border-[#8C6A4A]', 'bg-white');
        btn.classList.add('border-2', type === 'wentWell' ? 'border-[#2E6F40]' : 'border-[#C85A32]', 'bg-[#FFF9E6]');
    }
}

export function bootApp() {
    loadProgress();
    loadPrefs();
    setMuted(Boolean(store.prefs.muted));
    injectBrandingElements();
    RetinaConfetti.resizeCanvas();

    const savedRun = loadActiveRun();
    if (savedRun) {
        resumeSavedRun(savedRun);
        store.tutorialState.showTutorial = false;
        store.tutorialState.step = 0;
        renderTutorialModal();
        const ch = getChapter(savedRun.level);
        showToast(`📌 Resumed Ch ${ch.order}: ${ch.title}`, 'info');
        return { resumed: true, level: savedRun.level };
    }

    const ch1 = getChapter(1);
    store.currentLevel = ch1.id;
    store.state = ch1.createState();
    store.levelBaselineSig = stateSignature(store.state);
    renderAll();
    store.tutorialState.showTutorial = true;
    store.tutorialState.step = 0;
    renderTutorialModal();
    return { resumed: false, level: ch1.id };
}
