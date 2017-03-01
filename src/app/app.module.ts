import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { FindWorkPage } from '../pages/findwork/findwork'
import { Login } from '../pages/login/login'
import { SchedulePage } from '../pages/schedule/schedule'
import { WherePage  } from '../pages/where/where'
import { WhatPage  } from '../pages/what/what'


import { WorkTypeService } from '../services/wortktype.service'
import { AuthService } from '../services/auth.service'

@NgModule({
  declarations: [
    MyApp,
    FindWorkPage,
    Login,
    SchedulePage,
    WherePage,
    WhatPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FindWorkPage,
    Login,
    SchedulePage,
    WherePage,
    WhatPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WorkTypeService,
    AuthService,
  ]
})
export class AppModule {}
