import { Component } from '@angular/core';
import {
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { Meetup, MeetupComment, MeetupProfile, MeetupRSVP, Response, rsvp_status } from "../meetup.model";
import { Calendar } from "@ionic-native/calendar";
import { LaunchNavigator, LaunchNavigatorOptions } from "@ionic-native/launch-navigator";
import { DomSanitizer } from "@angular/platform-browser";
import { AuthService } from "../../../providers/auth/auth.service";
import { User } from "../../../models/user.model";
import { MeetupRestApi } from "../../../providers";
import { EventService } from "../events.service";

/**
 * Generated class for the EventDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {
  public event: Meetup;
  public rsvpList: MeetupRSVP[] = [];
  public comments: MeetupComment[] = [];
  private hasRSVP: Response;
  private index: number = null;
  public user: User = null;
  public title: string = 'Event location';
  public mapOptions = {
    zoom: 12
  };
  private mapZoom: number = 15;
  private mapSize: string = '800x300';
  private apiKey: string = 'AIzaSyClg9p_2Ub2XIHv9cZ37MMVQcKgEX6dTHA';
  private mapBaseURL: string = 'https://maps.googleapis.com/maps/api/staticmap';
  public mapSrc: string = '';
  public safeMapSrcStyle: any;
  private launchNavOpts: LaunchNavigatorOptions;
  public rsvpGoingURLs: any[] = [];
  public rsvpNotGoingURLs: any[] = [];
  private avatarImageUrl: string = 'assets/imgs/no-person.png';
  public selfProfile: MeetupProfile;
  public goingOutline = true;
  public notGoingOutline = true;
  public rsvpString: string;
  public guestCount: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private calendar: Calendar,
    private launchNav: LaunchNavigator,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private meetupAPI: MeetupRestApi,
    private eventService: EventService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
  ) {

    this.event = this.navParams.get('event');
    this.index = this.navParams.get('index');
    this.selfProfile = this.eventService.getSelfProfile();
    console.log('SelfProfile: ' + this.selfProfile);
    this.hasRSVP = this.event.meetupSelf.rsvp ?
      (this.event.meetupSelf.rsvp.response ?
        this.event.meetupSelf.rsvp.response : Response.No) : Response.No;
    this.setButtonOutlines(this.hasRSVP);
    this.rsvpString = rsvp_status[this.hasRSVP];
    if (this.event.venue) {
      this.launchNavOpts = {
        destinationName: this.event.venue.name,
      };
      let centerStr = '?center=' + this.event.venue.lat + ',' + this.event.venue.lon;
      let zoomStr = '&zoom=' + this.mapZoom;
      let sizeStr = '&size=' + this.mapSize;
      let keyStr = '&key=' + this.apiKey;
      let mapType = '&maptype=roadmap';
      let markerStr = '&markers=' + this.event.venue.lat + ',' + this.event.venue.lon;
      this.mapSrc = this.mapBaseURL + centerStr + zoomStr + sizeStr + mapType + markerStr + keyStr;
      this.safeMapSrcStyle = this.sanitizer.bypassSecurityTrustStyle(`url(${this.mapSrc})`);
    }

    let load = this.loadingCtrl.create({spinner: 'dots'});
    load.present();
    this.eventService.getRSVPList(this.event.id)
      .then((data) => {
        for (let entry of data) {
          if (entry.response === Response.Yes) {
            // @ts-ignore
            this.rsvpGoingURLs.push(entry.member.photo.thumb_link);
          } else {
            // @ts-ignore
            this.rsvpNotGoingURLs.push(entry.member.photo.thumb_link);
          }
          if (entry.guests) this.guestCount += entry.guests;
          this.rsvpList.push(entry);
        }
        load.dismiss();
        console.log('The guest count is ' + this.guestCount);
      });
  }

  onGoingClick() {
    if (this.goingOutline) {
      this.hasRSVP = Response.Yes;
      this.rsvpString = rsvp_status[this.hasRSVP];
      this.goingOutline = !this.goingOutline;
      if (!this.notGoingOutline) {
        this.notGoingOutline = !this.notGoingOutline;
      }
      this.joinAndRSVP(Response.Yes);
    }
  }

  onNotGoingClick() {
    if (this.notGoingOutline) {
      this.hasRSVP = Response.No;
      this.rsvpString = rsvp_status[this.hasRSVP];
      this.notGoingOutline = !this.notGoingOutline;
      if (!this.goingOutline) {
        this.goingOutline = !this.goingOutline;
      }
      this.joinAndRSVP(Response.No);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailPage');
    console.log(this.mapSrc);
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter EventDetailPage');
    this.user = this.authService.getActiveUser();
    this.eventService.getEventComments(this.event.id)
      .then((comments) => {
        this.comments = comments;
        console.log(comments);
    });
  }

  likeEvent() {
    console.log('clicked Like!');
  }

  unlikeEvent() {
    console.log('clicked Unlike');
  }

  joinAndRSVP(responded: Response) {
    if (this.user.isMeetupAuthenticated) {
      let load = this.loadingCtrl.create({spinner: 'dots', content: 'Sending RSVP Response'});
      load.present();
      this.meetupAPI.eventRSVP(this.event.id, MeetupRSVP.getStrResponse(responded)).then((resp) => {
        console.log(resp);
        let data = JSON.parse(resp.body);
        this.event.meetupSelf.rsvp.response = MeetupRSVP.getResponse(data.response);
        this.event.yesRSVPCount = data.event.yes_rsvp_count;
        this.hasRSVP = MeetupRSVP.getResponse(data.response);
        this.rsvpString = rsvp_status[this.hasRSVP];
        this.eventService.updateRSVPInfo(this.event.meetupSelf.rsvp.response,
          this.event.yesRSVPCount, this.index, this.event.id);
        load.dismiss();
      });
    } else {
      const toast = this.toastCtrl.create({
        message: 'Please integrate with Meetup in the account page.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  onAddrClick() {
    if (this.event.venue) {
      this.launchNav.navigate(
        [this.event.venue.lat, this.event.venue.lon],
        this.launchNavOpts
      ).then(
        success => console.log("Launched Navigator"),
        error => console.log("Error launching Navigator", error)
      );
    }
  }

  onDateClick() {
    this.calendar.createEventInteractively(
      this.event.eventName,
      this.event.venue.location.address_1 + ', ' + this.event.venue.city + ' ' + this.event.venue.zip,
      this.event.howToFindUs || '',
      new Date(this.event.timeInfo.time),
      new Date(this.event.timeInfo.time + this.event.timeInfo.duration)
    ).then(
      (msg) => { console.log(msg); },
      (err) => { console.log(err); }
    );
  }

  addComment(replyToId: number) {
    let commentModal = this.modalCtrl.create(
      'CommentsPage',
      {commentId: replyToId, eventId: this.event.id});
      // {cssClass: 'inset-modal'});
    commentModal.onDidDismiss((data) => {
      if (data) {
        let com = JSON.parse(data.data);
        console.log(com);
        if (com.member.photo) {
          com.member.photo.thumb_link =
            this.sanitizer.bypassSecurityTrustStyle(`url(${com.member.photo.thumb_link})`);
        } else {
          com.member.photo = {
            thumb_link: this.sanitizer.bypassSecurityTrustStyle(`url(assets/imgs/no-person.png)`)
          };
        }
        let comment = new MeetupComment(com);
        if (comment.inReplyTo) {
          for (let entry of this.comments) {
            if (entry.id = comment.inReplyTo) {
              entry.replies.unshift(comment);
            }
          }
        } else {
          this.comments.unshift(comment);
        }
      }
    });
    commentModal.present();
  }

  onMembersGoingClick() {
    this.navCtrl.push('RsvpListPage', {eventId: this.event.id, rsvpList: this.rsvpList});
  }

  private setButtonOutlines(response: Response) {
    switch (response) {
      case Response.No: {
        this.notGoingOutline = false;
        this.goingOutline = true;
        break;
      }
      case Response.Yes: {
        this.goingOutline = false;
        this.notGoingOutline = true;
        break;
      }
      case Response.None: {
        this.goingOutline = true;
        this.notGoingOutline = true;
        break;
      }
      default: {
        this.goingOutline = false;
        this.notGoingOutline = false;
      }
    }
  }
}
