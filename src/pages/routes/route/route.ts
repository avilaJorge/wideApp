import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Route, ua_end } from "../route.model";
import { RouteService } from "../routes.service";

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
  kml_file_data:string = '';
  route: Route;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private routeService: RouteService) {

    this.route = this.navParams.get('route');
    this.kml_url = 'https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml';
    this.route_lat = this.route.starting_location.coordinates[1];
    this.route_lng = this.route.starting_location.coordinates[0];
    console.log(this.route);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutePage');
    this.routeService.getKMLFile(this.route.links.alternate[0].id)
      .then((data) => {
        console.log(data);
        this.kml_file_data = data;
      });
  }

}
