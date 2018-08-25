import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Meetup } from "../meetup.model";

/**
 * Generated class for the EventDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {
  public event: Meetup;
  public title: string = 'Event location';
  public mapOptions = {
    zoom: 12
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.event = this.navParams.get('event');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailPage');
  }

  likeEvent() {
    console.log('clicked Like!');
  }

  unlikeEvent() {
    console.log('clicked Unlike');
  }

  joinAndRSVP() {
    console.log('You RSVPd')
  }
}
