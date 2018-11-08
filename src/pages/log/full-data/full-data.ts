import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LogService } from "../logs.service";
import { monthDateIndex } from "../../../providers/time/time.service";
import { barColor, hoverColor } from "../log";
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
  private chartValues: number[] = [];
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
    this.fullLog = this.logService.getDatesData();
    this.initChartData();
    this.createBarChart();
  }


  initChartData() {
    console.log(this.fullLog);
    let i = 0;
    while(i < this.fullLog.length) {
      if ((i < (this.fullLog.length-10)) && (i % 20 === 0)) {
        let dateStr: string = this.fullLog[i].data.date;
        console.log(dateStr);
        this.chartLabels.push(dateStr.substring(monthDateIndex));
      } else {
        this.chartLabels.push('');
      }
      this.chartValues.push(this.fullLog[i].data.steps);
      this.barColors.push(barColor);
      this.hoverColors.push(hoverColor);
      i++;
    }
    this.chartLabels[this.chartLabels.length-1] = 'Today';
    console.log(this.chartValues);
    console.log(this.chartLabels);
  }

  createBarChart() {
    const ctx = this.scatterPlot.nativeElement;
    this.scatterChartEl = new Chart(ctx,
      {
        type: 'line',
        data: {
          labels: this.chartLabels,
          datasets: [{
            data: this.chartValues,
            pointStyle: 'line',
            backgroundColor: barColor,
            pointBorderWidth: 0,
            radius: 0,
            pointBorderColor: 'rgba(0,0,0,0.9)'
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
                fontSize: 24,
                fontColor: 'black',
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
                display: true,
                autoSkip: false
              }
            }]
          }
        }
      });
  }

}

