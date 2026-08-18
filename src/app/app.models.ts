export class Task {
  id: string = "";
  title: string = "";
  description: string = "";
  summary:string = "";
  category?: string = "";
  completed?: boolean = false;
  locked: boolean = false;
  xp?: number;
  gems?: number = 0;
  icon:string = "";
  labels?: string[] = [];

}

export class Quest extends Task{
    difficulty: string = "Easy";
}

export class Topic extends Task{
  cards:any[]=[];
}

export class Assessment extends Task{

}

export class Project extends Task{

}

export class Course extends Task{
  topics?: Topic[];
  quests?:Quest[];
  assessments?: Assessment[];
  projects?: Project[];
  skills?: string[];
}

export enum Difficulty{
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

export enum Category {
  Backend = 'Backend',
  Frontend = 'Frontend',
  Database = 'Database',
  Performance = 'Performance',
  Security = 'Security',
  DevOps = 'DevOps',
  Testing = 'Testing'
}

export interface User{
  id:string;
  name:string;
  email:string;
  role:string;
  image?:string;
  contact?:string;
}

export interface UserRoadMapProgress{
  user:string;
  roadmap:string;
  started:boolean;
  status:string;
  percent:string;
  tasks:TaskStatus[];
  createdAt:string;
  updatedAt:string;
}

export interface TaskStatus{
  task:string;
  status:string;
}