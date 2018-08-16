export class StepEntry {

  date: string;
  steps: number;
  description: string;
  goal: number;

  constructor(date:string, steps: number, goal: number, description: string) {
    this.date = date;
    this.steps = steps;
    this.description = description;
    this.goal = goal;
  }
}
