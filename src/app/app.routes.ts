import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { noauthGuard } from './auth/noauth.guard';

export const routes: Routes = [
   { path: 'login', component: LoginComponent },

   { path: '', component: HomeComponent },
   {
      path: 'registration',
      component: RegistrationComponent,
      canActivate: [noauthGuard],
   },
   {
      path: 'stats',
      canActivate: [authGuard],
      loadChildren: () => import('./stats/stats.routes').then((m) => m.routes),
   },
];
