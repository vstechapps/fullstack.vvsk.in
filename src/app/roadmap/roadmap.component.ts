import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CiconComponent } from '../cicon/cicon.component';
import { Course, UserRoadMapProgress } from '../app.models';
import { AppService } from '../services/app.service';
import { RoadmapsService } from '../services/roadmaps.service';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [NgIf, NgFor, CiconComponent,RouterLink],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.css'
})
export class RoadmapComponent implements OnInit {
  roadmap: Course | null = null;
  userprogress: UserRoadMapProgress | null = null;
  completed:string[] = [];

  constructor(private route: ActivatedRoute,public app:AppService,public roadmapsService: RoadmapsService) {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.loadRoadmap(id);
  }

  ngOnInit(): void {

  }

  async loadRoadmap(id:string): Promise<void> {
    Loader.show();
    this.roadmap = await this.roadmapsService.getRoadmapById(id);
    this.userprogress = await this.roadmapsService.getUserProgress(id);
    if(this.userprogress && this.userprogress.tasks){
      this.completed = this.userprogress.tasks.filter(t => t.status === 'completed').map(t => t.task);
    }
    Loader.hide();
  }
}
