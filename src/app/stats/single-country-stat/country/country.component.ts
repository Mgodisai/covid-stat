import { Component, Input, signal } from '@angular/core';
import { Country } from '../../models/country.model';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-country',
   standalone: true,
   imports: [NgbAccordionModule],
   templateUrl: './country.component.html',
   styleUrl: './country.component.scss',
})
export class CountryComponent {
   @Input() countryData?: Country;
}
