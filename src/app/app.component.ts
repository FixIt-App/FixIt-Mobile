import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { FindWorkPage } from '../pages/findwork/findwork'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  @ViewChild('myNav')
  nav: NavController

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  navigateToHome() {
    console.log('click!')
     this.nav.push(FindWorkPage).then(
      response => {
        console.log('Response ' + response);
      },
      error => {
        console.log('Error: ' + error);
      }
    ).catch(exception => {
      console.log('Exception ' + exception);
    });

  }
}
