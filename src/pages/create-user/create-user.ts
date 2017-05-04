import { Component } from '@angular/core'
import { NavController, Events, NavParams } from 'ionic-angular'
import { AlertController, ModalController } from 'ionic-angular'

import { UserDataService } from '../../providers/user-data-service'
import { Customer } from '../../models/user'
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
    if(this.navParams.get('customer'))
      this.customer = this.navParams.get('customer');
    else
      this.customer = new Customer({});
    this.isConfirmingSMS = this.navParams.get('isConfirmingSMS');
    console.log('entre a create customer');
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
