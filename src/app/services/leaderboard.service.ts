import { Injectable } from '@angular/core';

export interface LeaderboardUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
}

export interface LeaderboardRoadmap {
  id?: string;
  title?: string;
  name?: string;
}

export interface LeaderboardEntry {
  id?: string;
  user?: LeaderboardUser;
  roadmap?: LeaderboardRoadmap;
  currentXp: number;
  streak?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private entries: LeaderboardEntry[] = [];

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (this.entries.length === 0) {
      const docs = await Firebase.read('leaderboard');
      this.entries = (docs.data || [])
        .map((entry: any) => this.normalizeEntry(entry))
        .sort((left, right) => right.currentXp - left.currentXp);
    }

    return this.entries;
  }

  private normalizeEntry(entry: any): LeaderboardEntry {
    return {
      id: entry.id,
      user: entry.user || {},
      roadmap: entry.roadmap || {},
      currentXp: this.toNumber(entry.currentXp ?? entry.xp ?? entry.currentXP),
      streak: this.toNumber(entry.streak ?? entry.streakDays)
    };
  }

  private toNumber(value: unknown): number {
    const numberValue = Number(value ?? 0);
    return Number.isFinite(numberValue) ? numberValue : 0;
  }
}