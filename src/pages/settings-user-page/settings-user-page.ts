import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ModalController, AlertController } from 'ionic-angular';

import { Customer } from '../../models/user';
import { UserDataService } from '../../providers/user-data-service';

@IonicPage()
@Component({
  selector: 'page-settings-user-page',
  templateUrl: 'settings-user-page.html',
})
export class SettingsUserPage {

  customer: Customer;
  field: string;
  fieldValue: any;
  selectedCountry: any = {
    "alpha2": "CO",
    "alpha3": "COL",
    "countryCallingCodes": [
      "+57"
    ],
    "emoji": "🇨🇴",
    "ioc": "COL",
    "name": "Colombia",
  };

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform :Platform,
              public loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private userDataService: UserDataService) 
  {
    this.field = '';
    this.customer = this.userDataService.getCustomer();
    // console.log(this.customer);
    // this.customer = {
    //   username: "alfredo-santamaria@outlook.com", 
    //   firstName: "Alfredo", 
    //   lastName: "Santamaria", 
    //   email: "alfredo-santamaria@outlook.com", 
    //   phone: "+573186017861",
    //   city: "Bogotá, Colombia",
    //   confirmations: [
    //     { confirmation_type:"MAIL", state:false},
    //     { confirmation_type:"SMS", state:true}
    //   ],
    //   idCustomer:5
    // };
    console.log(this.customer)
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.goBack();
      });
    });
  }

  goBack() {
    if(this.field != '') {
      this.field = '';
      this.fieldValue = '';
    } else if(this.navCtrl.canGoBack()){
      this.navCtrl.pop();
    }
  }

  editProfile() {
    // TODO (a-santamaria): edit profile pic
    console.log('TODO (a-santamaria): edit profile pic');
  }

  edit(s: string) {
    this.field = s;
    console.log(this.field);
  }

  saveField() {
    console.log(this.fieldValue);
    if(!this.fieldValue || this.fieldValue == '') {
      // campo vacio
      return;
    }
    if(this.field == 'phone') {
      this.fieldValue = this.selectedCountry.countryCallingCodes[0] + this.fieldValue;
      console.log(this.fieldValue);
    }
    let loader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    loader.present();
    this.userDataService.updateCustomer(this.customer.idCustomer, this.field, this.fieldValue).subscribe(
      (customer) => {
        console.log(customer);
        this.customer = customer;
        this.field = '';
        this.fieldValue = '';
        loader.dismiss();
      },
      (error) => {
        let msg: string = "Error, por favor intenta más tarde";
        if(error.status == 400) {
          if(this.field == 'phone')
            msg = "El celular ya está registrado con otro usuario";
          if(this.field == 'email')
            msg = "El email ya está registrado con otro usuario";

        }
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: msg,
          buttons: ['OK']
        });
        alert.present();
        console.log(error);
        // this.field = '';
        this.fieldValue = '';
        loader.dismiss();
      }
    )
  }

  gotToSelectCountry() {
    let modal = this.modalCtrl.create('CountryCodeSelectorPage');
       modal.onDidDismiss(
         (data) => {
           if(data) {
            this.selectedCountry = data;
           }
         }
       );
       modal.present();
  }

}
