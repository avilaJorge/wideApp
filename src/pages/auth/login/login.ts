import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../../index';
import {AuthService} from "../../../providers";
import { mockAccount, User } from "../../../environment/environment";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  account: User = mockAccount;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private authService: AuthService) {}

  // Attempt to login in through our User service
  doLogin() {
    this.authService.signInEmail(mockAccount.email, mockAccount.password)
      .then((resp) => {
        this.navCtrl.push(MainPage);
      })
      .catch((err) => {
        this.navCtrl.push(MainPage);
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: err,
          duration: 3000,
          position: 'top'
        });  toast.present();
    });
  }
}
