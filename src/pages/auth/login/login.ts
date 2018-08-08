import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, ToastController} from 'ionic-angular';

import {AuthService} from "../../../providers";
import {User} from "../../../models/user.model";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  groups = [
    {value: 0, name: 'Walking for Fitness, Chula Vista'},
    {value: 1, name: 'Heart and Soles Lakeside Walkers, Lakeside'},
    {value: 2, name: 'Glide \'N Stride, San Diego'},
    {value: 3, name: 'Pep \'N Step, San Diego'},
    {value: 4, name: 'Blazing Turtles, San Diego'},
    {value: 5, name: 'H.E.A.L.T.H, Spring Valley'},
    {value: 6, name: 'Stepping for Fitness, San Diego'}
  ];

  account: User = new User({
    googleUID: '',
    userName: 'John Doe',
    photoURL: '',
    email: 'test@test.com',
    authExpires: '',
    groupName: null
  });
  password: string = 'puppies';
  isAuthenticated: boolean = false;
  private selectedGroup: number = null;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private authService: AuthService,
              private loadingCtrl: LoadingController) {}

  // Attempt to login in through our User service
  doLogin() {
    this.authService.signInEmail(this.account.email, this.password)
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
    console.log('The selected group is: ' + this.selectedGroup);

    if (!this.selectedGroup) {
      const toast = this.toastCtrl.create({
        message: 'Please select a group before clicking this button.',
        duration: 2500
      });
      toast.present();
      return;
    }

    const loading = this.loadingCtrl.create({
      content: 'Signing you up ... ',
      spinner: 'dots'
    }); loading.present();
    this.authService.signInGoogle(this.groups[this.selectedGroup].name).then((isAuth) => {
      loading.dismiss();
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
