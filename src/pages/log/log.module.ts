import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogPage } from './log';
import { RoundProgressComponent } from "angular-svg-round-progressbar";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    LogPage,
    RoundProgressComponent
  ],
  imports: [
    IonicPageModule.forChild(LogPage),
    ComponentsModule,
  ],
})
export class LogPageModule {}
