import { Injectable } from "@angular/core";

import { MeetupRestApi } from "../../providers";
import { Meetup } from "./meetup.model";


@Injectable()
export class EventService {
  events: Meetup[] = [];
  private eventData;

  constructor(
    private meetupApi: MeetupRestApi,
  ) {}

  getEvents(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.meetupApi.getEvents()
        .then((res) => {
          console.log(res);
          this.eventData = res;
          for (let entry of this.eventData) {
            console.log(entry);
            this.events.push(new Meetup(entry));
          }
          resolve(this.events);
        }, (err) => reject(err));
    });
  }

}
