import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course, Topic, UserRoadMapProgress } from '../app.models';
import { CardSliderComponent } from '../card-slider/card-slider.component';
import { NgFor, NgIf } from '@angular/common';
import { Utility } from '../services/app.util';
import { RoadmapsService } from '../services/roadmaps.service';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [CardSliderComponent, NgIf, RouterLink,NgFor],
  templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.css']
})
export class TopicComponent {

  roadmap: Course | null = null;
  topic: Topic | null = null;

  currentIndex = 0;
  nextTopicInfo: Topic | null = null;

  showTopicComplete = false;
  showRoadmapComplete = false;
  showConfetti = true;
  confettiArray = Utility.mobileAndTabletCheck()? new Array(18): new Array(18);

  userprogress: UserRoadMapProgress | null = null;

  constructor(private route: ActivatedRoute, private router: Router,private roadmapsService:RoadmapsService) {

    const id = this.route.snapshot.paramMap.get('id') || '';
    this.loadRoadmap(id);
    Firebase.publish("FOOTER", { enabled: false });
    

  }

  async loadRoadmap(id:string): Promise<void> {
    Loader.show();
    this.roadmap = await this.roadmapsService.getRoadmapById(id);
    await this.loadTopic(this.currentIndex);
    this.userprogress = await this.roadmapsService.getUserProgress(id);
    Loader.hide();
  }

  async loadTopic(index: number): Promise<void> {
    if (this.roadmap && this.roadmap.topics) {
      let topicId = this.roadmap.topics[index].id;
      this.topic = await this.roadmapsService.getTopicById(this.roadmap.id, topicId);
    }
  }

  public exit() {
    this.showTopicComplete = false;
    Firebase.publish("FOOTER", { enabled: true });
    if (this.roadmap) {
      this.router.navigate(['/roadmaps', this.roadmap.id]);
    }
  }

  async nextTopic() {
    if (this.roadmap && this.roadmap.topics && this.currentIndex < this.roadmap.topics.length - 1) {
      Loader.show();
      this.currentIndex++;
      await this.loadTopic(this.currentIndex);
      Loader.hide();
    } else {
      this.exit();
    }
  }

  /** Triggered by child when activity completes; shows completion modal */
  async onActivityComplete(): Promise<void> {
    if (!this.roadmap) return;
    if (this.topic) {
      this.topic.cards = [];
    }
    let nextIndex = this.currentIndex + 1;
    await this.saveUserProgress();
    if (this.roadmap.topics && nextIndex < this.roadmap.topics.length) {
      this.nextTopicInfo = this.roadmap.topics[nextIndex];
      this.showTopicComplete = true;
      this.showRoadmapComplete = false;
    } else {
      // no next topic -> roadmap completed
      this.nextTopicInfo = null;
      this.showTopicComplete = false;
      this.showRoadmapComplete = true;
    }

    // debug logging to help diagnose rendering issues
    console.debug('Topic complete:', {
      currentIndex: this.currentIndex,
      topic: this.topic,
      nextTopicInfo: this.nextTopicInfo,
      showTopicComplete: this.showTopicComplete,
      showRoadmapComplete: this.showRoadmapComplete
    });
  }

  private async saveUserProgress() {
    if(!this.roadmap) {
      return;
    }
    Loader.show();
    if (this.userprogress == null) {
      this.userprogress = {
        user: "",
        roadmap: this.roadmap.id,
        started: true,
        status: "inprogress",
        percent: "0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: [{ task: this.topic?.id || "", status: "completed" }]
      };
    } else {
      this.userprogress.tasks.push({ task: this.topic?.id || "", status: "completed" });
    }
    let percent = Math.floor((this.userprogress.tasks.length / (this.roadmap.topics?.length || 1)) * 100);
    this.userprogress.percent = percent.toString();
    await this.roadmapsService.updateUserProgress(this.roadmap.id, this.userprogress);
    Loader.hide();
  }

  /** User confirmed proceeding to next topic */
  async proceedToNextTopic(): Promise<void> {
    this.showTopicComplete = false;
    await this.nextTopic();
  }

  closeRoadmapModal(): void {
    this.showRoadmapComplete = false;
  }

}
