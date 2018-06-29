import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Meetup } from '../../models/meetup';
import { MeetupRestApi } from '../meetup-rest-api/meetup-rest-api';

/*
  Generated class for the MeetupsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Meetups {

  constructor(public api: MeetupRestApi) {
    console.log('Hello MeetupsProvider Provider');
    console.log(api.group_params);
  }

  query(params?: any) {

  }

  add(meetup: Meetup) {

  }

  delete(meetup: Meetup) {

  }

}
