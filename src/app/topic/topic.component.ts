import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course, Topic, UserCourseProgress } from '../app.models';
import { CardSliderComponent } from '../card-slider/card-slider.component';
import { NgFor, NgIf } from '@angular/common';
import { Utility } from '../services/app.util';
import { RoadmapsService } from '../services/roadmaps.service';
import { CoursesService } from '../services/courses.service';
import { AppService } from '../services/app.service';
import { FirebaseEvent, FirebaseListener } from '../services/firebase.listener';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [CardSliderComponent, NgIf, RouterLink,NgFor],
  templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.css']
})
export class TopicComponent {

  course: Course | null = null;
  topic: Topic | null = null;

  currentIndex = 0;
  nextTopicInfo: Topic | null = null;

  showTopicComplete = false;
  showRoadmapComplete = false;
  showConfetti = true;
  confettiArray = Utility.mobileAndTabletCheck()? new Array(18): new Array(18);

  userprogress: UserCourseProgress | null = null;

  ableToSaveProgress: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router,private coursesService:CoursesService, public appService:AppService, private firebaseListener: FirebaseListener) {

    const id = this.route.snapshot.paramMap.get('id') || '';
    this.loadCourse(id);
    Firebase.publish("FOOTER", { enabled: false });
    if(this.appService.isMobile){
      Firebase.publish("QUBA", { enabled: false, isOpen: false });
    }else{
      Firebase.publish("QUBA", {
        enabled: true,
        isOpen: false,
    		message: `#### Need help with this topic? 
  Ask **QUBA**, your AI Mentor
  - Need more explanation on this topic
  - Feeling stuck or confused
  - Want real-world examples`
    });
    }
     this.firebaseListener.events$.subscribe((event) => this.handleFirebaseEvent(event));
  }

  private handleFirebaseEvent(event: FirebaseEvent): void {
      if (event.type === 'TOPIC' && event.data!=null) {
        if(event.data.exit){
          this.exit();
        };
      }
    }

  async loadCourse(id:string): Promise<void> {
    Loader.show();
    this.course = await this.coursesService.getCourseById(id);
    this.userprogress = await this.coursesService.getCourseProgress(id);
    if(this.userprogress && this.userprogress.next && this.course && this.course.topics){
      this.currentIndex = this.course?.topics.findIndex(t => t.id === this.userprogress?.next) || 0;
    }
    await this.loadTopic(this.currentIndex);
    console.log(this.course,this.topic);
    Firebase.publish("HEADER",{custom:{title:this.course?.title,subtitle:this.topic?.title,icon:this.course?.icon}});
    Loader.hide();
  }

  async loadTopic(index: number): Promise<void> {
    if (this.course && this.course.topics) {
      let topicId = this.course.topics[index].id;
      this.topic = await this.coursesService.getTopicById(this.course.id, topicId);
    }
  }

  public exit() {
    this.showTopicComplete = false;
    Firebase.publish("FOOTER", { enabled: true });
    Firebase.publish("QUBA", { enabled: true, isOpen: false });
    if (this.course) {
      this.router.navigate(['/courses', this.course.id]);
    }
  }

  async nextTopic() {
    if (this.course && this.course.topics && this.currentIndex < this.course.topics.length - 1) {
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
    if (!this.course) return;
    if (this.topic) {
      this.topic.cards = [];
    }
    let nextIndex = this.currentIndex + 1;
    await this.saveUserProgress();
    if (this.course.topics && nextIndex < this.course.topics.length) {
      this.nextTopicInfo = this.course.topics[nextIndex];
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
    if(!this.course) {
      return;
    }
    Loader.show();
    if (this.userprogress == null) {
      this.userprogress = {
        user: "",
        course: this.course.id,
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
    let percent = Math.floor((this.userprogress.tasks.length / (this.course.topics?.length || 1)) * 100);
    this.userprogress.percent = percent.toString();
    if(percent >= 100) {
      this.userprogress.status = "completed";
    }
    let nextIndex = this.currentIndex + 1;
    if(this.course && this.course.topics && nextIndex < this.course.topics.length) {
      this.userprogress.next = this.course.topics[nextIndex].id;
    }
    this.ableToSaveProgress= await this.coursesService.updateUserProgress(this.course.id, this.userprogress);
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
