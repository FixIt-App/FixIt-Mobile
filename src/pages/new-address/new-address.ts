import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Geolocation } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-new-address',
  templateUrl: 'new-address.html'
})
export class NewAddressPage {

  // trackTypes: any[] = [
  //   { name: 'Avenida', abbreviation: 'AV' },
  //   { name: 'Avenida Calle', abbreviation: 'AV CLL' },
  //   { name: 'Avenida Carrera', abbreviation: 'AV CR' },
  //   { name: 'Calle', abbreviation: 'CLL' },
  //   { name: 'Carrera', abbreviation: 'CR' },
  //   { name: 'Circular', abbreviation: 'CQ' },
  //   { name: 'Circunvalar', abbreviation: 'CV' },
  //   { name: 'Diagonal', abbreviation: 'DG' },
  //   { name: 'Manzana', abbreviation: 'MZ' },
  //   { name: 'Transversal', abbreviation: 'TR' },
  //   { name: 'Vía', abbreviation: 'VIA' }
  // ];

  trackTypes: string[] = [
    'Avenida',
    'Avenida Calle',
    'Avenida Carrera',
    'Calle',
    'Carrera',
    'Circular',
    'Circunvalar',
    'Diagonal',
    'Manzana',
    'Transversal',
    'Vía'
  ];

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('locationIcon') locationIcon: ElementRef;
  map: any;

  trackType: AbstractControl;
  trackNumber: AbstractControl;
  genNumber: AbstractControl;
  placaNumber: AbstractControl;
  form: FormGroup;
  mapLoaded: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private viewCtrl: ViewController) 
  {
    
    this.form = this.formBuilder.group({
        trackType:   ['', Validators.compose([Validators.required])],
        trackNumber: ['', Validators.compose([Validators.required])],
        genNumber:   ['', Validators.compose([Validators.required])],
        placaNumber: ['', Validators.compose([Validators.required])],
      });
    this.form.patchValue({ 'trackType' : 'Calle'});
    this.trackType = this.form.controls['trackType'];
    this.trackNumber = this.form.controls['trackNumber'];
    this.genNumber = this.form.controls['genNumber'];
    this.placaNumber = this.form.controls['placaNumber'];
    this.mapLoaded = false;
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    Geolocation.getCurrentPosition().then(
      (position) => {
 
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
    
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.mapLoaded = true;
        this.setMarker();
      }, 
      (err) => {
        console.log(err);
      });
  }

  setMarker() {
    var offsetT = this.mapElement.nativeElement.offsetTop;
    var offsetL = this.mapElement.nativeElement.offsetLeft;
    var divHeight = this.mapElement.nativeElement.offsetHeight / 2;
    var divWidth = this.mapElement.nativeElement.offsetWidth / 2;
    
    var iconHeight = this.locationIcon.nativeElement.offsetHeight;
    var iconWidth = this.locationIcon.nativeElement.offsetWidth;
  
    this.locationIcon.nativeElement.style.top = - (divHeight + (iconHeight)) + "px";
    this.locationIcon.nativeElement.style.left = (divWidth - (iconWidth/2)) +  "px";
  }
  
  addMarker() {
 
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
  
    let content = "<h4>Information!</h4>";          
  
    this.addInfoWindow(marker, content);
    let pos = this.map.getCenter();
    console.log(pos.lat);
    console.log(pos.lng);
    this.getGeoLocation(pos.lat(), pos.lng());
  
  }

  getGeoLocation(lat: number, lng: number) {
    if (navigator.geolocation) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        let request = { latLng: latlng };
        console.log('voy a llamar geolocation');
        console.log(lat + ' ' + lng);
        geocoder.geocode(request, 
        (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            let result = results[0];
            console.log(result);
            let rsltAdrComponent = result.address_components;
            let resultLength = rsltAdrComponent.length;
            if (result != null) {
              console.log(rsltAdrComponent);
              console.log(rsltAdrComponent[0].long_name);
              console.log(rsltAdrComponent[1].long_name);
            } else {
              alert("No address available!");
            }
          }
        });
    }
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
      console.log('es valido');
    } else {
      console.log('fuck');
    }
  }

   dismiss() {
    this.viewCtrl.dismiss();
  }

}
