import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import * as moment from 'moment';

import { StepEntry } from "../../models/step-log.model";
import { Settings } from "../../providers/settings/settings";
import { AuthService } from "../../providers/auth/auth.service";
import { User } from "../../models/user.model";
import { FirebaseService } from "../../providers/firebase/firebase-integration.service";
import { TimeService } from '../../providers/time/time.service';
import { FitbitRestApi } from "../../providers/api/fitbit-rest-api";

@Injectable()
export class LogService {

  private currEntryIndex: number = 0;
  private isTodayCurrDay: boolean = false;
  private logObjects: any = null;
  private user: User = new User();
  private authStatusSub: Subscription;
  private datesData: {date: string, data: StepEntry}[] = [];
  private initLogListener = new Subject<boolean>();
  private fitbitData: any = null;

  constructor(
    private authService: AuthService,
    private settings: Settings,
    private firebaseService: FirebaseService,
    private timeService: TimeService,
    private fitbitApi: FitbitRestApi,
  ) {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuth) => {
          console.log('AuthStatusChange in LogService');
          if (isAuth) {
            this.user = this.authService.getActiveUser();
            if (this.user) {
              if (this.user.isFitbitAuthenticated && !this.fitbitData) {
                this.getFitbitData().then((data) => {
                  console.log("One month of steps retrieved from Fitbit.");
                  console.log(data);
                });
              }
            }
          }
        },
        (error) => {console.log(error)});

    this.user = this.authService.getActiveUser();
  }

  initializeUserLog(userId: string): Promise<any> {
    console.log('the user id passed in to initializeUserLog is ', userId);
    return new Promise((resolve, reject) => {
      if (userId) {
        this.getFirestoreLogData(userId)
          .then((data) => {
            console.log(data.logObjs);
            if (data.startDate) {
              this.initLogData(data.logObjs, data.startDate);
            } else {
              this.initLogData(data.logObjs);
            }
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

  getFitbitStepsMap() {
    if (this.fitbitData) {
      return this.fitbitData;
    } else {
      return {};
    }
  }

  getFitbitData(period?: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let timePeriod = period || '1m';
      this.fitbitData = {};
      if (this.user.isFitbitAuthenticated) {
        this.fitbitApi.getSteps('today', timePeriod).then((data) => {
          data['activities-steps'].forEach((entry) => {
            this.fitbitData[entry.dateTime] = entry;
          });
          console.log(this.fitbitData);
          resolve(this.fitbitData);
        }).catch((err) => {
          this.fitbitData = null;
          console.log(err);
          reject(err);
        });
      } else {
        this.fitbitData = null;
        resolve(null);
      }
    });
  }

  setFullLog(fullLog: any, userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.datesData = [];
      for (let i = 0; i < fullLog.length; i++) {
        this.datesData.push(fullLog[i]);
      }
      this.currEntryIndex = this.findTodayIndex();
      this.isTodayCurrDay = true;
      this.settings.setValue('full_log', JSON.stringify(this.datesData));
      resolve();
      this.getFirestoreLogData(userId)
        .then((data) => {
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
          console.log("LOGSERVICE: querySnapshot ", querySnapshot);
          if (!querySnapshot.empty) {
            querySnapshot.docs.forEach((queryDocSnapshot) => {
              console.log("LOGSERVICE: queryDocSnapshot ", queryDocSnapshot);
              let entry = queryDocSnapshot.data();
              if (!entry.groupWalk) {
                entry.groupWalk = false;
              }
              this.logObjects[entry.date] = entry;
            });
            resolve({logObjs: this.logObjects, startDate: querySnapshot.docs[0].data().date});
          } else {
            resolve({logObjs: this.logObjects, startDate: null});
          }
        }, (error) => {
          console.log("Error getting user log from database!");
          console.log(error);
          reject(error);
        });
    });
  }

  initLogData(logData: any, startDate?: string) {
    let dates = [];
    if (startDate) {
      dates = this.timeService.getDates(startDate);
    } else {
      dates = this.timeService.getDates();
    }
    console.log(dates);
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

  updateEntry(date: string, steps: number, goal: number, note: string, group: boolean) {
    const stepEntry: StepEntry = {
      date: date,
      steps: steps,
      goal: goal,
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
    this.firebaseService.createStepEntry(this.user.googleUID, stepEntry).then((response) => {
      console.log(response);
      console.log('log entry successfully stored in Firestore');
    });
  }

  getDatesData() {
    return this.datesData;
  }

  getNextEntry(amount = 1) {
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
    console.log(this.currEntryIndex);
    console.log(this.datesData[this.currEntryIndex]);
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

  getUser() {
    return this.user;
  }

}
