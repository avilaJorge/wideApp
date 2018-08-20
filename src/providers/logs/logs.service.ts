import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";

import { StepEntry, EntryDate } from "../../models/step-log.model";
import { AuthService, Settings } from "..";
import { User } from "../../models/user.model";
import { monthNames } from "../../pages/home/home";
import { FirebaseService } from "..";

const thirtyDayLimit:number = 30;

@Injectable()
export class LogService {

  private log: StepEntry[] = [];
  private logObjects: any = null;
  private currUser: User;
  private authStatusSub: Subscription;
  private thirtyDates: string[] = [];
  private thirtyDatesData: {date: string, data: StepEntry}[] = [];

  constructor(
    private authService: AuthService,
    private settings: Settings,
    private firebaseService: FirebaseService
  ) {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuth) => {
          console.log('AuthStatusChange in LOGSERVICE!!!!!');
          console.log('isAuth is ' + isAuth);
          if (isAuth) {
            console.log(this.authService.getActiveUser());
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

  addEntry(date: string, steps: string, goal: string, note: string) {
    const goalNum = parseInt(goal, 10);
    const stepsNum = parseInt(steps, 10);
    const stepEntry: StepEntry = {
      date: this.getEntryDate(date),
      steps: stepsNum,
      goal: goalNum,
      note: note
    };
    this.log.push(stepEntry);
    this.settings.setValue('log', JSON.stringify((this.log)));
    this.firebaseService.createStepEntry(this.currUser.googleUID, stepEntry)
      .then((res) => {
        console.log(res);
      });
  }

  initializeUserLog(currUser: User) {
    if (currUser) {
      this.currUser = currUser;
      this.firebaseService.getStepLog(this.currUser.googleUID)
        .subscribe((data) => {
          this.logObjects = [];
          this.log = [];
          for (let entry of data) {
            this.log.push(entry.stepEntry);
            this.logObjects[entry.stepEntry.date.rawDate] = entry.stepEntry;
          }
          console.log(this.log);
          this.settings.setValue('log', JSON.stringify(this.log));
          this.initThirtyDates(this.logObjects);
        }, (error) => {
          console.log("Error getting user log from database!");
          console.log(error);
        });
    }

  }

  initLogService() {

  }

  initThirtyDates(logData: any) {
    this.thirtyDatesData = [];
    for(let date of this.thirtyDates) {
      this.thirtyDatesData.push(
        {date: date, data: logData[date] ||
            {date: this.getEntryDate(date), steps: 0, goal: 0, note: ''} });
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
    console.log(this.log);
    if (this.log.length <= 0) return [];
    return [...this.log];
  }

  getEntryDate(dateStr: string): EntryDate {
    const monthNum = parseInt(dateStr.substring(5,7), 10);
    let entryDate: EntryDate = {
      rawDate: dateStr,
      month: monthNames[monthNum - 1],
      monthNum: monthNum,
      day: parseInt(dateStr.substring(8, 10), 10),
      year: parseInt(dateStr.substring(0, 4), 10)
    };
    return entryDate;
  }

}
