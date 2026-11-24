// Chapter 3: Carpenter Street Kopitiam (Critical Path, Risk Mitigation & Change Control)
import { CRASH_COST, renderCharterReferenceBox } from '../core/constants.js';
import { getArtisanPortraitSVG, getTaskLayerState, renderDioramaLayerWrapper } from '../ui/artwork.js';

const SUBTITLE = 'Level 3 • Carpenter St. Kopitiam (RM 15,000 • 6 Wks)';

export const chapter3 = {
    id: 3,
    order: 3,
    shortLabel: 'L3 Control',
    title: 'Carpenter St. Kopitiam',
    domain: 'Monitoring & Control • Critical Path',
    emoji: '🏛️',
    backdrop: 'assets/bg-l3-carpenter.jpg',
    mode: 'predictive',
    subtitle: SUBTITLE,
    time: { unit: 'Week', units: 'Weeks', effort: ['Wk', 'Wks'], turn: 'Workweek', turnIcon: '🗓️', previous: 'last week' },
    lowBudgetThreshold: 2500,
    capabilities: {
        wbsDecompose: true,
        crashing: true,
        crashCost: CRASH_COST,
        wipLimit: null,
        qualityDefects: false,
        reworkCost: 0,
        reserveFund: true,
        monsoonWindow: true
    },
    exec: { icon: '🏛️', subtitle: 'Your crew is restoring the Carpenter Street shophouse...' },
    startGuidance: 'Decompose Work Packages, assign crew, and watch <strong>Critical Path</strong> links.',
    tutorial: {
        chapterLine: '🗓️ <strong>Ch 3 • Carpenter St. Kopitiam (RM 15,000 • 6 Weeks):</strong> Lead weekly <strong>Critical Path &amp; Control</strong>',
        lifecycleLine: '3️⃣ <strong>Level 3 • Weekly Schedule &amp; Control:</strong> Manage Dependencies, Critical Path, Monsoon Risk &amp; Change Requests.'
    },
    brief: {
        tag: 'Chapter 3 • Flagship Restoration (RM 15,000 • 6 Weeks)',
        title: 'Carpenter Street Pre-War Kopitiam',
        text: (st) => `Your Siniawan pavilion went viral! Now the Heritage Guild awards a 6-week commercial restoration. Lead weekly <strong>Critical Path</strong> work, guard your <strong>RM ${st.contingencyReserve.toLocaleString()} Reserve</strong>, and curb <strong>Scope Creep</strong>.`,
        counter: (st) => ({ text: `Week ${st.day}/${st.maxDays}`, cls: 'text-[#5C3A21]' })
    },
    retro: {
        phaseTag: () => '🏆 Chapter 3 Complete • Flagship Restoration',
        headline: (win, pct) => win ? 'Carpenter St. Kopitiam Restored! 🎉' : `6-Week Schedule Ended (${pct}% Scope Done)`,
        sub: (win) => win
            ? 'From a RM 500 coffee cart to a RM 15,000 heritage kopitiam—you mastered weekly Critical Path, Risk Mitigation, and Change Control!'
            : 'Review Critical Path Dependencies, weekly stamina, and Schedule Crashing in your Project Retrospective below.',
        badge: (win) => ({
            icon: '🏅',
            title: win ? 'Certified Project Management Master' : 'Critical Path & Control Practitioner',
            desc: win
                ? 'Mastered the end-to-end Project Management lifecycle: Project Charter, WBS, weekly Critical Path, Risk Mitigation, Change Control, and Project Retrospective.'
                : 'Prioritizing Critical Path prerequisites first unlocks downstream Dependencies before the final week.'
        }),
        actions: (win) => win
            ? [
                { label: 'Next Chapter: Borneo Rainforest Eco-Lodge (RM 28,000 • Risk) →', onclick: 'advanceToNextLevel(4)', style: 'primary' },
                { label: '🔄 Replay Level 3', onclick: 'replayCurrentLevel()', style: 'secondary' }
            ]
            : [
                { label: '🔄 Retry Level 3', onclick: 'replayCurrentLevel()', style: 'retry' }
            ]
    },
    retroPrompts: {
        well: [
            '🔥 Prioritizing Critical Path tasks first kept the Carpenter St. Kopitiam restoration on track across all 6 weeks.',
            '🛡️ Guarding the Contingency Reserve and using Change Control / Phase 2 Backlog prevented unbudgeted Scope Creep.'
        ],
        improve: [
            '🌧️ Deploying Contingency Reserve tarps before heavy monsoon weeks protects outdoor carpentry from delays.',
            '⚡ Using Schedule Crashing selectively on Critical Path bottlenecks recovers time without exhausting the crew.'
        ]
    },
    intro: {
        tag: 'Chapter 3 • Flagship Restoration',
        emoji: '🏛️',
        title: 'Carpenter Street Kopitiam',
        place: 'Kuching • Carpenter Street Pre-War Shophouse',
        story: [
            'The <strong>Carpenter Street Heritage Guild</strong> wants a pre-war kopitiam restored in <strong>6 weeks</strong>. Manage task dependencies, monsoon weather, and stakeholder requests.'
        ],
        stats: [['💰', 'Budget', 'RM 15,000'], ['📅', 'Time', '6 Weeks'], ['🛟', 'Reserve', 'RM 2,000']],
        skillLabel: 'New skills',
        skills: [
            '🔗 <strong>Critical Path:</strong> finish prerequisite tasks first to unlock downstream work.',
            '🛟 <strong>Reserve &amp; Monsoon Risk:</strong> spend RM 2,000 reserve wisely to avoid weather delays.',
            '⏩ <strong>Change Control &amp; Crashing:</strong> protect scope or trade money/stamina for speed.'
        ],
        carryTitle: '',
        carryFrom: () => '',
        cta: 'Begin Chapter 3 🏛️'
    },

    createState() {
        return {
            level: 3,
            subtitle: SUBTITLE,
            phase: 'execution',
            day: 1,
            maxDays: 6,
            budget: 15000,
            initialBudget: 15000,
            contingencyReserve: 2000,
            tarpBought: false,
            hasWeatherRisk: true,
            weatherRiskResolved: false,
            goodwillStars: 0,
            burnoutIncidents: 0,
            crashCount: 0,
            isExecuting: false,
            retroChoice: { wentWell: 0, toImprove: 0 },

            signedCharterSummary: {
                objective: 'Restore Carpenter St. pre-war shophouse facade, Peranakan kopi bar, rattan dining hall & heritage signboard',
                constraints: 'RM 15,000 Operating Budget (+RM 2,000 Reserve) • 6 Weeks Schedule',
                outOfScope: 'No street-side performance stage, road closures, or second-floor hotel rooms'
            },

            selectedAssignTaskId: null,
            clientRequestResolved: false,
            scopeDecisionOutcome: null,
            acceptedScopeCreep: false,
            monsoonHitCount: 0,

            workPackages: [
                { id: 'wp-structural', title: 'Shophouse Facade & Shutters', subtitle: '2 dependent exterior trade Tasks inside', icon: '🪟', decomposed: false, taskIds: ['t1', 't2'] },
                { id: 'wp-interior', title: 'Peranakan Counter & Brewing', subtitle: '2 dependent interior fit-out Tasks inside', icon: '☕', decomposed: false, taskIds: ['t3', 't4'] },
                { id: 'wp-furnishings', title: 'Dining Hall & Heritage Signboard', subtitle: '2 completion Tasks inside', icon: '🪧', decomposed: true, taskIds: ['t5', 't6'] }
            ],

            tasks: [
                {
                    id: 't1', crashed: false, workPackageId: 'wp-structural', title: 'Sand & Refinish Heritage Shutters',
                    cost: 2200, effort: 2, skill: 'Carpentry', outdoor: true, deps: [], critical: true,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'restores and refinishes the two-storey louvered belian shutters'
                },
                {
                    id: 't2', crashed: false, workPackageId: 'wp-structural', title: 'Install Bamboo Verandah Sunshade',
                    cost: 2400, effort: 1, skill: 'Carpentry', outdoor: true, deps: ['t1'], critical: true,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'mounts the woven split-bamboo sunshade across the shophouse frontage'
                },
                {
                    id: 't3', crashed: false, workPackageId: 'wp-interior', title: 'Tile Peranakan Kopi Counter',
                    cost: 3200, effort: 1, skill: 'Culinary', outdoor: false, deps: [], critical: false,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'lays hand-glazed Peranakan mosaic tiles across the marble kopi bar'
                },
                {
                    id: 't4', crashed: false, workPackageId: 'wp-interior', title: 'Calibrate Brass Kopi & Espresso Station',
                    cost: 2500, effort: 1, skill: 'Culinary', outdoor: false, deps: ['t3'], critical: false,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'installs and calibrates the commercial brass kopi boiler and espresso bar'
                },
                {
                    id: 't5', crashed: false, workPackageId: 'wp-furnishings', title: 'Deliver Serian Rattan Seating',
                    cost: 2400, effort: 1, skill: 'Logistics', outdoor: false, deps: [], critical: false,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'delivers handwoven Serian rattan dining sets and marble-top tables'
                },
                {
                    id: 't6', crashed: false, workPackageId: 'wp-furnishings', title: 'Hang Gilded Signboard & Final Inspection',
                    cost: 1400, effort: 1, skill: 'Carpentry', outdoor: true, deps: ['t2', 't4'], critical: true,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'hoists the gilded Kopitiam signboard and completes Heritage Guild sign-off'
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
        const remainingTasks = totalCount - doneCount;
        const workloadRatio = remainingTasks / Math.max(1, daysLeft);
        let tiltDeg = (workloadRatio - 1.2) * 8;
        if (st.budget < 2500) tiltDeg += 4;
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
            dayText: `${daysLeft} ${daysLeft === 1 ? 'Week' : 'Weeks'} Left`,
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
                    ${uiIcon('shield', 'w-3.5 h-3.5 text-[#2E6F40] shrink-0')}
                    <span class="truncate">Reserve: RM ${st.contingencyReserve.toLocaleString()} · Approved Charter</span>
                </span>
                <span class="shrink-0 flex items-center gap-1.5">
                    <span class="px-1.5 py-0.5 rounded ${st.tarpBought ? 'bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/40' : 'bg-[#C58F2A]/15 text-[#7A5404] border border-[#C58F2A]/40'} ts-micro font-bold">
                        ${st.tarpBought ? '✓ Mitigated' : 'Active'}
                    </span>
                    ${uiIcon('chevronDown', chevronCls)}
                </span>
            </button>
            ${expanded ? `
                <div class="mt-1.5 pt-1.5 border-t border-[#8C6A4A]/35 ts-micro text-[#3D2412] leading-snug space-y-0.5 animate-crisp-in">
                    <div>${st.tarpBought ? 'Heavy-duty tarps deployed — outdoor work sheltered from rain.' : 'Dedicated Contingency Reserve for unforeseen site risks & weather mitigation.'}</div>
                    <div><strong>Approved Charter:</strong> ${st.signedCharterSummary.objective}</div>
                    <div><strong>Out of Scope:</strong> ${st.signedCharterSummary.outOfScope}</div>
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
            return { label: `Workweek ${st.day} of ${st.maxDays}`, skyTop: '#F3B45A', skyBottom: '#FCE5B4', ambientTint: 'rgba(246, 180, 68, 0.12)' };
        }
        return { label: `Week ${st.day} of ${st.maxDays}`, skyTop: '#CFE8F3', skyBottom: '#FAF0D7', ambientTint: 'rgba(255, 250, 235, 0.04)' };
    },

    buildDioramaSVG(st) {
        const s1 = getTaskLayerState(st, 't1');
        const s2 = getTaskLayerState(st, 't2');
        const s3 = getTaskLayerState(st, 't3');
        const s4 = getTaskLayerState(st, 't4');
        const s5 = getTaskLayerState(st, 't5');
        const s6 = getTaskLayerState(st, 't6');
        const hasStage = st.tasks.some(t => t.id === 't-stage');
        const sStage = hasStage ? getTaskLayerState(st, 't-stage') : null;
        const isMonsoonActive = Boolean(st.hasWeatherRisk && (st.day === 3 || st.day === 4));

        const shuttersLayer = renderDioramaLayerWrapper(
            s1,
            `<rect x="38" y="45" width="54" height="58" rx="2" fill="#2E6F40" stroke="#241B15" stroke-width="1.6"/>
            <line x1="65" y1="45" x2="65" y2="103" stroke="#241B15" stroke-width="1.4"/>
            <path d="M43 54 H60 M43 61 H60 M43 68 H60 M43 75 H60 M43 82 H60 M43 89 H60 M70 54 H87 M70 61 H87 M70 68 H87 M70 75 H87 M70 82 H87 M70 89 H87" stroke="#A7F3D0" stroke-width="1.3"/>
            <rect x="36" y="54" width="3" height="6" fill="#C58F2A"/>
            <rect x="36" y="88" width="3" height="6" fill="#C58F2A"/>
            <rect x="102" y="45" width="26" height="46" rx="2" fill="#9E2A2B" stroke="#241B15" stroke-width="1.4"/>
            <path d="M107 53 L115 61 L123 53 M107 68 L115 76 L123 68 M107 82 L115 88 L123 82" stroke="#F6D365" stroke-width="1.5" fill="none"/>`,
            `<rect x="38" y="45" width="54" height="58" rx="2" fill="rgba(255,253,249,0.35)" stroke="#2B5783" stroke-width="1.4" stroke-dasharray="4 3"/>
            <rect x="102" y="45" width="26" height="46" rx="2" fill="none" stroke="#2B5783" stroke-width="1.3" stroke-dasharray="3 3"/>`,
            { x: 65, y: 74 }
        );

        const awningLayer = renderDioramaLayerWrapper(
            s2,
            `<path d="M238 44 L384 44 L392 60 L230 60 Z" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M252 44 L249 60 M272 44 L270 60 M292 44 L291 60 M312 44 L312 60 M332 44 L333 60 M352 44 L354 60 M372 44 L375 60" stroke="#5C3A21" stroke-width="1.2"/>
            <path d="M230 60 L392 60 L392 63 L230 63 Z" fill="#5C3A21" opacity="0.25"/>`,
            `<path d="M238 44 L384 44 L392 60 L230 60 Z" fill="none" stroke="#8C6106" stroke-width="1.4" stroke-dasharray="4 3"/>`,
            { x: 312, y: 50 }
        );

        const counterLayer = renderDioramaLayerWrapper(
            s3,
            `<ellipse cx="312" cy="156" rx="72" ry="5" fill="rgba(36, 27, 21, 0.25)"/>
            <rect x="246" y="104" width="132" height="48" rx="2.5" fill="#E6F4EA" stroke="#241B15" stroke-width="1.6"/>
            <rect x="242" y="99" width="140" height="6" rx="2" fill="url(#wood-teak)" stroke="#241B15" stroke-width="1.4"/>
            <path d="M246 120 H378 M246 136 H378 M272 104 V152 M298 104 V152 M324 104 V152 M350 104 V152" stroke="#2E6F40" stroke-width="1.1"/>
            ${[259, 285, 311, 337, 363].map((cx, i) => `
                <polygon points="${cx},108 ${cx + 5},112 ${cx},116 ${cx - 5},112" fill="${i % 2 === 0 ? '#C85A32' : '#C58F2A'}"/>
                <polygon points="${cx},124 ${cx + 5},128 ${cx},132 ${cx - 5},128" fill="${i % 2 === 0 ? '#2E6F40' : '#C85A32'}"/>
            `).join('')}`,
            `<rect x="246" y="104" width="132" height="48" rx="2.5" fill="rgba(255,253,249,0.4)" stroke="#2E6F40" stroke-width="1.4" stroke-dasharray="4 3"/>`,
            { x: 312, y: 122 }
        );

        const brewStationLayer = renderDioramaLayerWrapper(
            s4,
            `<rect x="258" y="77" width="24" height="22" rx="2.5" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1.3"/>
            <path d="M282 83 L291 77" stroke="#C58F2A" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M266 74 Q263 66 267 59" stroke="#FFFDF9" stroke-width="1.6" fill="none" stroke-linecap="round" class="diorama-steam"/>
            <path d="M274 75 Q277 67 273 60" stroke="#FFFDF9" stroke-width="1.6" fill="none" stroke-linecap="round" class="diorama-steam-delay"/>
            <rect x="298" y="91" width="8" height="8" rx="1.2" fill="#FFFDF9" stroke="#241B15" stroke-width="1.1"/>
            <line x1="298" y1="95" x2="306" y2="95" stroke="#2E6F40" stroke-width="1.2"/>
            <rect x="311" y="91" width="8" height="8" rx="1.2" fill="#FFFDF9" stroke="#241B15" stroke-width="1.1"/>
            <line x1="311" y1="95" x2="319" y2="95" stroke="#2E6F40" stroke-width="1.2"/>
            <rect x="330" y="88" width="28" height="11" rx="2" fill="#FCE7F3" stroke="#241B15" stroke-width="1.2"/>
            <line x1="330" y1="93.5" x2="358" y2="93.5" stroke="#2E6F40" stroke-width="1.8"/>`,
            `<rect x="258" y="77" width="24" height="22" rx="2.5" fill="none" stroke="#C85A32" stroke-width="1.3" stroke-dasharray="3 3"/>
            <rect x="330" y="88" width="28" height="11" rx="2" fill="none" stroke="#C85A32" stroke-width="1.3" stroke-dasharray="3 3"/>`,
            { x: 270, y: 76 }
        );

        const seatingLayer = renderDioramaLayerWrapper(
            s5,
            `<ellipse cx="176" cy="155" rx="34" ry="5" fill="rgba(36, 27, 21, 0.25)"/>
            <ellipse cx="176" cy="126" rx="20" ry="5" fill="#FFFDF9" stroke="#241B15" stroke-width="1.4"/>
            <line x1="176" y1="131" x2="176" y2="152" stroke="#3D2412" stroke-width="2.6"/>
            <line x1="166" y1="152" x2="186" y2="152" stroke="#3D2412" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M148 118 Q148 109 156 109 L156 133 L146 133 Z" fill="#C48B45" stroke="#241B15" stroke-width="1.3"/>
            <line x1="147" y1="133" x2="146" y2="152" stroke="#3D2412" stroke-width="1.6"/>
            <line x1="155" y1="133" x2="156" y2="152" stroke="#3D2412" stroke-width="1.6"/>
            <path d="M204 118 Q204 109 196 109 L196 133 L206 133 Z" fill="#C48B45" stroke="#241B15" stroke-width="1.3"/>
            <line x1="197" y1="133" x2="196" y2="152" stroke="#3D2412" stroke-width="1.6"/>
            <line x1="205" y1="133" x2="206" y2="152" stroke="#3D2412" stroke-width="1.6"/>`,
            `<ellipse cx="176" cy="126" rx="20" ry="5" fill="none" stroke="#5C3A21" stroke-width="1.3" stroke-dasharray="3 3"/>
            <rect x="146" y="112" width="10" height="38" fill="none" stroke="#5C3A21" stroke-width="1.2" stroke-dasharray="2 2"/>
            <rect x="196" y="112" width="10" height="38" fill="none" stroke="#5C3A21" stroke-width="1.2" stroke-dasharray="2 2"/>`,
            { x: 176, y: 118 }
        );

        const signboardLayer = renderDioramaLayerWrapper(
            s6,
            `<rect x="134" y="9" width="152" height="23" rx="4" fill="#3D2412" stroke="#C58F2A" stroke-width="2"/>
            <circle cx="141" cy="20.5" r="2.2" fill="#F6D365"/>
            <circle cx="279" cy="20.5" r="2.2" fill="#F6D365"/>
            <text x="210" y="23.5" text-anchor="middle" fill="#F6D365" font-family="Fraunces, serif" font-weight="700" font-size="9" letter-spacing="0.7">CARPENTER ST. KOPITIAM</text>`,
            `<rect x="134" y="9" width="152" height="23" rx="4" fill="rgba(61,36,18,0.2)" stroke="#C58F2A" stroke-width="1.4" stroke-dasharray="4 3"/>`,
            { x: 210, y: 20 }
        );

        const stageLayer = hasStage ? renderDioramaLayerWrapper(
            sStage,
            `<rect x="40" y="136" width="84" height="16" rx="2.5" fill="url(#wood-teak)" stroke="#241B15" stroke-width="1.4"/>
            <line x1="82" y1="116" x2="82" y2="136" stroke="#241B15" stroke-width="1.5"/>
            <circle cx="82" cy="114" r="3" fill="#C58F2A" stroke="#241B15" stroke-width="1"/>
            <rect x="48" y="10" width="66" height="17" rx="3" fill="#3D2412" stroke="#C58F2A" stroke-width="1.5"/>
            <text x="81" y="21" text-anchor="middle" fill="#F6D365" font-size="7" font-weight="700">STAGE</text>`,
            `<rect x="40" y="136" width="84" height="16" rx="2.5" fill="none" stroke="#C85A32" stroke-width="1.3" stroke-dasharray="3 3"/>`,
            { x: 82, y: 128 }
        ) : '';

        const tarpLayer = st.tarpBought ? `
            <g id="diorama-tarp-layer" class="diorama-layer-done">
                <path d="M22 36 Q210 26 398 36 L406 50 Q210 43 14 50 Z" fill="#2E6F40" fill-opacity="0.88" stroke="#1B4226" stroke-width="1.5"/>
                <path d="M54 35 L48 50 M114 32 L110 48 M174 30 L172 47 M246 30 L248 47 M306 32 L310 48 M366 35 L372 50" stroke="#1B4226" stroke-width="1" opacity="0.55"/>
                <line x1="16" y1="50" x2="6" y2="72" stroke="#D9A76A" stroke-width="1.2" stroke-dasharray="2 2"/>
                <line x1="404" y1="50" x2="414" y2="72" stroke="#D9A76A" stroke-width="1.2" stroke-dasharray="2 2"/>
                <circle cx="24" cy="48" r="2" fill="#F6D365"/>
                <circle cx="210" cy="43" r="2" fill="#F6D365"/>
                <circle cx="396" cy="48" r="2" fill="#F6D365"/>
            </g>
        ` : '';

        const rainDrops = [34, 68, 102, 144, 186, 224, 266, 304, 344, 384];
        const monsoonLayer = isMonsoonActive ? `
            <g id="monsoon-rain-layer" pointer-events="none">
                <rect x="0" y="0" width="420" height="170" fill="rgba(30, 58, 95, 0.22)"/>
                <g class="animate-rain" stroke="#BAE6FD" stroke-width="1.2" stroke-linecap="round" opacity="0.7">
                    ${rainDrops.map((rx, idx) => `<line x1="${rx}" y1="${(idx % 3) * 18}" x2="${rx - 10}" y2="${(idx % 3) * 18 + 20}"/>`).join('')}
                </g>
                <g class="animate-rain-delay" stroke="#E0F2FE" stroke-width="1.1" stroke-linecap="round" opacity="0.55">
                    ${rainDrops.map((rx, idx) => `<line x1="${rx + 18}" y1="${((idx + 1) % 3) * 20 + 60}" x2="${rx + 8}" y2="${((idx + 1) % 3) * 20 + 80}"/>`).join('')}
                </g>
            </g>
        ` : '';

        return {
            backdrop: `
                <rect x="0" y="0" width="420" height="170" fill="url(#diorama-sky)"/>
                <rect x="16" y="14" width="388" height="134" fill="#F7ECD7" stroke="#5C3A21" stroke-width="1.4"/>
                <rect x="0" y="148" width="420" height="22" fill="#A84A2C"/>
                <image href="assets/bg-l3-carpenter.jpg" x="0" y="0" width="420" height="170" preserveAspectRatio="xMidYMid slice"/>
                <rect x="0" y="148" width="420" height="22" fill="rgba(61, 36, 18, 0.14)" pointer-events="none"/>
            `,
            layers: shuttersLayer + awningLayer + counterLayer + brewStationLayer + seatingLayer + signboardLayer + stageLayer + tarpLayer + monsoonLayer,
            stationCoords: {
                't1': { x: 66, y: 152 },
                't2': { x: 366, y: 152 },
                't3': { x: 282, y: 152 },
                't4': { x: 324, y: 152 },
                't5': { x: 175, y: 152 },
                't6': { x: 210, y: 152 },
                't-stage': { x: 84, y: 138 }
            },
            restSlots: [{ x: 110, y: 152 }, { x: 215, y: 152 }, { x: 392, y: 152 }]
        };
    },

    events: [
        {
            id: 'l3_scope_creep',
            sound: 'alertPop',
            check: (st) => st.day === 2 && !st.clientRequestResolved,
            buildModal: (st) => ({
                emojiHtml: getArtisanPortraitSVG('committee', 44),
                tag: 'Week 2 • Stakeholder Request',
                title: 'Neighborhood Committee Request',
                bodyHtml: `
                    ${renderCharterReferenceBox(st.signedCharterSummary)}
                    <div>
                        Neighborhood Committee asks: <em>“Since your crew is on-site, can you also add a <strong>street-side acoustic stage</strong> for opening night? Ideally within your existing budget and Week 6 deadline—unless a formal guild amendment is required.”</em>
                    </div>
                `,
                actions: [
                    { id: 'accept_free', title: '1. Accept within current plan (RM 0, Week 6)', desc: 'Squeeze the acoustic stage into the active build using current budget and time.', disabled: false },
                    { id: 'reject', title: '2. Decline politely — Out of Scope', desc: 'Point to the approved Charter boundary and keep focus on the kopitiam.', disabled: false },
                    { id: 'backlog', title: '3. Defer to Phase 2 Backlog', desc: 'Log the stage for Phase 2 so Scope and Week 6 stay intact.', disabled: false },
                    { id: 'change_request', title: '4. Formal Change Request (+RM 2,000, +1 Wk)', desc: 'Re-baseline Budget, Schedule, and Scope (+RM 2,000, +1 Wk, +1 Stage task).', disabled: false }
                ]
            }),
            onResolve: (st, choice, api) => {
                api.sound.woodClick();
                st.clientRequestResolved = true;
                if (choice === 'accept_free') {
                    st.acceptedScopeCreep = true;
                    st.scopeDecisionOutcome = 'creep_accepted';
                    st.tasks.push({
                        id: 't-stage', crashed: false, workPackageId: 'wp-furnishings',
                        title: 'Build Acoustic Stage (Unfunded Addition)',
                        cost: 800, effort: 1, skill: 'Carpentry', outdoor: true, deps: ['t1'], critical: false,
                        progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                        flavor: 'constructs the unbudgeted acoustic stage using operating funds'
                    });
                    const wpFurn = st.workPackages.find(w => w.id === 'wp-furnishings');
                    if (wpFurn && !wpFurn.taskIds.includes('t-stage')) wpFurn.taskIds.push('t-stage');
                    api.showToast('⚠️ Scope Creep! Added unfunded Stage (-RM 800, +0 Weeks)', 'warn');
                    api.updateGuidance('⚠️ <strong>Uncontrolled Scope Creep!</strong> Added the Acoustic Stage (-RM 800 from operating budget, +0 Weeks) despite the Charter exclusion.');
                } else if (choice === 'reject') {
                    st.scopeDecisionOutcome = 'rejected';
                    api.showToast('🛡️ Scope Protected — Out of Scope!', 'success');
                    api.updateGuidance('🛡️ <strong>Scope Protected!</strong> Cited the Charter exclusion to decline the unbudgeted stage.');
                } else if (choice === 'backlog') {
                    st.goodwillStars += 1;
                    st.scopeDecisionOutcome = 'backlog';
                    api.showToast('📋 Logged in Phase 2 Backlog (+1 Goodwill)!', 'success');
                    api.updateGuidance('📋 <strong>Logged in Phase 2 Backlog!</strong> Protected Week 6 while keeping stakeholders heard (+1 Goodwill).');
                } else if (choice === 'change_request') {
                    st.budget += 2000;
                    st.maxDays += 1;
                    st.goodwillStars += 1;
                    st.scopeDecisionOutcome = 'change_request';
                    st.tasks.push({
                        id: 't-stage', crashed: false, workPackageId: 'wp-furnishings',
                        title: 'Build Acoustic Stage (Change Request)',
                        cost: 2000, effort: 1, skill: 'Carpentry', outdoor: true, deps: ['t1'], critical: false,
                        progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                        flavor: 'constructs the approved acoustic stage using the re-baselined budget'
                    });
                    const wpFurn = st.workPackages.find(w => w.id === 'wp-furnishings');
                    if (wpFurn && !wpFurn.taskIds.includes('t-stage')) wpFurn.taskIds.push('t-stage');
                    api.showToast('⚖️ Formal Change Request Approved (+RM 2,000, +1 Week, +1 Goodwill)', 'info');
                    api.updateGuidance('⚖️ <strong>Formal Change Request Approved!</strong> Re-baselined Budget (+RM 2,000), Schedule (+1 Week), and Scope (+1 Goodwill).');
                }
            }
        },
        {
            id: 'l3_weather_risk',
            sound: 'alertPop',
            check: (st) => st.day === 3 && !st.weatherRiskResolved,
            buildModal: (st, { uiIcon }) => {
                const canAffordTarp = st.contingencyReserve >= 1200;
                return {
                    emojiHtml: uiIcon('rain', 'w-6 h-6 text-[#1E4063]'),
                    tag: 'Week 3 • Risk Forecast',
                    title: 'Monsoon Rain Forecast',
                    bodyHtml: `Monsoon squalls hit in <strong>Weeks 3–4</strong>! Unprotected outdoor Carpentry risks losing a full week. Contingency Reserve: <strong>RM ${st.contingencyReserve.toLocaleString()}</strong>.`,
                    actions: [
                        {
                            id: 'mitigate',
                            title: '1. Mitigate: Deploy Heavy-Duty Tarps (-RM 1,200 Reserve)',
                            desc: 'Shelter all outdoor work across Weeks 3–4 (0 rain delay).',
                            disabled: !canAffordTarp
                        },
                        {
                            id: 'accept',
                            title: '2. Absorb Risk (RM 0 Reserve)',
                            desc: 'Keep Reserve intact and accept weather delay risk in Weeks 3–4.',
                            disabled: false
                        }
                    ]
                };
            },
            onResolve: (st, choice, api) => {
                api.sound.brassBalance();
                st.weatherRiskResolved = true;
                if (choice === 'mitigate' && st.contingencyReserve >= 1200) {
                    st.contingencyReserve -= 1200;
                    st.tarpBought = true;
                    api.showToast('🛡️ Heavy-duty tarps deployed (-RM 1,200 Reserve)', 'success');
                    api.updateGuidance('🛡️ <strong>Risk Mitigation Active!</strong> Heavy-duty tarps deployed (-RM 1,200 Contingency Reserve). Outdoor tasks have 0 rain delay.');
                } else {
                    api.showToast('🎲 Risk absorbed — watch outdoor tasks in Weeks 3–4!', 'warn');
                    api.updateGuidance('🎲 <strong>Risk Absorbed!</strong> Tap <strong>Assign</strong> for Week 3—outdoor work faces rain delay risk across Weeks 3–4.');
                }
            }
        }
    ],

    evaluateMastery(st, isVictory, daysRemaining, totalSaved) {
        const c1 = Boolean(isVictory);
        const c2 = c1 && (st.burnoutIncidents || 0) === 0 && !st.acceptedScopeCreep;
        const c3 = c2 && daysRemaining >= 1 && totalSaved >= 1500;
        return {
            stars: (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0),
            criteria: [
                { met: c1, label: 'Complete 100% Scope within schedule & budget' },
                { met: c2, label: `Zero team Burnout (${st.burnoutIncidents || 0} incidents) & no unbudgeted Scope Creep` },
                { met: c3, label: `Finish ≥ 1 Week early (${daysRemaining}w left) with ≥ RM 1,500 saved (RM ${totalSaved.toLocaleString()})` }
            ]
        };
    },

    getRetroScorecard(_st, isVictory, { scopePct, daysRemaining, totalSaved }) {
        return {
            budgetText: `RM ${totalSaved.toLocaleString()}`,
            timeLabel: 'Weeks Remaining',
            timeText: `${daysRemaining} ${daysRemaining === 1 ? 'Week' : 'Weeks'}`,
            qualityText: `${scopePct}% ${isVictory ? '✅' : '⚠️'}`
        };
    },

    buildFailureHints(st) {
        const done = st.tasks.filter(t => t.progress >= 100).length;
        const hints = [];

        if (st.acceptedScopeCreep) {
            hints.push({
                icon: '🚧',
                title: 'Unbudgeted Scope Creep added extra work',
                text: 'The street-side acoustic stage was outside the approved Charter. Defer it to Phase 2 Backlog or negotiate a formal Change Request (+RM 2,000, +1 Week).'
            });
        }

        if ((st.monsoonHitCount || 0) > 0 && !st.tarpBought) {
            hints.push({
                icon: '🌧️',
                title: `Monsoon rain delayed outdoor work ${st.monsoonHitCount} week${st.monsoonHitCount > 1 ? 's' : ''}`,
                text: 'Deploy Heavy-Duty Tarps (-RM 1,200 from your RM 2,000 Contingency Reserve) in Week 3 to protect Heritage Shutters, Sunshade & Signboard during Weeks 3–4.'
            });
        }

        const unfinishedCritical = st.tasks.filter(t => t.critical && t.progress < 100);
        if (unfinishedCritical.length > 0) {
            hints.push({
                icon: '🔥',
                title: `${unfinishedCritical.length} Critical Path Task${unfinishedCritical.length > 1 ? 's' : ''} missed the Week 6 deadline`,
                text: `Remaining Critical Path work: ${unfinishedCritical.map(t => t.title).join(', ')}. Decompose Facade & Counter in Week 1 and start Heritage Shutters immediately.`
            });
        }

        if ((st.burnoutIncidents || 0) > 0) {
            hints.push({
                icon: '😴',
                title: `Team Burnout slowed progress ${st.burnoutIncidents} time${st.burnoutIncidents > 1 ? 's' : ''}`,
                text: 'Schedule a ☕ Rest Break before stamina drops below 35%, or Burnout cuts speed by 50% on Critical Path work.'
            });
        }

        if ((st.mismatchCount || 0) > 0 || (st.idleWithWorkCount || 0) > 0) {
            hints.push({
                icon: '🎯',
                title: 'Parallelize specialists across non-critical paths',
                text: 'Pair Carpentry → Uncle Lim, Culinary → Kak Salmah, and Logistics → Danny simultaneously so Peranakan Counter finishes before Hang Signboard unlocks.'
            });
        }

        if (hints.length === 0) {
            hints.push({
                icon: '⏩',
                title: 'Decompose Work Packages early & Crash selectively',
                text: 'Decompose all Work Packages in Week 1 and use ⚡ Schedule Crashing (-RM 500) only on Critical Path bottlenecks that actually unlock the final Signboard.'
            });
        }

        return {
            heading: `💡 Control & Schedule Coaching (${done}/${st.tasks.length} Tasks finished)`,
            hints: hints.slice(0, 3)
        };
    }
};
