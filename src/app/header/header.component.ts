import { NgClass, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../app.models';

@Component({
  selector: 'header',
  standalone: true,
  imports: [NgIf,NgClass,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  menu:boolean = false;
  showProfileMenu = false;
  route = "";
  user?: User = undefined;

  private subscription?: Subscription;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd event:', event.url);
        this.route = event.url;
      }
    });
    Firebase.init();
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    this.subscription = this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  toggleMenu() {
    this.menu = !this.menu;
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.showProfileMenu = false;
    Firebase.logout();
    this.userService.clearUser();
  }

  login(){
    Firebase.loginWithGoogle();
  }

  onImageError(event: Event, name: string) {
    const img = event.target as HTMLImageElement;
    if (!img) {
      return;
    }

    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;
  }
}
