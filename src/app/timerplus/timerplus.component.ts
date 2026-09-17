import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'timer-plus',
  standalone: true,
  imports: [],
  templateUrl: './timerplus.component.html',
  styleUrl: './timerplus.component.css'
})
export class TimerPlusComponent implements OnInit, OnChanges, OnDestroy {
  @Input() duration: string | number = '3s';
  @Input() resetKey: string | number = 0;
  @Output() completed = new EventEmitter<void>();

  progressPercent = 0;
  isComplete = false;

  private animationFrameId?: number;
  private startTime = 0;
  private durationMilliseconds = 0;
  private hasEmittedCompletion = false;

  ngOnInit(): void {
    this.start();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const durationChanged = changes['duration'] && !changes['duration'].firstChange;
    const resetKeyChanged = changes['resetKey'] && !changes['resetKey'].firstChange;

    if (durationChanged || resetKeyChanged) {
      this.start();
    }
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  private start(): void {
    this.stopAnimation();
    this.progressPercent = 0;
    this.isComplete = false;
    this.hasEmittedCompletion = false;
    this.durationMilliseconds = this.parseDuration(this.duration) * 1000;

    if (this.durationMilliseconds === 0) {
      this.complete();
      return;
    }

    this.startTime = performance.now();
    this.animationFrameId = requestAnimationFrame((timestamp) => this.update(timestamp));
  }

  private update(timestamp: number): void {
    const elapsed = timestamp - this.startTime;
    this.progressPercent = Math.min(100, (elapsed / this.durationMilliseconds) * 100);

    if (this.progressPercent >= 100) {
      this.complete();
      return;
    }

    this.animationFrameId = requestAnimationFrame((nextTimestamp) => this.update(nextTimestamp));
  }

  private complete(): void {
    this.stopAnimation();
    this.progressPercent = 100;
    this.isComplete = true;

    if (!this.hasEmittedCompletion) {
      this.hasEmittedCompletion = true;
      this.completed.emit();
    }
  }

  private stopAnimation(): void {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  private parseDuration(value: string | number): number {
    if (typeof value === 'number') {
      return Math.max(0, value);
    }

    const match = value.trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(s|m)$/);
    if (!match) {
      return 0;
    }

    const amount = Number(match[1]);
    return Math.max(0, amount * (match[2] === 'm' ? 60 : 1));
  }
}
