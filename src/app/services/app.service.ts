import { Injectable } from "@angular/core";
import { Utility } from "./app.util";

@Injectable({
  providedIn: 'root'
})
export class AppService {
    
    public isMobile = Utility.mobileAndTabletCheck();

}