import { Country } from './country.model';

export interface CovidStatistics {
   confirmed: number;
   recovered: number;
   deaths: number;
   country_data: Country;
   updated: Date;
}
