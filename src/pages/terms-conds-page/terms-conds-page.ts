import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-terms-conds-page',
  templateUrl: 'terms-conds-page.html',
})
export class TermsCondsPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private viewCtrl: ViewController) 
  {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsCondsPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
