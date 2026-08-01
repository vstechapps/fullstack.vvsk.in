import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <main class="app-shell">
      <header></header>
      <router-outlet></router-outlet>
      <app-footer></app-footer>
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
