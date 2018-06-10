import { Work } from './../models/work';
import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events, AlertController, LoadingController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { LoginPage } from '../pages/login/login';
import { FindWorkPage } from '../pages/findwork/findwork';
import { CreateUserPage } from './../pages/create-user/create-user';

import { Customer } from '../models/user';
import { DeviceService } from '../providers/device-service';
import { UserDataService } from '../providers/user-data-service';
import { WorkTypeService } from '../providers/wortktype-service'

const unflatten = require('unflatten')

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any, icon: string}>;
  customer: Customer;
  pageAfterLogin: string = "FindWorksPage";

  constructor(public platform: Platform,
              public menu: MenuController,
              public events: Events,
              public splashScreen: SplashScreen,
              private alertCtrl: AlertController,
              private fcm: FCM,
              private deviceService: DeviceService,
              private userDataService: UserDataService,
              private workTypeService: WorkTypeService,
              public loadingCtrl: LoadingController)
  {
    // menu navigation pages
    this.pages = [
      { title: 'Pedir trabajo', component: FindWorkPage, icon: 'apps' },
      { title: 'Agenda', component: 'ServiceHistoricalPage', icon: 'calendar' },
      { title: 'Configuraciones', component: 'SettingsPage', icon: 'settings' },
      { title: 'Cerrar sesión', component: null, icon: 'power' }
    ];
    this.initializeApp();
    this.listenToCustomerLogged();
    this.listenToCustomerUpdated();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.initPushNotification();
      //StatusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initPushNotification() {

    this.fcm.getToken().then(token => {
      this.saveTokenLocally(token);
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      //TODO (alfredo): revisar si toca update en el servidor
      this.saveTokenLocally(token);
    });

    this.fcm.onNotification().subscribe(data => {
      data = unflatten(data);
      console.log(data);

      let work: Work;
      if(data.work) work = new Work(data.work);
      if(data.wasTapped) {
        console.info("Received in background");
        console.log("notification type");
          console.log(data.type);
          if(data.type == 'WORKER ASSIGNED') {
            this.pageAfterLogin = 'WorkDetailsPage';
            this.nav.setRoot('WorkDetailsPage', { work: work });
          } else if(data.type == 'WORK FINISHED') {
            this.pageAfterLogin = 'RateWorkPage';
            this.nav.setRoot('RateWorkPage', { work: work });
          }
          console.log('no foreground');
      } else {
        console.info("Received in foreground");
        let confirmAlert = this.alertCtrl.create({
          title: data.title,
          message: data.message,
          buttons: [
            { text: 'Cancelar', role: 'cancel' }, 
            {
              text: 'Ver',
              handler: () => {
                if(data.type == 'WORKER ASSIGNED') {
                  this.nav.setRoot('WorkDetailsPage', { work: work });
                } else if(data.type == 'WORK FINISHED') {
                  this.nav.setRoot('RateWorkPage', { work: work });
                }
              }
            }
          ]
        });
        confirmAlert.present();
      };
    });
  }
  
  saveTokenLocally(token: string) {
    localStorage.setItem('deviceToke', token);
      let platform_type = 'UNKNOWN';
      if(this.platform.is('android'))  platform_type = 'ANDROID';
      else if(this.platform.is('ios')) platform_type = 'IOS';
      localStorage.setItem('platform', platform_type);
  }
  openPage(page) {
    if(page.title == 'Cerrar sesión') {
      let loader = this.loadingCtrl.create({spinner: 'crescent'});
      loader.present();
      this.deviceService.removeDeviceToken().subscribe(
        (data) => {
          console.log(data);
          localStorage.removeItem('token');
          this.nav.setRoot(LoginPage);
          loader.dismiss();
        },
        (error) => {
          console.log(error);
          localStorage.removeItem('token');
          this.nav.setRoot(LoginPage);
          loader.dismiss();
        }
      );
    } else if(page.title == 'Pedir trabajo') {
      if(this.nav.getActive().name != 'FindWorkPage') {
        this.workTypeService.getWorkTypes().subscribe(
          categories => {
            this.nav.setRoot(FindWorkPage, { categories: categories.reverse() });
          },
          error => {
            console.log(error);
          });
      }
    } else {
      this.nav.push(page.component);
    }
  }

  /**
   * saves the logged customer in userDataService
   * and sets the root page after log in
   */
  listenToCustomerLogged() {
    this.events.subscribe('customer:logged', 
      (customer) => {
        this.customer = customer;
        this.userDataService.setCustomer(this.customer);
        
        // register device token in server
        this.deviceService.registerDevice().subscribe(
          (data) => console.log('register device token status: '+ data.status),
          (err) => console.error('registre device error', err)
        );

        // decide what page to set as root after login
        if (this.pageAfterLogin == 'FindWorksPage') {
          if ( customer.confirmations.some(conf => conf.state == true) ) {
            this.workTypeService.getWorkTypes().subscribe(
              categories => {
                if (this.pageAfterLogin == 'FindWorksPage') {
                  this.nav.setRoot(FindWorkPage, { categories: categories.reverse() });
                }
              },
              error => {
                //TODO a-santamaria: manage this error
                console.log(error);
              });
            } else {
              console.log('ir a confirmar sms or mail');
              this.nav.setRoot(CreateUserPage, {
                isConfirmingSMS: true,
                customer: customer
              })
              
            }
        } else {
          console.log('allready set to work details');
        }
      });

      this.events.subscribe('customer:loggedFirstTime', 
      (customer) => {
        this.customer = customer;
        this.userDataService.setCustomer(this.customer);
        
        // register device token in server
        console.log('going to register device');
        this.deviceService.registerDevice().subscribe(
          (data) => console.log('register device token status: '+ data.status),
          (err) => console.error('registre device error', err)
        );

        // show payment page first time
        this.nav.setRoot('PaymentMethodPage', { firstTime: true });
      });
  }

  listenToCustomerUpdated() {
    this.events.subscribe('customer:updated', 
      (customer) => {
        console.log('entre a updatecustomer');
        console.log(this.customer);
        this.customer = customer;
        this.userDataService.setCustomer(customer);
      });
  }

  gotToUserSettings() {
    this.nav.push('SettingsUserPage');
  }
}

