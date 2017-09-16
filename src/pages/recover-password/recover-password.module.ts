import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecoverPasswordPage } from './recover-password';

@NgModule({
  declarations: [
    RecoverPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(RecoverPasswordPage),
  ],
  exports: [
    RecoverPasswordPage
  ]
})
export class RecoverPasswordPageModule {}
