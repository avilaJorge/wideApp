import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GlancePage } from './glance';

@NgModule({
  declarations: [
    GlancePage,
  ],
  imports: [
    IonicPageModule.forChild(GlancePage),
  ],
})
export class GlancePageModule {}
