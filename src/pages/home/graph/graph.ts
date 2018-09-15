import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Chart } from 'chart.js';

import { barColor, hoverColor, lineColor } from "../home";
import {
  sevenDayLimit,
  TimeService
} from "../../../providers/time/time.service";
import { LogService } from "../logs.service";
import { StepEntry } from "../../../models/step-log.model";

/**
 * Generated class for the GraphPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html'
})
export class GraphPage {

  @ViewChild('barChart') barChart;

  private barChartEl: any = null;
  private chartLabels: any = [];
  private chartValues: number[] = [];
  private chartGoals: number[] = [];
  private fullChartData: {dateStr: string, date: string, data: StepEntry}[] = [];
  private todayIndex: number = 0;
  private fitbitData: any = {};


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private logService: LogService,
    private timeService: TimeService,
    private modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    this.initChart();
    this.createBarChart();
  }

  ionViewWillEnter() {
    this.updateChartData();
    this.fitbitData = this.logService.getFitbitStepsMap();
    console.log('ionViewWillEnter in GraphPage');
  }

  initChart() {
    let logData = this.logService.getDatesData();
    // Find today
    let todayStr = this.timeService.getTodayStr();
    let i = logData.length - 1;
    while (i >= 0) {
      if (logData[i].date === todayStr) {
        this.todayIndex = i;
        break;
      }
      i--;
    }

    i = this.todayIndex - sevenDayLimit + 1;
    while(i <= this.todayIndex) {
      let dateStrings = this.getDateStr(i, logData[i].date);
      this.chartLabels.push(dateStrings.chartLabel);
      i++;
    }
  }

  private getDateStr(dateIndex: number, dateStr: string): {dateStr: string, chartLabel: string } {
    if (dateIndex === this.todayIndex) {
      return {dateStr: 'Today', chartLabel: 'Today'};
    }
    let dateInfo = this.timeService.getDateInfo(dateStr);
    return {
      dateStr: dateInfo.shortMonthStr + ' ' + dateInfo.day,
      chartLabel: dateInfo.day + '/' + dateInfo.month
    };
  }

  updateChartData() {
    this.chartValues = [];
    this.chartGoals = [];
    this.fullChartData = [];
    let logData = this.logService.getDatesData();
    let i = this.todayIndex - sevenDayLimit + 1;
    while(i <= this.todayIndex) {
      this.chartValues.push(logData[i].data.steps);
      this.chartGoals.push(logData[i].data.goal);
      this.fullChartData.unshift(Object.assign({dateStr: this.getDateStr(i, logData[i].date).dateStr}, logData[i]));
      i++;
    }
    this.barChartEl.data.datasets[0].data = this.chartGoals;
    this.barChartEl.data.datasets[1].data = this.chartValues;
    this.barChartEl.update();
  }

  createBarChart() {
    const ctx = this.barChart.nativeElement;
    this.barChartEl = new Chart(ctx,
      {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: [{
              data: this.chartGoals,
              type: 'line',
              borderColor: lineColor,
              fill: false,
              radius: 8,
              borderWidth: 2,
              pointStyle: 'circle',
              showLine: false
            },{
              label                 : 'Steps',
              data                  : this.chartValues,
              duration              : 2000,
              easing                : 'easeInQuart',
              backgroundColor       : barColor,
              hoverBackgroundColor  : hoverColor,
          }]
        },
        options: {
          responsive: true,
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
                stepSize: 1000,
                autoSkip: true,
              }
            }],
            xAxes: [{
              gridLines: {
                color: 'rgba(0,0,0,0)'
              },
              ticks: {
                autoSkip: false
              }
            }]
          },
          onClick: this.handleClick
        }
      });
  }

  handleClick = (event, array) => {
    console.log(event);
    console.log(array);
    this.navCtrl.push('CalendarPage');
  };

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onEntryClick(entry: StepEntry, index: number) {
    console.log('Entry clicked!!!' + entry);
    console.log(entry);
    let entryModal = this.modalCtrl.create('LogEntryPage',
      {entry: this.fullChartData[index], fitbit_data: this.fitbitData[this.fullChartData[index].date], load_fitbit: false},
      { cssClass: 'inset-modal' });
    entryModal.onDidDismiss((data) => {
      if (data) {
        console.log('Do something here with the data');
        console.log(this.fullChartData[index]);
        // Need to update the current graph page.
        this.fullChartData[index].data.goal = data.data.goal;
        this.fullChartData[index].data.groupWalk = data.data.groupWalk;
        this.fullChartData[index].data.note = data.data.note;
        this.fullChartData[index].data.steps = data.data.steps;
        this.chartValues[index] = data.data.steps;
        this.chartGoals[index] = data.data.goal;
        this.barChartEl.update();
      }
      console.log(data);
    });
    entryModal.present();
  }
}


