import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { CreditCard } from './../../models/credit-card';
import { Customer } from '../../models/user';
import { Address } from '../../models/address';
import { UserDataService } from '../../providers/user-data-service';
import { AddressService } from '../../providers/address-service';
import { PaymentService } from '../../providers/payment-service';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  customer: Customer;
  addresses: Address[];
  creditCard: CreditCard;

  constructor(public navCtrl: NavController, 
              private userDataService: UserDataService,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private addressService: AddressService,
              private paymentService: PaymentService,
              private zone: NgZone,
              public loadingCtrl: LoadingController)
  {
    this.customer = this.userDataService.getCustomer();
    console.log(this.customer)
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({spinner: 'crescent'});
    loader.present();
    this.paymentService.getCreditCard().subscribe(
      (card) => {
        this.creditCard = card;
        loader.dismiss();
      },
      (error) => {
        console.log(error);
        loader.dismiss();
      }
    )
    this.addressService.getCustomerAddresses().subscribe(
      addresses => {
        this.addresses = addresses;
      },
      error => {
        console.log(error);
      }
    )
  }

  editUser() {
    this.navCtrl.push('SettingsUserPage');
  }

  editPaymentMethod() {
    //TODO (a-santamaria): edit payment method
  }

  addPaymentMethod() {
    let modal = this.modalCtrl.create('PaymentMethodPage');
    modal.onDidDismiss( (card) => {
      if(card) this.creditCard = card.card;
    });

    modal.present();
  } 

  deletePaymentMethod() {
    let alert = this.alertCtrl.create({
      title: 'Confirmación',
      message: '¿Quieres eliminar la tarjeta terminda en ' + this.creditCard.lastFour + '?',
      buttons: [
        {
          text: 'Eliminar',
          handler: () => {
            this.paymentService.deleteCreditCard().subscribe(
              (status) => {
                this.creditCard = undefined;
              },
              (error) => {
                let toast = this.toastCtrl.create({
                  message: "Error, por favor intenta más tarde",
                  duration: 5000,
                  showCloseButton: true
                })
                toast.present();
              }
            )
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ]
    });
    alert.present();
  }

  newAddress() {
    // lazzy loading new address page
      let modal = this.modalCtrl.create('NewAddressPage');
      modal.onDidDismiss(
        (newAddress) => {
          if(newAddress) {
            this.addresses.push(newAddress);
          }
        }
      );
      modal.present();
  }

  deleteAddress() {
    // TODO(a-santamaria): delete address
    console.log('todo delte address');
  }

}
