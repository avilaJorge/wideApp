import { Component, NgZone } from '@angular/core';
import { InfiniteScroll, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from "@agm/core";
import { Geolocation } from '@ionic-native/geolocation';
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
    private geolocation: Geolocation,
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
    let load = this.loadingCtrl.create({content: 'Loading Routes ...'});
    load.present();
    this.setCurrentPosition().then((coord) => {
      if (coord) {
        this.updateRoutes().then(() => {
          load.dismiss();
        });
      } else {
        load.dismiss();
      }
    });

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

  }

  ionViewWillEnter() {
    this.eventService.retrieveEventDBList().then((data) => {
      console.log('The evenDBList contains ', data);
    });
  }

  private updateRoutes(): Promise<any>{
    return this.routeService.getRoutes(this.lat, this.long).then((routes) => {
      this.routes = routes;
      console.log(this.routes);
    });
  }

  onRouteClick(route: Route, i) {
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
      console.log(navigator);
      if ("geolocation" in navigator) {
        console.log("Geolocation is in navigator");
        this.geolocation.getCurrentPosition().then((position) => {
          this.lat = position.coords.latitude;
          this.long = position.coords.longitude;
          console.log('Location found is ' + this.lat + ',' + this.long);
          resolve({lat: this.lat, lng: this.long});
        }).catch( (error) => {
          console.log("There was an error get the current position");
          console.log(error);
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
