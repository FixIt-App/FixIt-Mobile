import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { DatePicker } from '@ionic-native/date-picker';
import { Geolocation } from '@ionic-native/geolocation';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Push } from '@ionic-native/push';

import { FindWorkPage } from '../pages/findwork/findwork';
import { LoginPage } from '../pages/login/login';
import { SchedulePage } from '../pages/schedule/schedule';
import { CreateUserPage } from '../pages/create-user/create-user';

import { PipesModule } from '../pipes/pipes.module';

import { WorkTypeService } from '../providers/wortktype-service';
import { AuthService } from '../providers/auth-service';
import { AddressService } from '../providers/address-service';
import { UserDataService } from '../providers/user-data-service';
import { WorkService } from '../providers/work-service';
import { ConfirmationService } from '../providers/confirmation-service';
import { DeviceService } from '../providers/device-service';
import { PaymentService } from '../providers/payment-service';

@NgModule({
  declarations: [
    MyApp,
    FindWorkPage,
    LoginPage,
    SchedulePage,
    CreateUserPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FindWorkPage,
    LoginPage,
    SchedulePage,
    CreateUserPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SplashScreen,
    Camera,
    DatePicker,
    Geolocation,
    BarcodeScanner,
    Push,
    WorkTypeService,
    AuthService,
    AddressService,
    UserDataService,
    WorkService,
    ConfirmationService,
    DeviceService,
    PaymentService
  ]
})
export class AppModule {}
