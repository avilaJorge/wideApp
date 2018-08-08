export class StepLog {

  date: string;
  steps: number;
  description: string;
  goal: number;
  weekGoal: number;

  constructor(fields: any) {
    this.date = fields.date;
    this.steps = fields.steps;
    this.description = fields.description;
    this.goal = fields.goal;
    this.weekGoal = fields.weekGoal;
  }
}
