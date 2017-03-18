import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { FindWorkPage } from '../findwork/findwork';
import { CreateUserPage } from '../user/create'

import { AuthService } from '../../providers/auth-service';
import { UserDataService } from '../../providers/user-data-service';
import { SERVER_URL } from '../../providers/services.util';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class Login {

    username: string;
    password: string;
    loader: Loading;

    constructor(private navController: NavController,
                private authService: AuthService, 
                public alertCtrl: AlertController,
                public userDataService: UserDataService,
                private loadingCtrl: LoadingController)
    {}


    ionViewDidLoad() {
        if(localStorage.getItem('token')) {
            this.loader = this.loadingCtrl.create({content: "Please wait..."});
            this.loader.present();
            this.getAuthenticatedCustomer();
        }
    }

    login(){
        console.log('entre');
        this.loader = this.loadingCtrl.create({content: "Please wait..."});
        this.loader.present();
        this.authService.login(this.username, this.password).subscribe(
            token => {
                console.log(token.token);
                localStorage.setItem('token', token.token);
                this.authService.reloadToken();
                this.getAuthenticatedCustomer();
            },
            err => {
                this.loader.dismiss();
                let msg = "error " + SERVER_URL;
                if (err.status == 500) {
                    msg = "error de conexión, porfavor intenta mas tarde";
                } else if (err.status == 400) {
                    msg = "Las credenciales ingresadas no son correctas!";
                }
                var alert = this.alertCtrl.create({
                    title: 'Error al inicar sesión',
                    subTitle: msg,
                    buttons: ['OK']
                });
                alert.present();
            })
    }

    getAuthenticatedCustomer() {
        this.authService.getAuthCustomer().subscribe(
            customer => {
                this.userDataService.setCustomer(customer);
                console.log(customer);
                this.navController.setRoot(FindWorkPage);
                this.loader.dismiss();
            },  
            error => {
                this.loader.dismiss();
            }
        )
        
    }

    signUp(){
        this.navController.push(CreateUserPage)
    }
}

