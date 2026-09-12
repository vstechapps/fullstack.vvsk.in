import { Injectable } from "@angular/core";
import { Course, Topic, UserCourseProgress } from "../app.models";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

    courses : Course[] = [];
    topics : Map<string, Topic> = new Map<string, Topic>();
    userprogress : Map<string, UserCourseProgress> = new Map<string, UserCourseProgress>();

    constructor(private userService: UserService) {}

    async getAllCourses(): Promise<Course[]> {
        if (this.courses.length === 0) {
            let docs = await Firebase.read("courses");
            docs.data.forEach(d=>{
              this.courses.push(JSON.parse(JSON.stringify(d)));
            });
        }
        return this.courses;
    }

    async getCourseById(id: string): Promise<Course | null> {
        if (this.courses.length === 0) {
            await this.getAllCourses();
        }
        let course = this.courses.find(c => c.id === id);
        return course ? course : null;   
    }

    async getTopicById(roadmapId: string, topicId: string): Promise<Topic | null> {
        let t = roadmapId + "_" + topicId;
        if(!this.topics.has(t)){
             let d = (await Firebase.read("topics", t)).data?.[0] || null;
             let topic = d ? JSON.parse(JSON.stringify(d)) : null;
             if(topic){
                this.topics.set(t, topic);
             }
        }
        return this.topics.get(roadmapId + "_" + topicId) || null;
    }

    async getUserProgress(roadmapId: string): Promise<UserCourseProgress | null> {
        if(!this.userService.user){
            console.error("User not logged in. Cannot fetch progress.");
            return null;
        }
        let t = this.userService.user?.id + "_" + roadmapId;
        if(!this.userprogress.has(roadmapId)){
             let d = (await Firebase.read("userprogress", t)).data?.[0] || null;
             let progress = d ? JSON.parse(JSON.stringify(d)) : null;
             if(progress){
                this.userprogress.set(roadmapId, progress);
             }
        }
        return this.userprogress.get(roadmapId) || null;
    }

    async updateUserProgress(roadmapId: string, progress: UserCourseProgress): Promise<boolean> {
        if(!this.userService.user){
            console.error("User not logged in. Cannot update progress.");
            return false;
        }
        let t = this.userService.user?.id + "_" + roadmapId;
        progress.user = this.userService.user?.id || '';
        progress.roadmap = roadmapId;
        await Firebase.write("userprogress", t, progress);
        this.userprogress.set(roadmapId, progress);
        return true;
    }

}