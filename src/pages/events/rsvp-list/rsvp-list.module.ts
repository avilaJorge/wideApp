import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RsvpListPage } from './rsvp-list';

@NgModule({
  declarations: [
    RsvpListPage,
  ],
  imports: [
    IonicPageModule.forChild(RsvpListPage),
  ],
})
export class RsvpListPageModule {}
