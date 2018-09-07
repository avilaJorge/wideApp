import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { RouteService } from "./routes.service";
import { Route } from "./route.model";

/**
 * Generated class for the RoutesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-routes',
  templateUrl: 'routes.html',
})
export class RoutesPage {

  routes: Route[] = [];
  lat: number = 32.87395225;
  long: number = -117.22725327337258;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private routeService: RouteService,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutesPage');
    let load = this.loadingCtrl.create({content: 'Loading Routes ...'});
    load.present();
    this.routeService.getRoutes(this.lat, this.long).then((routes) => {
      this.routes = routes;
      console.log(this.routes);
      load.dismiss();
    });
  }

  onRouteClick(route: Route, i) {
    console.log('Route clicked');
    console.log('index is ' + i);
    console.log(route);
    this.navCtrl.push('RoutePage', {route: route, index: i});
  }

  clearLocalData() {
    this.routes = [];
    this.routeService.clearLocalStorage();
    let load = this.loadingCtrl.create({content: 'Loading Routes ...'});
    load.present();
    this.routeService.getRoutes(this.lat, this.long).then((routes) => {
      this.routes = routes;
      console.log(this.routes);
      load.dismiss();
    });
  }
}
