import { Component, signal } from '@angular/core';
import {
   FormControl,
   FormGroup,
   FormsModule,
   ReactiveFormsModule,
   Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { NgClass } from '@angular/common';
import { tap } from 'rxjs/internal/operators/tap';
import { finalize } from 'rxjs/internal/operators/finalize';
import { catchError } from 'rxjs';

@Component({
   selector: 'app-login',
   standalone: true,
   imports: [FormsModule, NgClass, ReactiveFormsModule],
   templateUrl: './login.component.html',
   styleUrl: './login.component.scss',
})
export class LoginComponent {
   loginData = new FormGroup({
      username: new FormControl<string>('', Validators.required),
      password: new FormControl<string>('', Validators.required),
   });

   isLoading = signal<boolean>(false);
   errorMessage = signal<string | null>(null);

   constructor(private readonly authService: AuthService) {}

   login() {
      this.errorMessage.set(null);
      this.isLoading.set(true);

      if (this.loginData.invalid) {
         return;
      }
      const username = this.loginData.value.username;
      const password = this.loginData.value.password;

      if (username && password) {
         this.authService
            .login(username, password)
            .pipe(
               tap((result: boolean) => {
                  if (!result) {
                     this.errorMessage.set('Invalid username or password');
                  }
               }),

               catchError((error) => {
                  this.errorMessage.set('An error occurred. Please try again.');
                  throw error;
               }),
               finalize(() => this.isLoading.set(false))
            )
            .subscribe();
      }
   }
}
function of(arg0: null): any {
   throw new Error('Function not implemented.');
}
