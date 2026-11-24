// Layer 3: Lightweight Mobile Touch Gesture Controller (Focused Deck swipe, L4 Tab swipe & Bottom-Sheet flick dismiss).

let gesturesBound = false;

/**
 * Pure directional classifier for touch gestures.
 * @returns {'left'|'right'|'down'|null}
 */
export function classifySwipe(dx, dy, dt) {
    if (dt > 700) return null;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        return dx < 0 ? 'left' : 'right';
    }
    if (dy >= 64 && dy > Math.abs(dx) * 1.4) {
        return 'down';
    }
    return null;
}

export function initMobileGestures({
    isMobile,
    isExecuting,
    getMode,
    getAgileTab,
    onStepCharter,
    onStepWbs,
    onStepRisk,
    onSetAgileTab,
    onCloseSheet
} = {}) {
    if (gesturesBound || typeof document === 'undefined') return;
    gesturesBound = true;

    const board = document.getElementById('board-container');
    if (board) {
        let startTouch = null;

        board.addEventListener('touchstart', (e) => {
            if (!e.touches || e.touches.length !== 1) {
                startTouch = null;
                return;
            }
            const target = e.target;
            if (target && typeof target.closest === 'function' && target.closest('.artisan-dock-grid-scroll')) {
                startTouch = null;
                return;
            }
            const deckEl = target && typeof target.closest === 'function' ? target.closest('[data-swipe-deck]') : null;
            startTouch = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                t: Date.now(),
                target,
                deckType: deckEl ? deckEl.getAttribute('data-swipe-deck') : null
            };
        }, { passive: true });

        board.addEventListener('touchend', (e) => {
            if (!startTouch || !e.changedTouches || e.changedTouches.length === 0) {
                startTouch = null;
                return;
            }
            const touch = e.changedTouches[0];
            const dx = touch.clientX - startTouch.x;
            const dy = touch.clientY - startTouch.y;
            const dt = Date.now() - startTouch.t;
            const { target, deckType } = startTouch;
            startTouch = null;

            if (typeof isMobile === 'function' && !isMobile()) return;
            if (typeof isExecuting === 'function' && isExecuting()) return;

            const dir = classifySwipe(dx, dy, dt);
            if (dir !== 'left' && dir !== 'right') return;

            if (deckType === 'charter' && typeof onStepCharter === 'function') {
                onStepCharter(dir === 'left' ? 1 : -1);
            } else if (deckType === 'wbs' && typeof onStepWbs === 'function') {
                onStepWbs(dir === 'left' ? 1 : -1);
            } else if (deckType === 'risk' && typeof onStepRisk === 'function') {
                onStepRisk(dir === 'left' ? 1 : -1);
            } else if (
                typeof getMode === 'function' &&
                getMode() === 'agile_sprint' &&
                target &&
                typeof target.closest === 'function' &&
                target.closest('#wbs-tree-workspace') &&
                typeof getAgileTab === 'function' &&
                typeof onSetAgileTab === 'function'
            ) {
                const tabs = ['sprint', 'backlog', 'done'];
                const idx = tabs.indexOf(getAgileTab());
                if (idx === -1) return;
                const nextIdx = dir === 'left' ? Math.min(tabs.length - 1, idx + 1) : Math.max(0, idx - 1);
                if (nextIdx !== idx) onSetAgileTab(tabs[nextIdx]);
            }
        }, { passive: true });

        board.addEventListener('touchcancel', () => {
            startTouch = null;
        }, { passive: true });
    }

    const sheetCard = document.getElementById('mobile-sheet-card');
    if (sheetCard) {
        const sheetContent = document.getElementById('mobile-sheet-content');
        let sheetTouch = null;

        sheetCard.addEventListener('touchstart', (e) => {
            if (!e.touches || e.touches.length !== 1) {
                sheetTouch = null;
                return;
            }
            if (sheetContent && sheetContent.scrollTop > 0) {
                sheetTouch = null;
                return;
            }
            sheetTouch = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                t: Date.now()
            };
        }, { passive: true });

        sheetCard.addEventListener('touchmove', (e) => {
            if (!sheetTouch || !e.touches || e.touches.length !== 1) return;
            const dx = e.touches[0].clientX - sheetTouch.x;
            const dy = e.touches[0].clientY - sheetTouch.y;
            if (dy > 8 && dy > Math.abs(dx) * 1.2) {
                sheetCard.style.transition = 'none';
                sheetCard.style.transform = `translateY(${Math.min(dy, 180)}px)`;
            }
        }, { passive: true });

        const finishSheetTouch = (e) => {
            if (!sheetTouch) return;
            const touch = e.changedTouches && e.changedTouches[0];
            const dx = touch ? touch.clientX - sheetTouch.x : 0;
            const dy = touch ? touch.clientY - sheetTouch.y : 0;
            const dt = Date.now() - sheetTouch.t;
            sheetTouch = null;
            sheetCard.style.transition = '';
            sheetCard.style.transform = '';

            if (touch && (dy >= 72 || classifySwipe(dx, dy, dt) === 'down')) {
                if (typeof onCloseSheet === 'function') onCloseSheet();
            }
        };

        sheetCard.addEventListener('touchend', finishSheetTouch, { passive: true });
        sheetCard.addEventListener('touchcancel', () => {
            sheetTouch = null;
            sheetCard.style.transition = '';
            sheetCard.style.transform = '';
        }, { passive: true });
    }
}
