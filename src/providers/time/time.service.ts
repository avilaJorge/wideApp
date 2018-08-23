import { Injectable } from '@angular/core';

import { EntryDate } from "../../models/step-log.model";

export const sevenDayLimit: number = 7;
export const totalDaysInLog: number = 91;
export const thirtyDayLimit: number = 30;
export const monthDateIndex: number = 5;
export const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const fullMonthNames = ["January","February","March","April","May","June","July", "August","September","October","November","December"];

/*
  Generated class for the TimeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TimeService {

  private dates: string[] = [];
  private thirtyDates
  constructor() {

    const today = this.getToday();
    let i = totalDaysInLog - 1;
    let j = thirtyDayLimit;
    while(i >= 0) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      this.dates.push(date.toISOString().substring(0,10));
      i--;
    }
  }

  getDates(): string[] {
    return [...this.dates];
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

  getToday(): Date {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now()-tzoffset));
  }

  getYesterdayStr(): string {
    const today = this.getToday();
    let yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    return yesterday.toISOString().substring(0,10);
  }

  getTodayStr(): string {
    let dateStr = this.getToday().toISOString();
    return dateStr.substring(0,10);
  }

  getDateStr(date: EntryDate): string {
    const today = this.getTodayStr();
    console.log(today);
    console.log(date);
    if (today === date.rawDate) {
      return 'Today';
    }
    const yesterday = this.getYesterdayStr();
    if (yesterday === date.rawDate) {
      return 'Yesterday';
    }
    const str = fullMonthNames[date.monthNum-1] + ' ' + date.day + ', ' + date.year;
    return str;
  }


}
