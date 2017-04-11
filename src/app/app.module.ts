import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { FindWorkPage } from '../pages/findwork/findwork'
import { LoginPage } from '../pages/login/login'
import { SchedulePage } from '../pages/schedule/schedule'
import { WherePage  } from '../pages/where/where'
import { WhatPage  } from '../pages/what/what'

import { CreateUserPage } from '../pages/create-user/create-user'
import { NewAddressPage } from '../pages/new-address/new-address'
import { NextServicesPage } from '../pages/next-services/next-services'
import { CountryCodeSelectorPage } from '../pages/country-code-selector/country-code-selector'

import { WorkTypeService } from '../providers/wortktype-service'
import { AuthService } from '../providers/auth-service'
import { AddressService } from '../providers/address-service'
import { UserDataService } from '../providers/user-data-service'
import { WorkService } from '../providers/work-service'

@NgModule({
  declarations: [
    MyApp,
    FindWorkPage,
    LoginPage,
    SchedulePage,
    WherePage,
    WhatPage,
    CreateUserPage,
    NewAddressPage,
    NextServicesPage,
    CountryCodeSelectorPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FindWorkPage,
    LoginPage,
    SchedulePage,
    WherePage,
    WhatPage,
    CreateUserPage,
    NewAddressPage,
    NextServicesPage,
    CountryCodeSelectorPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WorkTypeService,
    AuthService,
    AddressService,
    UserDataService,
    WorkService
  ]
})
export class AppModule {}
