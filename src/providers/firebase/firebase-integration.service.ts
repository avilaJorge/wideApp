import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import { AngularFirestore, QuerySnapshot } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { StepEntry } from "../../models/step-log.model";
import { User } from "../../models/user.model";
import { take } from "rxjs/operators";
import { Observable } from "rxjs";
import { MeetupRouteDB } from "../../pages/routes/route.model";
import { DBMeetup } from "../../pages/events/meetup.model";
import { AngularFireAuth } from "angularfire2/auth";

@Injectable()
export class FirebaseService {

  constructor(
    public afs: AngularFirestore,
    public platform: Platform,
    public fireAuth: AngularFireAuth,
  ){}

  getAvatars(){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/avatars').valueChanges()
      .subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

  updatePerson(personKey, value){
    return new Promise<any>((resolve, reject) => {
      value.nameToSearch = value.name.toLowerCase();
      this.afs.collection('/people').doc(personKey).set(value)
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  deletePerson(personKey){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/people').doc(personKey).delete()
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  getPeople(){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/people').snapshotChanges()
      .subscribe(snapshots => {
        resolve(snapshots)
      });
    });
  }

  searchPeople(searchValue){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('people', ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges()
      .subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

  searchPeopleByAge(lower, upper){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('people', ref => ref.orderBy('age').startAt(lower).endAt(upper))
      .snapshotChanges()
      .subscribe(snapshots => {
        resolve (snapshots);
      });
    });
  }


  createPerson(value, avatar){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/people').add({
        name: value.name,
        nameToSearch: value.name.toLowerCase(),
        surname: value.surname,
        age: parseInt(value.age),
        avatar: avatar
      })
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImage(personId, imageURI){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('people').child(personId).child('image');
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          resolve(snapshot.downloadURL)
        }, err => {
          reject(err);
        });
      });
    })
  }

  createStepEntry(userId: string, stepEntry: StepEntry) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/users').doc(userId).collection('/step-log').doc(stepEntry.date).set(stepEntry, {merge: true})
        .then(() => {
          const data = Object.assign({uid: userId}, stepEntry);
          return this.afs.collection('step-entries').doc(userId + '-' + stepEntry.date).set(data, {merge: true})
        })
        .then(
        res => resolve(res),
          err => reject(err)
        );
    });
  }

  getStepLog(userId: string): Promise<QuerySnapshot<any>> {
    return this.afs.collection('/users').doc(userId).collection('/step-log').ref.orderBy('date', 'asc').get()
  }

  createUser(user: User) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/users').doc(user.googleUID).set(Object.assign({}, user))
        .then(
          (res) => resolve(res),
          (err) => reject(err));
    });
  }

  getUser(userId: string) {
    return this.afs.collection('/users').doc(userId).valueChanges().pipe(take(1))
      .toPromise()
      .then(data => data);
  }

  getMeetupIntegrationResult(userId: string): Observable<any> {
    return this.afs.collection('/users').doc(userId).snapshotChanges();
  }

  getFitbitIntegrationResult(userId: string): Observable<any> {
    return this.afs.collection('/users').doc(userId).snapshotChanges();
  }

  getMeetupList(): Promise<any> {
    return this.afs.collection('/meetups').valueChanges().pipe(take(1))
      .toPromise()
      .then(data => data);
  }

  storeRouteInMeetupDB(meetup_data: DBMeetup, route_data: MeetupRouteDB): Promise<any> {
    return this.afs.collection('/meetups').doc(meetup_data.id).set({route: route_data}, {merge: true});
  }

  getRouteInMeetupDB(meetup_id): Promise<DBMeetup> {
    return this.afs.collection('/meetups').doc(meetup_id).valueChanges().pipe(take(1))
      .toPromise()
      .then(data => data as DBMeetup);
  }

  getDBUserDataListener(uid: string): Observable<User> {
    return this.afs.collection('/users').doc<User>(uid).valueChanges();
  }

  sendSignInLinkToEmail(email:string): Promise<any> {
    let actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: 'https://wide-app.firebaseapp.com/finishSignUp?cartId=1234',
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: 'io.ionic.wide'
      },
      android: {
        packageName: 'io.ionic.wide',
        installApp: true,
        minimumVersion: '12'
      }
    };
    return this.fireAuth.auth.sendSignInLinkToEmail(email, actionCodeSettings);
  }

  signInWithEmailLink(email: string, deepLink: string): Promise<firebase.auth.UserCredential> {
    if (this.fireAuth.auth.isSignInWithEmailLink(deepLink)) {
      return this.fireAuth.auth.signInWithEmailLink(email, deepLink);
    } else {
      return new Promise((reject) => {
        console.log("The link is not a sign-in with email link");
        reject();
      });
    }
  }

}
