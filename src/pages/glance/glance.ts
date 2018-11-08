import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LogService } from "../log/logs.service";
import { StepEntry } from "../../models/step-log.model";

export const barColor: string = '#00affb';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private logService: LogService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GlancePage');
  }

  ionViewWillEnter() {
    this.todayData = this.logService.getTodayData();
    this.max = this.todayData.data.goal;
    this.current = this.todayData.data.steps;
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
