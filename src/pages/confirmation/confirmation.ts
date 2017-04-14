import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Work } from '../../models/work';

@IonicPage()
@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {

  work: Work;
  dayOfWeek: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) 
  {
      this.work = navParams.get('work');
      console.log(this.work);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Confirmation');
  }

  formatAMPM(date) {
    
  }
}
