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

    for (let index in this.datesData) {
      if (stepEntry.date.rawDate === this.datesData[index].date){
        this.datesData[index] = {date: stepEntry.date.rawDate, data: stepEntry};
      }
    }
    console.log(this.datesData);
    // this.datesData[this.currEntryIndex] =
    this.settings.setValue('full_log', JSON.stringify((this.datesData)));
    // TODO: update firebase
  }

  initializeUserLog(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (userId) {
        this.firebaseService.getStepLog(userId)
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
    this.currEntryIndex = this.findTodayIndex();
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
    console.log("The currentIndex is " + this.currEntryIndex);
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
      console.log(typeof(fullLog));
      // let newLog: {date: string, data: StepEntry}[] = Object.assign({}, fullLog);
      // this.datesData = [];
      // for (let entry in newLog) {
      //   console.log(entry);
      //   this.datesData.push(newLog[entry]);
      // }
      this.datesData = [];
      for (let i = 0; i < fullLog.length; i++) {
        console.log(fullLog[i]);
        this.datesData.push(fullLog[i]);
      }
      this.currEntryIndex = this.findTodayIndex();
      this.isTodayCurrDay = true;
      console.log(this.datesData);
      console.log(this.datesData.length);
      resolve();
    });

  }

  findTodayIndex(): number {
    // Find today
    let todayIndex = 0;
    let todayStr = this.timeService.getTodayStr();
    let i = this.datesData.length - 1;
    while (i >= 0) {
      if (this.datesData[i].date === todayStr) {
        todayIndex = i;
        return todayIndex;
      }
      i--;
    }
    const dateData = this.timeService.getEntryDate(todayStr);
    // If we made it this far then the date for today is not in our array and we must create it.
    this.datesData.push({
      date: dateData.rawDate,
      data: {date: this.timeService.getEntryDate(todayStr), steps: 0, goal: 0, note: '', groupWalk: false}
    });
    return this.datesData.length - 1;
  }



}
