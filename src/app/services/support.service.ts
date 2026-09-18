import { Injectable } from '@angular/core';
import { User } from '../app.models';

export interface SupportTicketInput {
  category: string;
  subject: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  async createTicket(input: SupportTicketInput, user: User): Promise<string> {
    const ticketId = `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();

    await Firebase.write('support', ticketId, {
      id: ticketId,
      category: input.category,
      subject: input.subject.trim(),
      description: input.description.trim(),
      status: 'open',
      createdAt: now,
      updatedAt: now,
      submittedBy: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || '',
        contact: user.contact || ''
      }
    });

    return ticketId;
  }
}
