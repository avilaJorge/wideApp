import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedPage } from './feed';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    FeedPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FeedPageModule {}
