import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchContent } from './card-slider-models';

@Component({
  selector: 'app-match-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="match-instruction">Click an item on the left, then click its match on the right.</p>

    <div class="match-grid">
      <div class="match-column">
        @for (item of leftItems; track item) {
          <button
            class="match-item left-item"
            [class.selected]="selectedLeft() === item"
            [class.matched]="isLeftMatched(item)"
            [disabled]="isLeftMatched(item) || isSubmitted()"
            (click)="selectLeft(item)">
            {{ item }}
          </button>
        }
      </div>

      <div class="match-column">
        @for (item of shuffledRight; track item) {
          <button
            class="match-item right-item"
            [class.matched]="isRightMatched(item)"
            [class.correct]="isSubmitted() && isRightCorrect(item)"
            [class.incorrect]="isSubmitted() && isRightMatched(item) && !isRightCorrect(item)"
            [disabled]="isRightMatched(item) || !selectedLeft() || isSubmitted()"
            (click)="selectRight(item)">
            {{ item }}
          </button>
        }
      </div>
    </div>

    @if (allMatched() && !isSubmitted()) {
      <button class="submit-btn" (click)="checkMatches()">Check Matches</button>
    }

    @if (isSubmitted()) {
      <div class="feedback" [class.correct]="isCorrect()" [class.incorrect]="!isCorrect()">
        @if (isCorrect()) {
          <span>✓ All matches are correct!</span>
        } @else {
          <span>✗ Some matches were wrong. The correct pairs are highlighted.</span>
        }
      </div>
    }
  `,
  styles: [`
    .match-instruction {
      color: #94a3b8;
      font-size: 0.88rem;
      margin-bottom: 16px;
      font-style: italic;
    }
    .match-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 16px;
    }
    .match-column {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .match-item {
      padding: 11px 14px;
      border: 1px solid rgba(148,163,184,0.22);
      border-radius: 8px;
      background: rgba(15,23,42,0.5);
      color: #e2e8f0;
      cursor: pointer;
      text-align: left;
      font-size: 0.88rem;
      transition: all 0.22s ease;
      line-height: 1.4;
    }
    .match-item:hover:not(:disabled) {
      border-color: rgba(94,234,212,0.4);
      background: rgba(15,23,42,0.7);
    }
    .match-item.selected {
      border-color: #3b82f6;
      background: rgba(59,130,246,0.14);
      box-shadow: 0 0 0 1px rgba(59,130,246,0.3);
    }
    .match-item.matched {
      border-color: rgba(167,139,250,0.4);
      background: rgba(167,139,250,0.08);
      opacity: 0.65;
      cursor: default;
    }
    .match-item.correct {
      border-color: rgba(34,197,94,0.5) !important;
      background: rgba(34,197,94,0.12) !important;
      color: #4ade80 !important;
      opacity: 1 !important;
    }
    .match-item.incorrect {
      border-color: rgba(239,68,68,0.5) !important;
      background: rgba(239,68,68,0.12) !important;
      color: #f87171 !important;
      opacity: 1 !important;
    }
    .match-item:disabled { cursor: default; }

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

    @media (max-width: 480px) {
      .match-grid { grid-template-columns: 1fr; gap: 24px; }
      .match-column:first-child { border-bottom: 1px solid rgba(148,163,184,0.12); padding-bottom: 16px; }
    }
  `]
})
export class MatchViewComponent implements OnInit {
  @Input({ required: true }) data!: MatchContent;
  @Output() validated = new EventEmitter<boolean>();

  leftItems: string[] = [];
  shuffledRight: string[] = [];
  userMatches = new Map<string, string>();

  selectedLeft = signal<string | null>(null);
  isSubmitted = signal(false);
  isCorrect = signal(false);
  allMatched = signal(false);

  ngOnInit(): void {
    this.leftItems = this.data.pairs.map(p => p.left);
    this.shuffledRight = this.shuffle(this.data.pairs.map(p => p.right));
  }

  selectLeft(item: string): void {
    this.selectedLeft.set(item);
  }

  selectRight(item: string): void {
    const left = this.selectedLeft();
    if (!left) return;
    this.userMatches.set(left, item);
    this.selectedLeft.set(null);
    this.allMatched.set(this.userMatches.size === this.data.pairs.length);
  }

  isLeftMatched(item: string): boolean {
    return this.userMatches.has(item);
  }

  isRightMatched(item: string): boolean {
    return Array.from(this.userMatches.values()).includes(item);
  }

  isRightCorrect(item: string): boolean {
    for (const [left, right] of this.userMatches.entries()) {
      if (right === item) {
        const pair = this.data.pairs.find(p => p.left === left);
        return pair ? pair.right === right : false;
      }
    }
    return false;
  }

  checkMatches(): void {
    this.isSubmitted.set(true);
    const allCorrect = this.data.pairs.every(
      pair => this.userMatches.get(pair.left) === pair.right
    );
    this.isCorrect.set(allCorrect);
    this.validated.emit(allCorrect);
  }

  private shuffle(arr: string[]): string[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
