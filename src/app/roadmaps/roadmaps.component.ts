import { Component } from '@angular/core';
import { Course } from '../app.models';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CiconComponent } from '../cicon/cicon.component';

@Component({
  selector: 'app-roadmaps',
  standalone: true,
  imports: [NgIf,NgFor,NgClass,CiconComponent,RouterLink],
  templateUrl: './roadmaps.component.html',
  styleUrl: './roadmaps.component.css'
})
export class RoadmapsComponent {

  courses : Course[] = [];
  constructor(){
    this.load();
  }

  async load(){
    Loader.show();
    let docs = await Firebase.read("roadmaps");
    docs.data.forEach(d=>{
      this.courses.push(JSON.parse(JSON.stringify(d)));
    });
    Loader.hide();
  }

}
