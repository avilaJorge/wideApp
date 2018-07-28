import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../../index';
import {AuthService} from "../../../providers";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'testpassword'
  };

  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private authService: AuthService) {}

  // Attempt to login in through our User service
  doLogin() {
    this.authService.signInEmail(this.account.email, this.account.password)
      .then((resp) => {
        this.navCtrl.push(MainPage);
      })
      .catch((err) => {
        this.navCtrl.push(MainPage);
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });  toast.present();
    });
  }
}
