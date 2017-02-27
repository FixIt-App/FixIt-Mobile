import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WhatPage } from '../what/what';

@Component({
  selector: 'where',
  templateUrl: 'where.html'
})
export class WherePage {


    constructor(
      private navController: NavController,
      private navParams: NavParams){
    }

    nextStep() {
      this.navController.push(WhatPage);
    }
}
