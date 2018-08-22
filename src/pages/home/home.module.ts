import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { RoundProgressComponent } from "angular-svg-round-progressbar";

@NgModule({
  declarations: [
    HomePage,
    RoundProgressComponent
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
