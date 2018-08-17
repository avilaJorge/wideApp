import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Chart } from 'chart.js';

import { StepEntry } from "../../models/step-log.model";
import { LogsService, Settings } from "../../providers";

const hoverColor: string = 'rgb(0, 0, 255)';
const barColor: string = 'rgb(9, 137, 126)';
const background: string = 'rgb(9, 11, 105)';
const lineColor: string = 'rgb(255, 255, 0)';
const sevenDayLimit: number = 7;
const thirtyDayLimit: number = 30;
const monthDateIndex: number = 5;
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('barChart') barChart;

  private log: StepEntry[] = [];
  private barChartEl: any = null;
  private mixedChartEl: any = null;
  private chartLabels: any = [];
  private chartValues: number[] = [];
  private chartGoals: number[] = [];
  private barColors: any = [];
  private hoverColors: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logService: LogsService,
    private settings: Settings,
    private modalCtrl: ModalController) {
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
    let i = this.log.length - sevenDayLimit;
    while(i < this.log.length) {
      this.chartLabels.push(this.log[i].date.substring(monthDateIndex));
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
    let graphModal = this.modalCtrl.create(GraphPage, {log: this.log});
    graphModal.present();
  }
}

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
  public currentDate = new Date().getDate();

  constructor(
    private viewCtrl: ViewController,
    private logService: LogsService,
    public params: NavParams
  ){

    const whatever = this.params.get('log');
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
