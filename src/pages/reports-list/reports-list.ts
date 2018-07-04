import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';

import { Report } from '../../models/report';
import { Reports } from '../../providers';

/**
 * Generated class for the ReportsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reports-list',
  templateUrl: 'reports-list.html',
})
export class ReportsListPage {
  listReports = new Array();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public reports: Reports,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController) {

    this.listReports = reports.query();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportsListPage');
  }

  showReportInfo(report: Report) {
    let toast = this.toastCtrl.create({
      message: "This List Item was Clicked!",
      duration: 500,
      position: 'bottom'
    });
    toast.present();

    this.navCtrl.push('ReportDetailPage', {
      report: report
    });
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addReport() {
    let toast = this.toastCtrl.create({
      message: "Add Report Button Clicked!",
      duration: 500,
      position: 'bottom'
    });
    toast.present();

    let addModal = this.modalCtrl.create('ServiceRequestPage');
    addModal.onDidDismiss(report => {
      if (report) {
        this.reports.add(report);
      }
    });
    addModal.present();
  }

  /**
 * Delete an item from the list of items.
 */
  deleteItem(item) {
    this.reports.delete(item);
  }
}
