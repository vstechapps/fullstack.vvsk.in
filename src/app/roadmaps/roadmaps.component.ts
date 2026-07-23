import { Component } from '@angular/core';
import { Course } from '../app.models';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CiconComponent } from '../cicon/cicon.component';

@Component({
  selector: 'app-roadmaps',
  standalone: true,
  imports: [NgIf,NgFor,NgClass,CiconComponent],
  templateUrl: './roadmaps.component.html',
  styleUrl: './roadmaps.component.css'
})
export class RoadmapsComponent {

  courses : Course[]= [
    {
      id: 1,
      icon: "angular",
      title:"Angular Developer",
      description:"Build Dynamic apps with Angular and Typescript",
      locked:false
    },
    {
      id: 2,
      icon: "java",
      title:"Java Developer",
      description:"",
      locked:false
    },
    {
      id: 3,
      icon: "springboot",
      title:"Spring Boot Developer",
      description:"",
      locked:false
    },
    {
      id: 4,
      icon:"python",
      title:"Python Developer",
      description:"",
      locked:false
    }
  ]

}
