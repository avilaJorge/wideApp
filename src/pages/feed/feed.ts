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
  cards = [
    {
      avatarImageUrl: 'assets/img/avatar/marty-avatar.png',
      postImageUrl: 'assets/img/card/advance-card-bttf.png',
      name: 'Marty Mcfly',
      postText: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
      date: 'November 5, 1955',
      likes: 12,
      comments: 4,
      timestamp: '11h ago'
    },
    {
      avatarImageUrl: 'assets/img/avatar/sarah-avatar.jpg',
      postImageUrl: 'assets/img/card/advance-card-tmntr.jpg',
      name: 'Sarah Connor',
      postText: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.',
      date: 'May 12, 1984',
      likes: 30,
      comments: 64,
      timestamp: '30yr ago'
    },
    {
      avatarImageUrl: 'assets/img/avatar/ian-avatar.png',
      postImageUrl: 'assets/img/card/advance-card-jp.jpg',
      name: 'Dr. Ian Malcolm',
      postText: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.',
      date: 'June 28, 1990',
      likes: 46,
      comments: 66,
      timestamp: '2d ago'
    },
  ];

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

  imageTapped(card) {
    alert(card.name + ' image was tapped.');
  }

  like(card) {
    alert(card.name + ' was liked.');
  }

  comment(card) {
    alert('Commenting to ' + card.name);
  }

  avatarTapped(card) {
    alert(card.name + ' avatar was tapped.');
  }

  openAddPostModal() {
    let modal = this.modalCtrl.create('AddPostPage');
    // modal.onDidDismiss(data => {
    //   this.getData();
    // });
    modal.present();
  }
}
