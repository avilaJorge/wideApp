import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from "angularfire2/firestore";

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FCM {

  constructor(
    public http: HttpClient,
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform,
    )
  {
    console.log('Hello FcmProvider Provider');
  }


  async getToken(userId: string): Promise<any> {
    let token;

    console.log(this.platform);

    // Is not cordova == web PWA
    if (!this.platform.is('cordova')) {
      return 'not_available';
    }

    if (this.platform.is('android')) {
      console.log('Android was detected in FCM');
      token = await this.firebaseNative.getToken();
    }

    if (this.platform.is('ios')) {
      console.log('ios was detected in FCM');
      token = await this.firebaseNative.getToken();
      const perm = await this.firebaseNative.grantPermission();
    }


    return this.saveTokenToFirestore(token, userId);
  }


  private saveTokenToFirestore(token: any, userId: string) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices');

    const docData = {
      token,
      userId: userId
    };

    return devicesRef.doc(token).set(docData);
  }

  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }
}
