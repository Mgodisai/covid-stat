import { Component, computed, effect, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth/auth.service';

@Component({
   selector: 'app-menu',
   standalone: true,
   imports: [NgbNavModule, RouterLink, RouterLinkActive],
   templateUrl: './menu.component.html',
   styleUrl: './menu.component.scss',
})
export class MenuComponent {
   menuItems = [
      { id: 1, name: 'Home', url: '', requiresAuth: false },
      { id: 2, name: 'Stats', url: 'stats', requiresAuth: true },
      { id: 3, name: 'Charts', url: 'stats/charts', requiresAuth: true },
      {
         id: 4,
         name: 'Single Country data',
         url: 'stats/single-country',
         requiresAuth: true,
      },
      { id: 5, name: 'Unknown', url: '/sadf', requiresAuth: false },
   ];

   activeId = signal(this.menuItems[0].id);
   isLoggedIn = computed(() => this.authService.isAuthenticated());

   constructor(private readonly authService: AuthService) {
      effect(() => {
         console.log(`The active id is: ${this.activeId()}`);
      });
   }

   shouldDisplayMenuItem(item: any) {
      return !item.requiresAuth || this.isLoggedIn();
   }
}
