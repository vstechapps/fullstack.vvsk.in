import { Component, Input, Output, EventEmitter, signal, computed, HostListener, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { SliderCard } from './card-slider-models';
import { McqViewComponent } from './mcq-view.component';
import { BlankViewComponent } from './blank-view.component';
import { MatchViewComponent } from './match-view.component';
import { OrderViewComponent } from './order-view.component';
import { CodeViewComponent } from './code-view.component';

@Component({
  selector: 'app-card-slider',
  standalone: true,
  imports: [CommonModule, NgFor, McqViewComponent, BlankViewComponent, MatchViewComponent, OrderViewComponent, CodeViewComponent],
  templateUrl: './card-slider.component.html',
  styleUrls: ['./card-slider.component.css']
})
export class CardSliderComponent implements OnInit {
  @Input({ required: true }) cards: SliderCard[] = [];
  @Output() activityComplete = new EventEmitter<void>();

  // Tracks active index position
  currentIndex = signal(0);
  
  // Current active card evaluation tracking
  isCurrentCardValid = signal(false);

  // Compute references for template layout
  currentCard = computed(() => this.cards[this.currentIndex()]);
  isFirst = computed(() => this.currentIndex() === 0);
  isLast = computed(() => this.currentIndex() === this.cards.length - 1);

  // Offset computation for single horizontal slide transition
  transformStyle = computed(() => `translateX(-${this.currentIndex() * 100}%)`);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const reachedBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;

    if (reachedBottom) {
      const card = this.currentCard();
      if(card.type=="content"){
        card.completed = true;
        this.updateValidationState();
      }
    }
  }

  ngOnInit(): void {
    this.updateValidationState();
  }

  // Run automatically when moving slides to check if it was pre-validated
  private updateValidationState(): void {
    const card = this.currentCard();
    // 'content' types are always instantly passable
    if (card.completed) {
      this.isCurrentCardValid.set(true);
    } else {
      this.isCurrentCardValid.set(false);
    }
  }

  // Child modules hit this output when answers match correctly
  onAnswerEvaluated(isValid: boolean): void {
    this.isCurrentCardValid.set(isValid);
    if (isValid) {
      this.cards[this.currentIndex()].completed = true;
    }
  }

  next(): void {
    if (!this.isCurrentCardValid()) return;

    if (!this.isLast()) {
      this.currentIndex.update(idx => idx + 1);
      this.updateValidationState();
    } else {
      this.finishActivity();
    }
  }

  prev(): void {
    if (!this.isFirst()) {
      this.currentIndex.update(idx => idx - 1);
      this.updateValidationState();
    }
  }

  public reset(): void {
    this.currentIndex.set(0);
  }

  public finishActivity(): void {
    this.reset();
    this.activityComplete.emit();
  }
}
