# ☕ Oh my PM! — A RekaSantai Game

**Oh my PM!** is an interactive, cozy project management simulation game set across Sarawak, Malaysia. Players step into the role of a growing Project Manager delivering **five progressive community commissions**—from **Auntie Mei’s Main Bazaar Coffee Cart** to the **Kuching Waterfront Festival Pavilion**—while balancing scope, schedule, budget, risk, quality, and team stamina.

Built as a zero-bundler **native ES-module** static web application (ready for GitHub Pages) with hand-painted Sarawak watercolor backdrops and portraits, live multi-layer SVG dioramas, and mobile-first touch ergonomics, the game turns core Project Management principles into tactile, bite-sized puzzles.

---

## ✨ Key Features

### Five-Chapter Career Progression (`15` Mastery Stars)
* **Chapter 1 — Main Bazaar Coffee Cart (`L1 Charter` • RM 500):** Translate stakeholder requests from Auntie Mei into structured **Project Charter** slots (*Objective*, *Constraints*, *Success Criteria*, and *Out-of-Scope* boundaries).
* **Chapter 2 — Siniawan Night Market (`L2 WBS` • RM 4,000 • 6 Days):** Map deliverables under the **WBS 100% Rule**, resolve a stakeholder scope question, and manage a three-artisan build.
* **Chapter 3 — Carpenter St. Kopitiam (`L3 Control` • RM 15,000 + RM 2,000 Reserve • 6 Weeks):** Sequence **Critical Path** dependencies, manage weekly **Schedule Crashing**, mitigate monsoon weather, and apply formal **Change Control** against Scope Creep.
* **Chapter 4 — Borneo Rainforest Eco-Lodge (`L4 Risk` • RM 28,000 + RM 6,000 Reserve • 6 Weeks):**
  * **Phase 1 (Risk Register):** Plan responses across 3 negative threats (*Mitigate*, *Avoid*, *Transfer*, *Accept*) and 1 positive opportunity (*Exploit*, *Enhance*) within a fixed Contingency Reserve.
  * **Phase 2 (Execution & Triggers):** Navigate live Weeks 2–5 risk events plus a Week 5 **Unknown-Unknown** hornbill nest surprise using unspent Reserve.
* **Chapter 5 — Waterfront Festival Pavilion (`L5 Agile` • RM 50,000 • 3 Sprints / 6 Turns):** Flip to **Hybrid Agile Sprints** under a fixed Opening Night launch gate—prioritize **MoSCoW Value** (`≥ 80 Val` & `3/3 Must-Haves`), respect a **WIP Limit of 3**, adapt during Sprint Reviews, and prevent/rework **Quality Defects**.

### Gameplay, Visualization & Persistence
* **Live Iron Triangle Balance Scale & Multi-Layer Dioramas:** A real-time animated balance beam pairs with Sarawak watercolor scenes (`assets/`) and progressive SVG layers that build piece-by-piece alongside your crew.
* **Team Roster, Stamina & Pre-Turn Preview:** Coordinate specialists (**Uncle Lim** — *Carpentry*, **Kak Salmah** — *Culinary*, **Danny** — *Logistics*), schedule **Rest** breaks to prevent burnout (`< 35%` stamina), and check live pre-turn spend, burnout, and defect warnings.
* **Career Map, PM Passport & Auto-Save (`localStorage`):** Track mastery stars (`★ 0/15`), earn chapter badges, jump between chapters seamlessly, resume interrupted mid-chapter runs automatically, and migrate legacy `v1` saves (`Ch 4 Agile → Ch 5`) cleanly via `v2` persistence.
* **Mobile-First Controls & Gestures (`< 640px`):**
  * **Focused 1-Card Swipe Decks** for Charter sorting, WBS mapping, and Chapter 4 Risk Register planning, plus horizontal tab swiping across Agile **Sprint | Backlog | Done** views.
  * **Smart Readiness CTA**, 1-line clamped collapsible guidance, auto-collapsed completed Work Packages, `⚡ Pull & Assign` Agile shortcuts, bottom-sheet flick-down dismissal, subtle `navigator.vibrate` haptics (mute-aware), and **Fast Turn (`⏩`)** mode.
* **Cozy Web Audio & Celebrations:** Synthesized tactile sound effects with mute toggle, built-in 3-step onboarding Guide (`?`), and high-DPI `<canvas>` confetti celebrations.

---

## 📐 PM Concepts Taught

| Chapter | Focus Area | Core Concepts Practiced |
| :--- | :--- | :--- |
| **Ch 1** | **Initiating** | Project Charter authorization, Success Criteria, Out-of-Scope boundaries |
| **Ch 2** | **Planning** | Work Breakdown Structure (WBS) 100% Rule, specialist matching |
| **Ch 3** | **Executing & Control** | Critical Path dependencies, Schedule Crashing, Monsoon Reserve, Change Control vs. Scope Creep |
| **Ch 4** | **Risk Management** | Probability × Impact Risk Register, Mitigate/Transfer/Accept/Exploit responses, Contingency Reserve for Unknown-Unknowns |
| **Ch 5** | **Hybrid Agile & Quality** | Time-boxed Sprints, MoSCoW Value prioritization, WIP Limit (`3`), Sprint Reviews, Defect prevention & QA rework |

---

## 🎨 Visual & Responsive Architecture

* **Cozy Sarawak Craft Palette:** Styled around parchment (`#FAF5EB`), teak (`#5C3A21`), terracotta (`#C85A32`), pandan green (`#2E6F40`), and brass (`#C58F2A`), paired with **Fraunces**, **Plus Jakarta Sans**, and **JetBrains Mono**.
* **Adaptive Viewport Shell (`100dvh`):**
  * **Mobile (`< 640px`):** Single-column shell with collapsible Site Diorama drawer, bottom-sheet dialogs/pickers, touch swipe decks, segmented Agile tabs, and safe-area inset support.
  * **Tablet & Desktop (`>= 640px` / high-DPI):** Two-pane studio layout anchoring the Iron Triangle scale, live Sarawak diorama, and contextual brief on the left beside the full workspace and sticky Team Roster dock on the right.

---

## 🛠️ Tech Stack

* **Structure & Logic:** Semantic HTML5 & Vanilla JavaScript (Native ES6 Modules, zero build step)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Play CDN) + custom design tokens and animations in [css/styles.css](css/styles.css)
* **Visuals & Audio:** Watercolor JPG backdrops & character portraits ([assets/](assets/)), procedural SVG dioramas & badges, Retina HTML5 `<canvas>` confetti, Web Audio API synth, and optional Vibration API haptics
* **Testing:** Built-in Node ESM test runner (`tests/run-tests.mjs`)

---

## 🚀 Getting Started & Testing

Because **Oh my PM!** loads native ES modules (`<script type="module">`), serve the directory over a local HTTP server rather than opening `index.html` via `file://`:

1. **Clone or download** the repository.
2. **Start a local static server** in the project root:
   ```bash
   # Using Python 3
   python3 -m http.server 8080

   # Or using Node.js
   npx serve .
   ```
3. **Play:** Open `http://localhost:8080` in any modern desktop or mobile browser.
4. **Run the automated test suite** (Node.js 18+):
   ```bash
   npm test
   ```
   Runs `node tests/run-tests.mjs` across all **13 ESM test suites** (chapter contracts, asset & handler integrity, `v1 → v2` migration, Chapters 1–5 gameplay simulations, mobile usability/gestures, and haptics).

---

## 📂 Project Structure

```text
ohmypm/
├── index.html                   # App shell, HUD chrome & modal containers
├── package.json                 # Node ESM test script (`npm test`)
├── README.md                    # Project documentation
├── css/
│   └── styles.css               # Design tokens, animations & responsive shell rules
├── assets/
│   ├── bg-l1-bazaar.jpg         # Chapter 1–5 Sarawak watercolor backdrops
│   ├── bg-l2-siniawan.jpg
│   ├── bg-l3-carpenter.jpg
│   ├── bg-l4-rainforest.jpg
│   ├── bg-l4-waterfront.jpg
│   └── portrait-*.jpg           # Crew & stakeholder watercolor portraits
├── js/
│   ├── main.js                  # Entrypoint, window onclick bindings & gesture init
│   ├── chapters/
│   │   ├── index.js             # Ordered 5-chapter registry & Career Rank helper
│   │   ├── ch1-charter.js       # Chapter 1: Project Charter
│   │   ├── ch2-wbs.js           # Chapter 2: WBS 100% Rule
│   │   ├── ch3-control.js       # Chapter 3: Critical Path & Change Control
│   │   ├── ch4-risk.js          # Chapter 4: Risk Register & Contingency Reserve
│   │   └── ch5-agile.js         # Chapter 5: Hybrid Agile Sprints & Quality
│   ├── core/
│   │   ├── audio.js             # Web Audio API synth & mute-aware haptics
│   │   ├── confetti.js          # Retina canvas celebration particles
│   │   ├── constants.js         # Shared UI badges, costs & SVG icons
│   │   ├── engine.js            # Core turn loop, Risk/WBS/Agile actions & events
│   │   └── state.js             # Central store, persistence (v2) & turn preview math
│   └── ui/
│       ├── artwork.js           # Portrait & SVG diorama helpers
│       ├── board.js             # Charter, WBS, Risk Register & Agile board views
│       ├── diorama.js           # Live Sarawak diorama renderer
│       ├── dock.js              # Team dock, pre-turn preview & Smart Primary CTA
│       ├── feedback.js          # Toasts, 1-line guidance clamp & mobile shell sync
│       ├── gestures.js          # Touch swipe deck/tab navigation & sheet flick dismiss
│       ├── hud.js               # Chapter selector pill, KPI bars & Iron Triangle scale
│       ├── modals.js            # Tutorial, Career Map, Event, Intro, Retro & Mobile sheets
│       └── task-card.js         # Shared predictive/Agile task card & action bar
└── tests/
    └── run-tests.mjs            # Unified Node ESM test suite (13 suites)
```

---

## 📄 Credits

Designed and developed by **RekaSantai**.
