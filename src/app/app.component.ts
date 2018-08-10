import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Config, Platform } from 'ionic-angular';

import { AuthService, Settings } from '../providers';
import { MainPage } from "../pages";

@Component({
  template: `<ion-nav #content [root]="root"></ion-nav>`
})
export class MyApp {
  root: any = MainPage;

  constructor(platform: Platform,
              settings: Settings,
              private config: Config,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private authService: AuthService) {

    platform.ready().then(() => {
      this.root = MainPage;
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
