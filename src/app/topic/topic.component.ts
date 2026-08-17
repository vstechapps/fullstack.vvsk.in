import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course, Topic } from '../app.models';
import { CardSliderComponent } from '../card-slider/card-slider.component';
import { NgFor, NgIf } from '@angular/common';
import { Utility } from '../services/app.util';

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

  constructor(private route: ActivatedRoute, private router: Router) {

    this.loadRoadmap();
    Firebase.publish("FOOTER", { enabled: false });

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

  async loadTopic(index: number): Promise<void> {
    if (this.roadmap && this.roadmap.topics) {
      let t = this.roadmap.id + "_" + this.roadmap.topics[index].id;
      let d = (await Firebase.read("topics", t)).data?.[0] || null;
      this.topic = d ? JSON.parse(JSON.stringify(d)) : null;
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
  onActivityComplete(): void {
    if (!this.roadmap) return;
    if (this.topic) {
      this.topic.cards = [];
    }
    let nextIndex = this.currentIndex + 1;
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

  /** User confirmed proceeding to next topic */
  async proceedToNextTopic(): Promise<void> {
    this.showTopicComplete = false;
    await this.nextTopic();
  }

  closeRoadmapModal(): void {
    this.showRoadmapComplete = false;
  }

}
