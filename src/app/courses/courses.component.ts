
import { Component } from '@angular/core';
import { Course } from '../app.models';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CiconComponent } from '../cicon/cicon.component';
import { RoadmapsService } from '../services/roadmaps.service';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-courses',
  standalone: true,
   imports: [NgIf,NgFor,NgClass,CiconComponent,RouterLink],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {

  courses : Course[] = [];
  constructor(private coursesService: CoursesService) {
    this.load();
  }

  async load(){
    Loader.show();
    this.courses = await this.coursesService.getAllCourses();
    Loader.hide();
  }

}
