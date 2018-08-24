import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraphPage } from './graph';
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    GraphPage,
  ],
  imports: [
    IonicPageModule.forChild(GraphPage),
    PipesModule
  ],
})
export class GraphPageModule {}
