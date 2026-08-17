import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlankContent } from './card-slider-models';

@Component({
  selector: 'app-blank-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="blank-prompt" [innerHTML]="data.prompt"></div>
    <div class="blank-input-area">
      <input
        type="text"
        [(ngModel)]="userAnswer"
        [disabled]="isSubmitted()"
        placeholder="Type your answer…"
        class="blank-input"
        (keyup.enter)="userAnswer.trim() && !isSubmitted() && checkAnswer()" />
    </div>

    @if (!isSubmitted()) {
      <button class="submit-btn" [disabled]="!userAnswer.trim()" (click)="checkAnswer()">
        Check Answer
      </button>
    }

    @if (isSubmitted()) {
      <div class="feedback" [class.correct]="isCorrect()" [class.incorrect]="!isCorrect()">
        @if (isCorrect()) {
          <span>✓ Correct!</span>
        } @else {
          <span>✗ Wrong!</span>
        }
      </div>
    }
  `,
  styles: [`
    .blank-prompt {
      margin-bottom: 16px;
      line-height: 1.7;
      color: #dfe7f3;
    }
    .blank-prompt code {
      background: rgba(148,163,184,0.15);
      padding: 2px 7px;
      border-radius: 4px;
      font-family: 'Fira Code', 'Courier New', monospace;
      color: #a78bfa;
    }
    .blank-input-area {
      margin-bottom: 14px;
    }
    .blank-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid rgba(148,163,184,0.25);
      border-radius: 8px;
      background: rgba(15,23,42,0.6);
      color: #f1f5f9;
      font-size: 0.95rem;
      font-family: 'Fira Code', 'Courier New', monospace;
      outline: none;
      transition: border-color 0.25s ease;
      box-sizing: border-box;
    }
    .blank-input:focus {
      border-color: rgba(94,234,212,0.5);
      box-shadow: 0 0 0 2px rgba(94,234,212,0.08);
    }
    .blank-input:disabled { opacity: 0.55; }

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
    .submit-btn:disabled {
      background: rgba(148,163,184,0.2);
      color: rgba(255,255,255,0.45);
      cursor: not-allowed;
    }
    .submit-btn:hover:not(:disabled) { opacity: 0.88; }

    .feedback {
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 6px;
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
    .feedback strong { color: #a78bfa; }
  `]
})
export class BlankViewComponent {
  @Input({ required: true }) data!: BlankContent;
  @Output() validated = new EventEmitter<boolean>();

  userAnswer = '';
  isSubmitted = signal(false);
  isCorrect = signal(false);

  checkAnswer(): void {
    this.isSubmitted.set(true);
    const expected = this.data.answer;
    const actual = this.userAnswer.trim();
    const correct = this.data.caseSensitive
      ? actual === expected
      : actual.toLowerCase() === expected.toLowerCase();
    this.isCorrect.set(correct);
    this.validated.emit(correct);
  }
}
