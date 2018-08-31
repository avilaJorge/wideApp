import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Meetup, MeetupProfile, MeetupRSVP } from "../meetup.model";
import { EventService } from "../events.service";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public rsvp: MeetupRSVP;
  public profile: MeetupProfile = new MeetupProfile('');
  public group: Meetup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private eventService: EventService) {

    this.rsvp = this.navParams.get('rsvp');
    this.group = this.navParams.get('group');
    console.log(this.rsvp);
    this.eventService.retrieveProfile(this.rsvp.member.id)
      .then((data) => {
        console.log(data);
        this.profile = data;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    console.log(this.profile);
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter ProfilePage');
  }

}
