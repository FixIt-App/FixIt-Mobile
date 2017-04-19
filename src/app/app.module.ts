import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { DatePicker } from '@ionic-native/date-picker';
import { Geolocation } from '@ionic-native/geolocation';

import { FindWorkPage } from '../pages/findwork/findwork'
import { LoginPage } from '../pages/login/login'
import { SchedulePage } from '../pages/schedule/schedule'
import { WherePage  } from '../pages/where/where'
import { CreateUserPage } from '../pages/create-user/create-user'
import { CountryCodeSelectorPage } from '../pages/country-code-selector/country-code-selector'

import { WorkTypeService } from '../providers/wortktype-service'
import { AuthService } from '../providers/auth-service'
import { AddressService } from '../providers/address-service'
import { UserDataService } from '../providers/user-data-service'
import { WorkService } from '../providers/work-service'
import { ConfirmationService } from '../providers/confirmation-service';

@NgModule({
  declarations: [
    MyApp,
    FindWorkPage,
    LoginPage,
    SchedulePage,
    WherePage,
    CreateUserPage,
    CountryCodeSelectorPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FindWorkPage,
    LoginPage,
    SchedulePage,
    WherePage,
    CreateUserPage,
    CountryCodeSelectorPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SplashScreen,
    Camera,
    DatePicker,
    Geolocation,
    WorkTypeService,
    AuthService,
    AddressService,
    UserDataService,
    WorkService,
    ConfirmationService
  ]
})
export class AppModule {}
