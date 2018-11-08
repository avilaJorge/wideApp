import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendURL, meetupConfig } from "../../environment/environment";
import { Meetup } from "../../pages/events/meetup.model";
import { AuthService } from "../auth/auth.service";
import { FCM } from "../fcm/fcm";

/*
  Generated class for the MeetupRestApi provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MeetupRestApi {
  url: string = meetupConfig.api_url;
  // group: string = 'San-Diegos-plan2BFIT-Walking-Group';
  group: string = 'Meetup-API-Testing';
  private redirectURI = backendURL + 'app/';

  constructor(
    public http: HttpClient,
    private authService: AuthService,
    private fcm: FCM)
  {
    console.log('Hello MeetupDataProvider Provider');
  }

  initialize(): Promise<any> {
    return new Promise<any> ((resolve, reject) => {
      if (this.authService.getActiveUser().isMeetupAuthenticated) {
        this.getMinProfile('self', 'id,name')
          .then((response) => {
            console.log(response);
            this.fcm.storeMeetupId(response.id, response.name).then((success) => {
              console.log('Meetup data was successfully stored in devices collection ', success);
            });
          });
      }
      resolve();
    });
  }

  getEvents(): Promise<any> {
    const options = { params: new HttpParams()
        .set('photo-host', 'public')
        .set('page', '20')
        .set('sig_id', meetupConfig.unauth_meetups_list_sig_id)
        .set('sig', meetupConfig.unauth_meetups_list_sig)
        .set('fields', 'description_images, featured_photo, group_key_photo, how_to_find_us, rsvp_sample')
    };

    console.log(this.url + this.group + '/events?' + options.params.toString());
    return this.http.jsonp<{meta: any, data: Meetup[]}>
    (this.url + this.group + '/events?' + options.params.toString(), 'callback')
      .toPromise()
      .then(response => response.data as Meetup[]);
  }

  getEventComments(eventId: string, eventName: string): Promise<any> {
    const options = {
      params: new HttpParams()
        .set('group', this.group)
        .set('event_name', eventName)
        .set('eventId', eventId)
        .set('authorization', 'Bearer ' + this.authService.getActiveUser().meetup_access_data.access_token)
    };
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
        .set('authorization', 'Bearer ' + this.authService.getActiveUser().meetup_access_data.access_token)
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
        .set('authorization', 'Bearer ' + this.authService.getActiveUser().meetup_access_data.access_token)
    };
    return this.http.get(this.redirectURI + 'meetup/events', httpOptions)
      .toPromise()
      .then(response => response);
  }

  getProfile(memberId: any): Promise<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams()
        .set('authorization', 'Bearer ' + this.authService.getActiveUser().meetup_access_data.access_token)
        .set('memberId', memberId)
        .set('group', this.group)
    };
    return this.http.get<any>(this.redirectURI + 'meetup/profile', httpOptions)
      .toPromise()
      .then(response => JSON.parse(response.body));
  }

  getMinProfile(memberId: any, only: string): Promise<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams()
        .set('authorization', 'Bearer ' + this.authService.getActiveUser().meetup_access_data.access_token)
        .set('memberId', memberId)
        .set('group', this.group)
        .set('only', only)
    };
    return this.http.get<any>(this.redirectURI + 'meetup/profile/minimal', httpOptions)
      .toPromise()
      .then(response => JSON.parse(response.body));
  }

  postComment(comment: string, replyToId: number, eventId: number): Promise<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams().set('authorization', 'Bearer ' + this.authService.getActiveUser().meetup_access_data.access_token)
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
        .set('authorization', 'Bearer ' + this.authService.getActiveUser().meetup_access_data.access_token)
    };
    return this.http.get(this.redirectURI + 'meetup/rsvp/list', httpOptions)
      .toPromise()
      .then(response => response);
  }

  getHeader() {
    return new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authService.getActiveUser().meetup_access_data.access_token);
  }

  //getGroups() {
  //  //let resp_val = this.get(this.endpoints.find_groups, this.test_params, this.test_opts);
  //  let resp_val = this.get(this.endpoints.find_groups, this.group_params);
  //  console.log("Printing out response data");
  //  console.log(resp_val);
  //  return resp_val;
  //}

}
