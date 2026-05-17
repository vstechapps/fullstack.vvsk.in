# Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** fullstack.vvsk.in
**Tagline:** "Level Up Your Fullstack Skills — One Lesson at a Time"
**Platform Type:** Gamified Interactive Learning Platform
**Target URL:** https://fullstack.vvsk.in

---

## 2. User Personas

### Persona 1: Fresh Graduate ("Arjun")

| Attribute | Detail |
|-----------|--------|
| Age | 21-24 |
| Background | CS/IT graduate, knows basics of HTML/CSS/JS |
| Pain Point | Overwhelmed by the number of technologies to learn |
| Goal | Get job-ready as a frontend/fullstack developer |
| Behavior | Learns 30-60 mins/day on mobile, prefers bite-sized content |
| Motivation | Visible progress, achievements, confidence building |

### Persona 2: Experienced Developer ("Priya")

| Attribute | Detail |
|-----------|--------|
| Age | 26-32 |
| Background | 3-5 years experience, strong in one stack |
| Pain Point | Needs to upskill in new technologies quickly |
| Goal | Learn Angular/React/Cloud/DevOps without long courses |
| Behavior | Learns in short bursts during commute or breaks |
| Motivation | Efficiency, skip basics, jump to intermediate/advanced |

### Persona 3: Career Switcher ("Rahul")

| Attribute | Detail |
|-----------|--------|
| Age | 25-35 |
| Background | Non-CS background, self-taught basics |
| Pain Point | No structured learning path, imposter syndrome |
| Goal | Build a solid foundation and prove competence |
| Behavior | Dedicated 1-2 hours/day, needs hand-holding |
| Motivation | Structured path, feeling of achievement, community |

### Persona 4: Tech Lead ("Sneha")

| Attribute | Detail |
|-----------|--------|
| Age | 30-40 |
| Background | Senior developer / architect |
| Pain Point | Team members need upskilling, hard to track progress |
| Goal | Use platform for team learning (future enterprise feature) |
| Behavior | Evaluates platform, assigns learning paths |
| Motivation | Team productivity, measurable learning outcomes |

---

## 3. User Stories

### 3.1 Authentication & Onboarding

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-001 | As a new user, I want to register with email or Google so I can start learning | P0 | Email/Google sign-up works, user document created in Firestore |
| US-002 | As a new user, I want to select my career interest during onboarding so the platform recommends paths | P0 | Onboarding wizard with career path selection, saved to user profile |
| US-003 | As a new user, I want to choose my experience level so I start at the right difficulty | P0 | Level selector (Beginner/Intermediate/Advanced/Expert), affects starting position |
| US-004 | As a returning user, I want to log in and see my dashboard immediately | P0 | Auto-redirect to dashboard after login, last session state restored |
| US-005 | As a user, I want to reset my password if I forget it | P1 | Firebase password reset email flow |

### 3.2 Learning Journey

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-010 | As a learner, I want to see a visual learning path map (like Duolingo) so I know my progress | P0 | Tree/path visualization with completed/current/locked nodes |
| US-011 | As a learner, I want to tap on a lesson node to start learning | P0 | Node click opens lesson, shows lesson overview before starting |
| US-012 | As a learner, I want to see theory content in digestible cards before quiz activities | P0 | Swipeable/scrollable theory cards with code snippets and visuals |
| US-013 | As a learner, I want lessons to unlock sequentially so I follow the right order | P0 | Next lesson unlocks only after current lesson is completed with >= 70% score |
| US-014 | As a learner, I want to retry a lesson to improve my score | P1 | Retry button available, best score persisted |
| US-015 | As a learner, I want to see which technologies I am learning and my progress in each | P0 | Technology cards on dashboard with percentage completion |

### 3.3 Activity Engine

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-020 | As a learner, I want to answer MCQ questions with immediate feedback | P0 | 4 options, instant correct/incorrect feedback with explanation |
| US-021 | As a learner, I want to fill in blanks in code snippets | P0 | Code block with blanks, keyboard/dropdown input, validation |
| US-022 | As a learner, I want to match related concepts (drag-match) | P0 | Two columns, tap-to-match or drag-to-match, visual feedback |
| US-023 | As a learner, I want to arrange code/steps in the correct order | P1 | Drag-to-reorder list, validate sequence |
| US-024 | As a learner, I want multi-select questions where multiple answers are correct | P1 | Checkbox-style selection, submit to validate |
| US-025 | As a learner, I want to see my score at the end of each lesson | P0 | Score summary with XP earned, accuracy percentage, time taken |

### 3.4 Gamification

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-030 | As a learner, I want to earn XP for completing lessons | P0 | XP awarded on lesson completion, amount based on accuracy |
| US-031 | As a learner, I want to maintain a daily streak | P0 | Streak counter increments on daily activity, resets on miss |
| US-032 | As a learner, I want to earn badges for achievements | P1 | Badge popup on achievement, badge gallery in profile |
| US-033 | As a learner, I want to see my ranking on a leaderboard | P1 | Global and weekly leaderboards, sorted by XP |
| US-034 | As a learner, I want to see a streak freeze option so I don't lose my streak | P2 | Streak freeze purchasable with XP, 1 day protection |
| US-035 | As a learner, I want to see XP animations when I earn points | P0 | Animated XP counter, celebration effects on milestones |

### 3.5 Profile & Settings

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-040 | As a user, I want to view my profile with stats | P0 | Profile page with XP, level, streak, badges, learning paths |
| US-041 | As a user, I want to edit my display name and avatar | P1 | Editable profile fields, avatar picker/upload |
| US-042 | As a user, I want to see my learning history | P1 | List of completed lessons with scores and dates |
| US-043 | As a user, I want to toggle notification preferences | P2 | Push notification settings for streaks, reminders |

### 3.6 Admin (Phase 2)

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-050 | As an admin, I want to create and manage learning paths | P2 | CRUD for learning paths with ordering |
| US-051 | As an admin, I want to create lessons with theory and activities | P2 | Lesson builder with theory cards and activity configurator |
| US-052 | As an admin, I want to see user engagement analytics | P2 | Dashboard with DAU, completion rates, popular paths |
| US-053 | As an admin, I want to toggle features on/off | P2 | Feature flag management UI |

---

## 4. Functional Requirements

### FR-001: Authentication System
- Email/password registration and login
- Google OAuth sign-in
- Password reset via email
- Session persistence across tabs
- Route guards for protected pages

### FR-002: Onboarding Flow
- Step 1: Welcome screen with platform overview
- Step 2: Career interest selection (Frontend, Backend, Fullstack, DevOps, Mobile)
- Step 3: Experience level selection (Beginner, Intermediate, Advanced, Expert)
- Step 4: Technology preferences (Angular, React, Node.js, Python, etc.)
- Step 5: Daily goal setting (5 min, 10 min, 15 min, 30 min)
- Result: Personalized dashboard with recommended learning paths

### FR-003: Learning Path Engine
- Hierarchical content: Career Path → Technology → Track → Level → Chapter → Lesson → Activities
- Visual journey map with node states: locked, available, in-progress, completed, perfect
- Sequential unlocking based on completion criteria
- Multiple paths can be active simultaneously
- Progress percentage calculation per path/track/chapter

### FR-004: Lesson Engine
- Theory phase: Scrollable cards with text, code snippets, images, tips
- Activity phase: Mixed activities (MCQ, fill-blank, matching, ordering)
- Scoring: Per-activity scoring with cumulative lesson score
- Completion criteria: Minimum 70% score to pass
- Heart system (optional): 5 hearts per lesson, lose heart on wrong answer

### FR-005: Dynamic Activity Renderer
- Config-driven activity rendering — no hardcoded activity types
- Each activity type is a standalone Angular component
- Activity config loaded from Firestore
- Pluggable architecture — new activity types addable without modifying engine

### FR-006: Gamification System
- XP calculation: Base XP per lesson + bonus for accuracy + bonus for speed + streak bonus
- Streak tracking: Daily activity check with timezone awareness
- Level system: XP thresholds for levels (Level 1: 0 XP, Level 2: 100 XP, etc.)
- Badges: Achievement-based badges with unlock conditions defined in config
- Leaderboards: Real-time ranked lists (global, weekly, per-technology)

### FR-007: Progress Persistence
- Real-time progress saving to Firestore
- Offline capability with local caching (future)
- Cross-device sync via Firebase
- Progress analytics per user

---

## 5. Non-Functional Requirements

| Category | Requirement | Target |
|----------|------------|--------|
| Performance | First Contentful Paint | < 1.5s |
| Performance | Time to Interactive | < 3s |
| Performance | Lighthouse Score | > 90 |
| Scalability | Concurrent Users | 10,000+ (Firebase auto-scales) |
| Availability | Uptime | 99.9% (Firebase SLA) |
| Security | Authentication | Firebase Auth with security rules |
| Security | Data Access | Row-level security via Firestore rules |
| Accessibility | WCAG Compliance | Level AA |
| Responsiveness | Device Support | Mobile-first, responsive to desktop |
| Browser Support | Minimum | Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ |
| Bundle Size | Initial Load | < 200KB gzipped |
| Modularity | Module Independence | Any module removable without code changes to others |

---

## 6. Content Requirements

### Initial Learning Paths (MVP)

| Path | Technologies | Tracks |
|------|-------------|--------|
| Frontend Engineer | HTML, CSS, JavaScript, TypeScript, Angular | Basics, Intermediate, Advanced |
| Backend Engineer | Node.js, Express, REST APIs, Databases | Basics, Intermediate, Advanced |
| Fullstack Engineer | Combined Frontend + Backend | Integrated path |

### Content Volume (MVP Target)

| Content Type | Count |
|-------------|-------|
| Learning Paths | 3 |
| Tracks per Path | 3 |
| Chapters per Track | 5-8 |
| Lessons per Chapter | 4-6 |
| Activities per Lesson | 5-10 |
| **Total Activities** | **~900-1,440** |

### Content Format

Each lesson consists of:
1. **2-4 Theory Cards** — Short, visual explanations with code examples
2. **5-10 Activities** — Mixed activity types testing the theory concepts
3. **1 Summary Card** — Key takeaways from the lesson
