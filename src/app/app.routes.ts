import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './auth/registration/registration.component';

export const routes: Routes = [
   { path: 'login', component: LoginComponent },
   { path: 'registration', component: RegistrationComponent },
   { path: '', component: HomeComponent },
   {
      path: 'stats',
      canActivate: [authGuard],
      loadChildren: () => import('./stats/stats.routes').then((m) => m.routes),
   },
];
