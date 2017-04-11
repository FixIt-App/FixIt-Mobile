import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { AlertController, ModalController } from 'ionic-angular'

import { LoginPage } from '../login/login'

import { UserDataService } from '../../providers/user-data-service'
import { Customer } from '../../models/user'
import { CountryCodeSelectorPage } from '../country-code-selector/country-code-selector'

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

  constructor(private userService: UserDataService,
              public alertCtrl: AlertController,
              private navController: NavController,
              private modalCtrl: ModalController)
  {
    this.customer = new Customer({});
  }

  create(){
    this.customer.username = this.customer.email;
    this.customer.phone = this.selectedCountry.countryCallingCodes[0] + this.phone;

    this.userService.saveCustomer(this.customer)
      .subscribe(customer => {
        var alert = this.alertCtrl.create({
          title: 'Éxito',
          subTitle: 'Usuario creado correctamente',
          buttons: ['OK']
        });

        alert.present().then(
          res =>{
            this.navController.setRoot(LoginPage)
          });
          
      },
      error => {
        var msg = 'No se pudo crear el usuario'
        if(error.status = 500){
          msg = "El correo seleccionado ya está en uso"
        }
        
        var alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: msg,
          buttons: ['OK']
        });

        alert.present().then(
          err => {
            this.customer.username = ""
          });
      })
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

}
