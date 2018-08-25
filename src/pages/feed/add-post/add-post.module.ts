import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPostPage } from './add-post';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  declarations: [
    AddPostPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPostPage),
    ComponentsModule,
  ]
})
export class AddPostPageModule {}
