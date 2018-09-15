import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

import { StepEntry } from "../../../models/step-log.model";
import { LogService } from "../logs.service";

/**
 * Generated class for the LogEntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-log-entry',
  templateUrl: 'log-entry.html',
})
export class LogEntryPage {
  public entry: {date:string, data: StepEntry};
  public fitbitData: {dateTime: string, value: number} = null;
  public loadFitbit: boolean = false;
  public logEntry: FormGroup;
  public fitbitIconURL: string = 'assets/imgs/fitbit/icons/Fitbit_app_icon.png';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private logService: LogService,
    private toastCtrl: ToastController) {

    this.entry = this.navParams.get('entry');
    this.fitbitData = this.navParams.get('fitbit_data');
    this.loadFitbit = this.navParams.get('load_fitbit');
    console.log(this.entry);
    console.log(this.fitbitData);
    let goal = this.entry.data.goal;
    if (goal === 0) {

      let logData = this.logService.getDatesData();
      let i = logData.length - 1;
      while (i >= 0) {
        if (logData[i].data.goal > 0) {
          goal = logData[i].data.goal;
          break;
        }
        i--;
      }
    }

    this.logEntry = this.formBuilder.group({
      date: ['', Validators.required],
      steps: ['', Validators.required],
      goal: ['', Validators.required],
      note: [''],
      groupWalk: ['']
    });
    this.logEntry.controls['date'].setValue(this.entry.date);
    if (this.loadFitbit && this.fitbitData) {
      this.logEntry.controls['steps'].setValue(this.fitbitData.value);
    } else if (this.entry.data.steps > 0 || !this.fitbitData) {
      this.logEntry.controls['steps'].setValue(this.entry.data.steps);
    } else {
      this.logEntry.controls['steps'].setValue(this.fitbitData.value);
    }
    this.logEntry.controls['goal'].setValue(goal);
    this.logEntry.controls['note'].setValue(this.entry.data.note);
    this.logEntry.controls['groupWalk'].setValue(this.entry.data.groupWalk);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogEntryPage');
    console.log(this.entry);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onSubmit() {
    const data = this.logEntry.value;
    if (data.goal === "" || data.steps === "") {
      let toast = this.toastCtrl.create({
        message: "Please enter a valid step count and goal.",
        duration: 2000,
        position: 'top'
      });
      toast.present();
      return;
    }
    const goalNum = parseInt(data.goal, 10);
    const stepsNum = parseInt(data.steps, 10);
    if (goalNum < 0 || stepsNum < 0) {
      let toast = this.toastCtrl.create({
        message: "Please enter a valid step count and goal.",
        duration: 2000,
        position: 'top'
      });
      toast.present();
      return;
    }
    console.log(data);
    this.logService.updateEntry(data.date, data.steps, data.goal, data.note, data.groupWalk);
    this.viewCtrl.dismiss({
      date: data.date,
      data: {
        date: data.date,
        steps: data.steps,
        goal: data.goal,
        note: data.note,
        groupWalk: data.groupWalk
      }
    });
  }

}
