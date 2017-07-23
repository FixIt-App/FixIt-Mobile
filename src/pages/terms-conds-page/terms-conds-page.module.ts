import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsCondsPage } from './terms-conds-page';

@NgModule({
  declarations: [
    TermsCondsPage,
  ],
  imports: [
    IonicPageModule.forChild(TermsCondsPage),
  ],
  exports: [
    TermsCondsPage
  ]
})
export class TermsCondsPageModule {}
