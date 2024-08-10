import { Component, DestroyRef, signal } from '@angular/core';
import { StatService } from '../stat.service';
import { VaccinationData } from '../models/vaccination-data.model';
import { AVAILABLE_COUNTRIES } from '../countries.constants';
import { CommonModule } from '@angular/common';
import { CountryComponent } from './country/country.component';
import { CovidStatistics } from '../models/covid-statistic.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
   selector: 'app-single-country-stat',
   standalone: true,
   imports: [CommonModule, CountryComponent],
   templateUrl: './single-country-stat.component.html',
   styleUrl: './single-country-stat.component.scss',
})
export class SingleCountryStatComponent {
   countries: { name: string; flag: string }[] = [];
   selectedCountry = signal<string>('');
   vaccinationData = signal<VaccinationData | undefined>(undefined);
   covidStatistics = signal<CovidStatistics | undefined>(undefined);

   errorMessage = signal<string | undefined>(undefined);

   constructor(
      private readonly statService: StatService,
      private readonly destroyRef: DestroyRef
   ) {
      this.countries = AVAILABLE_COUNTRIES;
   }

   onCountrySelect(event: Event) {
      const selectedValue = (event.target as HTMLSelectElement).value;
      this.selectedCountry.set(selectedValue);

      this.errorMessage.set(undefined);
      this.vaccinationData.set(undefined);
      this.covidStatistics.set(undefined);

      if (selectedValue) {
         this.loadVaccinationData(selectedValue);
         this.loadCovidStatistics(selectedValue);
      }
   }

   loadVaccinationData(country: string) {
      this.statService
         .getVaccinationData(country)
         .pipe(takeUntilDestroyed(this.destroyRef))
         .subscribe({
            next: (data) => this.vaccinationData.set(data),
            error: (error: Error) => this.errorMessage.set(error.message),
         });
   }

   loadCovidStatistics(country: string) {
      this.statService
         .getCovidStatistics(country)
         .pipe(takeUntilDestroyed(this.destroyRef))
         .subscribe({
            next: (data) => this.covidStatistics.set(data),
            error: (error: Error) => this.errorMessage.set(error.message),
         });
   }
}
