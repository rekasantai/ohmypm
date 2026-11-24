// Chapter 4: Kuching Waterfront Festival Pavilion (Hybrid Agile Sprints, MoSCoW Value & Quality Control)
import { L4_REWORK_COST } from '../core/constants.js';
import { getArtisanPortraitSVG, renderDioramaLayerWrapper } from '../ui/artwork.js';

const SUBTITLE = 'Level 4 • Waterfront Festival (RM 50,000 • 3 Sprints)';

export function getL4SprintNumber(day = 1) {
    return Math.min(3, Math.ceil(Math.max(1, day) / 2));
}

export function getL4Metrics(st) {
    const tasks = st && Array.isArray(st.tasks) ? st.tasks : [];
    let verifiedValue = 0;
    let mustTotal = 0;
    let mustDone = 0;
    let openDefects = 0;
    let activeSprintCount = 0;

    tasks.forEach(t => {
        const isVerified = t.progress >= 100 && !t.hasDefect;
        if (isVerified) verifiedValue += (t.value || 0);
        if (t.priority === 'must') {
            mustTotal += 1;
            if (isVerified) mustDone += 1;
        }
        if (t.hasDefect) openDefects += 1;
        if (t.inSprint && (t.progress < 100 || t.hasDefect)) activeSprintCount += 1;
    });

    const minLaunchValue = (st && st.minLaunchValue) || 80;
    const canLaunch = mustTotal > 0 && mustDone === mustTotal && verifiedValue >= minLaunchValue && openDefects === 0;
    return { verifiedValue, mustTotal, mustDone, openDefects, activeSprintCount, canLaunch };
}

export const chapter4 = {
    id: 4,
    order: 4,
    shortLabel: 'L4 Agile',
    title: 'Waterfront Festival Pavilion',
    domain: 'Hybrid Agile • Value & Quality',
    emoji: '🌊',
    backdrop: 'assets/bg-l4-waterfront.jpg',
    mode: 'agile_sprint',
    subtitle: SUBTITLE,
    time: { unit: 'Turn', units: 'Turns', effort: ['Turn', 'Turns'], turn: 'Sprint Turn', turnIcon: '🔄', previous: 'last turn' },
    lowBudgetThreshold: 6000,
    capabilities: {
        wbsDecompose: false,
        crashing: true,
        crashCost: 1500,
        wipLimit: 3,
        qualityDefects: true,
        reworkCost: L4_REWORK_COST,
        reserveFund: false,
        monsoonWindow: false
    },
    exec: { icon: '🌊', subtitle: 'Your crew is delivering Sprint work on the Kuching Waterfront...' },
    startGuidance: '<strong>Sprint 1 Planning:</strong> Pull up to <strong>3 high-value items</strong> from the Product Backlog (prioritize <strong>Must-Have</strong> core pavilion work first!), assign your crew, then run the Sprint turn.',
    tutorial: {
        chapterLine: '🌊 <strong>Ch 4 • Waterfront Festival (RM 50,000 • 3 Sprints):</strong> Lead <strong>Hybrid Agile Sprints &amp; Quality</strong>',
        lifecycleLine: '4️⃣ <strong>Level 4 • Hybrid Agile &amp; Quality:</strong> Prioritize MoSCoW Value under a fixed launch date, prevent Defects &amp; adapt in Sprint Reviews.'
    },
    brief: {
        tag: 'Chapter 4 • Hybrid Agile Finale (RM 50,000 • 3 Sprints)',
        title: 'Kuching Waterfront Heritage Festival Pavilion',
        text: (st) => {
            const m = getL4Metrics(st);
            return `With an immovable Opening Night, flip from fixed scope to <strong>value-driven Agile Sprints</strong>: deliver all ${m.mustTotal} <strong>Must-Haves</strong>, reach <strong>≥ 80 Value</strong>, and keep <strong>0 Quality Defects</strong> (now ${m.verifiedValue}/100 Val).`;
        },
        counter: (st) => {
            const sp = getL4SprintNumber(st.day);
            const val = getL4Metrics(st).verifiedValue;
            return { text: `Sprint ${sp}/3 · ${val}/100 Val`, cls: 'text-[#2E6F40]' };
        }
    },
    retro: {
        phaseTag: () => '🏆 Chapter 4 Complete • Hybrid Agile Finale',
        headline: (win) => win ? 'Waterfront Festival Pavilion Launched! 🌊' : 'Opening Night Missed Launch Target',
        sub: (win) => win
            ? 'On Opening Night along Sungai Sarawak, visitors pack every verified exhibit—you balanced Predictive discipline with Agile value & zero-defect Quality!'
            : 'Opening Night arrived on Turn 6. Next run, deliver all 3 Must-Haves, skip low-ROI Could-Haves, reach ≥ 80 Value, and resolve any Quality Defects before launch.',
        badge: (win) => ({
            icon: win ? '🏆' : '🔄',
            title: win ? 'Certified Hybrid PM Master' : 'Agile & Quality Practitioner',
            desc: win
                ? 'Mastered the complete PM journey from Project Charter & WBS to Critical Path Control and value-driven Hybrid Agile Sprints with zero-defect Quality.'
                : 'MoSCoW prioritization focuses limited Sprint capacity on Must-Haves and high-value Should-Haves while protecting Definition of Done.'
        }),
        actions: (win) => win
            ? [
                { label: '🔄 Replay Level 4', onclick: 'replayCurrentLevel()', style: 'primary' },
                { label: '📜 Restart Career from Level 1', onclick: 'advanceToNextLevel(1)', style: 'secondary' }
            ]
            : [
                { label: '🔄 Retry Level 4', onclick: 'replayCurrentLevel()', style: 'retry' },
                { label: '📜 Restart Career from Level 1', onclick: 'advanceToNextLevel(1)', style: 'secondary' }
            ]
    },
    retroPrompts: {
        well: [
            '🎯 MoSCoW prioritization locked all 3 Must-Haves and high-value Should-Haves while leaving low-ROI Could-Have distractions on the Backlog.',
            '🛡️ Welcoming feedback between Sprints and avoiding exhausted rework kept Quality Defects out of our Opening Night release.'
        ],
        improve: [
            '⚖️ Avoid crashing or overworking fatigued artisans unless buffered by QA, or Defect Rework eats extra turns and RM 1,000 budget.',
            '🔄 Pull only high-Value deliverables into each 3-item Sprint WIP slot so Opening Night hits ≥ 80–100 Value cleanly.'
        ]
    },
    intro: {
        tag: 'Chapter 4 • Hybrid Agile Finale',
        emoji: '🌊',
        title: 'Waterfront Festival Pavilion',
        place: 'Kuching Waterfront • Sungai Sarawak & Darul Hana',
        story: [
            'Word of your Carpenter Street restoration reached the <strong>Sarawak Tourism &amp; Heritage Council</strong>. They have one flagship job left: the <strong>Waterfront Heritage Festival Pavilion</strong> facing Darul Hana Bridge.',
            'Opening Night cannot slip — you have <strong>RM 50,000 and 3 two-week Sprints (6 turns)</strong>, and the wish-list has way more ideas than time! You’ll pull high-value items using <strong>MoSCoW prioritization</strong> and adapt at live <strong>Sprint Reviews</strong>.',
            'Careful: pushing burned-out or rushed artisans leaves behind <strong>Quality Defects</strong> that block Festival Value until fixed!'
        ],
        stats: [['💰', 'Budget', 'RM 50,000'], ['🔄', 'Time-Box', '3 Sprints'], ['👥', 'Crew', '3 Artisans']],
        skillLabel: 'New skills this chapter',
        skills: [
            '🎯 <strong>MoSCoW Value Prioritization:</strong> Must-Haves + high-value Should-Haves beat costly Could-Have traps.',
            '📦 <strong>WIP-Limited Sprint Planning:</strong> pull up to <strong>3 active items</strong> per Sprint.',
            '🔧 <strong>Quality &amp; Rework:</strong> fatigue or unshielded crashing creates Defects that block launch value.',
            '🤝 <strong>Sprint Reviews:</strong> welcome high-value feedback between Sprints by re-prioritizing the Backlog.'
        ],
        carryTitle: '',
        carryFrom: () => '',
        cta: 'Begin Chapter 4 🌊'
    },

    createState() {
        return {
            level: 4,
            subtitle: SUBTITLE,
            phase: 'execution',
            day: 1,
            maxDays: 6,
            budget: 50000,
            initialBudget: 50000,
            contingencyReserve: 0,
            wipLimit: 3,
            targetValue: 100,
            minLaunchValue: 80,
            sprint1ReviewResolved: false,
            sprint2ReviewResolved: false,
            qaShieldActive: false,
            defectsCreated: 0,
            defectsFixed: 0,
            goodwillStars: 0,
            burnoutIncidents: 0,
            crashCount: 0,
            scopeDecisionOutcome: null,
            l4Finished: false,
            isExecuting: false,
            selectedAssignTaskId: null,
            retroChoice: { wentWell: 0, toImprove: 0 },

            signedCharterSummary: {
                objective: 'Deliver a launch-ready Kuching Waterfront Festival Pavilion with all Must-Have core infrastructure, ≥ 80 Festival Value, and zero open Quality Defects',
                constraints: 'RM 50,000 Fixed Budget • 3 Two-Week Sprints (Immovable Opening Night)',
                outOfScope: 'Do not build every low-value wish-list item — prioritize highest Festival Value within budget & time-box'
            },

            workPackages: [],

            tasks: [
                {
                    id: 'l4-t1', crashed: false, priority: 'must', value: 25, inSprint: false, hasDefect: false,
                    title: 'Belian Pavilion Timber Deck', cost: 8500, effort: 2, skill: 'Carpentry', outdoor: true,
                    deps: [], critical: true, progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'frames and anchors the belian-timber waterfront festival deck along Sungai Sarawak'
                },
                {
                    id: 'l4-t2', crashed: false, priority: 'must', value: 15, inSprint: false, hasDefect: false,
                    title: 'Safety Railings & Festival Lighting', cost: 6000, effort: 1, skill: 'Logistics', outdoor: true,
                    deps: ['l4-t1'], critical: true, progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'mounts riverfront safety railings and strings warm festoon lamps across the pavilion'
                },
                {
                    id: 'l4-t3', crashed: false, priority: 'must', value: 20, inSprint: false, hasDefect: false,
                    title: 'Sarawak Heritage Tasting Hall', cost: 8000, effort: 2, skill: 'Culinary', outdoor: false,
                    deps: ['l4-t1'], critical: true, progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'equips the main Sarawakian culinary showcase hall with serving stations'
                },
                {
                    id: 'l4-t4', crashed: false, priority: 'should', value: 15, inSprint: false, hasDefect: false,
                    title: 'Sape & Orang Ulu Acoustic Stage', cost: 5500, effort: 1, skill: 'Carpentry', outdoor: false,
                    deps: ['l4-t1'], critical: false, progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'crafts the timber resonance stage for Sape musicians overlooking Darul Hana Bridge'
                },
                {
                    id: 'l4-t5', crashed: false, priority: 'should', value: 15, inSprint: false, hasDefect: false,
                    title: 'Iban Pua Kumbu Weaving Pavilion', cost: 5000, effort: 1, skill: 'Logistics', outdoor: false,
                    deps: [], critical: false, progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'rigs heritage textile looms and spot-lit display frames for master weavers'
                },
                {
                    id: 'l4-t6', crashed: false, priority: 'should', value: 15, inSprint: false, hasDefect: false,
                    title: 'Laksa & Kek Lapis Live Demo Bay', cost: 4500, effort: 1, skill: 'Culinary', outdoor: false,
                    deps: [], critical: false, progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'sets up live Kek Lapis layering benches and aromatic Kuching Laksa kettles'
                },
                {
                    id: 'l4-t7', crashed: false, priority: 'should', value: 10, inSprint: false, hasDefect: false,
                    title: 'Sungai Sarawak Heritage Wayfinding', cost: 3500, effort: 1, skill: 'Logistics', outdoor: true,
                    deps: [], critical: false, progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'installs carved bilingual festival signage and crowd-flow markers'
                },
                {
                    id: 'l4-t8', crashed: false, priority: 'could', value: 5, inSprint: false, hasDefect: false,
                    title: 'Giant Fiberglass Hornbill Arch', cost: 11500, effort: 2, skill: 'Carpentry', outdoor: true,
                    deps: [], critical: false, progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'assembles an oversized novelty archway that eats heavy budget and two turns'
                },
                {
                    id: 'l4-t9', crashed: false, priority: 'could', value: 5, inSprint: false, hasDefect: false,
                    title: 'Imported Marble VIP Fountain', cost: 12000, effort: 2, skill: 'Logistics', outdoor: true,
                    deps: [], critical: false, progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'plumbs an expensive marble centerpiece with minimal crowd value'
                }
            ],

            artisans: [
                { id: 'lim', name: 'Uncle Lim', role: 'Carpentry', skill: 'Carpentry', stamina: 100, assignedTaskId: null, resting: false },
                { id: 'salmah', name: 'Kak Salmah', role: 'Culinary', skill: 'Culinary', stamina: 100, assignedTaskId: null, resting: false },
                { id: 'danny', name: 'Danny', role: 'Logistics', skill: 'Logistics', stamina: 100, assignedTaskId: null, resting: false }
            ]
        };
    },

    isFinished(st) {
        return Boolean(st && st.l4Finished);
    },

    checkTurnEnd(st) {
        const allBacklogVerified = st.tasks.every(t => t.progress >= 100 && !t.hasDefect);
        if (allBacklogVerified || st.day >= st.maxDays) {
            st.l4Finished = true;
            return { done: true, isVictory: getL4Metrics(st).canLaunch };
        }
        return { done: false };
    },

    getPostTurnGuidance(st, { defectToday = [], pausedForFatigue = [], continuingToday = [] }) {
        if (defectToday.length > 0) {
            return {
                toast: `⚠️ Quality Defect on ${defectToday[0]}!`,
                guidance: `⚠️ <strong>Quality Defect!</strong> Rework needed on <strong>${defectToday.join(', ')}</strong> (-RM ${L4_REWORK_COST.toLocaleString()}, 1 Turn) before Opening Night counts its Value.`
            };
        }
        if (pausedForFatigue.length > 0 || continuingToday.length > 0) {
            const notes = [];
            if (pausedForFatigue.length > 0) {
                notes.push(`⚠️ Paused (&lt;35% stamina): <strong>${pausedForFatigue.join(', ')}</strong> — schedule ☕ Rest!`);
            }
            if (continuingToday.length > 0) {
                notes.push(`↻ Continuing: <strong>${continuingToday.join(', ')}</strong>.`);
            }
            return {
                guidance: `<strong>Sprint ${getL4SprintNumber(st.day)} · Turn ${st.day}/${st.maxDays}:</strong> ${notes.join(' ')}`
            };
        }
        return {
            guidance: `<strong>Sprint ${getL4SprintNumber(st.day)} · Turn ${st.day}/${st.maxDays}:</strong> Pull high-Value Backlog items (WIP limit 3) and assign your crew!`
        };
    },

    getHudMetrics(st) {
        const m4 = getL4Metrics(st);
        const daysLeft = Math.max(0, st.maxDays - st.day + 1);
        const valGap = Math.max(0, (st.minLaunchValue || 80) - m4.verifiedValue);
        const mustGap = (m4.mustTotal - m4.mustDone) * 15;
        const reqPerTurn = (valGap + mustGap) / Math.max(1, daysLeft);
        let tiltDeg = (reqPerTurn - 14) * 0.65;
        if (m4.openDefects > 0) tiltDeg += 6;
        if (st.budget < 6000) tiltDeg += 4;
        tiltDeg = Math.round(Math.max(-14, Math.min(16, tiltDeg)));

        let statusText = 'Balanced & Steady';
        let statusCls = 'font-semibold text-[#A7F3D0]';
        let jewelColor = '#34D399';

        if (m4.openDefects > 0) {
            statusText = `${m4.openDefects} Open Quality Defect${m4.openDefects > 1 ? 's' : ''}!`;
            statusCls = 'font-semibold text-[#FECACA]';
            jewelColor = '#F87171';
        } else if (m4.canLaunch) {
            statusText = 'Opening Night Launch Ready!';
        } else if (tiltDeg > 7) {
            statusText = 'Heavy Scope/Schedule Pressure';
            statusCls = 'font-semibold text-[#FECACA]';
            jewelColor = '#F87171';
        } else if (tiltDeg < -4) {
            statusText = 'Ahead of Schedule';
        }

        return {
            dayText: `S${getL4SprintNumber(st.day)}: ${daysLeft} Left`,
            scopeText: `${m4.verifiedValue}/100 Val`,
            scopeProgressPct: Math.min(100, m4.verifiedValue),
            tiltDeg,
            statusText,
            statusCls,
            jewelColor,
            dioramaBadgeText: `Value: ${m4.verifiedValue}/100`
        };
    },

    renderContextBanner(st, expanded, { uiIcon }) {
        const m4 = getL4Metrics(st);
        const chevronCls = `w-3.5 h-3.5 text-[#5C3A21] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`;
        const badgeCls = m4.openDefects > 0
            ? 'bg-[#B91C1C]/15 text-[#991B1B] border border-[#B91C1C]/40'
            : m4.canLaunch
                ? 'bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/40'
                : 'bg-[#C58F2A]/15 text-[#7A5404] border border-[#C58F2A]/40';
        const badgeLabel = m4.openDefects > 0 ? `⚠️ ${m4.openDefects} Defect${m4.openDefects > 1 ? 's' : ''}` : m4.canLaunch ? '✓ Launch Ready' : `Sprint ${getL4SprintNumber(st.day)}/3`;

        return `
            <button type="button" onclick="toggleContextBanner()" class="w-full flex items-center justify-between gap-2 text-left cursor-pointer">
                <span class="flex items-center gap-1.5 min-w-0 ts-caption font-bold text-[#5C3A21] truncate">
                    ${uiIcon('compass', 'w-3.5 h-3.5 text-[#C85A32] shrink-0')}
                    <span class="truncate">Must ${m4.mustDone}/${m4.mustTotal} · Val ${m4.verifiedValue}/100 · Defects ${m4.openDefects}</span>
                </span>
                <span class="shrink-0 flex items-center gap-1.5">
                    <span class="px-1.5 py-0.5 rounded ${badgeCls} ts-micro font-bold">${badgeLabel}</span>
                    ${uiIcon('chevronDown', chevronCls)}
                </span>
            </button>
            ${expanded ? `
                <div class="mt-1.5 pt-1.5 border-t border-[#8C6A4A]/35 ts-micro text-[#3D2412] leading-snug space-y-0.5 animate-crisp-in">
                    <div><strong>Launch Gate (Turn 6):</strong> Deliver 3/3 Must-Haves, ≥ 80 Festival Value, and 0 open Quality Defects.</div>
                    <div><strong>Quality Rule:</strong> Fatigued (&lt;35% stamina) or unshielded Crashing creates Quality Defects (-RM ${L4_REWORK_COST.toLocaleString()} / 1 Turn QA fix).</div>
                </div>
            ` : ''}
        `;
    },

    getDioramaTimeOfDay(st) {
        if (st.l4Finished) {
            const launched = getL4Metrics(st).canLaunch;
            return {
                label: launched ? 'Festival Launched!' : 'Opening Night Ended',
                skyTop: '#2D223C',
                skyBottom: '#C85A32',
                ambientTint: 'rgba(255, 196, 92, 0.14)'
            };
        }
        const sp = getL4SprintNumber(st.day);
        return {
            label: st.isExecuting ? `Sprint ${sp} • Turn ${st.day}/${st.maxDays}` : `Sprint ${sp}/3 • Turn ${st.day}/${st.maxDays}`,
            skyTop: st.isExecuting ? '#F3B45A' : '#E8B87A',
            skyBottom: '#FCE5B4',
            ambientTint: st.isExecuting ? 'rgba(246, 180, 68, 0.12)' : 'rgba(255, 224, 178, 0.06)'
        };
    },

    buildDioramaSVG(st) {
        const getL4State = (id) => {
            const t = st.tasks.find(x => x.id === id);
            if (!t) return 'hidden';
            if (t.progress >= 100) return 'done';
            if (t.assignedArtisanId || t.progress > 0 || t.inSprint) return 'active';
            return t.priority === 'must' ? 'blueprint' : 'hidden';
        };
        const defectBadge = (taskId, x, y) => {
            const t = st.tasks.find(x => x.id === taskId);
            if (!t || !t.hasDefect) return '';
            return `
                <g transform="translate(${x}, ${y})" class="diorama-sparkle">
                    <circle cx="0" cy="0" r="7.5" fill="#B91C1C" stroke="#FFFDF8" stroke-width="1.3"/>
                    <text x="0" y="3.2" text-anchor="middle" fill="#FFFDF8" font-size="9" font-weight="800">!</text>
                </g>
            `;
        };

        const deckLayer = renderDioramaLayerWrapper(
            getL4State('l4-t1'),
            `<rect x="74" y="132" width="272" height="18" rx="2.5" fill="url(#wood-teak)" stroke="#241B15" stroke-width="1.5"/>
            <line x1="88" y1="132" x2="88" y2="150" stroke="#3D2412" stroke-width="1.1"/>
            <line x1="146" y1="132" x2="146" y2="150" stroke="#3D2412" stroke-width="1.1"/>
            <line x1="210" y1="132" x2="210" y2="150" stroke="#3D2412" stroke-width="1.1"/>
            <line x1="274" y1="132" x2="274" y2="150" stroke="#3D2412" stroke-width="1.1"/>
            <line x1="332" y1="132" x2="332" y2="150" stroke="#3D2412" stroke-width="1.1"/>
            <rect x="92" y="72" width="8" height="60" fill="url(#wood-warm)" stroke="#241B15" stroke-width="1.2"/>
            <rect x="206" y="68" width="8" height="64" fill="url(#wood-warm)" stroke="#241B15" stroke-width="1.2"/>
            <rect x="320" y="72" width="8" height="60" fill="url(#wood-warm)" stroke="#241B15" stroke-width="1.2"/>`,
            `<rect x="74" y="132" width="272" height="18" rx="2.5" fill="rgba(255,253,249,0.28)" stroke="#C85A32" stroke-width="1.4" stroke-dasharray="4 3"/>
            <rect x="92" y="72" width="8" height="60" fill="none" stroke="#C85A32" stroke-width="1.2" stroke-dasharray="3 3"/>
            <rect x="320" y="72" width="8" height="60" fill="none" stroke="#C85A32" stroke-width="1.2" stroke-dasharray="3 3"/>`,
            { x: 210, y: 126 }
        );

        const hallLayer = renderDioramaLayerWrapper(
            getL4State('l4-t3'),
            `<path d="M136 74 L210 38 L284 74 Z" fill="url(#roof-terra)" stroke="#241B15" stroke-width="1.6"/>
            <rect x="148" y="74" width="124" height="58" fill="#FAF5EB" stroke="#241B15" stroke-width="1.4"/>
            <rect x="164" y="96" width="92" height="36" rx="2" fill="url(#wood-warm)" stroke="#241B15" stroke-width="1.3"/>
            <rect x="180" y="84" width="18" height="12" rx="1.5" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1.1"/>
            <rect x="220" y="82" width="26" height="14" rx="1.5" fill="#F1E7D3" stroke="#241B15" stroke-width="1.1"/>`,
            `<path d="M136 74 L210 38 L284 74 Z" fill="rgba(255,253,249,0.2)" stroke="#2E6F40" stroke-width="1.4" stroke-dasharray="4 3"/>
            <rect x="164" y="96" width="92" height="36" fill="none" stroke="#2E6F40" stroke-width="1.2" stroke-dasharray="3 3"/>`,
            { x: 210, y: 80 }
        );

        const lightingLayer = renderDioramaLayerWrapper(
            getL4State('l4-t2'),
            `<path d="M84 122 H336" stroke="#241B15" stroke-width="2" stroke-linecap="round"/>
            ${[100, 125, 150, 175, 200, 225, 250, 275, 300, 320].map(rx => `<line x1="${rx}" y1="122" x2="${rx}" y2="132" stroke="#5C3A21" stroke-width="1.3"/>`).join('')}
            <path d="M96 68 Q154 84 210 68 Q266 84 324 68" stroke="#3D2412" stroke-width="1.2" fill="none"/>
            ${[116, 150, 184, 236, 270, 304].map((lx, idx) => `
                <circle cx="${lx}" cy="${idx % 2 === 0 ? 75 : 73}" r="5" fill="url(#glow-gold)"/>
                <circle cx="${lx}" cy="${idx % 2 === 0 ? 75 : 73}" r="2.4" fill="#FDE68A" stroke="#241B15" stroke-width="0.8"/>
            `).join('')}`,
            `<path d="M84 122 H336" stroke="#C58F2A" stroke-width="1.4" stroke-dasharray="4 3"/>
            <path d="M96 68 Q210 82 324 68" stroke="#C58F2A" stroke-width="1.2" fill="none" stroke-dasharray="3 3"/>`,
            { x: 150, y: 74 }
        );

        const stageLayer = getL4State('l4-t4') === 'hidden' ? '' : renderDioramaLayerWrapper(
            getL4State('l4-t4'),
            `<rect x="34" y="122" width="52" height="28" rx="2" fill="url(#wood-teak)" stroke="#241B15" stroke-width="1.3"/>
            <path d="M30 122 L60 102 L90 122 Z" fill="#C58F2A" stroke="#241B15" stroke-width="1.3"/>
            <path d="M56 120 Q60 110 64 120" stroke="#FFFDF9" stroke-width="1.4" fill="none"/>`,
            `<rect x="34" y="122" width="52" height="28" rx="2" fill="none" stroke="#8C6106" stroke-width="1.2" stroke-dasharray="3 3"/>`,
            { x: 60, y: 118 }
        );

        const weavingLayer = getL4State('l4-t5') === 'hidden' ? '' : renderDioramaLayerWrapper(
            getL4State('l4-t5'),
            `<rect x="92" y="96" width="44" height="36" rx="2" fill="#FFFDF9" stroke="#241B15" stroke-width="1.2"/>
            <rect x="96" y="100" width="12" height="24" rx="1" fill="#C85A32" stroke="#241B15" stroke-width="0.9"/>
            <rect x="112" y="100" width="12" height="24" rx="1" fill="#C58F2A" stroke="#241B15" stroke-width="0.9"/>
            <rect x="128" y="100" width="5" height="24" rx="1" fill="#2E6F40" stroke="#241B15" stroke-width="0.9"/>`,
            `<rect x="92" y="96" width="44" height="36" fill="none" stroke="#C85A32" stroke-width="1.2" stroke-dasharray="3 3"/>`,
            { x: 114, y: 108 }
        );

        const demoBayLayer = getL4State('l4-t6') === 'hidden' ? '' : renderDioramaLayerWrapper(
            getL4State('l4-t6'),
            `<rect x="284" y="96" width="48" height="36" rx="2" fill="#FFF5D6" stroke="#241B15" stroke-width="1.3"/>
            <rect x="280" y="90" width="56" height="8" rx="2" fill="#C85A32" stroke="#241B15" stroke-width="1.2"/>
            <circle cx="308" cy="112" r="7" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1.1"/>
            <path d="M306 102 Q304 96 308 92" stroke="#FFFDF9" stroke-width="1.3" fill="none" class="diorama-steam"/>`,
            `<rect x="284" y="96" width="48" height="36" fill="none" stroke="#C85A32" stroke-width="1.2" stroke-dasharray="3 3"/>`,
            { x: 308, y: 106 }
        );

        const wayfindingLayer = getL4State('l4-t7') === 'hidden' ? '' : renderDioramaLayerWrapper(
            getL4State('l4-t7'),
            `<rect x="150" y="48" width="120" height="16" rx="3" fill="#3D2412" stroke="#C58F2A" stroke-width="1.5"/>
            <text x="210" y="59" text-anchor="middle" fill="#F6D365" font-family="Fraunces, serif" font-weight="700" font-size="7.5" letter-spacing="0.6">SARAWAK FESTIVAL</text>`,
            `<rect x="150" y="48" width="120" height="16" rx="3" fill="none" stroke="#C58F2A" stroke-width="1.2" stroke-dasharray="3 3"/>`,
            { x: 210, y: 56 }
        );

        const storyDeckLayer = getL4State('l4-t10') === 'hidden' ? '' : renderDioramaLayerWrapper(
            getL4State('l4-t10'),
            `<rect x="336" y="122" width="52" height="28" rx="2" fill="#E6F4EA" stroke="#241B15" stroke-width="1.3"/>
            <path d="M332 122 Q362 104 392 122 Z" fill="#2E6F40" stroke="#1B4226" stroke-width="1.3"/>
            <circle cx="362" cy="134" r="5" fill="#F6D365" stroke="#241B15" stroke-width="1"/>`,
            `<rect x="336" y="122" width="52" height="28" fill="none" stroke="#2E6F40" stroke-width="1.2" stroke-dasharray="3 3"/>`,
            { x: 362, y: 120 }
        );

        const hornbillArchLayer = getL4State('l4-t8') === 'hidden' ? '' : renderDioramaLayerWrapper(
            getL4State('l4-t8'),
            `<path d="M26 150 V100 Q54 78 82 100 V150" fill="none" stroke="#C85A32" stroke-width="5" stroke-linecap="round"/>
            <polygon points="54,76 44,86 64,86" fill="#F6D365" stroke="#241B15" stroke-width="1.1"/>`,
            `<path d="M26 150 V100 Q54 78 82 100 V150" fill="none" stroke="#C85A32" stroke-width="2" stroke-dasharray="3 3"/>`,
            { x: 54, y: 88 }
        );

        const fountainLayer = getL4State('l4-t9') === 'hidden' ? '' : renderDioramaLayerWrapper(
            getL4State('l4-t9'),
            `<ellipse cx="372" cy="146" rx="22" ry="7" fill="#E2E8F0" stroke="#241B15" stroke-width="1.2"/>
            <ellipse cx="372" cy="144" rx="16" ry="4" fill="#7DD3FC"/>
            <line x1="372" y1="144" x2="372" y2="128" stroke="#E0F2FE" stroke-width="2"/>`,
            `<ellipse cx="372" cy="146" rx="22" ry="7" fill="none" stroke="#64748B" stroke-width="1.2" stroke-dasharray="3 3"/>`,
            { x: 372, y: 136 }
        );

        const defectOverlays = [
            defectBadge('l4-t1', 210, 140),
            defectBadge('l4-t2', 175, 76),
            defectBadge('l4-t3', 210, 108),
            defectBadge('l4-t4', 60, 134),
            defectBadge('l4-t5', 114, 112),
            defectBadge('l4-t6', 308, 114),
            defectBadge('l4-t7', 274, 56),
            defectBadge('l4-t8', 54, 82),
            defectBadge('l4-t9', 372, 132),
            defectBadge('l4-t10', 362, 132)
        ].join('');

        return {
            backdrop: `
                <rect x="0" y="0" width="420" height="170" fill="url(#diorama-sky)"/>
                <image href="assets/bg-l4-waterfront.jpg" x="0" y="0" width="420" height="170" preserveAspectRatio="xMidYMid slice"/>
                <rect x="0" y="148" width="420" height="22" fill="rgba(61, 36, 18, 0.14)" pointer-events="none"/>
            `,
            layers: deckLayer + hallLayer + weavingLayer + demoBayLayer + stageLayer + storyDeckLayer + hornbillArchLayer + fountainLayer + lightingLayer + wayfindingLayer + defectOverlays,
            stationCoords: {
                'l4-t1': { x: 210, y: 152 },
                'l4-t2': { x: 148, y: 152 },
                'l4-t3': { x: 248, y: 152 },
                'l4-t4': { x: 60, y: 152 },
                'l4-t5': { x: 114, y: 152 },
                'l4-t6': { x: 308, y: 152 },
                'l4-t7': { x: 210, y: 152 },
                'l4-t8': { x: 54, y: 152 },
                'l4-t9': { x: 372, y: 152 },
                'l4-t10': { x: 362, y: 152 }
            },
            restSlots: [{ x: 96, y: 154 }, { x: 210, y: 154 }, { x: 328, y: 154 }]
        };
    },

    events: [
        {
            id: 'l4_sprint1_review',
            sound: 'alertPop',
            check: (st) => st.day === 3 && !st.sprint1ReviewResolved,
            buildModal: (st) => {
                const m4 = getL4Metrics(st);
                return {
                    emojiHtml: getArtisanPortraitSVG('director', 44),
                    tag: 'End of Sprint 1 • Sprint Review',
                    title: 'Waterfront Prototype Review',
                    bodyHtml: `
                        <div class="mb-2.5 p-2.5 rounded-lg bg-[#E6F4F1] border border-[#0F766E]/40 text-[11px] text-[#134E4A] leading-snug">
                            <strong>📊 Sprint 1 Increment:</strong> ${m4.verifiedValue}/100 Value delivered · Must-Haves ${m4.mustDone}/${m4.mustTotal} · Open Defects ${m4.openDefects}
                        </div>
                        <div>
                            The Tourism Council Director inspects your Waterfront increment: <em>“Families loved our riverfront showcase! Could you add a <strong>Shaded Family Storytelling Deck</strong> (+20 Festival Value, Culinary, 1 Turn, RM 4,000) for Sprints 2–3? Opening Night stays locked at Turn 6.”</em>
                        </div>
                    `,
                    actions: [
                        { id: 'backlog', title: '1. Add to Product Backlog & Re-prioritize (RM 4,000 when pulled)', desc: 'Place the high-Value item on the Backlog so you can swap out lower-Value features intentionally.', disabled: false },
                        { id: 'expedite', title: '2. Expedite Immediately with Rush Setup (RM 6,500 when started)', desc: 'Push directly into Active Sprint with express contractor markup (+RM 2,500 cost).', disabled: false },
                        { id: 'decline', title: '3. Decline — Keep Initial Backlog Frozen (RM 0)', desc: 'Turn down Sprint Review feedback and stick strictly to the Day 1 backlog list.', disabled: false }
                    ]
                };
            },
            onResolve: (st, choice, api) => {
                api.sound.woodClick();
                st.sprint1ReviewResolved = true;
                const storyTask = {
                    id: 'l4-t10', crashed: false, priority: 'should', value: 20,
                    inSprint: choice === 'expedite', hasDefect: false,
                    title: 'Shaded Family Storytelling Deck',
                    cost: choice === 'expedite' ? 6500 : 4000, effort: 1, skill: 'Culinary', outdoor: true,
                    deps: [], critical: false, progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'builds the shaded riverside storytelling lounge and kuih picnic mats'
                };
                if (choice === 'backlog') {
                    st.tasks.push(storyTask);
                    st.goodwillStars += 1;
                    st.scopeDecisionOutcome = 'agile_reprioritized';
                    api.showToast('🔄 Added +20 Val item to Backlog (+1 Goodwill)!', 'success');
                    api.updateGuidance('🔄 <strong>Agile Re-prioritization!</strong> Added <strong>Shaded Family Storytelling Deck</strong> (+20 Value, RM 4,000) to the Backlog. Pull high-Value work into Sprint 2!');
                } else if (choice === 'expedite') {
                    st.tasks.push(storyTask);
                    st.scopeDecisionOutcome = 'agile_rush_disrupted';
                    api.showToast('⚡ Expedited directly into Sprint (RM 6,500 cost)', 'warn');
                    api.updateGuidance('⚡ <strong>Sprint Expedited:</strong> Pushed <strong>Storytelling Deck</strong> straight into Active Sprint at RM 6,500 (WIP pressure!).');
                } else {
                    st.goodwillStars -= 1;
                    st.scopeDecisionOutcome = 'agile_rigid_declined';
                    api.showToast('⚠️ Declined Sprint Review feedback (-1 Goodwill)', 'warn');
                    api.updateGuidance('⚠️ <strong>Missed Agile Adaptation:</strong> Kept initial Backlog frozen despite valuable stakeholder feedback (-1 Goodwill).');
                }
            }
        },
        {
            id: 'l4_sprint2_review',
            sound: 'alertPop',
            check: (st) => st.day === 5 && !st.sprint2ReviewResolved,
            buildModal: (st) => {
                const m4 = getL4Metrics(st);
                const canAffordQA = st.budget >= 2000;
                return {
                    emojiHtml: getArtisanPortraitSVG('director', 44),
                    tag: 'End of Sprint 2 • Readiness Audit',
                    title: 'Opening Night Readiness Check',
                    bodyHtml: `
                        <div class="mb-2.5 p-2.5 rounded-lg bg-[#FAF5EB] border border-[#8C6A4A]/60 text-[11px] text-[#3D2412] leading-snug">
                            <strong>📊 Heading into Final Sprint (Sprint 3):</strong><br/>
                            Must-Haves: <strong>${m4.mustDone}/${m4.mustTotal}</strong> · Verified Value: <strong>${m4.verifiedValue}/100</strong> · Open Defects: <strong>${m4.openDefects}</strong>
                        </div>
                        <div>
                            With 1 Sprint left before Opening Night, a Council QA Inspector offers a formal pre-check. Fixing any open Defect now prevents launch-blocking rework in Sprint 3, or you can save the fee and inspect with your own crew.
                        </div>
                    `,
                    actions: [
                        {
                            id: 'qa_inspect',
                            title: '1. Commission Formal QA Pre-Inspection (-RM 2,000)',
                            desc: 'Clears 1 open Quality Defect immediately (if any) and shields Sprint 3 Schedule Crashing from defects.',
                            disabled: !canAffordQA
                        },
                        {
                            id: 'self_check',
                            title: '2. Run Standard Crew Self-Check (RM 0)',
                            desc: 'Keep RM 2,000 in operating budget; keep crew rested above 35% to finish Sprint 3 cleanly.',
                            disabled: false
                        }
                    ]
                };
            },
            onResolve: (st, choice, api) => {
                api.sound.brassBalance();
                st.sprint2ReviewResolved = true;
                if (choice === 'qa_inspect' && st.budget >= 2000) {
                    st.budget -= 2000;
                    st.qaShieldActive = true;
                    const defectTask = st.tasks.find(t => t.hasDefect);
                    if (defectTask) {
                        defectTask.hasDefect = false;
                        st.defectsFixed = (st.defectsFixed || 0) + 1;
                        api.showToast(`🛡️ QA cleared Defect on "${defectTask.title}" (-RM 2,000)!`, 'success');
                        api.updateGuidance(`🛡️ <strong>QA Pre-Inspection Complete!</strong> Resolved defect on <strong>${defectTask.title}</strong> and shielded Sprint 3 rushing!`);
                    } else {
                        api.showToast('🛡️ Formal QA Shield active for Sprint 3 (-RM 2,000)', 'success');
                        api.updateGuidance('🛡️ <strong>QA Shield Active!</strong> Final Sprint 3 Crashing is protected against Defects. Finish Must-Haves &amp; hit ≥ 80 Value!');
                    }
                } else {
                    api.showToast('👍 Crew Self-Check active (RM 0 spent)', 'info');
                    api.updateGuidance('<strong>Final Sprint (Sprint 3):</strong> Keep artisans rested (&ge; 35%) and deliver all Must-Haves + ≥ 80 Value with 0 Defects!');
                }
            }
        }
    ],

    evaluateMastery(st, isVictory) {
        const m4 = getL4Metrics(st);
        const c1 = Boolean(isVictory);
        const c2 = c1 && m4.verifiedValue >= 100 && (st.burnoutIncidents || 0) === 0;
        const c3 = c2 && st.budget >= 5000 && st.scopeDecisionOutcome === 'agile_reprioritized' && (st.defectsCreated || 0) === 0;
        return {
            stars: (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0),
            criteria: [
                { met: c1, label: `Launch Opening Night: 3/3 Must-Haves, ≥ 80 Val (${m4.verifiedValue}) & 0 open Defects` },
                { met: c2, label: `Deliver ≥ 100 Festival Value (${m4.verifiedValue} Val) with 0 Burnout (${st.burnoutIncidents || 0})` },
                { met: c3, label: `Adapt Backlog in Sprint 1 Review, keep 0 Defects & save ≥ RM 5,000 (RM ${st.budget.toLocaleString()})` }
            ]
        };
    },

    getRetroScorecard(st, isVictory, { totalSaved }) {
        const m4 = getL4Metrics(st);
        return {
            budgetText: `RM ${totalSaved.toLocaleString()}`,
            timeLabel: 'Sprints Completed',
            timeText: `${getL4SprintNumber(st.day)} / 3 Sprints`,
            qualityText: `${m4.verifiedValue} Val ${isVictory ? '✅' : '⚠️'}`
        };
    },

    buildFailureHints(st) {
        const hints = [];
        const m4 = getL4Metrics(st);

        const unfinishedMusts = st.tasks.filter(t => t.priority === 'must' && (t.progress < 100 || t.hasDefect));
        if (unfinishedMusts.length > 0) {
            hints.push({
                icon: '🔴',
                title: `${unfinishedMusts.length} Must-Have deliverable${unfinishedMusts.length > 1 ? 's' : ''} not launch-ready`,
                text: `Missing Must-Haves: ${unfinishedMusts.map(t => t.title).join(', ')}. Start Belian Pavilion Timber Deck on Turn 1 so it unlocks the Tasting Hall & Safety Lighting early.`
            });
        }

        if (m4.openDefects > 0) {
            const defNames = st.tasks.filter(t => t.hasDefect).map(t => t.title).join(', ');
            hints.push({
                icon: '🔧',
                title: `${m4.openDefects} open Quality Defect${m4.openDefects > 1 ? 's' : ''} paused Festival Value`,
                text: `Open Defects on: ${defNames}. Keep crew above 35% stamina and avoid unshielded Crashing, or fix Defects with a 1-Turn QA Rework (-RM ${L4_REWORK_COST.toLocaleString()}) before Launch.`
            });
        }

        const builtCoulds = st.tasks.filter(t => t.priority === 'could' && (t.progress > 0 || t.inSprint));
        if (builtCoulds.length > 0) {
            hints.push({
                icon: '📉',
                title: 'Low-ROI "Could-Have" items consumed Sprint capacity',
                text: `Avoid pulling ${builtCoulds.map(t => t.title).join(' or ')} (+5 Val for RM 11.5k–12k & 2 turns). Focus on Must-Haves + high-Value Should-Haves (+15–20 Val) instead.`
            });
        }

        if (m4.verifiedValue < (st.minLaunchValue || 80)) {
            hints.push({
                icon: '🎯',
                title: `Festival Value reached ${m4.verifiedValue}/100 (need ≥ ${st.minLaunchValue || 80})`,
                text: 'Always keep up to 3 high-Value items active in your Sprint, add the Storytelling Deck (+20 Val) in Sprint 1 Review, and avoid idle artisan turns.'
            });
        }

        return {
            heading: `💡 Agile Coaching Notes (${m4.verifiedValue}/100 Val • Must ${m4.mustDone}/${m4.mustTotal} • ${m4.openDefects} Defects)`,
            hints: hints.slice(0, 3)
        };
    }
};
