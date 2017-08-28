import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-rate-worker',
  templateUrl: 'rate-worker.html',
})
export class RateWorkerPage {

  stars: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RateWorkerPage');
  }

  starsChange (stars) {
    this.stars = stars;
  }
}
