import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../app.models';
import { SupportService } from '../services/support.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [NgIf, FormsModule, RouterLink],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent implements OnInit, OnDestroy {
  user?: User;
  category = 'General question';
  subject = '';
  description = '';
  isSubmitting = false;
  submitted = false;
  errorMessage = '';
  ticketId = '';

  private subscription?: Subscription;

  constructor(
    private userService: UserService,
    private supportService: SupportService
  ) {}

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

  async submitTicket(): Promise<void> {
    if (!this.user || this.isSubmitting || !this.subject.trim() || !this.description.trim()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      this.ticketId = await this.supportService.createTicket({
        category: this.category,
        subject: this.subject,
        description: this.description
      }, this.user);
      this.submitted = true;
    } catch (error) {
      console.error('Failed to create support ticket:', error);
      this.errorMessage = 'We could not submit your ticket. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  createAnotherTicket(): void {
    this.category = 'General question';
    this.subject = '';
    this.description = '';
    this.ticketId = '';
    this.submitted = false;
    this.errorMessage = '';
  }
}
