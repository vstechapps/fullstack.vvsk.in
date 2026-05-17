# Firebase Integration — Detailed Design

## 1. Firebase Project Setup

### Environments

| Environment | Firebase Project | Purpose |
|-------------|-----------------|---------|
| Development | `fullstack-vvsk-dev` | Local development and testing |
| Staging | `fullstack-vvsk-staging` | QA and pre-production testing |
| Production | `fullstack-vvsk-prod` | Live user-facing application |

### Services Enabled

| Service | Phase | Purpose |
|---------|-------|---------|
| Firebase Authentication | MVP | User auth (email + Google) |
| Cloud Firestore | MVP | Primary database |
| Firebase Hosting | MVP | Static app hosting |
| Firebase Analytics | MVP | User behavior tracking |
| Cloud Functions | Phase 2 | Server-side logic |
| Cloud Storage | Phase 2 | User avatars, images |
| Cloud Messaging | Phase 3 | Push notifications |

---

## 2. Angular Firebase Setup

### Environment Config

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIza...',
    authDomain: 'fullstack-vvsk-dev.firebaseapp.com',
    projectId: 'fullstack-vvsk-dev',
    storageBucket: 'fullstack-vvsk-dev.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123',
    measurementId: 'G-XXXXXXX'
  }
};
```

### App Config with Firebase Providers

```typescript
// app.config.ts
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    // Repository bindings
    { provide: UserRepository, useClass: FirebaseUserRepository },
    { provide: LearningPathRepository, useClass: FirebaseLearningPathRepository },
    { provide: LessonRepository, useClass: FirebaseLessonRepository },
    { provide: ActivityRepository, useClass: FirebaseActivityRepository },
    { provide: ProgressRepository, useClass: FirebaseProgressRepository },
    { provide: StreakRepository, useClass: FirebaseStreakRepository },
    { provide: AchievementRepository, useClass: FirebaseAchievementRepository },
    { provide: LeaderboardRepository, useClass: FirebaseLeaderboardRepository },
  ]
};
```

---

## 3. Authentication Integration

### Auth Service Implementation

```typescript
@Injectable({ providedIn: 'root' })
export class FirebaseAuthService implements AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  currentUser$ = authState(this.auth);
  isAuthenticated = signal(false);

  constructor() {
    this.currentUser$.subscribe(user => {
      this.isAuthenticated.set(!!user);
    });
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async registerWithEmail(name: string, email: string, password: string): Promise<void> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await this.createUserDocument(cred.user);
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.auth, provider);
    const userDoc = await getDoc(doc(this.firestore, `users/${cred.user.uid}`));
    if (!userDoc.exists()) {
      await this.createUserDocument(cred.user);
    }
  }

  private async createUserDocument(user: FirebaseUser): Promise<void> {
    const userData: User = {
      id: user.uid,
      email: user.email!,
      displayName: user.displayName || '',
      photoURL: user.photoURL,
      onboardingComplete: false,
      totalXP: 0,
      currentLevel: 1,
      currentStreak: 0,
      longestStreak: 0,
      lessonsCompleted: 0,
      activeLearningPaths: [],
      role: 'learner',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
      // ... other defaults
    };
    await setDoc(doc(this.firestore, `users/${user.uid}`), userData);
  }
}
```

---

## 4. Firestore Repository Examples

### Learning Path Repository

```typescript
@Injectable({ providedIn: 'root' })
export class FirebaseLearningPathRepository extends LearningPathRepository {
  private firestore = inject(Firestore);

  getAll(): Observable<LearningPath[]> {
    const ref = collection(this.firestore, 'learning_paths');
    const q = query(ref, where('isPublished', '==', true), orderBy('order'));
    return collectionData(q, { idField: 'id' }) as Observable<LearningPath[]>;
  }

  getById(pathId: string): Observable<LearningPath> {
    return docData(doc(this.firestore, `learning_paths/${pathId}`),
      { idField: 'id' }) as Observable<LearningPath>;
  }

  getByCareer(career: string): Observable<LearningPath[]> {
    const ref = collection(this.firestore, 'learning_paths');
    const q = query(ref, where('careerPath', '==', career), where('isPublished', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<LearningPath[]>;
  }
}
```

### Progress Repository

```typescript
@Injectable({ providedIn: 'root' })
export class FirebaseProgressRepository extends ProgressRepository {
  private firestore = inject(Firestore);

  getUserPathProgress(userId: string, pathId: string): Observable<UserPathProgress> {
    return docData(doc(this.firestore, `user_progress/${userId}/paths/${pathId}`)) as Observable<UserPathProgress>;
  }

  updateLessonProgress(userId: string, lessonId: string, data: Partial<UserLessonProgress>): Promise<void> {
    const ref = doc(this.firestore, `user_progress/${userId}/lessons/${lessonId}`);
    return setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  }

  getAllLessonProgress(userId: string): Observable<UserLessonProgress[]> {
    const ref = collection(this.firestore, `user_progress/${userId}/lessons`);
    return collectionData(ref, { idField: 'lessonId' }) as Observable<UserLessonProgress[]>;
  }
}
```

---

## 5. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    function isAdmin() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users
    match /users/{userId} {
      allow read: if isAuthenticated() && isOwner(userId);
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && isOwner(userId);
      allow delete: if false;
    }

    // Learning content (public read, admin write)
    match /learning_paths/{pathId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();

      match /tracks/{trackId} {
        allow read: if isAuthenticated();
        allow write: if isAdmin();

        match /chapters/{chapterId} {
          allow read: if isAuthenticated();
          allow write: if isAdmin();
        }
      }
    }

    match /lessons/{lessonId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    match /activities/{activityId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // User progress (private per user)
    match /user_progress/{userId}/{document=**} {
      allow read, write: if isAuthenticated() && isOwner(userId);
    }

    // Streaks
    match /user_streaks/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
    }

    // Achievements (read by owner, write by functions)
    match /user_achievements/{userId}/{document=**} {
      allow read: if isAuthenticated() && isOwner(userId);
      allow write: if false; // Only Cloud Functions
    }

    // Leaderboards (public read, functions write)
    match /leaderboards/{boardId}/{document=**} {
      allow read: if isAuthenticated();
      allow write: if false; // Only Cloud Functions
    }

    // Config (public read, admin write)
    match /config/{configId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

---

## 6. Cloud Functions (Phase 2)

### Functions Overview

| Function | Trigger | Purpose |
|----------|---------|---------|
| `onLessonComplete` | Firestore write on `user_progress` | Calculate XP, check badges, update leaderboard |
| `updateWeeklyLeaderboard` | Scheduled (every Monday) | Reset weekly leaderboard |
| `checkStreakReset` | Scheduled (daily) | Reset broken streaks |
| `sendStreakReminder` | Scheduled (daily evening) | Push notification for streak-at-risk users |

### Example Cloud Function

```typescript
// functions/src/onLessonComplete.ts
export const onLessonComplete = onDocumentWritten(
  'user_progress/{userId}/lessons/{lessonId}',
  async (event) => {
    const after = event.data?.after.data();
    const before = event.data?.before.data();

    if (after?.status === 'completed' && before?.status !== 'completed') {
      const userId = event.params.userId;

      // 1. Update user XP
      const userRef = admin.firestore().doc(`users/${userId}`);
      await userRef.update({
        totalXP: FieldValue.increment(after.xpEarned),
        lessonsCompleted: FieldValue.increment(1),
        lastActiveAt: FieldValue.serverTimestamp()
      });

      // 2. Update leaderboard entry
      await updateLeaderboardEntry(userId);

      // 3. Check badge conditions
      await checkBadgeUnlocks(userId);
    }
  }
);
```

---

## 7. Offline Strategy (Future)

| Aspect | Approach |
|--------|----------|
| Firestore Persistence | Enable `enableIndexedDbPersistence()` |
| Offline Lessons | Cache current lesson data in IndexedDB |
| Progress Sync | Queue progress updates, sync when online |
| Conflict Resolution | Last-write-wins with server timestamp |
