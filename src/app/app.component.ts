import { Work } from './../models/work';
import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events, AlertController, LoadingController, App } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushOptions, PushObject, NotificationEventResponse } from '@ionic-native/push';

import { LoginPage } from '../pages/login/login';
import { FindWorkPage } from '../pages/findwork/findwork';

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
    this.listenToCustomerLogged();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initPushNotification() {
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });

    // to initialize push notifications
    const options: PushOptions = {
      android: {
      senderID: '615968990679'},
      ios: {
      alert: 'true',
      badge: true,
      sound: 'false'
      },
    windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    // when a notification arrives
    pushObject.on('notification').subscribe(
      (notification: NotificationEventResponse) => {
        console.log('Received a notification', notification);
        console.log(notification.additionalData);
        let work: Work;
        if(notification.additionalData.work) {
          work = new Work(notification.additionalData.work);
        }
        if(notification.additionalData.foreground) {
          let confirmAlert = this.alertCtrl.create({
            title: notification.title,
            message: notification.message,
            buttons: [{
              text: 'Cancelar',
              role: 'cancel'
            }, {
              text: 'Ver',
              handler: () => {
                if(work) {
                  this.nav.setRoot('WorkDetailsPage', {
                    work: work
                  });
                }
              }
            }]
            });
          confirmAlert.present();
        } else {
          console.log('no foreground');
          if(work) {
            this.nav.setRoot('WorkDetailsPage', {
              work: work
            })
          }
        }
      });
    
    pushObject.on('registration').subscribe(
      (registration: any) => {
        console.log('Device registered', registration)
        localStorage.setItem('deviceToke', registration.registrationId);
        let platform_type = 'UNKNOWN';
        if(this.platform.is('ios')) {
          platform_type = 'IOS';
        } else if(this.platform.is('android')) {
          platform_type = 'ANDROID';
        }
        console.log(platform_type);
        localStorage.setItem('platform', platform_type);

        // register device token in server
        this.deviceService.registerDevice().subscribe(
          (data) => { 
            console.log('register device token status: '+ data.status);
          },
          (err) => { 
            console.log('registre device error: ');
            console.log(err); 
          });
      });

    pushObject.on('error').subscribe(
      error => console.error('Error with Push plugin', error));
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

  listenToCustomerLogged() {
    this.events.subscribe('customer:logged', 
      (customer) => {
        this.customer = customer;
        this.userDataService.saveCustomer(this.customer);
        this.platform.ready().then(() => {
          if(this.platform.is('cordova'))
            this.initPushNotification();
        });
      });
  }

  gotToUserSettings() {
    this.nav.push('SettingsUserPage');
  }
}

