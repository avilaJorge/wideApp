import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { StepEntry } from "../../../models/step-log.model";
import { monthDateIndex, monthNames, thirtyDayLimit, TimeService } from "../../../providers/time/time.service";
import { LogService } from "../../../providers/logs/logs.service";

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  private attendance: {date: string, present: boolean, data: {date: string, data: StepEntry}}[] = [];
  public currentMonth: string = monthNames[(new Date()).getMonth()];
  public currentYear: number = (new Date()).getFullYear();
  public currentDate: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logService: LogService,
    private timeService: TimeService,
    private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.initCalendarData();
  }

  initCalendarData() {
    this.currentDate = this.timeService.getTodayStr();
    let logData = this.logService.getThirtyDatesData();
    let startIndex = this.logService.findTodayIndex();
    let i = startIndex - thirtyDayLimit + 1;
    // Continue decrementing i until we reach Sunday.
    // This will make our calendar accurate.
    while ((new Date(logData[i].date)).getDay() != 0) {
      i--;
    }
    i--;
    while(i <= startIndex) {
      this.attendance.push({
        date: logData[i].date.substring(monthDateIndex + 3),
        present: logData[i].data.steps > 0 ? true : false,
        data: logData[i]
      });
      i++;
    }
    console.log(this.currentDate);
    console.log(this.attendance);
  }

  onDateClick(day: { date: string; present: boolean; data: { date: string; data: StepEntry } }, index: number) {
    console.log(day);
    console.log(index);
    console.log(this.attendance);
    let entryModal = this.modalCtrl.create('LogEntryPage', {entry: day.data}, { cssClass: 'inset-modal' });
    entryModal.onDidDismiss((data) => {
      if (data) {
        console.log('Do something here with the data');
        // TODO: Need to update the current graph page.
        this.attendance[index].data = data.data;
        this.attendance[index].date = data.date;
        this.attendance[index].present = true;
      }
      console.log(data);
    });
    entryModal.present();
  }

}
