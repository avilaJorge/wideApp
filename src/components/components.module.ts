import { NgModule } from '@angular/core';
import { PreloadImage } from "./preload-image/preload-image";
import { CommonModule } from "@angular/common";
import { IonicModule } from "ionic-angular";

@NgModule({
  declarations: [
    PreloadImage,
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PreloadImage,
  ]
})
export class ComponentsModule {}
