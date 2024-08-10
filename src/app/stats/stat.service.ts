import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';
import { VaccinationData } from './models/vaccination-data.model';
import { CovidStatistics } from './models/covid-statistic.model';
import { map } from 'rxjs/internal/operators/map';
import { Country } from './models/country.model';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { AVAILABLE_COUNTRIES } from './countries.constants';
import { StatData } from './models/stat-data.model';

@Injectable({
   providedIn: 'root',
})
export class StatService {
   private readonly BASE_URL = `${environment.baseUrl}`;
   private readonly CASE_ENDPOINT = '/cases';
   private readonly VACCINATION_ENDPOINT = '/vaccines';

   constructor(private readonly http: HttpClient) {}

   getVaccinationData(country: string): Observable<VaccinationData> {
      const params = new HttpParams().set('country', country.toLowerCase());
      return this.http
         .get<any>(`${this.BASE_URL}${this.VACCINATION_ENDPOINT}`, {
            params,
         })
         .pipe(
            map((response) => {
               const countryData: Country = {
                  country: response.country,
                  population: response.population,
                  sq_km_area: response.sq_km_area,
                  life_expectancy: response.life_expectancy,
                  elevation_in_meters: response.elevation_in_meters,
                  continent: response.continent,
                  abbreviation: response.abbreviation,
                  location: response.location,
                  iso: response.iso,
                  capital_city: response.capital_city,
                  lat: response.lat,
                  long: response.long,
               };
               const vaccinationData: VaccinationData = {
                  administered: response.administered,
                  people_vaccinated: response.people_vaccinated,
                  country_data: countryData,
                  updated: response.updated,
               };

               return vaccinationData;
            })
         );
   }

   getCovidStatistics(country: string): Observable<CovidStatistics> {
      const params = new HttpParams().set('country', country.toLowerCase());
      return this.http
         .get<any>(`${this.BASE_URL}${this.CASE_ENDPOINT}`, {
            params,
         })
         .pipe(
            map((response) => {
               const countryData: Country = {
                  country: response.country,
                  population: response.population,
                  sq_km_area: response.sq_km_area,
                  life_expectancy: response.life_expectancy,
                  elevation_in_meters: response.elevation_in_meters,
                  continent: response.continent,
                  abbreviation: response.abbreviation,
                  location: response.location,
                  iso: response.iso,
                  capital_city: response.capital_city,
                  lat: response.lat,
                  long: response.long,
               };

               const covidStatistics: CovidStatistics = {
                  confirmed: response.confirmed,
                  recovered: response.recovered,
                  deaths: response.deaths,
                  country_data: countryData,
                  updated: response.updated,
               };

               return covidStatistics;
            })
         );
   }

   getStatData(country: string): Observable<StatData> {
      return forkJoin({
         vaccinationData: this.getVaccinationData(country),
         covidStatistics: this.getCovidStatistics(country),
      }).pipe(
         map(
            ({ vaccinationData, covidStatistics }) =>
               new StatData(
                  vaccinationData.country_data.country,
                  this.getFlagByCountryName(
                     vaccinationData.country_data.country
                  ),
                  vaccinationData.country_data.population,
                  covidStatistics.confirmed,
                  covidStatistics.recovered,
                  covidStatistics.deaths,
                  vaccinationData.administered,
                  vaccinationData.people_vaccinated,
                  covidStatistics.updated
               )
         )
      );
   }

   private getFlagByCountryName(country: string): string {
      return AVAILABLE_COUNTRIES.find((c) => c.name === country)?.flag || '';
   }
}
