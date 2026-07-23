import { Component } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

interface HeroArticle {
  icon: string;
  iconClass?: string;
  title: string;
  description: string;
}

@Component({
  selector: 'hero2',
  standalone: true,
  imports: [NgFor,NgClass],
  templateUrl: './hero2.component.html',
  styleUrl: './hero2.component.css'
})
export class Hero2Component {
  articles: HeroArticle[] = [
    {
      icon: '🎯',
      iconClass: 'icon-circle',
      title: 'Structured Learning Paths',
      description: 'Follow guided roadmaps from beginner to production-ready Full Stack Engineer.'
    },
    {
      icon: '🏆',
      iconClass: 'icon-circle',
      title: 'Gamified Experience',
      description: 'Earn XP, gems, streaks, badges and unlock new levels as you progress.'
    },
    {
      icon: '🤖',
      iconClass: 'icon-circle',
      title: 'AI Mentor',
      description: 'Get hints, guidance, review your code and evaluate task completions'
    },
    {
      icon: '💼',
      iconClass: 'icon-circle',
      title: 'Job Ready Skills',
      description: 'Master the practical skills companies actually hire and pay for.'
    }
  ];
}
