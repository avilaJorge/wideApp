import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../../api/api';
import { meetupConfig } from "../../../environment/environment";
import { map } from "rxjs/operators";
import { Meetup } from "../../../pages/events/meetup.model";

/*
  Generated class for the MeetupRestApi provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MeetupRestApi {
  url: string = 'https://api.meetup.com/';
  group: string = 'San-Diegos-plan2BFIT-Walking-Group'

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
    console.log('Hello MeetupDataProvider Provider');
  }

  // get(endpoint: string, params?: any, reqOpts?: any) {
  //   params['key'] = meetupConfig.apiKey;
  //   return super.get(endpoint, params, reqOpts);
  // }

  getEvents() {
    const options = { params: new HttpParams()
        .set('photo-host', 'public')
        .set('page', '20')
        .set('sig_id', '87508102')
        .set('sig', '5d282060610d3e49511efd2bac5ffbbdfe56da3a')};

    return this.http.jsonp<{meta: any, data: Meetup[]}>
    (this.url + this.group + '/events?' + options.params.toString(), 'callback')
      .toPromise()
      .then(response => response.data as Meetup[]);

  }


  //getGroups() {
  //  //let resp_val = this.get(this.endpoints.find_groups, this.test_params, this.test_opts);
  //  let resp_val = this.get(this.endpoints.find_groups, this.group_params);
  //  console.log("Printing out response data");
  //  console.log(resp_val);
  //  return resp_val;
  //}

}
