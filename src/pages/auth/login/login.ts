import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, ToastController, ViewController} from 'ionic-angular';

import {User} from "../../../models/user.model";
import {Subscription} from "rxjs";
import { MainPage } from "../../index";
import { AuthService } from "../../../providers/auth/auth.service";

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
  private selectedGroup: number = null;
  private authStatusSub: Subscription;
  private loading = this.loadingCtrl.create({
    content: 'Signing you in... ',
    spinner: 'dots'
  });

  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              private authService: AuthService,
              private loadingCtrl: LoadingController) {}



  ionViewDidLoad() {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          console.log("User was logged in!");
          this.loading.dismiss();
          this.navCtrl.setRoot(MainPage);
        } else {
          let toast = this.toastCtrl.create({
            message: 'Unable to sign you up at this time.',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          console.log("User was not logged in!");
          this.loading.dismiss();
        }
      });
  }

  // Attempt to login in through our User service
  doLogin() {
    this.authService.signInEmail(this.account.email, this.password);
    this.loading.present();
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

    this.authService.signInGoogle(this.groups[this.selectedGroup].name);
    this.loading.present();
  }

  ionViewWillLeave() {
    this.authStatusSub.unsubscribe();
  }
}
