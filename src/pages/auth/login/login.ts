import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, ToastController, ViewController} from 'ionic-angular';

import {User} from "../../../models/user.model";
import {Subscription} from "rxjs";
import { MainPage } from "../../index";
import { AuthService } from "../../../providers/auth/auth.service";
import { LogService } from "../../home/logs.service";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  googleButtonNormal = "assets/google_signin/btn_google_signin_dark_normal_web@2x.png";
  googleButtonPressed = "assets/google_signin/btn_google_signin_dark_pressed_web@2x.png";
  currentGoogleButton = this.googleButtonNormal;

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
              private toastCtrl: ToastController,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private logService: LogService) {}



  ionViewDidLoad() {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          console.log("User was logged in!");
          this.logService.initializeUserLog(this.authService.getActiveUser().googleUID)
            .then(() => {
              this.loading.dismiss();
              //TODO: RemoveView error is still being caused by the above dismiss.
              //TODO: Need to load the users data here or make sure it is before MainPage is set as root.
              this.navCtrl.setRoot(MainPage);
            });
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
    this.loading.present();
    this.authService.signInEmail(this.account.email, this.password);
  }

  onGoogleSignIn() {
    this.currentGoogleButton = this.googleButtonPressed;
    setTimeout(() => {
      this.currentGoogleButton = this.googleButtonNormal;
    }, 100);
    this.authService.signInGoogle();
    console.log('Button pressed!');
    this.loading.present();
  }

  ionViewWillLeave() {
    this.authStatusSub.unsubscribe();
  }
}
