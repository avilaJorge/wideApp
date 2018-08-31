import { NgModule } from '@angular/core';
import { PreloadImage } from "./preload-image/preload-image";
import { CommonModule } from "@angular/common";
import { IonicModule } from "ionic-angular";
import { ParallaxHeaderDirective } from "./parallax-header/parallax-header";

@NgModule({
  declarations: [
    PreloadImage,
    ParallaxHeaderDirective
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PreloadImage,
    ParallaxHeaderDirective
  ]
})
export class ComponentsModule {}
