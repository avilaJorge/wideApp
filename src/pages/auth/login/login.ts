import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, ToastController} from 'ionic-angular';

import {AuthService} from "../../../providers";
import { mockAccount, User } from "../../../environment/environment";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  account: User = mockAccount;
  isAuthenticated: boolean = false;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private authService: AuthService,
              private loadingCtrl: LoadingController) {}

  // Attempt to login in through our User service
  doLogin() {
    this.authService.signInEmail(mockAccount.email, mockAccount.password)
      .then((success) => {
        console.log(success);
        if (success) {
          this.isAuthenticated = true;
          this.navCtrl.push('AccountPage');
        } else {
          let toast = this.toastCtrl.create({
            message: "An error occured while loggin you in.",
            duration: 3000,
            position: 'top'
          });  toast.present();
        }
      })
      .catch((err) => {
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: err,
          duration: 3000,
          position: 'top'
        });  toast.present();
    });
  }

  onGoogleSignIn() {

    const loading = this.loadingCtrl.create({
      content: 'Signing you up ... ',
      spinner: 'dots'
    }); loading.present();

    this.authService.signInGoogle().then((isAuth) => {
      loading.dismiss();
      this.isAuthenticated = isAuth;
      this.navCtrl.push('AccountPage');
    }).catch((error) => {
      loading.dismiss();
      this.navCtrl.push('AccountPage');
      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: 'Unable to sign you up at this time.  ' + error,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
