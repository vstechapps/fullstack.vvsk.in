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
          class="option-item" 
          [class.selected]="selectedId() === opt.id"
          [class.success]="isSubmitted() && opt.id === data.correctId"
          [class.error]="isSubmitted() && selectedId() === opt.id && opt.id !== data.correctId"
          [disabled]="isSubmitted()"
          (click)="selectOption(opt.id)">
          {{ opt.text }}
        </button>
      }
    </div>
    
    @if (!isSubmitted()) {
      <button class="submit-btn" [disabled]="selectedId() === null" (click)="submitAnswer()">
        Check Answer
      </button>
    }
  `,
  styles: [`
    .options-stack { display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px; }
    .option-item { padding: 12px; border: 1px solid #ccc; border-radius: 6px; text-align: left; cursor: pointer; background: white;}
    .option-item.selected { border-color: #0056b3; background: #e6f0fa; }
    .option-item.success { border-color: #28a745; background: #d4edda; color: #155724; }
    .option-item.error { border-color: #dc3545; background: #f8d7da; color: #721c24; }
    .submit-btn { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .submit-btn:disabled { background: #cccccc; cursor: not-allowed; }
  `]
})
export class McqViewComponent {
  @Input({ required: true }) data!: { options: any[], correctId: any };
  @Output() validated = new EventEmitter<boolean>();

  selectedId = signal<any>(null);
  isSubmitted = signal(false);

  selectOption(id: any) {
    this.selectedId.set(id);
  }

  submitAnswer() {
    this.isSubmitted.set(true);
    const isCorrect = this.selectedId() === this.data.correctId;
    this.validated.emit(isCorrect);
  }
}
