import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LogService } from "../log/logs.service";
import { StepEntry } from "../../models/step-log.model";
import { EventService } from "../events/events.service";
import { DBMeetup, Meetup } from "../events/meetup.model";

export const barColor: string = '#00affb';
export const no_steps_color: string = '#fb0f00';
export const goal_steps_color: string = '#30fb00';

@IonicPage()
@Component({
  selector: 'page-glance',
  templateUrl: 'glance.html',
})
export class GlancePage {

  current: number = 3000;
  max: number = 6000;
  stroke: number = 20;
  radius: number = 125;
  semicircle: boolean = false;
  rounded: boolean = true;
  responsive: boolean = false;
  clockwise: boolean = true;
  color: string = barColor;
  background: string = '#eaeaea';
  duration: number = 800;
  animation: string = 'easeOutCubic';
  animationDelay: number = 5;
  animations: string[] = [];
  gradient: boolean = false;

  todayData: {date: string, data: StepEntry};
  nextMeetup: Meetup;
  nextMeetupDB: DBMeetup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private logService: LogService,
              private eventService: EventService) {
    this.nextMeetup = this.eventService.getNextEvent();
    this.nextMeetupDB = this.eventService.getNextEventDB();
    console.log(this.nextMeetup);
    console.log(this.nextMeetupDB);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GlancePage');
    this.todayData = this.logService.getTodayData();
    console.log("Just entered HomePage, todayData is", this.todayData);
    this.max = this.todayData.data.goal;
    this.current = this.todayData.data.steps;
  }

  ionViewWillEnter() {
    this.todayData = this.logService.getTodayData();
    console.log("Just entered HomePage, todayData is", this.todayData);
    this.max = this.todayData.data.goal;
    this.current = this.todayData.data.steps;
    if (this.current >= this.max && this.max != 0) {
      this.color = goal_steps_color;
    } else if (this.current > 0) {
      this.color = barColor;
    } else {
      this.color = no_steps_color;
    }
  }

  openSettings() {
    this.navCtrl.push("AccountPage");
  }

  getOverlayStyle() {
    let isSemi = this.semicircle;
    let transform = (isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';

    return {
      'top': isSemi ? 'auto' : '50%',
      'bottom': isSemi ? '5%' : 'auto',
      'left': '50%',
      'transform': transform,
      '-moz-transform': transform,
      '-webkit-transform': transform,
      'font-size': this.radius / 3.5 + 'px'
    };
  }
}
