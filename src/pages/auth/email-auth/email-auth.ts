import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

/**
 * Generated class for the EmailAuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-email-auth',
  templateUrl: 'email-auth.html',
})
export class EmailAuthPage {

  private emailForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailAuthPage');
  }

  emailSubmit() {
    if (this.emailForm.valid) {
      console.log("next click!");
      console.log(this.emailForm);
      this.navCtrl.push('EmailAuthDonePage', {email: this.emailForm.value.email});
    } else {
      let toast = this.toastCtrl.create({
        message: "Please enter a valid email address",
        duration: 3000
      });
      toast.present();
    }
  }
}
