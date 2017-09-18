import { Work } from './../models/work';
import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events, AlertController, LoadingController, App } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushOptions, PushObject, NotificationEventResponse } from '@ionic-native/push';

import { LoginPage } from '../pages/login/login';
import { FindWorkPage } from '../pages/findwork/findwork';
import { CreateUserPage } from './../pages/create-user/create-user';

import { Customer } from '../models/user';
import { DeviceService } from '../providers/device-service';
import { UserDataService } from '../providers/user-data-service';
import { WorkTypeService } from '../providers/wortktype-service'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any, icon: string}>;
  customer: Customer;
  pageAfterLogin: string = "FindWorksPage";

  constructor(public platform: Platform,
              private app: App,
              public menu: MenuController,
              public events: Events,
              public splashScreen: SplashScreen,
              private alertCtrl: AlertController,
              private push: Push,
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
    // to initialize push notifications
    const options: PushOptions = {
      android: { senderID: '615968990679' },
      ios: { alert: 'true', badge: true, sound: 'false' },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    // when a notification arrives
    pushObject.on('notification').subscribe(
      (notification: NotificationEventResponse) => {
        let work: Work;
        if(notification.additionalData.work) work = new Work(notification.additionalData.work);
        if(notification.additionalData.foreground) {
          let confirmAlert = this.alertCtrl.create({
            title: notification.title,
            message: notification.message,
            buttons: [
              { text: 'Cancelar', role: 'cancel' }, 
              {
                text: 'Ver',
                handler: () => {
                  if(notification.additionalData.type == 'WORKER ASSIGNED') {
                    this.nav.setRoot('WorkDetailsPage', { work: work });
                  } else if(notification.additionalData.type == 'WORK FINISHED') {
                    this.nav.setRoot('RateWorkPage', { work: work });
                  }
                }
              }
            ]
          });
          confirmAlert.present();
        } else {
          console.log("notification type");
          console.log(notification.additionalData.type);
          if(notification.additionalData.type == 'WORKER ASSIGNED') {
            this.pageAfterLogin = 'WorkDetailsPage';
            this.nav.setRoot('WorkDetailsPage', { work: work });
          } else if(notification.additionalData.type == 'WORK FINISHED') {
            this.pageAfterLogin = 'RateWorkPage';
            this.nav.setRoot('RateWorkPage', { work: work });
          }
          console.log('no foreground');
        }
      });

    this.push.hasPermission().then(
      (res: any) => {
        if (res.isEnabled) console.log('We have permission to send push notifications');
        else console.log('We do not have permission to send push notifications');
      });
    
    pushObject.on('registration').subscribe(
      (registration: any) => {
        localStorage.setItem('deviceToke', registration.registrationId);
        let platform_type = 'UNKNOWN';
        if(this.platform.is('android'))  platform_type = 'ANDROID';
        else if(this.platform.is('ios')) platform_type = 'IOS';
        localStorage.setItem('platform', platform_type);
      });

    pushObject.on('error').subscribe( error => console.error('Error with Push plugin', error) );
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
        console.log('going to register device');
        this.deviceService.registerDevice().subscribe(
          (data) => console.log('register device token status: '+ data.status),
          (err) => console.error('registre device error', err)
        );

        // decide what page to set as root after login
        if (this.pageAfterLogin == 'FindWorksPage') {
          if ( customer.confirmations.some(conf => conf.state == true) ) {
            this.workTypeService.getWorkTypes().subscribe(
              categories => {
                console.log('voy a preguntar adentro');
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

