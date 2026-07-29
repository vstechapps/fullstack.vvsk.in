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

  courses : Course[] = [];
  constructor(){
    this.test();
  }

  async test(){
    let docs = await Firebase.read("roadmaps");
    docs.data.forEach(d=>{
      this.courses.push({id:d.id,title:d["title"],description:d["description"],locked:d["locked"]})
    })
  }

}
