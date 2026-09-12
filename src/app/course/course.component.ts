import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CiconComponent } from '../cicon/cicon.component';
import { Course, UserCourseProgress } from '../app.models';
import { AppService } from '../services/app.service';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [NgIf, NgFor, CiconComponent,RouterLink],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit {
  roadmap: Course | null = null;
  userprogress: UserCourseProgress | null = null;
  completed:string[] = [];

  constructor(private route: ActivatedRoute,public app:AppService,public coursesService: CoursesService) {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.loadCourse(id);
  }

  ngOnInit(): void {

  }

  async loadCourse(id:string): Promise<void> {
    Loader.show();
    this.roadmap = await this.coursesService.getCourseById(id);
    this.userprogress = await this.coursesService.getUserProgress(id);
    if(this.userprogress && this.userprogress.tasks){
      this.completed = this.userprogress.tasks.filter(t => t.status === 'completed').map(t => t.task);
    }
    Loader.hide();
  }
}

