// Layer 3: Compact Header Chapter Selector Pill, Fast-Turn Toggle, Iron Triangle Scale & Context Banner.
import { CHAPTERS, getMaxTotalStars, getTotalEarnedStars } from '../chapters/index.js';
import { uiIcon } from '../core/constants.js';
import { getChapterCfg, store } from '../core/state.js';
import { isMobileViewport } from './feedback.js';

export function renderChapterBar() {
    if (typeof document === 'undefined') return;
    const cfg = getChapterCfg();
    const earnedInChapter = store.levelStars[cfg.id] || 0;
    const totalEarned = getTotalEarnedStars(store.levelStars);
    const maxStars = getMaxTotalStars();

    const emojiEl = document.getElementById('chapter-pill-emoji');
    const labelEl = document.getElementById('chapter-pill-label');
    const starsEl = document.getElementById('chapter-pill-stars');
    const totalStarsEl = document.getElementById('career-total-stars');
    const fastBtn = document.getElementById('btn-fast-turn');

    if (emojiEl) emojiEl.textContent = cfg.emoji;
    if (labelEl) labelEl.textContent = `Ch ${cfg.order}/${CHAPTERS.length} · ${cfg.shortLabel}`;
    if (starsEl) starsEl.textContent = '⭐'.repeat(earnedInChapter) + '☆'.repeat(3 - earnedInChapter);
    if (totalStarsEl) totalStarsEl.textContent = `★ ${totalEarned}/${maxStars}`;

    if (fastBtn) {
        const active = Boolean(store.prefs.fastTurn);
        fastBtn.className = active
            ? 'btn-tactile min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-[36px] px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#C58F2A] text-[#241B15] text-xs font-extrabold border border-[#241B15] flex items-center justify-center gap-1 transition cursor-pointer'
            : 'btn-tactile min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-[36px] px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#3D2412] hover:bg-[#2B180B] text-[#FAF0DC] text-xs font-bold border border-[#9E6E43] flex items-center justify-center gap-1 transition cursor-pointer';
        if (typeof fastBtn.setAttribute === 'function') {
            fastBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
            fastBtn.setAttribute('title', active ? 'Fast Turn ON (instant turn execution)' : 'Enable Fast Turn (skip workday animation)');
        }
    }
}

export function renderHUD() {
    if (typeof document === 'undefined') return;
    const st = store.state;
    const cfg = getChapterCfg();
    const metrics = cfg.getHudMetrics(st);

    const subtitleEl = document.getElementById('header-commission-subtitle');
    if (subtitleEl) subtitleEl.textContent = st.subtitle;

    const daysLeft = Math.max(0, st.maxDays - st.day + 1);
    const budgetEl = document.getElementById('hud-budget');
    const dayEl = document.getElementById('hud-day');
    const scopeEl = document.getElementById('hud-scope');
    if (budgetEl) budgetEl.textContent = `RM ${st.budget.toLocaleString()}`;
    if (dayEl) dayEl.textContent = metrics.dayText;
    if (scopeEl) scopeEl.textContent = metrics.scopeText;

    const budgetPct = Math.max(0, Math.min(100, Math.round((st.budget / Math.max(1, st.initialBudget || 1)) * 100)));
    const dayPct = Math.max(0, Math.min(100, Math.round((daysLeft / Math.max(1, st.maxDays || 1)) * 100)));
    const budgetBar = document.getElementById('hud-budget-bar');
    const dayBar = document.getElementById('hud-day-bar');
    const scopeBar = document.getElementById('hud-scope-bar');
    if (budgetBar) budgetBar.style.width = `${budgetPct}%`;
    if (dayBar) dayBar.style.width = `${dayPct}%`;
    if (scopeBar) scopeBar.style.width = `${Math.max(0, Math.min(100, metrics.scopeProgressPct))}%`;

    const beam = document.getElementById('balance-beam');
    const panLeft = document.getElementById('scale-pan-left');
    const panRight = document.getElementById('scale-pan-right');
    if (beam) beam.style.transform = `rotate(${metrics.tiltDeg}deg)`;
    if (panLeft) panLeft.style.transform = `rotate(${-metrics.tiltDeg}deg)`;
    if (panRight) panRight.style.transform = `rotate(${-metrics.tiltDeg}deg)`;

    const statusEl = document.getElementById('scale-status-text');
    const jewelEl = document.getElementById('scale-jewel');
    if (statusEl) {
        statusEl.textContent = metrics.statusText;
        statusEl.className = metrics.statusCls;
    }
    if (jewelEl && typeof jewelEl.setAttribute === 'function') {
        jewelEl.setAttribute('fill', metrics.jewelColor);
    }
    const mobileDotEl = document.getElementById('mobile-scale-dot');
    if (mobileDotEl) mobileDotEl.style.backgroundColor = metrics.jewelColor;

    const ctxBanner = document.getElementById('context-banner');
    if (!ctxBanner) return;
    if (isMobileViewport() && cfg.mode === 'agile_sprint') {
        ctxBanner.classList.add('hidden');
        ctxBanner.innerHTML = '';
        return;
    }
    const bannerHtml = cfg.renderContextBanner(st, store.ui.contextExpanded, { uiIcon });
    if (bannerHtml) {
        ctxBanner.classList.remove('hidden');
        ctxBanner.innerHTML = bannerHtml;
    } else {
        ctxBanner.classList.add('hidden');
        ctxBanner.innerHTML = '';
    }
}
