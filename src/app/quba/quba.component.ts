import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { QubaChatMessage, QubaService } from './quba.service';
import { marked } from 'marked';
import { FirebaseEvent, FirebaseListener } from '../services/firebase.listener';

interface ChatMessage extends QubaChatMessage {
  renderedText?: string;
}

@Component({
  selector: 'app-quba',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './quba.component.html',
  styleUrl: './quba.component.css'
})
export class QubaComponent {
  isOpen = false;
  enabled = true;
  isLoading = false;
  question = '';
  errorMessage = '';
  messages: ChatMessage[] = [];

  constructor(private readonly qubaService: QubaService,private firebaseListener: FirebaseListener) {
    const savedMessages = this.qubaService.getChatHistory();
    this.messages = savedMessages.length > 0
      ? savedMessages.map(message => this.renderMessage(message))
      : [this.renderMessage({
        role: 'quba',
        text: 'Hi, I am QUBA, your AI Tech Career Advisor. Ask me about fullstack skills, projects, or your next career step.'
      })];
    this.saveChatHistory();
    this.firebaseListener.events$.subscribe((event) => this.handleFirebaseEvent(event));
  }

  private handleFirebaseEvent(event: FirebaseEvent): void {
    if (event.type === 'QUBA' && event.data!=null) {
      this.enabled = event.data.enabled;
      this.isOpen = event.data.isOpen || this.isOpen;
      if(event.data.message){
        if(this.messages.length === 1 && this.messages[0].role === 'quba' && this.messages[0].text.startsWith('Hi, I am QUBA')){
          this.messages[0] = this.renderMessage({ role: 'quba', text: event.data.message });
        }
      }
    }
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    this.errorMessage = '';
  }

  async sendMessage(): Promise<void> {
    const question = this.question.trim();
    if (!question || this.isLoading) {
      return;
    }

    this.messages.push({ role: 'user', text: question });
    this.saveChatHistory();
    this.question = '';
    this.errorMessage = '';
    this.isLoading = true;

    try {
      const response = await this.qubaService.ask(question, this.getApiChatHistory());
      this.messages.push(this.renderMessage({ role: 'quba', text: response }));
      this.saveChatHistory();
    } catch {
      this.errorMessage = 'I could not reach the advisor right now. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private renderMessage(message: QubaChatMessage): ChatMessage {
    return {
      ...message,
      renderedText: message.role === 'quba'
        ? marked.parse(message.text) as string
        : undefined
    };
  }

  private getApiChatHistory(): QubaChatMessage[] {
    return this.messages.map(({ role, text }) => ({ role, text }));
  }

  private saveChatHistory(): void {
    this.qubaService.saveChatHistory(this.getApiChatHistory());
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void this.sendMessage();
    }
  }

}
