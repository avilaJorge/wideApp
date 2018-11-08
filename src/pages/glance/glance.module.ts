import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoundProgressComponent } from "angular-svg-round-progressbar";
import { GlancePage } from './glance';

@NgModule({
  declarations: [
    GlancePage,
    RoundProgressComponent
  ],
  imports: [
    IonicPageModule.forChild(GlancePage),
  ],
})
export class GlancePageModule {}
