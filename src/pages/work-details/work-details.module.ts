import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkDetailsPage } from './work-details';

@NgModule({
  declarations: [
    WorkDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkDetailsPage),
  ],
  exports: [
    WorkDetailsPage
  ]
})
export class WorkDetailsModule {}
