import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subscription } from "rxjs";

import { StepEntry } from "../../models/step-log.model";
import { backendURL } from "../../environment/environment";
import { AuthService, Settings } from "..";
import { User } from "../../models/user.model";

const thirtyDayLimit:number = 30;

@Injectable()
export class LogsService {
  private log: StepEntry[] = [];
  private logObjects: any = null;
  private currUser: User;
  private authStatusSub: Subscription;
  private thirtyDates: string[] = [];
  private thirtyDatesData: {date: string, data: StepEntry}[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private settings: Settings
  ) {
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

    const today = new Date();
    let i = thirtyDayLimit;
    while(i > 0) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      this.thirtyDates.push(date.toISOString().substring(0,10));
      i--;
    }
    console.log(this.thirtyDates);
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
      this.settings.getValue('log').then((logData) => {
        if (logData) {
          this.log = JSON.parse(logData);
        }
        this.http.get(backendURL + 'log/' + this.currUser.googleUID, {headers: this.authService.getHttpHeader()})
          .subscribe((data) => {
            this.logObjects = data;
            this.log = [];
            for (let entry in data) {
              this.log.push(data[entry]);
            }
            this.settings.setValue('log', JSON.stringify(this.log));
            this.initThirtyDates(this.logObjects);
          }, (error) => {
            console.log("Error getting user log from database!");
            console.log(error);
          });
      });

    }

  }

  initThirtyDates(logData: any) {
    this.thirtyDatesData = [];
    for(let date of this.thirtyDates) {
      this.thirtyDatesData.push({date: date, data: logData[date] || new StepEntry(date,0,0,'')});
    }
    console.log(this.thirtyDatesData);
  }

  getThirtyDatesData() {
    return this.thirtyDatesData;
  }

  getThirtyDates() {
    return this.thirtyDates;
  }

  getLogObjects() {
    return this.logObjects;
  }

  getLog() {
    return [...this.log];
  }
}
