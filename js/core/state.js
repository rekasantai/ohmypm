// Layer 2: Central reactive store, storage persistence (progress, prefs, mid-run auto-save),
// chapter helpers, and pure gameplay math (speeds, dependencies, turn impact preview).
import {
    ACTIVE_RUN_KEY,
    CRASH_COST,
    CRASH_EXTRA_STAMINA,
    CRASH_SPEED_BONUS,
    L4_REWORK_COST,
    OFFSKILL_SPEED,
    PREFS_KEY,
    SAVE_KEY,
    SPECIALIST_SPEED
} from './constants.js';
import { CHAPTER_BY_ID, CHAPTERS, getChapter, getChapterIds } from '../chapters/index.js';

function createInitialMap(defaultValue) {
    const map = {};
    getChapterIds().forEach(id => {
        map[id] = defaultValue;
    });
    return map;
}

function getStorage() {
    if (typeof window === 'undefined') return null;
    try {
        return window.localStorage || null;
    } catch (_err) {
        return null;
    }
}

export const store = {
    currentLevel: CHAPTERS[0].id,
    completedLevels: createInitialMap(false),
    levelStars: createInitialMap(0),
    state: {},
    levelBaselineSig: '',
    prefs: {
        fastTurn: false,
        muted: false
    },
    ui: {
        contextExpanded: false,
        guidanceExpanded: false,
        charterDeckIdx: 0,
        wbsDeckIdx: 0,
        agileMobileTab: 'backlog',
        expandedCompletedWps: {},
        mobileSiteExpanded: false,
        mobileExecPeek: false,
        mobileArtisanSheetId: null,
        careerMapOpen: false,
        activeEvent: null,
        highlightedTaskId: null,
        lastFocusedEl: null,
        confirmOnOk: null
    },
    tutorialState: {
        showTutorial: true,
        step: 0
    }
};

export function shortArtisanName(name = '') {
    if (name.startsWith('Uncle ')) return name.slice(6);
    if (name.startsWith('Kak ')) return name.slice(4);
    return name;
}

// ---- Chapter lookup & terminology helpers ----
export function getChapterCfg(lvl = (store.state && store.state.level) || store.currentLevel) {
    return getChapter(lvl);
}

export function getTimeUnit(plural = false, lvl) {
    const t = getChapterCfg(lvl).time;
    return plural ? t.units : t.unit;
}

export function getWorkTurnLabel(lvl) {
    return getChapterCfg(lvl).time.turn;
}

export function getCrashCost(lvl) {
    const caps = getChapterCfg(lvl).capabilities || {};
    return caps.crashCost || CRASH_COST;
}

export function getReworkCost(lvl) {
    const caps = getChapterCfg(lvl).capabilities || {};
    return caps.reworkCost || L4_REWORK_COST;
}

// ---- Progress, Preferences & Mid-Run Auto-Save Persistence ----
export function loadProgress() {
    store.completedLevels = createInitialMap(false);
    store.levelStars = createInitialMap(0);
    const storage = getStorage();
    if (!storage) return;
    try {
        const raw = storage.getItem(SAVE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (!data || typeof data !== 'object') return;
        getChapterIds().forEach(id => {
            const stars = Number(data.levelStars && data.levelStars[id]);
            if (Number.isInteger(stars) && stars >= 0 && stars <= 3) store.levelStars[id] = stars;
            if (data.completedLevels && data.completedLevels[id] === true) store.completedLevels[id] = true;
        });
    } catch (_err) {
        // Storage unavailable or corrupted: start fresh without breaking the game.
    }
}

export function saveProgress() {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.setItem(SAVE_KEY, JSON.stringify({
            v: 1,
            completedLevels: store.completedLevels,
            levelStars: store.levelStars
        }));
    } catch (_err) {
        // Storage unavailable: silent fallback.
    }
}

export function loadPrefs() {
    store.prefs = { fastTurn: false, muted: false };
    const storage = getStorage();
    if (!storage) return store.prefs;
    try {
        const raw = storage.getItem(PREFS_KEY);
        if (!raw) return store.prefs;
        const data = JSON.parse(raw);
        if (data && typeof data === 'object') {
            store.prefs.fastTurn = Boolean(data.fastTurn);
            store.prefs.muted = Boolean(data.muted);
        }
    } catch (_err) {
        // Ignore corrupted prefs.
    }
    return store.prefs;
}

export function savePrefs() {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.setItem(PREFS_KEY, JSON.stringify({
            fastTurn: Boolean(store.prefs.fastTurn),
            muted: Boolean(store.prefs.muted)
        }));
    } catch (_err) {
        // Ignore storage failure.
    }
}

export function stateSignature(st = store.state) {
    try {
        // Ignore transient UI selections so merely tapping a card doesn't count as progress.
        return JSON.stringify(st, (k, v) => (/^(selected|bounced|isExecuting)/.test(k) ? undefined : v));
    } catch (_err) {
        return 'unreadable:' + Math.random();
    }
}

export function isLevelFinished(st = store.state) {
    if (!st || !st.level) return false;
    return getChapterCfg(st.level).isFinished(st);
}

export function hasUnsavedProgress(st = store.state) {
    if (!st || !st.level) return false;
    return !isLevelFinished(st) && stateSignature(st) !== store.levelBaselineSig;
}

export function saveActiveRun() {
    const storage = getStorage();
    const st = store.state;
    if (!storage || !st || !st.level || st.isExecuting) return false;
    if (isLevelFinished(st) || !hasUnsavedProgress(st)) {
        clearActiveRun();
        return false;
    }
    try {
        const cleanState = JSON.parse(JSON.stringify(st, (k, v) => (/^(selected|bounced)/.test(k) ? undefined : v)));
        cleanState.isExecuting = false;
        cleanState.selectedAssignTaskId = null;
        if ('selectedStatementId' in st) cleanState.selectedStatementId = null;
        if ('bouncedStatementId' in st) cleanState.bouncedStatementId = null;
        if ('selectedWbsCardId' in st) cleanState.selectedWbsCardId = null;
        if ('bouncedWbsCardId' in st) cleanState.bouncedWbsCardId = null;

        storage.setItem(ACTIVE_RUN_KEY, JSON.stringify({
            v: 1,
            level: Number(st.level),
            baselineSig: store.levelBaselineSig,
            savedAt: Date.now(),
            state: cleanState
        }));
        return true;
    } catch (_err) {
        return false;
    }
}

export function loadActiveRun() {
    const storage = getStorage();
    if (!storage) return null;
    try {
        const raw = storage.getItem(ACTIVE_RUN_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || data.v !== 1 || !data.state || typeof data.state !== 'object') return null;
        const lvl = Number(data.level);
        const chapter = CHAPTER_BY_ID[lvl];
        if (!chapter || Number(data.state.level) !== lvl) return null;
        if (chapter.isFinished(data.state)) {
            storage.removeItem(ACTIVE_RUN_KEY);
            return null;
        }
        data.state.isExecuting = false;
        data.state.selectedAssignTaskId = null;
        return {
            level: lvl,
            state: data.state,
            baselineSig: typeof data.baselineSig === 'string' ? data.baselineSig : '',
            savedAt: data.savedAt || Date.now()
        };
    } catch (_err) {
        return null;
    }
}

export function clearActiveRun() {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.removeItem(ACTIVE_RUN_KEY);
    } catch (_err) {
        // Ignore storage error.
    }
}

export function clearSavedProgress() {
    const storage = getStorage();
    if (storage) {
        try {
            storage.removeItem(SAVE_KEY);
            storage.removeItem(ACTIVE_RUN_KEY);
        } catch (_err) {
            // Ignore.
        }
    }
    store.completedLevels = createInitialMap(false);
    store.levelStars = createInitialMap(0);
}

// ---- Pure Task & Turn Computations ----
export function allWorkPackagesDecomposed(st = store.state) {
    if (!st || !Array.isArray(st.workPackages)) return true;
    return st.workPackages.every(wp => wp.decomposed);
}

export function isTaskUnlocked(task, st = store.state) {
    if (!task) return false;
    if (task.workPackageId && Array.isArray(st.workPackages)) {
        const wp = st.workPackages.find(w => w.id === task.workPackageId);
        if (wp && !wp.decomposed) return false;
    }
    if (!task.deps || task.deps.length === 0) return true;
    return task.deps.every(depId => {
        const depTask = st.tasks.find(t => t.id === depId);
        return depTask && depTask.progress >= 100;
    });
}

export function getUnmetDependencyTasks(task, st = store.state) {
    if (!task || !Array.isArray(task.deps) || !Array.isArray(st.tasks)) return [];
    return task.deps
        .map(id => st.tasks.find(t => t.id === id))
        .filter(t => t && t.progress < 100);
}

export function getUnmetDependencies(task, st = store.state) {
    return getUnmetDependencyTasks(task, st).map(t => t.title);
}

export function computeTurnSpeed(task, artisan, crashed = false, chapter = getChapterCfg((store.state && store.state.level) || store.currentLevel)) {
    const effort = (task && task.effort) || 1;
    const rawSpeed = artisan.skill === task.skill ? SPECIALIST_SPEED : OFFSKILL_SPEED;
    let speed = Math.round(rawSpeed / effort);
    if (artisan.stamina < 35) speed = Math.round(speed * 0.5);
    const crashEnabled = Boolean(chapter && chapter.capabilities && chapter.capabilities.crashing);
    if (crashed && crashEnabled) speed += CRASH_SPEED_BONUS;
    return Math.max(1, speed);
}

export function computeRemainingTurns(task, artisan, crashed = false, chapter) {
    if (task && task.hasDefect) return 1;
    const remaining = Math.max(0, 100 - ((task && task.progress) || 0));
    if (remaining <= 0) return 0;
    return Math.ceil(remaining / computeTurnSpeed(task, artisan, crashed, chapter));
}

export function computeTurnPreview(st = store.state, chapter = getChapterCfg(st && st.level)) {
    const empty = {
        hasActions: false,
        assignedCount: 0,
        restingNames: [],
        plannedSpend: 0,
        overBudget: false,
        burnedOutActive: [],
        willTireNames: [],
        defectRiskCount: 0,
        willCreateDefectCount: 0,
        idleArtisanCount: 0,
        readyUnassignedTasksCount: 0,
        idleWithReadyWork: 0
    };
    if (!st || !Array.isArray(st.artisans) || !Array.isArray(st.tasks) || !chapter) return empty;

    const caps = chapter.capabilities || {};
    const crashCost = caps.crashCost || CRASH_COST;
    const reworkCost = caps.reworkCost || L4_REWORK_COST;
    const crashEnabled = Boolean(caps.crashing);
    const qualityDefects = Boolean(caps.qualityDefects);

    let assignedCount = 0;
    const restingNames = [];
    let plannedSpend = 0;
    const burnedOutActive = [];
    const willTireNames = [];
    let defectRiskCount = 0;
    let willCreateDefectCount = 0;

    st.artisans.forEach(a => {
        const sName = shortArtisanName(a.name);
        if (a.resting) {
            restingNames.push(sName);
            return;
        }
        if (!a.assignedTaskId) return;
        const task = st.tasks.find(t => t.id === a.assignedTaskId);
        if (!task || (task.progress >= 100 && !task.hasDefect)) return;

        assignedCount += 1;

        if (task.hasDefect) {
            plannedSpend += reworkCost;
            if (a.stamina < 35) burnedOutActive.push(sName);
            else if (a.stamina - 35 < 35) willTireNames.push(sName);
            return;
        }

        const baseCost = task.paid ? 0 : (task.cost || 0);
        const isCrashed = Boolean(task.crashed && crashEnabled);
        plannedSpend += baseCost + (isCrashed ? crashCost : 0);

        const isBurned = a.stamina < 35;
        const drain = 35 + (isCrashed ? CRASH_EXTRA_STAMINA : 0);
        if (isBurned) burnedOutActive.push(sName);
        else if (a.stamina - drain < 35) willTireNames.push(sName);

        if (qualityDefects && (isBurned || (isCrashed && !st.qaShieldActive))) {
            defectRiskCount += 1;
            const speed = computeTurnSpeed(task, a, isCrashed, chapter);
            if (Math.min(100, Math.round((task.progress || 0) + speed)) >= 100) {
                willCreateDefectCount += 1;
            }
        }
    });

    const idleArtisanCount = st.artisans.filter(a => !a.assignedTaskId && !a.resting).length;
    const readyUnassignedTasksCount = st.tasks.filter(t =>
        (!caps.wipLimit || t.inSprint) &&
        (t.progress < 100 || t.hasDefect) &&
        !t.assignedArtisanId &&
        (t.hasDefect || isTaskUnlocked(t, st))
    ).length;
    const idleWithReadyWork = Math.min(idleArtisanCount, readyUnassignedTasksCount);

    return {
        hasActions: assignedCount > 0 || restingNames.length > 0,
        assignedCount,
        restingNames,
        plannedSpend,
        overBudget: plannedSpend > (st.budget || 0),
        burnedOutActive,
        willTireNames,
        defectRiskCount,
        willCreateDefectCount,
        idleArtisanCount,
        readyUnassignedTasksCount,
        idleWithReadyWork
    };
}
