import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

import {HttpClient} from "@angular/common/http";
import { AuthService } from "../../../providers/auth/auth.service";

@IonicPage()
@Component({
  selector: 'page-meetup-main',
  templateUrl: 'meetup-main.html',
})
export class MeetupMainPage {

  isAuthenticated: boolean = false;

  constructor(public navCtrl: NavController,
              private http: HttpClient,
              private alertCtrl: AlertController,
              public navParams: NavParams,
              public authService: AuthService) {}




  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetupMainPage');
  }

  onViewGroups() {
    this.navCtrl.push('MeetupListPage', { isAuthenticated: this.isAuthenticated });
  }

  onViewMyGroups() {

  }

  onViewFriends() {
/*    this.authService.getActiveUser().getIdToken()
      .then((token: string) => {
        const userId = this.authService.getActiveUser().uid;
        this.http.put(
          firebaseConfig.databaseURL + '/' + userId + '/account.json?auth=' + token, {}
        ).subscribe(() => {
          console.log("Success! Firebase database accessed!");
        }, (error) => {
          const alert = this.alertCtrl.create({
            title: "An error occured when trying to access the database",
            message: error.message,
            buttons: [{text: 'Ok'}]
          });
          alert.present();
        });
      })
      .catch((error) => {
        const alert = this.alertCtrl.create({
          title: "Could not get user Id token",
          message: error.message,
          buttons: [{text: 'Ok'}]
        }); alert.present();
      });*/

  }
}
