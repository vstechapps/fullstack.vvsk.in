import { NgClass, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../app.models';
import { FirebaseEvent, FirebaseListener } from '../services/firebase.listener';
import { CiconComponent } from '../cicon/cicon.component';

@Component({
  selector: 'header',
  standalone: true,
  imports: [NgIf,NgClass,RouterLink,CiconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  menu:boolean = false;
  showProfileMenu = false;
  route = "";
  user?: User = undefined;
  custom?:{title:string,subtitle:string,icon:string} = undefined;

  private subscription?: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private firebaseListener: FirebaseListener
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd event:', event.url);
        this.route = event.url;
      }
    });
    this.firebaseListener.events$.subscribe((event) => this.handleFirebaseEvent(event));
  }

  private handleFirebaseEvent(event: FirebaseEvent): void {
    if (event.type === 'HEADER' && event.data!=null) {
      this.custom = event.data.custom;
    }
  }

  public exitCustom(){
    this.custom = undefined;
    Firebase.publish("TOPIC",{exit:true});
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
