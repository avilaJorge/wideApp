import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import {IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';

import { Items } from '../mocks/providers/items';
import {
  Settings,
  Api,
  MeetupRestApi,
  Meetups,
  GetItDoneRestApi,
  AuthService
} from '../providers';
import { MyApp } from './app.component';
import { Reports } from '../providers/reports/reports';
import { MenuPage } from "../pages/menu/menu";

import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule, AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth, AngularFireAuthModule } from "angularfire2/auth";


export const firebaseConfig = {
  apiKey: "AIzaSyD1rrQ_0rEsmEMQSf7YMFckom7XSjAQpuk",
  authDomain: "wide-app.firebaseapp.com",
  databaseURL: "https://wide-app.firebaseio.com",
  projectId: "wide-app",
  storageBucket: "wide-app.appspot.com",
  messagingSenderId: "1037117039704"
};

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    MenuPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MenuPage
  ],
  providers: [
    SplashScreen,
    StatusBar,
    AngularFireAuth,
    AngularFireDatabase,
    AuthService,
    Api,
    MeetupRestApi,
    GetItDoneRestApi,
    Items,
    Meetups,
    Reports,
    Camera,
    Toast,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule { }
