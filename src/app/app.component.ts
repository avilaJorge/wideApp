import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Config, Platform } from 'ionic-angular';

import { Settings } from "../providers/settings/settings";
import { AuthService } from "../providers/auth/auth.service";
import { LogService } from "../providers/logs/logs.service";
import { FirstRunPage, MainPage } from "../pages";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  template: `<ion-nav #content [root]="root"></ion-nav>`
})
export class MyApp {
  root: any;

  constructor(platform: Platform,
              settings: Settings,
              private config: Config,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private authService: AuthService,
              private logService: LogService,
              private fireAuth: AngularFireAuth,
              )
  {

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
          // if (data.full_log) {
          // TODO: Change this back to the above code.
          if (isAuth) {
            console.log("We have a full log in settings");
            this.logService.setFullLog(JSON.parse(data.full_log)).then(() => {
              console.log('MAde it into the setting of rootpage');
              this.root = MainPage;
              this.statusBar.styleDefault();
              this.splashScreen.hide();
            });
          } else {
            console.log('Preparing to initialize the Users log');
            console.log(this.authService.getActiveUser());
            console.log(data);
            this.logService.initializeUserLog(data.user.googleUID)
              .then(() => {
                this.root = MainPage;
                this.statusBar.styleDefault();
                this.splashScreen.hide();
              });
          }
        } else {
          this.root = FirstRunPage;
          this.statusBar.styleDefault();
          this.splashScreen.hide();
        }
      });
      fireAuth.auth.onAuthStateChanged((user) => {
        console.log('onAuthStateChanged called in app.component');
        if (!user) {
          this.root = FirstRunPage;
          console.log('user logout was detected in app component');
        }
      });
    });
  }
}
