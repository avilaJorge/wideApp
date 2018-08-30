import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

import { MeetupRestApi } from "../../providers";
import { Meetup, MeetupComment, MeetupMember, MeetupProfile, MeetupRSVP, Response } from "./meetup.model";
import { AuthService } from "../../providers/auth/auth.service";
import { User } from "../../models/user.model";


@Injectable()
export class EventService {
  events: Meetup[] = [];
  private eventData;
  private user: User;
  private selfProfile: MeetupProfile;

  constructor(
    private meetupApi: MeetupRestApi,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.retrieveProfile('self')
      .then((profile) => {
        this.selfProfile = profile;
      }).catch((err) => {
        console.log(err);
    });
  }

  retrieveProfile(memberId: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.meetupApi.getProfile(memberId)
        .then((profile) => {
          if (profile.photo) {
            profile.photo.thumb_link =
              this.sanitizer.bypassSecurityTrustStyle(`url(${profile.photo.thumb_link})`);
          } else {
            profile.photo = {
              thumb_link: this.sanitizer.bypassSecurityTrustStyle(`url(assets/imgs/no-person.png)`)
            };
          }
          let profModel = new MeetupProfile(profile);
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

  getEventComments(eventId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.meetupApi.getEventComments(eventId)
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
            rsvps.push(new MeetupRSVP(com));
          }
          resolve([...rsvps]);
        }, (err) => reject(err));
    });
  }
}
