import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { QubaComponent } from './quba/quba.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, QubaComponent],
  template: `
    <main class="app-shell">
      <header></header>
      <router-outlet></router-outlet>
      <app-footer></app-footer>
      <app-quba></app-quba>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .app-shell {
        min-height: 100vh;
      }
    `
  ]
})
export class AppComponent {}
