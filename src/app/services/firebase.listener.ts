import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface FirebaseEvent {
  type: string;
  timestamp: number;
  data: any;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseListener {
  private readonly events = new Subject<FirebaseEvent>();

  readonly events$ = this.events.asObservable();

  constructor() {
    window.addEventListener('message', this.handleMessage);
  }

  private readonly handleMessage = (event: MessageEvent) => {
    const payload = event.data;

    if (!payload || typeof payload !== 'object') {
      return;
    }

    const message = payload as FirebaseEvent;

    if (typeof message.type === 'string') {
      this.events.next(message);
    }
  };

  destroy(): void {
    window.removeEventListener('message', this.handleMessage);
  }
}
