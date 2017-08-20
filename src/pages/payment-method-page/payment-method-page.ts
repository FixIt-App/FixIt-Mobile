import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { AlertController, ModalController, LoadingController, Loading, ViewController } from 'ionic-angular'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { WorkTypeService } from '../../providers/wortktype-service'
import { FindWorkPage } from '../findwork/findwork'
import { CreditCard } from './../../models/credit-card';
import { PaymentService } from './../../providers/payment-service';

@IonicPage()
@Component({
  selector: 'page-payment-method-page',
  templateUrl: 'payment-method-page.html',
})
export class PaymentMethodPage {

  creditCard: CreditCard;
  form: FormGroup;
  name: AbstractControl;
  number: AbstractControl;
  expirationMonth: AbstractControl;
  expirationYear: AbstractControl;
  cvc: AbstractControl;
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
  mapaCampos = {
    "cardHolderName": "Nombre de tarjeta",
    "primaryAccountNumber": "Número de tarjeta",
    "expirationMonth": "Mes de expiración",
    "expirationYear": "Año de expiración",
    "cvc": "Código de seguridad"
  }

  constructor(public navCtrl: NavController,
              private workTypeService: WorkTypeService,
              private formBuilder: FormBuilder,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private navController: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private paymentService: PaymentService,
              public loadingCtrl: LoadingController)
  {
    this.firstTime = this.navParams.get('firstTime');
    this.firstTime == undefined ? false : this.firstTime;
    this.submitAttempt = false;
    
    this.form = this.formBuilder.group({
        name: ['', Validators.compose([Validators.required])],
        number: ['', Validators.compose([Validators.required])],
        expirationMonth:   ['', Validators.compose([Validators.required])],
        expirationYear:   ['', Validators.compose([Validators.required])],
        cvc: ['', Validators.compose([Validators.required])],
        // country: ['', Validators.compose([Validators.required])]
      });
    this.name = this.form.controls['name'];
    this.number = this.form.controls['number'];
    this.expirationMonth = this.form.controls['expirationMonth'];
    this.expirationYear = this.form.controls['expirationYear'];
    this.cvc = this.form.controls['cvc'];
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

  saveCreditCard() {
    this.submitAttempt = true;
    if (this.form.valid) {
      let loader = this.loadingCtrl.create({spinner: 'crescent'});
      loader.present();
      this.creditCard = new CreditCard({});
      this.creditCard.cardHolderName = this.name.value;
      this.creditCard.number = this.number.value;
      this.creditCard.expirationMonth = this.expirationMonth.value;
      this.creditCard.expirationYear = this.expirationYear.value;
      this.creditCard.cvc = this.cvc.value;

      console.log(this.creditCard);
      this.paymentService.saveCreditCard(this.creditCard).subscribe(
        (response) => {
          console.log(response.token);
          this.paymentService.saveTokenToServer(response.token).subscribe(
            (status) => {
              if (this.firstTime) {
                this.goToFindWorks();
              } else {
                this.creditCard.lastFour = this.creditCard.number.substr(this.creditCard.number.length-5, 4);
                this.viewCtrl.dismiss({
                  card: this.creditCard
                });
              }
              loader.dismiss();
            },
            (error) => {
              console.log(error);
              loader.dismiss();
              let errAlert = this.alertCtrl.create({
                title: "Error",
                message: "No se pudo procesar la tarjeta, por favor intenta mas tarde ",
                buttons: ['Dismiss']
              })
              errAlert.present();
            }
          )
        },
        (error) => {
          loader.dismiss();
          if (error.status == 422) {
            let campos = error.json().errors.map( ob => this.mapaCampos[ob.field]);
            let mess = campos[0] + " inválido";
            let errAlert = this.alertCtrl.create({
              title: "Error",
              message: mess,
              buttons: ['Dismiss']
            })
            errAlert.present();
          } else {
            let errAlert = this.alertCtrl.create({
              title: "Error",
              message: "No se pudo procesar la tarjeta, por favor intenta mas tarde ",
              buttons: ['Dismiss']
            })
            
            errAlert.present();
          }
        }
      )
    } else {
      console.log("form not valid");
    }
  }

}
