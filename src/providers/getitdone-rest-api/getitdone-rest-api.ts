import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';

/*
  Generated class for the GetItDoneRestApi provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetItDoneRestApi extends Api {
  url: string = 'http://san-diego.spotreporters.com/open311/v2'
  apiKey: string = '5c47b36d0edeed659a72789d9b1228db';

  constructor(public http: HttpClient) {
    super(http);
    console.log('Hello GetitdoneRestApiProvider Provider');
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    return super.get(endpoint, params, reqOpts);
  }

}
