import { NgModule } from '@angular/core';
import { ServiceHistoricalPage } from './service-historical';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module'

@NgModule({
  declarations: [ 
    ServiceHistoricalPage,
  ],
  imports: [ 
    IonicPageModule.forChild(ServiceHistoricalPage),
    PipesModule
  ],
})
export class ServiceHistoricalModule { }
