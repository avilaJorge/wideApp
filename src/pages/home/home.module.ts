import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { RoundProgressComponent } from "angular-svg-round-progressbar";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    HomePage,
    RoundProgressComponent
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    ComponentsModule,
  ],
})
export class HomePageModule {}
