import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

import { MeetupRestApi } from "../../providers/api/meetup-rest-api";
import { DBMeetup, Meetup, MeetupComment,  MeetupProfile, MeetupRSVP, Response } from "./meetup.model";
import { AuthService } from "../../providers/auth/auth.service";
import { User } from "../../models/user.model";
import { FirebaseService } from "../../providers/firebase/firebase-integration.service";
import { inches_in_mile } from "../routes/route.model";
import { Settings } from "../../providers/settings/settings";


@Injectable()
export class EventService {
  private events: Meetup[] = [];
  private eventData;
  private eventDBList: DBMeetup[];
  private eventDBMap: any = {};
  private user: User;
  private selfProfile: MeetupProfile = null;
  private stride: number;

  constructor(
    private meetupApi: MeetupRestApi,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private firebaseService: FirebaseService,
    private settings: Settings
  ) {
    this.retrieveProfile('self')
      .then((profile) => {
        this.selfProfile = profile;
      }).catch((err) => {
        console.log(err);
    });
    this.retrieveEventDBList();
    this.settings.getValue('stride').then((value) => {
      this.stride = value;
    });
  }

  retrieveProfile(memberId: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.meetupApi.getProfile(memberId)
        .then((profile) => {
          if (profile.photo) {
            profile.photo.photo_link =
              this.sanitizer.bypassSecurityTrustStyle(`url(${profile.photo.photo_link})`);
            profile.photo.thumb_link =
              this.sanitizer.bypassSecurityTrustStyle(`url(${profile.photo.thumb_link})`);
          } else {
            let photo = this.sanitizer.bypassSecurityTrustStyle(`url(assets/imgs/no-person.png)`);
            profile.photo = {
              thumb_link: photo,
              photo_link: photo
            };
          }
          console.log(profile);
          let profModel = new MeetupProfile(profile);
          console.log(profModel);
          resolve(profModel);
        }, (err) => reject(err));
    });
  }

  getSelfProfile() {
    return this.selfProfile;
  }


  getEvents(): Promise<any> {
    this.user = this.authService.getActiveUser();
    if (this.user.isMeetupAuthenticated) {
      console.log('User is Meetup Authenticated!');
      return new Promise<any>((resolve, reject) => {
        this.meetupApi.getAuthEvents()
          .then((res) => {
            console.log(res);
            this.eventData = JSON.parse(res.body);
            console.log(this.eventData);
            for (let entry of this.eventData) {
              console.log(entry);
              this.events.push(new Meetup(entry));
            }
            console.log(this.events);
            resolve(this.events);
          }, (err) => reject(err));
      })
    } else {
      console.log('User is not Meetup Authenticated!');
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

  updateRSVPInfo(response: Response, yesRSVPCount: number, index: number, id: string) {
    if (this.events[index].id !== id) {
      console.log('The EventService events array not longer matches others');
      return;
    }
    this.events[index].meetupSelf.rsvp.response = response;
    this.events[index].yesRSVPCount = yesRSVPCount;
  }

  getEventComments(eventId: string, eventName: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.meetupApi.getEventComments(eventId, eventName)
        .then((res) => {
          console.log(res);
          let data = JSON.parse(res.body);
          let comments: MeetupComment[] = [];
          for (let com of data) {
            if (com.member.photo) {
              com.member.photo.thumb_link =
                this.sanitizer.bypassSecurityTrustStyle(`url(${com.member.photo.thumb_link})`);
            } else {
              com.member.photo = {
                thumb_link: this.sanitizer.bypassSecurityTrustStyle(`url(assets/imgs/no-person.png)`)
              };
            }
            if (com.replies) {
              for (let reply of com.replies) {
                if (reply.member.photo) {
                  reply.member.photo.thumb_link =
                    this.sanitizer.bypassSecurityTrustStyle(`url(${reply.member.photo.thumb_link})`);
                } else {
                  reply.member.photo = {
                    thumb_link: this.sanitizer.bypassSecurityTrustStyle(`url(assets/imgs/no-person.png)`)
                  };
                }
              }
            }
            comments.push(new MeetupComment(com));
          }
          resolve([...comments]);
        }, (err) => reject(err));
    });
  }

  postEventComment(comment: string, inReplyTo: number, eventId: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.meetupApi.postComment(comment, inReplyTo, eventId)
        .then((res) => {
          console.log(res);
          resolve(res);
        }, (err) => reject(err));
    });
  }

  getRSVPList(eventId: string): Promise<MeetupRSVP[]>{
    return new Promise<any>((resolve, reject) => {
      this.meetupApi.getEventRSVPList(eventId)
        .then((res) => {
          console.log(res);
          let data = JSON.parse(res.body);
          let rsvps: MeetupRSVP[] = [];
          for (let com of data) {
            if (com.member.photo) {
              com.member.photo.photo_link =
                this.sanitizer.bypassSecurityTrustStyle(`url(${com.member.photo.photo_link})`);
              com.member.photo.thumb_link =
                this.sanitizer.bypassSecurityTrustStyle(`url(${com.member.photo.thumb_link})`);
            } else {
              let photo = this.sanitizer.bypassSecurityTrustStyle(`url(assets/imgs/no-person.png)`);
              com.member.photo = {
                thumb_link: photo, photo_link: photo
              };
            }
            rsvps.push(new MeetupRSVP(com));
          }
          resolve([...rsvps]);
        }, (err) => reject(err));
    });
  }

  retrieveEventDBList(): Promise<any> {
    return this.firebaseService.getMeetupList().then((data) => {
      let list = data as DBMeetup[];
      console.log(list);
      this.eventDBList = list;
      this.createEventDBMap(data);
      return list;
    });
  }

  private createEventDBMap(events: DBMeetup[]): Promise<boolean> {
    return new Promise((resolve) => {
      this.eventDBMap = {};
      if (events) {
        events.forEach((event) => {
          this.eventDBMap[event.id] = event;
          if (event.route) {
            // TODO: This will likely not update step counts when the user changes it in the settings page.
            this.eventDBMap[event.id].route.steps = (event.route.dist * inches_in_mile) / this.stride;
          }
        });
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  getEventDBList(): DBMeetup[] {
    return this.eventDBList;
  }

  getEventDBMap(): any {
    return this.eventDBMap;
  }

  getRouteLinkedWithEvent(meetup_id: string): Promise<DBMeetup> {
    return this.firebaseService.getRouteInMeetupDB(meetup_id);
  }
}
