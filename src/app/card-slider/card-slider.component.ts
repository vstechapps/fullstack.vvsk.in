import { Component, Input, input, Output, EventEmitter, signal, computed, HostListener, OnInit, effect } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { SliderCard } from './card-slider-models';
import { McqViewComponent } from './mcq-view.component';
import { BlankViewComponent } from './blank-view.component';
import { MatchViewComponent } from './match-view.component';
import { OrderViewComponent } from './order-view.component';
import { CodeViewComponent } from './code-view.component';
import { TimerComponent } from '../timer/timer.component';
import { TimerPlusComponent } from '../timerplus/timerplus.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-card-slider',
  standalone: true,
  imports: [CommonModule, NgFor, McqViewComponent, BlankViewComponent, MatchViewComponent, OrderViewComponent, CodeViewComponent, TimerComponent, TimerPlusComponent],
  templateUrl: './card-slider.component.html',
  styleUrls: ['./card-slider.component.css']
})
export class CardSliderComponent implements OnInit {

  _cards : SliderCard[] = [];
  currentIndex = 0;
  currentCard?:SliderCard;
  transitionClass = 'slide-idle';
  isTransitioning = false;
  private pointerStartY: number | null = null;

  cards = input.required<SliderCard[]>();
  @Output() activityComplete = new EventEmitter<void>();

  isFirst = () => this.currentIndex === 0;
  isLast = () => this.currentIndex === this._cards.length - 1;

  span:boolean = true;

 constructor(private userService:UserService) {
    effect(() => {
      this._cards = this.cards();
      for(var i in this._cards){
          if(!this.span && this._cards[i].type=="content"){
            this._cards[i].completed=true;
          }
        }
      this.currentIndex=0;
      this.currentCard = this._cards[this.currentIndex];
    });

    this.userService.user$.subscribe(u=>{
      console.log("456456456",u);
      if(u!=null && u.preferences!=null && u.preferences.span!==null){
        this.span = u.preferences.span;
        for(var i in this._cards){
          if(!this.span && this._cards[i].type=="content"){
            this._cards[i].completed=true;
          }
        }
      }
    })
  }

  onTimeUp(): void {
    if (this.currentCard && this.currentCard.type == 'content') {
      this.currentCard.completed = true;
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
    if (!this.currentCard?.completed || this.isTransitioning) return;

    if (!this.isLast()) {
      this.changeCard(this.currentIndex + 1, 'slide-out-up');
    } else {
      this.finishActivity();
    }
  }

  prev(): void {
    if (!this.isFirst() && !this.isTransitioning) {
      this.changeCard(this.currentIndex - 1, 'slide-out-down');
    }
  }

  onPointerDown(event: PointerEvent): void {
    this.pointerStartY = event.clientY;
  }

  onPointerUp(event: PointerEvent): void {
    if (this.pointerStartY === null || this.isTransitioning) {
      this.pointerStartY = null;
      return;
    }

    const distance = event.clientY - this.pointerStartY;
    this.pointerStartY = null;

    if (Math.abs(distance) < 55) {
      return;
    }

    if (distance < 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  private changeCard(index: number, exitClass: string): void {
    this.isTransitioning = true;
    this.transitionClass = exitClass;

    window.setTimeout(() => {
      this.currentIndex = index;
      this.currentCard = this._cards[index];
      this.transitionClass = exitClass === 'slide-out-up'
        ? 'slide-in-from-bottom'
        : 'slide-in-from-top';

      window.setTimeout(() => {
        this.transitionClass = 'slide-idle';
        this.isTransitioning = false;
      }, 280);
    }, 180);
  }

  public finishActivity(): void {
    this.activityComplete.emit();
  }
}
