import { Component, computed, input, signal } from '@angular/core';
import { Country } from '../../models/country.model';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

@Component({
   selector: 'app-country',
   standalone: true,
   imports: [
      NgbAccordionModule,
      GoogleMapsModule,
      MapAdvancedMarker,
      CommonModule,
   ],
   templateUrl: './country.component.html',
   styleUrl: './country.component.scss',
})
export class CountryComponent {
   countryData = input<Country | undefined>(undefined);
   latlng = computed(() => {
      return this.countryData()
         ? {
              lat: parseFloat(this.countryData()!.lat),
              lng: parseFloat(this.countryData()!.long),
           }
         : { lat: 0, lng: 0 };
   });

   options = computed<google.maps.MapOptions>(() => {
      return {
         mapId: 'MAP_ID',
         center: this.latlng(),
         zoom: 6,
      };
   });
}
