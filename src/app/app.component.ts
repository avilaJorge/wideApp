import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Config, Platform } from 'ionic-angular';

import { AuthService, LogsService, Settings } from '../providers';
import { FirstRunPage, MainPage } from "../pages";

@Component({
  template: `<ion-nav #content [root]="root"></ion-nav>`
})
export class MyApp {
  root: any = FirstRunPage;

  constructor(platform: Platform,
              settings: Settings,
              private config: Config,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private authService: AuthService,
              private logService: LogsService) {

    platform.ready().then(() => {
      settings.load().then((data) => {
        console.log("Got settings loaded.  Now printing return from load!");
        console.log(data);
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        const isAuth = this.authService.autoAuthUser(data);
        console.log(isAuth);
        if (isAuth) {
          console.log("IsAuth");
          this.root = MainPage;
        }
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    });
  }
}
