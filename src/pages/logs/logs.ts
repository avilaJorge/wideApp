import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { StepEntry } from "../../models/step-log.model";

/**
 * Generated class for the LogsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logs',
  templateUrl: 'logs.html',
})
export class LogsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogsPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter LogsPage');
  }

  onEntryClick(entry: StepEntry) {
    console.log('Entry clicked!!!' + entry);
  }
}
