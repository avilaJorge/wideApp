import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MeetupRestApi } from "../../providers";
import { map } from "rxjs/operators";
import { Meetup } from "./meetup.model";

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  eventData: any;
  events: Meetup[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public meetupApi: MeetupRestApi,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let load = this.loadingCtrl.create({
      content: 'Loading Meetups ...'
    });
    load.present();
    this.meetupApi.getEvents()
      .then((res) => {
        load.dismiss();
        console.log(res);
        console.log(typeof(res));
        this.eventData = res;
        for (let entry of this.eventData) {
          console.log(entry);
          this.events.push(new Meetup(entry));
        }
        console.log(this.events);
      })


    console.log('ionViewDidLoad EventsPage');
  }


  onClickEvent(item: Meetup) {
    console.log("Event clicked!");
    console.log(item);
    this.navCtrl.push('EventDetailPage', {event: item});
  }
}
