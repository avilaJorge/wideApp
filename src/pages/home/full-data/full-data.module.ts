import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FullDataPage } from './full-data';

@NgModule({
  declarations: [
    FullDataPage,
  ],
  imports: [
    IonicPageModule.forChild(FullDataPage),
  ],
})
export class FullDataPageModule {}
