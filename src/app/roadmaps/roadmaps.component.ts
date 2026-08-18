import { Component } from '@angular/core';
import { Course } from '../app.models';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CiconComponent } from '../cicon/cicon.component';
import { RoadmapsService } from '../services/roadmaps.service';

@Component({
  selector: 'app-roadmaps',
  standalone: true,
  imports: [NgIf,NgFor,NgClass,CiconComponent,RouterLink],
  templateUrl: './roadmaps.component.html',
  styleUrl: './roadmaps.component.css'
})
export class RoadmapsComponent {

  courses : Course[] = [];
  constructor(private roadmapsService: RoadmapsService) {
    this.load();
  }

  async load(){
    Loader.show();
    this.courses = await this.roadmapsService.getAllRoadmaps();
    Loader.hide();
  }

}
