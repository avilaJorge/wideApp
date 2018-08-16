import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {AddLogEntryPage} from "../add-log-entry/add-log-entry";
import {LogsService} from "../../providers";
import {StepEntry} from "../../models/step-log.model";

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

  addLogEntryPage: any = AddLogEntryPage;
  log: StepEntry[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private logService: LogsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogsPage');
  }

  ionViewWillEnter() {
    this.log = this.logService.getLog();
    console.log('ionViewWillEnter LogsPage');
  }

}