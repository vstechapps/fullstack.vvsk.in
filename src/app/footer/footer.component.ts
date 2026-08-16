import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FirebaseEvent, FirebaseListener } from '../services/firebase.listener';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIf],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  socialEnabled: boolean = false;

  enabled:boolean = true;

  constructor(private firebaseListener: FirebaseListener) {
      this.firebaseListener.events$.subscribe((event) => this.handleFirebaseEvent(event));
  }

  private handleFirebaseEvent(event: FirebaseEvent): void {
      if (event.type === 'FOOTER' && event.data!=null) {
        this.enabled = event.data.enabled;
      }
    }

}
