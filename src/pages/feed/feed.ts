import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { FeedModel } from './feed.model';
import { FeedService } from './feed.service';
import { FirebaseService } from "../../providers";

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  feed: FeedModel = new FeedModel();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public feedService: FeedService,
    public socialSharing: SocialSharing,
    public modalCtrl: ModalController,
    public firebaseService: FirebaseService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.feedService.getPosts().then((posts) => {
      this.feed.posts = posts;
    });
    console.log('ionViewDidLoad FeedPage');
  }

  getData(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.firebaseService.getPeople()
      .then(users => {
        // //we use 3 lists for the filters. Check the template docs to learn more.
        // this.items = users;
        // this.age_filtered_items = users;
        // this.name_filtered_items = users;
        loading.dismiss();
      })
  }

  sharePost(post) {
    //this code is to use the social sharing plugin
    // message, subject, file, url
    this.socialSharing.share(post.description, post.title, post.image, null)
      .then(() => {
        console.log('Success!');
      })
      .catch(() => {
        console.log('Error');
      });
  }

  openAddPostModal() {
    let modal = this.modalCtrl.create('AddPostPage');
    modal.onDidDismiss(data => {
      this.getData();
    });
    modal.present();
  }
}
