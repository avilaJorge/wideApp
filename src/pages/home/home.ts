import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

import { StepEntry } from "../../models/step-log.model";
import { LogsService, Settings } from "../../providers";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('barChart') barChart;

  private log: StepEntry[] = [];
  private barChartEl: any = null;
  private chartLabels: any = [];
  private chartValues: number[] = [];
  private barColors: any = [];
  private hoverColors: any = [];
  private barColor: string = 'rgb(9, 137, 126)';
  private background: string = 'rgb(9, 11, 105)';
  private hoverColor: string = 'rgb(0, 0, 255)';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logService: LogsService,
    private settings: Settings) {
  }

  ionViewDidLoad() {
    this.settings.getValue('log').then((log) => {
      if (log) {
        this.log = JSON.parse(log);
        this.initChartData();
        this.createBarChart();
        console.log(this.log);
      }
    });
    console.log('ionViewDidLoad HomePage');
  }

  initChartData() {
    let i = 0;
    while(i < this.log.length) {
      this.chartLabels.push(this.log[i].date.substring(5));
      this.chartValues.push(this.log[i].steps);
      this.barColors.push(this.barColor);
      this.hoverColors.push(this.hoverColor);
      i++;
    }
  }

  createBarChart() {
    this.barChartEl = new Chart(this.barChart.nativeElement,
      {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: [{
            label: "7-Day Step Counts",
            data: this.chartValues,
            duration: 2000,
            easing: 'eastInQuart',
            backgroundColor: this.background,
            hoverBackgroundColor : this.hoverColors
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
              ticks: {
                beginAtZero: true,
                stepSize: 1000,
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

}
