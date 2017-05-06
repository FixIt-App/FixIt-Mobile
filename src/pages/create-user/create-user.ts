import { Component } from '@angular/core'
import { NavController, Events, NavParams } from 'ionic-angular'
import { AlertController, ModalController } from 'ionic-angular'

import { UserDataService } from '../../providers/user-data-service'
import { Customer } from '../../models/user'
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
    
    this.stepNumber = 1;
    this.title = "¿Cómo te llamas?";
    this.subtitle = null;
    
    if(this.navParams.get('customer'))
      this.customer = this.navParams.get('customer');
    else
      this.customer = new Customer({});
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
      error => {
        var msg = 'No se pudo crear el usuario';
        if(error.status = 500){
          msg = "El correo seleccionado ya está en uso";
        }
        
        var alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: msg,
          buttons: ['OK']
        });
        //todo (a-santamaria): revisar tipos de errores
        alert.present().then(
          err => {
            this.customer.username = "";
            this.customer.email = "";
          });
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

  gotToSelectCountry() {
    let modal = this.modalCtrl.create(CountryCodeSelectorPage);
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
    this.stepNumber++;
    switch(this.stepNumber){
      case 1:
        this.title = "¿Cómo te llamas?";
        this.subtitle = null;
        break;
      case 2:
        this.title = "Correo electrónico";
        this.subtitle = "No spam, prometido";
        break;
      case 3:
        this.title = "Contraseña";
        this.subtitle = "Recuerda que debe ser mínimo de 8 caracteres";
        break;
      case 4:
        this.title = "¿Quién eres?";
        this.subtitle = "test";
        break;
      case 5:
        this.title = "¿Quién eres?";
        this.subtitle = null;
        break;
      case 6:
        this.title = "¿Quién eres?";
        this.subtitle = "test";
        break;
    }
  }

  previousStep(){
    this.stepNumber -= 2;
    this.nextStep();
  }

}
