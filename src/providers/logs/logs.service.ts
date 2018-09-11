import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import * as moment from 'moment';

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
  private logObjects: any = null;
  private currUser: User;
  private authStatusSub: Subscription;
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
          console.log('AuthStatusChange in LogService');
          if (isAuth) {
            console.log(this.authService.getActiveUser());
            this.currUser = this.authService.getActiveUser();
          }
        },
        (error) => {console.log(error)});
  }

  initializeUserLog(userId: string): Promise<any> {
    console.log('the user id passed it initialize user log is ', userId);
    return new Promise((resolve, reject) => {
      if (userId) {
        this.getFirestoreLogData(userId)
          .then((data) => {
            console.log(data.logObjs);
            this.initLogData(data.logObjs, data.startDate);
            resolve();
          }, (error) => {
            console.log(error);
            reject(error);
          });
      } else {
        reject("Error initializing user log");
      }
    });
  }

  setFullLog(fullLog: any, userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.datesData = [];
      for (let i = 0; i < fullLog.length; i++) {
        console.log(fullLog[i]);
        this.datesData.push(fullLog[i]);
      }
      this.currEntryIndex = this.findTodayIndex();
      this.isTodayCurrDay = true;
      this.settings.setValue('full_log', JSON.stringify(this.datesData));
      console.log(this.datesData);
      resolve();
      this.getFirestoreLogData(userId)
        .then((data) => {
          console.log(data.logObjs);
          this.mergelocalAndDBData(data.logObjs);
        }, (error) => {
          console.log(error);
        });
    });
  }

  private mergelocalAndDBData(logObjs: any) {
    this.datesData.forEach((entry) => {
      if (logObjs[entry.date]) {
        entry.data = logObjs[entry.date];
      }
    });
  }

  getFirestoreLogData(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseService.getStepLog(userId)
        .then((querySnapshot) => {
          this.logObjects = {};

          querySnapshot.docs.forEach((queryDocSnapshot) => {
            let entry = queryDocSnapshot.data();
            console.log(entry);
            if (!entry.groupWalk) {
              entry.groupWalk = false;
            }
            this.logObjects[entry.date] = entry;
          });
          resolve({logObjs: this.logObjects, startDate: querySnapshot.docs[0].data().date});
        }, (error) => {
          console.log("Error getting user log from database!");
          console.log(error);
          reject(error);
        });
    });
  }

  initLogData(logData: any, startDate: string) {
    let dates = this.timeService.getDates(startDate);
    this.datesData = [];
    for(let date of dates) {
      this.datesData.push(
        {date: date, data: logData[date] || {date: date, steps: 0, goal: 0, note: '', groupWalk: false} });
    }
    console.log(this.datesData);
    this.currEntryIndex = this.findTodayIndex();
    this.isTodayCurrDay = true;
    this.settings.setValue('full_log', JSON.stringify(this.datesData));
    this.initLogListener.next(true);
  }

  updateEntry(date: string, steps: string, goal: string, note: string, group: boolean) {
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
      if (stepEntry.date === this.datesData[index].date){
        this.datesData[index] = {date: stepEntry.date, data: stepEntry};
      }
    }
    console.log(this.datesData);
    this.settings.setValue('full_log', JSON.stringify((this.datesData)));
    this.firebaseService.createStepEntry(this.currUser.googleUID, stepEntry).then((response) => {
      console.log(response);
      console.log('log entry successfully stored in Firestore');
    });
  }

  getDatesData() {
    return this.datesData;
  }

  getNextEntry(amount = 1) {
    console.log("The currentIndex is " + this.currEntryIndex);
    if (amount === 1) {
      if (this.currEntryIndex === this.datesData.length - 1) {
        return null;
      }
    }
    if (amount === -1) {
      if (this.currEntryIndex === 0) {
        return null;
      }
    }
    this.currEntryIndex += amount;
    return this.datesData[this.currEntryIndex];
  }

  findTodayIndex(): number {
    // Find today
    let todayIndex = 0;
    let todayStr = this.timeService.getTodayStr();
    let i = this.datesData.length - 1;
    let lastDate = '';
    while (i >= 0) {
      if (this.datesData[i].date === todayStr) {
        todayIndex = i;
        return todayIndex;
      }
      lastDate = this.datesData[i].date;
      i--;
    }

    let day_diff = moment().diff(this.datesData[this.datesData.length-1].date, 'days') - 1;
    console.log(day_diff);
    while(day_diff >= 0) {
      let dateStr = moment().subtract(day_diff, 'days').format('YYYY-MM-DD');
      console.log(dateStr);
      this.datesData.push({date: dateStr, data: {date: dateStr, steps: 0, goal: 0, note: '', groupWalk: false}});
      day_diff--;
    }
    return this.datesData.length - 1;
  }
}
