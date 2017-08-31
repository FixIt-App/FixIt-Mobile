import { CreateUserPage } from './../create-user/create-user';
import { CreditCard } from './../../models/credit-card';
import { Component,  QueryList } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, Content, Platform, LoadingController, Loading, AlertController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { ViewChild, ViewChildren } from '@angular/core';
import { Slides } from 'ionic-angular';

import { Work } from '../../models/work';
import { Address } from '../../models/address';
import { AddressService } from '../../providers/address-service';
import { WorkService } from '../../providers/work-service';
import { PaymentService } from '../../providers/payment-service';
import { FormatDayOfWeekPipe } from "../../pipes/format-day-of-week-pipe";
import { FormatMonthPipe } from "../../pipes/format-month-pipe";
import { FormatTimePipe } from "../../pipes/format-time";

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

  work: Work;
  minDate: string;
  maxDate: string;
  today: Date;
  addresses: Address[];
  selectedAddress: Address;
  dynamicPrice: any;
  creditCard: CreditCard;
  loader: Loading;

  @ViewChild(Content) content: Content;
  @ViewChildren(Slides) slides: QueryList<Slides>;

  constructor(private navController: NavController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private datePicker: DatePicker,
              private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private workService: WorkService,
              private addressService: AddressService,
              private paymentService: PaymentService,
              private formatDayOfWeekPipe: FormatDayOfWeekPipe,
              private formatMonthPipe: FormatMonthPipe,
              private formatTimePipe: FormatTimePipe,
              private platform: Platform)
  {
    this.work = navParams.get('work');
    this.today = new Date();
    this.minDate = `${this.today.getFullYear()}-${this.today.getMonth()}-${this.today.getDate()}`
    this.maxDate = `${this.today.getFullYear()+1}`;
  }

  ionViewDidLoad() {
    this.addressService.getCustomerAddresses().subscribe(
      data => {
        console.log('acabe');
        console.log(data);
        this.addresses = data;
        if(this.addresses && this.addresses.length > 0) {
          this.selectedAddress = this.addresses[0];
          this.addresses[0].selected = true;
          this.work.address = this.selectedAddress;
        } else {
          // need new address
        }
        this.initializeSlides();
      },
      error => {
        console.log(error);
      }
    )
  }

  needItNow() {
    this.work.date = new Date();
    this.work.asap = true;
    this.getDynamicPrice();
  }

  editDate() {
    // this.dynamicPrice = undefined;
    if(this.work.asap) {
      this.work.asap = false;
      this.work.date = undefined;
    }
    this.makeDate();
  }

  getDynamicPrice() {
    this.workService.dynamicPrice(this.work).subscribe(
      (data) => {
        console.log("dynamicPrice");
        console.log(data);
        this.dynamicPrice = data;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  makeDate() {
    let options = {
      date: new Date(),
      mode: 'datetime',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
      minDate: new Date()
    }

    this.datePicker.show(options).then(
      date => {
          this.work.date = date;
          this.getDynamicPrice();
      },
      error => {
          console.log('Error: ' + error);
      });
  }

  newAddress() {
      let modal = this.modalCtrl.create('NewAddressPage');
      modal.onDidDismiss(
        (newAddress) => {
          if(newAddress) {
            this.addresses.push(newAddress);
            this.addresses.map(address => address.selected = false);
            this.selectedAddress = this.addresses[this.addresses.length-1]
            this.addresses[this.addresses.length-1].selected = true;
          }
        }
      );
      modal.present();
  }

  addPaymentMethod() {
      let modal = this.modalCtrl.create('PaymentMethodPage', {orderingWork: true});
      modal.onDidDismiss( (card) => {
        if(card) this.creditCard = card.card;
      });
      modal.present();
  }

  preSendWork() {
    this.loader = this.loadingCtrl.create({spinner: 'crescent'});
    this.loader.present();

    let msg = "Sólo puedes cancelar 12 horas antes de la hora agendada, de lo contrario se cobrará una tarifa de cancelación.";
    if (this.work.asap) {
      msg = "¿Estás seguro de pedir este trabajo lo más pronto posible? Recuerda que si cancelas se cobrará una tarifa de cancelación."
    }
    let confirmAlert = this.alertCtrl.create({
      title: "¿Pedir trabajo para el " + 
              this.formatDayOfWeekPipe.transform(this.work.date) +
              " " + this.work.date.getDate() + " de " +
              this.formatMonthPipe.transform(this.work.date) +
              (!this.work.asap ? " " + this.formatTimePipe.transform(this.work.date) : "") + "?",
      message: msg,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.loader.dismiss();
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.sendWork();
            this.loader.dismiss();
          }
        }
      ]
    })

    if (this.creditCard) {
      console.log('ya tegnto credit card');
      confirmAlert.present();
    } else {
      this.paymentService.getCreditCard().subscribe(
        (card) => {
          console.log(card);
          confirmAlert.present();
        },
        (error) => {
          console.log(error);
          if (error.status == 404) {
            this.loader.dismiss();
            this.addPaymentMethod();
          } else {
            let alert = this.alertCtrl.create({
              title: "Error",
              message: "Por favor intenta más tarde",
              buttons: ['Ok'] 
            })
            alert.present();
          }
        }
      )
    }
  }

  sendWork() {
    this.work.address = this.selectedAddress;
    this.workService.createWork(this.work).subscribe(
      (work) => {
        //TODO (a-santamaria): el need it now deberia guardarse en el servidor
        let asap = this.work.asap;
        this.work = work;
        this.work.asap = asap;
        this.loader.dismiss();
        this.navController.setRoot('WorkDetailsPage', {
          work: this.work
        });
      },
      (error) => {
        console.log(error);
        this.loader.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Error, por favor intenta más tarde',
          duration: 3000,
          showCloseButton: true,
          closeButtonText: 'Cerrar'
        });
        toast.present();
      }
    )
  }
  
  initializeSlides() {
    this.slides.changes.subscribe(
      (slides: QueryList<Slides>) => {
        slides.map(
          (slide) => {
            if(this.platform.width() > 700)
              slide.slidesPerView = 5;
            else
              slide.slidesPerView = 3;
            //slide.pager = true;
            slide.paginationType = 'bullets';
            // slide.freeMode = true;
          });
      }
    )
  }

  selectAddress(address: Address) {
    this.addresses.map(address => address.selected = false);
    address.selected = true;
    this.work.address = address;
    this.selectedAddress = address;
  }

  goBack(){
    this.navController.pop();
  }
}
