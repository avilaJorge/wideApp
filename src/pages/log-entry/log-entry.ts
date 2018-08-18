import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { StepEntry } from "../../models/step-log.model";

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

  entry: StepEntry;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.entry = this.navParams.get('entry');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogEntryPage');
    console.log(this.entry);
  }

}
