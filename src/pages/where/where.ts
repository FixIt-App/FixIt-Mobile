import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'where',
  templateUrl: 'where.html'
})
export class WherePage {


    constructor(
      private navController: NavController,
      private navParams: NavParams){
    }

    nextStep(ev) {
      ev.preventDefault()
    }
}
