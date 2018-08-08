import { Component, ViewChild } from '@angular/core';
import {IonicPage, MenuController, Nav, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";

import { MainPage } from "../index";
import {AuthService} from "../../providers";

interface PageItem {
  title: string
  component: any
}
type PageList = PageItem[]

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MainPage;

  pages: PageList;
  private isAuthenticated: boolean = false;
  currentlyLoggedInUser: string;

  constructor(public menuCtrl: MenuController,
              private authService: AuthService,
              private toastCtrl: ToastController,
              private fireAuth: AngularFireAuth) {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Sign In', component: 'LoginPage' },
      { title: 'Sign Up', component: 'SignupPage' }
    ];

    // fireAuth.auth.onAuthStateChanged((user) => {
    //   console.log('Auth state has changed!');
    //   console.log(user);
    //   if(user) {
    //     this.currentlyLoggedInUser = this.authService.getActiveUser().uid;
    //     console.log(this.authService.getActiveUser());
    //     this.isAuthenticated = true;
    //   } else {
    //     this.currentlyLoggedInUser = '';
    //     this.isAuthenticated = false;
    //   }
    //   this.rootPage = MainPage;
    // });
  }

  ionViewDidLoad() {
    console.log('Hello MenuPage Page');
  }

  openPage(page: PageItem) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.menuCtrl.close();
  }


  onSignOut() {
    this.authService.signOut()
      .then(() => {
        this.menuCtrl.close();
        this.nav.setRoot(MainPage);
      })
      .catch(() => {
        const toast = this.toastCtrl.create({
          message: 'You could not be logged out at this time.  Please try again.',
          duration: 2500,
          showCloseButton: true
        }); toast.present();
        this.menuCtrl.close();
      });
  }
}
