import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MapsAPILoader } from "@agm/core";
import { } from 'googlemaps';

@IonicPage()
@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})
export class CreateEventPage {

  private eventForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {

    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      date: [(new Date(Date.now())).toLocaleString('en-US', {weekday: "short", year: "numeric", month: "short", day: "numeric"}), Validators.required],
      time: [(new Date(Date.now())).toLocaleString('en-US', {hour: "numeric", minute: "2-digit"}), Validators.required],
      duration: ['', Validators.required],
      where: ['', Validators.required],
      quantity: ['', Validators.required],
      details: [''],
      // hosting: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventPage');

    // Load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let elem = <HTMLInputElement>document.getElementsByClassName('item-where')[0];
      let autocomplete = new google.maps.places.Autocomplete(elem);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // Verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude
          let lat = place.geometry.location.lat();
          let long = place.geometry.location.lng();
          this.eventForm.controls['where'].setValue(lat + ',' + long);
          console.log('Location found is ' + lat + ',' + long);
        })
      });
    });
  }

}
