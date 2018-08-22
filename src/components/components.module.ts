import { NgModule } from '@angular/core';
import { PreloadImage } from "./preload-image/preload-image";
import { ProcessImage} from './process-image/process-image';

@NgModule({
  declarations: [
    PreloadImage,
    ProcessImage,
  ],
  imports: [

  ],
  exports: [
    PreloadImage,
    ProcessImage,
  ]
})
export class ComponentsModule {}
