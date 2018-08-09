import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { Subscription } from "rxjs";

import { AuthService } from "../../providers";
import { User } from "../../models/user.model";

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  private isAuthenticated: boolean = false;
  private authStatusSub: Subscription;
  private user: User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authService: AuthService,
              private modalCtrl: ModalController) {}

  ionViewDidLoad() {
    this.isAuthenticated = this.authService.isAuth;
    this.user = this.authService.getActiveUser();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
        this.user = this.authService.getActiveUser();
      });
    console.log('ionViewDidLoad AccountPage');
  }

  onLogin() {
    const addModal = this.modalCtrl.create('LoginPage');
    addModal.onDidDismiss((isAuth) => {
      this.isAuthenticated = isAuth;
      this.user = this.authService.getActiveUser();
    });
    addModal.present();
  }

  onSignUp() {
    const addModal = this.modalCtrl.create('SignupPage');
    addModal.onDidDismiss((isAuth) => {
      this.isAuthenticated = isAuth;
      this.user = this.authService.getActiveUser();
    });
    addModal.present();
  }

  onSignOut() {
    console.log('onSignOut(): User was logged out!');
    this.isAuthenticated = false;
    this.user = null;
    this.authService.signOut();
  }

  ionViewWillLeave() {
    this.authStatusSub.unsubscribe();
  }
}
