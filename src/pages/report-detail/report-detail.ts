import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Reports } from '../../providers';

/**
 * Generated class for the ReportDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-detail',
  templateUrl: 'report-detail.html',
})
export class ReportDetailPage {
  report: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, reports: Reports) {
    this.report = navParams.get('report') || reports.defaultReport;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportDetailPage');
  }

}
