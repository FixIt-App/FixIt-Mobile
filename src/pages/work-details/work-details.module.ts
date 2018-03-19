import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkDetailsPage } from './work-details';
import { PipesModule } from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    WorkDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkDetailsPage),
    PipesModule
  ],
  exports: [
    WorkDetailsPage
  ]
})
export class WorkDetailsModule {}
