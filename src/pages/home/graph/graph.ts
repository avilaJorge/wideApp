import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Chart } from 'chart.js';

import { StepEntry } from "../../../models/step-log.model";
import { background, barColor, hoverColor, lineColor } from "../home";
import { monthDateIndex, monthNames, sevenDayLimit, thirtyDayLimit } from "../../../providers/time/time.service";
import { LogService } from "../../../providers/logs/logs.service";

/**
 * Generated class for the GraphPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html',
})
export class GraphPage {

  @ViewChild('barChart') barChart;

  private clickedEntry: {date: string, data: StepEntry}= null;
  private attendance: {date: string, present: boolean, data: {date: string, data: StepEntry}}[] = [];
  private lineChartEl: any = null;
  private chartLabels: any = [];
  private chartValues: number[] = [];
  private chartGoals: number[] = [];
  public chartType = 'steps';
  public currentMonth: string = monthNames[(new Date()).getMonth()];
  public currentYear: number = (new Date()).getFullYear();
  public currentDate: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private logService: LogService,
    private modalCtrl: ModalController) {

    const whatever = this.navParams.get('log');
  }

  ionViewDidLoad() {
    this.initChartData();
    this.createBarChart();
    this.initCalendarData();
  }

  initCalendarData() {
    let logData = this.logService.getThirtyDatesData();
    let i = logData.length - thirtyDayLimit;
    while(i < logData.length) {
      this.attendance.push({
        date: logData[i].date.substring(monthDateIndex + 3),
        present: logData[i].data.steps > 0 ? true : false,
        data: logData[i]
      });
      i++;
    }
  }

  initChartData() {
    let logData = this.logService.getThirtyDatesData();
    let i = logData.length - sevenDayLimit;
    while(i < logData.length) {
      if (i == logData.length - 1) {
        this.chartLabels.push('Today');
      } else {
        this.chartLabels.push(logData[i].data.date.monthNum + '/' + logData[i].data.date.day);
      }
      this.chartValues.push(logData[i].data.steps);
      this.chartGoals.push(logData[i].data.goal);
      i++;
    }
    console.log(this.chartGoals);
    console.log(this.attendance);
    // So that the chart xaxis does not look too crowded we only want the first, last and middle dates
    // this.chartLabels[0] = this.log[0].date.substring(monthDateIndex);
    // this.chartLabels[thirtyDayLimit/2] = this.log[thirtyDayLimit/2].date.substring(monthDateIndex);
    // this.chartLabels[this.log.length-1] = this.log[this.log.length-1].date.substring(monthDateIndex);
  }

  createBarChart() {
    const ctx = this.barChart.nativeElement;
    this.lineChartEl = new Chart(ctx,
      {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: [{
              data: [this.chartGoals],
              type: 'line',
              borderColor: lineColor,
              fill: false,
              radius: 8,
              borderWidth: 2,
              pointStyle: 'circle'
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
                max: 7000 //TODO: Determine the max from step data
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

  handleClick(event, array) {
    // let log = this.logService.getThirtyDatesData();
    console.log(event);
    console.log(array);
    // let label = array[0]._model.label;
    // if (label) {
    //   console.log(log);
    //   let i = log.length - 1;
    //   while(i >= 0) {
    //     let str = log[i].data.date.monthNum + '/' + log[i].data.date.day;
    //     if (str === label) {
    //       this.clickedEntry = log[i];
    //       console.log(this.clickedEntry);
    //       return;
    //     }
    //     i--;
    //   }
    //   return;
    // }

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onDateClick(day: { date: string; present: boolean; data: { date: string; data: StepEntry } }, index: number) {
    console.log(day);
    console.log(index);
    let entryModal = this.modalCtrl.create('LogEntryPage', {entry: day.data}, { cssClass: 'inset-modal' });
    entryModal.onDidDismiss((data) => {
      console.log(data);
    });
    entryModal.present();
  }
}
