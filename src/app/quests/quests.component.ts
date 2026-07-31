import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Quest } from '../app.models';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [NgIf,NgFor,NgClass,RouterLink],
  templateUrl: './quests.component.html',
  styleUrl: './quests.component.css'
})
export class QuestsComponent {

   quests:Quest[] = [];

   constructor(){
    this.load();
   }
  
   async load(){
    Loader.show();
    let docs = await Firebase.read("quests");
    docs.data.forEach(d=>{
      this.quests.push(JSON.parse(JSON.stringify(d)));
    });
    Loader.hide();
   }

}
