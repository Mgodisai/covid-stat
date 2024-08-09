import { Route } from '@angular/router';
import { StatComponent } from './stat/stat.component';
import { RegistrationComponent } from '../auth/registration/registration.component';

export const routes: Route[] = [
   {
      path: '',
      component: StatComponent,
   },
   {
      path: 'cases',
      component: StatComponent,
   },
   {
      path: 'vaccines',
      component: StatComponent,
   },
];
