# Admin CMS — Detailed Design (Phase 2)

## 1. Overview

The Admin CMS is a **separate Angular app** (`apps/admin-app/`) within the NX monorepo. It shares libraries with the learner app but has its own routing, layout, and access control. Initially (MVP), content management is done directly via Firestore console. The Admin CMS is built in Phase 2.

---

## 2. Admin Roles

| Role | Permissions |
|------|------------|
| `super_admin` | Full access — content, users, config, feature flags |
| `content_admin` | Content management — paths, lessons, activities |
| `viewer` | Read-only analytics dashboard |

---

## 3. Admin Routes

| Path | Page | Description |
|------|------|-------------|
| `/admin/login` | AdminLoginPage | Admin-specific login |
| `/admin/dashboard` | AdminDashboardPage | Analytics overview |
| `/admin/paths` | PathManagementPage | CRUD learning paths |
| `/admin/paths/:id/tracks` | TrackManagementPage | Manage tracks within a path |
| `/admin/lessons` | LessonManagementPage | CRUD lessons |
| `/admin/lessons/:id/edit` | LessonEditorPage | Theory + activity editor |
| `/admin/activities` | ActivityManagementPage | Activity browser |
| `/admin/users` | UserManagementPage | User list and analytics |
| `/admin/config` | ConfigPage | Feature flags, XP config |
| `/admin/analytics` | AnalyticsPage | Engagement metrics |

---

## 4. Admin Dashboard

### Key Metrics

| Metric | Source | Visualization |
|--------|--------|---------------|
| Daily Active Users (DAU) | Firebase Analytics | Line chart |
| Lesson Completions (today) | user_progress collection | Number card |
| Average Streak Length | user_streaks collection | Number card |
| New Registrations (week) | users collection | Bar chart |
| Popular Learning Paths | user_progress aggregation | Ranked list |
| Completion Rates by Path | user_progress aggregation | Horizontal bar |
| Drop-off Points | Lesson-level analytics | Funnel chart |

---

## 5. Content Management

### Learning Path Editor

```
┌──────────────────────────────────────┐
│ Learning Path: Frontend Engineer     │
├──────────────────────────────────────┤
│ Title:    [Frontend Engineer      ]  │
│ Career:   [Frontend ▼]              │
│ Color:    [🟢 #10b981]              │
│ Icon:     [Select Icon ▼]           │
│ Published: [✅ On]                   │
│ Order:    [1]                        │
│                                      │
│ ── Tracks ───────────────────────    │
│ 📘 Angular Basics (Beginner)  [Edit] │
│ 📗 Angular Inter. (Inter.)    [Edit] │
│ 📕 Angular Advanced (Adv.)   [Edit] │
│                                      │
│ [+ Add Track]                        │
└──────────────────────────────────────┘
```

### Lesson Editor

```
┌──────────────────────────────────────┐
│ Lesson: Data Binding in Angular      │
├──────────────────────────────────────┤
│ Title:    [Data Binding           ]  │
│ Chapter:  [Components ▼]            │
│ Difficulty: [Easy ▼]                │
│ Base XP:  [10]  Perfect Bonus: [5]  │
│                                      │
│ ── Theory Cards ─────────────────    │
│ 1. [Text] What is Data Binding?      │
│ 2. [Code] Interpolation Example      │
│ [+ Add Theory Card]                  │
│                                      │
│ ── Activities ───────────────────    │
│ 1. [MCQ] What does {{ }} do?         │
│ 2. [Fill] Complete the template      │
│ 3. [Match] Binding types             │
│ [+ Add Activity]                     │
│                                      │
│ [Save Draft]  [Preview]  [Publish]   │
└──────────────────────────────────────┘
```

### Activity Builder

For each activity type, a specialized form:

**MCQ Builder:**
- Question text input
- 4 option inputs with "correct" radio button
- Hint input (optional)
- Explanation input
- Difficulty selector
- XP reward input

**Fill-in-Blank Builder:**
- Code template editor (Monaco Editor)
- Blank position markers
- Accepted answers per blank (comma-separated)
- Preview rendering

**Matching Builder:**
- Left column items input
- Right column items input
- Pair connections (drag-and-drop interface)

---

## 6. Feature Flag Management

```
┌──────────────────────────────────────┐
│ Feature Flags                        │
├──────────────────────────────────────┤
│ gamification.leaderboard    [✅ On]  │
│ gamification.badges         [✅ On]  │
│ gamification.streakFreeze   [❌ Off] │
│ learning.codingPlayground   [❌ Off] │
│ ai.mentor                   [❌ Off] │
│ ai.quizGeneration           [❌ Off] │
│                                      │
│ [+ Add Flag]          [Save Changes] │
└──────────────────────────────────────┘
```

Changes are written to `config/feature_flags` in Firestore and take effect immediately (real-time listener in learner app).

---

## 7. XP Configuration

```
┌──────────────────────────────────────┐
│ XP Configuration                     │
├──────────────────────────────────────┤
│ Lesson Complete Base XP:    [10]     │
│ Perfect Score Bonus:        [5]      │
│ Streak Bonus (per day):    [2]      │
│ Speed Bonus:               [3]      │
│ Speed Threshold (seconds): [180]    │
│ Daily First Lesson Bonus:  [5]      │
│                                      │
│ ── Level Thresholds ─────────────    │
│ Level 1: 0 XP                        │
│ Level 2: 100 XP                      │
│ Level 3: 250 XP                      │
│ Level 4: 450 XP                      │
│ ... [Edit Thresholds]                │
│                                      │
│ [Save Changes]                       │
└──────────────────────────────────────┘
```

---

## 8. User Analytics

| View | Data |
|------|------|
| User List | Name, email, level, XP, streak, last active, join date |
| User Detail | Full profile, progress per path, lesson history, badge list |
| Engagement | Activity heatmap, daily/weekly/monthly trends |
| Retention | Cohort analysis, churn indicators |

---

## 9. Content Seeder (MVP Alternative)

Before the Admin CMS is built, content is managed via a seeder script:

```bash
# Seed content from JSON files to Firestore
npx ts-node tools/scripts/seed-content.ts --env=dev

# Seed specific path
npx ts-node tools/scripts/seed-content.ts --env=dev --path=frontend-engineer

# Validate content structure
npx ts-node tools/scripts/validate-content.ts
```

### Content File Structure

```
tools/content/
├── paths/
│   ├── frontend-engineer.json
│   ├── backend-engineer.json
│   └── fullstack-engineer.json
├── lessons/
│   ├── angular-data-binding.json
│   ├── angular-components.json
│   └── ...
└── activities/
    ├── angular-mcq-001.json
    ├── angular-fill-001.json
    └── ...
```
