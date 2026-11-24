// Chapter 2: Siniawan Night Market Stall (Scope & Scheduling • WBS 100% Rule)
import { renderCharterReferenceBox, scrambleStatements } from '../core/constants.js';
import { getArtisanPortraitSVG, getTaskLayerState, renderDioramaLayerWrapper } from '../ui/artwork.js';

const SUBTITLE = 'Level 2 • Siniawan Night Market (RM 2,500 • 6 Days)';

export const chapter2 = {
    id: 2,
    order: 2,
    shortLabel: 'L2 WBS',
    title: 'Siniawan Night Market Stall',
    domain: 'Scope & Planning • WBS 100% Rule',
    emoji: '🏮',
    backdrop: 'assets/bg-l2-siniawan.jpg',
    mode: 'wbs_predictive',
    subtitle: SUBTITLE,
    time: { unit: 'Day', units: 'Days', effort: ['Day', 'Days'], turn: 'Workday', turnIcon: '☀️', previous: 'yesterday' },
    lowBudgetThreshold: 400,
    capabilities: {
        wbsDecompose: true,
        crashing: false,
        crashCost: 500,
        wipLimit: null,
        qualityDefects: false,
        reworkCost: 0,
        reserveFund: false,
        monsoonWindow: false
    },
    exec: { icon: '🏮', subtitle: 'Your crew is building at Siniawan Night Market...' },
    startGuidance: '<strong>Step 1 (WBS 100%):</strong> Match each scope card to its <strong>Work Package</strong> or Out of Scope.',
    tutorial: {
        chapterLine: '📦 <strong>Ch 2 • Siniawan Stall (RM 2,500 • 6 Days):</strong> Build via <strong>WBS 100% Rule</strong>',
        lifecycleLine: '2️⃣ <strong>Level 2 • Work Breakdown Structure (WBS):</strong> Decompose Work Packages &amp; multi-day Tasks (100% Rule).'
    },
    brief: {
        tag: 'Chapter 2 • Community Expansion (RM 2,500 • 6 Days)',
        title: 'Siniawan Night Market Heritage Stall',
        text: () => 'Impressed by your Main Bazaar Charter, Auntie Mei refers you to the Siniawan Heritage Committee! Scale up 5× using the <strong>WBS 100% Rule</strong> across multi-day tasks.',
        counter: (st) => {
            const placed = Object.values(st.wbsBuckets).reduce((sum, b) => sum + b.filledIds.length, 0);
            return { text: `WBS: ${placed}/${st.wbsCards.length} Mapped`, cls: 'text-[#2E6F40]' };
        }
    },
    retro: {
        phaseTag: (win) => win ? '📦 Chapter 2 Complete • Community Expansion' : '📦 Chapter 2 Review • Scope Planning',
        headline: (win, pct) => win ? 'Siniawan Night Market Stall Complete! 🏮' : `Market Stall Incomplete (${pct}%)`,
        sub: (win) => win
            ? 'Your WBS-driven pavilion drew crowds across Bau! The Carpenter Street Heritage Guild just offered a RM 15,000, 6-week shophouse restoration.'
            : 'Match specialists to Tasks, manage stamina, and watch your 6-day deadline to finish all 6 Tasks.',
        badge: () => ({
            icon: '📦',
            title: 'WBS 100% Rule Specialist',
            desc: 'Decomposing high-level Work Packages into granular, multi-day Tasks eliminates ambiguity and scales your crew to bigger projects.'
        }),
        actions: (win) => win
            ? [
                { label: 'Next Chapter: Carpenter St. Kopitiam (RM 15,000 • Weekly) →', onclick: 'advanceToNextLevel(3)', style: 'primary' },
                { label: '🔄 Replay Level 2', onclick: 'replayCurrentLevel()', style: 'secondary' }
            ]
            : [
                { label: '🔄 Retry Level 2', onclick: 'replayCurrentLevel()', style: 'retry' }
            ]
    },
    retroPrompts: {
        well: [
            '📦 Applying the WBS 100% Rule decomposed the Siniawan stall cleanly and kept excluded wok equipment out of scope.',
            '⚡ Matching Uncle Lim, Kak Salmah, and Danny to their specialist skills with Rest breaks kept velocity high and prevented Burnout.'
        ],
        improve: [
            '🔗 Starting prerequisite tasks early (Timber Frame & Display Counter) avoids idle days on dependent tasks.',
            '☕ Scheduling Rest breaks before stamina drops below 35% protects multi-day execution velocity.'
        ]
    },
    intro: {
        tag: 'Chapter 2 • Community Expansion',
        emoji: '🏮',
        title: 'Siniawan Night Market Stall',
        place: 'Siniawan, Bau • Heritage Night Market',
        story: [
            'The <strong>Siniawan Heritage Committee</strong> hired your 3-artisan crew for a 5× larger night-market pavilion. Break every deliverable down so nothing is missed—and extras stay out.'
        ],
        stats: [['💰', 'Budget', 'RM 2,500'], ['📅', 'Time', '6 Days'], ['👥', 'Crew', '3 Artisans']],
        skillLabel: 'New skills',
        skills: [
            '📦 <strong>WBS 100% Rule:</strong> sort every deliverable into Work Packages—exclude out-of-scope traps.',
            '⚡ <strong>Specialists &amp; Rest:</strong> matching skills saves a full day; rest above 35% stamina.'
        ],
        carryTitle: '📜 Carried over from your signed Charter',
        carryFrom: (st) => {
            const c = (st && st.signedCharterSummary) || null;
            if (!c) return '';
            return `<div><strong>Objective:</strong> ${c.objective}</div><div><strong>Constraints:</strong> ${c.constraints}</div><div><strong>Out of scope:</strong> ${c.outOfScope}</div>`;
        },
        cta: 'Begin Chapter 2 🏮'
    },

    createState() {
        const rawWbsCards = [
            {
                id: 'wbs-c1',
                targetBucket: 'l2-wp-1',
                taskId: 'l2-t1',
                title: 'Cut & Lash Timber Frame',
                meta: 'Carpentry • RM 400 • 2 Days',
                desc: 'Cut and lash cured bamboo and belian timber poles for the multi-bay stall.'
            },
            {
                id: 'wbs-c2',
                targetBucket: 'l2-wp-1',
                taskId: 'l2-t2',
                title: 'Install Pitched Canopy Roof',
                meta: 'Carpentry • RM 380 • 2 Days',
                desc: 'Secure the weatherproof pitched canopy roof across the timber pavilion.'
            },
            {
                id: 'wbs-c3',
                targetBucket: 'l2-wp-2',
                taskId: 'l2-t3',
                title: 'Deliver Glass Display Counter',
                meta: 'Logistics • RM 420 • 2 Days',
                desc: 'Transport handcrafted wooden-framed glass display counters from Bau town.'
            },
            {
                id: 'wbs-c4',
                targetBucket: 'l2-wp-2',
                taskId: 'l2-t4',
                title: 'Arrange Kek Lapis & Teh Tarik Dispenser',
                meta: 'Culinary • RM 350 • 1 Day',
                desc: 'Arrange Kek Lapis, steamed pandan kuih trays, and twin brass Teh Tarik dispensers.'
            },
            {
                id: 'wbs-c5',
                targetBucket: 'l2-wp-3',
                taskId: 'l2-t5',
                title: 'String Night-Market Lanterns',
                meta: 'Logistics • RM 320 • 1 Day',
                desc: 'String warm red and gold heritage lanterns across the market street.'
            },
            {
                id: 'wbs-c6',
                targetBucket: 'l2-wp-3',
                taskId: 'l2-t6',
                title: 'Letter Wooden Menu Signage',
                meta: 'Culinary • RM 280 • 1 Day',
                desc: 'Hand-letter the evening festival menu items onto teak signboards.'
            },
            {
                id: 'wbs-trap-wok',
                targetBucket: 'outOfScope',
                taskId: null,
                title: 'Install Gas-Fired Wok & Exhaust Hood',
                meta: 'Excluded in Charter • Out of Scope',
                desc: 'Install a heavy gas-fired wok range and commercial exhaust hood in the pavilion.'
            }
        ];

        return {
            level: 2,
            subtitle: SUBTITLE,
            phase: 'wbs_build',
            day: 1,
            maxDays: 6,
            budget: 2500,
            initialBudget: 2500,
            contingencyReserve: 0,
            tarpBought: false,
            hasWeatherRisk: false,
            goodwillStars: 0,
            isExecuting: false,
            retroChoice: { wentWell: 0, toImprove: 0 },

            signedCharterSummary: {
                objective: 'Build a multi-bay Kek Lapis & Teh Tarik pavilion for Siniawan Night Market',
                constraints: 'RM 2,500 Budget • 6 Days Schedule',
                outOfScope: 'No Gas-Fired Wok Kitchen or Permanent Brick Plumbing'
            },

            selectedWbsCardId: null,
            bouncedWbsCardId: null,
            selectedAssignTaskId: null,
            clientRequestResolved: false,
            scopeDecisionOutcome: null,
            roofKitEventResolved: false,
            roofKitBought: false,
            acceptedScopeCreep: false,
            wbsBounceCount: 0,
            burnoutIncidents: 0,
            wbsAuthorized: false,
            wbsCards: scrambleStatements(rawWbsCards),
            wbsBuckets: {
                'l2-wp-1': { code: 'WBS 1.1', label: 'Timber Frame & Canopy', icon: '🎋', hint: 'Structural & roof deliverables', maxItems: 2, filledIds: [] },
                'l2-wp-2': { code: 'WBS 1.2', label: 'Serving Counter & Display', icon: '🥮', hint: 'Display & food setup tasks', maxItems: 2, filledIds: [] },
                'l2-wp-3': { code: 'WBS 1.3', label: 'Lighting & Signage', icon: '🏮', hint: 'Ambiance & menu tasks', maxItems: 2, filledIds: [] },
                'outOfScope': { code: 'EXCLUDED', label: 'Out of Scope (WBS 100% Rule)', icon: '🚧', hint: 'Items excluded by Charter', maxItems: 1, filledIds: [] }
            },

            workPackages: [
                { id: 'l2-wp-1', title: 'Timber Frame & Canopy', subtitle: '2 structural Tasks (2 days each)', icon: '🎋', decomposed: true, taskIds: ['l2-t1', 'l2-t2'] },
                { id: 'l2-wp-2', title: 'Serving Counter & Display', subtitle: '2 counter & culinary Tasks inside', icon: '🥮', decomposed: true, taskIds: ['l2-t3', 'l2-t4'] },
                { id: 'l2-wp-3', title: 'Lighting & Signage', subtitle: '2 finishing Tasks (1 day each)', icon: '🏮', decomposed: true, taskIds: ['l2-t5', 'l2-t6'] }
            ],

            tasks: [
                {
                    id: 'l2-t1', workPackageId: 'l2-wp-1', title: 'Cut & Lash Timber Frame',
                    cost: 400, effort: 2, skill: 'Carpentry', outdoor: false, deps: [],
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'cuts and lashes cured bamboo and belian timber poles for the stall frame'
                },
                {
                    id: 'l2-t2', workPackageId: 'l2-wp-1', title: 'Install Pitched Canopy Roof',
                    cost: 380, effort: 2, skill: 'Carpentry', outdoor: false, deps: ['l2-t1'],
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'secures the weatherproof canopy roof onto the timber posts'
                },
                {
                    id: 'l2-t3', workPackageId: 'l2-wp-2', title: 'Deliver Glass Display Counter',
                    cost: 420, effort: 2, skill: 'Logistics', outdoor: false, deps: [],
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'transports wooden-framed glass display cases from Bau town'
                },
                {
                    id: 'l2-t4', workPackageId: 'l2-wp-2', title: 'Arrange Kek Lapis & Teh Tarik Dispenser',
                    cost: 350, effort: 1, skill: 'Culinary', outdoor: false, deps: ['l2-t3'],
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'arranges Kek Lapis, steamed pandan kuih trays, and twin brass Teh Tarik dispensers'
                },
                {
                    id: 'l2-t5', workPackageId: 'l2-wp-3', title: 'String Night-Market Lanterns',
                    cost: 320, effort: 1, skill: 'Logistics', outdoor: false, deps: [],
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'strings warm red and gold lanterns across the market street'
                },
                {
                    id: 'l2-t6', workPackageId: 'l2-wp-3', title: 'Letter Wooden Menu Signage',
                    cost: 280, effort: 1, skill: 'Culinary', outdoor: false, deps: [],
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'hand-letters the evening festival menu items on the teak signage'
                }
            ],

            artisans: [
                { id: 'lim', name: 'Uncle Lim', role: 'Carpenter', skill: 'Carpentry', stamina: 100, assignedTaskId: null, resting: false },
                { id: 'salmah', name: 'Kak Salmah', role: 'Culinary', skill: 'Culinary', stamina: 100, assignedTaskId: null, resting: false },
                { id: 'danny', name: 'Danny', role: 'Logistics', skill: 'Logistics', stamina: 100, assignedTaskId: null, resting: false }
            ]
        };
    },

    isFinished(st) {
        return Array.isArray(st.tasks) && st.tasks.length > 0 && st.tasks.every(t => t.progress >= 100);
    },

    checkTurnEnd(st) {
        const allTasksDone = st.tasks.every(t => t.progress >= 100);
        if (allTasksDone) return { done: true, isVictory: true };
        if (st.day >= st.maxDays) return { done: true, isVictory: false };
        return { done: false };
    },

    getHudMetrics(st) {
        const doneCount = st.tasks.filter(t => t.progress >= 100).length;
        const totalCount = Math.max(1, st.tasks.length);
        const scopePct = Math.round((doneCount / totalCount) * 100);
        const daysLeft = Math.max(0, st.maxDays - st.day + 1);

        if (st.phase === 'wbs_build') {
            const totalWbsPlaced = Object.values(st.wbsBuckets).reduce((sum, b) => sum + b.filledIds.length, 0);
            const wbsLen = st.wbsCards.length;
            const tiltDeg = Math.round(((wbsLen - totalWbsPlaced) / wbsLen) * 10);
            const ready = totalWbsPlaced === wbsLen;
            return {
                dayText: `${daysLeft} ${daysLeft === 1 ? 'Day' : 'Days'} Left`,
                scopeText: `${totalWbsPlaced}/${wbsLen} WBS`,
                scopeProgressPct: Math.round((totalWbsPlaced / Math.max(1, wbsLen)) * 100),
                tiltDeg,
                statusText: ready ? 'WBS Ready to Approve' : `Decomposing WBS (${totalWbsPlaced}/${wbsLen})`,
                statusCls: ready ? 'font-semibold text-[#A7F3D0]' : 'font-semibold text-[#FDE68A]',
                jewelColor: ready ? '#34D399' : '#FBBF24',
                dioramaBadgeText: `WBS: ${totalWbsPlaced}/${wbsLen}`
            };
        }

        const remainingTasks = totalCount - doneCount;
        const workloadRatio = remainingTasks / Math.max(1, daysLeft);
        let tiltDeg = (workloadRatio - 1.2) * 8;
        if (st.budget < 400) tiltDeg += 4;
        tiltDeg = Math.round(Math.max(-14, Math.min(16, tiltDeg)));

        let statusText = 'Balanced & Steady';
        let statusCls = 'font-semibold text-[#A7F3D0]';
        let jewelColor = '#34D399';
        if (tiltDeg > 7) {
            statusText = 'Heavy Scope/Schedule Pressure';
            statusCls = 'font-semibold text-[#FECACA]';
            jewelColor = '#F87171';
        } else if (tiltDeg < -4) {
            statusText = 'Ahead of Schedule';
        }

        return {
            dayText: `${daysLeft} ${daysLeft === 1 ? 'Day' : 'Days'} Left`,
            scopeText: `${scopePct}% (${doneCount}/${totalCount})`,
            scopeProgressPct: scopePct,
            tiltDeg,
            statusText,
            statusCls,
            jewelColor,
            dioramaBadgeText: `Built: ${scopePct}%`
        };
    },

    renderContextBanner(st, expanded, { uiIcon }) {
        const chevronCls = `w-3.5 h-3.5 text-[#5C3A21] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`;
        return `
            <button type="button" onclick="toggleContextBanner()" class="w-full flex items-center justify-between gap-2 text-left cursor-pointer">
                <span class="flex items-center gap-1.5 min-w-0 ts-caption font-bold text-[#5C3A21] truncate">
                    ${uiIcon('scroll', 'w-3.5 h-3.5 text-[#C85A32] shrink-0')}
                    <span class="truncate">Approved Charter · ${st.signedCharterSummary.constraints}</span>
                </span>
                <span class="shrink-0 flex items-center gap-1 ts-micro font-bold text-[#7A5434]">
                    <span>${expanded ? 'Hide' : 'View'}</span>
                    ${uiIcon('chevronDown', chevronCls)}
                </span>
            </button>
            ${expanded ? `
                <div class="mt-1.5 pt-1.5 border-t border-[#8C6A4A]/35 ts-caption leading-snug space-y-0.5 animate-crisp-in">
                    <div class="text-[#241B15]"><strong>Objective:</strong> ${st.signedCharterSummary.objective}</div>
                    <div class="text-[#5A4D41]"><strong>Out of Scope:</strong> ${st.signedCharterSummary.outOfScope}</div>
                </div>
            ` : ''}
        `;
    },

    getDioramaTimeOfDay(st) {
        const allDone = st.tasks && st.tasks.length > 0 && st.tasks.every(t => t.progress >= 100);
        if (allDone) {
            return { label: 'Restoration Complete', skyTop: '#2D223C', skyBottom: '#C85A32', ambientTint: 'rgba(255, 196, 92, 0.14)' };
        }
        if (st.isExecuting) {
            return { label: `Workday ${st.day} of ${st.maxDays}`, skyTop: '#F3B45A', skyBottom: '#FCE5B4', ambientTint: 'rgba(246, 180, 68, 0.12)' };
        }
        if (st.phase === 'wbs_build') {
            return { label: 'Scope Planning (WBS)', skyTop: '#CFE8F3', skyBottom: '#FAF0D7', ambientTint: 'rgba(255, 250, 235, 0.04)' };
        }
        return { label: `Day ${st.day} of ${st.maxDays}`, skyTop: '#CFE8F3', skyBottom: '#FAF0D7', ambientTint: 'rgba(255, 250, 235, 0.04)' };
    },

    buildDioramaSVG(st) {
        const s1 = getTaskLayerState(st, 'l2-t1');
        const s2 = getTaskLayerState(st, 'l2-t2');
        const s3 = getTaskLayerState(st, 'l2-t3');
        const s4 = getTaskLayerState(st, 'l2-t4');
        const s5 = getTaskLayerState(st, 'l2-t5');
        const s6 = getTaskLayerState(st, 'l2-t6');

        const frameLayer = renderDioramaLayerWrapper(
            s1,
            `<ellipse cx="210" cy="157" rx="94" ry="6.5" fill="rgba(20, 12, 18, 0.35)"/>
            <rect x="128" y="108" width="164" height="46" rx="2.5" fill="url(#wood-warm)" stroke="#241B15" stroke-width="1.6"/>
            <path d="M134 116 H286 M134 125 H286 M134 134 H286 M134 143 H286" stroke="#684226" stroke-width="1.1" opacity="0.7"/>
            <rect x="130" y="54" width="7" height="100" rx="2" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1.4"/>
            <rect x="283" y="54" width="7" height="100" rx="2" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1.4"/>
            <path d="M130 62 L137 68 M137 62 L130 68 M283 62 L290 68 M290 62 L283 68" stroke="#3D2412" stroke-width="1.3"/>
            <rect x="124" y="104" width="172" height="6" rx="2" fill="#E3B96B" stroke="#241B15" stroke-width="1.4"/>`,
            `<rect x="128" y="108" width="164" height="46" rx="2.5" fill="rgba(255,253,249,0.18)" stroke="#F6D365" stroke-width="1.4" stroke-dasharray="4 3"/>
            <line x1="133.5" y1="54" x2="133.5" y2="154" stroke="#F6D365" stroke-width="1.6" stroke-dasharray="4 3"/>
            <line x1="286.5" y1="54" x2="286.5" y2="154" stroke="#F6D365" stroke-width="1.6" stroke-dasharray="4 3"/>`,
            { x: 210, y: 122 }
        );

        const canopyLayer = renderDioramaLayerWrapper(
            s2,
            `<path d="M112 58 L134 36 L286 36 L308 58 Z" fill="url(#roof-terra)" stroke="#241B15" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M134 36 L286 36" stroke="#F6D365" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M120 58 H300 V63 H120 Z" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1.1"/>`,
            `<path d="M112 58 L134 36 L286 36 L308 58 Z" fill="rgba(200,90,50,0.16)" stroke="#FCA5A5" stroke-width="1.4" stroke-dasharray="4 3"/>`,
            { x: 210, y: 46 }
        );

        const glassCaseLayer = renderDioramaLayerWrapper(
            s3,
            `<rect x="142" y="79" width="60" height="25" rx="2" fill="url(#glass-sheen)" stroke="#241B15" stroke-width="1.3"/>
            <line x1="142" y1="91.5" x2="202" y2="91.5" stroke="#5C3A21" stroke-width="1.2"/>
            <line x1="172" y1="79" x2="172" y2="104" stroke="#5C3A21" stroke-width="1.2"/>
            <line x1="148" y1="82" x2="156" y2="90" stroke="#FFFFFF" stroke-width="1.3" opacity="0.65" stroke-linecap="round"/>`,
            `<rect x="142" y="79" width="60" height="25" rx="2" fill="none" stroke="#93C5FD" stroke-width="1.4" stroke-dasharray="4 3"/>`,
            { x: 172, y: 90 }
        );

        const kuihLayer = renderDioramaLayerWrapper(
            s4,
            `<g>
                <rect x="147" y="83" width="20" height="2.2" fill="#EC4899"/>
                <rect x="147" y="85.2" width="20" height="2.2" fill="#FBBF24"/>
                <rect x="147" y="87.4" width="20" height="2.2" fill="#22C55E"/>
                <rect x="147" y="83" width="20" height="6.6" rx="1" fill="none" stroke="#241B15" stroke-width="0.8"/>
                <rect x="177" y="83" width="20" height="2.2" fill="#2E6F40"/>
                <rect x="177" y="85.2" width="20" height="2.2" fill="#FAF5EB"/>
                <rect x="177" y="87.4" width="20" height="2.2" fill="#C85A32"/>
                <rect x="177" y="83" width="20" height="6.6" rx="1" fill="none" stroke="#241B15" stroke-width="0.8"/>
                <rect x="147" y="95" width="20" height="6.2" rx="1" fill="#F59E0B" stroke="#241B15" stroke-width="0.8"/>
                <line x1="147" y1="98" x2="167" y2="98" stroke="#9E3514" stroke-width="1.3"/>
            </g>
            <rect x="214" y="80" width="18" height="24" rx="2.5" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1.3"/>
            <path d="M223 76 Q220 69 224 63" stroke="#FFFDF9" stroke-width="1.5" fill="none" stroke-linecap="round" class="diorama-steam"/>
            <circle cx="223" cy="96" r="2.2" fill="#C85A32" stroke="#241B15" stroke-width="0.8"/>`,
            `<rect x="214" y="80" width="18" height="24" rx="2.5" fill="none" stroke="#FDE68A" stroke-width="1.3" stroke-dasharray="3 3"/>`,
            { x: 223, y: 78 }
        );

        const lanternPositions = [
            { x: 46, y: 18, color: '#DC2626', glow: 'glow-red' },
            { x: 96, y: 24, color: '#F59E0B', glow: 'glow-gold' },
            { x: 162, y: 20, color: '#DC2626', glow: 'glow-red' },
            { x: 258, y: 20, color: '#F59E0B', glow: 'glow-gold' },
            { x: 324, y: 24, color: '#DC2626', glow: 'glow-red' },
            { x: 374, y: 18, color: '#F59E0B', glow: 'glow-gold' }
        ];
        const lanternLayer = renderDioramaLayerWrapper(
            s5,
            `<path d="M18 14 Q112 29 210 20 Q308 29 402 14" stroke="#241B15" stroke-width="1.4" fill="none"/>
            ${lanternPositions.map(l => `
                <g class="animate-lantern-sway">
                    <circle cx="${l.x}" cy="${l.y + 10}" r="18" fill="url(#${l.glow})"/>
                    <ellipse cx="${l.x}" cy="${l.y + 10}" rx="7.5" ry="9.5" fill="${l.color}" stroke="#241B15" stroke-width="1.1"/>
                    <rect x="${l.x - 3.5}" y="${l.y}" width="7" height="2.4" fill="#F6D365"/>
                    <line x1="${l.x}" y1="${l.y + 19.5}" x2="${l.x}" y2="${l.y + 24}" stroke="#F6D365" stroke-width="1.2"/>
                </g>
            `).join('')}
            <ellipse cx="96" cy="161" rx="22" ry="3.5" fill="rgba(251, 191, 36, 0.16)"/>
            <ellipse cx="324" cy="161" rx="22" ry="3.5" fill="rgba(220, 38, 38, 0.16)"/>`,
            `${lanternPositions.map(l => `
                <ellipse cx="${l.x}" cy="${l.y + 10}" rx="7.5" ry="9.5" fill="none" stroke="${l.color}" stroke-width="1.2" stroke-dasharray="3 2"/>
            `).join('')}`,
            { x: 324, y: 28 }
        );

        const menuBoardLayer = renderDioramaLayerWrapper(
            s6,
            `<rect x="246" y="76" width="33" height="28" rx="2.5" fill="#1F2E24" stroke="#5C3A21" stroke-width="1.8"/>
            <line x1="251" y1="83" x2="274" y2="83" stroke="#F6D365" stroke-width="1.5"/>
            <line x1="251" y1="89" x2="270" y2="89" stroke="#FFFDF9" stroke-width="1.2"/>
            <line x1="251" y1="95" x2="272" y2="95" stroke="#A7F3D0" stroke-width="1.2"/>
            <line x1="251" y1="100" x2="265" y2="100" stroke="#FDBA74" stroke-width="1.1"/>`,
            `<rect x="246" y="76" width="33" height="28" rx="2.5" fill="none" stroke="#86EFAC" stroke-width="1.4" stroke-dasharray="3 3"/>`,
            { x: 262, y: 88 }
        );

        return {
            backdrop: `
                <rect x="0" y="0" width="420" height="170" fill="#2A1D2D"/>
                <rect x="0" y="146" width="420" height="24" fill="#3C3330"/>
                <image href="assets/bg-l2-siniawan.jpg" x="0" y="0" width="420" height="170" preserveAspectRatio="xMidYMid slice"/>
            `,
            layers: frameLayer + canopyLayer + glassCaseLayer + kuihLayer + lanternLayer + menuBoardLayer,
            stationCoords: {
                'l2-t1': { x: 112, y: 154 },
                'l2-t2': { x: 130, y: 154 },
                'l2-t3': { x: 170, y: 154 },
                'l2-t4': { x: 226, y: 154 },
                'l2-t5': { x: 310, y: 154 },
                'l2-t6': { x: 266, y: 154 }
            },
            restSlots: [{ x: 52, y: 154 }, { x: 368, y: 154 }, { x: 82, y: 154 }]
        };
    },

    events: [
        {
            id: 'l2_client_request',
            sound: 'alertPop',
            check: (st) => st.day === 3 && !st.clientRequestResolved,
            buildModal: (st) => ({
                emojiHtml: getArtisanPortraitSVG('committee', 44),
                tag: 'Day 3 • Stakeholder Request',
                title: 'Siniawan Committee Visit',
                bodyHtml: `
                    ${renderCharterReferenceBox(st.signedCharterSummary)}
                    <div>
                        Committee visit: <em>“Before opening, please add <strong>bilingual price labels</strong> and <strong>food-safe sneeze guards</strong> for the Kek Lapis display. Materials cost <strong>RM 150</strong>, same 6-day deadline.”</em>
                    </div>
                `,
                actions: [
                    { id: 'accept', title: '1. Accept within plan (-RM 150)', desc: 'Cover RM 150 from spare budget; keep 6-day opening.', disabled: false },
                    { id: 'reject', title: '2. Decline — Out of Scope (RM 0)', desc: 'Finish the pavilion without price labels or sneeze guards.', disabled: false },
                    { id: 'backlog', title: '3. Defer to Phase 2 Backlog (RM 0)', desc: 'Log labels and hygiene guards for after opening night.', disabled: false },
                    { id: 'change_request', title: '4. Formal Change Order (+RM 150, +1 Day)', desc: 'Ask the committee to amend scope and extend deadline.', disabled: false }
                ]
            }),
            onResolve: (st, choice, api) => {
                api.sound.woodClick();
                st.clientRequestResolved = true;
                if (choice === 'accept') {
                    st.budget -= 150;
                    st.goodwillStars += 1;
                    st.scopeDecisionOutcome = 'in_scope_accepted';
                    api.showToast('✅ Accepted In-Scope usability (-RM 150, +1 Goodwill)', 'success');
                    api.updateGuidance('✅ <strong>Recognized as In-Scope!</strong> Bilingual labels &amp; food hygiene fit the approved stall Charter (-RM 150, +1 Goodwill).');
                } else if (choice === 'reject') {
                    st.goodwillStars -= 1;
                    st.scopeDecisionOutcome = 'in_scope_rejected';
                    api.showToast('⚠️ Declined an In-Scope requirement (-1 Goodwill)', 'warn');
                    api.updateGuidance('⚠️ <strong>Careful:</strong> Readable menus and food hygiene were part of delivering a working stall (In-Scope). Stakeholder trust dipped.');
                } else if (choice === 'backlog') {
                    st.goodwillStars -= 1;
                    st.scopeDecisionOutcome = 'in_scope_deferred';
                    api.showToast('⚠️ Deferred core hygiene & pricing (-1 Goodwill)', 'warn');
                    api.updateGuidance('⚠️ <strong>Careful:</strong> Food hygiene and clear pricing can’t wait until Phase 2! Check the Charter before deferring core usability.');
                } else {
                    st.budget -= 150;
                    st.scopeDecisionOutcome = 'in_scope_overformal';
                    api.showToast('📋 Committee pushed back: already In-Scope (-RM 150)', 'info');
                    api.updateGuidance('📋 <strong>Committee pushed back:</strong> Basic menu labels &amp; hygiene are already In-Scope, not a schedule change (-RM 150, no extra day).');
                }
            }
        },
        {
            id: 'l2_roof_kit',
            sound: 'alertPop',
            check: (st) => {
                const t2 = st.tasks.find(x => x.id === 'l2-t2');
                const t2Done = Boolean(t2 && t2.progress >= 100);
                return st.day === 4 && !st.roofKitEventResolved && !t2Done;
            },
            buildModal: (st, { uiIcon }) => {
                const unpaidCoreCost = st.tasks.filter(t => !t.paid).reduce((s, t) => s + t.cost, 0);
                const canAffordKit = (st.budget - unpaidCoreCost) >= 150;
                return {
                    emojiHtml: uiIcon('hammer', 'w-6 h-6 text-[#5C3A21]'),
                    tag: 'Day 4 • Schedule vs. Budget Trade-Off',
                    title: 'Bau Sawmill Pre-Cut Roof Offer',
                    bodyHtml: 'A Bau sawmill has a pre-cut canopy kit ready today: pay <strong>RM 150</strong> for <strong>+50% Canopy Roof progress</strong> (saves 1 day), or build manually at <strong>RM 0</strong>.',
                    actions: [
                        {
                            id: 'buy',
                            title: '1. Buy Pre-Cut Kit (-RM 150, +50% Roof)',
                            desc: canAffordKit ? 'Trade RM 150 spare budget to save 1 workday.' : 'Insufficient spare budget after reserving remaining Tasks.',
                            disabled: !canAffordKit
                        },
                        {
                            id: 'decline',
                            title: '2. Standard Manual Build (RM 0)',
                            desc: `Save RM ${st.budget.toLocaleString()} budget and frame the roof manually.`,
                            disabled: false
                        }
                    ]
                };
            },
            onResolve: (st, choice, api) => {
                api.sound.woodClick();
                st.roofKitEventResolved = true;
                const unpaidCoreCost = st.tasks.filter(t => !t.paid).reduce((s, t) => s + t.cost, 0);
                if (choice === 'buy' && (st.budget - unpaidCoreCost) >= 150) {
                    st.budget -= 150;
                    st.roofKitBought = true;
                    const t2 = st.tasks.find(t => t.id === 'l2-t2');
                    if (t2) {
                        t2.progress = Math.min(100, t2.progress + 50);
                        if (t2.progress >= 100 && t2.assignedArtisanId) {
                            const art = st.artisans.find(a => a.id === t2.assignedArtisanId);
                            if (art) art.assignedTaskId = null;
                            t2.assignedArtisanId = null;
                            t2.persisted = false;
                        }
                    }
                    api.showToast('🪚 Pre-Cut Roof Kit bought (-RM 150, +50% Canopy Roof)', 'info');
                    api.updateGuidance('🪚 <strong>Schedule Boosted!</strong> Bought Pre-Cut Roof Kit (-RM 150) — Canopy Roof jumped +50%.');
                } else {
                    api.showToast('💰 Standard manual framing chosen (RM 0)', 'info');
                    api.updateGuidance('💰 <strong>Budget Preserved!</strong> Kept RM 150 saved and stayed with standard roof framing.');
                }
            }
        }
    ],

    evaluateMastery(st, isVictory) {
        const c1 = Boolean(isVictory);
        const c2 = c1 && (st.burnoutIncidents || 0) === 0 && (st.wbsBounceCount || 0) <= 1;
        const c3 = c1 && st.scopeDecisionOutcome === 'in_scope_accepted' && st.budget >= 150 && (st.wbsBounceCount || 0) === 0 && (st.burnoutIncidents || 0) === 0;
        return {
            stars: (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0),
            criteria: [
                { met: c1, label: 'Complete 100% Scope (6/6 WBS Tasks) within 6 days' },
                { met: c2, label: `Zero team Burnout (${st.burnoutIncidents || 0} incidents) & ≤ 1 WBS bounce` },
                { met: c3, label: `Deliver In-Scope request, save ≥ RM 150 (RM ${st.budget.toLocaleString()} saved) & 0 WBS bounces` }
            ]
        };
    },

    getRetroScorecard(_st, isVictory, { scopePct, daysRemaining, totalSaved }) {
        return {
            budgetText: `RM ${totalSaved.toLocaleString()}`,
            timeLabel: 'Days Remaining',
            timeText: `${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'}`,
            qualityText: `${scopePct}% ${isVictory ? '✅' : '⚠️'}`
        };
    },

    buildFailureHints(st) {
        const done = st.tasks.filter(t => t.progress >= 100).length;
        const hints = [];
        const unfinished = st.tasks.filter(t => t.progress < 100);
        const notStarted = unfinished.filter(t => t.progress === 0);

        if (notStarted.length > 0) {
            const shown = notStarted.slice(0, 3).map(t => t.title);
            const names = notStarted.length > 3 ? [...shown, `+${notStarted.length - 3} more`] : shown;
            const blocked = notStarted.filter(t => (t.deps || []).length > 0);
            const waiting = blocked.length > 0
                ? ` Some of these wait on a prerequisite (for example, “${blocked[0].title}” needs “${(st.tasks.find(x => x.id === blocked[0].deps[0]) || {}).title || 'an earlier Task'}” first).`
                : '';
            hints.push({
                icon: '⛓️',
                title: `${notStarted.length} Task${notStarted.length > 1 ? 's' : ''} never started`,
                text: `Not started: ${names.join(', ')}.${waiting} Start the first link of each chain on Day 1, because a chain only moves as fast as its first Task.`
            });
        }

        if ((st.idleWithWorkCount || 0) > 0) {
            hints.push({
                icon: '😴',
                title: `Crew sat idle ${st.idleWithWorkCount} time${st.idleWithWorkCount > 1 ? 's' : ''} while work was ready`,
                text: 'Every unassigned artisan-day is lost capacity. If a Task is ready and someone is rested, tap Assign.'
            });
        }

        if ((st.burnoutIncidents || 0) > 0) {
            hints.push({
                icon: '🔥',
                title: `Burnout slowed the crew ${st.burnoutIncidents} time${st.burnoutIncidents > 1 ? 's' : ''}`,
                text: 'Artisans below 35% stamina work at half speed, and each workday costs 35%. Schedule a Rest Break before stamina drops too low, usually after two straight days.'
            });
        }

        if ((st.mismatchCount || 0) > 0) {
            hints.push({
                icon: '🎯',
                title: `${st.mismatchCount} assignment${st.mismatchCount > 1 ? 's' : ''} outside the specialist’s skill`,
                text: 'Specialists work at 100% speed while off-skill artisans work at 68% (adding an extra day): Carpentry → Uncle Lim, Culinary → Kak Salmah, Logistics → Danny.'
            });
        }

        if ((st.wbsBounceCount || 0) >= 2) {
            hints.push({
                icon: '📦',
                title: `${st.wbsBounceCount} cards were mapped to the wrong WBS slot`,
                text: 'Under the 100% Rule, every in-scope deliverable belongs in exactly one Work Package, and anything excluded by the Charter (like the gas wok kitchen) stays out.'
            });
        }

        if (hints.length === 0) {
            hints.push({
                icon: '🧭',
                title: 'Plan the longest chain first',
                text: 'Timber Frame → Canopy Roof is the longest chain of Tasks. Start it on Day 1 and keep Uncle Lim rested so it never stalls.'
            });
        }

        return {
            heading: `💡 What to try next time (${done}/${st.tasks.length} Tasks finished)`,
            hints: hints.slice(0, 3)
        };
    }
};
