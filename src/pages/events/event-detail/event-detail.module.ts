import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { EventDetailPage } from './event-detail';
import { AgmCoreModule } from "@agm/core";
import { PipesModule } from "../../../pipes/pipes.module";
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  declarations: [
    EventDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(EventDetailPage),
    AgmCoreModule,
    PipesModule,
    ComponentsModule
  ],
})
export class EventDetailPageModule {}
