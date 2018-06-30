import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Meetups } from '../../providers';

/**
 * Generated class for the MeetupDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meetup-detail',
  templateUrl: 'meetup-detail.html',
})
export class MeetupDetailPage {
  meetup: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    meetups: Meetups) {

    this.meetup = navParams.get('meetup') || meetups.defaultMeetup;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetupDetailPage');
  }

}
