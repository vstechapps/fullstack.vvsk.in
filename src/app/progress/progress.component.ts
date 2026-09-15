import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course, UserCourseProgress } from '../app.models';
import { RoadmapsService } from '../services/roadmaps.service';
import { UserService } from '../services/user.service';
import { CiconComponent } from '../cicon/cicon.component';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, RouterLink,CiconComponent],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

  courses: Course[] = [];
  progressMap: Record<string, { course: Course; progress: UserCourseProgress | null }> = {};
  showResetModal = false;
  courseToReset: Course | null = null;

  constructor(
    private coursesService: CoursesService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadProgress();
  }

  async loadProgress(): Promise<void> {
    Loader.show();
    try {
      this.courses = [];
      this.progressMap = {};

      const allCourses = await this.coursesService.getAllCourses();
      for (const course of allCourses) {
        const progress = await this.coursesService.getCourseProgress(course.id);
        if (progress) {
          this.progressMap[course.id] = { course, progress };
          this.courses.push(course);
        }
      }
    } finally {
      Loader.hide();
    }
  }

  getProgressValue(courseId: string): number {
    const value = Number(this.progressMap[courseId]?.progress?.percent ?? 0);
    return Number.isFinite(value) ? value : 0;
  }

  openResetPrompt(course: Course): void {
    this.courseToReset = course;
    this.showResetModal = true;
  }

  closeResetPrompt(): void {
    this.showResetModal = false;
    this.courseToReset = null;
  }

  async resetRoadmapProgress(): Promise<void> {
    if (!this.courseToReset) {
      return;
    }

    const user = this.userService.user;
    if (!user) {
      this.closeResetPrompt();
      return;
    }

    const course = this.courseToReset;
    const resetProgress: UserCourseProgress = {
      user: user.id,
      course: course.id,
      started: false,
      next: course.topics?.[0]?.id || '',
      status: 'not_started',
      percent: '0',
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.coursesService.updateUserProgress(course.id, resetProgress);
    this.progressMap[course.id] = { course, progress: resetProgress };
    this.closeResetPrompt();
  }
}
