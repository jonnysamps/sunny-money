import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewRef } from '@angular/core';
import {} from 'google.maps'; // bologna required google maps to pla

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sunny-ui';
  map!: google.maps.Map;
  autoComplete!: google.maps.places.Autocomplete;
  polygons: google.maps.Polygon[] = [];

  constructor(private zone: NgZone){}

  ngOnInit() {
    (<any>window).initMap = () => {
      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 10
      });
      this.autoComplete = new google.maps.places.Autocomplete(
        document.getElementById("search") as HTMLInputElement, {
          types: ['geocode']
        });
      
      this.autoComplete.addListener('place_changed', () => {
        const place = this.autoComplete.getPlace(); 
        this.map.setCenter({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})
      });

      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
          ],
          
        },
        polygonOptions: {
          draggable: true,
          editable: true
        }
      });
      drawingManager.setMap(this.map);
      drawingManager.addListener('polygoncomplete', (polygon: google.maps.Polygon) => {
        this.zone.run(() => this.polygons.push(polygon));
        console.log('polygon complete');
        console.log(polygon);
      });
    }
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places,visualization,drawing&key=AIzaSyB8m6A-C2oH_EDAL5oHu_nv8dxF6udXpJY&v=weekly&callback=initMap';
    script.async = true;
    document.head.appendChild(script);
  }

  getArea() {
    return this.polygons.reduce((result, p) => {
      const area = google.maps.geometry.spherical.computeArea(p.getPath());
      return area + result;
    }, 0)
  }
}
