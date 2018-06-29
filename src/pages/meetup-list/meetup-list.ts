import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';

import { MeetupRestApi } from '../../providers/meetup-rest-api/meetup-rest-api';
import { Meetups } from '../../providers';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public meetups: Meetups,
    public meetupRest: MeetupRestApi, private toast: Toast) {
    this.getGroups();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetupPage');
  }

  showMeetupInfo(item) {
    this.toast.show('Card was clicked!', '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  getGroups() {
    console.log('Calling Meetup Api');
    this.meetupRest.getGroups().then(data => {
      for (let prop in data) {
        console.log(data[prop]);
        this.cardItems.push({
          organizer_photo: data[prop].organizer.photo ? data[prop].organizer.photo.thumb_link : 'assets/imgs/no_user1.png',
          name: data[prop].name,
          city: data[prop].city,
          key_photo: data[prop].key_photo ? data[prop].key_photo.photo_link :
            data[prop].group_photo ? data[prop].group_photo.photo_link : '',
          description: data[prop].description
        });

      }
      console.log(this.cardItems);
    })
  }
}
