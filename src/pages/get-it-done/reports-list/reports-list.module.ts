import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsListPage } from './reports-list';

@NgModule({
  declarations: [
    ReportsListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportsListPage),
  ],
})
export class ReportsListPageModule {}
