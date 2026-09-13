import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { QubaService } from './quba.service';

interface ChatMessage {
  role: 'user' | 'quba';
  text: string;
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
  isLoading = false;
  question = '';
  errorMessage = '';
  messages: ChatMessage[] = [
    {
      role: 'quba',
      text: 'Hi, I am QUBA, your AI Tech Career Advisor. Ask me about roadmaps, skills, projects, or your next career step.'
    }
  ];

  constructor(private readonly qubaService: QubaService) {}

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
    this.question = '';
    this.errorMessage = '';
    this.isLoading = true;

    try {
      const response = await this.qubaService.ask(question);
      this.messages.push({ role: 'quba', text: response });
    } catch {
      this.errorMessage = 'I could not reach the advisor right now. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void this.sendMessage();
    }
  }

}
