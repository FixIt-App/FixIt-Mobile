import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

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
              public events: Events)
  {
    // menu navigation pages
    this.pages = [
      { title: 'Próximos servicios', component: 'NextServicesPage' },
      { title: 'Historial servicios', component: FindWorkPage },
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
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
  
  openPage(page) {
    if(page.title == 'Cerrar sesión') {
      localStorage.clear();
      this.nav.setRoot(LoginPage);
    } else
      this.nav.push(page.component);
  }

  listenToCustomerLogged() {
    this.events.subscribe('customer:logged', 
      (customer) => {
        this.customer = customer;
      });
  }
}

