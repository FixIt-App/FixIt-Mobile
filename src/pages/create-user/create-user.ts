import { LoginPage } from './../login/login';
import { Component } from '@angular/core'
import { NavController, Events, NavParams, LoadingController, Platform } from 'ionic-angular'
import { AlertController, ModalController, ToastController } from 'ionic-angular'

import 'rxjs/add/operator/map';

import { UserDataService } from '../../providers/user-data-service'
import { Customer } from '../../models/user'
import { CreditCard } from '../../models/credit-card'
import { ConfirmationService } from '../../providers/confirmation-service'
import { AuthService } from '../../providers/auth-service'
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
    "flag": "assets/colombia_flag.png",
    "emoji": "🇨🇴",
    "ioc": "COL",
    "name": "Colombia",
  };
  phone: number;
  isConfirmingSMS: boolean;
  smsCode: number;
  stepNumber: number;

  showBackButton: boolean;
  showNextButton: boolean;
  disableNextButton: boolean;
  showSkipButton: boolean;
  emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  unregisterCustomBackActionFunction: any;

  constructor(private userService: UserDataService,
              private navParams: NavParams,
              private platform: Platform,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
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
    }
    
    if(this.navParams.get('customer')) {
      this.customer = this.navParams.get('customer');
      this.phone = parseInt(this.customer.phone.substr(3, this.customer.phone.length-3));
    } else {
      this.customer = new Customer({});
      this.customer.creditCard = new CreditCard({});
      this.customer.creditCard.number = "";
    }
    this.isConfirmingSMS = this.navParams.get('isConfirmingSMS');
    if(this.isConfirmingSMS) {
      this.stepNumber = 5;
    }

    platform.ready().then(() => {
      this.unregisterCustomBackActionFunction = platform.registerBackButtonAction(() => {
        this.stepBack();
      })
    })
  }

  createCustomer() {
    this.customer.username = this.customer.email;
    this.customer.phone = this.selectedCountry.countryCallingCodes[0] + this.phone;
    this.customer.city = 'Bogotá, Colombia';
    console.log('voy a guardar customer');
    return this.userService.createCustomer(this.customer).map(
      customer => {
        this.customer.idCustomer = customer.idCustomer;
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
            this.presentErrorAlert('Error', 'El código es incorrecto');
          });
      } else {
        this.authService.login(this.customer.username, this.customer.password).subscribe(
          token => {
            console.log(token);
            localStorage.setItem('token', token);
            this.confirmationService.confirmSMS(this.smsCode).subscribe(
            (status) => {
              console.log(status);
              if(status == 200) {
                this.getAuthenticatedCustomer();
              }
            },
            (error) => {
              console.log(error);
              this.presentErrorAlert('Error', 'El código es incorrecto');
            });
          },
          error => {
            console.log(error);
            this.presentErrorAlert('Error', 'Por favor intenta más tarde');
          });
      }
    }
  }

  confirmedEmail() {
    if(!this.customer.password) {
      this.authService.getAuthCustomer().subscribe(
        customer => {
          this.events.publish('customer:logged', customer);
          this.userDataService.setCustomer(customer);
          if ( customer.confirmations.some(conf => conf.state == true) ) {
            this.userDataService.setCustomer(customer);
            console.log(customer);
            this.unregisterCustomBackActionFunction();
            this.navController.setRoot('PaymentMethodPage', {firstTime: true});
          } else {
            this.presentErrorAlert('Error', 'Aun no has confirmado ni el correo ni el telefono')
          }
        },  
        error => {
          console.log(error);
          this.presentErrorAlert('Error', 'Por favor intenta más tarde');
        }
      );
    } else {
      this.authService.login(this.customer.username, this.customer.password).subscribe(
        token => {
          console.log(token);
          localStorage.setItem('token', token);
          this.authService.getAuthCustomer().subscribe(
            customer => {
              this.events.publish('customer:logged', customer);
              this.userDataService.setCustomer(customer);
              if ( customer.confirmations.some(conf => conf.state == true) ) {
                this.userDataService.setCustomer(customer);
                console.log(customer);
                this.unregisterCustomBackActionFunction();
                this.navController.setRoot('PaymentMethodPage', {firstTime: true});
              } else {
                this.presentErrorAlert('Error', 'Aun no has confirmado el correo')
              }
            },  
            error => {
              console.log(error);
              this.presentErrorAlert('Error', 'Por favor intenta más tarde');
            }
          );
        },
        error => {
          console.log(error);
          this.presentErrorAlert('Error', 'Por favor intenta más tarde');
        });
    }
    
  }

  getAuthenticatedCustomer() {
		this.authService.getAuthCustomer().subscribe(
			customer => {
				this.events.publish('customer:logged', customer);
				this.userDataService.setCustomer(customer);
        console.log(customer);
        this.unregisterCustomBackActionFunction();
        this.navController.setRoot('PaymentMethodPage', {firstTime: true});
			},  
			error => {
			}
		);
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
        this.showNextButton = true;
        this.showSkipButton = false; 
        this.stepNumber++;
        break;
      case 1: //names -> password
        this.showNextButton = true;
        this.showSkipButton = false;
        this.stepNumber++;
        break;
      case 2: //password -> email
        this.showNextButton = true;
        this.showSkipButton = false;
        this.stepNumber++;
        break;
      case 3: //email -> phone
        let loader = this.loadingCtrl.create({spinner: 'crescent'});
        loader.present();
        this.userDataService.isEmailAvailable(this.customer.email).subscribe(
          (canContinue_) => {
            loader.dismiss();
            if(canContinue_) {
              this.stepNumber++;
              this.showNextButton = true;
              this.showSkipButton = false;
            } else {
              this.presentErrorAlert('oh oh!', 'El email ingresado ya se encuentra en uso');
            }
          },
          (error) => {
            loader.dismiss();
            this.presentErrorAlert('Error', 'Por favor intenta más tarde');
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
              this.createCustomer().subscribe(
                () => {
                  this.stepNumber++;
                  console.log(this.stepNumber);
                  // let username = this.customer.username == null ? this.customer.email : this.customer.username;
                  if (!localStorage.getItem("token")) {
                    this.authService.login(this.customer.email, this.customer.password).subscribe(
                      (token) => {
                        console.log(token);
                        localStorage.setItem("token", token);
                      },
                      (error) => {
                        error.log(error);
                        this.presentErrorAlert('Error', 'error al autenticar usuario');
                      }
                    );
                  }
                  this.showNextButton = true;
                  this.showSkipButton = false;
                });
            } else {
              this.presentErrorAlert('oh oh!', 'El celular ingresado ya se encuentra en uso');
            }
          },
          (error) => {
            loader.dismiss();
            this.presentErrorAlert('Error', 'Por favor intenta más tarde');
          }
        );
        break;
      case 5: //smscode -> payment
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
        return !this.isSMSCodeValid();
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
      return this.customer.password.length >= 8
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
    return ((''+this.phone).length >= 9 && (''+this.phone).length <= 10)
  }

  isSMSCodeValid() {
    if(!this.smsCode)
      return false;
    return (''+this.smsCode).length == 3 || (''+this.smsCode).length == 4
  }

  stepBack() {
    if(this.stepNumber == 1) {
      localStorage.clear();
      this.unregisterCustomBackActionFunction();
      this.navController.setRoot(LoginPage);
    } else {
      this.stepNumber--;
    }
  }

  isEmailOk(){
    return true;  
  }

  isSmsCodeOk(){
    return true;
  }

  goToTerms() {
    let modal = this.modalCtrl.create('TermsCondsPage');
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
