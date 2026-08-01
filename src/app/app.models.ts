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

export class Course extends Task{
  topics?: number;
  quests?:number;
  topicsList?: string[];
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