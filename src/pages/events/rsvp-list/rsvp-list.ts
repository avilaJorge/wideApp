import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { EventService } from "../events.service";
import { MeetupRSVP, Response } from "../meetup.model";

/**
 * Generated class for the RsvpListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rsvp-list',
  templateUrl: 'rsvp-list.html',
})
export class RsvpListPage {
  public eventId: string;
  public rsvpList: MeetupRSVP[] = [];
  public going: MeetupRSVP[] = [];
  public not_going: MeetupRSVP[] = [];
  public goingTab: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private eventService: EventService,
    private loadingCtr: LoadingController) {

    this.eventId = this.navParams.get('eventId');
    this.rsvpList = this.navParams.get('rsvpList');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RsvpListPage');
    for (let entry of this.rsvpList) {
      if (entry.response === Response.Yes) {
        this.going.push(entry);
      } else {
        this.not_going.push(entry);
      }
    }
    // const load = this.loadingCtr.create({
    //   spinner: 'dots'
    // });
    // load.present();
    // this.eventService.getRSVPList(this.eventId)
    //   .then((data) => {
    //     console.log(data);
    //     for (let entry of data) {
    //       if (entry.response === Response.Yes) {
    //         this.going.push(entry);
    //       } else {
    //         this.not_going.push(entry);
    //       }
    //     }
    //     console.log(this.going);
    //     console.log(this.not_going);
    //     load.dismiss();
    //   });
  }


  onSegmentClick(value: any) {
    console.log(value);
    this.goingTab = value;
  }
}
