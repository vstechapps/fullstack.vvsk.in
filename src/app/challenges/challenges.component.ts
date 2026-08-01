import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../app.models';

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink],
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.css'
})
export class ChallengesComponent {

  challenges: Task[] = [];

  constructor(){
    this.load();
  }

  async load(){
    Loader.show();
    let docs = await Firebase.read("challenges");
    docs.data.forEach((d: any) => {
      this.challenges.push(JSON.parse(JSON.stringify(d)));
    });
    Loader.hide();
  }

}
