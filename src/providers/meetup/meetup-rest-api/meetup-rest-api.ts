import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../../api/api';
import { meetupConfig } from "../../../environment/environment";
import { map } from "rxjs/operators";
import { Meetup } from "../../../pages/events/meetup.model";
import { AuthService } from "../../auth/auth.service";

/*
  Generated class for the MeetupRestApi provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MeetupRestApi {
  url: string = 'https://api.meetup.com/';
  // group: string = 'San-Diegos-plan2BFIT-Walking-Group';
  group: string = 'Meetup-API-Testing';
  sig_id: string = '87508102';
  sig: string = '84ea88d6b8b31e9d8c8a1bdd2a456c4b99eb9f26';
  // private redirectURI = 'https://us-central1-wide-app.cloudfunctions.net/app/';
  private redirectURI = 'http://localhost:5000/wide-app/us-central1/app/';

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

  constructor(
    public http: HttpClient,
    private authService: AuthService) {
    console.log('Hello MeetupDataProvider Provider');
  }

  // get(endpoint: string, params?: any, reqOpts?: any) {
  //   params['key'] = meetupConfig.apiKey;
  //   return super.get(endpoint, params, reqOpts);
  // }

  getEvents(): Promise<any> {
    const options = { params: new HttpParams()
        .set('photo-host', 'public')
        .set('page', '20')
        .set('sig_id', this.sig_id)
        .set('sig', this.sig)
        .set('fields', 'description_images, featured_photo, group_key_photo, how_to_find_us, rsvp_sample')
    };

    console.log(this.url + this.group + '/events?' + options.params.toString());
    return this.http.jsonp<{meta: any, data: Meetup[]}>
    (this.url + this.group + '/events?' + options.params.toString(), 'callback')
      .toPromise()
      .then(response => response.data as Meetup[]);
  }

  getEventComments(eventId: string): Promise<any> {
    const options = {
      params: new HttpParams()
        .set('group', this.group)
        .set('eventId', eventId)
        .set('authorization', 'Bearer ' + this.authService.getActiveUser().meetupAccessToken)
    }
    return this.http.get(this.redirectURI + 'meetup/event/comments', options)
      .toPromise()
      .then(response => response);
  }

  eventRSVP(eventId: string, responded: string): Promise<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams()
        .set('eventId', eventId)
        .set('group', this.group)
        .set('response', responded)
        .set('authorization', 'Bearer ' + this.authService.getActiveUser().meetupAccessToken)
    };
    return this.http.get(this.redirectURI + 'meetup/rsvp', httpOptions)
      .toPromise()
      .then(response => response);
  }

  getAuthEvents(): Promise<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams()
        .set('group', this.group)
        .set('authorization', 'Bearer ' + this.authService.getActiveUser().meetupAccessToken)
    };
    return this.http.get(this.redirectURI + 'meetup/events', httpOptions)
      .toPromise()
      .then(response => response);
  }

  getProfile(memberId: any): Promise<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams()
        .set('authorization', 'Bearer ' + this.authService.getActiveUser().meetupAccessToken)
        .set('memberId', memberId)
        .set('group', this.group)
    };
    return this.http.get<any>(this.redirectURI + 'meetup/profile', httpOptions)
      .toPromise()
      .then(response => JSON.parse(response.body));
  }

  postComment(comment: string, replyToId: number, eventId: number): Promise<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams().set('authorization', 'Bearer ' + this.authService.getActiveUser().meetupAccessToken)
    };
    let body: any;
    if (replyToId > 0) {
      body = {
        comment: comment,
        group: this.group,
        eventId: eventId,
        in_reply_to: replyToId
      };
    } else {
      body = {
        comment: comment,
        group: this.group,
        eventId: eventId,
      };
    }
    return this.http.post(this.redirectURI + 'meetup/event/comment', body, httpOptions)
      .toPromise()
      .then(response => response);
  }

  getEventRSVPList(eventId: string): Promise<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams()
        .set('eventId', eventId)
        .set('group', this.group)
        .set('authorization', 'Bearer ' + this.authService.getActiveUser().meetupAccessToken)
    };
    return this.http.get(this.redirectURI + 'meetup/rsvp/list', httpOptions)
      .toPromise()
      .then(response => response);
  }

  getHeader() {
    return new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authService.getActiveUser().meetupAccessToken);
  }
  //getGroups() {
  //  //let resp_val = this.get(this.endpoints.find_groups, this.test_params, this.test_opts);
  //  let resp_val = this.get(this.endpoints.find_groups, this.group_params);
  //  console.log("Printing out response data");
  //  console.log(resp_val);
  //  return resp_val;
  //}

}
