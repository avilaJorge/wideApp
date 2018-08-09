import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, ToastController, ViewController} from 'ionic-angular';
import { Subscription } from "rxjs";

import { AuthService } from '../../../providers';
import { User } from "../../../models/user.model";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  groups = [
    {value: 0, name: 'Walking for Fitness, Chula Vista'},
    {value: 1, name: 'Heart and Soles Lakeside Walkers, Lakeside'},
    {value: 2, name: 'Glide \'N Stride, San Diego'},
    {value: 3, name: 'Pep \'N Step, San Diego'},
    {value: 4, name: 'Blazing Turtles, San Diego'},
    {value: 5, name: 'H.E.A.L.T.H, Spring Valley'},
    {value: 6, name: 'Stepping for Fitness, San Diego'}
  ];
  selectedGroup: number = null;

  account: User = new User({
    googleUID: '',
    userName: 'John Doe',
    photoURL: '',
    email: 'test@test.com',
    authExpires: '',
    groupName: null
  });

  password: string = 'puppies';
  private authStatusSub: Subscription;
  private loading = this.loadingCtrl.create({
    content: 'Signing you in... ',
    spinner: 'dots'
  });

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private viewCtrl: ViewController,
              private authService: AuthService,
              private loadingCtrl: LoadingController) {}

  ionViewDidLoad() {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          console.log("User was logged in!");
          this.loading.dismiss();
          this.viewCtrl.dismiss(true);
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
  doSignup() {
    this.account.groupName = this.groups[this.selectedGroup].name;
    this.authService.signUpEmail(this.account.email, this.password, this.account);
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

    this.account.groupName = this.groups[this.selectedGroup].name;
    this.authService.signInGoogle(this.groups[this.selectedGroup].name);
    this.loading.present();
  }
}
