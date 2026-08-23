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
  selector: 'timer',
  standalone: true,
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() duration: string | number = '3s';
  @Input() resetKey: string | number = 0;
  @Output() completed = new EventEmitter<void>();

  remainingSeconds = 0;
  isComplete = false;

  private intervalId?: ReturnType<typeof setInterval>;
  private endTime = 0;

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
    this.stopInterval();
  }

  get minutes(): string {
    return Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
  }

  get seconds(): string {
    return (this.remainingSeconds % 60).toString().padStart(2, '0');
  }

  private start(): void {
    this.stopInterval();
    this.remainingSeconds = this.parseDuration(this.duration);
    this.isComplete = this.remainingSeconds === 0;

    if (this.isComplete) {
      this.completed.emit();
      return;
    }

    this.endTime = Date.now() + this.remainingSeconds * 1000;
    this.intervalId = setInterval(() => this.update(), 250);
  }

  private update(): void {
    const remainingMilliseconds = Math.max(0, this.endTime - Date.now());
    this.remainingSeconds = Math.ceil(remainingMilliseconds / 1000);

    if (remainingMilliseconds === 0) {
      this.isComplete = true;
      this.stopInterval();
      this.completed.emit();
    }
  }

  private stopInterval(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private parseDuration(value: string | number): number {
    if (typeof value === 'number') {
      return Math.max(0, Math.ceil(value));
    }

    const match = value.trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(s|m)$/);
    if (!match) {
      return 0;
    }

    const amount = Number(match[1]);
    return Math.max(0, Math.ceil(amount * (match[2] === 'm' ? 60 : 1)));
  }

}
