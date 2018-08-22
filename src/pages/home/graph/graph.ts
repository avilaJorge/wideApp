import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Chart } from 'chart.js';

import { StepEntry } from "../../../models/step-log.model";
import { background, lineColor } from "../home";
import { monthDateIndex, monthNames, thirtyDayLimit } from "../../../providers/time/time.service";
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

  @ViewChild('lineChart') lineChart;

  private log: {date: string, data: StepEntry}[] = [];
  private attendance: {date: string, present: boolean}[] = [];
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
    private logService: LogService) {

    const whatever = this.navParams.get('log');
    this.log = this.logService.getThirtyDatesData();
  }

  ionViewDidLoad() {
    this.initChartData();
    this.createLineChart();
  }

  initChartData() {
    let i = 0;
    while(i < thirtyDayLimit) {
      this.chartLabels.push('');
      this.chartValues.push(this.log[i].data.steps);
      this.chartGoals.push(this.log[i].data.goal);
      this.attendance.push({
        date: this.log[i].date.substring(monthDateIndex + 3),
        present: this.log[i].data.steps > 0 ? true : false
      });
      i++;
    }
    console.log(this.attendance);
    // So that the chart xaxis does not look too crowded we only want the first, last and middle dates
    this.chartLabels[0] = this.log[0].date.substring(monthDateIndex);
    this.chartLabels[thirtyDayLimit/2] = this.log[thirtyDayLimit/2].date.substring(monthDateIndex);
    this.chartLabels[this.log.length-1] = this.log[this.log.length-1].date.substring(monthDateIndex);
  }

  createLineChart() {
    const ctx = this.lineChart.nativeElement;
    this.lineChartEl = new Chart(ctx,
      {
        type: 'line',
        data: {
          labels: this.chartLabels,
          datasets: [{
            label                 : 'Steps',
            data                  : this.chartValues,
            duration              : 2000,
            easing                : 'easeInQuart',
            backgroundColor       : background,
            hoverBackgroundColor  : lineColor,
            fill 				   : true
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
              ticks: {
                beginAtZero: true,
                stepSize: 1000,
                autoSkip: true,
                max: 6000 //TODO: Determine the max from step data
              }
            }],
            xAxes: [{
              ticks: {
                autoSkip: false
              }
            }]
          }
        }
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
