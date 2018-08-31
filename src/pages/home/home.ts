import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

import { StepEntry, EntryDate } from "../../models/step-log.model";
import { monthDateIndex, TimeService } from "../../providers/time/time.service";
import { Settings } from "../../providers/settings/settings";
import { LogService } from "../../providers/logs/logs.service";
import { Subscription } from "rxjs";
import { LogEntryPage } from "../log-entry/log-entry";

export const hoverColor: string = 'rgb(0, 0, 255)';
export const barColor: string = '#00affb';
export const background: string = 'rgb(9, 11, 105)';
export const lineColor: string = 'rgb(0, 0, 0)';
export const backColor: string = 'rgb(192,192,192)';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('barChart') barChart;

  current: number = 3000;
  max: number = 6000;
  stroke: number = 15;
  radius: number = 125;
  semicircle: boolean = true;
  rounded: boolean = false;
  responsive: boolean = false;
  clockwise: boolean = true;
  color: string = barColor;
  background: string = '#eaeaea';
  duration: number = 800;
  animation: string = 'easeOutCubic';
  animationDelay: number = 0;
  animations: string[] = [];
  gradient: boolean = false;
  realCurrent: number = 0;

  private barChartEl: any = null;
  private chartLabels: any = [];
  private chartValues: number[] = [];
  private chartGoals: number[] = [];
  private barColors: any = [];
  private hoverColors: any = [];

  private currEntry: {date: string, data: StepEntry} = null;
  private currDate: string;
  private isCurrEntryToday: boolean = true;
  private todaysDate: string;
  private log: StepEntry[] = [];
  private fullLog: {date: string, data: StepEntry}[] = [];
  private initLogSub: Subscription;

  constructor(
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    private settings: Settings,
    private logService: LogService,
    private timeService: TimeService) {


    this.currEntry = this.logService.getNextEntry(0);
    console.log('Homepage Constructor');
  }


  ionViewDidLoad() {

    this.log = this.logService.getLog();
    this.fullLog = this.logService.getThirtyDatesData();
    this.current = this.currEntry.data.steps;
    this.max = this.currEntry.data.goal;
    this.currDate = this.timeService.getDateStr(this.currEntry.data.date);
    this.createBarChart();

    // this.settings.getValue('log').then((log) => {
    //   if(log) {
    //     console.log(log);
    //     this.log = JSON.parse(log);
    //     if (this.log.length > 0) {
    //       this.initChartData();
    //       this.createBarChart();
    //       console.log(this.log);
    //     }
    //   }
    // });
    // this.initFullLog();


    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter() {
    // this.fullLog = this.logService.getThirtyDatesData();
    // this.settings.getValue('log').then((log) => {
    //   if(log) {
    //     console.log(log);
    //     this.log = JSON.parse(log);
    //   }
    // });
    // this.initFullLog();
    this.currEntry = this.logService.getNextEntry(0);
    this.todaysDate = this.timeService.getTodayStr();
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Todays date is: ' + this.todaysDate + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Todays date is: ' + this.timeService.getTodayUTC().toISOString() + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Yesterdays date is: ' +  (new Date(this.timeService.getTodayUTC().getTime() - (24 * 60 * 60000))).toISOString()  + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  }

  initFullLog() {
    this.settings.getValue('full_log').then((data) => {
      if(data) {
        console.log("Printing the full log data" );
        this.fullLog = JSON.parse(data);
        // this.currentEntryIndex = this.fullLog.length-1;
        console.log(this.fullLog);
      }
    });
  }


  initChartData() {
    console.log(this.log);
    //let i = this.log.length >= sevenDayLimit ? this.log.length - sevenDayLimit : 0;
    //while(i < this.log.length) {
    let i = 0;
    while(i < 1) {
      this.chartLabels.push(this.log[i].date.rawDate.substring(monthDateIndex));
      this.chartValues.push(this.log[i].steps);
      this.barColors.push(barColor);
      this.hoverColors.push(hoverColor);
      this.chartGoals.push(this.log[i].goal);
      i++;
    }
  }

  createBarChart() {
    const ctx = this.barChart.nativeElement;
    this.barChartEl = new Chart(ctx,
      {
        type: 'bar',
        data: {
          labels: [''],
          datasets: [{
            data: [this.currEntry.data.goal],
            type: 'line',
            borderColor: lineColor,
            fill: false,
            radius: 8,
            borderWidth: 2,
            pointStyle: 'circle',
          }, {
            label: "steps",
            data: [this.currEntry.data.steps],
            duration: 2000,
            easing: 'eastInQuart',
            backgroundColor: barColor,
            hoverBackgroundColor: hoverColor
          }]
          // }, {
          //   data: this.chartGoals,
          //   type: 'line',
          //   borderColor: backColor,
          //   fill: true
          // }]
        },
        options: {
          maintainAspectRatio: false,
          legend: {
            display: false,
            boxWidth: 80,
            fontSize: 15,
            padding: 0
          },
          scales: {
            yAxes: [{
              gridLines: {
                color: 'rgba(0,0,0,0)'
              },
              ticks: {
                beginAtZero: true,
                stepSize: 500,
                autoSkip: true,
                fontSize: 16,
                fontColor: 'black',
                max: 6000, //TODO: Determine the max from step data
                userCallback: (label, index, labels) => {
                  if (label % 2500 == 0) {
                    return label;
                  }
                }
              }
            }],
            xAxes: [{
              barThickness: 25,
              gridLines: {
                color: 'rgba(0,0,0,0)'
              },
              ticks: {
                display: false,
                autoSkip: false
              }
            }]
          }
        }
      });
  }

  onChartClick() {
    console.log("Graph was clicked!");
    this.navCtrl.push('GraphPage');
  }

  doSomethingWithCurrentValue($event: number) {
    console.log($event);
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

  onLeftClick() {
    console.log('Clicked left arrow');
    this.currEntry = this.logService.getNextEntry(-1);
    console.log(this.currEntry);
    this.currDate = this.timeService.getDateStr(this.currEntry.data.date);
    console.log(this.currDate);
    if (this.currDate === 'Today') {
      this.isCurrEntryToday = true;
    } else {
      this.isCurrEntryToday = false;
    }
    this.max = this.currEntry.data.goal;
    this.current = this.currEntry.data.steps;
    this.barChartEl.data.datasets[0].data = [this.currEntry.data.goal];
    this.barChartEl.data.datasets[1].data = [this.currEntry.data.steps];
    this.barChartEl.update();

    console.log('made it this far');
  }

  onRightClick() {
    this.currEntry = this.logService.getNextEntry();
    console.log(this.currEntry);
    if (this.currEntry) {
      this.currDate = this.timeService.getDateStr(this.currEntry.data.date);
      if (this.currDate === 'Today') {
        this.isCurrEntryToday = true;
      } else {
        this.isCurrEntryToday = false;
      }
      this.max = this.currEntry.data.goal;
      this.current = this.currEntry.data.steps;
      this.barChartEl.data.datasets[0].data = [this.currEntry.data.goal];
      this.barChartEl.data.datasets[1].data = [this.currEntry.data.steps];
      this.barChartEl.update();
    }
  }

  ionViewWillUnload() {

  }

  onShowData() {
    console.log('onShowData click!');
    let entryModal = this.modalCtrl.create('LogEntryPage', {entry: this.currEntry}, { cssClass: 'inset-modal' });
    entryModal.onDidDismiss((data) => {
      if(data) {
        console.log(data);
        this.currEntry = data;
        this.max = this.currEntry.data.goal;
        this.current = this.currEntry.data.steps;
        this.barChartEl.data.datasets[0].data = [this.currEntry.data.goal];
        this.barChartEl.data.datasets[1].data = [this.currEntry.data.steps];
        this.barChartEl.update();
      }
    });
    entryModal.present();

  }
}
