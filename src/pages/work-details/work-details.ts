import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

import { Work } from '../../models/work';
import { WorkService } from "../../providers/work-service";

@IonicPage()
@Component({
  selector: 'page-work-details',
  templateUrl: 'work-details.html',
})
export class WorkDetailsPage {

  work: Work;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private workService: WorkService,
              private alertCtrl: AlertController,
              private actionSheetCtrl: ActionSheetController,
              private barcodeScanner: BarcodeScanner) 
  {
    this.work = navParams.get('work');
  }


  ionViewDidLoad() {
    
  }

  callWorker() {
    window.open("tel:" + this.work.worker.phone);
  }

  goToDescription() {
    this.navCtrl.push('WorkDescriptionPage', {
      work: this.work
    })
  }

  help() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ayuda',
      buttons: [
        {
          text: 'Contáctanos',
          icon: 'call',
          handler: () => {
            // todo (a-santamria)
            console.log('todo contactanos');
          }
        },
        {
          text: 'Cancelar trabajo',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            // todo (a-santamria)
            console.log('todo cancel');
          }
        },
      ]
    });
    actionSheet.present();
  }

  registerQR() {
    let options: BarcodeScannerOptions =  {
      preferFrontCamera : false, // iOS and Android
      showFlipCameraButton : false, // iOS and Android
      showTorchButton : false, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      prompt : "Escanea el código del trabajador dentro del area", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
      orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations : true, // iOS
      disableSuccessBeep: true // iOS
    };
    this.barcodeScanner.scan(options).then(
      (result) => {
        console.log(result);
        this.workService.confirmWorker(result.text, this.work).subscribe(
          (work) => {
            this.work = work;
             let alert = this.alertCtrl.create({
              title: '¡Identidad confirmada!',
              subTitle: 'La identidad de trabajador fue confirmada exitosamente',
              buttons: ['Listo']
            });
            alert.present();
          },
          (error) => {
            console.log(error);
            let msg: string = "Error al confiramr la identidad del trabajador";
            if (error.status == 409) {
              msg = "Error al confiramr la identidad del trabajador";
            } else {
              "Error inesperado, por favor intenta mas tarde";
            }
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: msg,
              buttons: ['OK']
            });
            alert.present();
          }
        );
      },
       (error) => {
          alert("Scanning failed: " + error);
      });
  }

}
