import { Component } from '@angular/core'
import { NavController, Events, NavParams, LoadingController } from 'ionic-angular'
import { AlertController, ModalController } from 'ionic-angular'

import 'rxjs/add/operator/map';

import { UserDataService } from '../../providers/user-data-service'
import { Customer } from '../../models/user'
import { CreditCard } from '../../models/credit-card'
import { FindWorkPage } from '../findwork/findwork';
import { ConfirmationService } from '../../providers/confirmation-service';
import { AuthService } from '../../providers/auth-service';
import { WorkTypeService } from '../../providers/wortktype-service'

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
  emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private userService: UserDataService,
              private navParams: NavParams,
              public alertCtrl: AlertController,
              private navController: NavController,
              private modalCtrl: ModalController,
              private confirmationService: ConfirmationService,
              private authService: AuthService,
              private workTypeService: WorkTypeService,
              public events: Events,
              public userDataService: UserDataService,
              public loadingCtrl: LoadingController)
  {
    
    
    if(this.stepNumber == null){
      this.stepNumber = 1;
      this.firstStep(); 
    }
    
    if(this.navParams.get('customer'))
      this.customer = this.navParams.get('customer');
    else {
      this.customer = new Customer({});
      this.customer.creditCard = new CreditCard();
      this.customer.creditCard.number = "";
    }
    this.isConfirmingSMS = this.navParams.get('isConfirmingSMS');
    if(this.isConfirmingSMS) {
      this.title = "Confirma tu número";
      this.subtitle = "Hemos un enviado un código de confirmación de 4 dígitos a tu teléfono "+
                "a través de un mensaje de texto, ingresa el código a continuación." + 
                "Si demora, también puedes revisar en tu correo.";
    }
  }

  create() {
    this.customer.username = this.customer.email;
    this.customer.phone = this.selectedCountry.countryCallingCodes[0] + this.phone;
    this.customer.city = 'Bogotá, Colombia';
    return this.userService.saveCustomer(this.customer).map(
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
      } else {
        this.authService.login(this.customer.username, this.customer.password).subscribe(
          token => {
            console.log(token);
            localStorage.setItem('token', token);
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
        this.navController.setRoot('PaymentMethodPage', {firstTime: true});
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

  nextStep() {
    let canContinue = false;

    switch(this.stepNumber) {
      case 0: //login -> names
        canContinue = this.firstStep();
        if(canContinue)
          this.stepNumber++;
        break;
      case 1: //names -> password
        if(this.isNameValid()) {
          this.title = "Contraseña";
          this.subtitle = "Recuerda que debe ser mínimo de 8 caracteres";

          this.showNextButton = true;
          this.showSkipButton = false;
          this.stepNumber++;
        }
        break;
      case 2: //password -> email
        if(this.isPasswordValid()) {
          this.title = "Correo electrónico";
          this.subtitle = "No spam, prometido";

          this.showNextButton = true;
          this.showSkipButton = false;
          this.stepNumber++;
        } else {
          // TODO(fabka): message error
        }
        break;
      case 3: //email -> phone
        let loader = this.loadingCtrl.create({spinner: 'crescent'});
        loader.present();
        this.userDataService.isEmailAvailable(this.customer.email).subscribe(
          (canContinue_) => {
            loader.dismiss();
            if(canContinue_) {
              this.stepNumber++;
              this.title = "Número telefónico";
              this.subtitle = null;

              this.showNextButton = true;
              this.showSkipButton = false;
            } else {
              let alert = this.alertCtrl.create({
                title: 'oh oh!',
                message: 'El email ingresado ya se encuentra en uso',
                buttons: ['OK']
              });
              alert.present();
            }
          }
        );
        break;
      case 4: //phone -> smscode
        loader = this.loadingCtrl.create({spinner: 'crescent'});
        loader.present();
        this.userDataService.isPhoneAvailable(this.selectedCountry.countryCallingCodes[0] + this.phone).subscribe(
          (canContinue_) => {
            loader.dismiss();
            if(canContinue_) {
              this.create().subscribe(
                () => {
                  this.stepNumber++;
                  this.title = "Confirma tu número";
                  this.subtitle = "Hemos un enviado un código de confirmación de 4 dígitos a tu teléfono "+
                      "a través de un mensaje de texto, ingresa el código a continuación." + 
                      "Si demora, también puedes revisar en tu correo.";
                  
                  let username = this.customer.username == null ? this.customer.email : this.customer.username;

                  this.authService.login(this.customer.email, this.customer.password).subscribe(
                    (token) => {
                      localStorage.setItem("token", token);
                    },
                    (error) => {
                      //Todo (fabka)
                      error.log(error);
                    }
                  );
                  this.showNextButton = true;
                  this.showSkipButton = false;
                });
            } else {
              let alert = this.alertCtrl.create({
                title: 'oh oh!',
                message: 'El celular ingresado ya se encuentra en uso',
                buttons: ['OK']
              });
              alert.present();
            }
          }
        );
        break;
      case 5: //smscode -> payment
        this.title = "Tarjeta de crédito";
        this.subtitle = "Puedes ingresarla más adelante si lo deseas, pero vas a necesitarla para usar nuestros servicios";

        this.showNextButton = true;
        this.showSkipButton = false; 
        this.stepNumber++;
        break;
      case 6: //payment -> findeworks
        canContinue = false;//LogIn 
        if(canContinue)
          this.stepNumber++;
        break;
    }
  }

  firstStep() {
    this.title = "¿Cómo te llamas?";
    this.subtitle = null;

    this.showNextButton = true;
    this.showSkipButton = false; 

    return true;
  }

  disableNext() {
    switch(this.stepNumber) {
      case -1:
        return false;
      case 0:
        return true;
      case 1: //names
        return !this.isNameValid();
      case 2: //password
        return !this.isPasswordValid();
      case 3: //email
        return !this.isEmailValid();
      case 4: //phone
        return !this.isPhoneValid();
      case 5: // sms
        return false;
      case 6: // payment method
       return false;
    }
  }

  isNameValid() {
    if(!this.customer.firstName || this.customer.firstName == '')
      return false;
    if(!this.customer.lastName || this.customer.lastName == '')
      return false;
    return true;
  }

  isPasswordValid() {
    if(!this.customer.password) {
      return false;
    } else {
      if(this.customer.password.length >= 8) 
        return true;
      else 
        return false;
    }
  }

  isEmailValid() {
    if(!this.customer.email || this.customer.email == '')
      return false;
    return this.emailRegExp.test(this.customer.email);
  }

  isPhoneValid() {
    if(!this.phone)
      return false;
    if((''+this.phone).length >= 9 && (''+this.phone).length <= 10)
      return true;
    else 
      return false;
  }

  stepBack() {
    if(this.stepNumber == 1) {
      this.navController.pop();
    } else {
      this.stepNumber -= 2;
      this.nextStep();
    }
  }

  isEmailOk(){
    return true;  
  }

  isSmsCodeOk(){
    return true;
  }
}
