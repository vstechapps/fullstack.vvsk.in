# UI/UX Design System

## 1. Design Philosophy

| Principle | Implementation |
|-----------|---------------|
| **Duolingo-inspired** | Friendly, colorful, gamified feel with celebrations |
| **Mobile-first** | Design for mobile, enhance for desktop |
| **Micro-interactions** | Every tap gives feedback — animations, haptics, sound |
| **Rewarding** | Visual progress everywhere — bars, numbers, colors |
| **Minimal cognitive load** | One activity per screen, short theory blocks |

---

## 2. Color System

### Brand Palette

```css
:root {
  /* Primary - Energetic Green (learning/success) */
  --color-primary-50: #ecfdf5;
  --color-primary-100: #d1fae5;
  --color-primary-500: #10b981;
  --color-primary-600: #059669;
  --color-primary-700: #047857;

  /* Secondary - Vibrant Blue (info/navigation) */
  --color-secondary-50: #eff6ff;
  --color-secondary-500: #3b82f6;
  --color-secondary-600: #2563eb;

  /* Accent - Warm Orange (gamification/XP) */
  --color-accent-50: #fff7ed;
  --color-accent-500: #f97316;
  --color-accent-600: #ea580c;

  /* Streak - Fire Red/Orange */
  --color-streak: #ef4444;

  /* Correct/Incorrect */
  --color-correct: #22c55e;
  --color-incorrect: #ef4444;

  /* Neutrals */
  --color-bg: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-text: #0f172a;
  --color-text-secondary: #64748b;
  --color-border: #e2e8f0;

  /* Dark Mode */
  --color-bg-dark: #0f172a;
  --color-bg-secondary-dark: #1e293b;
  --color-text-dark: #f1f5f9;
  --color-border-dark: #334155;

  /* Level Colors */
  --color-beginner: #22c55e;
  --color-intermediate: #3b82f6;
  --color-advanced: #a855f7;
  --color-expert: #f97316;
}
```

### Badge Rarity Colors

| Rarity | Color | Glow |
|--------|-------|------|
| Common | Gray (#94a3b8) | None |
| Rare | Blue (#3b82f6) | Subtle |
| Epic | Purple (#a855f7) | Medium |
| Legendary | Gold (#eab308) | Strong + sparkle |

---

## 3. Typography

```css
/* Google Fonts: Inter (body) + Outfit (headings) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');

:root {
  --font-body: 'Inter', system-ui, sans-serif;
  --font-heading: 'Outfit', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}
```

---

## 4. Spacing & Layout

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

### Breakpoints

| Name | Width | Layout |
|------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640-1024px | Two columns, sidebar nav |
| Desktop | > 1024px | Full layout, sidebar + content |

---

## 5. Component Library (`@fullstack/ui`)

### Core Components

| Component | Description | Variants |
|-----------|-------------|----------|
| `ButtonComponent` | Primary action button | primary, secondary, outline, ghost, danger |
| `CardComponent` | Content container | default, elevated, interactive, glass |
| `BadgeComponent` | Status/label badge | success, warning, info, neutral |
| `AvatarComponent` | User photo/initials | sm, md, lg, xl |
| `ProgressBarComponent` | Linear progress | default, striped, animated |
| `ProgressCircleComponent` | Circular progress | default, with-label |
| `InputComponent` | Text input | default, error, disabled |
| `ChipComponent` | Selectable tag | default, selected, disabled |
| `ModalComponent` | Dialog overlay | default, fullscreen, bottom-sheet |
| `ToastComponent` | Notification popup | success, error, info, warning |
| `SkeletonComponent` | Loading placeholder | text, card, avatar, circle |
| `EmptyStateComponent` | No data illustration | with-action, informational |

### Gamification Components

| Component | Description |
|-----------|-------------|
| `XPBarComponent` | Animated XP progress to next level |
| `StreakFlameComponent` | Animated flame icon with streak count |
| `StarRatingComponent` | 1-3 star display for lesson score |
| `HeartComponent` | Heart icon with break animation |
| `ConfettiComponent` | Full-screen confetti celebration |
| `CoinAnimationComponent` | XP coin floating animation |

---

## 6. Screen Flows

### Screen 1: Landing / Login

```
┌─────────────────────────┐
│       🎓 fullstack      │
│      Level Up Your       │
│     Fullstack Skills     │
│                          │
│   ┌──────────────────┐   │
│   │  Continue with    │   │
│   │     Google       │   │
│   └──────────────────┘   │
│                          │
│   ┌──────────────────┐   │
│   │  Login with Email │   │
│   └──────────────────┘   │
│                          │
│   Don't have an account? │
│        Register →        │
└─────────────────────────┘
```

### Screen 2: Dashboard

```
┌─────────────────────────┐
│ 🔥 12  ⭐ Lv.5  💎 750  │  ← Header: Streak, Level, XP
├─────────────────────────┤
│ Good morning, Arjun! 👋  │
│                          │
│ ┌─ Daily Goal ────────┐  │
│ │  ◉─────── 60%      │  │  ← Circular progress
│ │  3 of 5 min done    │  │
│ └─────────────────────┘  │
│                          │
│ ┌─ Continue Learning ─┐  │
│ │ 📘 Data Binding      │  │
│ │ Angular Basics       │  │
│ │ [Continue →]         │  │
│ └─────────────────────┘  │
│                          │
│ ── Active Paths ──────── │
│ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │ FE  │ │ BE  │ │ FS  │ │  ← Path cards with progress
│ │ 45% │ │ 12% │ │ 8%  │ │
│ └─────┘ └─────┘ └─────┘ │
├─────────────────────────┤
│ 🏠  📚  🏆  👤           │  ← Bottom nav
└─────────────────────────┘
```

### Screen 3: Journey Map (Duolingo-style)

```
┌─────────────────────────┐
│ ← Angular Basics        │
│ [Beginner|Inter|Adv|Exp]│  ← Track level tabs
├─────────────────────────┤
│                          │
│ ── Ch 1: Introduction ── │
│                          │
│         ⭐⭐⭐            │  ← Completed (3 stars)
│        (Setup)           │
│           │              │
│         ⭐⭐             │  ← Completed (2 stars)
│       (Basics)           │
│           │              │
│         🟢              │  ← Available (pulsing)
│     (Data Binding)       │
│           │              │
│         🔒              │  ← Locked
│     (Directives)         │
│           │              │
│ ── Ch 2: Components ──── │
│         🔒              │
│     (Templates)          │
│                          │
└─────────────────────────┘
```

### Screen 4: Lesson Player

```
┌─────────────────────────┐
│ ✕  ████████░░░░░  ❤❤❤❤❤ │  ← Close, Progress, Hearts
├─────────────────────────┤
│                          │
│  What does {{ }} do      │
│  in Angular templates?   │
│                          │
│  ┌────────────────────┐  │
│  │ A. Two-way binding  │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ B. Interpolation ✓ │  │  ← Selected
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ C. Event binding    │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ D. Property binding │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │      CHECK ✓       │  │
│  └────────────────────┘  │
└─────────────────────────┘
```

### Screen 5: Lesson Complete

```
┌─────────────────────────┐
│                          │
│        🎉 🎊 🎉          │
│                          │
│     Lesson Complete!     │
│                          │
│       ⭐ ⭐ ⭐           │
│                          │
│     Score: 100%          │
│     XP Earned: +15       │
│     Time: 3:24           │
│                          │
│  ┌────────────────────┐  │
│  │     CONTINUE →     │  │
│  └────────────────────┘  │
│                          │
│      Share Progress      │
└─────────────────────────┘
```

---

## 7. Responsive Layout Strategy

### Mobile (< 640px)
- Full-width content
- Bottom navigation bar (Home, Learn, Leaderboard, Profile)
- Swipeable theory cards
- Stacked activity options

### Tablet (640-1024px)
- Content max-width 640px centered
- Bottom navigation bar
- Side-by-side matching columns

### Desktop (> 1024px)
- Left sidebar navigation
- Content max-width 768px centered
- Right sidebar for stats/streak widget
- Hover states on interactive elements

---

## 8. Dark Mode

Toggle between light and dark via `ThemeService`:

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme = signal<'light' | 'dark' | 'system'>('system');

  constructor() {
    effect(() => {
      const resolved = this.resolveTheme(this.theme());
      document.documentElement.setAttribute('data-theme', resolved);
    });
  }

  toggle(): void {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  private resolveTheme(pref: string): 'light' | 'dark' {
    if (pref === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return pref as 'light' | 'dark';
  }
}
```

Use `[data-theme="dark"]` selectors in Tailwind or CSS for dark mode styles.

---

## 9. Animation Specs

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Page transition | 300ms | ease-in-out | Route change |
| Button press | 150ms | ease-out | Click/tap |
| Card hover | 200ms | ease | Hover |
| XP popup float | 1500ms | ease-out | XP earned |
| Progress bar fill | 800ms | ease-in-out | Score update |
| Confetti burst | 3000ms | — | Lesson/level complete |
| Shake (wrong) | 500ms | ease-in-out | Wrong answer |
| Bounce (correct) | 400ms | spring | Correct answer |
| Heart break | 600ms | ease-out | Heart lost |
| Badge slide-up | 500ms | ease-out | Badge unlock |
