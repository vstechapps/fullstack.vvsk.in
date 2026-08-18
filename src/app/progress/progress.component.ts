import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course, UserRoadMapProgress } from '../app.models';
import { RoadmapsService } from '../services/roadmaps.service';
import { UserService } from '../services/user.service';
import { CiconComponent } from '../cicon/cicon.component';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, RouterLink,CiconComponent],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

  roadmaps: Course[] = [];
  progressMap: Record<string, { roadmap: Course; progress: UserRoadMapProgress | null }> = {};
  showResetModal = false;
  roadmapToReset: Course | null = null;

  constructor(
    private roadmapsService: RoadmapsService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadProgress();
  }

  async loadProgress(): Promise<void> {
    Loader.show();
    try {
      this.roadmaps = [];
      this.progressMap = {};

      const allRoadmaps = await this.roadmapsService.getAllRoadmaps();
      for (const roadmap of allRoadmaps) {
        const progress = await this.roadmapsService.getUserProgress(roadmap.id);
        if (progress) {
          this.progressMap[roadmap.id] = { roadmap, progress };
          this.roadmaps.push(roadmap);
        }
      }
    } finally {
      Loader.hide();
    }
  }

  getProgressValue(roadmapId: string): number {
    const value = Number(this.progressMap[roadmapId]?.progress?.percent ?? 0);
    return Number.isFinite(value) ? value : 0;
  }

  openResetPrompt(roadmap: Course): void {
    this.roadmapToReset = roadmap;
    this.showResetModal = true;
  }

  closeResetPrompt(): void {
    this.showResetModal = false;
    this.roadmapToReset = null;
  }

  async resetRoadmapProgress(): Promise<void> {
    if (!this.roadmapToReset) {
      return;
    }

    const user = this.userService.user;
    if (!user) {
      this.closeResetPrompt();
      return;
    }

    const roadmap = this.roadmapToReset;
    const resetProgress: UserRoadMapProgress = {
      user: user.id,
      roadmap: roadmap.id,
      started: false,
      next: roadmap.topics?.[0]?.id || '',
      status: 'not_started',
      percent: '0',
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.roadmapsService.updateUserProgress(roadmap.id, resetProgress);
    this.progressMap[roadmap.id] = { roadmap, progress: resetProgress };
    this.closeResetPrompt();
  }
}
