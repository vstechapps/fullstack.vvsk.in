import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeaderboardEntry, LeaderboardService } from '../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  entries: LeaderboardEntry[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private readonly leaderboardService: LeaderboardService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.entries = await this.leaderboardService.getLeaderboard();
    } catch {
      this.errorMessage = 'Unable to load the leaderboard right now.';
    } finally {
      this.isLoading = false;
    }
  }

  getUserName(entry: LeaderboardEntry): string {
    return entry.user?.name || entry.user?.email || 'Learner';
  }

  getRoadmapName(entry: LeaderboardEntry): string {
    return entry.roadmap?.title || entry.roadmap?.name || 'Fullstack learning';
  }

  getRankLabel(index: number): string {
    return index < 3 ? ['Gold', 'Silver', 'Bronze'][index] : '';
  }

}
