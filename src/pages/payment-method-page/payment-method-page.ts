import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AlertController, ModalController } from 'ionic-angular'
import { WorkTypeService } from '../../providers/wortktype-service'
import { FindWorkPage } from '../findwork/findwork';

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
  firstTime: boolean;
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
              private workTypeService: WorkTypeService,
              private formBuilder: FormBuilder,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private navController: NavController,
              public navParams: NavParams) 
  {
    this.firstTime = this.navParams.get('firstTime');
    this.firstTime == undefined ? false : this.firstTime;
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

  goToFindWorks() {
    this.workTypeService.getWorkTypes().subscribe(
      categories => {
        this.navController.setRoot(FindWorkPage, { categories: categories.reverse() });
      },
      error => {
        console.log(error);
      });
  }
}
