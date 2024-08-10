import { Component, Input, signal } from '@angular/core';
import { Country } from '../../models/country.model';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';

@Component({
   selector: 'app-country',
   standalone: true,
   imports: [NgbAccordionModule, GoogleMapsModule, MapAdvancedMarker],
   templateUrl: './country.component.html',
   styleUrl: './country.component.scss',
})
export class CountryComponent {
   @Input() countryData?: Country;
   latlng = signal({ lat: 0, lng: 0 });

   options: google.maps.MapOptions = {
      mapId: 'MAP_ID',
      center: this.latlng(),
      zoom: 6,
   };

   ngOnInit(): void {
      this.updateLatLng();
   }

   updateLatLng(): void {
      if (this.countryData) {
         this.latlng.set({
            lat: parseFloat(this.countryData.lat),
            lng: parseFloat(this.countryData.long),
         });

         this.options = {
            ...this.options,
            center: this.latlng(),
         };
      }
   }
}
