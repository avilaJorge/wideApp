import { Injectable } from '@angular/core';

import { Meetup } from '../../../models/meetup';
import { MeetupRestApi } from '../meetup-rest-api/meetup-rest-api';

/*
  Generated class for the MeetupsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Meetups {
  meetups: Meetup[] = [];
  defaultMeetup: any = {
    'organizer_photo': '',
    'name': '',
    'city': '',
    'key_photo': '',
    'description': 'No Meetup Information Available'
  }

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
  }
  //
  // constructor(public api: MeetupRestApi) {
  //   console.log('Hello MeetupsProvider Provider');
  //
  //   this.api.get(this.endpoints.find_groups, this.group_params).then(data => {
  //     for (let index in data) {
  //       console.log(data[index]);
  //       this.meetups.push(new Meetup(data[index]));
  //     }
  //   });
  //   console.log(this.meetups);
  // }

  query(params?: any) {
    return this.meetups;
  }

  add(meetup: Meetup) {
  }

  delete(meetup: Meetup) {

  }

}
