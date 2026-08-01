import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CiconComponent } from '../cicon/cicon.component';
import { Course } from '../app.models';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [NgIf, NgFor, CiconComponent],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.css'
})
export class RoadmapComponent implements OnInit {
  roadmap: Course | null = null;
  loading = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadRoadmap();
  }

  async loadRoadmap(): Promise<void> {
    this.loading = true;
    Loader.show();

    const id = this.route.snapshot.paramMap.get('id') || '';
    const response = await Firebase.read('roadmaps', id);
    const doc = response.data?.[0] || null;

    this.roadmap = doc ? JSON.parse(JSON.stringify(doc)) : null;
    this.loading = false;
    Loader.hide();
  }
}
