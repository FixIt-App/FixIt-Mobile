import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

import { Work } from '../../models/work';
// import { WorkType } from '../../models/worktype';


@IonicPage()
@Component({
  selector: 'page-work-details',
  templateUrl: 'work-details.html',
})
export class WorkDetailsPage {

  work: Work;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
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

  cancelWork() {
    // TODO
    console.log('TODO');
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
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      },
       (error) => {
          alert("Scanning failed: " + error);
      });
  }

}
