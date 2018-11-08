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
  selector: 'page-log',
  templateUrl: 'log.html',
})
export class LogPage {
  @ViewChild('barChart') barChart;

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


  onLeftClick() {
    this.currEntry = this.logService.getNextEntry(-1);
    this.currDate = this.timeService.getDateStr(this.currEntry.data.date);
    console.log(this.currDate);
    this.isCurrEntryToday = this.currDate === 'Today';
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
        this.barChartEl.data.datasets[0].data = [this.currEntry.data.goal];
        this.barChartEl.data.datasets[1].data = [this.currEntry.data.steps];
        this.barChartEl.update();
      }
    });
    entryModal.present();
  }
}
