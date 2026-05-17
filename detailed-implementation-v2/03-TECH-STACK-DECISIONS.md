# Tech Stack Decisions — With Rationale

## 1. Frontend Framework: Angular 20

| Aspect | Detail |
|--------|--------|
| **Choice** | Angular 20 with Standalone Components |
| **Why** | Type safety, enterprise-grade architecture, built-in DI, signals, SSR support |
| **Alternatives Considered** | React (user not expert), Vue (smaller ecosystem), Next.js (React-based) |
| **Key Features Used** | Standalone components, Signals, Lazy loading, Angular CDK, Angular Animations |

---

## 2. Monorepo: NX Workspace

| Aspect | Detail |
|--------|--------|
| **Choice** | NX with Angular plugin |
| **Why** | Shared libs, dependency graph, affected builds, code generators |
| **Alternatives Considered** | Turborepo (less Angular integration), plain Angular workspace |
| **Key Benefits** | Independent builds per app/lib, enforce module boundaries, caching |

---

## 3. Styling: Tailwind CSS

| Aspect | Detail |
|--------|--------|
| **Choice** | Tailwind CSS v4 |
| **Why** | Utility-first, rapid prototyping, consistent design tokens, responsive |
| **Alternatives Considered** | Angular Material (opinionated), Bootstrap (dated), Vanilla CSS (slower) |
| **Design System** | Custom Tailwind theme with brand colors, spacing, typography |

---

## 4. State Management: Angular Signals + RxJS

| Aspect | Detail |
|--------|--------|
| **Choice** | Angular Signals (primary) + RxJS (async streams) |
| **Why** | Native Angular support, fine-grained reactivity, no external deps |
| **Alternatives Considered** | NgRx (too heavy for MVP), Akita, Elf |
| **Pattern** | Signal-based stores per feature, RxJS for Firebase real-time streams |

---

## 5. Backend: Firebase

| Aspect | Detail |
|--------|--------|
| **Choice** | Firebase (Auth + Firestore + Functions + Hosting + Analytics) |
| **Why** | Zero server management, real-time sync, free tier generous, auth built-in |
| **Alternatives Considered** | Supabase (newer, less mature), AWS Amplify (more complex) |
| **Migration Path** | Repository pattern abstracts Firebase — swap to NestJS/Spring Boot later |

### Firebase Services Used

| Service | Purpose | Phase |
|---------|---------|-------|
| Firebase Auth | User authentication (email, Google) | MVP |
| Cloud Firestore | Database for all app data | MVP |
| Firebase Hosting | Static hosting for Angular apps | MVP |
| Firebase Analytics | User behavior tracking | MVP |
| Cloud Functions | Server-side logic (XP calc, leaderboards) | Phase 2 |
| Cloud Storage | User avatars, content images | Phase 2 |
| Cloud Messaging | Push notifications (streak reminders) | Phase 3 |

---

## 6. UI Components

| Aspect | Detail |
|--------|--------|
| **Choice** | Angular CDK + Custom Component Library |
| **Why** | CDK provides unstyled primitives (drag-drop, overlay, a11y), we style with Tailwind |
| **Not Using** | Angular Material (too opinionated for Duolingo-style gamified UI) |

---

## 7. Animations

| Aspect | Detail |
|--------|--------|
| **Choice** | Angular Animations + CSS transitions |
| **Why** | Built-in, performant, integrates with component lifecycle |
| **Use Cases** | XP popups, lesson transitions, streak celebrations, progress bar fills |

---

## 8. Code Editor (Future)

| Aspect | Detail |
|--------|--------|
| **Choice** | Monaco Editor |
| **Why** | VS Code engine, syntax highlighting, IntelliSense, multi-language |
| **Phase** | Post-MVP — coding playground feature |

---

## 9. Testing

| Type | Tool | Why |
|------|------|-----|
| Unit | Jest | Fast, snapshot testing, good Angular support |
| Component | Angular Testing Library | User-centric testing |
| E2E | Cypress | Visual debugging, reliable, good DX |
| Coverage Target | > 80% for services, > 60% for components |

---

## 10. DevOps & CI/CD

| Aspect | Tool |
|--------|------|
| Source Control | GitHub |
| CI/CD | GitHub Actions |
| Hosting | Firebase Hosting |
| Environments | dev, staging, prod |
| Linting | ESLint + Prettier |
| Commit Convention | Conventional Commits |

---

## 11. Analytics & Observability

| Aspect | Tool | Phase |
|--------|------|-------|
| Analytics | Firebase Analytics | MVP |
| Error Tracking | Sentry | MVP |
| Performance | Firebase Performance Monitoring | Phase 2 |
| Product Analytics | PostHog / Mixpanel | Phase 3 |

---

## 12. Recommended Libraries

### Angular Ecosystem
- `@angular/router` — Routing
- `@angular/fire` — Firebase integration
- `@angular/cdk` — UI primitives
- `@angular/animations` — Animations
- `rxjs` — Reactive streams

### Utility Libraries
- `dayjs` — Date/time handling (lightweight)
- `uuid` — Unique ID generation

### Charting (Phase 2+)
- `ngx-charts` — Dashboard visualizations

---

## 13. Version Matrix

| Dependency | Version | Notes |
|-----------|---------|-------|
| Angular | 20.x | Latest stable |
| NX | 21.x | Latest compatible with Angular 20 |
| TypeScript | 5.7+ | Angular 20 requirement |
| Tailwind CSS | 4.x | Latest with new engine |
| Firebase JS SDK | 11.x | Modular tree-shakeable |
| @angular/fire | 18.x | Angular 20 compatible |
| Node.js | 22 LTS | Development and Cloud Functions |
| RxJS | 7.x | Angular 20 compatible |
