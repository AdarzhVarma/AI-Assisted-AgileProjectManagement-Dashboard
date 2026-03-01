# Nexus AI PM — Agile Sprint Dashboard

> An input-light, insight-heavy AI-powered agile project management dashboard. Developers log daily story point progress. The tool handles everything else — predictions, risk scoring, blocker tracking, capacity planning, and retrospectives.

---

## Philosophy

Most sprint tools demand too much input and give back too little insight. Nexus inverts this:

- **Input:** One number per task per day (story points completed)
- **Output:** Velocity trends, burndown predictions, risk scores, root cause analysis, blocker escalation, scope creep detection, capacity forecasts, and AI recommendations

The core bet: if you can make daily logging frictionless, the AI layer becomes genuinely useful.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Recharts |
| Backend (planned) | Node.js / Python |
| Database (planned) | PostgreSQL |
| AI | Claude / GPT API |
| VCS Integration | GitHub / GitLab |
| Auth | Role-based (planned) |

---

## Data Model

### Developer Object

```js
{
  id: number,
  name: string,
  role: string,           // "Frontend Dev", "Backend Dev", "Full Stack", "QA Engineer"
  avatar: string,         // 2-letter initials
  color: string,          // hex colour used across all visualisations
  mood: "crushing" | "okay" | "struggling",
  streak: number,         // consecutive active coding days
  leaves: [{ day: number, reason: string }],
  tasks: Task[],
  dependencies: Dependency[],
  githubCommits: number,
  prsOpen: number,
  prsReviewed: number
}
```

### Task Object

```js
{
  id: string,
  name: string,
  category: "Feature" | "UI" | "Backend" | "Integration" | "Testing",
  storyPoints: number,        // current committed points
  completedPoints: number,    // points logged so far
  status: TaskStatus,
  eta: string,                // human-readable ETA
  assignedTo: devId,
  blockers: Blocker[],
  daily: [{ d: "D1"..."D14", p: number }],  // daily output per day
  notes: string,
  scopeCreep: boolean         // true if storyPoints changed post-sprint-start
}
```

### Task Status Values

| Status | Meaning |
|---|---|
| `completed` | All story points delivered |
| `on-track` | Progress aligns with ideal pace |
| `slow` | Behind but recoverable |
| `at-risk` | Will miss sprint without intervention |
| `not-started` | Zero points logged, not yet begun |

### Blocker Object

```js
{
  id: string,
  desc: string,
  since: "D1"..."D14",       // sprint day raised
  assignedTo: string,        // person responsible for clearing it
  reason: string,            // root cause
  status: "open" | "in-progress" | "escalated" | "resolved"
}
```

### Sprint Config

```js
{
  name: string,          // e.g. "Sprint 4"
  totalDays: number,     // e.g. 14
  currentDay: number,    // today's sprint day
  startDate: string,
  endDate: string,
  goal: string           // sprint objective
}
```

---

## Calculations

### Velocity (pts/day)

```
activeDays = days where combined daily output > 0, excluding leave days
velocity = sum(output on activeDays) / count(activeDays)
```

Leave days are excluded so a sick day or offsite doesn't drag down a developer's long-term average.

### Overall Progress %

```
progress = (completedPoints / storyPoints) × 100
```

Applied per task, per developer (sum of all tasks), and team-wide.

### Developer Risk Score (0–100)

```
score = 0
if overallStatus === "at-risk"  → +40
if overallStatus === "slow"     → +20
per open blocker                → +15 each
per leave day this sprint       → +8 each
if mood === "struggling"        → +15
if mood === "okay"              → +5
score = min(score, 100)
```

| Score | Label |
|---|---|
| 0–34 | LOW |
| 35–59 | MEDIUM |
| 60–100 | HIGH |

### Burndown Lines

Three lines are plotted:

- **Ideal:** Linear decline from total story points on D1 to 0 on D14. `ideal[day] = totalPts × (1 - day/totalDays)`
- **Actual:** Cumulative remaining points based on real daily logs. Stops at `currentDay`.
- **Predicted:** Extends actual trajectory forward using rolling velocity, adjusted for known leave days and unresolved blockers.

### Sprint Health Score

```
healthScore = (deliveredPts / committedPts) × 100  [partial, mid-sprint]
```

Displayed as a percentage. Below 60% with fewer than 5 days left triggers the "high risk" alert rule by default.

### Capacity Planning Formula

```
rawCapacity = Σ (sprintDays - leaveDays[dev]) × velocity[dev]   for each dev
safeCapacity = rawCapacity × historicalAccuracy   // default 0.82 (team's 4-sprint avg)
```

The 82% factor reflects the team's historical delivery rate across Sprints 1–4.

### Scope Creep Detection

Each task has an `ORIGINAL_PTS` baseline recorded at sprint start. Any task where `currentStoryPoints > originalStoryPoints` is flagged. Total creep is summed across all tasks and shown as a team-wide number.

Under-estimation detection:

```
flag if:
  completionRate < 0.30   (less than 30% done)
  AND activeDaysSpent >= 3
  AND status !== "not-started"
  AND storyPoints >= 5
```

Suggested re-point: `ceil(storyPoints × 1.5)`

### Sprint History Metrics

```
overcommitRate = (1 - avgDelivered / avgCommitted) × 100
```

Calculated across all historical sprints. Used to automatically recommend scope reduction for the next sprint.

---

## Tabs

### 1. Overview
The main view. Developer cards in a 2×2 grid with a notification panel on the right.

Each card shows:
- Avatar, name, role, mood emoji, active streak
- Overall progress bar (combined across all tasks)
- 4 stat tiles: tasks done, at-risk count, open blockers, velocity
- 14-day sprint calendar strip — colour coded by output / leave / today
- Per-task mini status bars
- Combined daily output sparkline
- Expandable: full task list, leave banner, dependency warning, stacked bar chart

**Drag and drop** — tasks can be dragged from one developer card and dropped onto another to reassign.

---

### 2. Sprint
Current sprint health. The most important diagnostic tab.

**Sections:**
- 5 KPI tiles: remaining points, days left, projected leftover at end, open blockers, sprint health %
- **Burndown chart** — Ideal vs Actual vs Predicted with TODAY reference line. Tooltip shows what event caused drift on each annotated day.
- **"Why We Drifted" event timeline** — every leave day, blocker, and dependency event logged with sprint day, type badge, developer dot, and point impact. Hover to highlight.
- **Per-developer risk score bars** — visual 0–100 risk score for each dev with Low / Medium / High label
- **At-risk & slow tasks table** — all tasks with non-green status, showing progress, ETA, blocker summary, and a "⚠ misses sprint" flag where ETA exceeds days remaining
- **AI root cause analysis** — Primary / Secondary / Cascade / Minor cause breakdown in plain English, plus 4 immediate action recommendations

---

### 3. Task Board
Kanban-style column view. One column per developer, tasks sorted at-risk first.

Features:
- Every task card is draggable between columns to reassign
- Progress bar per card
- Blocked badge if blockers exist
- **"+ Add Task" button** opens the Task Creation modal

**Task Creation Modal:**
- Task name and notes
- Category selector (Feature, UI, Backend, Integration, Testing)
- Fibonacci story point selector (1, 2, 3, 5, 8, 13)
- Developer assignment — shows each dev's current velocity to help decide who has capacity
- Task immediately appears on the board and in the assigned developer's card

---

### 4. History
Sprint-over-sprint comparison.

**Sections:**
- 4 summary KPIs: avg committed, avg delivered, overcommit rate, velocity trend
- **Committed vs Delivered bar chart** — grouped bars per sprint (S1–S4)
- AI pattern callout — e.g. "Team consistently overcommits by 21%. Recommend reducing scope by 15–20%."
- **Velocity & Accuracy trend lines** — two lines on one chart showing pts/day velocity and delivery accuracy % over time
- **Per-developer drill-down** — click any dev to see their personal committed vs delivered history across sprints, with an AI insight like "Sara consistently delivers 30% less than committed"

---

### 5. Alerts
Configurable rule engine. Rules are set by the manager, not hardcoded.

**Each rule defines:**
- Trigger condition (free text, e.g. "Blocker unresolved")
- Threshold (number)
- Unit (e.g. "days", "consecutive days", "% with 5 days left")
- Who to notify (free text)
- Severity: high / medium / low

Rules can be toggled on/off with a visual switch. Rules can be deleted. New rules added via the "+ New Rule" form.

**Live Triggers section** shows which rules are currently firing in this sprint with real data context.

Default rules shipped:
1. Blocker unresolved > 2 days → Scrum Master (high)
2. Dev logs 0 pts for 3 consecutive days → Manager (medium)
3. Sprint completion below 60% with 5 days left → Manager (high)
4. Task ETA exceeds sprint end by 1 day → Scrum Master (medium) [off by default]

---

### 6. Blockers
Interactive blocker management. All blockers across all developers in one view.

**Summary KPIs:** Open / Escalated / In Progress / Resolved counts.

Each blocker card shows:
- Developer avatar + name + task name
- "🔴 CRITICAL" badge if open for 3+ days
- Description, days blocked, assigned owner, root cause
- Current status badge

**"⚙ Actions" expander reveals two options:**

**Mark Resolved:**
- Optional resolution note field
- Clicking updates blocker status to "resolved" and relaxes task status from at-risk to slow

**Escalate:**
- Dropdown of escalation targets (PM, Scrum Master, Manager, CTO, External Vendor, other devs)
- Clicking reassigns ownership and sets status to "escalated"

Sprint impact warning calculates how many story points are being lost per day while the blocker persists.

Resolved blockers remain visible at the bottom of the list marked as cleared.

---

### 7. Scope Creep
Tracks story point changes made after sprint start.

**Summary KPIs:** Tasks with creep, total extra points added, under-estimated tasks, sprint overload label.

**All Tasks Comparison Table:**
- Shows `originalPts` vs `currentPts` side by side for every task
- Tasks with added scope highlighted in red with `+N` badge
- Strikethrough on original number when inflated
- "Adjust pts" opens Fibonacci selector inline
  - Increasing shows red warning: "scope creep will be flagged"
  - Decreasing shows green confirmation: "descoping this task"
  - Changes propagate to all calculations immediately

**Under-estimated Tasks section:**
- Auto-flagged tasks: active 3+ days, below 30% complete, 5+ story points
- Shows completion rate, active days spent, suggested re-point value

**AI Scope Analysis:**
- Calculates total extra hours added
- Contextualises against blockers and leave days
- Recommends locking scope after Day 2 of every sprint

---

### 8. Retro
Auto-generated sprint retrospective. Available mid-sprint in preview mode.

**Sections:**
- Committed vs delivered per developer with colour-coded delivery rate (green ≥80%, yellow ≥60%, red <60%)
- Top 3 blockers that caused drift, ranked by point impact
- 5 AI recommendations for next sprint, each with a specific action and reasoning:
  1. Reduce scope by calculated %
  2. Resolve external dependencies before sprint start
  3. Account for leave in capacity planning
  4. Reassign blocked tasks at specific trigger point
  5. Rebalance workloads based on historical delivery patterns

---

### 9. Capacity
Pre-sprint planning tool. Prevents over-commitment before it happens.

**Interactive controls:**
- Sprint duration slider: 7–21 days
- Per-developer leave day counter (+/− per person)

**Live calculations update as you adjust:**
- Raw capacity (100% utilisation)
- Safe recommended capacity (raw × historical accuracy %)
- Per-developer: working days, expected point output

**Recommendation block** generates a plain-English statement: "Given X sprint days, Y total leave days, and Z% historical accuracy, the team can safely commit to N story points."

---

### 10. Dependencies
Visual map of which tasks depend on which.

Each dependency card shows:
- Dependency type badge: Data / Prerequisite / Technical
- Risk level badge: high / medium / low
- Two task boxes connected by an arrow: the waiting task → the task it needs
- Status of both tasks
- Plain description of what is being waited on
- "⚠ Cascading" flag if the blocked task is already at-risk or slow

**Cascade Risk Analysis** section below the map explains in plain English which tasks are dependency bottlenecks and what the downstream impact will be if they slip.

---

### 11. GitHub
Code activity integration. Eliminates the need to manually log progress for commit-driven work.

**Per-developer stats:** commits this sprint, open PRs, PRs reviewed.

**Recent Commits feed:** shows message, branch, PR link, time, and a `+N pt auto` badge where a commit was mapped to a task and progress was auto-logged.

**Auto-Detected Progress panel:** lists tasks where story points were logged automatically from GitHub activity, with which PR triggered it.

**Integration Status panel:**
- Repository connection status
- Auto-progress detection on/off
- PR-to-task mapping status
- Commit sync frequency
- Per-developer activity flags (e.g. "Sara — no commits in 4 days on OAuth branch")

---

## Notification System

A persistent panel in the Overview tab sidebar. AI-generated alerts with:
- Icon, description, timestamp
- Dismiss (×) per notification
- "Clear all" button
- Unread badge counter on the panel header

Alert types: blocker urgency, dependency cascade risk, mood signals, GitHub inactivity detection, capacity recommendations.

---

## Sprint History Data (Sample — Sprint 1–4)

| Sprint | Committed | Delivered | Accuracy | Top Issue |
|---|---|---|---|---|
| Sprint 1 | 60 pts | 42 pts | 70% | Scope creep on auth |
| Sprint 2 | 55 pts | 50 pts | 91% | 2 unplanned sick days |
| Sprint 3 | 70 pts | 58 pts | 83% | API dependency delay |
| Sprint 4 | 76 pts | 37 pts | 49% | OAuth external blocker + leaves |

**4-sprint average delivery accuracy: ~73%** → safe capacity multiplier = 0.82 (conservative buffer added)

---

## Current Sprint Sample State (Sprint 4, Day 7 of 14)

| Developer | Tasks | Pts Done/Total | Status | Blockers | Mood |
|---|---|---|---|---|---|
| Arjun Mehta | 3 | 14/19 | On Track | 1 open | 🚀 Crushing |
| Sara Kim | 3 | 14/24 | At Risk | 1 open | 😟 Struggling |
| Dev Patel | 3 | 15/19 | On Track | 0 | 🚀 Crushing |
| Mia Torres | 3 | 6/18 | Slow | 1 in-progress | 😐 Okay |

**Open blockers:**
- Sara / OAuth Integration — Vendor docs outdated, 401 errors. Since D3. Assigned to Scrum Master.
- Arjun / Session Management — PM spec ambiguous. Since D4. Assigned to PM.
- Mia / E2E Test Coverage — CI pipeline env crash on mobile viewport. Since D5. Assigned to Dev Patel (in progress).

---

## Planned / Not Yet Implemented

- Role-based views (Manager vs Scrum Master vs Developer vs Stakeholder)
- Real backend + database persistence
- Live GitHub webhook integration (currently simulated)
- Time zone awareness for distributed teams
- Mobile-optimised daily logging screen
- Client report generator (PDF/email for stakeholders)
- Audit log (every change with timestamp and user)
- Multi-project command centre view

---

## File

All current functionality lives in a single React component file: `agile-dashboard-v5.jsx`

Total: ~1,400 lines · 11 tabs · 4 developers · 12 tasks · full mock data included
