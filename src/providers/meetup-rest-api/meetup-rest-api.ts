import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the MeetupRestApi provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MeetupRestApi {
  url: string = 'https://api.meetup.com';
  urlv2: string = 'https://api.meetup.com/2';
  apiKey: string = '3397a10b4c7d5764234a662434e76';

  endpoints = {
    find_groups: 'find/groups',
    categories: '2/categories'
  };

  group_params = {
    'sign': 'true',
    'photo-host': 'public',
    'zip': '92092',
    'fallback_suggestions': 'true',
    'text': 'walking',
    'radius': '25',
    'category': '9,32',
    'order': 'most_active',
    'page': '20',
    'key': this.apiKey
  }

  constructor(public http: HttpClient) {
    console.log('Hello MeetupDataProvider Provider');
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        //reqOpts.params = reqOpts.params.set(reqOpts[k], params[k]);
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }


    console.log("Printing reqOpts");
    console.log(reqOpts);

    return new Promise(resolve => {
      this.http.get(this.url + '/' + endpoint, reqOpts).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }

  getGroups() {
    //let resp_val = this.get(this.endpoints.find_groups, this.test_params, this.test_opts);
    let resp_val = this.get(this.endpoints.find_groups, this.group_params);
    console.log("Printing out response data");
    console.log(resp_val);
    return resp_val;
  }

}
