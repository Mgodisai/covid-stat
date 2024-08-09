import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const noauthGuard: CanActivateFn = (route, state) => {
   const authService = inject(AuthService);
   const router = inject(Router);

   if (authService.isAuthenticated()) {
      router.navigate(['/']);
      return false;
   }
   return true;
};
