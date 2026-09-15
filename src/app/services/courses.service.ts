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

    async getTopicById(courseId: string, topicId: string): Promise<Topic | null> {
        let t = courseId + "_" + topicId;
        if(!this.topics.has(t)){
             let d = (await Firebase.read("topics", t)).data?.[0] || null;
             let topic = d ? JSON.parse(JSON.stringify(d)) : null;
             if(topic){
                this.topics.set(t, topic);
             }
        }
        return this.topics.get(courseId + "_" + topicId) || null;
    }

    async getCourseProgress(courseId: string): Promise<UserCourseProgress | null> {
        if(!this.userService.user){
            console.error("User not logged in. Cannot fetch progress.");
            return null;
        }
        let t = this.userService.user?.id + "_" + courseId;
        if(!this.userprogress.has(courseId)){
             let d = (await Firebase.read("usercourseprogress", t)).data?.[0] || null;
             let progress = d ? JSON.parse(JSON.stringify(d)) : null;
             if(progress){
                this.userprogress.set(courseId, progress);
             }
        }
        return this.userprogress.get(courseId) || null;
    }

    async updateUserProgress(courseId: string, progress: UserCourseProgress): Promise<boolean> {
        if(!this.userService.user){
            console.error("User not logged in. Cannot update progress.");
            return false;
        }
        let t = this.userService.user?.id + "_" + courseId;
        progress.user = this.userService.user?.id || '';
        progress.course = courseId;
        await Firebase.write("usercourseprogress", t, progress);
        this.userprogress.set(courseId, progress);
        return true;
    }

}