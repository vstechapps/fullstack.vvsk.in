import { Injectable } from "@angular/core";
import { Course, Topic } from "../app.models";

@Injectable({
  providedIn: 'root'
})
export class RoadmapsService {

    courses : Course[] = [];
    topics : Map<string, Topic> = new Map<string, Topic>();

    async getAllRoadmaps(): Promise<Course[]> {
        if (this.courses.length === 0) {
            let docs = await Firebase.read("roadmaps");
            docs.data.forEach(d=>{
              this.courses.push(JSON.parse(JSON.stringify(d)));
            });
        }
        return this.courses;
    }

    async getRoadmapById(id: string): Promise<Course | null> {
        if (this.courses.length === 0) {
            await this.getAllRoadmaps();
        }
        let roadmap = this.courses.find(c => c.id === id);
        return roadmap ? roadmap : null;   
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
}