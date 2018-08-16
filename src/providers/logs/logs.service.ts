import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from "rxjs";

import { StepEntry } from "../../models/step-log.model";
import { backendURL } from "../../environment/environment";
import { AuthService, Settings } from "..";
import { User } from "../../models/user.model";


@Injectable()
export class LogsService {
  private log: StepEntry[] = [];
  private currUser: User;
  private authStatusSub: Subscription;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private settings: Settings
  ) {
    console.log("Constructor for LogsService");
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuth) => {
          if (isAuth) {
            this.currUser = this.authService.getActiveUser();
            if (this.currUser) {
              this.initializeUserLog(this.currUser);
            }
          }
        },
        (error) => {console.log(error)});
  }

  ionViewDidLoad() {
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
        console.log('An error occurred while attempting to store the log entry in the database');
      });
  }

  initializeUserLog(currUser: User) {
    if (currUser) {
      this.http.get(backendURL + 'log/' + this.currUser.googleUID, {headers: this.authService.getHttpHeader()})
        .subscribe((data) => {
          this.log = [];
          for (let entry in data) {
            this.log.push(data[entry]);
          }
          console.log(data);
        }, (error) => {
          console.log("Error getting user log from database!");
          console.log(error);
        });
    }

  }


  getLog() {
    return [...this.log];
  }
}
