import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeetupPage } from './meetup';

@NgModule({
  declarations: [
    MeetupPage,
  ],
  imports: [
    IonicPageModule.forChild(MeetupPage),
  ],
})
export class MeetupPageModule {}
