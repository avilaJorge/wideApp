import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { Meetup } from '../../../models/meetup';
import { Meetups } from '../../../providers/index';

/**
 * Generated class for the MeetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meetup',
  templateUrl: 'meetup-list.html',
})
export class MeetupListPage {
  cardItems = new Array();
  title: string = 'Meetup Groups';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public meetups: Meetups,
              public toastCtrl: ToastController) {

    this.cardItems = meetups.query();
    //this.getGroups();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Meetup Groups Page');
  }

  showMeetupInfo(meetup: Meetup) {
    let toast = this.toastCtrl.create({
      message: "Card was clicked",
      duration: 1000,
      position: 'bottom'
    });
    toast.present();

    this.navCtrl.push('MeetupDetailPage', {
      meetup: meetup
    });
  }

  //getGroups() {
  //  console.log('Calling Meetup Api');
  //  this.meetupRest.getGroups().then(data => {
  //    for (let prop in data) {
  //      console.log(data[prop]);
  //      this.cardItems.push({
  //        organizer_photo: data[prop].organizer.photo ? data[prop].organizer.photo.thumb_link : 'assets/imgs/no_user1.png',
  //        name: data[prop].name,
  //        city: data[prop].city,
  //        key_photo: data[prop].key_photo ? data[prop].key_photo.photo_link :
  //          data[prop].group_photo ? data[prop].group_photo.photo_link : '',
  //        description: data[prop].description
  //      });

  //    }
  //    console.log(this.cardItems);
  //  })
  //}
}
