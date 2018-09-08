import { Injectable } from '@angular/core';
import { Route, RouteMetaData } from "./route.model";
import { UARestApi } from "../../providers/ua-rest-api/ua-rest-api";
import { Settings } from "../../providers/settings/settings";

@Injectable()
export class RouteService {

  private routes: Route[];
  private lastCoords: {lat: number, lng: number} = {lat: 0, lng: 0};
  private routesMetaData: RouteMetaData;
  constructor(
    private api: UARestApi,
    private settings: Settings,
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
    })
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
              this.routes.push(new Route(route, lat, long));
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
            this.routes.push(new Route(route, this.lastCoords.lat, this.lastCoords.lng));
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
}
