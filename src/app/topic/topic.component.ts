import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course, Topic } from '../app.models';
import { CardSliderComponent } from '../card-slider/card-slider.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [CardSliderComponent,NgIf,RouterLink],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css'
})
export class TopicComponent {

  roadmap: Course | null = null;
  topic: Topic | null = null;

  currentIndex = 0;

  constructor(private route: ActivatedRoute, private router:Router){

    this.loadRoadmap();
    Firebase.publish("FOOTER",{enabled:false});

  }

   async loadRoadmap(): Promise<void> {
    Loader.show();

    const id = this.route.snapshot.paramMap.get('id') || '';
    const response = await Firebase.read('roadmaps', id);
    const doc = response.data?.[0] || null;

    this.roadmap = doc ? JSON.parse(JSON.stringify(doc)) : null;
    await this.loadTopic(this.currentIndex);
    Loader.hide();
  }

  async loadTopic(index:number): Promise<void> {
    if(this.roadmap && this.roadmap.topics){
      let t = this.roadmap.id+"_"+this.roadmap.topics[index].id;
      let d = (await Firebase.read("topics",t)).data?.[0] || null;
      this.topic = d? JSON.parse(JSON.stringify(d)) : null;
    }
  }

  public exit(){
    Firebase.publish("FOOTER",{enabled:true});
    if(this.roadmap){
      this.router.navigate(['/roadmaps', this.roadmap.id]);
    }
  }

  async nextTopic(){
    if(this.roadmap && this.roadmap.topics && this.currentIndex < this.roadmap.topics.length - 1){
      Loader.show();
    this.currentIndex++;
    await this.loadTopic(this.currentIndex);
    Loader.hide();
    } else {
      this.exit();
    }
  }
}
