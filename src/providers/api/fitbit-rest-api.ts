import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendURL, fitbitConfig } from "../../environment/environment";
import { AuthService } from "../auth/auth.service";
import { User } from "../../models/user.model";

/*
  Generated class for the FitbitProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FitbitRestApi {

  private url: string = backendURL + 'app/';

  constructor(public http: HttpClient,
              public authService: AuthService) {
    console.log('Hello FitbitProvider Provider');
  }

  // if the users token needed to be refreshed this functions will return
  // { new_access_token: true }
  getSteps(date: string, period: string): Promise<any> {
    let user: User = this.authService.getActiveUser();
    const httpOptions = {
      headers: new HttpHeaders().set('reminder', 'need to add firebase authorization header'),
      params: new HttpParams()
        .set('date', date)
        .set('authorization', 'Bearer ' + user.fitbit_access_data.access_token)
        .set('refresh_token', user.fitbit_access_data.refresh_token)
        .set('uid', user.googleUID)
        .set('period', period)
        .set('token_expires', String(user.fitbit_token_expires))
    };
    return this.http.get(this.url + 'fitbit/steps/' + date, httpOptions)
      .toPromise()
      .then(response => response)
      .catch((error) => {
        console.log("Error getting data from Fitbit");
        console.log(error);
      });
  }

}
