// Layer 1: Ordered Chapter Registry (register new chapters here without touching core engine or HUD).
import { chapter1 } from './ch1-charter.js';
import { chapter2 } from './ch2-wbs.js';
import { chapter3 } from './ch3-control.js';
import { chapter4 } from './ch4-risk.js';
import { chapter5 } from './ch5-agile.js';

export const CHAPTERS = [chapter1, chapter2, chapter3, chapter4, chapter5];
export const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map(ch => [ch.id, ch]));

export function getChapter(id) {
    return CHAPTER_BY_ID[Number(id)] || CHAPTERS[0];
}

export function getChapterIds() {
    return CHAPTERS.map(ch => ch.id);
}

export function getNextChapterId(id) {
    const idx = CHAPTERS.findIndex(ch => ch.id === Number(id));
    if (idx >= 0 && idx + 1 < CHAPTERS.length) return CHAPTERS[idx + 1].id;
    return CHAPTERS[0].id;
}

export function getMaxTotalStars() {
    return CHAPTERS.length * 3;
}

export function getTotalEarnedStars(levelStars = {}) {
    return CHAPTERS.reduce((sum, ch) => sum + (Number(levelStars[ch.id]) || 0), 0);
}

export function getCareerRank(earnedStars, maxStars = getMaxTotalStars()) {
    const ratio = maxStars > 0 ? earnedStars / maxStars : 0;
    if (earnedStars <= 0) {
        return { title: 'Apprentice Sarawak PM', icon: '☕', nextHint: 'Earn your first stars in Chapter 1' };
    }
    if (ratio >= 1) {
        return { title: 'Grandmaster Heritage PM', icon: '🏆', nextHint: 'All mastery stars earned across every commission!' };
    }
    if (ratio >= 0.75) {
        return { title: 'Principal Guild PM', icon: '🌟', nextHint: `${maxStars - earnedStars} more star${maxStars - earnedStars === 1 ? '' : 's'} to Grandmaster` };
    }
    if (ratio >= 0.45) {
        return { title: 'Certified Sarawak PM', icon: '🏅', nextHint: `${maxStars - earnedStars} more stars to Principal` };
    }
    return { title: 'Site Coordinator', icon: '📋', nextHint: 'Earn 3-star mastery across chapters to level up' };
}
