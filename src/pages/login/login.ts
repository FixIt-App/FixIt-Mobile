import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { FindWorkPage } from '../findwork/findwork';
import { CreateUserPage } from '../create-user/create-user'

import { AuthService } from '../../providers/auth-service';
import { UserDataService } from '../../providers/user-data-service';
import { SERVER_URL } from '../../providers/services.util';
import { ConfirmationService } from '../../providers/confirmation-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

	username: string;
	password: string;
	authenticatingUser: boolean;

	constructor(private navController: NavController,
							private authService: AuthService,
							public alertCtrl: AlertController,
							public events: Events,
							public userDataService: UserDataService,
							public confirmationService: ConfirmationService)
	{
		this.authenticatingUser = true;
	}


	ionViewDidLoad() {
		if(localStorage.getItem('token')) {
			this.authenticatingUser = true;
			this.getAuthenticatedCustomer();
		} else {
			this.authenticatingUser = false;
		}
	}

	login(){
		this.authService.login(this.username, this.password).subscribe(
			token => {
				console.log(token.token);
				localStorage.setItem('token', token.token);
				this.authService.reloadToken();
				this.getAuthenticatedCustomer();
			},
			err => {
				this.authenticatingUser = false;
				let msg = "error " + SERVER_URL;
				if (err.status == 500) {
						msg = "error de conexión, porfavor intenta mas tarde";
				} else if (err.status == 400) {
						msg = "Las credenciales ingresadas no son correctas!";
				}
				var alert = this.alertCtrl.create({
						title: 'Error al iniciar sesión',
						subTitle: msg,
						buttons: ['OK']
				});
				alert.present();
			})
	}

	getAuthenticatedCustomer() {
		this.authService.getAuthCustomer().subscribe(
			customer => {
				this.events.publish('customer:logged', customer);
				console.log(customer);
				let confirmSMS = customer.confirmations.find(conf => conf.confirmation_type == 'SMS');
				console.log(confirmSMS);
				if(confirmSMS && !confirmSMS.state) {
					console.log('ir a confirmar sms');
					this.navController.setRoot(CreateUserPage, {
						isConfirmingSMS: true,
						customer: customer
					})
				} else {
					this.userDataService.setCustomer(customer);
					console.log(customer);
					this.navController.setRoot(FindWorkPage);
				}
			},  
			error => {
				this.authenticatingUser = false;
			}
		);
			
	}

	signUp(){
		this.navController.push(CreateUserPage, {
			CreateUserPage: false
		})
	}
}

