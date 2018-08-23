import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Chart } from 'chart.js';

import { barColor, hoverColor, lineColor } from "../home";
import {
  sevenDayLimit,
  TimeService
} from "../../../providers/time/time.service";
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

  private lineChartEl: any = null;
  private chartLabels: any = [];
  private chartValues: number[] = [];
  private chartGoals: number[] = [];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private logService: LogService,
    private timeService: TimeService) {

  }

  ionViewDidLoad() {
    this.initChartData();
    this.createBarChart();
  }



  initChartData() {
    let logData = this.logService.getThirtyDatesData();
    // Find today
    let todayIndex = 0;
    let todayStr = this.timeService.getTodayStr();
    let i = logData.length - 1;
    while (i >= 0) {
      if (logData[i].date === todayStr) {
        todayIndex = i;
        break;
      }
      i--;
    }

    i = todayIndex - sevenDayLimit + 1;
    while(i <= todayIndex) {
      if (i == todayIndex) {
        this.chartLabels.push('Today');
      } else {
        this.chartLabels.push(logData[i].data.date.monthNum + '/' + logData[i].data.date.day);
      }
      this.chartValues.push(logData[i].data.steps);
      this.chartGoals.push(logData[i].data.goal);
      i++;
    }
    console.log(this.chartGoals);
  }

  createBarChart() {
    const ctx = this.barChart.nativeElement;
    this.lineChartEl = new Chart(ctx,
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

  handleClick = (event, array) => {
    // let log = this.logService.getThirtyDatesData();
    console.log(event);
    console.log(array);
    if (!array[0]) {
      console.log('Graph was clicked!');
      this.navCtrl.push('CalendarPage');
    } else {
      console.log('Bar was clicked!');
      console.log(array[1]._model.label);
      // TODO: Should figure out what entry was clicked bring up edit screen.
    }

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
}
