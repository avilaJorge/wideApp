import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';

import { AuthService } from "../../../../providers/auth/auth.service";
import { Settings } from "../../../../providers/settings/settings";
import { Subscription } from "rxjs";
import { LogService } from "../../../home/logs.service";
import { MainPage } from "../../../index";

@IonicPage()
@Component({
  selector: 'page-email-auth-done',
  templateUrl: 'email-auth-done.html',
})
export class EmailAuthDonePage {

  public userEmail: string = '';
  private authStatusSub: Subscription = null;
  private signInSuccessful: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private settings: Settings,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private logService: LogService,
    ) {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuth) => {
      if (!this.signInSuccessful && isAuth) {
        console.log("User is authenticated via email link!");
        this.signInSuccessful = true;
        let loading = this.loadingCtrl.create({
            content: 'Signing you in... ',
            spinner: 'dots'
          });
        loading.present();
        this.logService.initializeUserLog(this.authService.getActiveUser().googleUID).then(() => {
          window.location.reload();
          loading.dismiss();
        });
      }
    });
    this.userEmail = this.navParams.get('email');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailAuthDonePage');
    this.authService.sendSigninLink(this.userEmail).then(() => {
      this.settings.setValue('emailForSignIn', this.userEmail);
    }).catch((error) => {
      console.log(error);
      let toast = this.toastCtrl.create({
        message: "An error occured sending the email link.  Please hit the back button and re-enter your email.",
        duration: 3000
      });
      toast.present();
    });
  }

}
