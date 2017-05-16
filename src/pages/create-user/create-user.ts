import { Component } from '@angular/core'
import { NavController, Events, NavParams } from 'ionic-angular'
import { AlertController, ModalController } from 'ionic-angular'

import { UserDataService } from '../../providers/user-data-service'
import { Customer } from '../../models/user'
import { CreditCard } from '../../models/credit-card'
import { CountryCodeSelectorPage } from '../country-code-selector/country-code-selector'
import { FindWorkPage } from '../findwork/findwork';
import { ConfirmationService } from '../../providers/confirmation-service';
import { AuthService } from '../../providers/auth-service';

@Component({
    selector: 'page-create-user',
    templateUrl: 'create-user.html'
})
export class CreateUserPage {

  customer: Customer;
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
  phone: number;
  isConfirmingSMS: boolean;
  smsCode: number;
  stepNumber: number;

  title: string;
  subtitle: string;

  showBackButton: boolean;
  showNextButton: boolean;
  disableNextButton: boolean;
  showSkipButton: boolean;

  constructor(private userService: UserDataService,
              private navParams: NavParams,
              public alertCtrl: AlertController,
              private navController: NavController,
              private modalCtrl: ModalController,
              private confirmationService: ConfirmationService,
              private authService: AuthService,
              public events: Events,
              public userDataService: UserDataService)
  {
    
    
    if(this.stepNumber == null){
      this.stepNumber = 1;
      this.firstStep(); 
    }

    this.smsCode = 1234;
    
    if(this.navParams.get('customer'))
      this.customer = this.navParams.get('customer');
    else{
      this.customer = new Customer({});
      this.customer.creditCard = new CreditCard();
      this.customer.creditCard.number = "";
    }
      this.isConfirmingSMS = this.navParams.get('isConfirmingSMS');
  }

  create() {
    this.customer.username = this.customer.email;
    this.customer.phone = this.selectedCountry.countryCallingCodes[0] + this.phone;
    this.customer.city = 'Bogotá, Colombia';
    this.userService.saveCustomer(this.customer).subscribe(
      customer => {
        this.isConfirmingSMS = true;
      },
      (error: Response) => {
        console.log(error);
        var msg = 'No se pudo crear el usuario'
        if(error.status == 500){
          msg = "El correo seleccionado ya está en uso";
        } else if (error.status == 400) {
          let errObj = error.json();
          if (errObj['email']) {
            msg = errObj['email'];
          } else if (errObj['username']) {
            msg = errObj['username'];
          } else if(errObj['phone']) {
            msg = errObj['phone'];
          } else {
            msg = "Error por favor intenta más tarde";
          }
        }
        
        var alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: msg,
          buttons: ['OK']
        });
        //todo (a-santamaria): revisar tipos de errores
        alert.present();
      })
  }

  confirmSMS() {
    if(this.smsCode) {
      if(!this.customer.password) {
        this.confirmationService.confirmSMS(this.smsCode).subscribe(
          (status) => {
            console.log(status);
            if(status == 200) {
              this.getAuthenticatedCustomer();
            }
          },
          (error) => {
            console.log(error);
          });
      }else {
        this.authService.login(this.customer.username, this.customer.password).subscribe(
          token => {
            console.log(token);
            localStorage.setItem('token', token.token);
            this.authService.reloadToken();
            this.confirmationService.confirmSMS(this.smsCode).subscribe(
            (status) => {
              console.log(status);
              if(status == 200) {
                this.getAuthenticatedCustomer();
              }
            },
            (error) => {
              console.log(error);
            });
          },
          error => {
            console.log(error);
          });
      }
    }
  }

  getAuthenticatedCustomer() {
		this.authService.getAuthCustomer().subscribe(
			customer => {
				this.events.publish('customer:logged', customer);
				this.userDataService.setCustomer(customer);
				console.log(customer);
				this.navController.setRoot(FindWorkPage);
			},  
			error => {
				
			}
		);
	}

  sendCodeAgain() {
    this.confirmationService.resendSMSCode().subscribe(
      data => { console.log(data) },
      error => { console.log(error) }
    );
  }

  goBack() {
    this.navController.pop();
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

  nextStep(){
    let canContinue = false;

    switch(this.stepNumber){
      case -1:
        canContinue = this.goToLogInView();
        this.stepNumber = 0;
        break;
      case 0:
        canContinue = this.firstStep();
        break;
      case 1:
        canContinue = this.secondStep();
        break;
      case 2:
        canContinue = this.thirdStep();
        break;
      case 3:
        canContinue = this.forthStep();
        break;
      case 4:
        canContinue =this.fifthStep();
        break;
      case 5:
        canContinue =this.sixthStep();
        break;
      case 6:
        canContinue = false;//LogIn 
        break;
    }

    if(canContinue)
      this.stepNumber++;
  }

  firstStep(){
    this.title = "¿Cómo te llamas?";
    this.subtitle = null;

    this.showNextButton = true;
    this.showSkipButton = false; 

    return true;
  }

  secondStep(){
    this.title = "Contraseña";
    this.subtitle = "Recuerda que debe ser mínimo de 8 caracteres";

    this.showNextButton = true;
    this.showSkipButton = false;

    return true;
  }

  thirdStep(){
    this.title = "Correo electrónico";
    this.subtitle = "No spam, prometido";

    this.showNextButton = true;
    this.showSkipButton = false;

    if(this.isEmailOk()){
      return true;
    }else{
      this.customer.email = "";
      alert('El correo selecccionado se encuentra en uso');
      return false;
    }
  }

  forthStep(){
    this.title = "Número telefónico";
    this.subtitle = null;

    this.showNextButton = true;
    this.showSkipButton = false;

    return true; 
  }

  fifthStep(){
    this.title = "Confirma tu número";
    this.subtitle = "Hemos un enviado un código de confirmación de 4 dígitos a tu teléfono "+
                        "a través de un mensaje de texto, ingresa el código a continuación. ";

    this.showNextButton = true;
    this.showSkipButton = false;

    if(this.isSmsCodeOk()){
      return true;
    }else{
      this.customer.email = "";
      alert('El código ingresado es incorrecto');
      return false;
    }
  }

  sixthStep(){
    this.title = "Tarjeta de crédito";
    this.subtitle = "Puedes ingresarla más adelante si lo deseas, pero vas a necesitarla para usar nuestros servicios";

    this.showNextButton = true;
    this.showSkipButton = false; 

    return true;
  }

  stepBack(){
    this.stepNumber -= 2;
    if(this.stepNumber < -1)
      this.stepNumber = -1;
    this.nextStep();
  }

  goToLogInView(){
    console.log('LogIn Page');
    return true;
  }

  isEmailOk(){
    return true;  
  }

  isSmsCodeOk(){
    return true;
  }
}
