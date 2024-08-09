import { computed, effect, Injectable, signal } from '@angular/core';
import { User } from './models/user.model';
import { UserRepository } from './user.repository';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
   providedIn: 'root',
})
export class AuthService {
   private readonly CURRENT_USER_KEY = 'currentUser';
   private readonly _currentUser = signal<User | undefined>(
      this.getCurrentUserFromStorage()
   );

   constructor(
      private readonly userRepository: UserRepository,
      private readonly router: Router
   ) {
      effect(() => {
         console.log('current user changed:', this._currentUser());
      });
   }

   isAuthenticated = computed(() => this._currentUser() !== undefined);

   login(username: string, password: string): Observable<boolean> {
      const validatedUser = this.userRepository.validateUser(
         username,
         password
      );

      if (validatedUser) {
         return of(true).pipe(
            tap(() => {
               this._currentUser.set(validatedUser);
               this.storeCurrentUser(validatedUser);
               console.log('User logged in');
               console.log('Current user:', this._currentUser());
               console.log('Is authenticated:', this.isAuthenticated());
               this.router.navigate(['']);
            })
         );
      } else {
         console.log('Invalid username or password');
         return of(false);
      }
   }

   logout(): Observable<object> {
      return new Observable((o) => {
         this.clearStoredCurrentUser();
         this._currentUser.set(undefined);
         this.router.navigate(['']);
         o.next();
         o.complete();
      });
   }

   getCurrentUser() {
      return this._currentUser.asReadonly();
   }

   private storeCurrentUser(user: User) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
   }

   private getCurrentUserFromStorage(): User | undefined {
      const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
      return storedUser ? JSON.parse(storedUser) : undefined;
   }

   private clearStoredCurrentUser() {
      const x = localStorage.getItem(this.CURRENT_USER_KEY);
      console.log('removing: ', x);
      localStorage.removeItem(this.CURRENT_USER_KEY);
      const y = localStorage.getItem(this.CURRENT_USER_KEY);
      console.log('removed: ', y);
   }
}
