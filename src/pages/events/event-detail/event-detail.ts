import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Meetup, MeetupComment, MeetupProfile } from "../meetup.model";
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
  public comments: MeetupComment[] = [];
  private hasRSVP: string;
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
  public rsvpSampleURLs: any[] = [];
  private avatarImageUrl: 'assets/imgs/no-person.png';
  public selfProfile: MeetupProfile;


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
  ) {

    this.event = this.navParams.get('event');
    this.index = this.navParams.get('index');
    this.selfProfile = this.eventService.getSelfProfile();
    console.log('SelfProfile: ' + this.selfProfile);
    this.hasRSVP = this.event.meetupSelf.rsvp ?
      (this.event.meetupSelf.rsvp.response ?
        this.event.meetupSelf.rsvp.response : 'no') : 'no';
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
    for (let mem of this.event.rsvpSample) {
      if (mem.photo != '') {
        // @ts-ignore
        this.rsvpSampleURLs.push(this.sanitizer.bypassSecurityTrustStyle(`url(${mem.photo.thumb_link})`));
      } else {
        this.rsvpSampleURLs.push(this.sanitizer.bypassSecurityTrustStyle(`url(${this.avatarImageUrl})`));
      }
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

  joinAndRSVP(responded: string) {
    if (this.user.isMeetupAuthenticated) {
      console.log('You RSVPd');
      this.meetupAPI.eventRSVP(this.event.id, responded).then((resp) => {
        console.log(resp);
        // @ts-ignore
        let data = JSON.parse(resp.body);
        this.event.meetupSelf.rsvp.response = data.response;
        this.event.yesRSVPCount = data.event.yes_rsvp_count;
        this.hasRSVP = data.response;
        this.eventService.updateRSVPInfo(this.event.meetupSelf.rsvp.response,
          this.event.yesRSVPCount, this.index, this.event.id);
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

  onGoingClick() {
    this.navCtrl.push('RsvpListPage', {eventId: this.event.id});
  }
}
