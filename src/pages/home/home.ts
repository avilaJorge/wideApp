import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
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
  private mixedChartEl: any = null;
  private chartLabels: any = [];
  private chartValues: number[] = [];
  private chartGoals: number[] = [];
  private barColors: any = [];
  private hoverColors: any = [];
  private barColor: string = 'rgb(9, 137, 126)';
  private background: string = 'rgb(9, 11, 105)';
  private hoverColor: string = 'rgb(0, 0, 255)';
  private lineColor: string = 'rgb(255, 255, 0)';

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
    let i = 0;
    while(i < this.log.length) {
      this.chartLabels.push(this.log[i].date.substring(5));
      this.chartValues.push(this.log[i].steps);
      this.barColors.push(this.barColor);
      this.hoverColors.push(this.hoverColor);
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
            borderColor: this.lineColor,
            fill: false
          }, {
            label: "steps",
            data: this.chartValues,
            duration: 2000,
            easing: 'eastInQuart',
            backgroundColor: this.barColor,
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

  onChartClick() {
    console.log("Graph was clicked!");
    let graphModal = this.modalCtrl.create(GraphPage, {log: this.log});
    graphModal.present();
  }
}

@Component({
  template: `
  <ion-header>

    <ion-navbar>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">Close</button>
      </ion-buttons>
      <ion-title>Graph</ion-title>
    </ion-navbar>

  </ion-header>


  <ion-content padding>
    <div [hidden]="!log">
      <h5>Parameters passed:</h5>
      {{log}}

    </div>
    <div [hidden]="log">
      <p>No parameters passed.</p>
    </div>
    <button ion-button color="danger" full (click)="dismiss()">Close Modal</button>

  </ion-content>`
})
export class GraphPage {
  private log: StepEntry[] = [];
  constructor(
    private viewCtrl: ViewController,
    public params: NavParams){
    console.log(params);
    this.log = params.get('log');
    console.log(this.log);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
