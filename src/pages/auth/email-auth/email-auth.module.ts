import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailAuthPage } from './email-auth';

@NgModule({
  declarations: [
    EmailAuthPage,
  ],
  imports: [
    IonicPageModule.forChild(EmailAuthPage),
  ],
})
export class EmailAuthPageModule {}
