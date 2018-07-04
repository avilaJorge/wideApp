import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';

/*
  Generated class for the MeetupRestApi provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MeetupRestApi extends Api {
  url: string = 'https://api.meetup.com';
  apiKey: string = '3397a10b4c7d5764234a662434e76';

  //endpoints = {
  //  find_groups: 'find/groups',
  //  categories: '2/categories'
  //};

  //group_params = {
  //  'sign': 'true',
  //  'photo-host': 'public',
  //  'zip': '92092',
  //  'fallback_suggestions': 'true',
  //  'text': 'walking',
  //  'radius': '25',
  //  'category': '9,32',
  //  'order': 'most_active',
  //  'page': '20',
  //  'key': MeetupRestApi.apiKey
  //}

  constructor(public http: HttpClient) {
    super(http);
    console.log('Hello MeetupDataProvider Provider');
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    params['key'] = this.apiKey;
    return super.get(endpoint, params, reqOpts);
  }


  //getGroups() {
  //  //let resp_val = this.get(this.endpoints.find_groups, this.test_params, this.test_opts);
  //  let resp_val = this.get(this.endpoints.find_groups, this.group_params);
  //  console.log("Printing out response data");
  //  console.log(resp_val);
  //  return resp_val;
  //}

}
