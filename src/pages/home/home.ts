import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

import { StepEntry, EntryDate } from "../../models/step-log.model";
import { Settings } from "../../providers";

export const hoverColor: string = 'rgb(0, 0, 255)';
export const barColor: string = 'rgb(9, 137, 126)';
export const background: string = 'rgb(9, 11, 105)';
export const lineColor: string = 'rgb(0, 0, 0)';
export const backColor: string = 'rgb(192,192,192)';
export const sevenDayLimit: number = 7;
export const thirtyDayLimit: number = 30;
export const monthDateIndex: number = 5;
export const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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
  private chartGoals: number[] = [];
  private barColors: any = [];
  private hoverColors: any = [];

  constructor(
    private modalCtrl: ModalController,
    private settings: Settings) {}

  ionViewDidLoad() {
    this.settings.getValue('log').then((log) => {
      if(log) {
        console.log(log);
        this.log = JSON.parse(log);
        if (this.log.length > 0) {
          this.initChartData();
          this.createBarChart();
          console.log(this.log);
        }
      }
    });
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter() {
    this.settings.getValue('log').then((log) => {
      if(log) {
        console.log(log);
        this.log = JSON.parse(log);
      }
    });
  }


  initChartData() {
    console.log(this.log);
    let i = this.log.length >= sevenDayLimit ? this.log.length - sevenDayLimit : 0;
    while(i < this.log.length) {
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
          labels: this.chartLabels,
          datasets: [{
            data: this.chartGoals,
            type: 'line',
            borderColor: lineColor,
            fill: false
          }, {
            label: "steps",
            data: this.chartValues,
            duration: 2000,
            easing: 'eastInQuart',
            backgroundColor: barColor,
            hoverBackgroundColor: this.hoverColors
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
                max: 6000, //TODO: Determine the max from step data
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
                autoSkip: false
              }
            }]
          }
        }
      });
  }

  onChartClick() {
    console.log("Graph was clicked!");
    let graphModal = this.modalCtrl.create('GraphPage', {log: this.log});
    graphModal.present();
  }
}
