import { Component } from '@angular/core'
import { NavController, LoadingController, Loading } from 'ionic-angular'
import { AlertController } from 'ionic-angular'

import { Login } from '../login/login'

import { UserDataService } from '../../providers/user-data-service'
import { Customer } from '../../models/user'

@Component({
    selector: 'create-user',
    templateUrl: 'create.html'
})
export class CreateUserPage {

    customer: Customer;

    constructor(private userService: UserDataService,
                public alertCtrl: AlertController,
                private navController: NavController){
        this.customer = new Customer({});
    }

    create(){
        this.userService.saveCustomer(this.customer)
            .subscribe(customer => {
               var alert = this.alertCtrl.create({
                    title: 'Éxito',
                    subTitle: 'Usuario creado correctamente',
                    buttons: ['OK']
                });

                alert.present()
                     .then(res =>{
                         this.navController.setRoot(Login)
                })
                
            },
            error => {
                var alert = this.alertCtrl.create({
                    title: 'Error',
                    subTitle: 'No se pudo crear el usuario',
                    buttons: ['OK']
                });

                alert.present()
                    .then(err => {
                        this.customer = new Customer({})
                    })
            })
    }

}
