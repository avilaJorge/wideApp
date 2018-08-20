import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedPage } from './feed';
import { PreloadImage } from "../../components/preload-image/preload-image";

@NgModule({
  declarations: [
    FeedPage,
    PreloadImage
  ],
  imports: [
    IonicPageModule.forChild(FeedPage),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FeedPageModule {}
