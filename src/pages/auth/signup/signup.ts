import { Component } from '@angular/core';
import {IonicPage,
        LoadingController,
        NavController,
        ToastController} from 'ionic-angular';

import { MainPage } from '../../index';
import { AuthService } from '../../../providers';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, username: string, email: string, password: string } = {
    name: 'Test Human',
    username: 'testHuman99',
    email: 'test@example.com',
    password: 'testpassword'
  };

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private authService: AuthService,
              public loadingCtr: LoadingController) {}

  doSignup() {

    const loading = this.loadingCtr.create({
      content: 'Signing you up ... ',
      spinner: 'dots'
    }); loading.present();

    this.authService.signUpEmail(this.account.email, this.account.password)
      .then((data) => {
        console.log(data);
        loading.dismiss();
        this.navCtrl.push(MainPage);
      })
      .catch((error) => {
        loading.dismiss();
        this.navCtrl.push(MainPage);
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
