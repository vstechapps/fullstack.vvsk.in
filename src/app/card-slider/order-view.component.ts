import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderContent } from './card-slider-models';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (data.prompt) {
      <p class="order-prompt">{{ data.prompt }}</p>
    } @else {
      <p class="order-prompt">Drag or use the arrows to arrange items in the correct order.</p>
    }

    <div class="order-list">
      @for (item of items; track $index; let i = $index) {
        <div
          class="order-item"
          [class.correct]="isSubmitted() && isItemCorrect(i)"
          [class.incorrect]="isSubmitted() && !isItemCorrect(i)"
          [class.dragging]="dragIndex === i"
          [class.drag-over]="dragOverIndex === i && dragOverIndex !== dragIndex"
          draggable="true"
          (dragstart)="onDragStart(i, $event)"
          (dragend)="onDragEnd()"
          (dragover)="onDragOver(i, $event)"
          (dragleave)="onDragLeave()"
          (drop)="onDrop(i, $event)">
          <span class="order-number">{{ i + 1 }}</span>
          <span class="order-text">{{ item }}</span>
          @if (!isSubmitted()) {
            <span class="order-actions">
              <button class="move-btn" [disabled]="i === 0" (click)="moveUp(i)" title="Move up">▲</button>
              <button class="move-btn" [disabled]="i === items.length - 1" (click)="moveDown(i)" title="Move down">▼</button>
            </span>
          }
          @if (isSubmitted()) {
            <span class="order-badge">
              @if (isItemCorrect(i)) {
                <span class="badge-icon correct-icon">✓</span>
              } @else {
                <span class="badge-icon incorrect-icon">✗</span>
              }
            </span>
          }
        </div>
      }
    </div>

    @if (!isSubmitted()) {
      <button class="submit-btn" (click)="checkOrder()">Check Order</button>
    }

    @if (isSubmitted()) {
      <div class="feedback" [class.correct]="isCorrect()" [class.incorrect]="!isCorrect()">
        @if (isCorrect()) {
          <span>✓ Perfect order!</span>
        } @else {
          <span>✗ Not quite right. The correct positions are shown above.</span>
        }
      </div>
    }
  `,
  styles: [`
    .order-prompt {
      color: #94a3b8;
      font-size: 0.88rem;
      margin-bottom: 16px;
      font-style: italic;
    }
    .order-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    .order-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border: 1px solid rgba(148,163,184,0.22);
      border-radius: 10px;
      background: rgba(15,23,42,0.5);
      cursor: grab;
      transition: all 0.22s ease;
      user-select: none;
    }
    .order-item:hover:not(.correct):not(.incorrect) {
      border-color: rgba(94,234,212,0.35);
      background: rgba(15,23,42,0.7);
    }
    .order-item.dragging {
      opacity: 0.4;
      transform: scale(0.98);
    }
    .order-item.drag-over {
      border-color: #3b82f6;
      background: rgba(59,130,246,0.1);
      box-shadow: 0 0 0 1px rgba(59,130,246,0.2);
    }
    .order-item.correct {
      border-color: rgba(34,197,94,0.45);
      background: rgba(34,197,94,0.1);
    }
    .order-item.incorrect {
      border-color: rgba(239,68,68,0.45);
      background: rgba(239,68,68,0.1);
    }
    .order-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(148,163,184,0.12);
      color: #94a3b8;
      font-size: 0.82rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .order-text {
      flex: 1;
      color: #e2e8f0;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .order-actions {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex-shrink: 0;
    }
    .move-btn {
      padding: 2px 8px;
      border: 1px solid rgba(148,163,184,0.18);
      border-radius: 4px;
      background: rgba(148,163,184,0.08);
      color: #94a3b8;
      cursor: pointer;
      font-size: 0.7rem;
      line-height: 1;
      transition: all 0.15s;
    }
    .move-btn:hover:not(:disabled) {
      background: rgba(148,163,184,0.18);
      color: #e2e8f0;
    }
    .move-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .order-badge {
      flex-shrink: 0;
    }
    .badge-icon {
      font-size: 1.1rem;
      font-weight: 700;
    }
    .correct-icon { color: #4ade80; }
    .incorrect-icon { color: #f87171; }

    .submit-btn {
      width: 100%;
      padding: 11px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.92rem;
      transition: opacity 0.2s;
    }
    .submit-btn:hover { opacity: 0.88; }

    .feedback {
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 600;
    }
    .feedback.correct {
      background: rgba(34,197,94,0.14);
      border: 1px solid rgba(34,197,94,0.3);
      color: #4ade80;
    }
    .feedback.incorrect {
      background: rgba(239,68,68,0.14);
      border: 1px solid rgba(239,68,68,0.3);
      color: #f87171;
    }
  `]
})
export class OrderViewComponent implements OnInit {
  @Input({ required: true }) data!: OrderContent;
  @Output() validated = new EventEmitter<boolean>();

  items: string[] = [];
  dragIndex: number | null = null;
  dragOverIndex: number | null = null;
  isSubmitted = signal(false);
  isCorrect = signal(false);

  ngOnInit(): void {
    this.items = this.shuffle([...this.data.correctOrder]);
  }

  /* ── Drag & Drop ──────────────────────────────── */
  onDragStart(index: number, event: DragEvent): void {
    this.dragIndex = index;
    event.dataTransfer?.setData('text/plain', String(index));
  }

  onDragEnd(): void {
    this.dragIndex = null;
    this.dragOverIndex = null;
  }

  onDragOver(index: number, event: DragEvent): void {
    event.preventDefault();
    this.dragOverIndex = index;
  }

  onDragLeave(): void {
    this.dragOverIndex = null;
  }

  onDrop(targetIndex: number, event: DragEvent): void {
    event.preventDefault();
    const sourceIndex = this.dragIndex;
    if (sourceIndex === null || sourceIndex === targetIndex) return;

    const moved = this.items.splice(sourceIndex, 1)[0];
    this.items.splice(targetIndex, 0, moved);
    this.dragIndex = null;
    this.dragOverIndex = null;
  }

  /* ── Button moves ─────────────────────────────── */
  moveUp(i: number): void {
    if (i <= 0) return;
    [this.items[i], this.items[i - 1]] = [this.items[i - 1], this.items[i]];
  }

  moveDown(i: number): void {
    if (i >= this.items.length - 1) return;
    [this.items[i], this.items[i + 1]] = [this.items[i + 1], this.items[i]];
  }

  /* ── Validation ───────────────────────────────── */
  isItemCorrect(index: number): boolean {
    return this.items[index] === this.data.correctOrder[index];
  }

  checkOrder(): void {
    this.isSubmitted.set(true);
    const correct = this.items.every(
      (item, i) => item === this.data.correctOrder[i]
    );
    this.isCorrect.set(correct);
    this.validated.emit(correct);
  }

  /* ── Utils ────────────────────────────────────── */
  private shuffle(arr: string[]): string[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    // ensure shuffled order is not identical to correct
    if (a.every((v, i) => v === this.data.correctOrder[i])) {
      [a[0], a[1]] = [a[1], a[0]];
    }
    return a;
  }
}
