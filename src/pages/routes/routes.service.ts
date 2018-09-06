import { Injectable } from '@angular/core';
import { Route } from "./route.model";
import { UARestApi } from "../../providers/ua-rest-api/ua-rest-api";

@Injectable()
export class RouteService {

  routes: Route[];
  lat: number = 32.87395225;
  long: number = -117.22725327337258;
  constructor(
    private api: UARestApi,
  ) {}

  getRoutes(): Promise<Route[]> {
    return new Promise<any>((resolve, reject) => {
      this.api.getRoutes().then((res) => {
        console.log(res);
        this.routes = [];
        let data = JSON.parse(res.body);
        console.log(data);
        for (let route of data._embedded.routes) {
          console.log(route);
          this.routes.push(new Route(route, this.lat, this.long));
        }
        resolve([...this.routes]);
      }, (err) => reject(err) );
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
}
