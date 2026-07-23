export class Task {
  id: number = 0;
  title: string = "";
  description: string = "";
  category?: string = "";
  completed?: boolean = false;
  locked: boolean = false;
  xp?: number = 0;
  gems?: number = 0;
  icon?:string = "";
  labels?: string[] = [];

  constructor(){

  }
}

export class Quest extends Task{
    difficulty: string = "Easy";
}

export interface Course extends Task{

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