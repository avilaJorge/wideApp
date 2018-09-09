import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LogService } from "../../../providers/logs/logs.service";
import { monthDateIndex } from "../../../providers/time/time.service";
import { barColor, hoverColor, lineColor } from "../home";
import { Chart } from 'chart.js';
import { StepEntry } from "../../../models/step-log.model";

/**
 * Generated class for the FullDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-full-data',
  templateUrl: 'full-data.html',
})
export class FullDataPage {
  @ViewChild('scatterPlot') scatterPlot;

  private scatterChartEl: any = null;
  private chartLabels: any = [];
  private chartValues: {x: number, y: number}[] = [];
  private barColors: any = [];
  private hoverColors: any = [];

  private log: StepEntry[] = [];
  private fullLog: {date: string, data: StepEntry}[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logService: LogService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FullDataPage');
    this.log = this.logService.getLog();
    this.fullLog = this.logService.getThirtyDatesData();
    this.initChartData();
    this.createBarChart();
  }


  initChartData() {
    console.log(this.fullLog);
    let i = 0;
    while(i < this.fullLog.length) {
      this.chartLabels.push(this.fullLog[i].data.date.rawDate.substring(monthDateIndex));
      this.chartValues.push({x: i, y: this.fullLog[i].data.steps});
      this.barColors.push(barColor);
      this.hoverColors.push(hoverColor);
      i++;
    }
    console.log(this.chartValues);
  }

  createBarChart() {
    const ctx = this.scatterPlot.nativeElement;
    this.scatterChartEl = new Chart(ctx,
      {
        type: 'scatter',
        data: {
          labels: this.chartLabels,
          datasets: [{
            label: 'Scatter Dataset',
            data: this.chartValues,
            // type: 'line',
            // borderColor: lineColor,
            // fill: false,
            // radius: 8,
            // borderWidth: 2,
            // pointStyle: 'circle',
          // }, {
          //   label: "steps",
          //   data: [this.currEntry.data.steps],
          //   duration: 2000,
          //   easing: 'eastInQuart',
          //   backgroundColor: barColor,
          //   hoverBackgroundColor: hoverColor
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
                max: 8000, //TODO: Determine the max from step data
                userCallback: (label, index, labels) => {
                  if (label % 2500 == 0) {
                    return label;
                  }
                }
              }
            }],
            xAxes: [{
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

}

// options: {
//   maintainAspectRatio: false,
//   legend: {
//     display: false,
//     boxWidth: 80,
//     fontSize: 15,
//     padding: 0
//   },
//   scales: {
//     yAxes: [{
//       gridLines: {
//         color: 'rgba(0,0,0,0)'
//       },
//       ticks: {
//         beginAtZero: true,
//         stepSize: 500,
//         autoSkip: true,
//         fontSize: 16,
//         fontColor: 'black',
//         max: 6000, //TODO: Determine the max from step data
//         userCallback: (label, index, labels) => {
//           if (label % 2500 == 0) {
//             return label;
//           }
//         }
//       }
//     }],
//     xAxes: [{
//       barThickness: 25,
//       gridLines: {
//         color: 'rgba(0,0,0,0)'
//       },
//       ticks: {
//         display: false,
//         autoSkip: false
//       }
//     }]
//   }
// }