import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../app.models';
import { ExplorePremiumComponent } from '../explore-premium/explore-premium.component';

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink, ExplorePremiumComponent],
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
      let challenge = JSON.parse(JSON.stringify(d));
      challenge.locked = true;
      this.challenges.push(challenge);
    });
    Loader.hide();
  }

}
