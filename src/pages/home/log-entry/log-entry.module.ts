import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogEntryPage } from './log-entry';

@NgModule({
  declarations: [
    LogEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(LogEntryPage),
  ],
})
export class LogEntryPageModule {}
