import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { COUNTRY_CODES } from './country-codes';

@IonicPage()
@Component({
  selector: 'page-country-code-selector',
  templateUrl: 'country-code-selector.html'
})
export class CountryCodeSelectorPage implements OnInit {

  countryCodes: any;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private viewCtrl: ViewController) 
  {
  }

  ngOnInit() {
    this.sleep(100).then(() => this.countryCodes = COUNTRY_CODES);
  }

  select(countrySelected) {
    this.viewCtrl.dismiss(countrySelected);
  }

  initializeItems() {
    this.countryCodes = COUNTRY_CODES;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.countryCodes = this.countryCodes.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
