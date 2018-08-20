import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
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
  AuthService,
  LogService,
  FirebaseService
} from '../providers';
import { MyApp } from './app.component';
import { Reports } from '../providers/reports/reports';
import { MenuPage } from "../pages/menu/menu";
import { firebaseConfig } from "../environment/environment";

import { AngularFireModule } from "angularfire2";
import { AngularFireAuth, AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireStorageModule } from "angularfire2/storage";
import { AngularFirestoreModule } from "angularfire2/firestore";

import { AddLogEntryPage } from "../pages/add-log-entry/add-log-entry";
import { LogEntryPage } from "../pages/log-entry/log-entry";
import { FeedService } from "../pages/feed/feed.service";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Crop } from "@ionic-native/crop";
import { ImagePicker } from "@ionic-native/image-picker";

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
    MenuPage,
    AddLogEntryPage,
    LogEntryPage,
    //custom components
    // BackgroundImage,
    // ShowHideContainer,
    // ShowHideInput,
    // ColorRadio,
    // CounterInput,
    // Rating,
    // GoogleMap
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MenuPage,
    AddLogEntryPage,
    LogEntryPage
  ],
  providers: [
    SplashScreen,
    StatusBar,
    AngularFireAuth,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    FirebaseService,
    AuthService,
    LogService,
    Camera,
    Crop,
    ImagePicker,
    Toast,
    FeedService,
    SocialSharing,
    Api,
    MeetupRestApi,
    GetItDoneRestApi,
    Items,
    Meetups,
    Reports,

    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
