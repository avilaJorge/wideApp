import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
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
  entry: {date:string, data: StepEntry};
  public logEntry: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private logService: LogService) {

    this.entry = this.navParams.get('entry');
    console.log('Showing entry in LogEntry Constructor');
    console.log(this.entry);
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
    this.logEntry.controls['steps'].setValue(this.entry.data.steps);
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
