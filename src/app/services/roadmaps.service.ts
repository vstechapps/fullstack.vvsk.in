import { Injectable } from "@angular/core";
import { Roadmap } from "../app.models";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class RoadmapsService {

    roadmaps: Roadmap[] = [];

    constructor() {}

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

}