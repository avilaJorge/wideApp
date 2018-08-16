import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { StepEntry } from "../../models/step-log.model";
import { backendURL } from "../../environment/environment";
import { AuthService } from "..";
import { User } from "../../models/user.model";

@Injectable()
export class LogsService {
  private log: StepEntry[] = [];
  private currUser: User;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.currUser = this.authService.getActiveUser();
  }

  addEntry(date: string, steps: string, goal: string, description: string) {
    const goalNum = parseInt(goal, 10);
    const stepsNum = parseInt(steps, 10);
    const stepEntry = new StepEntry(date, stepsNum, goalNum, description);
    this.log.push(stepEntry);
    this.http.post(
      backendURL + 'log/' + this.currUser.googleUID + '/' + date,
      stepEntry,
      { headers: this.authService.getHttpHeader() })
      .subscribe(() => {
        console.log('The step log entry was successfully stored in the database!')
      }, (error) => {
        console.log('An error occured while attempting to store the log entry in the database');
      });
  }

  getLog() {
    return [...this.log];
  }
}
