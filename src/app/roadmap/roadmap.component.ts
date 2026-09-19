import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  Component,
} from '@angular/core';
import { Position, Roadmap, UserCourseProgress } from '../app.models';
import { CiconComponent } from '../cicon/cicon.component';
import { RoadmapsService } from '../services/roadmaps.service';


@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [NgIf, NgFor, CiconComponent,RouterLink],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.css'
})
export class RoadmapComponent {

  roadmap: Roadmap | null = null;

  courseProgress: UserCourseProgress[] = [];


  /**
   * SVG canvas dimensions.
   */
  canvasWidth = 300;

  get canvasHeight(): number {
    return this.courses.length > 5 ? 800 : 400;
  }


  /**
   * Generated SVG path.
   */
  roadmapPath = '';

  completedPath = '';


  /**
   * Start / finish.
   */
  startPosition: Position = {
    x: 7,
    y: 5
  };


  finishPosition: Position = {
    x: 93,
    y: 95
  };


  /**
   * Internal course collection.
   */
  courses: any[] = [];

   constructor(private route: ActivatedRoute,public roadmapsService: RoadmapsService) {
      const id = this.route.snapshot.paramMap.get('id') || '';
      this.loadRoadMap(id);
    }


  private async loadRoadMap(id:string): Promise<void> {

    this.roadmap = await this.roadmapsService.getRoadmapById(id);
    this.courseProgress = await this.roadmapsService.getRoadmapProgress(id) || [];
    
    if (!this.roadmap?.courses?.length) {

      this.courses = [];

      this.roadmapPath = '';

      this.completedPath = '';

      return;

    }

    this.courses = this.roadmap.courses.map(
      (course, index) => {

        const position = this.generatePosition(index, this.roadmap!.courses!.length);

        const cardPosition = this.generateCardPosition(index);

        return {
          ...course,
          _position: position,
          _cardPosition: cardPosition
        };

      }
    );

    console.log('Courses:', this.courses);

    this.generatePath();

    this.generateCompletedPath();

  }


  /**
   * Automatically position courses
   * Creates a winding journey:
   *
   *       ●
   *     ●
   *       ●
   *     ●
   *       ●
   */
  private generatePosition(
    index: number,
    total: number
  ): Position {

    if (total === 1) {
      return {
        x: 50,
        y: 50
      };
    }


    const current = index / (total - 1);

    /*
     * Keep courses away from edges.
     */
    const courseStartY = total > 5 ? 11 : 20;
    const courseTravelY = total > 5 ? 69 : 60;
    const y = courseStartY + current * courseTravelY;


    /*
     * Alternate left / right.
     */
    let x: number;


    if (index % 2 === 0) {

      x = 25;

    } else {

      x = 75;

    }

    /*
     * Slight variation so the path
     * doesn't look mechanically identical.
     */
    const variation =
      ((index % 3) - 1) * 4;


    x += variation;

    return {
      x: this.clamp(x, 12, 88),
      y: this.clamp(y, 8, 90)
    };

  }


  /**
   * Automatically decide where the card
   * should appear relative to the node.
   */
  private generateCardPosition(
    index: number
  ): 'left' | 'right' | 'top' | 'bottom' {

    if (index % 4 === 0) {

      return 'right';

    }

    if (index % 4 === 1) {

      return 'left';

    }

    if (index % 4 === 2) {

      return 'right';

    }

    return 'left';

  }


  /**
   * Generate SVG journey path.
   */
  private generatePath(): void {

    if (!this.courses.length) {

      return;

    }

    const points: Array<{
      x: number;
      y: number;
    }> = [];


    /*
     * Start point.
     */
    points.push({
      x: this.percentToX(this.startPosition.x),
      y: this.percentToY(this.startPosition.y)
    });


    /*
     * Course nodes.
     */
    this.courses.forEach(course => {

      points.push({
        x: this.percentToX(course._position.x),
        y: this.percentToY(course._position.y)
      });

    });


    /*
     * Finish.
     */
    points.push({
      x: this.percentToX(this.finishPosition.x),
      y: this.percentToY(this.finishPosition.y)
    });


    this.roadmapPath = this.createSmoothPath(points);

  }


  /**
   * Generate the completed overlay for the contiguous completed route.
   */
  private generateCompletedPath(): void {

    if (!this.courses.length) {

      this.completedPath = '';

      return;

    }

    const points: Array<{ x: number; y: number }> = [
      {
        x: this.percentToX(this.startPosition.x),
        y: this.percentToY(this.startPosition.y)
      }
    ];

    for (let index = 0; index < this.courses.length; index++) {

      if (!this.isCourseCompleted(this.courses[index].id)) {

        break;

      }

      points.push({
        x: this.percentToX(this.courses[index]._position.x),
        y: this.percentToY(this.courses[index]._position.y)
      });

    }

    if (points.length === 1) {

      this.completedPath = '';

      return;

    }

    if (points.length === this.courses.length + 1) {

      points.push({
        x: this.percentToX(this.finishPosition.x),
        y: this.percentToY(this.finishPosition.y)
      });

    }

    this.completedPath = this.createSmoothPath(points);

  }


  private isCourseCompleted(courseId: string): boolean {

    return this.courseProgress.some(progress =>
      progress.course === courseId &&
      progress.status?.toLowerCase() === 'completed'
    );

  }


  /**
   * Creates a smooth cubic Bézier path.
   */
  private createSmoothPath(
    points: Array<{ x: number; y: number }>
  ): string {

    if (!points.length) {

      return '';

    }


    if (points.length === 1) {

      return `M ${points[0].x} ${points[0].y}`;

    }


    let path =
      `M ${points[0].x} ${points[0].y}`;


    for (let i = 0; i < points.length - 1; i++) {

      const current = points[i];

      const next = points[i + 1];


      /*
       * Vertical distance.
       */
      const dy =
        next.y - current.y;


      /*
       * Control points.
       *
       * This makes the path curve smoothly
       * between the nodes.
       */
      const controlDistance =
        Math.abs(dy) * 0.45;


      const cp1x =
        current.x;

      const cp1y =
        current.y + controlDistance;


      const cp2x =
        next.x;

      const cp2y =
        next.y - controlDistance;


      path +=
        ` C ${cp1x} ${cp1y},
             ${cp2x} ${cp2y},
             ${next.x} ${next.y}`;
    }


    return path;

  }


  private percentToX(
    percent: number
  ): number {

    return (
      this.canvasWidth *
      percent /
      100
    );

  }


  private percentToY(
    percent: number
  ): number {

    return (
      this.canvasHeight *
      percent /
      100
    );

  }


  private clamp(
    value: number,
    min: number,
    max: number
  ): number {

    return Math.min(
      Math.max(value, min),
      max
    );

  }


  get totalXp(): number {
    return this.courses.reduce(
      (total, course) => total + (course.xp || 0),
      0
    );
  }

  get totalQuests(): number {
    return this.courses.reduce(
      (total, course) => total + (course.questCount || 0),
      0
    );
  }


  /**
   * Fallback icons.
   */
  getDefaultIcon(
    category?: string
  ): string {

    switch (
    category?.toLowerCase()
    ) {

      case 'java':
        return '☕';

      case 'spring':
      case 'springboot':
        return '🌱';

      case 'frontend':
        return '🌐';

      case 'javascript':
        return 'JS';

      case 'database':
        return '🗄';

      case 'devops':
        return '⚙';

      case 'angular':
        return 'A';

      case 'docker':
        return '🐳';

      case 'kubernetes':
        return '☸';

      default:
        return '◆';

    }

  }


  trackCourse(index: number, course: any): string {
    return course.id;
  }

}