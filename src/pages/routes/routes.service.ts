import { Injectable } from '@angular/core';
import { MeetupRouteDB, Route, RouteMetaData } from "./route.model";
import { UARestApi } from "../../providers/api/ua-rest-api";
import { Settings } from "../../providers/settings/settings";
import { FirebaseService } from "../../providers/firebase/firebase-integration.service";
import { DBMeetup } from "../events/meetup.model";

@Injectable()
export class RouteService {

  private routes: Route[];
  private lastCoords: {lat: number, lng: number} = {lat: 0, lng: 0};
  private routesMetaData: RouteMetaData;
  private stride: number = 0;

  constructor(
    private api: UARestApi,
    private settings: Settings,
    private firebaseService: FirebaseService
  ) {
    this.settings.getValue('lastCoords').then((value) => {
      if (value) {
        this.lastCoords = value;
      }
    });
    this.settings.getValue('routesMetaData').then((value) => {
      if (value) {
        this.routesMetaData = value;
      }
    });
    this.settings.getValue('stride').then((value) => {this.stride = value;});
  }

  getRoutes(lat: number, long: number): Promise<Route[]> {
    return new Promise<any>((resolve, reject) => {
      this.settings.getValue('routes').then((routes) => {
        if(routes && (this.lastCoords.lat === lat && this.lastCoords.lng === long)) {
          console.log('Routes exist in local storage');
          this.routes = routes;
          resolve(routes);
        } else {
          console.log('Routes do not exist in local storage, will fetch from UA');
          this.lastCoords = {lat: lat, lng: long};
          this.settings.setValue('lastCoords', this.lastCoords);
          this.api.getRoutes(lat, long).then((res) => {
            console.log(res);
            this.routes = [];
            let data = JSON.parse(res.body);
            console.log(data);
            this.routesMetaData = new RouteMetaData(data, data.total_count);
            this.settings.setValue('routesMetaData', this.routesMetaData);
            console.log(this.routesMetaData);
            for (let route of data._embedded.routes) {
              console.log(route);
              this.routes.push(new Route(route, lat, long, this.stride));
            }
            this.settings.setValue('routes', this.routes);
            resolve([...this.routes]);
          }, (err) => reject(err) );
        }
      }).catch((err) => reject(err));
    });
  }

  getNextRoutes(): Promise<Route[]> {
    return new Promise<any>((resolve, reject) => {
      if (this.routesMetaData.remaining >0 && this.routesMetaData.next_link) {
        this.api.getNextRoutes(this.routesMetaData.next_link).then((res) => {
          console.log(res);
          let data = JSON.parse(res.body);
          console.log(data);
          this.routesMetaData = new RouteMetaData(data, this.routesMetaData.remaining);
          this.settings.setValue('routesMetaData', this.routesMetaData);
          console.log(this.routesMetaData);
          for (let route of data._embedded.routes) {
            console.log(route);
            this.routes.push(new Route(route, this.lastCoords.lat, this.lastCoords.lng, this.stride));
          }
          this.settings.setValue('routes', this.routes);
          resolve([...this.routes]);
        }, (err) => reject(err) );
      } else {
        resolve(null);
      }
    });
  }

  getKMLFile(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.api.getKMLFile(id).then((res) => {
        console.log(res);
        resolve(res);
      }, (err) => reject(err));
    });
  }

  clearLocalStorage() {
    this.settings.setValue('routes', null).then((data) => {
      console.log("routes data in local storage is now ", data);
    });
  }

  linkRouteWithMeetup(meetup_data: DBMeetup, route_data: MeetupRouteDB): Promise<any> {
    return this.firebaseService.storeRouteInMeetupDB(meetup_data, route_data)
      .then((response) => {
        console.log(response);
        console.log('This route was successfully added to Meetup ', meetup_data.id, ' ', meetup_data.name);
      });
  }
}
