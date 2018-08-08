import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFireAuth } from "angularfire2/auth";
import { Subject } from "rxjs";
import * as firebase from "firebase";

import { User } from "../../models/user.model";
import { Settings } from "..";

@Injectable()
export class AuthService {

  url: string = 'https://us-central1-wide-app.cloudfunctions.net/app/';
  user: User;
  private settingsReady: boolean = false;
  private token: string;
  private userId: string;
  private isAuthenticated = false;
  private userPhoto: string;
  private currentlyLoggedInUser: firebase.User;
  private authStatusListener = new Subject<boolean>();

  constructor(private fireAuth: AngularFireAuth,
              private http: HttpClient,
              private settings: Settings) {
    this.settings.load().then(() => {
      this.settingsReady = true;
      this.autoAuthUser();
      fireAuth.auth.onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken().then((token) => {
            this.token = token;
            this.settings.setValue('token', token);
          });
          this.userId = user.uid;
          this.isAuthenticated = true;
          this.userPhoto = user.photoURL;
          this.currentlyLoggedInUser = user;
          this.authStatusListener.next(true);
          this.settings.setValue('userId', this.userId);
          this.settings.setValue('userPhoto', this.userPhoto);
        } else {
          this.token = '';
          this.userId = '';
          this.isAuthenticated = false;
          this.userPhoto = '';
          this.currentlyLoggedInUser = null;
          this.authStatusListener.next(false);
          this.clearAuthData();
        }
      });
    });
  }

  get isAuth() {
    return this.isAuthenticated;
  }

  signUpEmail(email: string, password: string): Promise<boolean> {
    return this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((data) => {
        console.log(data);
        return data.user.getIdToken().then( (token) => {
          console.log(token);
          this.token = token;
          if (token) {
            this.currentlyLoggedInUser = data.user;
            this.isAuthenticated = true;
            this.userId = data.user.uid;
            this.userPhoto = data.user.photoURL;
            this.authStatusListener.next(true);
            this.saveAuthData(token, this.userPhoto, this.userId);
            return true;
          }
          return false;
        }).catch((error) => {
          return false;
        });
      }).catch((error) => {
        return false;
      });
  }

  signInEmail(email: string, password: string): Promise<boolean> {
    return this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then((data) => {
        return data.user.getIdToken().then( (token) => {
          console.log(data);
          console.log(token);
          this.token = token;
          if (token) {
            this.currentlyLoggedInUser = data.user;
            this.isAuthenticated = true;
            this.userId = data.user.uid;
            this.userPhoto = data.user.photoURL;
            this.authStatusListener.next(true);
            this.saveAuthData(token, this.userPhoto, this.userId);
            return true;
          }
          return false;
        }).catch((error) => {
          return false;
        });
      }).catch((error) => {
        return false;
      });

  }

  autoAuthUser(): {token:string, userPhoto:string, userId:string} {
    const authInformation = this.getAuthData();
    if (authInformation.userId === '') {
      return authInformation;
    }
    console.log('autoAuthUser(): Auth information exists')
    this.token = authInformation.token;
    this.userPhoto = authInformation.userPhoto;
    this.userId = authInformation.userId;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
    return authInformation;
  }


  signOut(): Promise<void> {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = '';
    this.userPhoto = '';
    this.currentlyLoggedInUser = null;
    this.authStatusListener.next(false);
    this.clearAuthData();
    return this.fireAuth.auth.signOut();
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  signInGoogle(): Promise<boolean> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.fireAuth.auth.signInWithRedirect(provider)
      .then(() => { return this.fireAuth.auth.getRedirectResult(); })
      .then((result) => {
        return result.user.getIdToken().then( (token) => {
          console.log('We made it in here!');
          console.log(result);
          console.log(token);
          this.token = token;
          if (token) {
            if (result.additionalUserInfo.isNewUser) {
              this.createUser();
            }
            this.currentlyLoggedInUser = result.user;
            this.isAuthenticated = true;
            this.userId = result.user.uid;
            this.userPhoto = result.user.photoURL;
            this.authStatusListener.next(true);
            this.saveAuthData(token, this.userPhoto, this.userId);
            return true;
          }
          return false;
        }).catch((error) => {
          return false;
        });
      }).catch((error) => {
        return false;
      });
  }

  getActiveUser() {
    return this.fireAuth.auth.currentUser;
  }

  createUser() {
    //return this.http.post(this.url + 'auth/user')
  }

  private saveAuthData(token: any, userPhoto: string, userId: string) {
    this.settings.setValue('token', token);
    this.settings.setValue('userPhoto', userPhoto);
    this.settings.setValue('userId', userId);
  }

  private getAuthData(): {token: string, userPhoto: string, userId: string} {
    const settings = this.settings.allSettings;
    const token = settings['token'];
    if (!token || token === '') {
      return {token: '', userPhoto: '', userId: ''};
    }
    return {
      token: token,
      userPhoto: settings['userPhoto'],
      userId: settings['userId']
    };
  }

  private clearAuthData() {
    this.settings.setValue('token', '');
    this.settings.setValue('userPhoto', '');
    this.settings.setValue('userId', '');
  }
}
