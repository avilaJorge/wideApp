import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-meetup-main',
  templateUrl: 'meetup-main.html',
})
export class MeetupMainPage {

  isAuthenticated: boolean = false;
  meetupGroupPage = 'MeetupListPage';

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetupMainPage');
  }

  onViewGroups() {
    this.navCtrl.push('MeetupListPage', { isAuthenticated: this.isAuthenticated });
  }

  onViewMyGroups() {

  }

  onViewFriends() {

  }
}
