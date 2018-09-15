import { Component, NgZone } from '@angular/core';
import { InfiniteScroll, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from "@agm/core";
import { } from 'googlemaps';

import { RouteService } from "./routes.service";
import { Route } from "./route.model";
import { EventService } from "../events/events.service";

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

  public routes: Route[] = [];
  public lat: number = 32.87395225;
  public long: number = -117.22725327337258;
  public searchControl: FormControl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private routeService: RouteService,
    private loadingCtrl: LoadingController,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private eventService: EventService)
  {

    // create search FormControl
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutesPage');

    // Load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let elem = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[0];
      let autocomplete = new google.maps.places.Autocomplete(elem);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // Verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude
          this.lat = place.geometry.location.lat();
          this.long = place.geometry.location.lng();
          this.updateRoutes();
          console.log('Location found is ' + this.lat + ',' + this.long);
        })
      });
    });

    this.setCurrentPosition().then((coord) => {
      if (coord) {
        this.updateRoutes();
      }
    });
  }

  ionViewWillEnter() {
    this.eventService.retrieveEventDBList().then((data) => {
      console.log('The evenDBList contains ', data);
    });
  }

  private updateRoutes() {
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

  getNewRoutes(ev: any) {
    console.log(ev);
    console.log(ev.target.value);
  }

  private setCurrentPosition(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.lat = position.coords.latitude;
          this.long = position.coords.longitude;
          console.log('Location found is ' + this.lat + ',' + this.long);
          resolve({lat: this.lat, lng: this.long});
        });
      } else {
        resolve(null);
      }
    });
  }

  getMoreRoutes(infiniteScroll: InfiniteScroll) {
    this.routeService.getNextRoutes().then((routes) => {
      infiniteScroll.complete();
      if (routes) {
        this.routes = routes;
      } else {
        infiniteScroll.enable(false);
      }
    });
  }
}
