import { Component } from '@angular/core';
import { NavController, Events, LoadingController, Loading } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { FindWorkPage } from '../findwork/findwork';
import { CreateUserPage } from '../create-user/create-user'

import { AuthService } from '../../providers/auth-service';
import { UserDataService } from '../../providers/user-data-service';
import { SERVER_URL } from '../../providers/services.util';
import { ConfirmationService } from '../../providers/confirmation-service';
import { WorkTypeService } from '../../providers/wortktype-service'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

	username: string;
	password: string;
	authenticatingUser: boolean;
	passwordType: string;
	loader: Loading;

	constructor(private navController: NavController,
							private authService: AuthService,
							public alertCtrl: AlertController,
							public events: Events,
							public userDataService: UserDataService,
							private workTypeService: WorkTypeService,
							public confirmationService: ConfirmationService,
							public loadingCtrl: LoadingController)
	{
		this.authenticatingUser = true;
		this.passwordType = "password";
	}


	ionViewDidLoad() {
		if(localStorage.getItem('token')) {
			this.authenticatingUser = true;
			this.getAuthenticatedCustomer();
		} else {
			this.authenticatingUser = false;
		}
	}

	login() {
		this.presentLoader();
		this.authService.login(this.username, this.password).subscribe(
			token => {
				console.log(token);
				localStorage.setItem('token', token);
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
				this.dismissLoader();
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

					this.workTypeService.getWorkTypes().subscribe(
						categories => {
							this.navController.setRoot(FindWorkPage, { categories: categories.reverse() });
						},
						error => {
							console.log(error);
						});
					
				}
				this.dismissLoader();
			},  
			error => {
				this.authenticatingUser = false;
				this.dismissLoader();
			}
		);
			
	}

	signUp(){
		this.navController.push(CreateUserPage, {
			CreateUserPage: false
		})
	}

	togglePassword() {
		console.log('hola');
		this.passwordType = (this.passwordType == "text") ? "password" : "text";
	}

	presentLoader() {
		this.loader = this.loadingCtrl.create({spinner: 'crescent'});
    	this.loader.present();
	}

	dismissLoader() {
		if(this.loader) {
			this.loader.dismiss();
		}
	}
}

