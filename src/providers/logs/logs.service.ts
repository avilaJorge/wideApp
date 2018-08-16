import {Injectable} from "@angular/core";

import {StepEntry} from "../../models/step-log.model";

@Injectable()
export class LogsService {
  private log: StepEntry[] = [];

  constructor() {}

  addEntry(date: string, steps: string, goal: string, description: string) {
    this.log.push(new StepEntry(date, parseInt(steps, 10), parseInt(goal, 10), description));
  }

  getLog() {
    return [...this.log];
  }
}
