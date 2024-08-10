import { Route } from '@angular/router';
import { StatComponent } from './stat/stat.component';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { SingleCountryStatComponent } from './single-country-stat/single-country-stat.component';
import { CountryComponent } from './single-country-stat/country/country.component';
import { ChartComponent } from './chart/chart.component';

export const routes: Route[] = [
   {
      path: '',
      component: StatComponent,
   },
   {
      path: 'single-country',
      component: SingleCountryStatComponent,
   },
   {
      path: 'charts',
      component: ChartComponent,
   },
];
