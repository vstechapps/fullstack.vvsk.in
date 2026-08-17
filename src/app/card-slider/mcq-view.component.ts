import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mcq-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="options-stack">
      @for (opt of data.options; track opt.id) {
        <button 
          class="btn btn-ghost" 
          [class.selected]="selectedId() === opt.id"
          [class.success]="submitted() && selectedId() === opt.id && opt.id === data.correctId"
          [class.error]="submitted() && selectedId() === opt.id && opt.id !== data.correctId"
          (click)="selectOption(opt.id)">
          {{ opt.text }}
        </button>
      }
    </div>
    <div>
      <button class="btn btn-primary" [disabled]="selectedId() === null" (click)="submitAnswer()">
        Submit
      </button>
    </div>
  `,
  styles: [`
    .options-stack { display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px; }
    .btn-ghost { text-align: left; cursor: pointer;}
    .btn-ghost.selected { border-color: var(--primary-400);background: var(--bg-soft); }
    .btn-ghost.success { border-color: #28a745; color: #155724; }
    .btn-ghost.error { border-color: #dc3545; color: #721c24; }
    .btn-primary { width: 100%; padding: 10px; border-radius: 4px; cursor: pointer; }
    .btn-primary:disabled { cursor: not-allowed; }
  `]
})
export class McqViewComponent {
  @Input({ required: true }) data!: { options: any[], correctId: any };
  @Output() validated = new EventEmitter<boolean>();
  submitted = signal(false);
  selectedId = signal<any>(null);

  selectOption(id: any) {
    this.selectedId.set(id);
  }

  submitAnswer() {
      this.submitted.set(true);
      this.validated.emit(this.selectedId() === this.data.correctId);
  }
}
