import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { StepEntry } from "../../models/step-log.model";
import { User } from "../../models/user.model";
import { take } from "rxjs/operators";

@Injectable()
export class FirebaseService {

  constructor(
    public afs: AngularFirestore,
    public platform: Platform
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
      this.afs.collection('/users').doc(userId).collection('/step-log').add({
        stepEntry
      })
      .then(
        res => resolve(res),
          err => reject(err)
      );
    });
  }

  getStepLog(userId: string) {
    return this.afs.collection('/users').doc(userId).collection('/step-log').valueChanges().pipe(take(1));
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
    return this.afs.collection('/users').doc(userId).valueChanges().pipe(take(1));
  }



}
