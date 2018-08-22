import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { StepEntry } from "../../models/step-log.model";
import { NgForm } from "@angular/forms";
import { LogService } from "../../providers/logs/logs.service";

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
  isEditable: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private logService: LogService) {

    this.entry = this.navParams.get('entry');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogEntryPage');
    console.log(this.entry);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onClickEdit() {
    this.isEditable = true;
  }

  onSubmit(form: NgForm) {
    console.log(form);
    let note = form.value.note;
    const steps = form.value.steps;
    const goal = form.value.goal;
    const groupWalk = form.value.groupWalk;
    if (!note) {
      note = '';
    }
    this.logService.updateEntry(this.entry.data.date, steps, goal, note, groupWalk);
    form.resetForm();
    // this.viewCtrl.dismiss();
    this.viewCtrl.dismiss({
      date: this.entry.data.date,
      data: {
        steps: steps,
        goal: goal,
        note: note,
        groupWalk: groupWalk
      }
    });
  }

}
