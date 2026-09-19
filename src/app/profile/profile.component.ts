import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../app.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user?: User;
  private subscription?: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.user;
    this.subscription = this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  login(): void {
    Firebase.loginWithGoogle();
  }

  logout(): void {
    Firebase.logout();
    this.userService.clearUser();
  }

  toggleAttentionSpan(){
    if (!this.user) {
      return;
    }
   else if (this.user.preferences == null) {
      this.user.preferences={span: true};
    } else if (this.user.preferences.span == null || this.user.preferences.span == false) {
      this.user.preferences.span = true;
    }
    else {
      this.user.preferences.span = false;
    }

  }

  async save(): Promise<void> {
    if (!this.user) {
      return;
    }
    const user = { ...this.user};
    this.userService.setUser(user);

    try {
      Loader.show();
      await Firebase.write('users', user.id, this.user);
      Loader.hide();
      alert("User Preferences Updated!");
    } catch (error) {
      console.error('Failed to update user preferences', error);
    }
  }

  onImageError(event: Event, name: string): void {
    const img = event.target as HTMLImageElement;
    if (!img) {
      return;
    }
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;
  }
}
