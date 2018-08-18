import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { AddLogEntryPage } from "../add-log-entry/add-log-entry";
import { LogsService } from "../../providers";
import { StepEntry } from "../../models/step-log.model";
import { LogEntryPage } from "../log-entry/log-entry";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logService: LogsService,
    private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogsPage');
  }

  ionViewWillEnter() {
    this.log = this.logService.getLog();
    console.log('ionViewWillEnter LogsPage');
  }

  onEntryClick(entry: StepEntry) {
    console.log('Entry clicked!!!' + entry);
    let entryModal = this.modalCtrl.create(LogEntryPage, {entry: entry});
    entryModal.present();
  }
}
