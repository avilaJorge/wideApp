import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Meetup } from "../meetup.model";
import { Calendar } from "@ionic-native/calendar";
import { LaunchNavigator, LaunchNavigatorOptions } from "@ionic-native/launch-navigator";
import { DomSanitizer } from "@angular/platform-browser";
import { AuthService } from "../../../providers/auth/auth.service";
import { User } from "../../../models/user.model";
import { MeetupRestApi } from "../../../providers";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private calendar: Calendar,
    private launchNav: LaunchNavigator,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private meetupAPI: MeetupRestApi,
  ) {

    this.event = this.navParams.get('event');
    this.index = this.navParams.get('index');
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
        this.rsvpSampleURLs.push(this.sanitizer.bypassSecurityTrustStyle(`url(${mem.photo.thumb_link})`))
      } else {
        this.rsvpSampleURLs.push(this.avatarImageUrl);
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
  }

  likeEvent() {
    console.log('clicked Like!');
  }

  unlikeEvent() {
    console.log('clicked Unlike');
  }

  joinAndRSVP() {
    if (this.user.isMeetupAuthenticated) {
      console.log('You RSVPd');
      this.meetupAPI.eventRSVP(this.event.id).then((resp) => {
        console.log(resp);
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
}
