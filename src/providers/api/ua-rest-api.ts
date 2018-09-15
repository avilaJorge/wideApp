import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpParams } from "../../../node_modules/@angular/common/http";
import { backendURL } from "../../environment/environment";

@Injectable()
export class UARestApi {

  private redirectURI = backendURL + 'app/';

  constructor(public http: HttpClient) {
    console.log('Hello UaRestApiProvider Provider');
  }

  getRoutes(lat: number, long: number): Promise<any> {
    return this.http.get(this.redirectURI + 'ua/routes?location=' + lat + ',' + long)
      .toPromise()
      .then(response => response);
  }

  getNextRoutes(endpoint: string): Promise<any> {
    const httpOptions = {
      params: new HttpParams()
        .set('endpoint', endpoint)
    };
    return this.http.get(this.redirectURI + 'ua/routes/next', httpOptions)
      .toPromise()
      .then(response => response);
  }

  getKMLFile(id: string): Promise<any> {
    return this.http.get(this.redirectURI + 'ua/route/kml?id=' + id)
      .toPromise()
      .then(response => response);
  }

}
