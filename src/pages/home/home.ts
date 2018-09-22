import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { Chart } from 'chart.js';

import { StepEntry } from "../../models/step-log.model";
import { TimeService } from "../../providers/time/time.service";
import { Settings } from "../../providers/settings/settings";
import { LogService } from "./logs.service";
import { LogEntryPage } from "./log-entry/log-entry";

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

  private currEntry: {date: string, data: StepEntry} = null;
  private currDate: string;
  private isCurrEntryToday: boolean = true;
  private todaysDate: string;
  private fullLog: {date: string, data: StepEntry}[] = [];
  public user = {isFitbitAuthenticated: null};
  public fitbitSteps: number = 0;
  public fitbitIconURL: string = 'assets/imgs/fitbit/icons/Fitbit_app_icon.png';
  public fitbitData: any = {};

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private settings: Settings,
    private logService: LogService,
    private timeService: TimeService,) {


    this.user = this.logService.getUser();
    this.currEntry = this.logService.getNextEntry(0);
    console.log('Homepage Constructor');
  }


  ionViewDidLoad() {
    this.fullLog = this.logService.getDatesData();
    this.current = this.currEntry.data.steps;
    this.currDate = this.timeService.getDateStr(this.currEntry.date);
    this.createBarChart();
    this.fitbitData = this.logService.getFitbitStepsMap();
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter() {
    this.currEntry = this.logService.getNextEntry(0);
    this.todaysDate = this.timeService.getTodayStr();
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
                userCallback: (label, index, labels) => {
                  if (label % 2000 == 0) {
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
    this.navCtrl.push('GraphPage');
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
    this.currEntry = this.logService.getNextEntry(-1);
    this.currDate = this.timeService.getDateStr(this.currEntry.data.date);
    console.log(this.currDate);
    this.isCurrEntryToday = this.currDate === 'Today';
    this.current = this.currEntry.data.steps;
    this.barChartEl.data.datasets[0].data = [this.currEntry.data.goal];
    this.barChartEl.data.datasets[1].data = [this.currEntry.data.steps];
    this.barChartEl.update();
  }

  onRightClick() {
    this.currEntry = this.logService.getNextEntry();
    if (this.currEntry) {
      this.currDate = this.timeService.getDateStr(this.currEntry.data.date);
      console.log(this.currDate);
      this.isCurrEntryToday = this.currDate === 'Today';
      this.current = this.currEntry.data.steps;
      this.barChartEl.data.datasets[0].data = [this.currEntry.data.goal];
      this.barChartEl.data.datasets[1].data = [this.currEntry.data.steps];
      this.barChartEl.update();
    }
  }

  onShowData() {
    let entryModal = this.modalCtrl.create('LogEntryPage',
      {entry: this.currEntry, fitbit_data: this.fitbitData[this.currEntry.date]},
      { cssClass: 'inset-modal' });
    entryModal.onDidDismiss((data) => {
      if(data) {
        console.log(data);
        this.currEntry = data;
        this.current = this.currEntry.data.steps;
        this.barChartEl.data.datasets[0].data = [this.currEntry.data.goal];
        this.barChartEl.data.datasets[1].data = [this.currEntry.data.steps];
        this.barChartEl.update();
      }
    });
    entryModal.present();

  }

  onFitbitClick() {
    console.log('Fitbit icon clicked!');
    let entryModal = this.modalCtrl.create('LogEntryPage',
      {entry: this.currEntry, fitbit_data: this.fitbitData[this.currEntry.date], load_fitbit: true},
      { cssClass: 'inset-modal' });
    entryModal.onDidDismiss((data) => {
      if(data) {
        console.log(data);
        this.currEntry = data;
        this.current = this.currEntry.data.steps;
        this.barChartEl.data.datasets[0].data = [this.currEntry.data.goal];
        this.barChartEl.data.datasets[1].data = [this.currEntry.data.steps];
        this.barChartEl.update();
      }
    });
    entryModal.present();
  }
}
