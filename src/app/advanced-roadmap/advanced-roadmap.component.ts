import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Course, Position, Roadmap } from '../app.models';
import { CiconComponent } from '../cicon/cicon.component';

@Component({
  selector: 'app-advanced-roadmap',
  imports: [NgFor, NgIf, RouterLink, CiconComponent],
  templateUrl: './advanced-roadmap.component.html',
  styleUrls: ['./advanced-roadmap.component.css'],
  standalone: true
})
export class AdvancedRoadMapComponent
  implements OnChanges, AfterViewInit {


  roadmap: Roadmap | null = null;


  /**
   * SVG canvas dimensions.
   */
  canvasWidth = 1200;

  canvasHeight = 1400;


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
    y: 7
  };


  finishPosition: Position = {
    x: 93,
    y: 92
  };


  /**
   * Internal course collection.
   */
  courses: any[] = [];


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['roadmap']) {
      this.initializeRoadmap();
    }

  }


  ngAfterViewInit(): void {

    this.initializeRoadmap();

  }


  private async initializeRoadmap(): Promise<void> {

    let t = await fetch(
      'assets/data/advancedroadmaps.json'
    ); 
    this.roadmap = (await t.json())[0];
    if (!this.roadmap?.courses?.length) {

      this.courses = [];

      this.roadmapPath = '';

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
    const y = 12 + current * 78;


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