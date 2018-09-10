import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RouteOptionsPage } from './route-options';

@NgModule({
  declarations: [
    RouteOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(RouteOptionsPage),
  ],
})
export class RouteOptionsPageModule {}
