import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MeetupRestApi } from "../../providers";
import { map } from "rxjs/operators";
import { Meetup } from "./meetup.model";
import { EventService } from "./events.service";

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

  events: Meetup[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public meetupApi: MeetupRestApi,
    public loadingCtrl: LoadingController,
    private eventService: EventService) {
  }

  ionViewDidLoad() {
    let load = this.loadingCtrl.create({
      content: 'Loading Meetups ...'
    });
    load.present();
    this.eventService.getEvents()
      .then((res) => {
        console.log(res);
        load.dismiss();
        this.events = res;
      });
    console.log('ionViewDidLoad EventsPage');
  }


  onClickEvent(item: Meetup, index: number) {
    console.log("Event clicked!");
    console.log(item);
    this.navCtrl.push('EventDetailPage', {event: item, index: index});
  }
}
