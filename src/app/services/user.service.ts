import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseListener, FirebaseEvent } from './firebase.listener';
import { User } from '../app.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userSubject = new BehaviorSubject<User | undefined>(undefined);
  readonly user$ = this.userSubject.asObservable();

  constructor(private firebaseListener: FirebaseListener) {
    this.firebaseListener.events$.subscribe((event) => this.handleFirebaseEvent(event));
  }

  get user(): User | undefined {
    return this.userSubject.value;
  }

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  clearUser(): void {
    this.userSubject.next(undefined);
  }

  private handleFirebaseEvent(event: FirebaseEvent): void {
    if (event.type === 'USER_REFRESH') {
      const user = event.data as User;
      if (user && typeof user === 'object' && 'id' in user && 'name' in user) {
        this.setUser(user);
      }
    }
  }
}
