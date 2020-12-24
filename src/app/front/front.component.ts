import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Data } from '../locationData';


@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})

export class FrontComponent implements OnInit {

  @ViewChild('map', {static: true}) mapTag: any;
  map: google.maps.Map | any;
  markers: any=[];


  constructor() { }

  async ngOnInit(): Promise<void> {

    const data = { text: 'Delhi', city: 'Delhi'};
    const url =  "https://staging.wedwe.com/api/users/simple-search";

    let dataLongitude = new Array();
    let dataLatitude = new Array();
    let address = new Array();
    let hotelName = new Array();
    let length :number = 0;




    const fetchData = async () => {
      await fetch(url, {
        method : 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) => {

        length = data.data.search.data.length;

        for(let i=0; i<length; i++){
          if(data.data.search.data[i].address.location){
            dataLongitude[i] = (data.data.search.data[i].address.location.coordinates[0]);
            dataLatitude[i] = (data.data.search.data[i].address.location.coordinates[1]);
          }
          var hotelLocation = data.data.search.data[i].address;
          hotelName[i] = data.data.search.data[i].businessName;
          if(hotelLocation){
            let add : string = "";

            if(hotelLocation.street !== ''){
              add += `<strong> ${hotelLocation.street}, </strong>`;
            }
            if(hotelLocation.street.city){
              add += ` ${hotelLocation.street.city},`;
            }
            if(hotelLocation.street.state){
              add += ` ${hotelLocation.street.state},`;
            }
            address[i] = add;

          }
        }
      }).catch((error)=>{
          console.log(error);
      });
    }

    await fetchData();


    console.log(length);

    const mapProperties = {
      center: new google.maps.LatLng(28.59506, 77.17081),
      zoom: 14,
    };
    this.map = new google.maps.Map(this.mapTag.nativeElement, mapProperties);


    for(let i =0; i<length; i++){

      const info = new google.maps.InfoWindow({
        // content : `<Strong>`+i.content+`</Strong>`,
        content : `<h3>`+hotelName[i]+`</h3><br/>`+address[i],
      });
      // console.log(dataLatitude[i]);

      const markerOptions = {
        position: new google.maps.LatLng(dataLatitude[i], dataLongitude[i]) ,
        map : this.map,
        infoWindow : info,
      }

      const marker = new google.maps.Marker(markerOptions);

      this.markers.push(marker);

      marker.addListener('click', () =>{
        deleteAll(this.map);
        info.open(this.map, marker);
      });

   }

    const deleteAll = (a: any) =>{
      for(let i of this.markers){
        i.infoWindow.close();
      }
    }
  }


}

