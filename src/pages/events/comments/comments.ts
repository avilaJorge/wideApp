import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EventService } from "../events.service";

/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  @ViewChild('input') inputField;

  public commentForm: FormGroup;
  private replyToComment: number;
  private eventId: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private eventService: EventService) {

    this.commentForm = formBuilder.group( {
      comment: new FormControl('', Validators.required)
    });

    this.replyToComment = this.navParams.get('commentId');
    this.eventId = this.navParams.get('eventId');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentsPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter CommentsPage');
    setTimeout(() => {
      this.inputField.setFocus();
    }, 600);
  }

  send() {
    console.log(this.commentForm.value);
    const comment = this.commentForm.value.comment;
    let loading = this.loadingCtrl.create({
      spinner: 'dots'
    });
    loading.present();
    this.eventService.postEventComment(comment, this.replyToComment, this.eventId)
      .then((data) => {
        console.log(data);
        loading.dismiss();
        this.viewCtrl.dismiss({data: data.body});
      }).catch((err) => {
        loading.dismiss();
        this.viewCtrl.dismiss();
        console.log(err);
    });
  }

  dismiss() {
    console.log('dismiss called in comments page');
    this.viewCtrl.dismiss();
  }





}
