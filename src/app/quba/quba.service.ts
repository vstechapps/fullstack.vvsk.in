import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../app.models';

export interface QubaApiResponse {
  response?: string;
  message?: string;
  answer?: string;
  text?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QubaService {
  /** Set this to the backend endpoint that accepts a user's question. */
  readonly apiUrl = 'https://api.openlib.in/quba';

  user?: User = undefined;

  constructor(public userService: UserService) {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  async ask(question: string): Promise<string> {
    let context:any = { url:window.location.href, userAgent:navigator.userAgent, language:navigator.language };
    if(this.user){
        context.user = this.user ;
    }
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question, context })
    });

    if (!response.ok) {
      throw new Error(`QUBA request failed with status ${response.status}`);
    }

    const data: QubaApiResponse | string = await response.json();
    if (typeof data === 'string') {
      return data;
    }

    const answer = data.response || data.message || data.answer || data.text;
    if (!answer) {
      throw new Error('QUBA returned an empty response');
    }

    return answer;
  }
}