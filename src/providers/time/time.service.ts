import { Injectable } from '@angular/core';
import * as moment from 'moment';

export const sevenDayLimit: number = 7;
export const thirtyDayLimit: number = 30;
export const monthDateIndex: number = 5;
export const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const fullMonthNames = ["January","February","March","April","May","June","July", "August","September","October","November","December"];
export const fullDayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

@Injectable()
export class TimeService {

  private dates: string[] = [];
  private totalDaysInLog: number = 91;
  constructor() {
    this.generateDates();
  }

  generateDates() {
    let i = this.totalDaysInLog - 1;
    while(i >= 0) {
      this.dates.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
      i--;
    }
  }

  getDates(startDate?: string): string[] {
    if (startDate) {
      let daysSinceFirstLog = moment().diff(startDate, 'days');
      if (daysSinceFirstLog > this.totalDaysInLog) {
        this.totalDaysInLog = daysSinceFirstLog;
        this.generateDates();
      }
    }
    return [...this.dates];
  }

  getYesterdayStr(): string {
    return moment().subtract(1, 'days').format('YYYY-MM-DD');
  }

  getTodayStr(): string {
    return moment().format('YYYY-MM-DD');
  }

  // date parameter must be in YYYY-MM-DD format
  getDateStr(date: string): string {
    const today = this.getTodayStr();
    if (today === date) {
      return 'Today';
    }
    const yesterday = this.getYesterdayStr();
    if (yesterday === date) {
      return 'Yesterday';
    }
    let currYear: number = moment().year();
    let momObj = moment(date);
    let str: string = '';
    if (currYear === momObj.year()) {
      str = momObj.format('ddd, MMM Do');
    } else {
      str = momObj.format("ddd, MMM Do YYYY");
    }
    return str;
  }


  getDateInfo(date: string): {day: number, month: number, year: number, shortMonthStr: string,
    shortDayStr: string, dayOfMonthStr: string} {
    let dateObj = moment(date);
    let returnDate = {
      day: dateObj.date(),
      month: dateObj.month()+1,
      year: dateObj.year(),
      shortMonthStr: dateObj.format('MMM'),
      shortDayStr: dateObj.format('ddd'),
      dayOfMonthStr: dateObj.format('do')
    };
    return returnDate;
  }

}
