import { Injectable } from "@angular/core";
import { Roadmap, UserCourseProgress } from "../app.models";
import { UserService } from "./user.service";
import { CoursesService } from "./courses.service";

@Injectable({
  providedIn: 'root'
})
export class RoadmapsService {

    roadmaps: Roadmap[] = [];

    constructor(public userService: UserService, public coursesService: CoursesService) {}

    async getAllRoadmaps(): Promise<Roadmap[]> {
        if (this.roadmaps.length === 0) {
            let docs = await Firebase.read("roadmaps");
            docs.data.forEach(d=>{
              this.roadmaps.push(JSON.parse(JSON.stringify(d)));
            });
        }
        return this.roadmaps;
    }

    async getRoadmapById(id: string): Promise<Roadmap | null> {
        if (this.roadmaps.length === 0) {
            await this.getAllRoadmaps();
        }
        let roadmap = this.roadmaps.find(r => r.id === id);
        return roadmap ? roadmap : null;   
    }

    async getRoadmapProgress(roadmapId: string): Promise<UserCourseProgress[] | null> {
        if (!this.userService.user) {
            console.error("User not logged in. Cannot fetch progress.");
            return null;
        }
        let progressList: UserCourseProgress[] = [];
        let courses = (await this.getRoadmapById(roadmapId))?.courses || [];
        for (let course of courses) {
            let progress = await this.coursesService.getCourseProgress(course.id);
            if(progress){
                progressList.push(progress);
            }
        }
        return progressList;
    }

}