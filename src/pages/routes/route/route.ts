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
  stride: number = 0.0;
  steps: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private routeService: RouteService,
    private settings: Settings,
    private loadingCtrl: LoadingController,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,)
  {

    this.route = this.navParams.get('route');
    // this.kml_url = 'https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml';
    // this.kml_url = 'https://firebasestorage.googleapis.com/v0/b/wide-app.appspot.com/o/239802353.kml?alt=media&token=43f7a36c-b058-4553-999f-c0d10269ec38';
    // this.kml_url = 'https://www.googleapis.com/download/storage/v1/b/wide-app.appspot.com/o/routes%2F392782210.kml?generation=1536215448574862&alt=media';
    this.route_lat = this.route.starting_location.coordinates[1];
    this.route_lng = this.route.starting_location.coordinates[0];
    console.log(this.route);
    this.settings.getValue('stride').then((stride) => {
      if (stride > 0) {
        this.stride = stride;
        this.steps = (this.route.distanceInMiles * inches_in_mile) / this.stride;
      } else {
        let toast = this.toastCtrl.create({
          message: "Update your stride length in the Account tab to get approximate steps for this route.",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    });
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

  ionViewWillEnter() {
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
              position: 'bottom'
            });
            toast.present();
          });
      }
    });
  }
}
