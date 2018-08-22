import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

import { StepEntry, EntryDate } from "../../models/step-log.model";
import { Settings } from "../settings/settings";
import { AuthService } from "../auth/auth.service";
import { User } from "../../models/user.model";
import { FirebaseService } from "../firebase/firebase-integration.service";
import { TimeService } from '../time/time.service';

@Injectable()
export class LogService {

  private currEntryIndex: number = 0;
  private isTodayCurrDay: boolean = false;
  private log: StepEntry[] = [];
  private logObjects: any = null;
  private currUser: User;
  private authStatusSub: Subscription;
  private dates: string[] = [];
  private datesData: {date: string, data: StepEntry}[] = [];
  private initLogListener = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private settings: Settings,
    private firebaseService: FirebaseService,
    private timeService: TimeService
  ) {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuth) => {
          console.log('AuthStatusChange in LOGSERVICE!!!!!');
          console.log('isAuth is ' + isAuth);
          if (isAuth) {
            console.log(this.authService.getActiveUser());
            this.currUser = this.authService.getActiveUser();
            // if (this.currUser) {
            //   this.initializeUserLog(this.currUser);
            // }
          }
        },
        (error) => {console.log(error)});
    this.dates = this.timeService.getDates();
  }

  addEntry(date: string, steps: string, goal: string, note: string, group: boolean) {
    const goalNum = parseInt(goal, 10);
    const stepsNum = parseInt(steps, 10);
    const stepEntry: StepEntry = {
      date: this.timeService.getEntryDate(date),
      steps: stepsNum,
      goal: goalNum,
      note: note,
      groupWalk: group
    };
    this.log.push(stepEntry);
    this.settings.setValue('log', JSON.stringify((this.log)));
    this.firebaseService.createStepEntry(this.currUser.googleUID, stepEntry)
      .then((res) => {
        console.log(res);
      });
  }

  updateEntry(date: EntryDate, steps: string, goal: string, note: string, group: boolean) {
    const goalNum = parseInt(goal, 10);
    const stepsNum = parseInt(steps, 10);
    const stepEntry: StepEntry = {
      date: date,
      steps: stepsNum,
      goal: goalNum,
      note: note,
      groupWalk: group
    };
    this.datesData[this.currEntryIndex] = {date: stepEntry.date.rawDate, data: stepEntry};
    this.settings.setValue('full_log', JSON.stringify((this.datesData)));
    // TODO: update firebase
  }

  initializeUserLog(currUser: User): Promise<any> {
    return new Promise((resolve, reject) => {
      if (currUser) {
        this.currUser = currUser;
        this.firebaseService.getStepLog(this.currUser.googleUID)
          .subscribe((data) => {
            this.logObjects = [];
            this.log = [];
            for (let entry of data) {
              if (!entry.stepEntry.groupWalk) {
                entry.stepEntry.groupWalk = false;
              }
              this.log.push(entry.stepEntry);
              this.logObjects[entry.stepEntry.date.rawDate] = entry.stepEntry;
            }
            console.log(this.log);
            this.settings.setValue('log', JSON.stringify(this.log));
            this.initThirtyDates(this.logObjects);
            resolve();
          }, (error) => {
            console.log("Error getting user log from database!");
            console.log(error);
            reject(error);
          });
      }
    });


  }

  initThirtyDates(logData: any) {
    this.datesData = [];
    for(let date of this.dates) {
      this.datesData.push(
        {date: date, data: logData[date] ||
            {date: this.timeService.getEntryDate(date), steps: 0, goal: 0, note: '', groupWalk: false} });
    }
    console.log(this.datesData);
    this.currEntryIndex = this.datesData.length - 1;
    this.isTodayCurrDay = true;
    this.settings.setValue('full_log', JSON.stringify(this.datesData));
    this.initLogListener.next(true);
  }

  getThirtyDatesData() {
    return this.datesData;
  }

  getLog() {
    return this.log;
  }

  isToday() {
    return this.isTodayCurrDay;
  }

  getNextEntry(amount = 1) {
    if (amount === 1) {
      if (this.currEntryIndex === this.datesData.length - 1) {
        return;
      }
    }
    if (amount === -1) {
      if (this.currEntryIndex === 0) {
        return;
      }
    }
    this.currEntryIndex += amount;
    return this.datesData[this.currEntryIndex];
  }

  getInitLogListener() {
    return this.initLogListener.asObservable();
  }

  setFullLog(fullLog): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(fullLog);
      let newLog = Object.assign({}, fullLog);
      this.datesData = [];
      for (let entry in newLog) {
        console.log(entry);
        this.datesData.push(newLog[entry]);
      }
      this.currEntryIndex = this.datesData.length - 1;
      this.isTodayCurrDay = true;
      console.log(this.datesData);
      console.log(this.datesData.length);
      resolve();
    });

  }



}
