import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { EventService } from "../../events/events.service";
import { DBMeetup } from "../../events/meetup.model";
import { MeetupRouteDB, Route } from "../route.model";

@IonicPage()
@Component({
  selector: 'page-route-options',
  templateUrl: 'route-options.html',
})
export class RouteOptionsPage {

  public meetupList: DBMeetup[] = [];
  public route: Route;
  public kml_url: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private eventService: EventService)
  {
    this.route = this.navParams.get('routeData');
    this.kml_url = this.navParams.get('kml_url');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RouteOptionsPage');
    this.meetupList = this.eventService.getEventDBList();
  }

  onItemClick(item: DBMeetup) {
    const data: MeetupRouteDB = {
      id: this.route.links.self[0].id,
      dist: this.route.distanceInMiles,
      gain: this.route.gainInFt,
      max_elevation: this.route.max_elevation,
      min_elevation: this.route.min_elevation,
      kml_url: this.kml_url
    };
    this.viewCtrl.dismiss({route_data: data, meetup_data: item});
  }

}
