// Chapter 1: Main Bazaar Coffee Cart (Initiating • Project Charter)
import { scrambleStatements } from '../core/constants.js';
import { getCharterBucketLayerState, renderDioramaLayerWrapper } from '../ui/artwork.js';

const SUBTITLE = 'Level 1 • Main Bazaar Coffee Cart (RM 500 • 3 Days)';

export const chapter1 = {
    id: 1,
    order: 1,
    shortLabel: 'L1 Charter',
    title: 'Main Bazaar Coffee Cart',
    domain: 'Initiating • Project Charter',
    emoji: '☕',
    backdrop: 'assets/bg-l1-bazaar.jpg',
    mode: 'charter',
    subtitle: SUBTITLE,
    time: { unit: 'Day', units: 'Days', effort: ['Day', 'Days'], turn: 'Workday', turnIcon: '☀️', previous: 'yesterday' },
    lowBudgetThreshold: 400,
    capabilities: {
        wbsDecompose: false,
        crashing: false,
        crashCost: 500,
        wipLimit: null,
        qualityDefects: false,
        reworkCost: 0,
        reserveFund: false,
        monsoonWindow: false
    },
    exec: { icon: '☕', subtitle: 'Your crew is building at Siniawan Night Market...' },
    startGuidance: 'Tap a matching <strong>Project Charter</strong> slot for each card.',
    tutorial: {
        chapterLine: '📜 <strong>Ch 1 • Main Bazaar Cart (RM 500 • 3 Days):</strong> Draft a <strong>Project Charter</strong>',
        lifecycleLine: '1️⃣ <strong>Level 1 • Project Charter:</strong> Lock down Objective, Constraints, Success Criteria &amp; Out of Scope.'
    },
    brief: {
        tag: 'Chapter 1 • Starter Commission (RM 500 • 3 Days)',
        title: 'Main Bazaar Five-Foot Way Coffee Cart',
        text: () => 'Freshly certified in Kuching, you take on Auntie Mei’s compact coffee cart. Lock down a clear <strong>Project Charter</strong> to prove your discipline and win larger referrals.',
        counter: (st) => {
            const sorted = Object.values(st.charterBuckets).reduce((sum, b) => sum + b.filledIds.length, 0);
            return { text: `Charter: ${sorted}/${st.statements.length}`, cls: 'text-[#5C3A21]' };
        }
    },
    retro: {
        phaseTag: () => '📜 Chapter 1 Complete • Starter Commission',
        headline: () => 'Main Bazaar Charter Authorized! ☕',
        sub: () => 'Auntie Mei is impressed by your scope discipline—she’s recommending you to the Siniawan Heritage Committee for a RM 2,500 festival build!',
        badge: () => ({
            icon: '📜',
            title: 'Project Charter Architect',
            desc: 'Defining Objective, Constraints, Success Criteria, and Out-of-Scope boundaries up front authorizes the project and earns stakeholder trust.'
        }),
        actions: () => [
            { label: 'Next Chapter: Siniawan Stall (RM 2,500 • WBS) →', onclick: 'advanceToNextLevel(2)', style: 'primary' },
            { label: '🔄 Replay Level 1', onclick: 'replayCurrentLevel()', style: 'secondary' }
        ]
    },
    retroPrompts: {
        well: [
            '📜 Locking down Auntie Mei’s Objective, Constraints, and Out-of-Scope items in the Project Charter prevented scope confusion.',
            '✅ Defining measurable Success Criteria (taste & safety checks) clarified the Definition of Done before building.'
        ],
        improve: [
            '🎯 Distinguishing Constraints (RM 500 & 3 Days) from Success Criteria on the first pass speeds up Charter sign-off.',
            '🚧 Calling out excluded items (Laksa kitchen & neon signage) early keeps small projects lean and on budget.'
        ]
    },
    intro: {
        tag: 'Chapter 1 • Starter Commission',
        emoji: '☕',
        title: 'Main Bazaar Coffee Cart',
        place: 'Kuching • Main Bazaar Five-Foot Way',
        story: [
            'Open your Kuching practice with <strong>Auntie Mei’s coffee cart</strong> on Main Bazaar. Lock down what is in—and out of—scope before building begins.'
        ],
        stats: [['💰', 'Budget', 'RM 500'], ['📅', 'Time', '3 Days'], ['👥', 'Crew', 'Just you']],
        skillLabel: 'New skill',
        skills: ['📜 <strong>Project Charter:</strong> sort Objective, Constraints, Success Criteria &amp; Out of Scope.'],
        carryTitle: '',
        carryFrom: () => '',
        cta: 'Begin Chapter 1 ☕'
    },

    createState() {
        const rawStatements = [
            {
                id: 'st-obj-1',
                targetBucket: 'objective',
                text: '“Build a portable teak coffee cart for Main Bazaar’s five-foot way.”',
                shortLabel: 'Portable Teak Coffee Cart'
            },
            {
                id: 'st-obj-2',
                targetBucket: 'objective',
                text: '“Serve Kopi-O, Teh C, and Roti Kahwin to morning patrons.”',
                shortLabel: 'Serve Kopi-O, Teh C & Roti Kahwin'
            },
            {
                id: 'st-con-1',
                targetBucket: 'constraints',
                text: '“Keep total spending strictly within the RM 500 starter budget cap.”',
                shortLabel: 'Budget Cap: RM 500'
            },
            {
                id: 'st-con-2',
                targetBucket: 'constraints',
                text: '“Complete the entire coffee cart setup within 3 days.”',
                shortLabel: 'Schedule Limit: 3 Days'
            },
            {
                id: 'st-suc-1',
                targetBucket: 'success',
                text: '“All 3 core menu items pass a taste and quality check before opening.”',
                shortLabel: '3 Core Menu Items Quality-Checked'
            },
            {
                id: 'st-suc-2',
                targetBucket: 'success',
                text: '“The cart passes five-foot way safety and stability inspection before Friday.”',
                shortLabel: 'Five-Foot Way Safety Inspection Passed'
            },
            {
                id: 'st-out-1',
                targetBucket: 'outOfScope',
                text: '“Do NOT build a full Sarawak Laksa soup kitchen.”',
                shortLabel: 'Excluded: Sarawak Laksa Kitchen'
            },
            {
                id: 'st-out-2',
                targetBucket: 'outOfScope',
                text: '“Do NOT install electric neon signage on the cart.”',
                shortLabel: 'Excluded: Electric Neon Signage'
            }
        ];

        return {
            level: 1,
            subtitle: SUBTITLE,
            phase: 'charter',
            day: 1,
            maxDays: 3,
            budget: 500,
            initialBudget: 500,
            contingencyReserve: 0,
            tarpBought: false,
            hasWeatherRisk: false,
            goodwillStars: 0,
            isExecuting: false,
            retroChoice: { wentWell: 0, toImprove: 0 },

            selectedStatementId: null,
            bouncedStatementId: null,
            bounceCount: 0,
            charterAuthorized: false,
            statements: scrambleStatements(rawStatements),
            charterBuckets: {
                objective: { label: 'Objective', icon: '🎯', hint: 'Core project deliverables', maxItems: 2, filledIds: [] },
                constraints: { label: 'Constraints', icon: '⏳', hint: 'Budget & Schedule limits', maxItems: 2, filledIds: [] },
                success: { label: 'Success Criteria', icon: '✅', hint: 'Definition of Done', maxItems: 2, filledIds: [] },
                outOfScope: { label: 'Out of Scope', icon: '🚧', hint: 'Explicitly excluded items', maxItems: 2, filledIds: [] }
            },

            workPackages: [],
            tasks: [],
            artisans: []
        };
    },

    isFinished(st) {
        return Boolean(st && st.charterAuthorized);
    },

    checkTurnEnd() {
        return { done: true, isVictory: true };
    },

    getHudMetrics(st) {
        const totalStatements = st.statements ? st.statements.length : 8;
        const totalSorted = Object.values(st.charterBuckets).reduce((sum, b) => sum + b.filledIds.length, 0);
        const daysLeft = Math.max(0, st.maxDays - st.day + 1);
        const scopeProgressPct = Math.round((totalSorted / Math.max(1, totalStatements)) * 100);
        const tiltDeg = Math.round(((totalStatements - totalSorted) / totalStatements) * 12);

        return {
            dayText: `${daysLeft} ${daysLeft === 1 ? 'Day' : 'Days'} Left`,
            scopeText: `${totalSorted}/${totalStatements} Charter`,
            scopeProgressPct,
            tiltDeg,
            statusText: st.charterAuthorized
                ? 'Charter Approved'
                : totalSorted === totalStatements ? 'Charter Ready to Approve' : `Defining Charter (${totalSorted}/${totalStatements})`,
            statusCls: totalSorted === totalStatements ? 'font-semibold text-[#A7F3D0]' : 'font-semibold text-[#FDE68A]',
            jewelColor: totalSorted === totalStatements ? '#34D399' : '#FBBF24',
            dioramaBadgeText: st.charterAuthorized ? 'Charter: Approved' : `Charter: ${totalSorted}/${totalStatements}`
        };
    },

    renderContextBanner() {
        return '';
    },

    getDioramaTimeOfDay(st) {
        if (st.charterAuthorized) {
            return {
                label: 'Charter Approved',
                skyTop: '#2D223C',
                skyBottom: '#C85A32',
                ambientTint: 'rgba(255, 196, 92, 0.14)'
            };
        }
        return {
            label: 'Initiating Phase',
            skyTop: '#CFE8F3',
            skyBottom: '#FAF0D7',
            ambientTint: 'rgba(255, 250, 235, 0.04)'
        };
    },

    buildDioramaSVG(st) {
        const s1 = getCharterBucketLayerState(st, ['objective']);
        const s2 = getCharterBucketLayerState(st, ['constraints', 'outOfScope']);
        const s3 = getCharterBucketLayerState(st, ['success']);

        const cartLayer = renderDioramaLayerWrapper(
            s1,
            `<ellipse cx="210" cy="158" rx="84" ry="7" fill="rgba(36, 27, 21, 0.25)"/>
            <rect x="135" y="106" width="150" height="44" rx="4" fill="url(#wood-teak)" stroke="#241B15" stroke-width="1.6"/>
            <rect x="141" y="112" width="40" height="32" rx="2" fill="url(#wood-warm)" stroke="#3D2412" stroke-width="1"/>
            <rect x="239" y="112" width="40" height="32" rx="2" fill="url(#wood-warm)" stroke="#3D2412" stroke-width="1"/>
            <rect x="131" y="101" width="158" height="6.5" rx="2.5" fill="#E3B96B" stroke="#241B15" stroke-width="1.4"/>
            <rect x="141" y="69" width="4.5" height="32" fill="#3D2412" stroke="#241B15" stroke-width="1"/>
            <rect x="274.5" y="69" width="4.5" height="32" fill="#3D2412" stroke="#241B15" stroke-width="1"/>
            <path d="M126 70 L141 51 L279 51 L294 70 Z" fill="url(#roof-terra)" stroke="#241B15" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M158 51 L150 70 L170 70 L176 51 Z M198 51 L195 70 L215 70 L218 51 Z M240 51 L243 70 L263 70 L256 51 Z" fill="#FAF5EB" opacity="0.92"/>
            <path d="M126 70 Q136 76 147 70 Q157 76 168 70 Q178 76 189 70 Q199 76 210 70 Q220 76 231 70 Q241 76 252 70 Q262 76 273 70 Q283 76 294 70" fill="#C85A32" stroke="#241B15" stroke-width="1.1"/>
            <g transform="translate(160, 150)">
                <circle cx="0" cy="0" r="12" fill="#5C3A21" stroke="#241B15" stroke-width="1.6"/>
                <circle cx="0" cy="0" r="8.5" fill="none" stroke="#C58F2A" stroke-width="1.1"/>
                <line x1="-8" y1="0" x2="8" y2="0" stroke="#D9A76A" stroke-width="1.2"/>
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#D9A76A" stroke-width="1.2"/>
                <circle cx="0" cy="0" r="3.5" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1"/>
            </g>
            <g transform="translate(260, 150)">
                <circle cx="0" cy="0" r="12" fill="#5C3A21" stroke="#241B15" stroke-width="1.6"/>
                <circle cx="0" cy="0" r="8.5" fill="none" stroke="#C58F2A" stroke-width="1.1"/>
                <line x1="-8" y1="0" x2="8" y2="0" stroke="#D9A76A" stroke-width="1.2"/>
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#D9A76A" stroke-width="1.2"/>
                <circle cx="0" cy="0" r="3.5" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1"/>
            </g>
            <rect x="184" y="119" width="52" height="18" rx="3" fill="#FFF9E6" stroke="#C58F2A" stroke-width="1.5"/>
            <text x="210" y="131" text-anchor="middle" fill="#5C3A21" font-family="Fraunces, serif" font-weight="700" font-size="8.2">KOPI MEI</text>`,
            `<rect x="135" y="106" width="150" height="44" rx="4" fill="rgba(255,253,249,0.45)" stroke="#2B5783" stroke-width="1.5" stroke-dasharray="4 3"/>
            <path d="M126 70 L141 51 L279 51 L294 70 Z" fill="rgba(255,253,249,0.35)" stroke="#2B5783" stroke-width="1.4" stroke-dasharray="4 3"/>
            <line x1="143" y1="70" x2="143" y2="106" stroke="#2B5783" stroke-width="1.4" stroke-dasharray="3 3"/>
            <line x1="277" y1="70" x2="277" y2="106" stroke="#2B5783" stroke-width="1.4" stroke-dasharray="3 3"/>
            <circle cx="160" cy="150" r="12" fill="none" stroke="#2B5783" stroke-width="1.4" stroke-dasharray="3 3"/>
            <circle cx="260" cy="150" r="12" fill="none" stroke="#2B5783" stroke-width="1.4" stroke-dasharray="3 3"/>`,
            { x: 210, y: 86 }
        );

        const stockLayer = renderDioramaLayerWrapper(
            s2,
            `<rect x="150" y="85" width="15" height="16" rx="2.5" fill="#E6F4EA" stroke="#241B15" stroke-width="1.2"/>
            <rect x="151.5" y="90" width="12" height="9.5" fill="#68A357"/>
            <rect x="149.5" y="82.5" width="16" height="3.2" rx="1" fill="#C85A32" stroke="#241B15" stroke-width="1"/>
            <rect x="172" y="92" width="24" height="9" rx="2" fill="#FCE7F3" stroke="#241B15" stroke-width="1.2"/>
            <line x1="172" y1="96.5" x2="196" y2="96.5" stroke="#C85A32" stroke-width="1.8"/>
            <rect x="252" y="84" width="17" height="17" rx="2" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1.2"/>
            <text x="260.5" y="95" text-anchor="middle" fill="#241B15" font-size="5.6" font-weight="700">KOPI</text>`,
            `<rect x="150" y="85" width="15" height="16" rx="2.5" fill="none" stroke="#2E6F40" stroke-width="1.3" stroke-dasharray="3 3"/>
            <rect x="172" y="92" width="24" height="9" rx="2" fill="none" stroke="#2E6F40" stroke-width="1.3" stroke-dasharray="3 3"/>
            <rect x="252" y="84" width="17" height="17" rx="2" fill="none" stroke="#2E6F40" stroke-width="1.3" stroke-dasharray="3 3"/>`,
            { x: 175, y: 78 }
        );

        const brewLayer = renderDioramaLayerWrapper(
            s3,
            `<path d="M206 101 L209 84 L227 84 L230 101 Z" fill="url(#brass-grad)" stroke="#241B15" stroke-width="1.3" stroke-linejoin="round"/>
            <path d="M227 90 L236 84" stroke="#C58F2A" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M210 83 Q218 76 226 83 Z" fill="#C85A32" stroke="#241B15" stroke-width="1.1"/>
            <path d="M215 74 Q212 67 216 60" stroke="#FFFDF9" stroke-width="1.6" fill="none" stroke-linecap="round" class="diorama-steam"/>
            <path d="M222 75 Q225 68 221 61" stroke="#FFFDF9" stroke-width="1.6" fill="none" stroke-linecap="round" class="diorama-steam-delay"/>
            <rect x="236" y="94" width="8.5" height="7" rx="1.2" fill="#FFFDF9" stroke="#241B15" stroke-width="1.1"/>
            <line x1="236" y1="97.5" x2="244.5" y2="97.5" stroke="#2E6F40" stroke-width="1.3"/>
            <circle cx="152" cy="76" r="8" fill="url(#glow-gold)"/>
            <circle cx="152" cy="76" r="4.5" fill="#FDE68A" stroke="#C85A32" stroke-width="1.2"/>
            <circle cx="268" cy="76" r="8" fill="url(#glow-gold)"/>
            <circle cx="268" cy="76" r="4.5" fill="#FDE68A" stroke="#C85A32" stroke-width="1.2"/>`,
            `<path d="M206 101 L209 84 L227 84 L230 101 Z" fill="none" stroke="#C85A32" stroke-width="1.3" stroke-dasharray="3 3"/>
            <circle cx="152" cy="76" r="4.5" fill="none" stroke="#C85A32" stroke-width="1.2" stroke-dasharray="2 2"/>
            <circle cx="268" cy="76" r="4.5" fill="none" stroke="#C85A32" stroke-width="1.2" stroke-dasharray="2 2"/>`,
            { x: 218, y: 76 }
        );

        return {
            backdrop: `
                <rect x="0" y="0" width="420" height="170" fill="url(#diorama-sky)"/>
                <rect x="20" y="10" width="380" height="138" fill="#F5E8CE" stroke="#7A5434" stroke-width="1.2"/>
                <rect x="0" y="148" width="420" height="22" fill="#B85332"/>
                <image href="assets/bg-l1-bazaar.jpg" x="0" y="0" width="420" height="170" preserveAspectRatio="xMidYMid slice"/>
                <rect x="0" y="148" width="420" height="22" fill="rgba(61, 36, 18, 0.14)" pointer-events="none"/>
            `,
            layers: cartLayer + stockLayer + brewLayer,
            stationCoords: {},
            restSlots: [{ x: 64, y: 155 }, { x: 332, y: 155 }, { x: 374, y: 155 }]
        };
    },

    events: [],

    evaluateMastery(st, isVictory) {
        const c1 = Boolean(isVictory);
        const c2 = c1 && (st.bounceCount || 0) <= 1;
        const c3 = c1 && (st.bounceCount || 0) === 0;
        return {
            stars: (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0),
            criteria: [
                { met: c1, label: 'Authorize all 8 statements in the Project Charter' },
                { met: c2, label: `Sort Charter statements cleanly (${st.bounceCount || 0} bounce-back${(st.bounceCount || 0) === 1 ? '' : 's'}, ≤ 1 allowed)` },
                { met: c3, label: 'Zero sorting bounce-backs (100% first-try accuracy)' }
            ]
        };
    },

    getRetroScorecard(st, _isVictory, { daysRemaining, totalSaved }) {
        return {
            budgetText: `RM ${totalSaved.toLocaleString()}`,
            timeLabel: 'Days Remaining',
            timeText: `${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'}`,
            qualityText: '8/8 Charter ✅'
        };
    },

    buildFailureHints() {
        return null;
    }
};
