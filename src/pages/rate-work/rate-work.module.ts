import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RateWorkPage } from './rate-work';
import { RatingComponent } from "../../components/rating/rating";

@NgModule({
  declarations: [
    RateWorkPage,
    RatingComponent
  ],
  imports: [
    IonicPageModule.forChild(RateWorkPage),
  ],
})
export class RateWorkerPageModule {}
