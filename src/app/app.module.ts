import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { FindWorkPage } from '../pages/findwork/findwork'
import { HomePage } from '../pages/home/home'
import { Login } from '../pages/login/login'
import { WorkTypeService } from '../services/wortktype.service'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FindWorkPage,
    Login
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FindWorkPage,
    Login
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WorkTypeService
  ]
})
export class AppModule {}
