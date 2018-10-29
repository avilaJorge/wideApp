import { Component } from '@angular/core';
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  PopoverController,
  ToastController
} from 'ionic-angular';
import { inches_in_mile, MeetupRouteDB, Route } from "../route.model";
import { RouteService } from "../routes.service";
import { Settings } from "../../../providers/settings/settings";
import { DBMeetup } from "../../events/meetup.model";
import { EventService } from "../../events/events.service";

/**
 * Generated class for the RoutePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutePage {
  route_lat: number = 51.678418;
  route_lng: number = 7.809007;
  kml_url: string = '';
  kml_file_data: string = '';
  route: Route;
  steps: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private routeService: RouteService,
    private settings: Settings,
    private loadingCtrl: LoadingController,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private eventService: EventService)
  {

    this.route = this.navParams.get('route');
    this.route_lat = this.route.starting_location.coordinates[1];
    this.route_lng = this.route.starting_location.coordinates[0];
    console.log(this.route);
    this.steps = this.route.steps;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutePage');
    let load = this.loadingCtrl.create({content: 'loading route ...'});
    load.present();
    this.routeService.getKMLFile(this.route.links.alternate[0].id)
      .then((data) => {
        console.log(data);
        this.kml_file_data = data;
        this.kml_url = data[1].mediaLink;
        load.dismiss();
      });
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create('RouteOptionsPage', {routeData: this.route, kml_url: this.kml_url});
    popover.present({ev: event});
    popover.onDidDismiss((data: {route_data: MeetupRouteDB, meetup_data: DBMeetup}) => {
      if(data) {
        console.log(data);
        this.routeService.linkRouteWithMeetup(data.meetup_data, data.route_data)
          .then(() => {
            let toast = this.toastCtrl.create({
              message: `This route has been added to event ${data.meetup_data.name}`,
              duration: 3000,
              position: 'top'
            });
            toast.present();
            this.eventService.retrieveEventDBList();
          });
      }
    });
  }
}
