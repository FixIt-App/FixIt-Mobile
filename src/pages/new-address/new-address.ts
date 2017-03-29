import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Geolocation } from 'ionic-native';

import { AddressService } from '../../providers/address-service';
import { Address } from '../../models/address';

declare var google;

@Component({
  selector: 'page-new-address',
  templateUrl: 'new-address.html'
})
export class NewAddressPage {

  cities: string[] = [
    'Bogotá, Colombia',
    'Chia, Colombia',
  ]

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('locationIcon') locationIcon: ElementRef;
  map: any;
  streetType: AbstractControl;
  streetNumber: AbstractControl;
  genNumber: AbstractControl;
  placaNumber: AbstractControl;

  address: AbstractControl;
  address2: AbstractControl;
  location: AbstractControl;
  currentMarker: any;

  form: FormGroup;
  mapLoaded: boolean;
  geocoder: any;
  center: any;
  submitAttempt: boolean;
  city: string;
  country: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private formBuilder: FormBuilder,
              private viewCtrl: ViewController,
              private ngZone: NgZone,
              private addressService: AddressService)
  {
    this.form = this.formBuilder.group({
        address:   ['', Validators.compose([Validators.required])],
        address2:   [''],
        location: ['', Validators.compose([Validators.required])]
      });
    this.address = this.form.controls['address'];
    this.address2 = this.form.controls['address2'];
    this.location = this.form.controls['location'];
    this.form.patchValue({ 'location' : this.cities[0]});
    console.log(this.location.value);
    this.mapLoaded = false;
    this.geocoder = new google.maps.Geocoder();
    this.form.valueChanges
             .debounceTime(600)
             .distinctUntilChanged()
             .skip(1)
             .subscribe(() => this.getLocByAddres());
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.geocoder.geocode({address: 'Bogotá'},
      (position) => {
        let latLng = new google.maps.LatLng(position[0].geometry.location.lat(), position[0].geometry.location.lng());
        this.center = latLng;

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        }
    
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.mapLoaded = true;
      });
  }

  setMarker(position) {
    if(this.currentMarker)
      this.currentMarker.setMap(null);
    this.currentMarker = new google.maps.Marker({
      position: position,
      map: this.map
    });
  }

  setMarkerIcon() {
    var divHeight = this.mapElement.nativeElement.offsetHeight / 2;
    var divWidth = this.mapElement.nativeElement.offsetWidth / 2;
    
    var iconHeight = this.locationIcon.nativeElement.offsetHeight;
    var iconWidth = this.locationIcon.nativeElement.offsetWidth;
  
    this.locationIcon.nativeElement.style.top = - (divHeight + (iconHeight)) + "px";
    this.locationIcon.nativeElement.style.left = (divWidth - (iconWidth/2)) +  "px";
  }
  
  getCenterGeocode() {
    let pos = this.map.getCenter();
    console.log(pos.lat);
    console.log(pos.lng);
    this.getGeocode(pos.lat(), pos.lng());
  
  }

  getLocByAddres() {
    this.geocoder.geocode({address: this.address.value + this.location.value},
      (results, status) => {
        console.log(status);
        console.log(results);
        if (status == google.maps.GeocoderStatus.OK && results && results.length > 0) {
          console.log(results);
          console.log(results[0].geometry.location);
          this.map.setCenter(results[0].geometry.location);
          this.setMarker(results[0].geometry.location);
        }
      }
     );
  }

  getGeocode(lat: number, lng: number) {
    if (navigator.geolocation) {
        let latlng = new google.maps.LatLng(lat, lng);
        let request = { latLng: latlng };
        this.geocoder.geocode(request,
          (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              let result = results[0];
              let rsltAdrComponent = result.address_components;
              if (result != null) {
                let addressString: string[] = result.formatted_address.split(',');

                /**
                //  * force anglar to rerender values
                //  * this has to be done since map listener is not registered
                //  */
                let address = addressString[0].split(' a ');
                this.ngZone.run(() => this.address.setValue(address[0]));

                let currCity = addressString.slice(1,addressString.length).map(value => value.trim() ).join(", ");
                if(this.cities.indexOf(currCity) == -1) {
                  this.cities.push(currCity);
                }
                this.ngZone.run(() => this.location.setValue(currCity));
              } else {
                alert("No address available!");
              }
            }
          });
    }
  }

  centerToLocation() {
      this.map.panTo(this.center);
      // console.log(this.center);
      this.getGeocode(this.center.lat(), this.center.lng());
  }

  addInfoWindow(marker, content) {
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
 


  saveAddress() {
    if(this.form.valid) {
      let alert = this.alertCtrl.create();
      alert.setTitle('Nombre corto');

      alert.addInput({
        type: 'radio',
        label: 'Casa',
        value: 'Casa',
      });

      alert.addInput({
        type: 'radio',
        label: 'Apto',
        value: 'Apto',
      });

      alert.addInput({
        type: 'radio',
        label: 'Trabajo',
        value: 'Trabajo',
      });

      alert.addInput({
        type: 'radio',
        label: 'Otro',
        value: 'Otro',
      });

      alert.addButton('Cancel');
      alert.addButton({
        text: 'OK',
        handler: data => {
          if(data == 'Otro') {
            let alert2 = this.alertCtrl.create( {
              title: 'Nombre corto',
              inputs: [
                {
                  name: 'name',
                  placeholder: 'nombre'
                },
              ]
            });
            alert2.addButton('Cancel');
            alert2.addButton({
              text: 'OK',
              handler: data => {
                this.sendAddressToServer(data.name);
              }
            });
            alert2.setTitle('Nombre corto');
            alert2.present();
          } else {
            this.sendAddressToServer(data);
          }
        }
      });
      alert.present();
    } else {
      this.submitAttempt = true;
    }
  }

  sendAddressToServer(shortName: string) {
    let loader = this.loadingCtrl.create({content: "Please wait..."});
    loader.present();
    let vals: string[] = this.location.value.split(', ');
    let city: string = vals[0].trim();
    let country: string = vals[1].trim();
    this.addressService.addCustomerAddress(
      new Address({
        name: shortName,
        address: this.address.value + ' ' + this.address2.value,
        city: city,
        country: country
      })).subscribe(
        (newAddress) => {
          console.log(newAddress);
          this.viewCtrl.dismiss(newAddress);
          loader.dismiss();
        },
        (error) => {
          console.log(error);
          let toast = this.toastCtrl.create({
             message: 'Error, por favor intenta mas tarde.',
             duration: 4000,
             showCloseButton: true,
          });
          loader.dismiss();
        }
      )
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
