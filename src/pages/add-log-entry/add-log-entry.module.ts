import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLogEntryPage } from './add-log-entry';

@NgModule({
  declarations: [
    AddLogEntryPage
  ],
  imports: [
    IonicPageModule.forChild(AddLogEntryPage),
  ]
})
export class AddLogEntryPageModule {}
