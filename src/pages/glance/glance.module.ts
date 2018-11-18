import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoundProgressComponent } from "angular-svg-round-progressbar";
import { GlancePage } from './glance';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    GlancePage,
    RoundProgressComponent
  ],
  imports: [
    IonicPageModule.forChild(GlancePage),
    PipesModule
  ],
})
export class GlancePageModule {}
