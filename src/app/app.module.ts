import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { FindWorkPage } from '../pages/findwork/findwork'
import { Login } from '../pages/login/login'
import { SchedulePage } from '../pages/schedule/schedule'
import { WherePage  } from '../pages/where/where'
import { WhatPage  } from '../pages/what/what'
import { CreateUserPage } from '../pages/user/create'


import { WorkTypeService } from '../providers/wortktype-service'
import { AuthService } from '../providers/auth-service'
import { AddressService } from '../providers/address-service'
import { UserDataService } from '../providers/user-data-service'

@NgModule({
  declarations: [
    MyApp,
    FindWorkPage,
    Login,
    SchedulePage,
    WherePage,
    WhatPage,
    CreateUserPage
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
    WhatPage,
    CreateUserPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WorkTypeService,
    AuthService,
    AddressService,
    UserDataService
  ]
})
export class AppModule {}
