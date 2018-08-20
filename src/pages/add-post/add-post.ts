import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  Platform,
  normalizeURL,
  ViewController
} from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

/**
 * Generated class for the AddPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {

  post_form: FormGroup;

  selected_image: any;

  categories_checkbox_open: boolean;
  categories_checkbox_result;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public cropService: Crop,
    public imagePicker: ImagePicker,
    public platform: Platform,
    public viewCtrl: ViewController) {

    this.post_form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      servings: new FormControl(2, counterRangeValidator(10, 1)),
      time: new FormControl('01:30', Validators.required),
      temperature: new FormControl(180)
    });
  }

  createPost(){
    console.log(this.post_form.value);
  }

  chooseCategory(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Category');

    alert.addInput({
      type: 'checkbox',
      label: 'Health Tip',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Testimonial',
      value: 'value2'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Encouragement',
      value: 'value3'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Service Requests',
      value: 'value4'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Announcement',
      value: 'value5'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        console.log('Checkbox data:', data);
        this.categories_checkbox_open = false;
        this.categories_checkbox_result = data;
      }
    });
    alert.present().then(() => {
      this.categories_checkbox_open = true;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openImagePicker(){
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){
          this.imagePicker.getPictures({ maximumImagesCount: 1 }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.cropService.crop(results[i], {quality: 75}).then(
                  newImage => {
                    let image  = normalizeURL(newImage);
                    this.selected_image = image;
                  },
                  error => console.error("Error cropping image", error)
                );
              }
            }, (err) => console.log(err)
          );
        }
      }
    )
  }

}
