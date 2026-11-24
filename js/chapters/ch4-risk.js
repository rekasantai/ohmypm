// Chapter 4: Borneo Rainforest Eco-Lodge & Canopy Walk (Risk Register, EMV Response Strategies & Contingency Reserve)
import { renderCharterReferenceBox } from '../core/constants.js';
import { getArtisanPortraitSVG, getTaskLayerState, renderDioramaLayerWrapper } from '../ui/artwork.js';

const SUBTITLE = 'Level 4 • Rainforest Eco-Lodge (RM 28,000 • 6 Wks)';

function chargeReserveThenBudget(st, amount) {
    const reserveAvail = Math.max(0, st.contingencyReserve || 0);
    const fromReserve = Math.min(reserveAvail, amount);
    const fromBudget = amount - fromReserve;
    st.contingencyReserve = reserveAvail - fromReserve;
    st.budget -= fromBudget;
    return { fromReserve, fromBudget };
}

export function getRiskOptimalCount(st) {
    const list = st && Array.isArray(st.riskRegister) ? st.riskRegister : [];
    return list.filter(r => r.selectedStrategy === r.optimalId).length;
}

export const chapter4 = {
    id: 4,
    order: 4,
    shortLabel: 'L4 Risk',
    title: 'Borneo Rainforest Eco-Lodge',
    domain: 'Risk Management • Register & Reserves',
    emoji: '🌿',
    backdrop: 'assets/bg-l4-rainforest.jpg',
    mode: 'risk_predictive',
    subtitle: SUBTITLE,
    time: { unit: 'Week', units: 'Weeks', effort: ['Wk', 'Wks'], turn: 'Workweek', turnIcon: '🗓️', previous: 'last week' },
    lowBudgetThreshold: 4000,
    capabilities: {
        wbsDecompose: false,
        crashing: true,
        crashCost: 1200,
        wipLimit: null,
        qualityDefects: false,
        reworkCost: 0,
        reserveFund: true,
        monsoonWindow: false
    },
    exec: { icon: '🌿', subtitle: 'Your crew is building along Sungai Semenggoh...' },
    startGuidance: '<strong>Phase 1 — Risk Register:</strong> Plan 4 risks (3 threats + 1 opportunity) within your <strong>RM 6,000 Reserve</strong>.',
    tutorial: {
        chapterLine: '🌿 <strong>Ch 4 • Rainforest Eco-Lodge (RM 28,000 • 6 Wks):</strong> Master <strong>Risk Register &amp; Reserves</strong>',
        lifecycleLine: '4️⃣ <strong>Level 4 • Risk Management:</strong> Plan Mitigate, Transfer, Accept &amp; Exploit responses before executing live risk triggers.'
    },
    brief: {
        tag: 'Chapter 4 • Eco-Lodge Commission (RM 28,000 • 6 Weeks)',
        title: 'Borneo Rainforest Eco-Lodge & Canopy Walk',
        text: (st) => `Along Sungai Semenggoh, manage both <strong>Negative Threats</strong> and <strong>Positive Opportunities</strong>. Balance your <strong>RM ${st.contingencyReserve.toLocaleString()} Risk Reserve</strong> between proactive responses and unknown-unknown surprises.`,
        counter: (st) => st.phase === 'risk_plan'
            ? { text: `Reserve RM ${st.contingencyReserve.toLocaleString()}`, cls: 'text-[#2E6F40]' }
            : { text: `Week ${st.day}/${st.maxDays}`, cls: 'text-[#5C3A21]' }
    },
    retro: {
        phaseTag: () => '🏆 Chapter 4 Complete • Risk Management',
        headline: (win, pct) => win ? 'Rainforest Eco-Lodge Opened! 🌿' : `6-Week Window Ended (${pct}% Built)`,
        sub: (win) => win
            ? 'Your Mitigate, Transfer, Accept, and Exploit strategy protected both schedule and Reserve against Borneo surprises!'
            : 'Match each threat to its Probability × Impact (avoid overspending on minor risks) and keep spare Reserve for Week 5 surprises.',
        badge: (win) => ({
            icon: '🛡️',
            title: win ? 'Certified Risk Strategist' : 'Risk Register Practitioner',
            desc: win
                ? 'Applied Mitigate, Transfer, Accept, Exploit, and Contingency Reserve sizing across threats, opportunities, and unknown-unknowns.'
                : 'Quantitative Risk thinking weighs Expected Monetary Value before committing Contingency Reserve.'
        }),
        actions: (win) => win
            ? [
                { label: 'Next Chapter: Waterfront Festival (RM 50,000 • Agile) →', onclick: 'advanceToNextLevel(5)', style: 'primary' },
                { label: '🔄 Replay Level 4', onclick: 'replayCurrentLevel()', style: 'secondary' }
            ]
            : [
                { label: '🔄 Retry Level 4', onclick: 'replayCurrentLevel()', style: 'retry' }
            ]
    },
    retroPrompts: {
        well: [
            '🛡️ Picking Mitigate, Transfer, Accept, and Exploit by Probability × Impact left enough Contingency Reserve for Week 5.',
            '✨ Exploiting the Eco-Tourism Opportunity funded +RM 4,000 extra direct budget and lifted crew stamina.'
        ],
        improve: [
            '💰 Avoid over-mitigating low-impact risks like RM 500 signboard paint—Accepting cheap risks saves Reserve.',
            '🦉 Always keep at least RM 1,000 Contingency Reserve unspent for Unknown-Unknowns during execution.'
        ]
    },
    intro: {
        tag: 'Chapter 4 • Risk Management',
        emoji: '🌿',
        title: 'Borneo Rainforest Eco-Lodge',
        place: 'Sarawak • Sungai Semenggoh Canopy Clearing',
        story: [
            'Build an Eco-Lodge &amp; Canopy Walk in <strong>6 weeks</strong>. Plan your <strong>Risk Register</strong> upfront using a <strong>RM 6,000 Reserve</strong>, then handle live triggers on site.'
        ],
        stats: [['💰', 'Budget', 'RM 28,000'], ['📅', 'Time', '6 Weeks'], ['🛟', 'Reserve', 'RM 6,000']],
        skillLabel: 'New skills',
        skills: [
            '🛡️ <strong>Threat Strategies:</strong> Mitigate high risks, Transfer rare disasters, Accept tiny ones.',
            '✨ <strong>Opportunity (Exploit):</strong> invest upfront Reserve to capture grant bonuses.',
            '🦉 <strong>Unknown-Unknowns:</strong> keep spare Contingency Reserve for unpredicted shocks.'
        ],
        carryTitle: '',
        carryFrom: () => '',
        cta: 'Begin Chapter 4 🌿'
    },

    createState() {
        return {
            level: 4,
            subtitle: SUBTITLE,
            phase: 'risk_plan',
            riskPlanAuthorized: false,
            day: 1,
            maxDays: 6,
            budget: 28000,
            initialBudget: 28000,
            contingencyReserve: 6000,
            initialContingencyReserve: 6000,
            goodwillStars: 0,
            burnoutIncidents: 0,
            crashCount: 0,
            idleWithWorkCount: 0,
            mismatchCount: 0,
            isExecuting: false,
            selectedAssignTaskId: null,
            retroChoice: { wentWell: 0, toImprove: 0 },

            monsoonTriggered: false,
            opportunityTriggered: false,
            supplierTriggered: false,
            unknownTriggered: false,
            riskOutcomes: [],
            riskOptimalCount: 0,

            signedCharterSummary: {
                objective: 'Deliver Borneo Rainforest Eco-Lodge, belian river pilings, suspended canopy walk & eco-tea kitchen',
                constraints: 'RM 28,000 Direct Budget (+RM 6,000 Risk Reserve) • 6 Weeks Deadline',
                outOfScope: 'Zero river dredging or logging outside approved Semenggoh clearing'
            },

            riskRegister: [
                {
                    id: 'rsk-flood',
                    code: 'R-01',
                    kind: 'threat',
                    severity: 'high',
                    probLabel: '80% High',
                    impactLabel: '-RM 4,000 / Delay',
                    title: 'Monsoon River Surge',
                    desc: 'Week 2 flash flood could wash out fresh riverbank pilings.',
                    optimalId: 'mitigate',
                    selectedStrategy: null,
                    options: [
                        { id: 'mitigate', tag: '🛡️ Mitigate', cost: 2500, label: 'Cofferdam & Drainage', desc: 'Blocks flood damage & delay completely.' },
                        { id: 'avoid', tag: '🚧 Avoid', cost: 4500, label: 'Relocate Walk Inland', desc: 'Eliminates flood risk, uses 75% of Reserve.' },
                        { id: 'accept', tag: '🎲 Accept', cost: 0, label: 'Monitor Only', desc: 'Pay RM 0 now, face full Week 2 flood hit.' }
                    ]
                },
                {
                    id: 'rsk-timber',
                    code: 'R-02',
                    kind: 'threat',
                    severity: 'med',
                    probLabel: '30% Low',
                    impactLabel: '-RM 6,000 Loss',
                    title: 'Timber Sawmill Default',
                    desc: 'Primary belian supplier may default before Week 4 framing.',
                    optimalId: 'transfer',
                    selectedStrategy: null,
                    options: [
                        { id: 'transfer', tag: '📄 Transfer', cost: 1500, label: 'Vendor Surety Bond', desc: 'Insurer covers the RM 6,000 shortfall.' },
                        { id: 'mitigate', tag: '🪵 Mitigate', cost: 3500, label: 'Pre-Stock Spare Wood', desc: 'High upfront Reserve lock for a 30% risk.' },
                        { id: 'accept', tag: '🎲 Accept', cost: 0, label: 'Self-Insure', desc: 'Spend RM 0 now, risk emergency air-freight.' }
                    ]
                },
                {
                    id: 'rsk-paint',
                    code: 'R-03',
                    kind: 'threat',
                    severity: 'low',
                    probLabel: '25% Low',
                    impactLabel: '-RM 500 Fix',
                    title: 'Signboard Humidity Peel',
                    desc: 'Mist may peel minor varnish (-RM 500 max impact).',
                    optimalId: 'accept',
                    selectedStrategy: null,
                    options: [
                        { id: 'accept', tag: '🎲 Accept', cost: 0, label: 'Pay If It Happens', desc: 'EMV ~RM 125 — keep Reserve for major threats.' },
                        { id: 'mitigate', tag: '🧪 Mitigate', cost: 1500, label: 'Imported Sealant', desc: 'Costs 3× more than the worst-case fix.' },
                        { id: 'transfer', tag: '📄 Transfer', cost: 1000, label: 'Extended Warranty', desc: 'Costs 2× more than touching it up directly.' }
                    ]
                },
                {
                    id: 'rsk-grant',
                    code: 'R-04',
                    kind: 'opportunity',
                    severity: 'opp',
                    probLabel: '65% Likely',
                    impactLabel: '+RM 4,000 Grant',
                    title: 'Sarawak Eco-Grant',
                    desc: 'Forestry Board rewards early certified green canopy audits.',
                    optimalId: 'exploit',
                    selectedStrategy: null,
                    options: [
                        { id: 'exploit', tag: '✨ Exploit', cost: 1000, label: 'File Eco-Audit Early', desc: 'Locks in +RM 4,000 grant & +15% stamina boost.' },
                        { id: 'enhance', tag: '🌿 Enhance', cost: 500, label: 'Submit Short Brief', desc: 'Secures a partial +RM 2,000 grant bonus.' },
                        { id: 'accept', tag: '⏭️ Accept', cost: 0, label: 'Skip Paperwork', desc: 'Save RM 1,000 Reserve, forfeit grant upside.' }
                    ]
                }
            ],

            workPackages: [
                { id: 'wp-canopy', title: 'Canopy Walk & River Pilings', subtitle: '2 dependent river/canopy Tasks', icon: '🌲', decomposed: true, taskIds: ['r1', 'r2'] },
                { id: 'wp-lodge', title: 'Eco-Lodge Timber & Solar', subtitle: '2 framing & roof Tasks', icon: '🏡', decomposed: true, taskIds: ['r3', 'r4'] },
                { id: 'wp-hospitality', title: 'Forest Kitchen & Trail Sign-off', subtitle: '2 finishing Tasks', icon: '🍵', decomposed: true, taskIds: ['r5', 'r6'] }
            ],

            tasks: [
                {
                    id: 'r1', crashed: false, workPackageId: 'wp-canopy', title: 'Drive Belian Riverbank Pilings',
                    cost: 5000, effort: 2, skill: 'Carpentry', outdoor: true, deps: [], critical: true,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'sets ironwood pilings along the rainforest riverbank'
                },
                {
                    id: 'r2', crashed: false, workPackageId: 'wp-canopy', title: 'Suspend Rainforest Canopy Walk',
                    cost: 5500, effort: 1, skill: 'Carpentry', outdoor: true, deps: ['r1'], critical: true,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'suspends the treetop steel-cable and belian walkway'
                },
                {
                    id: 'r3', crashed: false, workPackageId: 'wp-lodge', title: 'Deliver Certified Rainforest Timber',
                    cost: 4500, effort: 1, skill: 'Logistics', outdoor: false, deps: [], critical: true,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'hauls kiln-dried certified hardwood into Semenggoh clearing'
                },
                {
                    id: 'r4', crashed: false, workPackageId: 'wp-lodge', title: 'Frame Eco-Lodge & Solar Roof',
                    cost: 4500, effort: 1, skill: 'Carpentry', outdoor: true, deps: ['r3'], critical: false,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'raises the breathable timber lodge and solar shingle roof'
                },
                {
                    id: 'r5', crashed: false, workPackageId: 'wp-hospitality', title: 'Fit Out Rainforest Tea Kitchen',
                    cost: 3000, effort: 1, skill: 'Culinary', outdoor: false, deps: [], critical: false,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'equips the Bario tea & wild-pepper tasting counter'
                },
                {
                    id: 'r6', crashed: false, workPackageId: 'wp-hospitality', title: 'Trail Signboards & Ranger Sign-off',
                    cost: 2500, effort: 1, skill: 'Logistics', outdoor: false, deps: ['r2', 'r4'], critical: true,
                    progress: 0, paid: false, assignedArtisanId: null, persisted: false,
                    flavor: 'mounts wayfinding signs and passes final Forestry inspection'
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
        if (allTasksDone) return { done: true, isVictory: st.budget >= 0 };
        if (st.day >= st.maxDays) return { done: true, isVictory: false };
        return { done: false };
    },

    getHudMetrics(st) {
        if (st.phase === 'risk_plan') {
            const total = Math.max(1, (st.riskRegister || []).length);
            const planned = (st.riskRegister || []).filter(r => Boolean(r.selectedStrategy)).length;
            const pct = Math.round((planned / total) * 100);
            return {
                dayText: 'Phase 1: Risk',
                scopeText: `${planned}/${total} Risks`,
                scopeProgressPct: pct,
                tiltDeg: planned === total ? -4 : 2,
                statusText: planned === total ? 'Risk Register Ready' : 'Plan Threat & Opp Responses',
                statusCls: planned === total ? 'font-semibold text-[#A7F3D0]' : 'font-semibold text-[#FDE68A]',
                jewelColor: planned === total ? '#34D399' : '#FBBF24',
                dioramaBadgeText: `Risks: ${planned}/${total}`
            };
        }

        const doneCount = st.tasks.filter(t => t.progress >= 100).length;
        const totalCount = Math.max(1, st.tasks.length);
        const scopePct = Math.round((doneCount / totalCount) * 100);
        const daysLeft = Math.max(0, st.maxDays - st.day + 1);
        const remainingTasks = totalCount - doneCount;
        const workloadRatio = remainingTasks / Math.max(1, daysLeft);
        let tiltDeg = (workloadRatio - 1.2) * 8;
        if (st.budget < 4000) tiltDeg += 4;
        tiltDeg = Math.round(Math.max(-14, Math.min(16, tiltDeg)));

        let statusText = 'Balanced & Steady';
        let statusCls = 'font-semibold text-[#A7F3D0]';
        let jewelColor = '#34D399';
        if (tiltDeg > 7) {
            statusText = 'Heavy Schedule/Cost Pressure';
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
        if (st.phase === 'risk_plan') return '';
        const chevronCls = `w-3.5 h-3.5 text-[#5C3A21] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`;
        const reserveCls = st.contingencyReserve > 0
            ? 'bg-[#2E6F40]/15 text-[#235732] border border-[#2E6F40]/40'
            : 'bg-[#C85A32]/15 text-[#943011] border border-[#C85A32]/40';
        const tags = (st.riskRegister || []).map(r => {
            const opt = (r.options || []).find(o => o.id === r.selectedStrategy);
            return opt ? `${r.code} ${opt.tag.split(' ')[0]}` : r.code;
        }).join(' · ');

        return `
            <button type="button" onclick="toggleContextBanner()" class="w-full flex items-center justify-between gap-2 text-left cursor-pointer">
                <span class="flex items-center gap-1.5 min-w-0 ts-caption font-bold text-[#5C3A21] truncate">
                    ${uiIcon('shield', 'w-3.5 h-3.5 text-[#2E6F40] shrink-0')}
                    <span class="truncate">Watchlist: ${tags}</span>
                </span>
                <span class="shrink-0 flex items-center gap-1.5">
                    <span class="px-1.5 py-0.5 rounded ${reserveCls} ts-micro font-bold font-mono-crisp">
                        🛟 RM ${st.contingencyReserve.toLocaleString()}
                    </span>
                    ${uiIcon('chevronDown', chevronCls)}
                </span>
            </button>
            ${expanded ? `
                <div class="mt-1.5 pt-1.5 border-t border-[#8C6A4A]/35 ts-micro text-[#3D2412] leading-snug space-y-1 animate-crisp-in">
                    ${(st.riskRegister || []).map(r => {
                        const opt = (r.options || []).find(o => o.id === r.selectedStrategy);
                        return `<div><strong>${r.code} ${r.title}:</strong> ${opt ? `${opt.tag} (${opt.label})` : 'Unplanned'}</div>`;
                    }).join('')}
                    ${renderCharterReferenceBox(st.signedCharterSummary)}
                </div>
            ` : ''}
        `;
    },

    getDioramaTimeOfDay(st) {
        const allDone = st.tasks && st.tasks.length > 0 && st.tasks.every(t => t.progress >= 100);
        if (allDone) {
            return { label: 'Lodge Ready for Guests!', skyTop: '#1F3A2E', skyBottom: '#C85A32', ambientTint: 'rgba(255, 206, 112, 0.14)' };
        }
        if (st.phase === 'risk_plan') {
            return { label: 'Phase 1 • Risk Survey', skyTop: '#CBE6D8', skyBottom: '#FAF0D7', ambientTint: 'rgba(46, 111, 64, 0.06)' };
        }
        if (st.isExecuting) {
            return { label: `Workweek ${st.day} of ${st.maxDays}`, skyTop: '#E9B45C', skyBottom: '#FCE5B4', ambientTint: 'rgba(246, 180, 68, 0.12)' };
        }
        return { label: `Week ${st.day} of ${st.maxDays}`, skyTop: '#CBE6D8', skyBottom: '#FAF0D7', ambientTint: 'rgba(255, 250, 235, 0.04)' };
    },

    buildDioramaSVG(st) {
        const s1 = getTaskLayerState(st, 'r1');
        const s2 = getTaskLayerState(st, 'r2');
        const s3 = getTaskLayerState(st, 'r3');
        const s4 = getTaskLayerState(st, 'r4');
        const s5 = getTaskLayerState(st, 'r5');
        const s6 = getTaskLayerState(st, 'r6');
        const floodRisk = (st.riskRegister || []).find(r => r.id === 'rsk-flood');
        const cofferdamOn = Boolean(floodRisk && (floodRisk.selectedStrategy === 'mitigate' || floodRisk.selectedStrategy === 'avoid'));

        const pilingsLayer = renderDioramaLayerWrapper(
            s1,
            `<rect x="44" y="128" width="12" height="28" rx="1.5" fill="url(#wood-teak)" stroke="#241B15" stroke-width="1.3"/>
            <rect x="86" y="122" width="12" height="34" rx="1.5" fill="url(#wood-teak)" stroke="#241B15" stroke-width="1.3"/>
            <rect x="128" y="128" width="12" height="28" rx="1.5" fill="url(#wood-teak)" stroke="#241B15" stroke-width="1.3"/>
            <rect x="38" y="124" width="108" height="7" rx="2" fill="url(#wood-warm)" stroke="#241B15" stroke-width="1.2"/>`,
            `<rect x="44" y="128" width="12" height="28" fill="none" stroke="#2E6F40" stroke-width="1.2" stroke-dasharray="3 3"/>
            <rect x="86" y="122" width="12" height="34" fill="none" stroke="#2E6F40" stroke-width="1.2" stroke-dasharray="3 3"/>`,
            { x: 92, y: 126 }
        );

        const canopyLayer = renderDioramaLayerWrapper(
            s2,
            `<path d="M24 58 Q92 84 166 56" fill="none" stroke="#241B15" stroke-width="2"/>
            <path d="M24 68 Q92 92 166 66" fill="none" stroke="url(#wood-warm)" stroke-width="4"/>
            ${[44, 68, 92, 116, 140].map(px => `<line x1="${px}" y1="68" x2="${px}" y2="79" stroke="#5C3A21" stroke-width="1.4"/>`).join('')}`,
            `<path d="M24 66 Q92 90 166 64" fill="none" stroke="#C58F2A" stroke-width="1.5" stroke-dasharray="4 3"/>`,
            { x: 92, y: 74 }
        );

        const timberLayer = renderDioramaLayerWrapper(
            s3,
            `<rect x="192" y="132" width="166" height="16" rx="2.5" fill="url(#wood-teak)" stroke="#241B15" stroke-width="1.5"/>
            <rect x="200" y="92" width="8" height="40" fill="url(#wood-warm)" stroke="#241B15" stroke-width="1.2"/>
            <rect x="342" y="92" width="8" height="40" fill="url(#wood-warm)" stroke="#241B15" stroke-width="1.2"/>`,
            `<rect x="192" y="132" width="166" height="16" fill="none" stroke="#8C6106" stroke-width="1.3" stroke-dasharray="4 3"/>`,
            { x: 275, y: 132 }
        );

        const lodgeLayer = renderDioramaLayerWrapper(
            s4,
            `<rect x="204" y="88" width="142" height="44" rx="2" fill="#FAF5EB" stroke="#241B15" stroke-width="1.4"/>
            <path d="M188 88 L275 42 L362 88 Z" fill="url(#roof-terra)" stroke="#241B15" stroke-width="1.6"/>
            <rect x="242" y="54" width="66" height="14" rx="2" fill="#1E3A5F" stroke="#F6D365" stroke-width="1.2"/>
            <line x1="264" y1="54" x2="264" y2="68" stroke="#93C5FD" stroke-width="0.9"/>
            <line x1="286" y1="54" x2="286" y2="68" stroke="#93C5FD" stroke-width="0.9"/>`,
            `<path d="M188 88 L275 42 L362 88 Z" fill="none" stroke="#C85A32" stroke-width="1.4" stroke-dasharray="4 3"/>`,
            { x: 275, y: 74 }
        );

        const kitchenLayer = renderDioramaLayerWrapper(
            s5,
            `<rect x="220" y="102" width="52" height="30" rx="2" fill="#E6F4EA" stroke="#241B15" stroke-width="1.2"/>
            <circle cx="246" cy="114" r="6" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1"/>
            <path d="M244 105 Q242 99 246 95" stroke="#FFFDF9" stroke-width="1.4" fill="none" class="diorama-steam"/>`,
            `<rect x="220" y="102" width="52" height="30" fill="none" stroke="#2E6F40" stroke-width="1.2" stroke-dasharray="3 3"/>`,
            { x: 246, y: 112 }
        );

        const signboardLayer = renderDioramaLayerWrapper(
            s6,
            `<rect x="196" y="12" width="158" height="22" rx="4" fill="#1B4226" stroke="#C58F2A" stroke-width="1.8"/>
            <text x="275" y="26" text-anchor="middle" fill="#F6D365" font-family="Fraunces, serif" font-weight="700" font-size="8.5" letter-spacing="0.6">SEMENGGOH ECO-LODGE</text>
            <rect x="366" y="114" width="28" height="22" rx="2" fill="#FFFDF9" stroke="#241B15" stroke-width="1.2"/>
            <line x1="380" y1="136" x2="380" y2="152" stroke="#5C3A21" stroke-width="2"/>`,
            `<rect x="196" y="12" width="158" height="22" rx="4" fill="none" stroke="#C58F2A" stroke-width="1.3" stroke-dasharray="3 3"/>`,
            { x: 275, y: 23 }
        );

        const cofferdamLayer = cofferdamOn ? `
            <g id="diorama-cofferdam" class="diorama-layer-done">
                <path d="M18 142 H152 V154 H18 Z" fill="#64748B" stroke="#241B15" stroke-width="1.2"/>
                <path d="M24 148 H146" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="6 3"/>
            </g>
        ` : '';

        return {
            backdrop: `
                <rect x="0" y="0" width="420" height="170" fill="url(#diorama-sky)"/>
                <ellipse cx="70" cy="40" rx="56" ry="30" fill="#2E6F40" opacity="0.28"/>
                <ellipse cx="360" cy="44" rx="64" ry="34" fill="#1B4226" opacity="0.28"/>
                <rect x="0" y="144" width="420" height="26" fill="#2B5783" opacity="0.35"/>
                <image href="assets/bg-l4-rainforest.jpg" x="0" y="0" width="420" height="170" preserveAspectRatio="xMidYMid slice"/>
                <rect x="0" y="148" width="420" height="22" fill="rgba(27, 66, 38, 0.16)" pointer-events="none"/>
            `,
            layers: cofferdamLayer + pilingsLayer + canopyLayer + timberLayer + lodgeLayer + kitchenLayer + signboardLayer,
            stationCoords: {
                'r1': { x: 92, y: 152 },
                'r2': { x: 118, y: 152 },
                'r3': { x: 205, y: 152 },
                'r4': { x: 300, y: 152 },
                'r5': { x: 246, y: 152 },
                'r6': { x: 380, y: 152 }
            },
            restSlots: [{ x: 64, y: 152 }, { x: 175, y: 152 }, { x: 356, y: 152 }]
        };
    },

    events: [
        {
            id: 'l4_risk_monsoon',
            sound: 'alertPop',
            check: (st) => st.phase === 'execution' && st.day === 2 && !st.monsoonTriggered,
            buildModal: (st) => {
                const floodRisk = (st.riskRegister || []).find(r => r.id === 'rsk-flood');
                const shielded = Boolean(floodRisk && (floodRisk.selectedStrategy === 'mitigate' || floodRisk.selectedStrategy === 'avoid'));
                return {
                    emojiHtml: getArtisanPortraitSVG('ranger', 44),
                    tag: 'Week 2 • R-01 Trigger Fired',
                    title: shielded ? 'Flash Flood Blocked!' : 'Monsoon River Surge!',
                    bodyHtml: shielded
                        ? `Heavy rain swelled Sungai Semenggoh overnight—<strong>your proactive ${floodRisk.selectedStrategy === 'avoid' ? 'inland relocation' : 'cofferdam drainage'}</strong> deflected the surge cleanly!`
                        : `Flash floodwaters slammed your unprotected riverbank pilings! Choose an emergency workaround now.`,
                    actions: shielded
                        ? [{ id: 'ok', title: '🛡️ Response Worked (RM 0 extra · 0 Delay)', desc: 'Proactive planning kept pilings and crew on schedule.', disabled: false }]
                        : [
                            { id: 'repair', title: '1. Emergency Flood Pump & Repair (-RM 4,000)', desc: 'Uses Reserve first, then Budget; keeps all task progress.', disabled: false },
                            { id: 'wait', title: '2. Wait Out Flood & Re-anchor (-RM 1,500)', desc: 'Costs RM 1,500 and sets riverbank pilings back 30%.', disabled: false }
                        ]
                };
            },
            onResolve: (st, choice, api) => {
                st.monsoonTriggered = true;
                if (choice === 'ok') {
                    api.sound.brassBalance();
                    st.goodwillStars += 1;
                    st.riskOutcomes.push('R-01 Flood blocked (RM 0 loss)');
                    api.showToast('🛡️ Flood response held! RM 0 extra cost.', 'success');
                    api.updateGuidance('🛡️ <strong>R-01 Flood Deflected!</strong> Your Week 1 Risk plan saved RM 4,000 and kept Week 2 on schedule.');
                } else if (choice === 'repair') {
                    api.sound.alertPop();
                    const { fromReserve, fromBudget } = chargeReserveThenBudget(st, 4000);
                    st.riskOutcomes.push(`R-01 Unplanned repair (-RM ${fromReserve} Res, -RM ${fromBudget} Bud)`);
                    api.showToast('⚠️ Flood hit! -RM 4,000 emergency repair', 'warn');
                    api.updateGuidance(`⚠️ <strong>R-01 Triggered:</strong> Paid RM 4,000 emergency pump repair (-RM ${fromReserve} Reserve, -RM ${fromBudget} Budget).`);
                } else {
                    api.sound.alertPop();
                    chargeReserveThenBudget(st, 1500);
                    const r1 = st.tasks.find(t => t.id === 'r1');
                    if (r1 && r1.progress > 0 && r1.progress < 100) r1.progress = Math.max(0, r1.progress - 30);
                    st.riskOutcomes.push('R-01 Flood setback (-RM 1,500 & -30% pilings)');
                    api.showToast('🌊 Flood delayed pilings (-30% & -RM 1,500)', 'warn');
                    api.updateGuidance('🌊 <strong>R-01 Flood Setback:</strong> Lost 30% progress on pilings plus RM 1,500 cleanup.');
                }
            }
        },
        {
            id: 'l4_risk_opportunity',
            sound: 'brassBalance',
            check: (st) => st.phase === 'execution' && st.day === 3 && !st.opportunityTriggered,
            buildModal: (st) => {
                const opp = (st.riskRegister || []).find(r => r.id === 'rsk-grant');
                const strat = opp ? opp.selectedStrategy : 'accept';
                if (strat === 'exploit') {
                    return {
                        emojiHtml: getArtisanPortraitSVG('ranger', 44),
                        tag: 'Week 3 • R-04 Opportunity Realized',
                        title: 'Sarawak Eco-Grant Approved!',
                        bodyHtml: 'Because you <strong>Exploited R-04</strong> with an early audit, the Forestry Board awarded the full green bonus!',
                        actions: [{ id: 'claim_full', title: '✨ Claim +RM 4,000 Grant & +15% Stamina', desc: 'Adds RM 4,000 to Operating Budget and boosts crew morale.', disabled: false }]
                    };
                }
                if (strat === 'enhance') {
                    return {
                        emojiHtml: getArtisanPortraitSVG('ranger', 44),
                        tag: 'Week 3 • R-04 Opportunity Realized',
                        title: 'Partial Eco-Grant Awarded',
                        bodyHtml: 'Your short brief qualified for the base eco-certification rebate.',
                        actions: [{ id: 'claim_partial', title: '🌿 Claim +RM 2,000 Grant', desc: 'Adds RM 2,000 to Operating Budget.', disabled: false }]
                    };
                }
                return {
                    emojiHtml: getArtisanPortraitSVG('ranger', 44),
                    tag: 'Week 3 • R-04 Opportunity Window Closed',
                    title: 'Eco-Grant Window Passed',
                    bodyHtml: 'The Forestry green-grant window closed today; since paperwork was skipped, no bonus grant was unlocked.',
                    actions: [{ id: 'missed', title: 'Continue Build (+RM 0)', desc: 'Opportunities require active Exploit/Enhance plans to pay out.', disabled: false }]
                };
            },
            onResolve: (st, choice, api) => {
                st.opportunityTriggered = true;
                if (choice === 'claim_full') {
                    api.sound.taskComplete();
                    st.budget += 4000;
                    st.goodwillStars += 1;
                    st.artisans.forEach(a => { a.stamina = Math.min(100, a.stamina + 15); });
                    st.riskOutcomes.push('R-04 Grant Exploited (+RM 4,000 & +15% morale)');
                    api.showToast('✨ +RM 4,000 Eco-Grant & +15% Crew Stamina!', 'success');
                    api.updateGuidance('✨ <strong>R-04 Opportunity Exploited!</strong> +RM 4,000 added to Budget and +15% Stamina across all 3 artisans.');
                } else if (choice === 'claim_partial') {
                    api.sound.brassBalance();
                    st.budget += 2000;
                    st.riskOutcomes.push('R-04 Partial Grant (+RM 2,000)');
                    api.showToast('🌿 +RM 2,000 Eco-Grant added to Budget!', 'success');
                    api.updateGuidance('🌿 <strong>R-04 Grant Claimed:</strong> +RM 2,000 added to Budget.');
                } else {
                    api.sound.woodClick();
                    st.riskOutcomes.push('R-04 Opportunity missed (+RM 0)');
                    api.showToast('⏭️ Grant window closed (+RM 0)', 'info');
                    api.updateGuidance('⏭️ <strong>Grant Closed:</strong> Continue assigning tasks—keep Reserve ready for late threats!');
                }
            }
        },
        {
            id: 'l4_risk_supplier',
            sound: 'alertPop',
            check: (st) => st.phase === 'execution' && st.day === 4 && !st.supplierTriggered,
            buildModal: (st) => {
                const tim = (st.riskRegister || []).find(r => r.id === 'rsk-timber');
                const strat = tim ? tim.selectedStrategy : 'accept';
                if (strat === 'transfer') {
                    return {
                        emojiHtml: getArtisanPortraitSVG('ranger', 44),
                        tag: 'Week 4 • R-02 Trigger Fired',
                        title: 'Sawmill Default — Bond Paid!',
                        bodyHtml: 'The belian sawmill declared bankruptcy overnight—but your <strong>Performance Bond (Transfer)</strong> covered the RM 6,000 replacement batch automatically!',
                        actions: [{ id: 'bond_paid', title: '📄 Insurer Paid RM 6,000 (RM 0 Cost)', desc: 'Zero budget impact and zero delay.', disabled: false }]
                    };
                }
                if (strat === 'mitigate') {
                    return {
                        emojiHtml: getArtisanPortraitSVG('ranger', 44),
                        tag: 'Week 4 • R-02 Trigger Fired',
                        title: 'Sawmill Default — Spare Timber Ready',
                        bodyHtml: 'The sawmill defaulted, so your crew switched immediately to the pre-stocked spare timber.',
                        actions: [{ id: 'stock_used', title: '🪵 Use Pre-Stocked Timber (RM 0 Extra)', desc: 'Zero extra cost this week.', disabled: false }]
                    };
                }
                return {
                    emojiHtml: getArtisanPortraitSVG('ranger', 44),
                    tag: 'Week 4 • R-02 Trigger Fired',
                    title: 'Sawmill Defaulted!',
                    bodyHtml: 'No vendor bond was purchased and the primary sawmill collapsed! Choose a workaround to keep framing moving.',
                    actions: [
                        { id: 'express', title: '1. Air-Freight Replacement Timber (-RM 5,000)', desc: 'Deducts Reserve first, then Budget; zero progress loss.', disabled: false },
                        { id: 'salvage', title: '2. Local Salvage Mix (-RM 2,500 & -35% Lodge)', desc: 'Cheaper cash hit, delays Eco-Lodge framing or needs rework.', disabled: false }
                    ]
                };
            },
            onResolve: (st, choice, api) => {
                st.supplierTriggered = true;
                if (choice === 'bond_paid' || choice === 'stock_used') {
                    api.sound.brassBalance();
                    st.riskOutcomes.push(choice === 'bond_paid' ? 'R-02 Surety Bond covered RM 6,000' : 'R-02 Spare timber used (RM 0 extra)');
                    api.showToast('📄 Supplier default absorbed at RM 0 extra!', 'success');
                    api.updateGuidance('📄 <strong>R-02 Handled Cleanly!</strong> Risk Transfer / Pre-stocking prevented a RM 5,000–6,000 surprise.');
                } else if (choice === 'express') {
                    api.sound.alertPop();
                    const { fromReserve, fromBudget } = chargeReserveThenBudget(st, 5000);
                    st.riskOutcomes.push(`R-02 Express freight (-RM ${fromReserve} Res, -RM ${fromBudget} Bud)`);
                    api.showToast('⚠️ Sawmill default! -RM 5,000 air-freight', 'warn');
                    api.updateGuidance(`⚠️ <strong>R-02 Express Replacement:</strong> Paid RM 5,000 (-RM ${fromReserve} Reserve, -RM ${fromBudget} Budget).`);
                } else {
                    api.sound.alertPop();
                    chargeReserveThenBudget(st, 2500);
                    const r4 = st.tasks.find(t => t.id === 'r4');
                    if (r4 && r4.progress > 0 && r4.progress < 100) r4.progress = Math.max(0, r4.progress - 35);
                    st.riskOutcomes.push('R-02 Salvage workaround (-RM 2,500 & -35% r4)');
                    api.showToast('🪵 Salvage timber slowed Eco-Lodge (-RM 2,500)', 'warn');
                    api.updateGuidance('🪵 <strong>R-02 Salvage Delay:</strong> Spent RM 2,500 and lost 35% Lodge framing progress.');
                }
            }
        },
        {
            id: 'l4_risk_unknown',
            sound: 'alertPop',
            check: (st) => st.phase === 'execution' && st.day === 5 && !st.unknownTriggered,
            buildModal: (st) => ({
                emojiHtml: getArtisanPortraitSVG('ranger', 44),
                tag: 'Week 5 • Unidentified Risk (Unknown-Unknown)',
                title: 'Protected Hornbill Nest Found!',
                bodyHtml: `A rare Rhinoceros Hornbill pair nested near Trail Post 3! Remaining Contingency Reserve: <strong>RM ${st.contingencyReserve.toLocaleString()}</strong>.`,
                actions: [
                    {
                        id: 'reroute',
                        title: '1. Deploy Reserve Workaround (-RM 1,000)',
                        desc: st.contingencyReserve >= 1000
                            ? 'Funded cleanly from Reserve! Zero fatigue, +1 Goodwill.'
                            : 'Reserve low — remainder comes from Operating Budget.',
                        disabled: false
                    },
                    {
                        id: 'rush_replan',
                        title: '2. Zero-Cost Manual Trail Re-Route (RM 0, -15% Stamina)',
                        desc: 'Saves RM 1,000 cash but tires all 3 crew members.',
                        disabled: false
                    }
                ]
            }),
            onResolve: (st, choice, api) => {
                st.unknownTriggered = true;
                if (choice === 'reroute') {
                    api.sound.brassBalance();
                    const { fromReserve, fromBudget } = chargeReserveThenBudget(st, 1000);
                    st.goodwillStars += 1;
                    st.riskOutcomes.push(`Unknown Hornbill reroute (-RM ${fromReserve} Res, -RM ${fromBudget} Bud)`);
                    api.showToast(fromBudget === 0 ? '🦉 Reserve absorbed Unknown Risk! (+1 Goodwill)' : '🦉 Rerouted using Reserve + Budget (+1 Goodwill)', 'success');
                    api.updateGuidance(`🦉 <strong>Unknown-Unknown Handled!</strong> ${fromBudget === 0 ? 'Spared RM 1,000 Reserve covered the hornbill reroute with zero direct budget hit!' : `Charged RM ${fromReserve} Reserve + RM ${fromBudget} Budget.`}`);
                } else {
                    api.sound.alertPop();
                    st.artisans.forEach(a => { a.stamina = Math.max(0, a.stamina - 15); });
                    st.riskOutcomes.push('Unknown Hornbill manual reroute (-15% Stamina)');
                    api.showToast('😓 Manual hornbill reroute drained -15% crew stamina', 'warn');
                    api.updateGuidance('😓 <strong>Manual Reroute:</strong> Saved RM 1,000 but drained -15% stamina across the crew.');
                }
            }
        }
    ],

    evaluateMastery(st, isVictory) {
        const optimalCount = getRiskOptimalCount(st);
        const c1 = Boolean(isVictory && st.budget >= 0);
        const c2 = c1 && optimalCount >= 3 && (st.burnoutIncidents || 0) === 0;
        const c3 = c2 && st.budget >= 3000;
        return {
            stars: (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0),
            criteria: [
                { met: c1, label: `Open Eco-Lodge within 6 weeks & non-negative budget (RM ${st.budget.toLocaleString()})` },
                { met: c2, label: `≥ 3/4 optimal Risk Register responses (${optimalCount}/4) & 0 Burnout (${st.burnoutIncidents || 0})` },
                { met: c3, label: `Keep ≥ RM 3,000 ending budget via Reserve & Eco-Grant (RM ${st.budget.toLocaleString()})` }
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
        const optimalCount = getRiskOptimalCount(st);
        const hints = [];

        if (st.budget < 0) {
            hints.push({
                icon: '💸',
                title: `Budget finished in deficit (-RM ${Math.abs(st.budget).toLocaleString()})`,
                text: 'Transfer R-02 Sawmill Default (RM 1,500) instead of eating RM 5,000 air-freight, and Exploit R-04 Eco-Grant (+RM 4,000) to strengthen cashflow.'
            });
        }

        if (optimalCount < 3) {
            hints.push({
                icon: '🛡️',
                title: `Only ${optimalCount}/4 Risk Register responses matched EMV`,
                text: 'Best balance for RM 6,000 Reserve: Mitigate R-01 Flood (2,500) + Transfer R-02 Bond (1,500) + Accept R-03 Paint (0) + Exploit R-04 Grant (1,000) = RM 1,000 saved for Week 5!'
            });
        }

        if ((st.burnoutIncidents || 0) > 0) {
            hints.push({
                icon: '😴',
                title: `Team Burnout slowed progress ${st.burnoutIncidents} time${st.burnoutIncidents > 1 ? 's' : ''}`,
                text: 'Start Belian Riverbank Pilings (Lim), Timber Delivery (Danny), and Tea Kitchen (Salmah) in Week 1, and rest tired artisans below 35%.'
            });
        }

        if (hints.length === 0) {
            hints.push({
                icon: '🌲',
                title: 'Start Pilings & Timber Delivery in Week 1',
                text: 'Pilings unlock Canopy Walk (r2) and Timber unlocks Eco-Lodge (r4); both must finish before Week 5/6 Ranger Sign-off (r6).'
            });
        }

        return {
            heading: `💡 Risk & Execution Notes (${done}/${st.tasks.length} Tasks • ${optimalCount}/4 Optimal Risks)`,
            hints: hints.slice(0, 3)
        };
    }
};
