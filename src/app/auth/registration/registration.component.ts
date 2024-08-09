import { Component, signal } from '@angular/core';
import { RegService } from './reg.service';
import { of } from 'rxjs/internal/observable/of';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordComplexityDirective } from '../../shared/validators/password-complexity.directive';

@Component({
   selector: 'app-registration',
   standalone: true,
   imports: [
      RouterLink,
      FormsModule,
      CommonModule,
      PasswordComplexityDirective,
   ],
   templateUrl: './registration.component.html',
   styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
   public readonly email = signal('');
   public readonly username = signal('');
   public readonly password = signal('');
   public readonly confirmPassword = signal('');

   errorMessage = signal<string | null>(null);
   successMessage = signal<string | null>(null);

   constructor(
      private readonly regService: RegService,
      private readonly router: Router
   ) {}

   public register(form: NgForm) {
      console.log('register called');
      if (form.invalid) {
         this.errorMessage.set('Please fill in all required fields correctly.');
         return;
      }

      if (this.password() !== this.confirmPassword()) {
         this.errorMessage.set('Passwords do not match');
         return;
      }
      const registrationResult = this.regService
         .register(this.username(), this.password(), this.email())
         .pipe(
            tap((result: boolean) => {
               if (result) {
                  this.successMessage.set('Registration successful');
                  console.log(
                     'Registration successful for user: ',
                     this.username()
                  );
                  this.router.navigate(['login']);
               } else {
                  console.log('Registration failed');
                  this.router.navigate(['registration']);
               }
            }),
            catchError((error) => {
               this.errorMessage.set(
                  error.message || 'Registration failed. Please try again.'
               );
               return of(false);
            })
         )
         .subscribe();
   }
}
