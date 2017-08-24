import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ModalController, AlertController, ToastController } from 'ionic-angular';

import { Customer } from '../../models/user';
import { UserDataService } from '../../providers/user-data-service';
import { ConfirmationService } from '../../providers/confirmation-service';

@IonicPage()
@Component({
  selector: 'page-settings-user-page',
  templateUrl: 'settings-user-page.html',
})
export class SettingsUserPage {

  customer: Customer;
  field: string;
  fieldValue: any;
  smsCode: number;
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
  unregisterCustomBackActionFunction: any;
  smsIsConfirmed: boolean;
  mailIsConfirmed: boolean;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform :Platform,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private confirmationService: ConfirmationService,
              private userDataService: UserDataService) 
  {
    this.field = '';
    this.customer = this.userDataService.getCustomer();
    this.smsIsConfirmed = this.customer.confirmations.find(conf => conf.confirmation_type == 'SMS').state;
    this.mailIsConfirmed = this.customer.confirmations.find(conf => conf.confirmation_type == 'MAIL').state;
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
      this.unregisterCustomBackActionFunction = this.platform.registerBackButtonAction(() => {
        this.goBack();
      });
    });
  }

  goBack() {
    if(this.field != '') {
      this.field = '';
      this.fieldValue = '';
    } else if(this.navCtrl.canGoBack()){
      this.unregisterCustomBackActionFunction();
      this.navCtrl.pop();
    }
  }

  editProfile() {
    // TODO (a-santamaria): edit profile pic
    console.log('TODO (a-santamaria): edit profile pic');
  }

  edit(s: string) {
    this.field = s;
    if(this.field == 'phone') {
      this.fieldValue = this.customer.phone.substr(3, this.customer.phone.length-3);
    } else if (this.field == 'first_name') {
      this.fieldValue = this.customer.firstName;
    } else if (this.field == 'last_name') {
      this.fieldValue = this.customer.lastName;
    } else if (this.field == 'email') {
      this.fieldValue = this.customer.email;
    }
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

  confirmSMS() {
    this.confirmationService.confirmSMS(this.smsCode).subscribe(
      (status) => {
        console.log(status);
        this.smsIsConfirmed = this.customer.confirmations.find(conf => conf.confirmation_type == 'SMS').state = true;
        this.field = '';
      },
      (error) => {
        console.log(error);
        this.presentErrorAlert('Error', 'El código es incorrecto');
      });
  }

  confirmMail() {
    this.confirmationService.getMyConfirmations().subscribe(
      (confirmations) => {
        this.customer.confirmations = confirmations;
        this.mailIsConfirmed = this.customer.confirmations.find(conf => conf.confirmation_type == 'MAIL').state;
        if (this.mailIsConfirmed) {
          let toast = this.toastCtrl.create({
            message: "Correo confirmado exitosamente",
            showCloseButton: true,
            duration: 3000
          })
          this.field = '';
          toast.present();
        } else {
          this.presentErrorAlert('Error', 'Aún no has confirmado el correo electrónico.');
        }
      },
      (error) => {
        console.log(error);
        this.presentErrorAlert('Error', 'Por favor intenta más tarde.');
      }
    )
  }

  sendCodeAgain() {
    this.confirmationService.resendSMSCode().subscribe(
      data => { 
        console.log(data)
        let toast = this.toastCtrl.create({
          message: "Código de confirmación reenviado",
          showCloseButton: true,
          duration: 3000
        })
        toast.present();
      },
      error => { console.log(error) }
    );
  }

  sendConfirmEmailAgain() {
    this.confirmationService.resendConfirmMail().subscribe(
      data => { 
        console.log(data)
        let toast = this.toastCtrl.create({
          message: "Correo de confirmación reenviado",
          showCloseButton: true,
          duration: 3000
        })
        toast.present();
      },
      error => { console.log(error) }
    );
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

  presentErrorAlert(title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: ['OK']
    });
    alert.present();
  }
}
