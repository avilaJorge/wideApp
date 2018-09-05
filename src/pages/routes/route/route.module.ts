import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutePage } from './route';
import { AgmCoreModule } from "@agm/core";

@NgModule({
  declarations: [
    RoutePage,
  ],
  imports: [
    IonicPageModule.forChild(RoutePage),
    AgmCoreModule
  ],
})
export class RoutePageModule {}
