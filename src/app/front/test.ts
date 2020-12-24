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

  ngOnInit(): void {

    const data = { text: 'Delhi', city: 'Delhi'};
    const url =  "https://staging.wedwe.com/api/users/simple-search";

    let dataLongitude = new Array();
    let dataLatitude = new Array();
    var length = 0;



    const fetchData = async () => {
      const response = await fetch(url, {
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
        }
      }).catch((error)=>{
          console.log(error);
      });
    }

    fetchData();

    const mapProperties = {
      center: new google.maps.LatLng(28.59506, 77.17081),
      zoom: 14,
    };
    this.map = new google.maps.Map(this.mapTag.nativeElement, mapProperties);




    for(let i =0; i<length; i++){

      const info = new google.maps.InfoWindow({
        // content : `<Strong>`+i.content+`</Strong>`,
        content : 'Hello',
      });
      console.log(dataLatitude[i]);

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
