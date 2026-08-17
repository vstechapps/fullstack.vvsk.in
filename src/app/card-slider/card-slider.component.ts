import { Component, Input, input, Output, EventEmitter, signal, computed, HostListener, OnInit, effect } from '@angular/core';
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

  _cards : SliderCard[] = [];
  currentIndex = 0;
  currentCard?:SliderCard;

  cards = input.required<SliderCard[]>();
  @Output() activityComplete = new EventEmitter<void>();

  isFirst = () => this.currentIndex === 0;
  isLast = () => this.currentIndex === this._cards.length - 1;

 constructor() {
    effect(() => {
      this._cards = this.cards();
      this.currentIndex=0;
      this.currentCard = this._cards[this.currentIndex];
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const reachedBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;

    if (reachedBottom && this.currentCard) {
      if(this.currentCard.type=="content"){
        this.currentCard.completed = true;
      }
    }
  }

  ngOnInit(): void {
  }


  // Child modules hit this output when answers match correctly
  onAnswerEvaluated(isValid: boolean): void {
    if (isValid && this.currentCard) {
      this.currentCard.completed = true;
    }
  }

  next(): void {
    if (!this.currentCard?.completed) return;

    if (!this.isLast()) {
      this.currentIndex= this.currentIndex + 1;
      this.currentCard=this._cards[this.currentIndex];
    } else {
      this.finishActivity();
    }
  }

  prev(): void {
    if (!this.isFirst()) {
      this.currentIndex= this.currentIndex - 1;
      this.currentCard=this._cards[this.currentIndex];
    }
  }

  public finishActivity(): void {
    this.activityComplete.emit();
  }
}
