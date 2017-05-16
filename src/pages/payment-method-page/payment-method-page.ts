import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AlertController, ModalController } from 'ionic-angular'

@IonicPage()
@Component({
  selector: 'page-payment-method-page',
  templateUrl: 'payment-method-page.html',
})
export class PaymentMethodPage {

  creditCard: any;
  form: FormGroup;
  number: AbstractControl;
  expirationDate: AbstractControl;
  cvv: AbstractControl;
  country: AbstractControl;
  submitAttempt: boolean;
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
              private formBuilder: FormBuilder,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController, 
              public navParams: NavParams) 
  {
    this.creditCard = {
      number: 0,
      expirationDate: "",
      cvv: 0,
      country: ""
    };
    this.submitAttempt = false;
    
    this.form = this.formBuilder.group({
        number:   ['', Validators.compose([Validators.required])],
        expirationDate:   ['', Validators.compose([Validators.required])],
        cvv: ['', Validators.compose([Validators.required])],
        country: ['', Validators.compose([Validators.required])]
      });
    this.number = this.form.controls['number'];
    this.expirationDate = this.form.controls['expirationDate'];
    this.cvv = this.form.controls['cvv'];
    this.country = this.form.controls['country'];
  }

  ionViewDidLoad() {
    
  }

  goToSelectCountry() {
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
