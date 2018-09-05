import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UARestApi {

  // private redirectURI = 'https://us-central1-wide-app.cloudfunctions.net/app/';
  private redirectURI = 'http://localhost:5000/wide-app/us-central1/app/';

  constructor(public http: HttpClient) {
    console.log('Hello UaRestApiProvider Provider');
  }

  getRoutes(): Promise<any> {
    return this.http.get(this.redirectURI + 'ua/routes')
      .toPromise()
      .then(response => response);
  }

  getKMLFile(id: string): Promise<any> {
    return this.http.get(this.redirectURI + 'ua/route/kml?id=' + id)
      .toPromise()
      .then(response => response);
  }

}
