
# System Architecture

The platform follows a modular, scalable, config-driven architecture.

---

# High Level Architecture

Angular Application
    -> Feature Modules
    -> Shared Libraries
    -> Dynamic Activity Engine
    -> Firebase Services

Firebase
    -> Authentication
    -> Firestore
    -> Storage
    -> Cloud Functions
    -> Analytics
    -> Notifications

---

# Monorepo Architecture

Recommended structure:

apps/
    learner-app/
    admin-app/

libs/
    ui/
    auth/
    learning/
    gamification/
    quizzes/
    firebase/
    ai/
    shared/

tools/

---

# Frontend Architecture

Use:
- Angular Standalone Components
- Lazy Loading
- Feature-based modules
- Signals
- RxJS

---

# Feature Module Structure

feature-name/
    components/
    pages/
    services/
    store/
    models/
    guards/
    routes.ts

---

# Modular Design Principles

## Rule 1

Every feature should be independently removable.

## Rule 2

Features should communicate through contracts/interfaces.

## Rule 3

Avoid tight coupling.

## Rule 4

All features should support lazy loading.

---

# Dynamic Activity Renderer

Activities should not be hardcoded.

Example:

<app-dynamic-activity
    [type]="activity.type"
    [config]="activity">
</app-dynamic-activity>

Supported dynamic types:
- MCQ
- Matching
- Fill blanks
- Ordering
- Coding challenge

---

# Backend Abstraction

Firebase should be abstracted through repositories.

Example:

UserRepository
    -> FirebaseUserRepository

This allows future migration to:
- NestJS
- Spring Boot
- MongoDB
- PostgreSQL

without rewriting frontend features.

---

# Firestore Collections

users
learning_paths
chapters
lessons
activities
achievements
leaderboards
streaks
user_progress

---

# Example User Schema

{
  "id": "",
  "name": "",
  "email": "",
  "xp": 100,
  "level": 5,
  "streak": 10
}

---

# Security Architecture

Use Firebase Security Rules.

Example:

match /users/{userId} {
  allow read, write:
  if request.auth.uid == userId;
}

---

# Scalability Strategy

## Phase 1

Firebase-only architecture

## Phase 2

Introduce Cloud Functions

## Phase 3

Move heavy workloads to dedicated backend

---

# Deployment Architecture

Environment setup:

- dev
- qa
- prod

CI/CD:
- GitHub Actions
- Firebase Hosting

Pipeline:
- Lint
- Test
- Build
- Deploy

---

# Future Architecture Enhancements

- Microfrontends
- AI recommendation engine
- Plugin system
- Enterprise tenant architecture
- Real-time collaboration
- Offline learning support
