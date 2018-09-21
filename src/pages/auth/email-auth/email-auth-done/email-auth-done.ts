import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { AuthService } from "../../../../providers/auth/auth.service";
import { Settings } from "../../../../providers/settings/settings";

@IonicPage()
@Component({
  selector: 'page-email-auth-done',
  templateUrl: 'email-auth-done.html',
})
export class EmailAuthDonePage {
  public userEmail: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private settings: Settings,
    private toastCtrl: ToastController,
    ) {

    this.userEmail = this.navParams.get('email');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailAuthDonePage');
    this.authService.signInWithEmailLink(this.userEmail).then(() => {
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
