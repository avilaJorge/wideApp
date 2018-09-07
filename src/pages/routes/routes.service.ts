import { Injectable } from '@angular/core';
import { Route } from "./route.model";
import { UARestApi } from "../../providers/ua-rest-api/ua-rest-api";
import { Settings } from "../../providers/settings/settings";

@Injectable()
export class RouteService {

  routes: Route[];
  constructor(
    private api: UARestApi,
    private settings: Settings,
  ) {}

  getRoutes(lat: number, long: number): Promise<Route[]> {
    return new Promise<any>((resolve, reject) => {
      this.settings.getValue('routes').then((routes) => {
        if(routes) {
          console.log('Routes exist in local storage');
          this.routes = routes;
          resolve(routes);
        } else {
          console.log('Routes do not exist in local storage, will fetch from UA');
          this.api.getRoutes(lat, long).then((res) => {
            console.log(res);
            this.routes = [];
            let data = JSON.parse(res.body);
            console.log(data);
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
