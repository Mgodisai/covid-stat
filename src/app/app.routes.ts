import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { noauthGuard } from './auth/noauth.guard';
import { NotFoundComponent } from './core/not-found/not-found.component';

export const routes: Routes = [
   { path: '', component: HomeComponent },
   { path: 'login', component: LoginComponent, canActivate: [noauthGuard] },
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
   { path: '**', component: NotFoundComponent },
];
