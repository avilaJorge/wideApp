import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeetupMainPage } from './meetup-main';

@NgModule({
  declarations: [
    MeetupMainPage
  ],
  imports: [
    IonicPageModule.forChild(MeetupMainPage),
  ],
})
export class MeetupMainPageModule {}
