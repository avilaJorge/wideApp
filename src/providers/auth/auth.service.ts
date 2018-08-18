import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from "angularfire2/auth";
import { Observable, Subject } from "rxjs";
import * as firebase from "firebase";

import { User } from "../../models/user.model";
import { Settings } from "..";
import { AlertController } from "ionic-angular";
import { backendURL } from "../../environment/environment";

@Injectable()
export class AuthService {

  url: string = backendURL;
  private token: string;
  private isAuthenticated = false;
  private currentlyLoggedInUser: User = null;
  private authStatusListener = new Subject<boolean>();

  constructor(private fireAuth: AngularFireAuth,
              private http: HttpClient,
              private alertCtrl: AlertController,
              private settings: Settings) {

    fireAuth.auth.onAuthStateChanged((user) => {
     if (user) {
        user.getIdToken().then((token) => {
          this.token = token;
          this.settings.setValue('token', token);
        });
        this.dbGetUser(user.uid)
          .subscribe((dbUser) => {
            console.log("OnAuthStateChanged called!");
            console.log('User data was retrieved from Firebase');
            this.currentlyLoggedInUser = dbUser;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.settings.setValue('user', dbUser);
          }, (error) => {
            console.log(error);
            this.authStatusListener.next(false);
          });
      } else {
        console.log('onAuthStateChanged detected the logout');
        this.token = '';
        this.isAuthenticated = false;
        this.currentlyLoggedInUser = null;
        this.authStatusListener.next(false);
        this.clearAuthData();
      }
    });
  }

  getToken() {
    return this.token;
  }

  get isAuth() {
    return this.isAuthenticated;
  }

  signUpEmail(email: string, password: string, user: User) {
    this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((data) => {
        console.log(data);
        data.user.getIdToken().then( (token) => {
          console.log(token);
          this.token = token;
          if (token) {
            this.isAuthenticated = true;
            user.googleUID = data.user.uid;
            this.dbCreateUser(user);
            this.currentlyLoggedInUser = user;
            this.authStatusListener.next(true);
            this.saveAuthData(token, user);
          }
        }).catch((error) => {

        });
      }).catch((error) => {

      });
  }

  signInEmail(email: string, password: string) {
    this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then((data) => {
        data.user.getIdToken().then( (token) => {
          this.token = token;
          if (token) {
            this.dbGetUser(data.user.uid)
              .subscribe((dbUser) => {
                console.log(dbUser);
                console.log('User data was retrieved from Firebase');
                this.currentlyLoggedInUser = dbUser;
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.saveAuthData(token, dbUser);
              }, (error) => {
                console.log(error);
                this.authStatusListener.next(false);
              });
          } else {
            this.authStatusListener.next(false);
            console.log("An error occured while getting the user auth token!");
          }
        }).catch((error) => {
          this.authStatusListener.next(false);
          console.log("An error occured while getting the user auth token!");
          console.log("Error: " + error);
        });
      }).catch((error) => {
        this.authStatusListener.next(false);
        console.log("An error occured while signing in the user!");
        console.log("Error: " + error);
      });

  }

  autoAuthUser(localData): boolean {
    if (!localData.token || (localData.token == '' )) {
      return false;
    }
    console.log('autoAuthUser(): Auth information exists');
    this.token = localData.token;
    this.isAuthenticated = true;
    this.currentlyLoggedInUser = localData.user;
    this.authStatusListener.next(true);
    return true;
  }


  signOut(): Promise<void> {
    this.token = null;
    this.isAuthenticated = false;
    this.currentlyLoggedInUser = null;
    this.authStatusListener.next(false);
    this.clearAuthData();
    return this.fireAuth.auth.signOut();
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  signInGoogle(group: string) {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.fireAuth.auth.signInWithRedirect(provider)
      .then(() => { return this.fireAuth.auth.getRedirectResult(); })
      .then((result) => {
        return result.user.getIdToken().then( (token) => {
          console.log('Sign in with Google was successful!');
          this.token = token;
          if (token) {
            this.isAuthenticated = true;
            const userData = new User({
              googleUID: result.user.uid,
              userName: result.user.displayName,
              photoURL: result.user.photoURL,
              email: result.user.email,
              // TODO: Need to figure out if this is necessary.
              authExpires: '',
              groupName: group
            });
            this.dbCreateUser(userData);
            this.currentlyLoggedInUser = userData;
            this.authStatusListener.next(true);
            this.saveAuthData(token, userData);
          } else {
            this.authStatusListener.next(false);
            console.log("An error occured while getting the user auth token!");
          }
        }).catch((error) => {
          this.authStatusListener.next(false);
          console.log("An error occured while getting the user auth token!");
          console.log("Error: " + error);
        });
      }).catch((error) => {
        this.authStatusListener.next(false);
        console.log("An error occured while signing in the user!");
        console.log("Error: " + error);
      });
  }

  getActiveUser(): User {
    return this.currentlyLoggedInUser;
  }

  dbCreateUser(user: User) {
    const httpOptions = { headers: this.getHttpHeader() };
    this.http.post(this.url + 'auth/user', user, httpOptions)
      .subscribe(() => {
        console.log('Success!  User data was sent to Firebase Realtime Database');
      }, (error) => {
        const alert = this.alertCtrl.create({
          title: "An error occured when trying to access the database",
          message: error.message,
          buttons: [{text: 'Ok'}]
        });
        alert.present();
      });
  }

  dbGetUser(userId: string): Observable<any>{
    const httpOptions = { headers: this.getHttpHeader() };
    return this.http.get(this.url + 'auth/user/' + userId, httpOptions);
  }

  getHttpHeader(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
      'Content-Type': 'application/json'
    });
  }

  private saveAuthData(token: any, user: User) {
    this.settings.setValue('token', token);
    this.settings.setValue('user', JSON.stringify(user));
  }

  private getAuthData(): {token: string, user: User} {
    const settings = this.settings.allSettings;
    const token = settings['token'];
    if (!token || token === '') {
      return {token: '', user: null};
    }
    console.log(settings['user']);
    return {
      token: token,
      user: settings['user']
    };
  }

  private clearAuthData() {
    this.settings.setValue('token', '');
    this.settings.setValue('user', '');
  }

}
