import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Quest } from '../app.models';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [NgIf,NgFor,NgClass,RouterLink],
  templateUrl: './quests.component.html',
  styleUrl: './quests.component.css'
})
export class QuestsComponent {

   quests:Quest[] = [
    {
      id: "id",
      title: 'Fix Login API Bug',
      description: 'Users cannot login with valid credentials.',
      difficulty: 'Easy',
      xp: 50,
      gems: 10,
      category: 'Backend',
      icon: '🐛',
      locked: false
    },
    {
      id: "id",
      title: 'Optimize Slow Query',
      description: 'Improve database query performance.',
      difficulty: 'Easy',
      xp: 40,
      gems: 10,
      category: 'Database',
      icon: '⚡',
      locked: false
    },
    {
      id: "id",
      title: 'Resolve 500 Error',
      description: 'Investigate production server failure.',
      difficulty: 'Medium',
      xp: 100,
      gems: 20,
      category: 'Backend',
      icon: '🛡️',
      locked: true
    },
    {
      id: "id",
      title: 'Implement Pagination API',
      description: 'Support large result sets.',
      difficulty: 'Medium',
      xp: 120,
      gems: 25,
      category: 'Backend',
      icon: '📄',
      locked: true
    },
    {
      id: "id",
      title: 'Fix Memory Leak',
      description: 'Identify and resolve heap leak.',
      difficulty: 'Hard',
      xp: 250,
      gems: 50,
      category: 'Performance',
      icon: '🔥',
      locked: true
    },
    {
      id: "id",
      title: 'Resolve SEV1 BlackDuck Vulnerability',
      description: 'Upgrade vulnerable dependencies.',
      difficulty: 'Hard',
      xp: 300,
      gems: 60,
      category: 'Security',
      icon: '🔒',
      locked: true
    }
  ];

}
