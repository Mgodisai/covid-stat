import { Component, computed, Signal, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
   selector: 'app-header',
   standalone: true,
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
   userData = computed(() => {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser() === undefined) {
         return { username: 'guest', email: '' };
      } else {
         return {
            username: currentUser()?.username,
            email: currentUser()?.email,
         };
      }
   });
   isLoggedIn = computed(() => this.authService.isAuthenticated());

   constructor(
      private readonly authService: AuthService,
      private readonly router: Router
   ) {}

   login(): void {
      this.router.navigate(['/login']);
   }

   logout(): void {
      this.authService
         .logout()
         .pipe(tap(() => console.log('User logged out')))
         .subscribe();
   }

   register(): void {
      this.router.navigate(['/registration']);
   }
}
