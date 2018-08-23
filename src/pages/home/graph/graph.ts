import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Chart } from 'chart.js';

import { barColor, hoverColor, lineColor } from "../home";
import {
  sevenDayLimit,
  TimeService
} from "../../../providers/time/time.service";
import { LogService } from "../../../providers/logs/logs.service";
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
  templateUrl: 'graph.html',
})
export class GraphPage {

  @ViewChild('barChart') barChart;

  private barChartEl: any = null;
  private chartLabels: any = [];
  private chartValues: number[] = [];
  private chartGoals: number[] = [];
  private fullChartData: {date: string, data: StepEntry}[] = [];
  private todayIndex: number = 0;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private logService: LogService,
    private timeService: TimeService,
    private modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    this.initChartData();
    this.createBarChart();
  }

  ionViewWillEnter() {
    this.updateChartData();
    console.log('ionViewWillEnter in GraphPage');
  }



  initChartData() {
    let logData = this.logService.getThirtyDatesData();
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
      if (i == this.todayIndex) {
        this.chartLabels.push('Today');
      } else {
        this.chartLabels.push(logData[i].data.date.monthNum + '/' + logData[i].data.date.day);
      }
      this.chartValues.push(logData[i].data.steps);
      this.chartGoals.push(logData[i].data.goal);
      this.fullChartData.push(logData[i]);
      i++;
    }
    console.log(this.chartGoals);
  }

  updateChartData() {
    this.chartValues = [];
    this.chartGoals = [];
    this.fullChartData = [];
    let logData = this.logService.getThirtyDatesData();
    let i = this.todayIndex - sevenDayLimit + 1;
    while(i <= this.todayIndex) {
      this.chartValues.push(logData[i].data.steps);
      this.chartGoals.push(logData[i].data.goal);
      this.fullChartData.push(logData[i]);
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
      console.log(array[1]._index);
      const index = array[0]._index;
      console.log(this.fullChartData[index]);
      let entryModal = this.modalCtrl.create('LogEntryPage', {entry: this.fullChartData[index]}, { cssClass: 'inset-modal' });
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

  onEntryClick(entry: StepEntry, index: number) {
    console.log('Entry clicked!!!' + entry);
    console.log(entry);
    let entryModal = this.modalCtrl.create('LogEntryPage', {entry: this.fullChartData[index]}, { cssClass: 'inset-modal' });
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
    //let entryModal = this.modalCtrl.create(LogEntryPage, {entry: entry}, { cssClass: 'inset-modal' });
    //entryModal.present();
  }
}
