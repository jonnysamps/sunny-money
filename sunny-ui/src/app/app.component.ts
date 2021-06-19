import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewRef } from '@angular/core';
import {} from 'google.maps'; // bologna required google maps to pla

/** Main screen of the application */
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
  tilt: number = 0;
  orientation: number = 0;

  constructor(private zone: NgZone){}

  ngOnInit() {
    /**
     * Google maps javascript SDK automatically calls this function when it has completed
     * loading itself and its dependencies into the browser.
     */
    (<any>window).initMap = () => {
      // Initialize the map
      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15
      });

      // Initialize the location search widget
      this.autoComplete = new google.maps.places.Autocomplete(
        document.getElementById("search") as HTMLInputElement, {
          types: ['geocode']
        });
      this.autoComplete.addListener('place_changed', () => {
        const place = this.autoComplete.getPlace(); 
        this.map.setCenter({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})
      });

      // Initialize the drawingManager to allow the user to draw polygons on the map
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
          draggable: true
        }
      });
      drawingManager.setMap(this.map);
      drawingManager.addListener('polygoncomplete', (polygon: google.maps.Polygon) => {
        // This callback happens outside of Angular change detection so we need to 
        // alert Angular that a change is occurring.
        this.zone.run(() => this.polygons.push(polygon));
      });
    }

    // Load google maps SDK. This is a weird way to load a lib given we have 
    // webpack here but this is the method that google demands.
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places,visualization,drawing&key=AIzaSyB8m6A-C2oH_EDAL5oHu_nv8dxF6udXpJY&v=weekly&callback=initMap';
    script.async = true;
    document.head.appendChild(script);
  }

  getArea() {
    return this.polygons.reduce((result, p) => {
      // Use the google maps area computation because its convenient.
      const area = google.maps.geometry.spherical.computeArea(p.getPath());
      return area + result;
    }, 0)
  }


  cos(degree: number) {
    return Math.cos(degree * Math.PI / 180);
  }

  sin(degree: number) {
    return Math.sin(degree * Math.PI / 180);
  }
}
