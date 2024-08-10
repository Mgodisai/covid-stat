import { Country } from './country.model';

export interface VaccinationData {
   administered: number;
   people_vaccinated: number;
   country_data: Country;
   updated: Date;
}
