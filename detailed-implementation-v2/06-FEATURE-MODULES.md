# Feature Modules — Detailed Specifications

## 1. Module Overview

| Module | Library | Feature Folder | Removable | Phase |
|--------|---------|---------------|-----------|-------|
| Auth | `@fullstack/auth` | `features/auth` | No (core) | MVP |
| Onboarding | — | `features/onboarding` | Yes | MVP |
| Dashboard | — | `features/dashboard` | Yes | MVP |
| Learning | `@fullstack/learning` | `features/learning` | No (core) | MVP |
| Quizzes/Activities | `@fullstack/quizzes` | (inside learning) | Swappable | MVP |
| Gamification | `@fullstack/gamification` | `features/gamification` | Yes | MVP |
| Profile | — | `features/profile` | Yes | MVP |
| Admin CMS | — | (admin-app) | Yes (separate app) | Phase 2 |

---

## 2. Auth Module

### Purpose
User registration, login, password reset, and session management.

### Routes
| Path | Page | Guard |
|------|------|-------|
| `/auth/login` | LoginPage | GuestGuard (redirect if logged in) |
| `/auth/register` | RegisterPage | GuestGuard |
| `/auth/forgot-password` | ForgotPasswordPage | GuestGuard |

### Components
| Component | Description |
|-----------|-------------|
| `LoginFormComponent` | Email/password form with validation |
| `RegisterFormComponent` | Registration form with name, email, password |
| `SocialLoginComponent` | Google sign-in button |
| `AuthLayoutComponent` | Split-screen layout for auth pages |

### Service API (`AuthService`)
```typescript
class AuthService {
  currentUser$: Observable<User | null>;
  isAuthenticated: Signal<boolean>;

  loginWithEmail(email: string, password: string): Promise<void>;
  registerWithEmail(name: string, email: string, password: string): Promise<void>;
  loginWithGoogle(): Promise<void>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<void>;
}
```

### Guards
- `authGuard` — Redirects to `/auth/login` if not authenticated
- `guestGuard` — Redirects to `/dashboard` if already authenticated
- `onboardingGuard` — Redirects to `/onboarding` if onboarding not complete

---

## 3. Onboarding Module

### Purpose
First-time user setup — career interest, experience level, tech preferences, daily goal.

### Flow (5-step wizard)
```
Welcome → Career Selection → Experience Level → Technologies → Daily Goal → Dashboard
```

### Routes
| Path | Page |
|------|------|
| `/onboarding` | OnboardingPage (wizard container) |

### Components
| Component | Description |
|-----------|-------------|
| `WelcomeStepComponent` | Platform intro with animation |
| `CareerStepComponent` | Card selector: Frontend, Backend, Fullstack, DevOps, Mobile |
| `LevelStepComponent` | Level picker: Beginner, Intermediate, Advanced, Expert |
| `TechStepComponent` | Multi-select technology chips |
| `GoalStepComponent` | Daily goal slider: 5, 10, 15, 30 minutes |
| `StepProgressComponent` | Progress dots/bar for wizard steps |

### Data Saved
On completion, updates `users/{userId}` with:
- `careerInterest`, `experienceLevel`, `selectedTechnologies`
- `dailyGoalMinutes`, `onboardingComplete: true`

---

## 4. Dashboard Module

### Purpose
Central hub showing user stats, active paths, streak, and quick actions.

### Routes
| Path | Page |
|------|------|
| `/dashboard` | DashboardPage |

### Components
| Component | Description |
|-----------|-------------|
| `StatsOverviewComponent` | XP, Level, Streak, Lessons Completed cards |
| `ActivePathsComponent` | Cards for each active learning path with progress bars |
| `StreakWidgetComponent` | Flame icon with streak count and weekly calendar |
| `DailyGoalComponent` | Circular progress for daily learning goal |
| `ContinueLearningComponent` | "Continue where you left off" button with lesson info |
| `RecommendedPathsComponent` | Suggested paths based on user profile |

### Data Sources
- `UserRepository` — User stats
- `ProgressRepository` — Active path progress
- `StreakRepository` — Streak data

---

## 5. Learning Module

### Purpose
Core learning experience — journey map, lesson player, activity engine.

### Routes
| Path | Page |
|------|------|
| `/learn` | Redirects to first active path |
| `/learn/path/:pathId` | JourneyMapPage |
| `/learn/lesson/:lessonId` | LessonPlayerPage |
| `/learn/lesson/:lessonId/complete` | LessonCompletePage |

### Sub-modules

#### 5a. Journey Map
Visual Duolingo-style learning path with nodes.

| Component | Description |
|-----------|-------------|
| `PathTreeComponent` | Scrollable vertical path with connected nodes |
| `PathNodeComponent` | Individual lesson node (locked/available/completed/perfect) |
| `PathConnectorComponent` | SVG lines connecting nodes |
| `ChapterHeaderComponent` | Chapter title divider between node groups |
| `TrackSelectorComponent` | Horizontal tab bar to switch tracks |

**Node States:**
| State | Visual | Interaction |
|-------|--------|-------------|
| `locked` | Gray, lock icon | Tap shows "Complete previous lesson first" |
| `available` | Colored, pulsing glow | Tap opens lesson overview |
| `in_progress` | Colored, progress ring | Tap continues lesson |
| `completed` | Colored, checkmark | Tap to retry for higher score |
| `perfect` | Gold, star/crown | Tap to review |

#### 5b. Lesson Player
Handles theory cards and activity flow.

| Component | Description |
|-----------|-------------|
| `TheoryCardComponent` | Renders theory content (text, code, image, tip) |
| `ProgressBarComponent` | Top progress bar showing lesson completion |
| `HeartsDisplayComponent` | Heart icons (5 hearts, lose on wrong answer) |
| `ActivityRendererComponent` | Dynamic component loader for activities |
| `FeedbackOverlayComponent` | Correct/incorrect feedback with explanation |

**Lesson Flow:**
```
Theory Cards (swipe/scroll) → Activity 1 → Feedback → Activity 2 → ... → Score Summary
```

#### 5c. Activity Engine (from `@fullstack/quizzes`)
| Component | Props | Description |
|-----------|-------|-------------|
| `McqActivityComponent` | `ActivityConfig` | 4-option single choice |
| `FillBlankActivityComponent` | `ActivityConfig` | Code with input blanks |
| `MatchingActivityComponent` | `ActivityConfig` | Tap-to-match two columns |
| `OrderingActivityComponent` | `ActivityConfig` | Drag-to-reorder list |
| `MultiSelectActivityComponent` | `ActivityConfig` | Checkbox multi-choice |

### Learning Store
```typescript
class LearningStore {
  // State
  currentLesson: Signal<Lesson | null>;
  currentActivityIndex: Signal<number>;
  score: Signal<number>;
  hearts: Signal<number>;
  answers: Signal<Map<string, ActivityResult>>;

  // Computed
  currentActivity: Signal<Activity | null>;
  progress: Signal<number>;        // 0-100
  isComplete: Signal<boolean>;
  isPassing: Signal<boolean>;      // score >= passingScore

  // Actions
  startLesson(lessonId: string): void;
  submitAnswer(activityId: string, answer: any): void;
  nextActivity(): void;
  retryLesson(): void;
}
```

---

## 6. Gamification Module

### Purpose
XP tracking, streaks, badges, leaderboards, celebrations.

### Routes
| Path | Page |
|------|------|
| `/leaderboard` | LeaderboardPage |
| `/badges` | BadgesPage |

### Components
| Component | Description |
|-----------|-------------|
| `XPPopupComponent` | Animated XP earned overlay (+10 XP!) |
| `StreakCelebrationComponent` | Flame animation on streak milestone |
| `LevelUpModalComponent` | Full-screen level-up celebration |
| `BadgeCardComponent` | Individual badge with lock/unlock state |
| `BadgeGalleryComponent` | Grid of all badges |
| `LeaderboardTableComponent` | Ranked user list with XP and level |
| `LeaderboardTabsComponent` | Toggle: Global / Weekly / By Tech |

### Gamification Service API
```typescript
class GamificationService {
  // XP
  awardXP(amount: number, source: string): Promise<void>;
  getUserXP(): Signal<number>;
  getUserLevel(): Signal<number>;
  getXPForNextLevel(): Signal<number>;

  // Streaks
  updateStreak(): Promise<void>;
  getStreak(): Signal<UserStreak>;

  // Badges
  checkAndUnlockBadges(): Promise<Badge[]>;
  getUserBadges(): Signal<UserBadge[]>;

  // Leaderboard
  getLeaderboard(type: string): Observable<LeaderboardEntry[]>;
  getUserRank(): Signal<number>;
}
```

### XP Calculation Formula
```
totalXP = baseXP
        + (accuracy === 100 ? perfectBonus : 0)
        + (timeTaken < threshold ? speedBonus : 0)
        + (currentStreak > 0 ? streakBonus : 0)
```

---

## 7. Profile Module

### Purpose
User profile, settings, learning history.

### Routes
| Path | Page |
|------|------|
| `/profile` | ProfilePage |
| `/profile/settings` | SettingsPage |

### Components
| Component | Description |
|-----------|-------------|
| `ProfileHeaderComponent` | Avatar, name, level, XP bar |
| `StatsGridComponent` | Grid cards: Total XP, Streak, Lessons, Paths |
| `BadgeShowcaseComponent` | Top 6 badges with "View All" link |
| `LearningHistoryComponent` | Timeline of completed lessons with scores |
| `SettingsFormComponent` | Theme, notifications, daily goal, account |

---

## 8. Module Decommissioning Checklist

To remove any feature module:

```
1. □ Remove route entry from app.routes.ts
2. □ Remove navigation link from layout (header/bottom-nav)
3. □ Remove feature flag from config/feature_flags
4. □ Delete the feature folder (e.g., features/gamification/)
5. □ Remove event listeners for that module's events (if any)
6. □ Run build to verify no broken imports
7. □ Deploy
```

**What should NOT break:**
- Other feature modules continue working
- No compile errors
- No runtime errors
- Navigation gracefully handles missing routes
