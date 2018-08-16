import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import {LogsService} from "../../providers";

/**
 * Generated class for the AddLogEntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-log-entry',
  templateUrl: 'add-log-entry.html',
})
export class AddLogEntryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private logService: LogsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddLogEntryPage');
  }

  onSubmit(form: NgForm) {
    const date = form.value.date;
    console.log((new Date(date)).toISOString());
    this.logService.addEntry(form.value.date, form.value.steps, form.value.goal, form.value.description);
    form.resetForm();
    this.navCtrl.pop();
  }

}
