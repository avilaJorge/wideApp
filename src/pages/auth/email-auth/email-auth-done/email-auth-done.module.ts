import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailAuthDonePage } from './email-auth-done';

@NgModule({
  declarations: [
    EmailAuthDonePage,
  ],
  imports: [
    IonicPageModule.forChild(EmailAuthDonePage),
  ],
})
export class EmailAuthDonePageModule {}
