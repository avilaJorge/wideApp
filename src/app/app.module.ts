import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AngularFireModule } from "angularfire2";
import { AngularFireAuth, AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireStorageModule } from "angularfire2/storage";
import { AngularFirestoreModule } from "angularfire2/firestore";

import { Camera } from '@ionic-native/camera';
import { Geolocation } from "@ionic-native/geolocation";
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Toast } from '@ionic-native/toast';
import { SocialSharing } from "@ionic-native/social-sharing";
import { Crop } from "@ionic-native/crop";
import { ImagePicker } from "@ionic-native/image-picker";
import { GoogleMaps } from "@ionic-native/google-maps";
import { Firebase } from "@ionic-native/firebase";
import { LaunchNavigator } from "@ionic-native/launch-navigator";
import { Calendar } from "@ionic-native/calendar";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import {
  ROUND_PROGRESS_DEFAULTS,
  RoundProgressEase,
  RoundProgressService
} from "angular-svg-round-progressbar";
import { AgmCoreModule } from "@agm/core";

import { FeedService } from "../pages/feed/feed.service";
import { ComponentsModule } from "../components/components.module";
import { EventService } from "../pages/events/events.service";
import { UARestApi } from '../providers/api/ua-rest-api';
import { RouteService } from "../pages/routes/routes.service";
import { MeetupRestApi } from '../providers/api/meetup-rest-api';
import { Settings } from "../providers/settings/settings";
import { FirebaseService } from "../providers/firebase/firebase-integration.service";
import { AuthService } from "../providers/auth/auth.service";
import { TimeService } from "../providers/time/time.service";
import { LogService } from "../pages/home/logs.service";
import { MyApp } from './app.component';
import { firebaseConfig } from "../environment/environment";
import { FCM } from '../providers/fcm/fcm';
import { FitbitRestApi } from '../providers/api/fitbit-rest-api';

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
    option4: 'Hello',
    stride: 28.0
  });
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ComponentsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyClg9p_2Ub2XIHv9cZ37MMVQcKgEX6dTHA',
      libraries: ["places"]
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    SplashScreen,
    StatusBar,
    AngularFireAuth,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    Firebase,
    FirebaseService,
    FCM,
    Geolocation,
    AuthService,
    TimeService,
    LogService,
    Calendar,
    LaunchNavigator,
    GoogleMaps,
    InAppBrowser,
    Camera,
    Crop,
    ImagePicker,
    Toast,
    FeedService,
    SocialSharing,
    MeetupRestApi,
    UARestApi,
    EventService,
    RouteService,
    { provide: ROUND_PROGRESS_DEFAULTS, useValue: {color: '#f00', background: '#0f0'} },
    RoundProgressService,
    RoundProgressEase,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FitbitRestApi,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
