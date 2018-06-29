import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeetupListPage } from './meetup-list';

@NgModule({
  declarations: [
    MeetupListPage,
  ],
  imports: [
    IonicPageModule.forChild(MeetupListPage),
  ],
})
export class MeetupListPageModule {}
