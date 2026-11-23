# ☕ Oh my PM! — A RekaSantai Game

**Oh my PM!** is an interactive, cozy project management simulation game set in Sarawak, Malaysia. Players step into the shoes of a Project Manager restoring local community commissions—starting with **Auntie Mei’s Main Bazaar Coffee Cart**—while balancing scope, schedule, budget, and team morale across a three-stage project lifecycle.

Built as a self-contained, single-file web application with a warm handcrafted aesthetic, procedural SVG dioramas, and responsive two-pane layouts, the game turns core Project Management Body of Knowledge (PMBOK) principles into tactile, bite-sized puzzles.

---

## ✨ Key Features

* **Three-Phase Project Lifecycle Progression**
  * **Level 1 — Initiating (`L1: Charter`):** Translate stakeholder requests from Auntie Mei into structured **Project Charter** slots (*Objective*, *Constraints*, *Success Criteria*, and *Out-of-Scope* boundaries) before work begins.
  * **Level 2 — Planning (`L2: WBS`):** Decompose the approved charter into an actionable **Work Breakdown Structure (WBS)** tree, organizing deliverables and task dependencies.
  * **Level 3 — Executing & Controlling (`L3: Schedule`):** Sequence tasks along the **Critical Path**, manage a **Contingency Reserve**, and respond to mid-project disruptions such as **Stakeholder Scope Creep** and **Monsoon Risk Mitigation**.
* **Live Iron Triangle Balance Scale:** A real-time animated SVG balance scale tracks equilibrium between **Budget (`RM`) & Schedule (Days Left)** on one pan and **Scope** on the other.
* **Interactive Cross-Section Restoration Diorama:** Watch the Sarawak coffee cart and bazaar site come to life layer-by-layer as tasks complete, featuring animated rising kopi steam, crafting artisans, and blueprint highlights.
* **Team Roster & Burnout Management:** Assign a three-person team to WBS tasks and schedule **Rest** breaks to prevent burnout and sustain productivity across simulated workdays.
* **Project Retrospectives & Badges:** Conclude levels with an Iron Triangle scorecard, guided *What Went Well* / *What to Improve* reflections, and unlockable **PM Principle Badges** (such as *Project Charter Architect*).
* **Built-In Interactive Field Guide:** Includes a 3-step onboarding modal on launch (`? Guide`) and toggleable audio feedback.

---

## 📐 PM Concepts Taught

| Lifecycle Phase | Core Concepts Practiced |
| :--- | :--- |
| **Initiating** | Project Charter creation, stakeholder alignment, defining Out-of-Scope boundaries |
| **Planning** | Work Breakdown Structure (WBS) decomposition, scope baseline verification |
| **Executing & Monitoring** | Critical Path prioritization, resource allocation, fatigue/burnout prevention |
| **Controlling & Closing** | Change Control vs. Scope Creep, Contingency Reserves, Risk Mitigation, Retrospectives |

---

## 🎨 Visual & Responsive Architecture

* **Cozy Sarawak Craft Aesthetic:** Styled around a tactile parchment-and-teak palette (`#FAF5EB` parchment, `#5C3A21` teak wood, `#C85A32` terracotta, `#2E6F40` pandan green, and `#C58F2A` brass) paired with **Fraunces** serif headings, **Plus Jakarta Sans** UI copy, and **JetBrains Mono** tabular numerals.
* **Adaptive Viewport Shell (`100dvh`):**
  * **Compact Mobile / Folded Cover Screens (under 360px):** Streamlined HUD pills and compact team cards with safe-area inset support.
  * **Tablets, Foldables & Desktops (600px and wider):** Automatically switches into a two-pane studio layout—anchoring the Iron Triangle HUD, live SVG diorama, and Project Brief on the left (`44%`) while keeping the Charter/WBS workspace and Team Roster dock interactive on the right (`56%`).

---

## 🛠️ Tech Stack

* **Structure & Logic:** Semantic HTML5 & Vanilla JavaScript (ES6+)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via Play CDN) + custom CSS keyframe animations and design tokens
* **Graphics & Effects:** Procedural inline SVGs (custom clipboard-and-kopi emblem, dynamic balance beam, multi-layer cross-section diorama) and HTML5 `<canvas>` celebration particles
* **Typography:** Google Fonts (`Fraunces`, `Plus Jakarta Sans`, `JetBrains Mono`)

---

## 🚀 Getting Started

Because **Oh my PM!** has zero build steps, bundlers, or external package dependencies, you can run it directly in any modern browser:

1. **Clone or download** the repository containing `index.html`.
2. **Open directly** by double-clicking `index.html`, or serve it locally for optimal font and viewport behavior:
   ```bash
   # Using Python 3
   python3 -m http.server 8080

   # Or using Node.js (npx)
   npx serve .
   ```
3. Navigate to `http://localhost:8080` in your browser.

---

## 📂 Project Structure

```text
oh-my-pm/
├── index.html   # Complete self-contained game (styles, responsive shell, SVG diorama, modals & game engine)
└── README.md    # Project documentation
```

---

## 📄 Credits

Designed and developed by **RekaSantai**.
