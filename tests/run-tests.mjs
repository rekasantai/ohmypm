// Unified Node ESM Test Suite: Chapter Contract Validation + E2E Gameplay & UX Feature Verification
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ---- Lightweight Headless DOM & Storage Environment (installed before loading app modules) ----
class MockClassList {
    constructor(el) {
        this.el = el;
        this.set = new Set();
    }
    syncFromString(str) {
        this.set = new Set(String(str || '').split(/\s+/).filter(Boolean));
    }
    add(...cls) { cls.forEach(c => this.set.add(c)); }
    remove(...cls) { cls.forEach(c => this.set.delete(c)); }
    toggle(c, force) {
        if (force === undefined) {
            if (this.set.has(c)) { this.set.delete(c); return false; }
            this.set.add(c); return true;
        }
        if (force) { this.set.add(c); return true; }
        this.set.delete(c); return false;
    }
    contains(c) { return this.set.has(c); }
    toString() { return Array.from(this.set).join(' '); }
}

class MockElement {
    constructor(id = '') {
        this.id = id;
        this.style = { setProperty() {} };
        this.classList = new MockClassList(this);
        this.children = [];
        this.attrs = {};
        this._innerHTML = '';
        this.textContent = '';
        this.scrollTop = 0;
        this.scrolledIntoView = false;
        this.onclick = null;
    }
    set className(val) {
        this._className = String(val || '');
        this.classList.syncFromString(this._className);
    }
    get className() {
        return this.classList.toString() || this._className || '';
    }
    set innerHTML(val) {
        this._innerHTML = String(val || '');
    }
    get innerHTML() {
        return this._innerHTML;
    }
    appendChild(child) {
        this.children.push(child);
        return child;
    }
    remove() {}
    setAttribute(k, v) { this.attrs[k] = String(v); }
    getAttribute(k) { return this.attrs[k]; }
    focus() {}
    scrollIntoView() { this.scrolledIntoView = true; }
    querySelectorAll() { return []; }
}

const domMap = new Map();
function getMockEl(id) {
    if (!domMap.has(id)) domMap.set(id, new MockElement(id));
    return domMap.get(id);
}

const mockStorageData = new Map();
const mockLocalStorage = {
    getItem(k) { return mockStorageData.has(k) ? mockStorageData.get(k) : null; },
    setItem(k, v) { mockStorageData.set(k, String(v)); },
    removeItem(k) { mockStorageData.delete(k); },
    clear() { mockStorageData.clear(); }
};

globalThis.window = {
    innerWidth: 1280,
    innerHeight: 800,
    devicePixelRatio: 1,
    localStorage: mockLocalStorage,
    addEventListener() {}
};
globalThis.document = {
    readyState: 'complete',
    activeElement: null,
    getElementById: (id) => getMockEl(id),
    createElement: () => new MockElement(),
    querySelectorAll: () => [],
    addEventListener() {}
};

// Pre-hide modals cleanly in mock DOM
['confirm-modal', 'career-map-modal', 'event-modal', 'retro-modal', 'chapter-intro-modal', 'mobile-action-sheet', 'execution-overlay']
    .forEach(id => getMockEl(id).classList.add('hidden'));

// ---- Dynamic App Module Imports (after mock globals are set) ----
const {
    CHAPTERS,
    getCareerRank,
    getChapter,
    getMaxTotalStars,
    getTotalEarnedStars
} = await import('../js/chapters/index.js');
const { getL4Metrics } = await import('../js/chapters/ch4-agile.js');
const {
    ACTIVE_RUN_KEY,
    CRASH_COST,
    L4_REWORK_COST,
    PREFS_KEY,
    SAVE_KEY,
    renderCharterReferenceBox,
    uiIcon
} = await import('../js/core/constants.js');
const {
    computeRemainingTurns,
    computeTurnPreview,
    computeTurnSpeed,
    getUnmetDependencyTasks,
    loadProgress,
    store
} = await import('../js/core/state.js');
const { ARTWORK_HELPERS } = await import('../js/ui/artwork.js');
const { buildCareerMapMarkup, openRetrospective } = await import('../js/ui/modals.js');
const { renderDock } = await import('../js/ui/dock.js');
const {
    advanceToNextLevel,
    assignArtisanToTask,
    authorizeProjectCharter,
    bootApp,
    decomposeWorkPackage,
    finishDay,
    handleCharterBucketClick,
    handleWbsBucketClick,
    openTaskAssignPicker,
    pullTaskToSprint,
    resolveChapterEvent,
    returnTaskToBacklog,
    selectCareerChapter,
    selectStatement,
    selectWbsCard,
    setAgileMobileTab,
    startWorkday,
    stepCharterDeck,
    stepWbsDeck,
    switchLevel,
    toggleFastTurn,
    toggleGuidanceExpand,
    toggleRestBreak,
    toggleTaskCrash
} = await import('../js/core/engine.js');

const results = [];
function runTest(name, fn) {
    try {
        fn();
        results.push({ name, passed: true });
        console.log(`✅ PASS: ${name}`);
    } catch (err) {
        results.push({ name, passed: false, error: err });
        console.error(`❌ FAIL: ${name}\n   ${err.stack || err.message}`);
    }
}

// =========================================================================
// 1. STATIC & CHAPTER CONTRACT VALIDATION (Scales across any N chapters)
// =========================================================================
runTest('1. Chapter Registry & Contract Validation across all registered chapters', () => {
    assert.ok(Array.isArray(CHAPTERS) && CHAPTERS.length >= 4, 'Expected at least 4 chapters');
    const seenIds = new Set();

    CHAPTERS.forEach((ch, idx) => {
        assert.ok(Number.isInteger(ch.id) && !seenIds.has(ch.id), `Unique integer id required for ${ch.title}`);
        seenIds.add(ch.id);
        assert.equal(ch.order, idx + 1, `Order mismatch for chapter ${ch.id}`);
        assert.ok(ch.shortLabel && ch.title && ch.domain && ch.mode);

        // Backdrop asset verification (relative path & < 300 KB)
        assert.ok(!ch.backdrop.startsWith('/'), `Relative backdrop path required for Ch ${ch.id}`);
        const assetPath = path.join(ROOT, ch.backdrop);
        assert.ok(fs.existsSync(assetPath), `Missing backdrop asset: ${ch.backdrop}`);
        const sizeBytes = fs.statSync(assetPath).size;
        assert.ok(sizeBytes <= 310000, `Backdrop ${ch.backdrop} too large (${sizeBytes} bytes)`);

        // Contract functions
        ['createState', 'isFinished', 'checkTurnEnd', 'getHudMetrics', 'renderContextBanner',
         'getDioramaTimeOfDay', 'buildDioramaSVG', 'evaluateMastery', 'getRetroScorecard', 'buildFailureHints']
            .forEach(fnName => assert.equal(typeof ch[fnName], 'function', `Ch ${ch.id} missing ${fnName}()`));

        // DAG & skill validation on initial state
        const st = ch.createState();
        assert.equal(st.level, ch.id);
        const taskIds = new Set(st.tasks.map(t => t.id));
        const skills = new Set(st.artisans.map(a => a.skill));

        st.tasks.forEach(t => {
            assert.ok(skills.has(t.skill), `Task ${t.id} skill "${t.skill}" has no matching artisan in Ch ${ch.id}`);
            (t.deps || []).forEach(depId => {
                assert.ok(taskIds.has(depId), `Missing dependency "${depId}" on task "${t.id}" in Ch ${ch.id}`);
            });
        });

        // DFS Cycle check
        const visiting = new Set();
        const visited = new Set();
        const hasCycle = (id) => {
            if (visiting.has(id)) return true;
            if (visited.has(id)) return false;
            visiting.add(id);
            const task = st.tasks.find(x => x.id === id);
            for (const dep of (task?.deps || [])) {
                if (hasCycle(dep)) return true;
            }
            visiting.delete(id);
            visited.add(id);
            return false;
        };
        st.tasks.forEach(t => assert.equal(hasCycle(t.id), false, `Cycle detected in Ch ${ch.id} task ${t.id}`));

        // Diorama SVG integrity
        const dio = ch.buildDioramaSVG(st, ARTWORK_HELPERS);
        assert.ok(dio && typeof dio.backdrop === 'string' && typeof dio.layers === 'string');
        assert.ok(!dio.layers.includes('undefined') && !dio.layers.includes('NaN'), `Invalid SVG text in Ch ${ch.id}`);

        // HUD metrics & intro metadata
        const hud = ch.getHudMetrics(st);
        assert.ok(typeof hud.dayText === 'string' && typeof hud.scopeText === 'string');
        assert.ok(ch.intro && Array.isArray(ch.intro.story) && ch.intro.story.length > 0);
    });

    // Portrait assets present on disk
    ['lim', 'salmah', 'danny', 'auntie-mei', 'committee', 'director'].forEach(pid => {
        assert.ok(fs.existsSync(path.join(ROOT, `assets/portrait-${pid}.jpg`)), `Missing portrait-${pid}.jpg`);
    });
});

runTest('2. GitHub Pages relative paths & window onclick handler bindings intact', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const mainJs = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
    assert.ok(html.includes('./css/styles.css'));
    assert.ok(html.includes('./js/main.js'));
    assert.ok(!html.includes('href="/assets') && !html.includes('src="/js'), 'Must use relative paths for GitHub Pages');

    // Collect every onclick handler in index.html + js/
    const onclickNames = new Set();
    const scanFiles = [path.join(ROOT, 'index.html')];
    const collectJs = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) collectJs(full);
            else if (entry.name.endsWith('.js')) scanFiles.push(full);
        }
    };
    collectJs(path.join(ROOT, 'js'));
    scanFiles.forEach(file => {
        const text = fs.readFileSync(file, 'utf8');
        for (const m of text.matchAll(/onclick="([a-zA-Z0-9_]+)\(/g)) {
            onclickNames.add(m[1]);
        }
    });
    onclickNames.forEach(fnName => {
        assert.ok(mainJs.includes(fnName), `Handler "${fnName}" used in onclick="..." must be exported on window in js/main.js`);
    });
});

// =========================================================================
// 2. GAMEPLAY & PERSISTENCE REGRESSIONS (L1 - L4)
// =========================================================================
runTest('3. Legacy localStorage progress migration (3-level and 4-level)', () => {
    mockLocalStorage.clear();
    mockLocalStorage.setItem(SAVE_KEY, JSON.stringify({
        v: 1,
        completedLevels: { 1: true, 2: true, 3: true },
        levelStars: { 1: 3, 2: 2, 3: 3 }
    }));
    loadProgress();
    assert.equal(store.completedLevels[1], true);
    assert.equal(store.completedLevels[3], true);
    assert.equal(store.completedLevels[4], false);
    assert.equal(store.levelStars[4], 0);
    assert.equal(getTotalEarnedStars(store.levelStars), 8);

    // Corrupted JSON resilience
    mockLocalStorage.setItem(SAVE_KEY, '{bad-json');
    loadProgress();
    assert.equal(getTotalEarnedStars(store.levelStars), 0);
});

runTest('4. Chapter 1 Project Charter 3-star completion', () => {
    mockLocalStorage.clear();
    bootApp();
    assert.equal(store.currentLevel, 1);

    store.state.statements.forEach(s => {
        selectStatement(s.id);
        handleCharterBucketClick(s.targetBucket);
    });
    authorizeProjectCharter();
    assert.equal(store.state.charterAuthorized, true);
    assert.equal(store.completedLevels[1], true);

    const mastery = getChapter(1).evaluateMastery(store.state, true, 3, 500);
    assert.equal(mastery.stars, 3);
    assert.equal(mockLocalStorage.getItem(ACTIVE_RUN_KEY), null);
});

runTest('5. Chapter 2 Siniawan WBS 100% Rule, 6-day 3-star optimal run & failure coaching', () => {
    mockLocalStorage.clear();
    switchLevel(2);
    assert.equal(store.state.phase, 'wbs_build');

    // Intentional bounce then clean mapping
    const frameCard = store.state.wbsCards.find(c => c.id === 'wbs-c1');
    selectWbsCard(frameCard.id);
    handleWbsBucketClick('outOfScope');
    assert.equal(store.state.wbsBounceCount, 1);

    // Reset clean for 3-star run
    switchLevel(2);
    store.state.wbsCards.forEach(c => {
        selectWbsCard(c.id);
        handleWbsBucketClick(c.targetBucket);
    });
    store.state.phase = 'execution';

    // Enable fast turn for synchronous execution test
    store.prefs.fastTurn = true;
    assignArtisanToTask('l2-t1', 'lim');
    assignArtisanToTask('l2-t3', 'danny');
    assignArtisanToTask('l2-t6', 'salmah');
    startWorkday(); // Day 1 -> Day 2

    startWorkday(); // Day 2 -> Day 3 (Client Request event fires!)
    assert.equal(store.state.day, 3);
    assert.ok(store.ui.activeEvent && store.ui.activeEvent.id === 'l2_client_request');
    resolveChapterEvent('accept'); // Accept in-scope (-RM 150, +1 Goodwill)

    // Assign remaining unlocked tasks across Days 3-5 without burnout
    toggleRestBreak('lim');
    toggleRestBreak('danny');
    assignArtisanToTask('l2-t4', 'salmah');
    startWorkday(); // Day 3 -> Day 4 (Roof Kit modal triggers because l2-t2 < 100)

    assert.ok(store.ui.activeEvent && store.ui.activeEvent.id === 'l2_roof_kit');
    resolveChapterEvent('decline'); // Save RM 150!

    assignArtisanToTask('l2-t2', 'lim');
    assignArtisanToTask('l2-t5', 'danny');
    startWorkday(); // Day 4 -> Day 5 (t2 50%, t5 100%)
    startWorkday(); // Day 5 complete (t2 100%)

    const m = getChapter(2).evaluateMastery(store.state, true, 1, store.state.budget);
    assert.equal(m.stars, 3, 'Expected 3 stars on optimal L2 run');

    // Failure coaching hints check
    switchLevel(2);
    store.state.phase = 'execution';
    store.state.burnoutIncidents = 1;
    const ch2Hints = getChapter(2).buildFailureHints(store.state);
    assert.ok(ch2Hints.hints.length >= 2);
});

runTest('6. Chapter 3 Critical Path, Dependency Jump, Monsoon Mitigation & NEW L3 Failure Hints', () => {
    mockLocalStorage.clear();
    switchLevel(3);
    store.prefs.fastTurn = true;

    // Attempting to assign locked task t2 highlights prerequisite t1!
    openTaskAssignPicker('t2');
    assert.equal(store.ui.highlightedTaskId, 't1', 'Locked task click should highlight prerequisite task t1');
    const deps = getUnmetDependencyTasks(store.state.tasks.find(t => t.id === 't2'), store.state);
    assert.equal(deps[0].id, 't1');

    // Decompose all WPs
    decomposeWorkPackage('wp-structural');
    decomposeWorkPackage('wp-interior');

    // Week 1: t1 (Lim), t3 (Salmah), t5 (Danny)
    assignArtisanToTask('t1', 'lim');
    assignArtisanToTask('t3', 'salmah');
    assignArtisanToTask('t5', 'danny');
    startWorkday(); // Week 1 -> Week 2 (Scope Creep event)

    assert.equal(store.ui.activeEvent.id, 'l3_scope_creep');
    resolveChapterEvent('backlog'); // Proper Phase 2 Backlog deferral

    // Week 2: Lim continues t1; Salmah does t4; Danny rests
    assignArtisanToTask('t4', 'salmah');
    toggleRestBreak('danny');
    startWorkday(); // Week 2 -> Week 3 (Monsoon Risk event)

    assert.equal(store.ui.activeEvent.id, 'l3_weather_risk');
    resolveChapterEvent('mitigate'); // Deploy tarps (-RM 1,200 reserve)

    // Week 3: Lim rests; t2 & t6 remaining
    toggleRestBreak('lim');
    startWorkday(); // Week 3 -> Week 4

    // Week 4: t2 (Lim)
    assignArtisanToTask('t2', 'lim');
    startWorkday(); // Week 4 -> Week 5

    // Week 5: t6 (Lim)
    assignArtisanToTask('t6', 'lim');
    startWorkday(); // All 6 tasks done with 1 week remaining!

    assert.equal(getChapter(3).isFinished(store.state), true);
    const daysRemaining = store.state.maxDays - store.state.day;
    const totalSaved = store.state.budget + store.state.contingencyReserve;
    const m3 = getChapter(3).evaluateMastery(store.state, true, daysRemaining, totalSaved);
    assert.equal(m3.stars, 3, 'Expected 3 stars on optimal L3 run');

    // NEW L3 failure coaching hints check
    switchLevel(3);
    store.state.acceptedScopeCreep = true;
    store.state.monsoonHitCount = 1;
    store.state.burnoutIncidents = 2;
    const l3Hints = getChapter(3).buildFailureHints(store.state);
    assert.ok(l3Hints && l3Hints.hints.length === 3);
    assert.ok(l3Hints.hints.some(h => /Scope Creep/i.test(h.title)));
    assert.ok(l3Hints.hints.some(h => /Monsoon/i.test(h.title)));
    assert.ok(l3Hints.hints.some(h => /Critical Path/i.test(h.title)));
});

runTest('7. Chapter 4 Hybrid Agile WIP Limit, Quality Defect Rework & Optimal 3-Star Launch', () => {
    mockLocalStorage.clear();
    switchLevel(4);
    store.prefs.fastTurn = true;

    // WIP Limit = 3 check + return to backlog
    pullTaskToSprint('l4-t1');
    pullTaskToSprint('l4-t5');
    pullTaskToSprint('l4-t6');
    pullTaskToSprint('l4-t7'); // Blocked by WIP 3!
    assert.equal(getL4Metrics(store.state).activeSprintCount, 3);
    returnTaskToBacklog('l4-t5');
    assert.equal(getL4Metrics(store.state).activeSprintCount, 2);
    pullTaskToSprint('l4-t5');

    // Run optimal 3-star Sprint path (105 Val, >= RM 5,000, 0 Defects, 0 Burnout)
    assignArtisanToTask('l4-t1', 'lim');
    assignArtisanToTask('l4-t5', 'danny');
    assignArtisanToTask('l4-t6', 'salmah');
    startWorkday(); // Turn 1 -> 2

    // Turn 2: l4-t1 continues automatically (50%->100%)
    startWorkday(); // Turn 2 -> 3 (Sprint 1 Review)

    assert.equal(store.ui.activeEvent.id, 'l4_sprint1_review');
    resolveChapterEvent('backlog'); // Add +20 Val Storytelling Deck

    // Turn 3 (Sprint 2 starts): pull l4-t2, l4-t3, l4-t10; rest exhausted crew first
    pullTaskToSprint('l4-t2');
    pullTaskToSprint('l4-t3');
    pullTaskToSprint('l4-t10');
    toggleRestBreak('lim');
    toggleRestBreak('danny');
    assignArtisanToTask('l4-t10', 'salmah'); // stamina 65% -> 30%
    startWorkday(); // Turn 3 -> 4

    // Turn 4: Rest Salmah; run l4-t2 (Danny) & l4-t3 first turn? Wait: Salmah resting -> assign Lim to l4-t4? Or wait until Turn 5
    toggleRestBreak('salmah');
    assignArtisanToTask('l4-t2', 'danny');
    startWorkday(); // Turn 4 -> 5 (Sprint 2 Readiness Check)

    assert.equal(store.ui.activeEvent.id, 'l4_sprint2_review');
    resolveChapterEvent('qa_inspect'); // Activate QA Shield (-RM 2,000)

    // Turn 5: assign l4-t3 to Salmah & crash! (shielded -> 0 defects, 1 turn!)
    assignArtisanToTask('l4-t3', 'salmah');
    toggleTaskCrash('l4-t3');
    startWorkday(); // Turn 5 -> Turn 6? Check metrics: l4-t1(25)+l4-t5(15)+l4-t6(15)+l4-t10(20)+l4-t2(15)+l4-t3(20) = 110 Val!

    const m4 = getL4Metrics(store.state);
    assert.equal(m4.canLaunch, true);
    assert.ok(m4.verifiedValue >= 100);
    assert.equal(store.state.defectsCreated, 0);
    const mastery4 = getChapter(4).evaluateMastery(store.state, true, 0, store.state.budget);
    assert.equal(mastery4.stars, 3, 'Expected 3 stars on optimal L4 run');

    // Defect creation + QA Rework verification
    switchLevel(4);
    store.prefs.fastTurn = true;
    pullTaskToSprint('l4-t5'); // Effort 1, cost 5000
    assignArtisanToTask('l4-t5', 'danny');
    toggleTaskCrash('l4-t5'); // Unshielded crash -> triggers Quality Defect on completion!
    startWorkday();
    const defTask = store.state.tasks.find(t => t.id === 'l4-t5');
    assert.equal(defTask.hasDefect, true);
    assert.equal(getL4Metrics(store.state).verifiedValue, 0, 'Defect pauses Value');

    // 1-Turn QA Rework clears defect for -RM 1,000
    const beforeReworkBudget = store.state.budget;
    toggleRestBreak('danny');
    startWorkday(); // Rest Danny
    assignArtisanToTask('l4-t5', 'danny');
    startWorkday(); // Fixes defect
    assert.equal(defTask.hasDefect, false);
    assert.equal(store.state.budget, beforeReworkBudget - L4_REWORK_COST);
    assert.equal(getL4Metrics(store.state).verifiedValue, 15);
});

// =========================================================================
// 3. NEW SCALABILITY & PLAYABILITY FEATURES
// =========================================================================
runTest('8. Mid-Chapter Auto-Save & Browser-Reload Resume (and Defeat Cleanup)', () => {
    mockLocalStorage.clear();
    bootApp();
    switchLevel(3);

    decomposeWorkPackage('wp-structural');
    assignArtisanToTask('t1', 'lim');
    const rawSaved = mockLocalStorage.getItem(ACTIVE_RUN_KEY);
    assert.ok(rawSaved, 'Active run should auto-save after task assignment');

    // Simulate page reload via bootApp()
    store.currentLevel = 1;
    store.state = {};
    const bootRes = bootApp();
    assert.equal(bootRes.resumed, true, 'bootApp should resume saved mid-chapter run');
    assert.equal(bootRes.level, 3);
    assert.equal(store.tutorialState.showTutorial, false, 'Tutorial skipped when resuming saved run');
    assert.equal(store.state.tasks.find(t => t.id === 't1').assignedArtisanId, 'lim');

    // Defeat on final day must clear ACTIVE_RUN_KEY so a dead run is not resurrected
    store.state.day = store.state.maxDays;
    finishDay({});
    assert.equal(mockLocalStorage.getItem(ACTIVE_RUN_KEY), null, 'Completed/ended run clears auto-save');
});

runTest('9. Pre-Turn Impact Preview calculations (spend, burnout, defect risk)', () => {
    switchLevel(4);
    pullTaskToSprint('l4-t5'); // cost 5000
    pullTaskToSprint('l4-t6'); // cost 4500
    assignArtisanToTask('l4-t5', 'danny');
    assignArtisanToTask('l4-t6', 'salmah');
    toggleTaskCrash('l4-t5'); // +1500 crash cost, unshielded

    let preview = computeTurnPreview(store.state, getChapter(4));
    assert.equal(preview.hasActions, true);
    assert.equal(preview.plannedSpend, 5000 + 1500 + 4500);
    assert.equal(preview.overBudget, false);
    assert.ok(preview.willCreateDefectCount >= 1, 'Unshielded crash completing this turn flags defect likely');

    // Paid task should show RM 0 base spend + resting detection
    const t6 = store.state.tasks.find(t => t.id === 'l4-t6');
    t6.paid = true;
    store.state.artisans.find(a => a.id === 'lim').stamina = 30;
    pullTaskToSprint('l4-t1');
    assignArtisanToTask('l4-t1', 'lim');
    toggleRestBreak('salmah');
    preview = computeTurnPreview(store.state, getChapter(4));
    assert.ok(preview.burnedOutActive.includes('Lim'));
    assert.ok(preview.restingNames.includes('Salmah'));
});

runTest('10. Fast-Turn Mode persistence, Career Map & Mobile Chip unclipped name markup', () => {
    mockLocalStorage.clear();
    bootApp();
    assert.equal(store.prefs.fastTurn, false);
    toggleFastTurn();
    assert.equal(store.prefs.fastTurn, true);
    const savedPrefs = JSON.parse(mockLocalStorage.getItem(PREFS_KEY));
    assert.equal(savedPrefs.fastTurn, true);

    // Career Map & Passport markup scales dynamically across CHAPTERS
    store.levelStars[1] = 3;
    store.completedLevels[1] = true;
    store.levelStars[2] = 3;
    store.completedLevels[2] = true;
    store.levelStars[3] = 3;
    store.completedLevels[3] = true;
    const career = buildCareerMapMarkup();
    assert.equal(career.earned, 9);
    assert.equal(career.maxStars, getMaxTotalStars());
    assert.equal(career.completedCount, 3);
    assert.equal(getCareerRank(9, 12).title, 'Principal Guild PM');
    assert.ok(career.passportBadgesHtml.includes('Project Charter Architect'));

    // Switching via Career Map modal closes modal and switches chapter
    selectCareerChapter(2);
    assert.equal(store.currentLevel, 2);

    // Verify unclipped mobile artisan chip puts name on its own row without stamina% on same line
    store.state.phase = 'execution';
    renderDock();
    const dockHtml = getMockEl('artisans-dock').innerHTML;
    assert.ok(dockHtml.includes('>Salmah</span>'), 'Mobile chip displays full unclipped Salmah');
});

runTest('11. Mobile Usability: Focused Decks, Agile Tabs, Idle Preview Hide & Collapsible Details', () => {
    // 1. Collapsible Charter Baseline reference helper
    const charterBox = renderCharterReferenceBox('Scope: Kopitiam Hall');
    assert.ok(charterBox.includes('<details'), 'Charter reference box uses collapsible <details>');
    assert.ok(!charterBox.includes('<details open'), 'Charter reference box starts collapsed');
    assert.ok(charterBox.includes('Check Approved Charter Baseline'), 'Charter reference summary label present');

    // 2. Idle #turn-preview-strip hides when no actions are queued, shows once assigned
    switchLevel(3);
    assert.ok(getMockEl('turn-preview-strip').classList.contains('hidden'), 'Idle turn preview strip should be hidden');
    decomposeWorkPackage('wp-structural');
    assignArtisanToTask('t1', 'lim');
    assert.ok(!getMockEl('turn-preview-strip').classList.contains('hidden'), 'Turn preview strip appears after task assignment');

    // 3. Mobile viewport (375px) Focused Decks, Agile segmented tabs, guidance clamp & collapsed Retro reflection
    try {
        globalThis.window.innerWidth = 375;

        // L1 Charter Focused Deck
        switchLevel(1);
        let ws = getMockEl('charter-workspace').innerHTML;
        assert.ok(ws.includes('Card 1/8'), 'Mobile L1 renders Card 1/8 Focused Deck');
        stepCharterDeck(1);
        ws = getMockEl('charter-workspace').innerHTML;
        assert.ok(ws.includes('Card 2/8'), 'stepCharterDeck(1) advances to Card 2/8');
        const activeStmt = store.state.statements.find(s => s.id === store.state.selectedStatementId);
        handleCharterBucketClick(activeStmt.targetBucket);
        ws = getMockEl('charter-workspace').innerHTML;
        assert.match(ws, /Card \d+\/7/, 'Placing one charter card shrinks remaining deck count to 7');

        // L2 WBS Focused Deck
        switchLevel(2);
        ws = getMockEl('charter-workspace').innerHTML;
        assert.ok(ws.includes('Scope Card 1/7'), 'Mobile L2 renders Scope Card 1/7 Focused Deck');
        stepWbsDeck(1);
        ws = getMockEl('charter-workspace').innerHTML;
        assert.ok(ws.includes('Scope Card 2/7'), 'stepWbsDeck(1) advances to Scope Card 2/7');
        const activeWbs = store.state.wbsCards.find(c => c.id === store.state.selectedWbsCardId);
        handleWbsBucketClick(activeWbs.targetBucket);
        ws = getMockEl('charter-workspace').innerHTML;
        assert.match(ws, /Scope Card \d+\/6/, 'Placing one WBS card shrinks remaining deck count to 6');

        // Guidance 1-line expand toggle on mobile
        assert.equal(store.ui.guidanceExpanded, false);
        toggleGuidanceExpand();
        assert.equal(store.ui.guidanceExpanded, true);
        assert.ok(getMockEl('guidance-strip').classList.contains('guidance-expanded'));

        // L4 Agile segmented tabs + hidden duplicate context banner + WIP=3 auto-switch to Sprint
        switchLevel(4);
        assert.ok(getMockEl('context-banner').classList.contains('hidden'), 'L4 context banner stays hidden on mobile');
        ws = getMockEl('wbs-tree-workspace').innerHTML;
        assert.ok(ws.includes('id="agile-mobile-tabs"'), 'Mobile L4 renders segmented tabs');
        assert.equal(store.ui.agileMobileTab, 'backlog');
        setAgileMobileTab('done');
        assert.equal(store.ui.agileMobileTab, 'done');
        setAgileMobileTab('backlog');
        pullTaskToSprint('l4-t1');
        pullTaskToSprint('l4-t5');
        assert.equal(store.ui.agileMobileTab, 'backlog');
        pullTaskToSprint('l4-t6'); // Hits WIP limit 3 -> auto-switches to Sprint tab
        assert.equal(store.ui.agileMobileTab, 'sprint');

        // Retro Reflection starts collapsed on mobile
        openRetrospective({
            won: true, outcomeTag: 'Done', stars: 3, headline: 'Success', subline: 'Nice',
            summaryLines: ['All good'], metrics: [{ label: 'Score', value: '100' }],
            debriefPoints: ['Point 1'], reflectionQuestion: 'Why did agile help?'
        });
        assert.ok(!getMockEl('retro-reflection-section').innerHTML.includes('<details open'), 'Mobile retro reflection starts collapsed');
    } finally {
        globalThis.window.innerWidth = 1280;
    }

    // Desktop Retro Reflection starts open
    openRetrospective({
        won: true, outcomeTag: 'Done', stars: 3, headline: 'Success', subline: 'Nice',
        summaryLines: ['All good'], metrics: [{ label: 'Score', value: '100' }],
        debriefPoints: ['Point 1'], reflectionQuestion: 'Why did agile help?'
    });
    assert.ok(getMockEl('retro-reflection-section').innerHTML.includes('<details open'), 'Desktop retro reflection starts expanded');
});

const failed = results.filter(r => !r.passed);
console.log(`\nSummary: ${results.length - failed.length}/${results.length} test suites passed.`);
if (failed.length > 0) process.exit(1);
