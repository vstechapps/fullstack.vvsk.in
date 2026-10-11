import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content" [innerHTML]="data"></div>
  `
})
export class ContentViewComponent {
  @Input({ required: true }) data!: string;
}
