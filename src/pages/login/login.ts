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
    token: string;
    loader: Loading;

    constructor(private navController: NavController,
                private authService: AuthService, 
                public alertCtrl: AlertController,
                public userDataService: UserDataService,
                private loadingCtrl: LoadingController)
    {
        this.loader = this.loadingCtrl.create({content: "Please wait..."});
    }


    ionViewDidLoad() {
        this.token = localStorage.getItem('token');
        if(this.token) {
            this.loader.present();
            this.getAuthenticatedUser();
        }
    }

    login(){
        this.loader.present();
        this.authService.login(this.username, this.password)
            .subscribe(
            token => {
                localStorage.setItem('token', token.token);
                this.token = token.token;
                this.getAuthenticatedUser();
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

    getAuthenticatedUser() {
        //TODO(a.santamaria): change it to work with workers too
        this.authService.getAuthCustomer(this.token).subscribe(
            customer => {
                this.userDataService.setCustomer(customer);
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

