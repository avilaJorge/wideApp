import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Subscription } from "rxjs";

import { User } from "../../models/user.model";
import { AuthService } from "../../providers/auth/auth.service";
import { Settings } from "../../providers/settings/settings";
import { FormBuilder, FormGroup } from "@angular/forms";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { backendURL, fitbitConfig, meetupConfig } from "../../environment/environment";
import { FirebaseService } from "../../providers/firebase/firebase-integration.service";

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  private isAuthenticated: boolean = false;
  private authStatusSub: Subscription;
  private user: User;
  private state: string = '';

  private meetupAuthURL: string = meetupConfig.authorize_uri +
    '?client_id=' + meetupConfig.client_id +
    '&response_type=code&redirect_uri=' +
    backendURL + 'app/auth/meetup' +
    meetupConfig.auth_scope;

  private fitbit_logo_url: string = 'assets/imgs/fitbit/logo/Fitbit_logo_RGB.png';

  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';

  subSettings: any = AccountPage;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: Settings,
              public formBuilder: FormBuilder,
              private authService: AuthService,
              private firebaseService: FirebaseService,
              private iab: InAppBrowser,
              private loadingCtrl: LoadingController) {}

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3],
      stride: [this.options.stride]
    };

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      console.log(v);
      this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    this.isAuthenticated = this.authService.isAuth;
    this.user = this.authService.getActiveUser();
    this.state = this.user.googleUID;
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuth) => {
        console.log('AuthStatusSub called in AccountPage');
        this.isAuthenticated = isAuth;
        this.user = this.authService.getActiveUser();
      });
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
    console.log('ionViewDidLoad AccountPage');
  }

  onSignOut() {
    console.log('onSignOut(): User was logged out!');
    this.isAuthenticated = false;
    this.user = null;
    this.authService.signOut();
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      console.log(this.options);
      this._buildForm();
    });
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }

  ionViewWillLeave() {
    this.authStatusSub.unsubscribe();
  }

  onIntegrateMeetup() {
    const browser = this.iab.create(this.meetupAuthURL + '&state=' + this.state, '_system');
    const load = this.loadingCtrl.create({
      content: 'Integrating with Meetup ...'
    });
    load.present();
    const fbSub = this.firebaseService.getMeetupIntegrationResult(this.user.googleUID)
      .subscribe((data) => {
        console.log(data.payload.data());
        const userData = data.payload.data();
        if (userData.isMeetupAuthenticated) {
          load.dismiss();
          this.user = userData;
          this.authService.saveAuthData(this.authService.getToken(), userData);
          fbSub.unsubscribe();
        }
      }, (error) => {
        console.log(error);
      });

  }

  onIntegrateFitbit() {
    const browser = this.iab.create(fitbitConfig.user_auth_url + '&state=' + this.state, '_system');
    const load = this.loadingCtrl.create({
      content: 'Integrating with Fitbit ...'
    });
    load.present();
    const fbSub = this.firebaseService.getFitbitIntegrationResult(this.user.googleUID)
      .subscribe((data) => {
        console.log(data.payload.data());
        const userData = data.payload.data();
        if (userData.isFitbitAuthenticated) {
          load.dismiss();
          this.user = userData;
          this.authService.saveAuthData(this.authService.getToken(), userData);
          fbSub.unsubscribe();
        }
      }, (error) => {
        console.log(error);
      });
  }
}
