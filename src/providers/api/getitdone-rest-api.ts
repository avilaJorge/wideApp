import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GetItDoneRestApi provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetItDoneRestApi {
  url: string = 'http://san-diego.spotreporters.com/open311/v2'
  apiKey: string = '5c47b36d0edeed659a72789d9b1228db';

  constructor(public http: HttpClient) {
    console.log('Hello GetitdoneRestApiProvider Provider');
  }

}
