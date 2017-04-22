import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushOptions, PushObject } from '@ionic-native/push';

import { LoginPage } from '../pages/login/login';
import { FindWorkPage } from '../pages/findwork/findwork';

import { Customer } from '../models/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;
  customer: Customer;

  constructor(public platform: Platform,
              public menu: MenuController,
              public events: Events,
              public splashScreen: SplashScreen,
              private alertCtrl: AlertController,
              private push: Push)
  {
    // menu navigation pages
    this.pages = [
      { title: 'Pedir trabajo', component: FindWorkPage },
      { title: 'Próximos servicios', component: 'NextServicesPage' },
      { title: 'Historial servicios', component: 'ServiceHistoricalPage' },
      { title: 'Configuraciones', component: FindWorkPage },
      { title: 'Cerrar sesión', component: null }
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
      this.initPushNotification();
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
    pushObject.on('notification').subscribe((notification: any) =>{
    console.log('Received a notification', notification);
    //Notification Display Section
    let confirmAlert = this.alertCtrl.create({
      title: 'New Notification',
      message: JSON.stringify(notification),
      buttons: [{
        text: 'Ignore',
        role: 'cancel'
      }, {
      text: 'View',
      handler: () => {
        //TODO: Your logic here
        //self.nav.push(DetailsPage, {message: data.message});
        }
      }]
      });
    confirmAlert.present();
    //
    });
    pushObject.on('registration').
    subscribe((registration: any) => console.log('Device registered', registration));
    pushObject.on('error').
    subscribe(error => console.error('Error with Push plugin', error));
  }
  
  openPage(page) {
    if(page.title == 'Cerrar sesión') {
      localStorage.clear();
      this.nav.setRoot(LoginPage);
    } else if(page.title == 'Pedir trabajo') {
      if(this.nav.getActive() != page.component)
        this.nav.setRoot(page.component);
    } else {
      this.nav.push(page.component);
    }
  }

  listenToCustomerLogged() {
    this.events.subscribe('customer:logged', 
      (customer) => {
        this.customer = customer;
      });
  }
}

