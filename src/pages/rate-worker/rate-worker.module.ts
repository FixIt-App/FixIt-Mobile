import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RateWorkerPage } from './rate-worker';
import { RatingComponent } from "../../components/rating/rating";

@NgModule({
  declarations: [
    RateWorkerPage,
    RatingComponent
  ],
  imports: [
    IonicPageModule.forChild(RateWorkerPage),
  ],
})
export class RateWorkerPageModule {}
