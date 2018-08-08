import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subscription } from "rxjs";

import { AuthService } from "../../providers";

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authService: AuthService) {}

  ionViewDidLoad() {
    this.isAuthenticated = this.authService.isAuth;
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      });
    console.log('ionViewDidLoad AccountPage');
  }

  onLogin() {
    this.navCtrl.push('LoginPage');
  }

  onSignUp() {
    this.navCtrl.push('SignupPage');
  }

  onSignOut() {
    this.authService.signOut();
  }

  ionViewWillLeave() {
    this.authStatusSub.unsubscribe();
  }
}
