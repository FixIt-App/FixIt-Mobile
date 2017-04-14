import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Work } from '../../models/work';

import {FormatTime} from '../../pipes/format-time';

@IonicPage()
@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {

  work: Work;
  dayOfWeek: string;
  month: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) 
  {
      var dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      this.work = navParams.get('work');
      this.dayOfWeek = dayName[this.work.date.getDay()];
      this.month = monthNames[this.work.date.getMonth()]
      console.log(this.work);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Confirmation');
  }

  formatAMPM(date) {
    
  }
}
