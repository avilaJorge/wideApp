import { NgModule } from '@angular/core';
import { ReversePipe } from './reverse/reverse';
import { CapsPipe } from './caps/caps';
@NgModule({
	declarations: [
	  ReversePipe,
    CapsPipe
  ],
	imports: [],
	exports: [
	  ReversePipe,
    CapsPipe
  ]
})
export class PipesModule {}
